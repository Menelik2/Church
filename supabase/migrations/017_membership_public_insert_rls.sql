-- Fix: public membership form was blocked by RLS
-- Error: new row violates row-level security policy for table "membership_applications"

-- Grants for anon (website visitors) and authenticated users
GRANT INSERT ON TABLE membership_applications TO anon, authenticated;
GRANT INSERT ON TABLE membership_notifications TO anon, authenticated;

-- Re-create public insert policies (idempotent)
DROP POLICY IF EXISTS "Public submit membership applications" ON membership_applications;
CREATE POLICY "Public submit membership applications"
  ON membership_applications
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow RETURNING after insert so PostgREST .insert().select() works for submitters
DROP POLICY IF EXISTS "Public select own submitted applications" ON membership_applications;
CREATE POLICY "Public select own submitted applications"
  ON membership_applications
  FOR SELECT
  TO anon, authenticated
  USING (status = 'pending');

-- Notifications: public may insert application_submitted only
DROP POLICY IF EXISTS "Anyone insert application_submitted notification" ON membership_notifications;
CREATE POLICY "Anyone insert application_submitted notification"
  ON membership_notifications
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (kind = 'application_submitted');

-- Keep admin full access (re-assert)
DROP POLICY IF EXISTS "Admins manage membership applications" ON membership_applications;
CREATE POLICY "Admins manage membership applications"
  ON membership_applications
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins manage membership notifications" ON membership_notifications;
CREATE POLICY "Admins manage membership notifications"
  ON membership_notifications
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
