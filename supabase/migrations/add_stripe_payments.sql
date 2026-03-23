-- Migration: Add Stripe Connect columns for HROP marketplace payments
-- Run this in Supabase SQL Editor

-- Add Stripe Connect columns to service_providers
ALTER TABLE public.service_providers
  ADD COLUMN IF NOT EXISTS stripe_account_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_onboarded BOOLEAN DEFAULT FALSE;

-- Add stripe_payment_intent_id to payments table
-- The existing stripe_payment_id column is renamed for clarity
ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT;

-- Add 'paid' status to jobs check constraint
-- Drop and recreate the constraint to include the new status
ALTER TABLE public.jobs DROP CONSTRAINT IF EXISTS jobs_status_check;
ALTER TABLE public.jobs ADD CONSTRAINT jobs_status_check
  CHECK (status IN ('available', 'accepted', 'in_progress', 'completed', 'cancelled', 'paid'));

-- Add 'captured' status to payments check constraint
ALTER TABLE public.payments DROP CONSTRAINT IF EXISTS payments_status_check;
ALTER TABLE public.payments ADD CONSTRAINT payments_status_check
  CHECK (status IN ('pending', 'completed', 'captured', 'failed', 'refunded'));

-- Index for Stripe lookups
CREATE INDEX IF NOT EXISTS idx_service_providers_stripe_account
  ON public.service_providers(stripe_account_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_intent
  ON public.payments(stripe_payment_intent_id);
