-- Makhteme Kristos Sunday School - Initial Schema
-- PostgreSQL / Supabase

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

CREATE TYPE user_role AS ENUM (
  'super_admin',
  'admin',
  'editor',
  'department_manager',
  'member',
  'visitor'
);

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name_am TEXT,
  full_name_en TEXT,
  role user_role NOT NULL DEFAULT 'visitor',
  department_id UUID,
  avatar_url TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_number INTEGER NOT NULL UNIQUE,
  title_am TEXT NOT NULL,
  title_en TEXT,
  slug TEXT NOT NULL UNIQUE,
  content_am TEXT NOT NULL,
  content_en TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  title_am TEXT NOT NULL,
  title_en TEXT,
  slug TEXT NOT NULL,
  content_am TEXT NOT NULL,
  content_en TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(article_id, slug)
);

CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  title_am TEXT NOT NULL,
  title_en TEXT,
  description_am TEXT,
  description_en TEXT,
  responsibilities_am TEXT,
  responsibilities_en TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  title_am TEXT NOT NULL,
  title_en TEXT,
  description_am TEXT,
  description_en TEXT,
  order_index INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  version TEXT NOT NULL,
  revision_date TEXT,
  file_path TEXT,
  page_count INTEGER DEFAULT 26,
  is_current BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_am TEXT NOT NULL,
  title_en TEXT,
  slug TEXT NOT NULL UNIQUE,
  body_am TEXT NOT NULL,
  body_en TEXT,
  category TEXT,
  is_featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_am TEXT NOT NULL,
  title_en TEXT,
  slug TEXT NOT NULL UNIQUE,
  description_am TEXT,
  description_en TEXT,
  location TEXT,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_am TEXT,
  title_en TEXT,
  category TEXT NOT NULL,
  file_path TEXT NOT NULL,
  thumbnail_path TEXT,
  mime_type TEXT,
  size_bytes BIGINT,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  section_id UUID REFERENCES sections(id) ON DELETE SET NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, article_id, section_id)
);

CREATE TABLE reading_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  progress_percent NUMERIC(5,2) DEFAULT 0,
  last_position TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, article_id)
);

CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_articles_title_am ON articles USING gin (title_am gin_trgm_ops);
CREATE INDEX idx_articles_content_am ON articles USING gin (content_am gin_trgm_ops);
CREATE INDEX idx_sections_content_am ON sections USING gin (content_am gin_trgm_ops);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published articles"
  ON articles FOR SELECT USING (published = true);

CREATE POLICY "Public can read sections of published articles"
  ON sections FOR SELECT USING (
    EXISTS (SELECT 1 FROM articles a WHERE a.id = article_id AND a.published = true)
  );

CREATE POLICY "Public can read published departments"
  ON departments FOR SELECT USING (published = true);

CREATE POLICY "Public can read published programs"
  ON programs FOR SELECT USING (published = true);

CREATE POLICY "Public can read current documents"
  ON documents FOR SELECT USING (is_current = true OR status = 'published');

CREATE POLICY "Public can read published announcements"
  ON announcements FOR SELECT USING (published = true);

CREATE POLICY "Public can read published events"
  ON events FOR SELECT USING (published = true);

CREATE POLICY "Public can read published media"
  ON media FOR SELECT USING (published = true);

CREATE POLICY "Users manage own bookmarks"
  ON bookmarks FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own reading progress"
  ON reading_progress FOR ALL USING (auth.uid() = user_id);
