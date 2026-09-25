"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type RollServant = {
  id: string;
  full_name_am: string;
  phone: string | null;
  existingStatus: "present" | "absent" | "excused" | null;
};

type Status = "present" | "absent" | "excused";

const STATUS_LABEL: Record<Status, string> = {
  present: "ተገኝቷል",
  absent: "አልተገኘም",
  excused: "በፈቃድ",
};

export function AttendanceRoll({
  date,
  servants,
}: {
  date: string;
  servants: RollServant[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const [marks, setMarks] = useState<Record<string, Status | "">>(() => {
    const init: Record<string, Status | ""> = {};
    for (const s of servants) init[s.id] = s.existingStatus ?? "";
    return init;
  });

  useEffect(() => {
    const init: Record<string, Status | ""> = {};
    for (const s of servants) init[s.id] = s.existingStatus ?? "";
    setMarks(init);
    setMessage(null);
    setError(null);
  }, [date, servants]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return servants;
    return servants.filter(
      (s) =>
        s.full_name_am.toLowerCase().includes(q) ||
        (s.phone && s.phone.includes(q))
    );
  }, [servants, query]);

  const stats = useMemo(() => {
    let present = 0;
    let absent = 0;
    let excused = 0;
    let unmarked = 0;
    for (const s of servants) {
      const m = marks[s.id];
      if (m === "present") present++;
      else if (m === "absent") absent++;
      else if (m === "excused") excused++;
      else unmarked++;
    }
    return { present, absent, excused, unmarked, total: servants.length };
  }, [servants, marks]);

  function setAll(status: Status) {
    const next: Record<string, Status | ""> = {};
    for (const s of servants) next[s.id] = status;
    setMarks(next);
  }

  function clearAll() {
    const next: Record<string, Status | ""> = {};
    for (const s of servants) next[s.id] = "";
    setMarks(next);
  }

  async function save() {
    setLoading(true);
    setMessage(null);
    setError(null);

    const rows = servants
      .filter((s) => marks[s.id])
      .map((s) => ({
        servant_id: s.id,
        attendance_date: date,
        status: marks[s.id] as Status,
        gathering_type: "regular" as const,
      }));

    if (rows.length === 0) {
      setError("ምንም ምልክት አልተመረጠም። እባክዎ ተገኝቷል / አልተገኘም ይምረጡ።");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { error: upErr } = await supabase.from("servant_attendance").upsert(
        rows,
        { onConflict: "servant_id,attendance_date,gathering_type" }
      );

      if (upErr) {
        let msg = upErr.message || "መቀመጥ አልተሳካም";
        if (/policy|permission|RLS|row-level|denied/i.test(msg)) {
          msg =
            "ፈቃድ የለም። Admin መሆንዎን ያረጋግጡ ወይም migration 009 (servant_attendance RLS) ያሂዱ።";
        } else if (/relation|does not exist|table/i.test(msg)) {
          msg = "ሠንጠረዥ servant_attendance የለም። SQL migration 009 ያሂዱ።";
        }
        setError(msg);
        setLoading(false);
        return;
      }

      setMessage(`ተቀምጧል · ${rows.length} አገልጋይ · ${date}`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "ስህተት ተከስቷል");
    }
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <Stat label="ጠቅላላ" value={stats.total} />
        <Stat label="ተገኝቷል" value={stats.present} tone="green" />
        <Stat label="አልተገኘም" value={stats.absent} tone="red" />
        <Stat label="ያልተመረጠ" value={stats.unmarked} tone="muted" />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setAll("present")}
          className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs amharic text-emerald-800"
        >
          ሁሉንም ተገኝቷል
        </button>
        <button
          type="button"
          onClick={() => setAll("absent")}
          className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-xs amharic text-red-800"
        >
          ሁሉንም አልተገኘም
        </button>
        <button
          type="button"
          onClick={() => setAll("excused")}
          className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs amharic"
        >
          ሁሉንም በፈቃድ
        </button>
        <button
          type="button"
          onClick={clearAll}
          className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs amharic"
        >
          አጽዳ
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={save}
          className="rounded-lg bg-[var(--primary)] text-white px-4 py-1.5 text-xs font-semibold disabled:opacity-50 amharic"
        >
          {loading ? "በመቀመጥ…" : "አስቀምጥ"}
        </button>
      </div>

      {message && (
        <p className="text-sm text-emerald-700 amharic rounded-lg bg-emerald-500/10 px-3 py-2">
          {message}
        </p>
      )}
      {error && (
        <p className="text-sm text-red-700 amharic rounded-lg bg-red-500/10 px-3 py-2 whitespace-pre-wrap">
          {error}
        </p>
      )}

      {servants.length > 5 && (
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ስም ወይም ስልክ ፈልግ…"
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm amharic"
        />
      )}

      <ul className="space-y-2">
        {filtered.map((s) => {
          const mark = marks[s.id] ?? "";
          const border =
            mark === "present"
              ? "border-emerald-500/40 bg-emerald-500/5"
              : mark === "absent"
                ? "border-red-500/40 bg-red-500/5"
                : mark === "excused"
                  ? "border-amber-500/40 bg-amber-500/5"
                  : "border-[var(--border)] bg-[var(--card)]";
          return (
            <li
              key={s.id}
              className={`flex flex-wrap items-center justify-between gap-2 rounded-xl border px-3 py-2.5 ${border}`}
            >
              <div className="min-w-0">
                <p className="text-sm font-medium amharic">{s.full_name_am}</p>
                {s.phone && (
                  <p className="text-xs text-[var(--foreground)]/50">{s.phone}</p>
                )}
              </div>
              <div className="flex items-center gap-1">
                {(["present", "absent", "excused"] as Status[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() =>
                      setMarks((m) => ({
                        ...m,
                        [s.id]: m[s.id] === st ? "" : st,
                      }))
                    }
                    className={`rounded-lg px-2.5 py-1 text-[11px] amharic border transition ${
                      mark === st
                        ? st === "present"
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : st === "absent"
                            ? "bg-red-600 text-white border-red-600"
                            : "bg-amber-600 text-white border-amber-600"
                        : "border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]/70"
                    }`}
                  >
                    {STATUS_LABEL[st]}
                  </button>
                ))}
              </div>
            </li>
          );
        })}
        {filtered.length === 0 && (
          <li className="text-center text-sm text-[var(--foreground)]/50 py-8 amharic">
            {servants.length === 0
              ? "ንቁ አገልጋይ የለም። ከአባልነት ገጽ አገልጋይ ያክሉ።"
              : "ውጤት የለም።"}
          </li>
        )}
      </ul>
    </div>
  );
}

function Stat({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: number;
  tone?: "default" | "green" | "red" | "muted";
}) {
  const toneCls =
    tone === "green"
      ? "bg-emerald-500/10 text-emerald-800"
      : tone === "red"
        ? "bg-red-500/10 text-red-800"
        : tone === "muted"
          ? "bg-[var(--muted)]/40 text-[var(--foreground)]/60"
          : "bg-[var(--card)] text-[var(--foreground)]";
  return (
    <div className={`rounded-xl border border-[var(--border)] px-3 py-2 ${toneCls}`}>
      <p className="text-[10px] amharic opacity-70">{label}</p>
      <p className="text-lg font-bold tabular-nums">{value}</p>
    </div>
  );
}
