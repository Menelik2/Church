import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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
  avatar_url: string | null;
  phone: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

/** Full content admin (CMS) */
export const ADMIN_ROLES: UserRole[] = ["super_admin", "admin", "editor"];

/** Leadership: finance, discipline, service/punishment decisions (§4.1) */
export const LEADERSHIP_ROLES: UserRole[] = ["super_admin", "admin"];

/** Staff who may enter the admin shell (includes department managers) */
export const STAFF_ROLES: UserRole[] = [
  "super_admin",
  "admin",
  "editor",
  "department_manager",
];

export async function getSessionProfile(): Promise<{
  userId: string;
  profile: Profile | null;
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

    return { userId: user.id, profile: profile as Profile | null };
  } catch {
    return null;
  }
}

/**
 * Require one of the given roles (default: full admin CMS).
 * Redirects to login if not authenticated / not allowed.
 */
export async function requireAdmin(
  allowed: UserRole[] = ADMIN_ROLES
): Promise<{ userId: string; profile: Profile }> {
  const session = await getSessionProfile();

  if (!session?.profile || !allowed.includes(session.profile.role)) {
    redirect("/admin/login");
  }

  if (!session.profile.is_active) {
    redirect("/admin/login?error=inactive");
  }

  return { userId: session.userId, profile: session.profile };
}

/**
 * Require any staff role (admin or department_manager).
 * Use for workspace pages that department managers must access.
 */
export async function requireStaff(): Promise<{
  userId: string;
  profile: Profile;
}> {
  return requireAdmin(STAFF_ROLES);
}

/** §4.1 — Accounting / finance data only */
export async function requireFinance(): Promise<{
  userId: string;
  profile: Profile;
}> {
  return requireAdmin(LEADERSHIP_ROLES);
}

/** §4.1 — Discipline & ethics only for authorized bodies */
export async function requireDiscipline(): Promise<{
  userId: string;
  profile: Profile;
}> {
  return requireAdmin(LEADERSHIP_ROLES);
}

/**
 * §4.1 — Service assignment or punishment decisions.
 * Content/system editor alone must not decide these.
 */
export async function requireServiceDecision(): Promise<{
  userId: string;
  profile: Profile;
}> {
  return requireAdmin(LEADERSHIP_ROLES);
}

/**
 * §4.1 — Children data & photos (elevated protection).
 * Leadership always; department_manager only when assigned to hitsanat
 * (enforced further by RLS `can_access_children`).
 */
export async function requireChildrenAccess(): Promise<{
  userId: string;
  profile: Profile;
}> {
  return requireAdmin(["super_admin", "admin", "department_manager"]);
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

export function canViewFinance(role: UserRole): boolean {
  return LEADERSHIP_ROLES.includes(role);
}

export function canManageDiscipline(role: UserRole): boolean {
  return LEADERSHIP_ROLES.includes(role);
}

export function canDecideServiceOrPunishment(role: UserRole): boolean {
  return LEADERSHIP_ROLES.includes(role);
}
