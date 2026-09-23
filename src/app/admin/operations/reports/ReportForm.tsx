"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Dept = { id: string; name_am: string };

export function ReportForm({ departments }: { departments: Dept[] }) {
  const router = useRouter();
  const now = new Date();
  const [deptId, setDeptId] = useState("");
  const [year, setYear] = useState(String(now.getFullYear()));
  const [quarter, setQuarter] = useState(String(Math.floor(now.getMonth() / 3) + 1));
  const [summary, setSummary] = useState("");
  const [activities, setActivities] = useState("");
  const [challenges, setChallenges] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    const supabase = createClient();
    const { error } = await supabase.from("department_reports").upsert(
      {
        department_id: deptId,
        period_year: parseInt(year, 10),
        period_quarter: parseInt(quarter, 10),
        summary_am: summary.trim(),
        activities: activities.trim() || null,
        challenges: challenges.trim() || null,
        status: "submitted",
        submitted_at: new Date().toISOString(),
      },
      { onConflict: "department_id,period_year,period_quarter" }
    );
    setLoading(false);
    if (error) {
      setErr(error.message);
      return;
    }
    setSummary("");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <select required value={deptId} onChange={(e) => setDeptId(e.target.value)} className="w-full rounded-xl border border-[var(--border)] px-3 py-2 text-sm">
        <option value="">— ክፍል —</option>
        {departments.map((d) => (
          <option key={d.id} value={d.id}>{d.name_am}</option>
        ))}
      </select>
      <div className="grid grid-cols-2 gap-2">
        <input type="number" required value={year} onChange={(e) => setYear(e.target.value)} className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm" />
        <select value={quarter} onChange={(e) => setQuarter(e.target.value)} className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm">
          <option value="1">Q1</option><option value="2">Q2</option><option value="3">Q3</option><option value="4">Q4</option>
        </select>
      </div>
      <textarea required placeholder="ማጠቃለያ" value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} className="w-full rounded-xl border border-[var(--border)] px-3 py-2 text-sm amharic" />
      <textarea placeholder="ተግባራት" value={activities} onChange={(e) => setActivities(e.target.value)} rows={2} className="w-full rounded-xl border border-[var(--border)] px-3 py-2 text-sm amharic" />
      <textarea placeholder="ተግዳሮቶች" value={challenges} onChange={(e) => setChallenges(e.target.value)} rows={2} className="w-full rounded-xl border border-[var(--border)] px-3 py-2 text-sm amharic" />
      {err && <p className="text-sm text-red-600">{err}</p>}
      <button type="submit" disabled={loading} className="rounded-xl bg-[var(--primary)] text-white px-4 py-2 text-sm">አስገባ</button>
    </form>
  );
}
