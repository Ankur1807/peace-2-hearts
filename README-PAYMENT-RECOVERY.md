# Payment Recovery System

## Overview
Robust webhook failure recovery system with manual reconciliation, scheduled backfill, and enhanced observability for Razorpay payment processing.

## Components

### 1. Enhanced verify-payment Function
- **Path**: `/functions/v1/verify-payment`
- **Purpose**: Primary webhook endpoint with structured logging
- **Features**:
  - JSON structured logs with fields: `{fn, event, order_id, payment_id, state, http_status, ts}`
  - Environment sanity check on startup
  - Constant-time signature verification
  - HTTP 200 responses for all expected states

### 2. Manual Reconciliation Function
- **Path**: `/functions/v1/reconcile-payment`
- **Purpose**: Admin-only manual payment reconciliation
- **Auth**: Requires `X-Internal-Auth` header with `ADMIN_RECONCILE_TOKEN`
- **Method**: `POST {"order_id": "order_XXXX"}`
- **Features**:
  - Calls Razorpay Orders API directly
  - Upserts to canonical `rzp_order_id` column
  - Updates consultation status
  - Returns structured response: `{reconciled: bool, status: string, payment_id?: string}`

### 3. Cron Reconciliation Function
- **Path**: `/functions/v1/cron-reconcile-missing`
- **Purpose**: Automated reconciliation every 5 minutes
- **Trigger**: Supabase pg_cron scheduled function
- **Logic**: Finds consultations created in last 90 minutes with `payment_status != 'paid'`
- **Features**:
  - Processes up to 50 candidates per run
  - Optional Slack notifications via `OBS_WEBHOOK_SLACK_URL`
  - Detailed logging and error handling

## Environment Variables

Required in both staging and production:

```bash
# Core
APP_ORIGIN=https://peace2hearts.com
SUPABASE_URL=https://mcbdxszoozmlelejvizn.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>

# Razorpay
RZP_KEY_ID=rzp_live_XXX (or rzp_test_XXX)
RZP_KEY_SECRET=<secret>
RZP_WEBHOOK_SECRET=<webhook_secret>

# Admin Auth
ADMIN_RECONCILE_TOKEN=<secure_token>

# Optional Observability
OBS_WEBHOOK_SLACK_URL=<slack_webhook_url>
```

## Webhook Configuration

### Razorpay Dashboard Setup
1. Go to **Settings → Webhooks**
2. Set URL: `https://mcbdxszoozmlelejvizn.supabase.co/functions/v1/verify-payment`
3. Events: `payment.captured`, `payment.failed`
4. Secret: Must match `RZP_WEBHOOK_SECRET`

### Verification Commands
```bash
# Test webhook endpoint accessibility
curl -i -X GET "https://mcbdxszoozmlelejvizn.supabase.co/functions/v1/verify-payment"
# Expected: HTTP/1.1 405, {"ok":false,"reason":"method_not_allowed"}

# Test payment-status endpoint
curl -i "https://mcbdxszoozmlelejvizn.supabase.co/functions/v1/payment-status?order_id=does_not_exist"
# Expected: HTTP/1.1 200, {"success":false,"status":"not_found"}
```

## Manual Reconciliation

### Usage
```bash
curl -s -i -X POST "https://mcbdxszoozmlelejvizn.supabase.co/functions/v1/reconcile-payment" \
  -H "Content-Type: application/json" \
  -H "X-Internal-Auth: ${ADMIN_RECONCILE_TOKEN}" \
  -d '{"order_id":"order_XXXXXXXXXXXX"}'
```

### Expected Responses
```json
// Payment captured
{"reconciled": true, "status": "captured", "payment_id": "pay_XXXX"}

// Payment pending
{"reconciled": false, "status": "pending"}

// Order not found
{"reconciled": false, "status": "not_found"}

// Database error
{"reconciled": false, "status": "error", "reason": "brief_description"}
```

## Cron Setup

### Supabase Scheduled Function
```sql
-- Enable extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule every 5 minutes
SELECT cron.schedule(
  'reconcile-missing-payments',
  '*/5 * * * *',
  $$
  SELECT net.http_post(
    url:='https://mcbdxszoozmlelejvizn.supabase.co/functions/v1/cron-reconcile-missing',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer <anon_key>"}'::jsonb,
    body:='{"scheduled": true}'::jsonb
  ) as request_id;
  $$
);
```

### GitHub Actions Alternative
```yaml
name: Payment Reconciliation
on:
  schedule:
    - cron: '*/5 * * * *'
jobs:
  reconcile:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Reconciliation
        run: |
          curl -X POST "${{ secrets.SUPABASE_URL }}/functions/v1/cron-reconcile-missing" \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_ANON_KEY }}" \
            -H "Content-Type: application/json" \
            -d '{"scheduled": true}'
```

## Frontend UX Improvements

### Enhanced Payment Status Hook
- **Jittered backoff**: Start 1.5s, cap at 6s
- **Extended polling**: Up to 2 minutes for `not_found` status
- **Gentle messaging**: "Still processing..." after 60s instead of error

### Status Handling
```javascript
// ✅ Correct: Show success only for captured
if (status === 'captured') {
  // Redirect to success page
}

// ✅ Correct: Show neutral message for processing states
if (status === 'pending_webhook' || status === 'not_found') {
  // Show "Processing payment..." message
  // Continue polling
}

// ✅ Correct: Show error only for actual failures
if (status === 'failed' || status === 'error') {
  // Show red error toast
}
```

## Observability

### Structured Logging
All functions log JSON with consistent fields:
```json
{
  "fn": "verify-payment|reconcile-payment|cron-reconcile-missing",
  "event": "request_received|webhook_event_parsed|reconcile_success",
  "order_id": "order_XXXX",
  "payment_id": "pay_XXXX", 
  "state": "captured|pending|failed",
  "http_status": 200,
  "ts": "2025-08-27T07:00:00.000Z"
}
```

### Slack Notifications
Cron sends hourly summaries to `OBS_WEBHOOK_SLACK_URL`:
```json
{
  "text": "Payment Reconciliation Summary",
  "blocks": [{
    "type": "section",
    "text": {
      "type": "mrkdwn", 
      "text": "*Payment Reconciliation Report*\n• Candidates: 5\n• Reconciled: 3\n• Errors: 0\n• Runtime: 1247ms"
    }
  }]
}
```

## Database Schema

### Canonical Column Usage
- **payments.rzp_order_id**: Primary lookup column (write/read)
- **consultations.order_id**: Maps to `payments.rzp_order_id`
- Both functions use consistent column mapping for alignment

### RLS Policies
Service role policies allow full access:
```sql
-- payments table
CREATE POLICY "payments_service_role_all" ON public.payments
FOR ALL USING ((auth.jwt() ->> 'role'::text) = 'service_role'::text);

-- consultations table  
CREATE POLICY "consultations_service_role_all" ON public.consultations
FOR ALL USING ((auth.jwt() ->> 'role'::text) = 'service_role'::text);
```

## Testing

### Unit Tests (Example)
```javascript
// verify-payment tests
test('returns 405 on GET', async () => {
  const response = await fetch('/functions/v1/verify-payment');
  expect(response.status).toBe(405);
});

test('returns pending_webhook on client POST', async () => {
  const response = await fetch('/functions/v1/verify-payment', {
    method: 'POST',
    body: JSON.stringify({razorpay_order_id: 'order_test'})
  });
  const data = await response.json();
  expect(data.reason).toBe('pending_webhook');
});
```

### Integration Test Flow
1. Create test consultation with `order_id`
2. Call `payment-status` → expect `not_found`
3. Send signed webhook to `verify-payment`
4. Poll `payment-status` until `captured`
5. Verify database: payment + consultation updated

## Troubleshooting

### Common Issues
1. **Webhook not received**
   - Check Razorpay webhook URL/secret
   - Verify function logs for signature errors
   - Use manual reconciliation as fallback

2. **Column alignment**
   - Verify `rzp_order_id` used consistently
   - Check `payment-status` query parameters

3. **RLS permissions**
   - Ensure service role policies exist
   - Test with: `select set_config('request.jwt.claims','{"role":"service_role"}', true);`

### Log Analysis
```bash
# Check recent webhook activity
supabase functions logs verify-payment --filter="webhook"

# Check reconciliation results  
supabase functions logs reconcile-payment --filter="reconciled"

# Monitor cron execution
supabase functions logs cron-reconcile-missing --filter="candidates"
```

## Security Considerations

1. **Admin authentication**: `ADMIN_RECONCILE_TOKEN` for manual reconciliation
2. **CORS restrictions**: Locked to `APP_ORIGIN`, no wildcards
3. **Constant-time comparison**: Prevents timing attacks on signatures
4. **Service role isolation**: Functions use service role, not anon key
5. **No secret logging**: Webhook secrets never logged or exposed

## Success Metrics

- **Webhook delivery rate**: Monitor via Razorpay dashboard
- **Reconciliation success**: Track via structured logs
- **User experience**: Reduced "stuck payment" support tickets
- **System reliability**: Automated recovery without manual intervention