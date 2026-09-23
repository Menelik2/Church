"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Pos = { key: string; title: string };

export function ElectionCycleForm({ defaultPositions }: { defaultPositions: Pos[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    const supabase = createClient();
    const { data: cycle, error } = await supabase
      .from("election_cycles")
      .insert({ title_am: title.trim(), term_start: start, term_end: end, status: "planned" })
      .select("id")
      .single();
    if (error || !cycle) {
      setLoading(false);
      setErr(error?.message ?? "Failed");
      return;
    }
    await supabase.from("election_positions").insert(
      defaultPositions.map((p) => ({ cycle_id: cycle.id, position_key: p.key, title_am: p.title }))
    );
    setLoading(false);
    router.push(`/admin/operations/elections/${cycle.id}`);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input required placeholder="ርዕስ (2018–2020 ምርጫ)" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border border-[var(--border)] px-3 py-2 text-sm amharic" />
      <div className="grid grid-cols-2 gap-2">
        <input type="date" required value={start} onChange={(e) => setStart(e.target.value)} className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm" />
        <input type="date" required value={end} onChange={(e) => setEnd(e.target.value)} className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm" />
      </div>
      <p className="text-xs text-[var(--foreground)]/50 amharic">13 ቦታዎች በራስ-ሰር ይፈጠራሉ።</p>
      {err && <p className="text-sm text-red-600">{err}</p>}
      <button type="submit" disabled={loading} className="rounded-xl bg-[var(--primary)] text-white px-4 py-2 text-sm">ዘመን ፍጠር</button>
    </form>
  );
}
