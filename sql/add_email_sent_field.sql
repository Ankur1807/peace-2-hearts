
-- Add email_sent field to payments table
ALTER TABLE IF EXISTS public.payments 
ADD COLUMN IF NOT EXISTS email_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS recovery_timestamp TIMESTAMP WITH TIME ZONE;

-- Add index for faster lookups of payments without emails
CREATE INDEX IF NOT EXISTS idx_payments_email_sent ON public.payments (email_sent) WHERE email_sent = FALSE;
