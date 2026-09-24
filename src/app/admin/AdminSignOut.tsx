"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";

export function AdminSignOut() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function signOut() {
    setBusy(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/admin/login");
      router.refresh();
    } catch {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={busy}
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs font-medium text-[var(--foreground)]/70 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700 disabled:opacity-50 amharic"
    >
      <LogOut className="h-3.5 w-3.5" />
      {busy ? "እየወጣ…" : "ውጣ"}
    </button>
  );
}
