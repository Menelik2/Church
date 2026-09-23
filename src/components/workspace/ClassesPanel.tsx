"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatAppError, type AppError } from "@/lib/errors";
import { ErrorBanner, SuccessBanner } from "@/components/ui/ErrorBanner";
import { Plus } from "lucide-react";

type ClassRow = {
  id: string;
  title_am: string;
  level_am: string | null;
  schedule_note: string | null;
  teacher_name: string | null;
  is_active: boolean;
};

type AttendanceRow = {
  id: string;
  class_id: string;
  attendance_date: string;
  present_count: number;
  notes: string | null;
};

export function ClassesPanel({
  initialClasses,
  initialAttendance,
}: {
  initialClasses: ClassRow[];
  initialAttendance: AttendanceRow[];
}) {
  const [classes, setClasses] = useState(initialClasses);
  const [attendance, setAttendance] = useState(initialAttendance);
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState("");
  const [teacher, setTeacher] = useState("");
  const [classId, setClassId] = useState("");
  const [present, setPresent] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  async function addClass(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    setError(null);
    setOk(null);
    try {
      const supabase = createClient();
      const { data, error: dbErr } = await supabase
        .from("education_classes")
        .insert({
          title_am: title.trim(),
          level_am: level.trim() || null,
          teacher_name: teacher.trim() || null,
          is_active: true,
        })
        .select("id, title_am, level_am, schedule_note, teacher_name, is_active")
        .single();
      if (dbErr) {
        setError(formatAppError(dbErr));
        return;
      }
      if (data) setClasses((c) => [data as ClassRow, ...c]);
      setTitle("");
      setLevel("");
      setTeacher("");
      setOk("ክፍሉ ተመዝግቧል");
    } catch (err) {
      setError(formatAppError(err));
    } finally {
      setSaving(false);
    }
  }

  async function addAttendance(e: React.FormEvent) {
    e.preventDefault();
    if (!classId || !present.trim()) return;
    setSaving(true);
    setError(null);
    setOk(null);
    try {
      const supabase = createClient();
      const { data, error: dbErr } = await supabase
        .from("class_attendance")
        .insert({
          class_id: classId,
          present_count: Number(present) || 0,
          attendance_date: new Date().toISOString().slice(0, 10),
        })
        .select("id, class_id, attendance_date, present_count, notes")
        .single();
      if (dbErr) {
        setError(formatAppError(dbErr));
        return;
      }
      if (data) setAttendance((a) => [data as AttendanceRow, ...a]);
      setPresent("");
      setOk("መገኘት ተመዝግቧል");
    } catch (err) {
      setError(formatAppError(err));
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(id: string, is_active: boolean) {
    setError(null);
    try {
      const supabase = createClient();
      const { error: dbErr } = await supabase
        .from("education_classes")
        .update({ is_active: !is_active })
        .eq("id", id);
      if (dbErr) {
        setError(formatAppError(dbErr));
        return;
      }
      setClasses((list) =>
        list.map((c) => (c.id === id ? { ...c, is_active: !is_active } : c))
      );
    } catch (err) {
      setError(formatAppError(err));
    }
  }

  const className = (id: string) =>
    classes.find((c) => c.id === id)?.title_am ?? "—";

  return (
    <div className="space-y-8">
      {error && <ErrorBanner error={error} onDismiss={() => setError(null)} />}
      {ok && <SuccessBanner message={ok} />}

      <section>
        <h3 className="text-sm font-semibold amharic mb-3">የትምህርት ክፍሎች</h3>
        <form onSubmit={addClass} className="grid gap-2 sm:grid-cols-4 mb-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="የክፍል ስም…"
            className="sm:col-span-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm amharic"
          />
          <input
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            placeholder="ደረጃ (ምሳ. 1ኛ)"
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm amharic"
          />
          <input
            value={teacher}
            onChange={(e) => setTeacher(e.target.value)}
            placeholder="መምህር"
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm amharic"
          />
          <button
            type="submit"
            disabled={saving}
            className="sm:col-span-4 inline-flex items-center justify-center gap-1 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
          >
            <Plus className="h-4 w-4" /> ክፍል አክል
          </button>
        </form>
        <ul className="space-y-2">
          {classes.length === 0 && (
            <li className="text-sm text-[var(--foreground)]/50 amharic py-4 text-center">
              ምንም ክፍል የለም
            </li>
          )}
          {classes.map((c) => (
            <li
              key={c.id}
              className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-3"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium amharic">{c.title_am}</p>
                <p className="text-[11px] text-[var(--foreground)]/45 amharic">
                  {[c.level_am, c.teacher_name].filter(Boolean).join(" · ") ||
                    "—"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => toggleActive(c.id, c.is_active)}
                className={
                  c.is_active
                    ? "text-xs rounded-lg bg-emerald-500/15 text-emerald-700 px-2 py-1 amharic"
                    : "text-xs rounded-lg bg-[var(--muted)] text-[var(--foreground)]/50 px-2 py-1 amharic"
                }
              >
                {c.is_active ? "ንቁ" : "ቦዝኗል"}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="text-sm font-semibold amharic mb-3">የቀን መገኘት</h3>
        <form onSubmit={addAttendance} className="flex flex-wrap gap-2 mb-4">
          <select
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm amharic min-w-[10rem]"
          >
            <option value="">ክፍል ምረጥ</option>
            {classes
              .filter((c) => c.is_active)
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title_am}
                </option>
              ))}
          </select>
          <input
            type="number"
            min={0}
            value={present}
            onChange={(e) => setPresent(e.target.value)}
            placeholder="የተገኙ ቁጥር"
            className="w-28 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm"
          />
          <button
            type="submit"
            disabled={saving || !classId}
            className="inline-flex items-center gap-1 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
          >
            መዝግብ
          </button>
        </form>
        <ul className="space-y-2">
          {attendance.slice(0, 20).map((a) => (
            <li
              key={a.id}
              className="flex justify-between rounded-xl border border-[var(--border)] px-3 py-2 text-sm amharic"
            >
              <span>
                {className(a.class_id)} · {a.attendance_date}
              </span>
              <span className="tabular-nums font-medium">{a.present_count}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
