-- 021: Department role capabilities
-- ፀሐፊ · ሒሳብ · ንብረት · ትምህርት · ሚዲያ · ቁጥጥር · ሰብሳቢ/ምክትል · አማካሪ · ሲስተም አስተዳዳሪ
-- System admin alone does NOT grant operational decision authority.

-- ---------------------------------------------------------------------------
-- Ensure department_roles codes exist (including advisory)
-- ---------------------------------------------------------------------------

INSERT INTO department_roles (code, title_am, title_en, is_leadership, order_index) VALUES
  ('sebabi', 'ሰብሳቢ', 'Chairperson', true, 1),
  ('vice-sebabi', 'ምክትል ሰብሳቢ', 'Vice Chairperson', true, 2),
  ('secretary', 'ፀሐፊ', 'Secretary', true, 3),
  ('hisab', 'ሒሳብ ክፍል', 'Finance', false, 4),
  ('nebrat', 'ንብረት ክፍል', 'Property', false, 5),
  ('timihirt', 'ትምህርት ክፍል', 'Education', false, 6),
  ('media', 'ሚዲያና ሰነድ ክፍል', 'Media & Documentation', false, 7),
  ('kutator', 'ቁጥጥር ክፍል', 'Oversight', false, 8),
  ('mezmur', 'መዝሙር ክፍል', 'Hymn', false, 9),
  ('kine-tibeb', 'ኪነጥበብ ክፍል', 'Arts', false, 10),
  ('hitsanat', 'ሕፃናት ክፍል', 'Children', false, 11),
  ('genegnet', 'ግንኙነት ክፍል', 'Relations', false, 12),
  ('limat', 'ልማትና በጎ አድራጎት', 'Development & Charity', false, 13),
  ('advisory', 'አማካሪ ቦርድ / ሰበካ ጉባኤ ተወካይ', 'Advisory Board / Parish Assembly', true, 14)
ON CONFLICT (code) DO UPDATE SET
  title_am = EXCLUDED.title_am,
  title_en = EXCLUDED.title_en,
  is_leadership = EXCLUDED.is_leadership,
  order_index = EXCLUDED.order_index;

-- Primary department assignment on profile
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS department_code TEXT REFERENCES department_roles(code);

CREATE INDEX IF NOT EXISTS idx_profiles_department_code ON profiles(department_code);

-- Optional multi-role assignments
CREATE TABLE IF NOT EXISTS profile_department_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  department_code TEXT NOT NULL REFERENCES department_roles(code),
  can_write BOOLEAN NOT NULL DEFAULT true,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  assigned_by UUID REFERENCES profiles(id),
  UNIQUE (profile_id, department_code)
);

CREATE INDEX IF NOT EXISTS idx_pdr_profile ON profile_department_roles(profile_id);
CREATE INDEX IF NOT EXISTS idx_pdr_code ON profile_department_roles(department_code);

ALTER TABLE profile_department_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "pdr_select" ON profile_department_roles;
DROP POLICY IF EXISTS "pdr_write" ON profile_department_roles;

CREATE POLICY "pdr_select" ON profile_department_roles
  FOR SELECT TO authenticated
  USING (
    profile_id = auth.uid()
    OR public.is_leadership()
    OR public.is_super_admin()
  );

CREATE POLICY "pdr_write" ON profile_department_roles
  FOR ALL TO authenticated
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

-- ---------------------------------------------------------------------------
-- Helpers: department membership & capabilities
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.user_department_codes()
RETURNS TEXT[]
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (
      SELECT array_agg(DISTINCT code)
      FROM (
        SELECT p.department_code AS code
        FROM profiles p
        WHERE p.id = auth.uid() AND p.department_code IS NOT NULL
        UNION
        SELECT pdr.department_code
        FROM profile_department_roles pdr
        WHERE pdr.profile_id = auth.uid()
      ) x
      WHERE code IS NOT NULL
    ),
    ARRAY[]::TEXT[]
  );
$$;

CREATE OR REPLACE FUNCTION public.has_dept_role(p_code TEXT)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    public.is_leadership()
    OR p_code = ANY (public.user_department_codes());
$$;

-- Workspace access: leadership/admin all; dept manager only assigned; advisory read path
CREATE OR REPLACE FUNCTION public.can_access_workspace(p_code TEXT)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    public.get_user_role() IN ('super_admin', 'admin', 'editor')
    OR public.has_dept_role(p_code);
$$;

CREATE OR REPLACE FUNCTION public.can_write_workspace(p_code TEXT)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    public.is_leadership()
    OR (
      public.get_user_role() = 'department_manager'
      AND p_code = ANY (public.user_department_codes())
      AND EXISTS (
        SELECT 1 FROM profile_department_roles pdr
        WHERE pdr.profile_id = auth.uid()
          AND pdr.department_code = p_code
          AND pdr.can_write = true
      )
    )
    OR (
      public.get_user_role() = 'department_manager'
      AND (
        SELECT department_code FROM profiles WHERE id = auth.uid()
      ) = p_code
    );
$$;

-- Finance: leadership OR hisab department head
CREATE OR REPLACE FUNCTION public.can_view_finance()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    public.is_leadership()
    OR public.has_dept_role('hisab');
$$;

-- Discipline recording: leadership OR kutator (oversight records processes; final punishment still leadership)
CREATE OR REPLACE FUNCTION public.can_manage_discipline()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    public.is_leadership()
    OR public.has_dept_role('kutator');
$$;

-- Service/punishment decisions: leadership only (not system admin alone as editor; not kutator alone for final status)
CREATE OR REPLACE FUNCTION public.can_decide_service_or_punishment()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_leadership();
$$;

-- Secretary scope: member registry view + meetings/minutes/letters within authorization
CREATE OR REPLACE FUNCTION public.can_secretary_scope()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_leadership() OR public.has_dept_role('secretary');
$$;

-- Property
CREATE OR REPLACE FUNCTION public.can_manage_property()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_leadership() OR public.has_dept_role('nebrat');
$$;

-- Education
CREATE OR REPLACE FUNCTION public.can_manage_education()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_leadership() OR public.has_dept_role('timihirt');
$$;

-- Media & documentation
CREATE OR REPLACE FUNCTION public.can_manage_media()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_leadership() OR public.has_dept_role('media');
$$;

-- Children (refine: hitsanat only, not any department_id)
CREATE OR REPLACE FUNCTION public.can_access_children()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    public.is_leadership()
    OR public.has_dept_role('hitsanat');
$$;

-- Advisory: read-only staff visibility for appropriate operational summaries (no write on sensitive)
CREATE OR REPLACE FUNCTION public.is_advisory()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_dept_role('advisory');
$$;

-- System admin technical only: super_admin for tech; operational decisions still is_leadership
-- (editor is CMS-only; super_admin can do tech + may be leadership — document in policy)

COMMENT ON FUNCTION public.has_dept_role(TEXT) IS
  'True if user is assigned to department role code or is leadership.';
COMMENT ON FUNCTION public.can_view_finance() IS
  'Finance: leadership or hisab department head.';
COMMENT ON FUNCTION public.can_manage_discipline() IS
  'Oversight recording: leadership or kutator; final service decisions still can_decide_service_or_punishment.';
COMMENT ON FUNCTION public.can_secretary_scope() IS
  'Secretary: member registry, meetings, minutes, letters within authorized scope.';
COMMENT ON FUNCTION public.can_manage_property() IS
  'Property head: fixed/consumable assets, checkout, return, maintenance.';
COMMENT ON FUNCTION public.can_manage_education() IS
  'Education head: courses, training, students, completion records.';
COMMENT ON FUNCTION public.can_manage_media() IS
  'Media: photo, audio, video, news, heritage, announcements.';

-- ---------------------------------------------------------------------------
-- RLS refinements for domain tables
-- ---------------------------------------------------------------------------

-- Meetings: secretary + leadership
ALTER TABLE IF EXISTS meetings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins manage meetings" ON meetings;
DROP POLICY IF EXISTS "Public read scheduled meetings" ON meetings;
DROP POLICY IF EXISTS "meetings_select" ON meetings;
DROP POLICY IF EXISTS "meetings_write" ON meetings;

CREATE POLICY "meetings_select" ON meetings FOR SELECT TO authenticated
  USING (public.can_secretary_scope() OR public.is_admin() OR public.is_advisory());

CREATE POLICY "meetings_write" ON meetings FOR ALL TO authenticated
  USING (public.can_secretary_scope())
  WITH CHECK (public.can_secretary_scope());

CREATE POLICY "meetings_public_read" ON meetings FOR SELECT
  USING (status IN ('scheduled', 'completed'));

-- Official correspondence: secretary + chair + leadership
ALTER TABLE IF EXISTS official_correspondence ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth_corr" ON official_correspondence;
DROP POLICY IF EXISTS "dept_all_official_correspondence" ON official_correspondence;
DROP POLICY IF EXISTS "corr_access" ON official_correspondence;

CREATE POLICY "corr_access" ON official_correspondence FOR ALL TO authenticated
  USING (
    public.can_secretary_scope()
    OR public.has_dept_role('sebabi')
    OR public.has_dept_role('vice-sebabi')
  )
  WITH CHECK (
    public.can_secretary_scope()
    OR public.has_dept_role('sebabi')
    OR public.has_dept_role('vice-sebabi')
  );

-- Property items + checkouts
ALTER TABLE IF EXISTS property_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "property_auth" ON property_items;
DROP POLICY IF EXISTS "dept_all_property_items" ON property_items;
DROP POLICY IF EXISTS "property_access" ON property_items;

CREATE POLICY "property_access" ON property_items FOR ALL TO authenticated
  USING (public.can_manage_property())
  WITH CHECK (public.can_manage_property());

ALTER TABLE IF EXISTS property_checkouts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth_checkout" ON property_checkouts;
DROP POLICY IF EXISTS "dept_all_property_checkouts" ON property_checkouts;
DROP POLICY IF EXISTS "checkout_access" ON property_checkouts;

CREATE POLICY "checkout_access" ON property_checkouts FOR ALL TO authenticated
  USING (public.can_manage_property())
  WITH CHECK (public.can_manage_property());

ALTER TABLE IF EXISTS department_inventory ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "dept_all_department_inventory" ON department_inventory;
DROP POLICY IF EXISTS "dept_inventory_access" ON department_inventory;

CREATE POLICY "dept_inventory_access" ON department_inventory FOR ALL TO authenticated
  USING (
    public.can_manage_property()
    OR public.can_access_workspace(department_code)
  )
  WITH CHECK (
    public.can_manage_property()
    OR public.can_write_workspace(department_code)
  );

-- Education
ALTER TABLE IF EXISTS education_classes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "classes_auth" ON education_classes;
DROP POLICY IF EXISTS "dept_all_education_classes" ON education_classes;
DROP POLICY IF EXISTS "education_classes_access" ON education_classes;

CREATE POLICY "education_classes_access" ON education_classes FOR ALL TO authenticated
  USING (public.can_manage_education())
  WITH CHECK (public.can_manage_education());

ALTER TABLE IF EXISTS class_attendance ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "attendance_auth" ON class_attendance;
DROP POLICY IF EXISTS "dept_all_class_attendance" ON class_attendance;
DROP POLICY IF EXISTS "class_attendance_access" ON class_attendance;

CREATE POLICY "class_attendance_access" ON class_attendance FOR ALL TO authenticated
  USING (public.can_manage_education() OR public.has_dept_role('kutator'))
  WITH CHECK (public.can_manage_education() OR public.has_dept_role('kutator'));

ALTER TABLE IF EXISTS course_enrollments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth_courses" ON course_enrollments;
DROP POLICY IF EXISTS "dept_all_course_enrollments" ON course_enrollments;
DROP POLICY IF EXISTS "courses_access" ON course_enrollments;

CREATE POLICY "courses_access" ON course_enrollments FOR ALL TO authenticated
  USING (public.can_manage_education() OR public.can_view_member_pii())
  WITH CHECK (public.can_manage_education() OR public.is_leadership());

-- Media
ALTER TABLE IF EXISTS media_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "media_auth" ON media_logs;
DROP POLICY IF EXISTS "dept_all_media_logs" ON media_logs;
DROP POLICY IF EXISTS "media_logs_access" ON media_logs;

CREATE POLICY "media_logs_access" ON media_logs FOR ALL TO authenticated
  USING (public.can_manage_media())
  WITH CHECK (public.can_manage_media());

-- Department tasks/records scoped by workspace
ALTER TABLE IF EXISTS department_tasks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "dept_tasks_auth" ON department_tasks;
DROP POLICY IF EXISTS "dept_all_department_tasks" ON department_tasks;
DROP POLICY IF EXISTS "dept_tasks_access" ON department_tasks;

CREATE POLICY "dept_tasks_access" ON department_tasks FOR ALL TO authenticated
  USING (public.can_access_workspace(department_code))
  WITH CHECK (public.can_write_workspace(department_code) OR public.is_leadership());

ALTER TABLE IF EXISTS department_records ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "dept_records_auth" ON department_records;
DROP POLICY IF EXISTS "dept_all_department_records" ON department_records;
DROP POLICY IF EXISTS "dept_records_access" ON department_records;

CREATE POLICY "dept_records_access" ON department_records FOR ALL TO authenticated
  USING (public.can_access_workspace(department_code))
  WITH CHECK (public.can_write_workspace(department_code) OR public.is_leadership());

-- Chair approvals: sebabi / vice / leadership
ALTER TABLE IF EXISTS chair_approvals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth_chair_appr" ON chair_approvals;
DROP POLICY IF EXISTS "dept_all_chair_approvals" ON chair_approvals;
DROP POLICY IF EXISTS "chair_appr_access" ON chair_approvals;

CREATE POLICY "chair_appr_access" ON chair_approvals FOR ALL TO authenticated
  USING (
    public.is_leadership()
    OR public.has_dept_role('sebabi')
    OR public.has_dept_role('vice-sebabi')
  )
  WITH CHECK (
    public.is_leadership()
    OR public.has_dept_role('sebabi')
    OR public.has_dept_role('vice-sebabi')
  );

-- Re-apply finance policies with updated can_view_finance
DROP POLICY IF EXISTS "finance_select_contributions" ON contributions;
DROP POLICY IF EXISTS "finance_write_contributions" ON contributions;

CREATE POLICY "finance_select_contributions"
  ON contributions FOR SELECT TO authenticated
  USING (public.can_view_finance());

CREATE POLICY "finance_write_contributions"
  ON contributions FOR ALL TO authenticated
  USING (public.can_view_finance())
  WITH CHECK (public.can_view_finance());

DROP POLICY IF EXISTS "finance_select_dept_finance" ON department_finance;
DROP POLICY IF EXISTS "finance_write_dept_finance" ON department_finance;

CREATE POLICY "finance_select_dept_finance"
  ON department_finance FOR SELECT TO authenticated
  USING (public.can_view_finance() OR public.can_access_workspace(department_code));

CREATE POLICY "finance_write_dept_finance"
  ON department_finance FOR ALL TO authenticated
  USING (public.can_view_finance() OR public.can_write_workspace(department_code))
  WITH CHECK (public.can_view_finance() OR public.can_write_workspace(department_code));

DROP POLICY IF EXISTS "discipline_all" ON disciplinary_cases;
CREATE POLICY "discipline_all"
  ON disciplinary_cases FOR ALL TO authenticated
  USING (public.can_manage_discipline())
  WITH CHECK (public.can_manage_discipline());
