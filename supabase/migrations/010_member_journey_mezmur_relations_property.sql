-- Member journey + mezmur roster/assets + relations register + property checkout

-- 1) Journey stage on servants
ALTER TABLE servants
  ADD COLUMN IF NOT EXISTS journey_stage TEXT DEFAULT 'registered'
    CHECK (journey_stage IN ('visitor', 'registered', 'course', 'servant'));

CREATE INDEX IF NOT EXISTS idx_servants_journey ON servants(journey_stage);

-- Visitors (pre-registration)
CREATE TABLE IF NOT EXISTS visitors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name_am TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  first_visit_date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'converted', 'inactive')),
  converted_servant_id UUID REFERENCES servants(id) ON DELETE SET NULL,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS journey_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_type TEXT NOT NULL CHECK (subject_type IN ('visitor', 'servant')),
  subject_id UUID NOT NULL,
  from_stage TEXT,
  to_stage TEXT NOT NULL,
  note TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS course_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  servant_id UUID REFERENCES servants(id) ON DELETE CASCADE,
  visitor_id UUID REFERENCES visitors(id) ON DELETE SET NULL,
  full_name_am TEXT NOT NULL,
  course_name TEXT NOT NULL DEFAULT 'ተከታታይ ትምህርት',
  status TEXT NOT NULL DEFAULT 'enrolled'
    CHECK (status IN ('enrolled', 'completed', 'dropped')),
  started_at DATE DEFAULT CURRENT_DATE,
  completed_at DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_course_enrollments_servant ON course_enrollments(servant_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_status ON course_enrollments(status);

-- 2) Mezmur: roster, rehearsals, assets (instrument / costume)
CREATE TABLE IF NOT EXISTS mezmur_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  servant_id UUID REFERENCES servants(id) ON DELETE SET NULL,
  full_name_am TEXT NOT NULL,
  voice_part TEXT,
  is_active BOOLEAN DEFAULT true,
  joined_at DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mezmur_rehearsals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rehearsal_date DATE NOT NULL DEFAULT CURRENT_DATE,
  location TEXT,
  notes TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mezmur_rehearsal_attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rehearsal_id UUID NOT NULL REFERENCES mezmur_rehearsals(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES mezmur_members(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'present'
    CHECK (status IN ('present', 'absent', 'excused')),
  UNIQUE (rehearsal_id, member_id)
);

CREATE TABLE IF NOT EXISTS mezmur_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_type TEXT NOT NULL CHECK (asset_type IN ('instrument', 'costume')),
  name_am TEXT NOT NULL,
  quantity INT DEFAULT 1,
  condition TEXT DEFAULT 'good',
  assigned_member_id UUID REFERENCES mezmur_members(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3) Relations: new-member register
CREATE TABLE IF NOT EXISTS new_member_register (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name_am TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  registered_at DATE DEFAULT CURRENT_DATE,
  application_id UUID REFERENCES membership_applications(id) ON DELETE SET NULL,
  servant_id UUID REFERENCES servants(id) ON DELETE SET NULL,
  course_enrollment_id UUID REFERENCES course_enrollments(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'registered'
    CHECK (status IN ('registered', 'in_course', 'graduated', 'inactive')),
  notes TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4) Property checkout (ውሰት)
CREATE TABLE IF NOT EXISTS property_checkouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id UUID NOT NULL REFERENCES property_items(id) ON DELETE RESTRICT,
  borrower_name TEXT NOT NULL,
  servant_id UUID REFERENCES servants(id) ON DELETE SET NULL,
  quantity INT NOT NULL DEFAULT 1,
  purpose TEXT,
  checked_out_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  due_date DATE,
  returned_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'out'
    CHECK (status IN ('out', 'returned', 'lost')),
  notes TEXT,
  recorded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_property_checkouts_status ON property_checkouts(status);
CREATE INDEX IF NOT EXISTS idx_property_checkouts_item ON property_checkouts(item_id);

-- RLS
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE journey_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE mezmur_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE mezmur_rehearsals ENABLE ROW LEVEL SECURITY;
ALTER TABLE mezmur_rehearsal_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE mezmur_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE new_member_register ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_checkouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth_visitors" ON visitors FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_journey" ON journey_events FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_courses" ON course_enrollments FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_mezmur_m" ON mezmur_members FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_mezmur_r" ON mezmur_rehearsals FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_mezmur_a" ON mezmur_rehearsal_attendance FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_mezmur_assets" ON mezmur_assets FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_nmr" ON new_member_register FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_checkout" ON property_checkouts FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
