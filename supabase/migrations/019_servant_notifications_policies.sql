-- Servant / membership notifications: ensure admins can fully manage

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

DROP POLICY IF EXISTS "Admins manage membership notifications" ON membership_notifications;
CREATE POLICY "Admins manage membership notifications"
  ON membership_notifications
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Anyone insert application_submitted notification" ON membership_notifications;
CREATE POLICY "Anyone insert application_submitted notification"
  ON membership_notifications
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (kind = 'application_submitted');

-- Admins need insert for suspended/reinstated/approved from client
GRANT SELECT, INSERT, UPDATE ON TABLE membership_notifications TO authenticated;
GRANT INSERT ON TABLE membership_notifications TO anon;
