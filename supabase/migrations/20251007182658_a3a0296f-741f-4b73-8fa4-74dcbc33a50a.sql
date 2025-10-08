-- Fix camera security issue: Restrict RTSP URL access to authorized personnel only

-- Drop the overly permissive policy that allows all authenticated users to view sensitive camera data
DROP POLICY IF EXISTS "Authenticated users can view cameras" ON public.cameras;

-- Create a secure view that exposes camera information WITHOUT sensitive credentials
CREATE OR REPLACE VIEW public.cameras_public AS
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

-- Grant read access on the public view to authenticated users
GRANT SELECT ON public.cameras_public TO authenticated;

-- Add a policy for the view (though views inherit some RLS behavior)
-- This ensures authenticated users can read the safe view
CREATE POLICY "Authenticated users can view public camera info"
ON public.cameras
FOR SELECT
TO authenticated
USING (
  -- Only allow viewing non-sensitive fields through application logic
  -- The view handles the actual field filtering
  false
);

-- The existing "Admins and security can manage cameras" policy already provides
-- full access (including rtsp_url) to authorized personnel, so we keep that

-- Add explicit SELECT policy for admins and security to view full camera details including credentials
CREATE POLICY "Admins and security can view all camera details including credentials"
ON public.cameras
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'security'::app_role)
);

-- Add comment explaining the security model
COMMENT ON VIEW public.cameras_public IS 'Public view of cameras that excludes sensitive RTSP credentials. All authenticated users can view this. Full camera access with credentials is restricted to admin and security roles only.';