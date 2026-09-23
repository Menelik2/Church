-- Admin RLS helpers and policies
-- Run after 001_initial_schema.sql

CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT role FROM profiles WHERE id = auth.uid()),
    'visitor'::user_role
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.get_user_role() IN ('super_admin', 'admin', 'editor');
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.get_user_role() = 'super_admin';
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name_en, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'visitor'
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile (limited)"
  ON profiles FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can manage profiles"
  ON profiles FOR ALL USING (public.is_super_admin());

CREATE POLICY "Admins can insert articles"
  ON articles FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update articles"
  ON articles FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete articles"
  ON articles FOR DELETE USING (public.is_super_admin());

CREATE POLICY "Admins manage sections"
  ON sections FOR ALL USING (public.is_admin());

CREATE POLICY "Admins manage departments"
  ON departments FOR ALL USING (public.is_admin());

CREATE POLICY "Admins manage programs"
  ON programs FOR ALL USING (public.is_admin());

CREATE POLICY "Admins manage documents"
  ON documents FOR ALL USING (public.is_admin());

CREATE POLICY "Admins manage announcements"
  ON announcements FOR ALL USING (public.is_admin());

CREATE POLICY "Admins manage events"
  ON events FOR ALL USING (public.is_admin());

CREATE POLICY "Admins manage media"
  ON media FOR ALL USING (public.is_admin());

CREATE POLICY "Anyone can submit contact message"
  ON contact_messages FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins read contact messages"
  ON contact_messages FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins update contact messages"
  ON contact_messages FOR UPDATE USING (public.is_admin());

CREATE POLICY "Public can read site settings"
  ON site_settings FOR SELECT USING (true);

CREATE POLICY "Admins manage site settings"
  ON site_settings FOR ALL USING (public.is_admin());

CREATE POLICY "Admins read audit logs"
  ON audit_logs FOR SELECT USING (public.is_admin());

CREATE POLICY "System can insert audit logs"
  ON audit_logs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'profiles', 'articles', 'sections', 'departments', 'programs',
    'documents', 'announcements', 'events', 'site_settings'
  ]
  LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS set_updated_at ON %I; CREATE TRIGGER set_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();',
      t, t
    );
  END LOOP;
END;
$$;
