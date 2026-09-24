-- Fix announcement-images bucket + storage policies
-- Safe to re-run. Paste into Supabase SQL Editor if migrations are not applied.

-- 1) Ensure image_url column exists
ALTER TABLE public.announcements
  ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 2) Create public bucket (5MB, images only)
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

-- 3) Drop old policies (names from 013)
DROP POLICY IF EXISTS "Public read announcement images" ON storage.objects;
DROP POLICY IF EXISTS "Admins upload announcement images" ON storage.objects;
DROP POLICY IF EXISTS "Admins update announcement images" ON storage.objects;
DROP POLICY IF EXISTS "Admins delete announcement images" ON storage.objects;
DROP POLICY IF EXISTS "announcement images public read" ON storage.objects;
DROP POLICY IF EXISTS "announcement images auth insert" ON storage.objects;
DROP POLICY IF EXISTS "announcement images auth update" ON storage.objects;
DROP POLICY IF EXISTS "announcement images auth delete" ON storage.objects;

-- 4) Public can READ (required for getPublicUrl on public bucket pages)
CREATE POLICY "announcement images public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'announcement-images');

-- 5) Logged-in staff can UPLOAD / UPDATE / DELETE
-- Uses auth.role() so it works even if is_admin() is missing in storage context
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
