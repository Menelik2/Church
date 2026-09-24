"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatAppError, type AppError } from "@/lib/errors";
import { ErrorBanner, SuccessBanner } from "@/components/ui/ErrorBanner";
import { Palette, Plus, Filter } from "lucide-react";

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

const TYPE_AM: Record<string, string> = {
  writing: "ጽሁፍ",
  drama: "ድራማ",
  stage: "መድረክ ዝግጅት",
  training: "ሥልጠና",
  performance: "ትርኢት",
  other: "ሌላ",
};

const SUB_UNITS = [
  "ጽሁፍ ዝግጅት",
  "ሥልጠና",
  "መድረክ ዝግጅት",
  "ዶክመንቴሽን",
  "ቁጥጥር",
] as const;

export function ArtsPanel({ initial }: { initial: Event[] }) {
  const [rows, setRows] = useState(initial);
  const [title, setTitle] = useState("");
  const [etype, setEtype] = useState("drama");
  const [date, setDate] = useState("");
  const [participants, setParticipants] = useState("");
  const [subUnit, setSubUnit] = useState<string>(SUB_UNITS[0]);
  const [filter, setFilter] = useState<string>("all");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (filter === "all") return rows;
    return rows.filter((r) => r.status === filter);
  }, [rows, filter]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    setError(null);
    setOk(null);
    try {
      const supabase = createClient();
      const note = [subUnit ? `ንዑስ፡ ${subUnit}` : null, participants.trim() || null]
        .filter(Boolean)
        .join(" · ");
      const { data, error: dbErr } = await supabase
        .from("arts_events")
        .insert({
          title_am: title.trim(),
          event_type: etype,
          event_date: date || null,
          participants_note: note || null,
          status: "planned",
        })
        .select("id, title_am, event_type, event_date, status, participants_note")
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
      setRows((list) => list.map((r) => (r.id === id ? { ...r, status } : r)));
      setOk(STATUS_AM[status] ?? status);
    } catch (err) {
      setError(formatAppError(err));
    }
  }

  return (
    <div className="space-y-5">
      {error && <ErrorBanner error={error} onDismiss={() => setError(null)} />}
      {ok && <SuccessBanner message={ok} />}

      <div className="rounded-2xl border border-[var(--color-gold-300)]/40 bg-gradient-to-br from-[var(--color-gold-50)]/50 to-[var(--card)] p-4">
        <p className="flex items-center gap-2 text-xs font-semibold amharic text-[var(--primary)]">
          <Palette className="h-3.5 w-3.5" /> ኪነ ጥበብ · ንዑስ ክፍሎች · ተጠሪነት ለም/ሰብሳቢ
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {SUB_UNITS.map((s) => (
            <span
              key={s}
              className="rounded-full border border-[var(--color-gold-300)]/50 bg-white/80 px-2.5 py-0.5 text-[10px] amharic text-[var(--foreground)]/70"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      <form onSubmit={add} className="grid gap-2 sm:grid-cols-2 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
        <p className="sm:col-span-2 text-sm font-semibold amharic text-[var(--primary)]">አዲስ ዝግጅት / ጽሁፍ / ድራማ</p>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="ርዕስ… *"
          required
          className="sm:col-span-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm amharic"
        />
        <select
          value={etype}
          onChange={(e) => setEtype(e.target.value)}
          className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm amharic"
        >
          {Object.entries(TYPE_AM).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        <select
          value={subUnit}
          onChange={(e) => setSubUnit(e.target.value)}
          className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm amharic"
        >
          {SUB_UNITS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm"
        />
        <input
          value={participants}
          onChange={(e) => setParticipants(e.target.value)}
          placeholder="ተሳታፊዎች / ማስታወሻ"
          className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm amharic"
        />
        <button
          type="submit"
          disabled={saving}
          className="sm:col-span-2 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50 amharic"
        >
          <Plus className="h-4 w-4" /> {saving ? "እየተቀመጠ…" : "ዝግጅት አክል"}
        </button>
      </form>

      <div className="flex flex-wrap items-center gap-2">
        <Filter className="h-3.5 w-3.5 text-[var(--foreground)]/40" />
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`rounded-full px-3 py-1 text-[11px] font-medium amharic ${
            filter === "all" ? "bg-[var(--primary)] text-white" : "border border-[var(--border)] text-[var(--foreground)]/60"
          }`}
        >
          ሁሉም ({rows.length})
        </button>
        {Object.entries(STATUS_AM).map(([k, v]) => (
          <button
            key={k}
            type="button"
            onClick={() => setFilter(k)}
            className={`rounded-full px-3 py-1 text-[11px] font-medium amharic ${
              filter === k ? "bg-[var(--primary)] text-white" : "border border-[var(--border)] text-[var(--foreground)]/60"
            }`}
          >
            {v} ({rows.filter((r) => r.status === k).length})
          </button>
        ))}
      </div>

      <ul className="space-y-2">
        {filtered.length === 0 && (
          <li className="rounded-xl border border-dashed border-[var(--border)] py-10 text-center text-sm text-[var(--foreground)]/50 amharic">
            ምንም ዝግጅት የለም — ከላይ ይመዝግቡ።
          </li>
        )}
        {filtered.map((r) => (
          <li key={r.id} className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-semibold amharic text-[var(--primary)]">{r.title_am}</p>
                <p className="mt-0.5 text-[11px] text-[var(--foreground)]/50 amharic">
                  {TYPE_AM[r.event_type ?? ""] ?? r.event_type}
                  {r.event_date ? ` · ${r.event_date}` : ""}
                </p>
                {r.participants_note && (
                  <p className="mt-1 text-[11px] text-[var(--foreground)]/45 amharic line-clamp-2">
                    {r.participants_note}
                  </p>
                )}
              </div>
              <span className="rounded-full bg-[var(--primary)]/10 px-2.5 py-0.5 text-[10px] font-semibold amharic text-[var(--primary)]">
                {STATUS_AM[r.status] ?? r.status}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5 border-t border-[var(--border)] pt-2">
              {(["planned", "rehearsing", "done", "cancelled"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(r.id, s)}
                  disabled={r.status === s}
                  className="rounded-lg border border-[var(--border)] px-2 py-1 text-[10px] font-medium amharic disabled:opacity-40 hover:bg-[var(--muted)]"
                >
                  {STATUS_AM[s]}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
