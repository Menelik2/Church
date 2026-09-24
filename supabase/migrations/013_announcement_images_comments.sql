-- Announcement images + moderated comments

ALTER TABLE announcements
  ADD COLUMN IF NOT EXISTS image_url TEXT;

CREATE TABLE IF NOT EXISTS announcement_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  announcement_id UUID NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_email TEXT,
  body TEXT NOT NULL,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_announcement_comments_ann
  ON announcement_comments (announcement_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_announcement_comments_pending
  ON announcement_comments (is_approved, created_at DESC)
  WHERE is_approved = false;

ALTER TABLE announcement_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read approved comments" ON announcement_comments;
CREATE POLICY "Public read approved comments"
  ON announcement_comments FOR SELECT
  USING (is_approved = true);

DROP POLICY IF EXISTS "Anyone can submit comment" ON announcement_comments;
CREATE POLICY "Anyone can submit comment"
  ON announcement_comments FOR INSERT
  WITH CHECK (
    length(trim(author_name)) >= 2
    AND length(trim(body)) >= 2
    AND length(trim(body)) <= 2000
  );

DROP POLICY IF EXISTS "Admins manage comments" ON announcement_comments;
CREATE POLICY "Admins manage comments"
  ON announcement_comments FOR ALL
  USING (public.is_admin());

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'announcement-images',
  'announcement-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read announcement images" ON storage.objects;
CREATE POLICY "Public read announcement images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'announcement-images');

DROP POLICY IF EXISTS "Admins upload announcement images" ON storage.objects;
CREATE POLICY "Admins upload announcement images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'announcement-images' AND public.is_admin());

DROP POLICY IF EXISTS "Admins update announcement images" ON storage.objects;
CREATE POLICY "Admins update announcement images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'announcement-images' AND public.is_admin());

DROP POLICY IF EXISTS "Admins delete announcement images" ON storage.objects;
CREATE POLICY "Admins delete announcement images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'announcement-images' AND public.is_admin());
