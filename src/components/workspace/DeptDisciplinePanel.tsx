"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { formatAppError, type AppError } from "@/lib/errors";
import { ErrorBanner, SuccessBanner } from "@/components/ui/ErrorBanner";

type Case = {
  id: string;
  servant_name: string;
  reason: string;
  step: number;
  status: string;
};

export function DeptDisciplinePanel({ initial }: { initial: Case[] }) {
  const [rows, setRows] = useState(initial);
  const [name, setName] = useState("");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !reason.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data, error: dbErr } = await supabase
        .from("disciplinary_cases")
        .insert({
          servant_name: name.trim(),
          reason: reason.trim(),
          step: 1,
          status: "open",
          department_slug: "kutator",
        })
        .select("id, servant_name, reason, step, status")
        .single();
      if (dbErr) {
        setError(formatAppError(dbErr));
        return;
      }
      if (data) setRows((r) => [data as Case, ...r]);
      setName("");
      setReason("");
      setOk("ጉዳይ ተከፍቷል");
    } catch (err) {
      setError(formatAppError(err));
    } finally {
      setSaving(false);
    }
  }

  async function advance(id: string, step: number) {
    setError(null);
    try {
      const supabase = createClient();
      const status = step >= 3 ? "resolved" : "open";
      const { error: dbErr } = await supabase
        .from("disciplinary_cases")
        .update({ step, status, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (dbErr) {
        setError(formatAppError(dbErr));
        return;
      }
      setRows((list) =>
        list.map((r) => (r.id === id ? { ...r, step, status } : r))
      );
      setOk(`ደረጃ ${step}`);
    } catch (err) {
      setError(formatAppError(err));
    }
  }

  return (
    <div className="space-y-6">
      {error && <ErrorBanner error={error} onDismiss={() => setError(null)} />}
      {ok && <SuccessBanner message={ok} />}

      <form
        onSubmit={add}
        className="grid gap-2 sm:grid-cols-2 rounded-2xl border border-[var(--border)] p-4"
      >
        <h3 className="sm:col-span-2 text-sm font-semibold amharic">
          አዲስ ክርስትያናዊ ሕይወት ክትትል
        </h3>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ስም"
          className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm amharic"
        />
        <input
          required
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="ምክንያት"
          className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm amharic"
        />
        <button
          type="submit"
          disabled={saving}
          className="sm:col-span-2 rounded-xl bg-[var(--primary)] py-2.5 text-sm text-white"
        >
          ጀምር (ደረጃ 1)
        </button>
      </form>

      <ul className="space-y-2">
        {rows.map((r) => (
          <li
            key={r.id}
            className="rounded-xl border border-[var(--border)] px-3 py-3 text-sm amharic"
          >
            <p className="font-medium">{r.servant_name}</p>
            <p className="text-[11px] text-[var(--foreground)]/55">{r.reason}</p>
            <p className="text-xs text-[var(--primary)] mt-1">
              ደረጃ {r.step} · {r.status}
            </p>
            {r.status === "open" && r.step < 3 && (
              <button
                type="button"
                onClick={() => advance(r.id, r.step + 1)}
                className="mt-2 rounded-lg border border-[var(--border)] text-xs px-2 py-1"
              >
                → ደረጃ {r.step + 1}
              </button>
            )}
          </li>
        ))}
      </ul>

      <Link
        href="/admin/operations/discipline"
        className="inline-block text-sm text-[var(--primary)] amharic"
      >
        ሙሉ ዲስፕሊን ሂደት →
      </Link>
    </div>
  );
}
