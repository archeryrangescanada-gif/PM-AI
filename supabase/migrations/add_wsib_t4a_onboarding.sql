-- Migration: Add WSIB verification, T4A tracking, and Trade Pro onboarding columns
-- Run date: 2026-03-23
-- Note: Already applied to production via Management API

ALTER TABLE public.service_providers
  ADD COLUMN IF NOT EXISTS wsib_clearance_number TEXT,
  ADD COLUMN IF NOT EXISTS wsib_clearance_verified BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS wsib_clearance_expiry DATE,
  ADD COLUMN IF NOT EXISTS wsib_last_verified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS insurance_certificate_url TEXT,
  ADD COLUMN IF NOT EXISTS insurance_expiry DATE,
  ADD COLUMN IF NOT EXISTS background_check_status TEXT DEFAULT 'pending' CHECK (background_check_status IN ('pending', 'submitted', 'passed', 'failed')),
  ADD COLUMN IF NOT EXISTS background_check_date DATE,
  ADD COLUMN IF NOT EXISTS trade_licence_type TEXT,
  ADD COLUMN IF NOT EXISTS trade_licence_number TEXT,
  ADD COLUMN IF NOT EXISTS trade_licence_verified BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS onboarding_complete BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS onboarding_step TEXT DEFAULT 'profile';

ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS tax_year INTEGER,
  ADD COLUMN IF NOT EXISTS t4a_eligible BOOLEAN DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_payments_tax_year ON public.payments(tax_year);
CREATE INDEX IF NOT EXISTS idx_service_providers_wsib ON public.service_providers(wsib_clearance_verified);
CREATE INDEX IF NOT EXISTS idx_service_providers_onboarding ON public.service_providers(onboarding_complete);
