"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Servant = { id: string; full_name_am: string };

export function CandidateForm({ positionId, servants }: { positionId: string; servants: Servant[] }) {
  const router = useRouter();
  const [servantId, setServantId] = useState("");
  const [terms, setTerms] = useState("0");
  const [loading, setLoading] = useState(false);

  async function onAdd(e: React.FormEvent) {
    e.preventDefault();
    const s = servants.find((x) => x.id === servantId);
    if (!s) return;
    setLoading(true);
    const consecutive = parseInt(terms, 10) || 0;
    const supabase = createClient();
    await supabase.from("election_candidates").insert({
      position_id: positionId,
      servant_id: s.id,
      full_name_am: s.full_name_am,
      consecutive_terms: consecutive,
      eligible: consecutive < 2,
    });
    setLoading(false);
    setServantId("");
    router.refresh();
  }

  return (
    <form onSubmit={onAdd} className="flex flex-wrap gap-2 items-end">
      <select required value={servantId} onChange={(e) => setServantId(e.target.value)} className="rounded-lg border border-[var(--border)] px-2 py-1.5 text-sm min-w-[140px]">
        <option value="">እጩ…</option>
        {servants.map((s) => (
          <option key={s.id} value={s.id}>{s.full_name_am}</option>
        ))}
      </select>
      <input type="number" min={0} max={5} value={terms} onChange={(e) => setTerms(e.target.value)} title="ተከታታይ ዘመናት" className="w-16 rounded-lg border border-[var(--border)] px-2 py-1.5 text-sm" />
      <button type="submit" disabled={loading || !servantId} className="rounded-lg bg-[var(--primary)] text-white text-xs px-3 py-1.5 disabled:opacity-50">ጨምር</button>
    </form>
  );
}
