"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatAppError, type AppError } from "@/lib/errors";
import { ErrorBanner, SuccessBanner } from "@/components/ui/ErrorBanner";

type RegisterRow = {
  id: string;
  full_name_am: string;
  phone: string | null;
  registered_at: string | null;
  status: string;
  course_enrollment_id: string | null;
};

type CourseRow = {
  id: string;
  full_name_am: string;
  course_name: string;
  status: string;
  started_at: string | null;
  completed_at: string | null;
};

export function RelationsPanel({
  initialRegister,
  initialCourses,
}: {
  initialRegister: RegisterRow[];
  initialCourses: CourseRow[];
}) {
  const [register, setRegister] = useState(initialRegister);
  const [courses, setCourses] = useState(initialCourses);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [courseName, setCourseName] = useState("ተከታታይ ትምህርት");
  const [enrollName, setEnrollName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  async function addRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data, error: dbErr } = await supabase
        .from("new_member_register")
        .insert({
          full_name_am: name.trim(),
          phone: phone.trim() || null,
          status: "registered",
        })
        .select(
          "id, full_name_am, phone, registered_at, status, course_enrollment_id"
        )
        .single();
      if (dbErr) {
        setError(formatAppError(dbErr));
        return;
      }
      if (data) setRegister((r) => [data as RegisterRow, ...r]);
      setName("");
      setPhone("");
      setOk("በመመዝገቢያ ተመዝግቧል");
    } catch (err) {
      setError(formatAppError(err));
    } finally {
      setSaving(false);
    }
  }

  async function enroll(e: React.FormEvent) {
    e.preventDefault();
    if (!enrollName.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data, error: dbErr } = await supabase
        .from("course_enrollments")
        .insert({
          full_name_am: enrollName.trim(),
          course_name: courseName.trim() || "ተከታታይ ትምህርት",
          status: "enrolled",
        })
        .select(
          "id, full_name_am, course_name, status, started_at, completed_at"
        )
        .single();
      if (dbErr) {
        setError(formatAppError(dbErr));
        return;
      }
      if (data) {
        setCourses((c) => [data as CourseRow, ...c]);
        // link register row if name matches
        const match = register.find(
          (r) =>
            r.full_name_am === enrollName.trim() &&
            !r.course_enrollment_id
        );
        if (match) {
          await supabase
            .from("new_member_register")
            .update({
              course_enrollment_id: data.id,
              status: "in_course",
            })
            .eq("id", match.id);
          setRegister((list) =>
            list.map((r) =>
              r.id === match.id
                ? {
                    ...r,
                    course_enrollment_id: data.id,
                    status: "in_course",
                  }
                : r
            )
          );
        }
      }
      setEnrollName("");
      setOk("በኮርስ ተመዝግቧል");
    } catch (err) {
      setError(formatAppError(err));
    } finally {
      setSaving(false);
    }
  }

  async function completeCourse(id: string) {
    setError(null);
    try {
      const supabase = createClient();
      const today = new Date().toISOString().slice(0, 10);
      const { error: dbErr } = await supabase
        .from("course_enrollments")
        .update({ status: "completed", completed_at: today })
        .eq("id", id);
      if (dbErr) {
        setError(formatAppError(dbErr));
        return;
      }
      setCourses((list) =>
        list.map((c) =>
          c.id === id
            ? { ...c, status: "completed", completed_at: today }
            : c
        )
      );
      await supabase
        .from("new_member_register")
        .update({ status: "graduated" })
        .eq("course_enrollment_id", id);
      setRegister((list) =>
        list.map((r) =>
          r.course_enrollment_id === id
            ? { ...r, status: "graduated" }
            : r
        )
      );
      setOk("ኮርስ ተጠናቋል");
    } catch (err) {
      setError(formatAppError(err));
    }
  }

  const statusAm: Record<string, string> = {
    registered: "ተመዝግቧል",
    in_course: "በኮርስ",
    graduated: "ተመርቋል",
    inactive: "ቦዝኗል",
    enrolled: "ተመዝግቧል",
    completed: "ተጠናቋል",
    dropped: "አቋርጧል",
  };

  return (
    <div className="space-y-8">
      {error && <ErrorBanner error={error} onDismiss={() => setError(null)} />}
      {ok && <SuccessBanner message={ok} />}

      <section>
        <h3 className="text-sm font-semibold amharic mb-2">
          አዲስ አባላት መመዝገቢያ
        </h3>
        <form onSubmit={addRegister} className="flex flex-wrap gap-2 mb-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ሙሉ ስም"
            className="flex-1 rounded-xl border border-[var(--border)] px-3 py-2 text-sm amharic"
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="ስልክ"
            className="w-36 rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm text-white"
          >
            መዝግብ
          </button>
        </form>
        <ul className="space-y-2">
          {register.map((r) => (
            <li
              key={r.id}
              className="flex justify-between rounded-xl border border-[var(--border)] px-3 py-2 text-sm amharic"
            >
              <span>
                {r.full_name_am}
                {r.phone ? (
                  <span className="text-[var(--foreground)]/45 text-xs ml-2">
                    {r.phone}
                  </span>
                ) : null}
              </span>
              <span className="text-xs text-[var(--primary)]">
                {statusAm[r.status] ?? r.status}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="text-sm font-semibold amharic mb-2">የኮርስ ክትትል</h3>
        <form onSubmit={enroll} className="flex flex-wrap gap-2 mb-3">
          <input
            value={enrollName}
            onChange={(e) => setEnrollName(e.target.value)}
            placeholder="ስም (ከመመዝገቢያ ጋር ይጣጣም)"
            className="flex-1 rounded-xl border border-[var(--border)] px-3 py-2 text-sm amharic"
          />
          <input
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            className="w-40 rounded-xl border border-[var(--border)] px-3 py-2 text-sm amharic"
          />
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm text-white"
          >
            አስመዝግብ
          </button>
        </form>
        <ul className="space-y-2">
          {courses.map((c) => (
            <li
              key={c.id}
              className="flex flex-wrap items-center gap-2 rounded-xl border border-[var(--border)] px-3 py-2 text-sm amharic"
            >
              <div className="flex-1">
                <p className="font-medium">{c.full_name_am}</p>
                <p className="text-[11px] text-[var(--foreground)]/45">
                  {c.course_name} · {statusAm[c.status] ?? c.status}
                </p>
              </div>
              {c.status === "enrolled" && (
                <button
                  type="button"
                  onClick={() => completeCourse(c.id)}
                  className="rounded-lg bg-emerald-700 text-white text-xs px-3 py-1.5"
                >
                  አጠናቅ
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
