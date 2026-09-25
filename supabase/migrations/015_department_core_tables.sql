-- Ensure department workspace core tables exist
-- App uses: department_tasks, department_finance, department_inventory, department_records
-- Safe to re-run (IF NOT EXISTS).

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
  ('kutator', 'ቁጥጥርና ክርስትያናዊ ሕይወት ክትትል', 'Oversight & Christian Life', false, 7),
  ('mezmur', 'መዝሙር', 'Hymn / Music', false, 8),
  ('limat', 'ልማትና በጎ አድራጎት', 'Development & Charity', false, 9),
  ('hitsanat', 'ሕፃናት', 'Children', false, 10),
  ('genegnet', 'ግንኙነት', 'Relations', false, 11),
  ('media', 'ሚዲያና ዶክመንቴሽን', 'Media & Documentation', false, 12),
  ('nebrat', 'ንብረት', 'Property', false, 13)
ON CONFLICT (code) DO NOTHING;

-- 1) department_tasks
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

CREATE INDEX IF NOT EXISTS idx_department_tasks_code
  ON department_tasks (department_code, created_at DESC);

-- 2) department_finance
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

CREATE INDEX IF NOT EXISTS idx_department_finance_code
  ON department_finance (department_code, entry_date DESC);

-- 3) department_inventory
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

CREATE INDEX IF NOT EXISTS idx_department_inventory_code
  ON department_inventory (department_code, name_am);

-- 4) department_records
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

CREATE INDEX IF NOT EXISTS idx_department_records_code
  ON department_records (department_code, record_date DESC);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'department_records'
      AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE department_records ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

ALTER TABLE department_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_finance ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "dept_tasks_auth" ON department_tasks;
DROP POLICY IF EXISTS "dept_tasks_all" ON department_tasks;
CREATE POLICY "dept_tasks_all" ON department_tasks
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "dept_finance_all" ON department_finance;
CREATE POLICY "dept_finance_all" ON department_finance
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "dept_inventory_all" ON department_inventory;
CREATE POLICY "dept_inventory_all" ON department_inventory
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "dept_records_auth" ON department_records;
DROP POLICY IF EXISTS "dept_records_all" ON department_records;
CREATE POLICY "dept_records_all" ON department_records
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);
