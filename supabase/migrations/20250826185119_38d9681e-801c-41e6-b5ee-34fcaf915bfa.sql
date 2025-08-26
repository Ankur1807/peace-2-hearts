-- Create payments table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  rzp_payment_id TEXT UNIQUE,
  rzp_order_id TEXT,
  amount INTEGER,
  currency TEXT DEFAULT 'INR',
  status TEXT CHECK (status IN ('created', 'authorized', 'captured', 'failed', 'refunded')),
  email TEXT,
  notes JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create index on rzp_order_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_payments_rzp_order_id ON public.payments(rzp_order_id);

-- Enable RLS on payments table
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_payments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER IF NOT EXISTS update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_payments_updated_at();

-- RLS Policy: Allow service role full access (for edge functions)
CREATE POLICY "Service role can manage payments" ON public.payments
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- RLS Policy: No public access - payments are managed server-side only
-- (No policies for anon/authenticated users - all access via service role)