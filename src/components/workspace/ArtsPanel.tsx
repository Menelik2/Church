"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatAppError, type AppError } from "@/lib/errors";
import { ErrorBanner, SuccessBanner } from "@/components/ui/ErrorBanner";

type Event = {
  id: string;
  title_am: string;
  event_type: string | null;
  event_date: string | null;
  status: string;
  participants_note: string | null;
};

const STATUS_AM: Record<string, string> = {
  planned: "ታቅዷል",
  rehearsing: "ልምምድ",
  done: "ተከናውኗል",
  cancelled: "ተሰርዟል",
};

export function ArtsPanel({ initial }: { initial: Event[] }) {
  const [rows, setRows] = useState(initial);
  const [title, setTitle] = useState("");
  const [etype, setEtype] = useState("performance");
  const [date, setDate] = useState("");
  const [participants, setParticipants] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data, error: dbErr } = await supabase
        .from("arts_events")
        .insert({
          title_am: title.trim(),
          event_type: etype,
          event_date: date || null,
          participants_note: participants.trim() || null,
          status: "planned",
        })
        .select(
          "id, title_am, event_type, event_date, status, participants_note"
        )
        .single();
      if (dbErr) {
        setError(formatAppError(dbErr));
        return;
      }
      if (data) setRows((r) => [data as Event, ...r]);
      setTitle("");
      setDate("");
      setParticipants("");
      setOk("ዝግጅት ተመዝግቧል");
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
        .from("arts_events")
        .update({ status })
        .eq("id", id);
      if (dbErr) {
        setError(formatAppError(dbErr));
        return;
      }
      setRows((list) =>
        list.map((r) => (r.id === id ? { ...r, status } : r))
      );
      setOk(STATUS_AM[status] ?? status);
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
          አዲስ ኪነጥበብ ዝግጅት
        </h3>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="ርዕስ"
          className="sm:col-span-2 rounded-xl border border-[var(--border)] px-3 py-2 text-sm amharic"
        />
        <select
          value={etype}
          onChange={(e) => setEtype(e.target.value)}
          className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm amharic"
        >
          <option value="performance">ትርኢት</option>
          <option value="training">ስልጠና</option>
          <option value="rehearsal">ልምምድ</option>
          <option value="other">ሌላ</option>
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
        />
        <input
          value={participants}
          onChange={(e) => setParticipants(e.target.value)}
          placeholder="ተሳታፊዎች"
          className="sm:col-span-2 rounded-xl border border-[var(--border)] px-3 py-2 text-sm amharic"
        />
        <button
          type="submit"
          disabled={saving}
          className="sm:col-span-2 rounded-xl bg-[var(--primary)] py-2.5 text-sm text-white"
        >
          መዝግብ
        </button>
      </form>

      <ul className="space-y-2">
        {rows.map((r) => (
          <li
            key={r.id}
            className="rounded-xl border border-[var(--border)] px-3 py-3 text-sm amharic"
          >
            <div className="flex flex-wrap justify-between gap-2">
              <span className="font-medium">{r.title_am}</span>
              <span className="text-xs text-[var(--primary)]">
                {STATUS_AM[r.status] ?? r.status}
              </span>
            </div>
            <p className="text-[11px] text-[var(--foreground)]/50">
              {r.event_type} · {r.event_date || "—"}
              {r.participants_note ? ` · ${r.participants_note}` : ""}
            </p>
            {r.status !== "done" && r.status !== "cancelled" && (
              <div className="mt-2 flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setStatus(r.id, "rehearsing")}
                  className="rounded-lg border border-[var(--border)] text-xs px-2 py-1"
                >
                  ልምምድ
                </button>
                <button
                  type="button"
                  onClick={() => setStatus(r.id, "done")}
                  className="rounded-lg bg-emerald-700 text-white text-xs px-2 py-1"
                >
                  ተከናውኗል
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
