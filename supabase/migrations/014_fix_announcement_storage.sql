-- Fix announcement-images bucket + storage policies
-- Safe to re-run.

ALTER TABLE public.announcements
  ADD COLUMN IF NOT EXISTS image_url TEXT;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'announcement-images',
  'announcement-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

DROP POLICY IF EXISTS "Public read announcement images" ON storage.objects;
DROP POLICY IF EXISTS "Admins upload announcement images" ON storage.objects;
DROP POLICY IF EXISTS "Admins update announcement images" ON storage.objects;
DROP POLICY IF EXISTS "Admins delete announcement images" ON storage.objects;
DROP POLICY IF EXISTS "announcement images public read" ON storage.objects;
DROP POLICY IF EXISTS "announcement images auth insert" ON storage.objects;
DROP POLICY IF EXISTS "announcement images auth update" ON storage.objects;
DROP POLICY IF EXISTS "announcement images auth delete" ON storage.objects;

CREATE POLICY "announcement images public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'announcement-images');

CREATE POLICY "announcement images auth insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'announcement-images');

CREATE POLICY "announcement images auth update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'announcement-images')
  WITH CHECK (bucket_id = 'announcement-images');

CREATE POLICY "announcement images auth delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'announcement-images');
