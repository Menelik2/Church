-- Operational workflows from ማኅተመ ክርስቶስ ህግና ደንብ

CREATE TABLE IF NOT EXISTS servants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  full_name_am TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  status TEXT NOT NULL DEFAULT 'applicant'
    CHECK (status IN ('applicant', 'active', 'suspended', 'inactive', 'rejected')),
  is_orthodox BOOLEAN DEFAULT false,
  completed_course BOOLEAN DEFAULT false,
  accepts_doctrine BOOLEAN DEFAULT false,
  respects_bylaws BOOLEAN DEFAULT false,
  proper_attire BOOLEAN DEFAULT false,
  has_confessor BOOLEAN DEFAULT false,
  pays_monthly BOOLEAN DEFAULT false,
  stage_service TEXT CHECK (stage_service IN ('timihirt', 'kine-tibeb', 'mezmur', NULL)),
  church_marriage BOOLEAN DEFAULT false,
  department_id UUID REFERENCES departments(id),
  joined_at DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS membership_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name_am TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  age INTEGER,
  is_orthodox BOOLEAN DEFAULT false,
  completed_course BOOLEAN DEFAULT false,
  accepts_doctrine BOOLEAN DEFAULT false,
  respects_bylaws BOOLEAN DEFAULT false,
  proper_attire BOOLEAN DEFAULT false,
  has_confessor BOOLEAN DEFAULT false,
  will_pay_monthly BOOLEAN DEFAULT false,
  preferred_stage TEXT,
  church_marriage BOOLEAN,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected', 'needs_info')),
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  review_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wedding_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  groom_name TEXT NOT NULL,
  bride_name TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT,
  wedding_date DATE NOT NULL,
  wedding_location TEXT,
  outside_bahir_dar BOOLEAN DEFAULT false,
  is_orthodox_both BOOLEAN DEFAULT false,
  parish_id_or_confessor BOOLEAN DEFAULT false,
  contract_signed BOOLEAN DEFAULT false,
  escort_count INTEGER DEFAULT 0,
  prepayment_birr NUMERIC(12,2) DEFAULT 0,
  address_program BOOLEAN DEFAULT false,
  is_church_servant BOOLEAN DEFAULT false,
  is_deacon BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'submitted'
    CHECK (status IN ('submitted', 'under_review', 'approved', 'rejected', 'cancelled', 'completed')),
  relations_dept_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS disciplinary_cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  servant_id UUID REFERENCES servants(id) ON DELETE SET NULL,
  servant_name TEXT NOT NULL,
  reason TEXT NOT NULL,
  step INTEGER NOT NULL DEFAULT 1 CHECK (step BETWEEN 1 AND 3),
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'resolved', 'suspended', 'dismissed')),
  department_slug TEXT,
  notes TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS meetings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_type TEXT NOT NULL
    CHECK (meeting_type IN ('general_assembly', 'advisory_board', 'executive', 'department', 'other')),
  title_am TEXT NOT NULL,
  agenda TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  location TEXT,
  quorum_met BOOLEAN,
  decisions TEXT,
  report_summary TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled'
    CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS department_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  period_year INTEGER NOT NULL,
  period_quarter INTEGER NOT NULL CHECK (period_quarter BETWEEN 1 AND 4),
  summary_am TEXT NOT NULL,
  activities TEXT,
  challenges TEXT,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'submitted', 'reviewed')),
  submitted_by UUID REFERENCES profiles(id),
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(department_id, period_year, period_quarter)
);

CREATE TABLE IF NOT EXISTS contributions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  servant_id UUID REFERENCES servants(id) ON DELETE CASCADE,
  amount_birr NUMERIC(12,2) NOT NULL,
  period_year INTEGER NOT NULL,
  period_month INTEGER NOT NULL CHECK (period_month BETWEEN 1 AND 12),
  paid_at DATE DEFAULT CURRENT_DATE,
  note TEXT,
  recorded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(servant_id, period_year, period_month)
);

ALTER TABLE servants ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE disciplinary_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public submit membership applications"
  ON membership_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Public submit wedding requests"
  ON wedding_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins manage servants" ON servants FOR ALL USING (public.is_admin());
CREATE POLICY "Admins manage membership applications" ON membership_applications FOR ALL USING (public.is_admin());
CREATE POLICY "Admins manage wedding requests" ON wedding_requests FOR ALL USING (public.is_admin());
CREATE POLICY "Admins manage disciplinary cases" ON disciplinary_cases FOR ALL USING (public.is_admin());
CREATE POLICY "Admins manage meetings" ON meetings FOR ALL USING (public.is_admin());
CREATE POLICY "Public read scheduled meetings" ON meetings FOR SELECT USING (status IN ('scheduled', 'completed'));
CREATE POLICY "Admins manage department reports" ON department_reports FOR ALL USING (public.is_admin());
CREATE POLICY "Admins manage contributions" ON contributions FOR ALL USING (public.is_admin());
