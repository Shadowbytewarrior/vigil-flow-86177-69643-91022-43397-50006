-- Fix security definer view issue
-- Drop and recreate the view as SECURITY INVOKER (safer approach)

DROP VIEW IF EXISTS public.cameras_public;

-- Create view with SECURITY INVOKER to use querying user's permissions
CREATE OR REPLACE VIEW public.cameras_public 
WITH (security_invoker=true) AS
SELECT 
  id,
  name,
  location,
  camera_type,
  status,
  coverage_area,
  floor,
  building,
  latitude,
  longitude,
  created_at,
  updated_at
  -- Deliberately excluding: rtsp_url (contains credentials)
FROM public.cameras;

-- Update comment
COMMENT ON VIEW public.cameras_public IS 'Public view of cameras that excludes sensitive RTSP credentials. Uses SECURITY INVOKER for safer permission handling. All authenticated users can view this. Full camera access with credentials is restricted to admin and security roles only.';