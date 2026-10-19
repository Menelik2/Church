import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  canAccessWorkspace,
  canManageDiscipline,
  canManageEducation,
  canManageMedia,
  canManageProperty,
  canSecretaryScope,
  canViewFinance,
  canDecideServiceOrPunishment as canDecideCap,
  canAccessChildren as canAccessChildrenCap,
} from "./capabilities";

export type UserRole =
  | "super_admin"
  | "admin"
  | "editor"
  | "department_manager"
  | "member"
  | "visitor";

export type Profile = {
  id: string;
  email: string | null;
  full_name_am: string | null;
  full_name_en: string | null;
  role: UserRole;
  department_id: string | null;
  department_code?: string | null;
  avatar_url: string | null;
  phone: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

/** Full content admin (CMS) */
export const ADMIN_ROLES: UserRole[] = ["super_admin", "admin", "editor"];

/** Leadership: operational decisions (§4.1) — not system/editor alone */
export const LEADERSHIP_ROLES: UserRole[] = ["super_admin", "admin"];

/** Staff who may enter the admin shell */
export const STAFF_ROLES: UserRole[] = [
  "super_admin",
  "admin",
  "editor",
  "department_manager",
];

export async function getSessionProfile(): Promise<{
  userId: string;
  profile: Profile | null;
  deptCodes: string[];
} | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    const deptCodes: string[] = [];
    if (profile?.department_code) {
      deptCodes.push(profile.department_code as string);
    }
    try {
      const { data: extras } = await supabase
        .from("profile_department_roles")
        .select("department_code")
        .eq("profile_id", user.id);
      for (const row of extras ?? []) {
        if (row.department_code && !deptCodes.includes(row.department_code)) {
          deptCodes.push(row.department_code);
        }
      }
    } catch {
      // table may not exist until migration 021
    }

    return {
      userId: user.id,
      profile: profile as Profile | null,
      deptCodes,
    };
  } catch {
    return null;
  }
}

export async function requireAdmin(
  allowed: UserRole[] = ADMIN_ROLES
): Promise<{ userId: string; profile: Profile; deptCodes: string[] }> {
  const session = await getSessionProfile();

  if (!session?.profile || !allowed.includes(session.profile.role)) {
    redirect("/admin/login");
  }

  if (!session.profile.is_active) {
    redirect("/admin/login?error=inactive");
  }

  return {
    userId: session.userId,
    profile: session.profile,
    deptCodes: session.deptCodes,
  };
}

export async function requireStaff(): Promise<{
  userId: string;
  profile: Profile;
  deptCodes: string[];
}> {
  return requireAdmin(STAFF_ROLES);
}

/** §4.1 + hisab department head */
export async function requireFinance(): Promise<{
  userId: string;
  profile: Profile;
  deptCodes: string[];
}> {
  const session = await requireStaff();
  if (!canViewFinance(session.profile.role, session.deptCodes)) {
    redirect("/admin?error=forbidden_finance");
  }
  return session;
}

/** Leadership or kutator (records processes) */
export async function requireDiscipline(): Promise<{
  userId: string;
  profile: Profile;
  deptCodes: string[];
}> {
  const session = await requireStaff();
  if (!canManageDiscipline(session.profile.role, session.deptCodes)) {
    redirect("/admin?error=forbidden_discipline");
  }
  return session;
}

/** Service / membership decisions — leadership only */
export async function requireServiceDecision(): Promise<{
  userId: string;
  profile: Profile;
  deptCodes: string[];
}> {
  return requireAdmin(LEADERSHIP_ROLES);
}

export async function requireChildrenAccess(): Promise<{
  userId: string;
  profile: Profile;
  deptCodes: string[];
}> {
  const session = await requireStaff();
  if (!canAccessChildrenCap(session.profile.role, session.deptCodes)) {
    redirect("/admin?error=forbidden_children");
  }
  return session;
}

export async function requireSecretary(): Promise<{
  userId: string;
  profile: Profile;
  deptCodes: string[];
}> {
  const session = await requireStaff();
  if (!canSecretaryScope(session.profile.role, session.deptCodes)) {
    redirect("/admin?error=forbidden_secretary");
  }
  return session;
}

export async function requireProperty(): Promise<{
  userId: string;
  profile: Profile;
  deptCodes: string[];
}> {
  const session = await requireStaff();
  if (!canManageProperty(session.profile.role, session.deptCodes)) {
    redirect("/admin?error=forbidden_property");
  }
  return session;
}

export async function requireEducation(): Promise<{
  userId: string;
  profile: Profile;
  deptCodes: string[];
}> {
  const session = await requireStaff();
  if (!canManageEducation(session.profile.role, session.deptCodes)) {
    redirect("/admin?error=forbidden_education");
  }
  return session;
}

export async function requireMediaDept(): Promise<{
  userId: string;
  profile: Profile;
  deptCodes: string[];
}> {
  const session = await requireStaff();
  if (!canManageMedia(session.profile.role, session.deptCodes)) {
    redirect("/admin?error=forbidden_media");
  }
  return session;
}

/** Restrict department workspace by assignment */
export async function requireWorkspaceAccess(workspaceCode: string): Promise<{
  userId: string;
  profile: Profile;
  deptCodes: string[];
  canWrite: boolean;
}> {
  const session = await requireStaff();
  if (
    !canAccessWorkspace(
      session.profile.role,
      workspaceCode,
      session.deptCodes
    )
  ) {
    redirect("/admin/workspace?error=forbidden_workspace");
  }
  const canWrite =
    session.profile.role === "super_admin" ||
    session.profile.role === "admin" ||
    (session.profile.role === "department_manager" &&
      session.deptCodes.includes(workspaceCode) &&
      workspaceCode !== "advisory");
  return { ...session, canWrite };
}

export function isFullAdmin(role: UserRole): boolean {
  return ADMIN_ROLES.includes(role);
}

export function isStaffRole(role: UserRole): boolean {
  return STAFF_ROLES.includes(role);
}

export function isLeadership(role: UserRole): boolean {
  return LEADERSHIP_ROLES.includes(role);
}

export function canViewFinanceRole(
  role: UserRole,
  deptCodes: string[] = []
): boolean {
  return canViewFinance(role, deptCodes);
}

export function canManageDisciplineRole(
  role: UserRole,
  deptCodes: string[] = []
): boolean {
  return canManageDiscipline(role, deptCodes);
}

export function canDecideServiceOrPunishment(role: UserRole): boolean {
  return canDecideCap(role);
}
