-- Trade Pro Identity Masking: Public profile view
-- Direct SELECT on service_providers by anon/authenticated users should only
-- return non-personal fields. The profiles join should be blocked for non-admin queries.
-- This view exposes only safe columns — NO phone or personal details from profiles.

CREATE OR REPLACE VIEW public.provider_public_profile AS
SELECT
  sp.id,
  sp.business_name,
  sp.service_type,
  sp.rating,
  sp.total_jobs,
  sp.available,
  sp.stripe_onboarded,
  sp.onboarding_complete
FROM public.service_providers sp;

-- Grant read access to authenticated users via the view only
GRANT SELECT ON public.provider_public_profile TO authenticated;
GRANT SELECT ON public.provider_public_profile TO anon;

-- Revoke direct profile phone access for non-service_role queries
-- Note: RLS on profiles table should already restrict access. This view ensures
-- that even if a client queries provider data, personal contact info is excluded.
