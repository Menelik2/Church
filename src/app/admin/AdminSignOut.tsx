"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AdminSignOut() {
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={signOut}
      className="w-full rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--foreground)]/70 hover:bg-[var(--muted)] transition"
    >
      ውጣ
    </button>
  );
}
