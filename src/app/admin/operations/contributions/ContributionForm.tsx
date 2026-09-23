"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Servant = { id: string; full_name_am: string };

export function ContributionForm({ servants, year, month }: { servants: Servant[]; year: number; month: number }) {
  const router = useRouter();
  const [servantId, setServantId] = useState("");
  const [amount, setAmount] = useState("");
  const [y, setY] = useState(String(year));
  const [m, setM] = useState(String(month));
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    setOk(false);
    const supabase = createClient();
    const { error } = await supabase.from("contributions").upsert(
      {
        servant_id: servantId,
        amount_birr: parseFloat(amount),
        period_year: parseInt(y, 10),
        period_month: parseInt(m, 10),
        note: note.trim() || null,
        paid_at: new Date().toISOString().slice(0, 10),
      },
      { onConflict: "servant_id,period_year,period_month" }
    );
    setLoading(false);
    if (error) {
      setErr(error.message);
      return;
    }
    setOk(true);
    setAmount("");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <select required value={servantId} onChange={(e) => setServantId(e.target.value)} className="w-full rounded-xl border border-[var(--border)] px-3 py-2 text-sm">
        <option value="">— አገልጋይ —</option>
        {servants.map((s) => (
          <option key={s.id} value={s.id}>{s.full_name_am}</option>
        ))}
      </select>
      <div className="grid grid-cols-3 gap-2">
        <input type="number" required value={y} onChange={(e) => setY(e.target.value)} className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm" placeholder="ዓመት" />
        <input type="number" min={1} max={12} required value={m} onChange={(e) => setM(e.target.value)} className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm" placeholder="ወር" />
        <input type="number" step="0.01" min={0} required value={amount} onChange={(e) => setAmount(e.target.value)} className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm" placeholder="ብር" />
      </div>
      <input placeholder="ማስታወሻ" value={note} onChange={(e) => setNote(e.target.value)} className="w-full rounded-xl border border-[var(--border)] px-3 py-2 text-sm" />
      {err && <p className="text-sm text-red-600">{err}</p>}
      {ok && <p className="text-sm text-emerald-700">ተመዝግቧል።</p>}
      <button type="submit" disabled={loading || !servantId} className="rounded-xl bg-[var(--primary)] text-white px-4 py-2 text-sm disabled:opacity-50">መዝግብ</button>
    </form>
  );
}
