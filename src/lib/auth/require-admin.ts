import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile, UserRole } from "@/types/database";

const ADMIN_ROLES: UserRole[] = ["super_admin", "admin", "editor"];

export async function getSessionProfile(): Promise<{
  userId: string;
  profile: Profile | null;
} | null> {
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
}

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
