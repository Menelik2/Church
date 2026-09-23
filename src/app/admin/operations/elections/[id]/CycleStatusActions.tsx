"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

const STEPS = [
  { status: "planned", label: "ታቅዷል" },
  { status: "nominating", label: "እጩ ምርጫ" },
  { status: "voting", label: "ምርጫ / እጣ" },
  { status: "completed", label: "ተጠናቋል" },
] as const;

export function CycleStatusActions({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function setStatus(next: string) {
    setLoading(true);
    const supabase = createClient();
    await supabase.from("election_cycles").update({ status: next }).eq("id", id);
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-2">
      {STEPS.map((s) => (
        <button
          key={s.status}
          type="button"
          disabled={loading || status === s.status}
          onClick={() => setStatus(s.status)}
          className={`rounded-lg text-xs px-3 py-1.5 border ${
            status === s.status
              ? "bg-[var(--primary)] text-white border-[var(--primary)]"
              : "border-[var(--border)] hover:bg-[var(--muted)]"
          } disabled:opacity-50`}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
