-- Allow owners and authorized roles to update video_uploads after processing
CREATE POLICY "Users can update their own uploads"
ON public.video_uploads
FOR UPDATE
USING (auth.uid() = uploaded_by)
WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Admins and security can update uploads"
ON public.video_uploads
FOR UPDATE
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'security')
);