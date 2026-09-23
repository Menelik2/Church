-- Chairperson (ሰብሳቢ) operational tables — duties 1–19

-- Incoming/outgoing official letters (duty 5)
CREATE TABLE IF NOT EXISTS official_correspondence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  direction TEXT NOT NULL CHECK (direction IN ('incoming', 'outgoing')),
  subject_am TEXT NOT NULL,
  from_party TEXT,
  to_party TEXT,
  body_summary TEXT,
  received_at DATE DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'replied', 'routed', 'archived')),
  routed_to_dept TEXT,
  reply_note TEXT,
  recorded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chair approvals: finance sign-off, agenda, decisions (duties 2, 3, 14)
CREATE TABLE IF NOT EXISTS chair_approvals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  approval_type TEXT NOT NULL
    CHECK (approval_type IN ('finance_expense', 'agenda', 'decision', 'action_plan', 'other')),
  title_am TEXT NOT NULL,
  amount_birr NUMERIC(14,2),
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected')),
  decided_at TIMESTAMPTZ,
  decided_by UUID REFERENCES profiles(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Executive committee member discipline (duty 7.1–7.6)
CREATE TABLE IF NOT EXISTS executive_discipline (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_name_am TEXT NOT NULL,
  reason TEXT NOT NULL,
  step INTEGER NOT NULL DEFAULT 1 CHECK (step BETWEEN 1 AND 6),
  -- 1 counsel, 2 warning letter, 3 vote called, 4 suspended (2/3), 5 no majority, 6 letter issued
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'resolved', 'suspended', 'closed')),
  votes_for INTEGER,
  votes_against INTEGER,
  votes_total INTEGER,
  chair_casting_vote BOOLEAN DEFAULT false,
  letter_sent BOOLEAN DEFAULT false,
  notes TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Annual action plan tracking (duties 10–11)
CREATE TABLE IF NOT EXISTS annual_action_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  year INTEGER NOT NULL,
  title_am TEXT NOT NULL,
  summary TEXT,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'approved', 'in_progress', 'reviewed', 'completed')),
  approved_at TIMESTAMPTZ,
  review_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_corr_status ON official_correspondence(status);
CREATE INDEX IF NOT EXISTS idx_chair_appr_status ON chair_approvals(status);
CREATE INDEX IF NOT EXISTS idx_exec_disc_status ON executive_discipline(status);

ALTER TABLE official_correspondence ENABLE ROW LEVEL SECURITY;
ALTER TABLE chair_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE executive_discipline ENABLE ROW LEVEL SECURITY;
ALTER TABLE annual_action_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth_corr" ON official_correspondence FOR ALL
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_chair_appr" ON chair_approvals FOR ALL
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_exec_disc" ON executive_discipline FOR ALL
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_plans" ON annual_action_plans FOR ALL
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
