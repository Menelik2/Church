"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatAppError } from "@/lib/supabase/safe-count";

type ClassRow = {
  id: string;
  title_am: string;
  level_am: string | null;
  schedule_note: string | null;
  teacher_name: string | null;
  is_active: boolean;
};

const LEVELS = [
  { value: "ሕፃናት", label: "ሕፃናት" },
  { value: "ወጣቶች", label: "ወጣቶች" },
  { value: "አዋቂ", label: "አዋቂ" },
];

export function ClassesPanel({ initial }: { initial: ClassRow[] }) {
  const [rows, setRows] = useState(initial);
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState("ወጣቶች");
  const [teacher, setTeacher] = useState("");
  const [schedule, setSchedule] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function onAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    setMsg(null);
    setErr(null);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("education_classes")
        .insert({
          title_am: title.trim(),
          level_am: level || null,
          teacher_name: teacher.trim() || null,
          schedule_note: schedule.trim() || null,
          is_active: true,
        })
        .select(
          "id, title_am, level_am, schedule_note, teacher_name, is_active"
        )
        .single();
      if (error) throw error;
      if (data) setRows((list) => [data as ClassRow, ...list]);
      setTitle("");
      setTeacher("");
      setSchedule("");
      setMsg("ክፍል ተመዝግቧል");
    } catch (e) {
      setErr(formatAppError(e));
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(id: string, is_active: boolean) {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("education_classes")
        .update({ is_active: !is_active })
        .eq("id", id);
      if (error) throw error;
      setRows((list) =>
        list.map((r) => (r.id === id ? { ...r, is_active: !is_active } : r))
      );
    } catch (e) {
      setErr(formatAppError(e));
    }
  }

  return (
    <div className="space-y-4">
      <form
        onSubmit={onAdd}
        className="space-y-2 rounded-2xl border border-[var(--border)] p-4"
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="የክፍል ስም…"
          required
          className="w-full rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm amharic"
        />
        <div className="grid grid-cols-2 gap-2">
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm amharic"
          >
            {LEVELS.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
          <input
            value={teacher}
            onChange={(e) => setTeacher(e.target.value)}
            placeholder="መምህር…"
            className="rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm amharic"
          />
        </div>
        <input
          value={schedule}
          onChange={(e) => setSchedule(e.target.value)}
          placeholder="መርሐግብር (ለም. እሁድ 10:00)…"
          className="w-full rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm amharic"
        />
        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-xl bg-[var(--primary)] py-2.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {saving ? "በማስቀመጥ…" : "ክፍል አክል"}
        </button>
        {msg && <p className="text-xs text-emerald-600 amharic">{msg}</p>}
        {err && <p className="text-xs text-red-600 amharic">{err}</p>}
      </form>

      <ul className="space-y-2">
        {rows.length === 0 && (
          <li className="text-center text-sm text-[var(--foreground)]/50 amharic py-6">
            ክፍል አልተመዘገበም
          </li>
        )}
        {rows.map((r) => (
          <li
            key={r.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] px-3 py-3"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium amharic truncate">{r.title_am}</p>
              <p className="text-[11px] text-[var(--foreground)]/50 amharic">
                {r.level_am || "—"}
                {r.teacher_name ? ` · ${r.teacher_name}` : ""}
                {r.schedule_note ? ` · ${r.schedule_note}` : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={() => toggleActive(r.id, r.is_active)}
              className={`shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-medium amharic ${
                r.is_active
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                  : "bg-[var(--muted)] text-[var(--foreground)]/50"
              }`}
            >
              {r.is_active ? "ንቁ" : "ቦዘነ"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
