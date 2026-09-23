-- Per-servant attendance for retention (missed 2 weeks alerts)

CREATE TABLE IF NOT EXISTS servant_attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  servant_id UUID NOT NULL REFERENCES servants(id) ON DELETE CASCADE,
  attendance_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'present'
    CHECK (status IN ('present', 'absent', 'excused')),
  gathering_type TEXT DEFAULT 'regular'
    CHECK (gathering_type IN ('regular', 'class', 'special', 'other')),
  notes TEXT,
  recorded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (servant_id, attendance_date, gathering_type)
);

CREATE INDEX IF NOT EXISTS idx_servant_attendance_date
  ON servant_attendance (attendance_date DESC);
CREATE INDEX IF NOT EXISTS idx_servant_attendance_servant
  ON servant_attendance (servant_id, attendance_date DESC);
CREATE INDEX IF NOT EXISTS idx_servant_attendance_present
  ON servant_attendance (servant_id, attendance_date DESC)
  WHERE status = 'present';

ALTER TABLE servant_attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage servant_attendance"
  ON servant_attendance FOR ALL USING (public.is_admin());
