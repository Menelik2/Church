-- 016: Complete department (ክፍሎች) database — all tables + RLS
-- Safe to re-run. Run in Supabase SQL Editor after 001–015.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS department_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  title_am TEXT NOT NULL,
  title_en TEXT,
  is_leadership BOOLEAN DEFAULT false,
  order_index INT DEFAULT 0
);

INSERT INTO department_roles (code, title_am, title_en, is_leadership, order_index) VALUES
  ('sebabi', 'ሰብሳቢ', 'Chairperson', true, 1),
  ('vice-sebabi', 'ምክትል ሰብሳቢ', 'Vice Chairperson', true, 2),
  ('secretary', 'ፀሐፊ', 'Secretary', true, 3),
  ('kine-tibeb', 'ኪነ ጥበብ', 'Arts', false, 4),
  ('hisab', 'ሒሳብ', 'Finance', false, 5),
  ('timihirt', 'ትምህርት', 'Education', false, 6),
  ('kutator', 'ቁጥጥርና ክርስትያናዊ ሕይወት ክትትል', 'Oversight', false, 7),
  ('mezmur', 'መዝሙር', 'Hymn / Music', false, 8),
  ('limat', 'ልማትና በጎ አድራጎት', 'Development & Charity', false, 9),
  ('hitsanat', 'ሕፃናት', 'Children', false, 10),
  ('genegnet', 'ግንኙነት', 'Relations', false, 11),
  ('media', 'ሚዲያና ዶክመንቴሽን', 'Media', false, 12),
  ('nebrat', 'ንብረት', 'Property', false, 13)
ON CONFLICT (code) DO NOTHING;

CREATE TABLE IF NOT EXISTS department_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_code TEXT NOT NULL,
  title_am TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'in_progress', 'done', 'cancelled')),
  priority TEXT DEFAULT 'normal'
    CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  due_date DATE,
  assigned_to UUID,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_dept_tasks_code ON department_tasks (department_code, created_at DESC);

CREATE TABLE IF NOT EXISTS department_finance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_code TEXT NOT NULL,
  entry_type TEXT NOT NULL CHECK (entry_type IN ('income', 'expense')),
  category TEXT,
  amount_birr NUMERIC(12, 2) NOT NULL DEFAULT 0,
  description_am TEXT,
  entry_date DATE DEFAULT CURRENT_DATE,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_dept_finance_code ON department_finance (department_code, entry_date DESC);

CREATE TABLE IF NOT EXISTS department_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_code TEXT NOT NULL,
  name_am TEXT NOT NULL,
  category TEXT,
  quantity INT NOT NULL DEFAULT 1,
  condition TEXT DEFAULT 'good'
    CHECK (condition IN ('good', 'fair', 'poor', 'lost')),
  location TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_dept_inv_code ON department_inventory (department_code, name_am);

CREATE TABLE IF NOT EXISTS department_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_code TEXT NOT NULL,
  record_type TEXT NOT NULL DEFAULT 'note',
  title_am TEXT NOT NULL,
  body TEXT,
  record_date DATE DEFAULT CURRENT_DATE,
  meta JSONB DEFAULT '{}'::jsonb,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_dept_rec_code ON department_records (department_code, record_date DESC);
CREATE INDEX IF NOT EXISTS idx_dept_rec_type ON department_records (department_code, record_type);

CREATE TABLE IF NOT EXISTS property_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_am TEXT NOT NULL,
  category TEXT,
  quantity INT DEFAULT 1,
  condition TEXT DEFAULT 'good',
  location TEXT,
  notes TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS property_checkouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES property_items(id) ON DELETE RESTRICT,
  borrower_name TEXT NOT NULL,
  servant_id UUID,
  quantity INT NOT NULL DEFAULT 1,
  purpose TEXT,
  checked_out_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  due_date DATE,
  returned_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'out'
    CHECK (status IN ('out', 'returned', 'lost')),
  notes TEXT,
  recorded_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS education_classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_am TEXT NOT NULL,
  level_am TEXT,
  schedule_note TEXT,
  teacher_name TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS class_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES education_classes(id) ON DELETE CASCADE,
  attendance_date DATE DEFAULT CURRENT_DATE,
  present_count INT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS media_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_am TEXT NOT NULL,
  media_type TEXT DEFAULT 'photo',
  log_date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS charity_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_am TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  budget_birr NUMERIC(12,2),
  description_am TEXT,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mezmur_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name_am TEXT NOT NULL,
  phone TEXT,
  voice_part TEXT,
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mezmur_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_am TEXT NOT NULL,
  asset_type TEXT,
  quantity INT DEFAULT 1,
  condition TEXT DEFAULT 'good',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mezmur_songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_am TEXT NOT NULL,
  category TEXT,
  lyrics_note TEXT,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mezmur_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_type TEXT,
  service_date DATE DEFAULT CURRENT_DATE,
  location_note TEXT,
  songs_note TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mezmur_rehearsals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rehearsal_date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mezmur_rehearsal_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rehearsal_id UUID REFERENCES mezmur_rehearsals(id) ON DELETE CASCADE,
  member_id UUID REFERENCES mezmur_members(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'present',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS new_member_register (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name_am TEXT NOT NULL,
  phone TEXT,
  registered_at DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'new',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name_am TEXT NOT NULL,
  course_name TEXT,
  phone TEXT,
  status TEXT DEFAULT 'enrolled',
  enrolled_at DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS children_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_am TEXT NOT NULL,
  age_range TEXT,
  teacher_name TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS children_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES children_groups(id) ON DELETE SET NULL,
  activity_type TEXT DEFAULT 'lesson',
  title_am TEXT NOT NULL,
  activity_date DATE DEFAULT CURRENT_DATE,
  present_count INT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS arts_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_am TEXT NOT NULL,
  event_type TEXT DEFAULT 'performance',
  event_date DATE,
  status TEXT NOT NULL DEFAULT 'planned'
    CHECK (status IN ('planned', 'rehearsing', 'done', 'cancelled')),
  participants_note TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS official_correspondence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_am TEXT NOT NULL,
  direction TEXT DEFAULT 'out',
  correspondent TEXT,
  letter_date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'open',
  body TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chair_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_am TEXT NOT NULL,
  requested_by TEXT,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS executive_discipline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_name TEXT NOT NULL,
  issue_summary TEXT,
  status TEXT DEFAULT 'open',
  decided_at DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS annual_action_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_am TEXT NOT NULL,
  year_label TEXT,
  status TEXT DEFAULT 'draft',
  body TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS disciplinary_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_slug TEXT DEFAULT 'kutator',
  subject_name TEXT NOT NULL,
  case_summary TEXT,
  status TEXT DEFAULT 'open',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'department_tasks','department_finance','department_inventory','department_records',
    'property_items','property_checkouts',
    'education_classes','class_attendance',
    'media_logs','charity_projects',
    'mezmur_members','mezmur_assets','mezmur_songs','mezmur_services',
    'mezmur_rehearsals','mezmur_rehearsal_attendance',
    'new_member_register','course_enrollments',
    'children_groups','children_activities',
    'arts_events',
    'official_correspondence','chair_approvals','executive_discipline','annual_action_plans',
    'disciplinary_cases'
  ]
  LOOP
    EXECUTE format('ALTER TABLE IF EXISTS %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', 'dept_all_' || t, t);
    EXECUTE format(
      'CREATE POLICY %I ON %I FOR ALL TO authenticated USING (true) WITH CHECK (true)',
      'dept_all_' || t, t
    );
  END LOOP;
END $$;

SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'department_tasks','department_finance','department_inventory','department_records',
    'property_items','property_checkouts','education_classes','class_attendance',
    'media_logs','charity_projects','mezmur_members','mezmur_assets','mezmur_songs',
    'mezmur_services','new_member_register','course_enrollments',
    'children_groups','children_activities','arts_events',
    'official_correspondence','chair_approvals','executive_discipline','annual_action_plans',
    'disciplinary_cases'
  )
ORDER BY table_name;
