"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatAppError, type AppError } from "@/lib/errors";
import { ErrorBanner, SuccessBanner } from "@/components/ui/ErrorBanner";
import { Plus } from "lucide-react";

type Project = {
  id: string;
  title_am: string;
  description: string | null;
  status: string;
  budget_birr: number | null;
  beneficiaries: string | null;
  start_date: string | null;
};

const STATUS_LABEL: Record<string, string> = {
  planned: "ታቅዷል",
  active: "በሂደት",
  completed: "ተጠናቋል",
  cancelled: "ተሰርዟል",
};

export function CharityPanel({ initial }: { initial: Project[] }) {
  const [items, setItems] = useState(initial);
  const [title, setTitle] = useState("");
  const [budget, setBudget] = useState("");
  const [beneficiaries, setBeneficiaries] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    setError(null);
    setOk(null);
    try {
      const supabase = createClient();
      const { data, error: dbErr } = await supabase
        .from("charity_projects")
        .insert({
          title_am: title.trim(),
          budget_birr: budget ? Number(budget) : null,
          beneficiaries: beneficiaries.trim() || null,
          status: "planned",
          start_date: new Date().toISOString().slice(0, 10),
        })
        .select(
          "id, title_am, description, status, budget_birr, beneficiaries, start_date"
        )
        .single();
      if (dbErr) {
        setError(formatAppError(dbErr));
        return;
      }
      if (data) setItems((list) => [data as Project, ...list]);
      setTitle("");
      setBudget("");
      setBeneficiaries("");
      setOk("ፕሮጀክቱ ተመዝግቧል");
    } catch (err) {
      setError(formatAppError(err));
    } finally {
      setSaving(false);
    }
  }

  async function setStatus(id: string, status: string) {
    setError(null);
    try {
      const supabase = createClient();
      const { error: dbErr } = await supabase
        .from("charity_projects")
        .update({ status })
        .eq("id", id);
      if (dbErr) {
        setError(formatAppError(dbErr));
        return;
      }
      setItems((list) =>
        list.map((p) => (p.id === id ? { ...p, status } : p))
      );
    } catch (err) {
      setError(formatAppError(err));
    }
  }

  return (
    <div className="space-y-4">
      {error && <ErrorBanner error={error} onDismiss={() => setError(null)} />}
      {ok && <SuccessBanner message={ok} />}

      <form onSubmit={add} className="grid gap-2 sm:grid-cols-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="የፕሮጀክት ስም…"
          className="sm:col-span-3 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm amharic"
        />
        <input
          type="number"
          min={0}
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          placeholder="በጀት (ብር)"
          className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm"
        />
        <input
          value={beneficiaries}
          onChange={(e) => setBeneficiaries(e.target.value)}
          placeholder="ተጠቃሚዎች"
          className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm amharic"
        />
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-1 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
        >
          <Plus className="h-4 w-4" /> አክል
        </button>
      </form>

      <ul className="space-y-2">
        {items.length === 0 && (
          <li className="text-sm text-[var(--foreground)]/50 amharic py-6 text-center">
            ምንም ፕሮጀክት የለም
          </li>
        )}
        {items.map((p) => (
          <li
            key={p.id}
            className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-3"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium amharic">{p.title_am}</p>
              <p className="text-[11px] text-[var(--foreground)]/45 amharic">
                {p.budget_birr != null ? `${p.budget_birr} ብር` : "—"}
                {p.beneficiaries ? ` · ${p.beneficiaries}` : ""}
              </p>
            </div>
            <select
              value={p.status}
              onChange={(e) => setStatus(p.id, e.target.value)}
              className="rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs px-2 py-1.5 amharic"
            >
              {Object.entries(STATUS_LABEL).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
}
