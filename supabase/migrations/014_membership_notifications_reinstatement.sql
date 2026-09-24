-- Article 14: permanent membership workflow enhancements
-- Notifications + reinstatement path for suspended servants

-- Allow reinstated status on servants
ALTER TABLE servants DROP CONSTRAINT IF EXISTS servants_status_check;
ALTER TABLE servants ADD CONSTRAINT servants_status_check
  CHECK (status IN ('applicant', 'active', 'suspended', 'inactive', 'rejected', 'reinstated'));

-- Optional admin review checklist columns (verified by oversight dept)
ALTER TABLE membership_applications
  ADD COLUMN IF NOT EXISTS admin_verified_orthodox BOOLEAN,
  ADD COLUMN IF NOT EXISTS admin_verified_course BOOLEAN,
  ADD COLUMN IF NOT EXISTS admin_verified_doctrine BOOLEAN,
  ADD COLUMN IF NOT EXISTS admin_verified_bylaws BOOLEAN,
  ADD COLUMN IF NOT EXISTS admin_verified_attire BOOLEAN,
  ADD COLUMN IF NOT EXISTS admin_verified_confessor BOOLEAN,
  ADD COLUMN IF NOT EXISTS admin_verified_monthly BOOLEAN,
  ADD COLUMN IF NOT EXISTS admin_verified_stage BOOLEAN,
  ADD COLUMN IF NOT EXISTS admin_verified_marriage BOOLEAN;

-- Status change / application notifications (shown in admin messages area)
CREATE TABLE IF NOT EXISTS membership_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES membership_applications(id) ON DELETE SET NULL,
  servant_id UUID REFERENCES servants(id) ON DELETE SET NULL,
  kind TEXT NOT NULL
    CHECK (kind IN ('application_submitted', 'approved', 'rejected', 'needs_info', 'suspended', 'reinstated')),
  title_am TEXT NOT NULL,
  body_am TEXT,
  recipient_name TEXT,
  recipient_phone TEXT,
  recipient_email TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE membership_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage membership notifications"
  ON membership_notifications FOR ALL USING (public.is_admin());

-- Public can insert only application_submitted (via form success path is admin-created; allow insert for form)
CREATE POLICY "Anyone insert application_submitted notification"
  ON membership_notifications FOR INSERT
  WITH CHECK (kind = 'application_submitted');
