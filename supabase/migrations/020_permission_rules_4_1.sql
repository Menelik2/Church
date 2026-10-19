-- 020: Permission rules §4.1 — የፈቃድ አስፈላጊ ሕጎች
-- Accounting, member PII, discipline, service status, children data.
-- Software records human decisions; it does not replace them.

-- ---------------------------------------------------------------------------
-- Helper functions (SECURITY DEFINER, stable)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT role FROM profiles WHERE id = auth.uid() AND is_active = true),
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

-- Leadership: can view finance + take operational decisions (not content-only editor)
CREATE OR REPLACE FUNCTION public.is_leadership()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.get_user_role() IN ('super_admin', 'admin');
$$;

-- Finance / accounting data (contributions, department_finance)
CREATE OR REPLACE FUNCTION public.can_view_finance()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.get_user_role() IN ('super_admin', 'admin');
$$;

-- Discipline & ethics cases — only authorized bodies (leadership)
CREATE OR REPLACE FUNCTION public.can_manage_discipline()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.get_user_role() IN ('super_admin', 'admin');
$$;

-- Service assignment / status / punishment decisions
-- System/content admin (editor) alone MUST NOT decide these.
CREATE OR REPLACE FUNCTION public.can_decide_service_or_punishment()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.get_user_role() IN ('super_admin', 'admin');
$$;

-- Children department data & photos — elevated protection
CREATE OR REPLACE FUNCTION public.can_access_children()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    public.get_user_role() IN ('super_admin', 'admin')
    OR (
      public.get_user_role() = 'department_manager'
      AND EXISTS (
        SELECT 1 FROM profiles p
        LEFT JOIN departments d ON d.id = p.department_id
        WHERE p.id = auth.uid()
          AND (
            d.slug IN ('hitsanat', 'children', 'hizanat')
            OR p.department_id IS NOT NULL
          )
      )
    );
$$;

-- Member PII: staff only (never public)
CREATE OR REPLACE FUNCTION public.can_view_member_pii()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.get_user_role() IN (
    'super_admin', 'admin', 'editor', 'department_manager'
  );
$$;

-- ---------------------------------------------------------------------------
-- Audit note column for human decision trail (software does not auto-decide)
-- ---------------------------------------------------------------------------

ALTER TABLE IF EXISTS disciplinary_cases
  ADD COLUMN IF NOT EXISTS decided_by UUID REFERENCES profiles(id),
  ADD COLUMN IF NOT EXISTS decision_note TEXT,
  ADD COLUMN IF NOT EXISTS decided_at TIMESTAMPTZ;

ALTER TABLE IF EXISTS servants
  ADD COLUMN IF NOT EXISTS status_changed_by UUID REFERENCES profiles(id),
  ADD COLUMN IF NOT EXISTS status_change_note TEXT;

-- ---------------------------------------------------------------------------
-- RLS: contributions (finance)
-- ---------------------------------------------------------------------------

ALTER TABLE IF EXISTS contributions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage contributions" ON contributions;
DROP POLICY IF EXISTS "finance_select_contributions" ON contributions;
DROP POLICY IF EXISTS "finance_write_contributions" ON contributions;

CREATE POLICY "finance_select_contributions"
  ON contributions FOR SELECT
  TO authenticated
  USING (public.can_view_finance());

CREATE POLICY "finance_write_contributions"
  ON contributions FOR ALL
  TO authenticated
  USING (public.can_view_finance())
  WITH CHECK (public.can_view_finance());

-- ---------------------------------------------------------------------------
-- RLS: department_finance
-- ---------------------------------------------------------------------------

ALTER TABLE IF EXISTS department_finance ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "dept_all_department_finance" ON department_finance;
DROP POLICY IF EXISTS "finance_select_dept_finance" ON department_finance;
DROP POLICY IF EXISTS "finance_write_dept_finance" ON department_finance;

CREATE POLICY "finance_select_dept_finance"
  ON department_finance FOR SELECT
  TO authenticated
  USING (public.can_view_finance());

CREATE POLICY "finance_write_dept_finance"
  ON department_finance FOR ALL
  TO authenticated
  USING (public.can_view_finance())
  WITH CHECK (public.can_view_finance());

-- ---------------------------------------------------------------------------
-- RLS: disciplinary_cases + executive_discipline
-- ---------------------------------------------------------------------------

ALTER TABLE IF EXISTS disciplinary_cases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage disciplinary cases" ON disciplinary_cases;
DROP POLICY IF EXISTS "dept_all_disciplinary_cases" ON disciplinary_cases;
DROP POLICY IF EXISTS "discipline_all" ON disciplinary_cases;

CREATE POLICY "discipline_all"
  ON disciplinary_cases FOR ALL
  TO authenticated
  USING (public.can_manage_discipline())
  WITH CHECK (public.can_manage_discipline());

ALTER TABLE IF EXISTS executive_discipline ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "dept_all_executive_discipline" ON executive_discipline;
DROP POLICY IF EXISTS "exec_discipline_all" ON executive_discipline;

CREATE POLICY "exec_discipline_all"
  ON executive_discipline FOR ALL
  TO authenticated
  USING (public.can_manage_discipline())
  WITH CHECK (public.can_manage_discipline());

-- ---------------------------------------------------------------------------
-- RLS: servants — PII readable by staff; status changes only by leadership
-- ---------------------------------------------------------------------------

ALTER TABLE IF EXISTS servants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage servants" ON servants;
DROP POLICY IF EXISTS "staff_select_servants" ON servants;
DROP POLICY IF EXISTS "leadership_write_servants" ON servants;

CREATE POLICY "staff_select_servants"
  ON servants FOR SELECT
  TO authenticated
  USING (public.can_view_member_pii());

-- Insert/update/delete only leadership (editor cannot change service status)
CREATE POLICY "leadership_write_servants"
  ON servants FOR INSERT
  TO authenticated
  WITH CHECK (public.can_decide_service_or_punishment());

CREATE POLICY "leadership_update_servants"
  ON servants FOR UPDATE
  TO authenticated
  USING (public.can_decide_service_or_punishment())
  WITH CHECK (public.can_decide_service_or_punishment());

CREATE POLICY "leadership_delete_servants"
  ON servants FOR DELETE
  TO authenticated
  USING (public.is_super_admin());

-- ---------------------------------------------------------------------------
-- RLS: membership_applications, visitors, new_member_register (PII)
-- ---------------------------------------------------------------------------

ALTER TABLE IF EXISTS membership_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage membership applications" ON membership_applications;
DROP POLICY IF EXISTS "Public submit membership applications" ON membership_applications;
DROP POLICY IF EXISTS "public_insert_membership" ON membership_applications;
DROP POLICY IF EXISTS "staff_manage_membership" ON membership_applications;

CREATE POLICY "public_insert_membership"
  ON membership_applications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "staff_select_membership"
  ON membership_applications FOR SELECT
  TO authenticated
  USING (public.can_view_member_pii());

CREATE POLICY "leadership_update_membership"
  ON membership_applications FOR UPDATE
  TO authenticated
  USING (public.can_decide_service_or_punishment())
  WITH CHECK (public.can_decide_service_or_punishment());

CREATE POLICY "leadership_delete_membership"
  ON membership_applications FOR DELETE
  TO authenticated
  USING (public.is_super_admin());

ALTER TABLE IF EXISTS visitors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_visitors" ON visitors;
DROP POLICY IF EXISTS "staff_visitors" ON visitors;

CREATE POLICY "staff_visitors"
  ON visitors FOR ALL
  TO authenticated
  USING (public.can_view_member_pii())
  WITH CHECK (public.can_view_member_pii());

ALTER TABLE IF EXISTS new_member_register ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_nmr" ON new_member_register;
DROP POLICY IF EXISTS "dept_all_new_member_register" ON new_member_register;
DROP POLICY IF EXISTS "staff_nmr" ON new_member_register;

CREATE POLICY "staff_nmr"
  ON new_member_register FOR ALL
  TO authenticated
  USING (public.can_view_member_pii())
  WITH CHECK (public.can_view_member_pii());

-- ---------------------------------------------------------------------------
-- RLS: children_groups, children_activities (special protection)
-- ---------------------------------------------------------------------------

ALTER TABLE IF EXISTS children_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS children_activities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "dept_all_children_groups" ON children_groups;
DROP POLICY IF EXISTS "dept_all_children_activities" ON children_activities;
DROP POLICY IF EXISTS "children_groups_access" ON children_groups;
DROP POLICY IF EXISTS "children_activities_access" ON children_activities;

CREATE POLICY "children_groups_access"
  ON children_groups FOR ALL
  TO authenticated
  USING (public.can_access_children())
  WITH CHECK (public.can_access_children());

CREATE POLICY "children_activities_access"
  ON children_activities FOR ALL
  TO authenticated
  USING (public.can_access_children())
  WITH CHECK (public.can_access_children());

-- Optional: media tagged as children — restrict if category used
-- (media table may not have child flag; keep admin-only for unpublished)

-- ---------------------------------------------------------------------------
-- Profiles: never public; own + staff
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile (limited)" ON profiles;
DROP POLICY IF EXISTS "Admins can manage profiles" ON profiles;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id OR public.can_view_member_pii());

CREATE POLICY "Users can update own profile (limited)"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Leadership manage profiles"
  ON profiles FOR ALL
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

-- ---------------------------------------------------------------------------
-- Comment for operators
-- ---------------------------------------------------------------------------
COMMENT ON FUNCTION public.can_view_finance() IS
  '§4.1 Accounting data only for authorized finance/leadership (super_admin, admin).';
COMMENT ON FUNCTION public.can_manage_discipline() IS
  '§4.1 Discipline/ethics only for authorized bodies (super_admin, admin).';
COMMENT ON FUNCTION public.can_decide_service_or_punishment() IS
  '§4.1 System/content admin alone cannot decide service assignment or punishment.';
COMMENT ON FUNCTION public.can_access_children() IS
  '§4.1 Children data and photos under elevated access protection.';
COMMENT ON FUNCTION public.can_view_member_pii() IS
  '§4.1 Member personal data is never public.';
