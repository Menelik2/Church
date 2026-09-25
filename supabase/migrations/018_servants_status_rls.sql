-- Servants registry: status values + admin access

ALTER TABLE servants DROP CONSTRAINT IF EXISTS servants_status_check;
ALTER TABLE servants ADD CONSTRAINT servants_status_check
  CHECK (status IN ('applicant', 'active', 'suspended', 'inactive', 'rejected', 'reinstated'));

-- Ensure updated_at exists
ALTER TABLE servants ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- RLS: admins full access
ALTER TABLE servants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage servants" ON servants;
CREATE POLICY "Admins manage servants"
  ON servants
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

GRANT SELECT, INSERT, UPDATE ON TABLE servants TO authenticated;
