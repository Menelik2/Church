"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus } from "lucide-react";

type Task = {
  id: string;
  title_am: string;
  status: string;
  priority: string;
  due_date: string | null;
};

export function TaskPanel({
  departmentCode,
  initial,
}: {
  departmentCode: string;
  initial: Task[];
}) {
  const [tasks, setTasks] = useState(initial);
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function addTask(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    setMsg(null);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("department_tasks")
      .insert({
        department_code: departmentCode,
        title_am: title.trim(),
        status: "open",
        priority: "normal",
      })
      .select("id, title_am, status, priority, due_date")
      .single();
    setSaving(false);
    if (error) {
      setMsg(error.message);
      return;
    }
    if (data) setTasks((t) => [data as Task, ...t]);
    setTitle("");
    setMsg("ተመዝግቧል");
  }

  async function setStatus(id: string, status: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from("department_tasks")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (!error) {
      setTasks((list) =>
        list.map((t) => (t.id === id ? { ...t, status } : t))
      );
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={addTask} className="flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="አዲስ ተግባር…"
          className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm amharic"
        />
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-1 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
        >
          <Plus className="h-4 w-4" /> አክል
        </button>
      </form>
      {msg && (
        <p className="text-xs text-emerald-600 amharic">{msg}</p>
      )}
      <ul className="space-y-2">
        {tasks.length === 0 && (
          <li className="text-sm text-[var(--foreground)]/50 amharic py-6 text-center">
            ምንም ተግባር የለም
          </li>
        )}
        {tasks.map((t) => (
          <li
            key={t.id}
            className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-3"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium amharic truncate">{t.title_am}</p>
              <p className="text-[11px] text-[var(--foreground)]/45">
                {t.priority} · {t.status}
              </p>
            </div>
            <select
              value={t.status}
              onChange={(e) => setStatus(t.id, e.target.value)}
              className="rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs px-2 py-1.5"
            >
              <option value="open">ክፍት</option>
              <option value="in_progress">በሂደት</option>
              <option value="done">ተጠናቋል</option>
              <option value="cancelled">ተሰርዟል</option>
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
}
