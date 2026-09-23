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

const ADMIN_ROLES: UserRole[] = ["super_admin", "admin", "editor"];
const STAFF_ROLES: UserRole[] = [
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

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (error || !profile) {
      return {
        userId: user.id,
        profile: null,
      };
    }

    return { userId: user.id, profile: profile as Profile };
  } catch {
    return null;
  }
}

export async function requireAdmin(
  allowed: UserRole[] = ADMIN_ROLES
): Promise<{ userId: string; profile: Profile }> {
  const session = await getSessionProfile();

  if (!session) {
    redirect("/admin/login");
  }

  if (!session.profile) {
    redirect("/admin/login?error=noprofile");
  }

  if (!allowed.includes(session.profile.role)) {
    redirect("/admin/login?error=forbidden");
  }

  if (!session.profile.is_active) {
    redirect("/admin/login?error=inactive");
  }

  return { userId: session.userId, profile: session.profile };
}

/** Leadership + department officers can use workspaces */
export async function requireStaff() {
  return requireAdmin(STAFF_ROLES);
}
