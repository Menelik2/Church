-- Department workspaces: tasks, records, inventory, finance, media
-- Leadership roles + functional dept modules

CREATE TABLE IF NOT EXISTS department_roles (
  code TEXT PRIMARY KEY,
  title_am TEXT NOT NULL,
  title_en TEXT,
  is_leadership BOOLEAN DEFAULT false,
  order_index INT DEFAULT 0
);

INSERT INTO department_roles (code, title_am, title_en, is_leadership, order_index) VALUES
  ('sebabi', 'ሰብሳቢ', 'Chairperson', true, 1),
  ('vice-sebabi', 'ም/ሰብሳቢ', 'Vice Chairperson', true, 2),
  ('secretary', 'ፀሐፊ', 'Secretary', true, 3),
  ('timihirt', 'ትምህርት ክፍል', 'Education', false, 4),
  ('mezmur', 'መዝሙር ክፍል', 'Hymn', false, 5),
  ('kine-tibeb', 'ኪነጥበብ ክፍል', 'Arts', false, 6),
  ('hisab', 'ሒሳብ ክፍል', 'Finance', false, 7),
  ('hitsanat', 'ሕፃናት ክፍል', 'Children', false, 8),
  ('genegnet', 'ግንኙነት ክፍል', 'Relations', false, 9),
  ('kutator', 'ቁጥጥርና ክርስትያናዊ ህይወት ክትትል', 'Oversight', false, 10),
  ('limat', 'ልማትና በጎ አድራጎት ክፍል', 'Development', false, 11),
  ('media', 'ሚዲያ እና ዶክመንቴሽን ክፍል', 'Media', false, 12),
  ('nebrat', 'ንብረት ክፍል', 'Property', false, 13)
ON CONFLICT (code) DO NOTHING;

CREATE TABLE IF NOT EXISTS department_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  department_code TEXT NOT NULL REFERENCES department_roles(code),
  title_am TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'done', 'cancelled')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high')),
  due_date DATE,
  assigned_to UUID REFERENCES profiles(id),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS department_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  department_code TEXT NOT NULL REFERENCES department_roles(code),
  record_type TEXT NOT NULL,
  title_am TEXT NOT NULL,
  body TEXT,
  record_date DATE DEFAULT CURRENT_DATE,
  meta JSONB DEFAULT '{}',
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS finance_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entry_type TEXT NOT NULL CHECK (entry_type IN ('income', 'expense')),
  category TEXT NOT NULL,
  amount_birr NUMERIC(12,2) NOT NULL,
  description_am TEXT,
  entry_date DATE DEFAULT CURRENT_DATE,
  servant_id UUID REFERENCES servants(id),
  recorded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS property_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_am TEXT NOT NULL,
  category TEXT,
  quantity INT DEFAULT 1,
  condition TEXT DEFAULT 'good' CHECK (condition IN ('good', 'fair', 'poor', 'lost')),
  location TEXT,
  notes TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS education_classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_am TEXT NOT NULL,
  level_am TEXT,
  schedule_note TEXT,
  teacher_name TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS class_attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID REFERENCES education_classes(id) ON DELETE CASCADE,
  attendance_date DATE DEFAULT CURRENT_DATE,
  present_count INT DEFAULT 0,
  notes TEXT,
  recorded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS media_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_am TEXT NOT NULL,
  media_type TEXT CHECK (media_type IN ('photo', 'video', 'audio', 'document')),
  event_name TEXT,
  storage_url TEXT,
  notes TEXT,
  recorded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS charity_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_am TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'active', 'completed', 'cancelled')),
  budget_birr NUMERIC(12,2),
  beneficiaries TEXT,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE department_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE education_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE charity_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "roles_read_all" ON department_roles FOR SELECT USING (true);
CREATE POLICY "dept_tasks_auth" ON department_tasks FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "dept_records_auth" ON department_records FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "finance_auth" ON finance_entries FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "property_auth" ON property_items FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "classes_auth" ON education_classes FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "attendance_auth" ON class_attendance FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "media_auth" ON media_logs FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "charity_auth" ON charity_projects FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
