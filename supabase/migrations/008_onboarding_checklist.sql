-- New-member onboarding checklist + mentor assignment (retention)

ALTER TABLE servants
  ADD COLUMN IF NOT EXISTS mentor_id UUID REFERENCES servants(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS onboarding_started_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_servants_mentor ON servants(mentor_id);
CREATE INDEX IF NOT EXISTS idx_servants_onboarding ON servants(onboarding_completed_at)
  WHERE onboarding_completed_at IS NULL AND status = 'active';

CREATE TABLE IF NOT EXISTS onboarding_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  servant_id UUID NOT NULL REFERENCES servants(id) ON DELETE CASCADE,
  step_key TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  updated_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (servant_id, step_key)
);

CREATE INDEX IF NOT EXISTS idx_onboarding_servant ON onboarding_progress(servant_id);

ALTER TABLE onboarding_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage onboarding_progress"
  ON onboarding_progress FOR ALL USING (public.is_admin());
