"use client";

import { useState } from "react";
import { insertRow, updateRow, deleteRow } from "@/lib/workspace/crud";
import { Plus, Trash2, Pencil, Check, X } from "lucide-react";

type Task = {
  id: string;
  title_am: string;
  status: string;
  priority: string;
  due_date: string | null;
};

const STATUSES = [
  { v: "open", l: "ክፍት" },
  { v: "in_progress", l: "በሂደት" },
  { v: "done", l: "ተጠናቋል" },
  { v: "cancelled", l: "ተሰርዟል" },
];

export function TaskPanel({
  departmentCode,
  initial,
}: {
  departmentCode: string;
  initial: Task[];
}) {
  const [tasks, setTasks] = useState(initial);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("normal");
  const [due, setDue] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  async function addTask(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    setMsg(null);
    setErr(null);
    const { data, error } = await insertRow<Task>(
      "department_tasks",
      {
        department_code: departmentCode,
        title_am: title.trim(),
        status: "open",
        priority,
        due_date: due || null,
      },
      "id, title_am, status, priority, due_date"
    );
    setSaving(false);
    if (error) {
      setErr(error);
      return;
    }
    if (data) setTasks((t) => [data, ...t]);
    setTitle("");
    setDue("");
    setPriority("normal");
    setMsg("ተመዝግቧል");
  }

  async function setStatus(id: string, status: string) {
    setErr(null);
    const { error } = await updateRow("department_tasks", id, { status });
    if (error) {
      setErr(error);
      return;
    }
    setTasks((list) => list.map((t) => (t.id === id ? { ...t, status } : t)));
  }

  async function saveEdit(id: string) {
    if (!editTitle.trim()) return;
    setErr(null);
    const { error } = await updateRow("department_tasks", id, {
      title_am: editTitle.trim(),
    });
    if (error) {
      setErr(error);
      return;
    }
    setTasks((list) =>
      list.map((t) => (t.id === id ? { ...t, title_am: editTitle.trim() } : t))
    );
    setEditId(null);
  }

  async function remove(id: string) {
    if (!confirm("ይህን ተግባር ማጥፋት ይፈልጋሉ?")) return;
    setErr(null);
    const { error } = await deleteRow("department_tasks", id);
    if (error) {
      setErr(error);
      return;
    }
    setTasks((list) => list.filter((t) => t.id !== id));
  }

  return (
    <div className="space-y-4">
      <form
        onSubmit={addTask}
        className="space-y-2 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4"
      >
        <p className="text-sm font-semibold amharic text-[var(--primary)]">
          አዲስ ተግባር
        </p>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="የተግባር ርዕስ…"
          required
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm amharic"
        />
        <div className="flex flex-wrap gap-2">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm amharic"
          >
            <option value="low">ዝቅተኛ</option>
            <option value="normal">መደበኛ</option>
            <option value="high">ከፍተኛ</option>
          </select>
          <input
            type="date"
            value={due}
            onChange={(e) => setDue(e.target.value)}
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-1 rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 amharic"
          >
            <Plus className="h-4 w-4" />
            {saving ? "…" : "ጨምር"}
          </button>
        </div>
      </form>

      {msg && <p className="text-sm text-emerald-600 amharic">{msg}</p>}
      {err && <p className="text-sm text-red-600 amharic">{err}</p>}

      <ul className="space-y-2">
        {tasks.map((t) => (
          <li
            key={t.id}
            className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                {editId === t.id ? (
                  <div className="flex gap-1">
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="flex-1 rounded-lg border border-[var(--border)] px-2 py-1 text-sm amharic"
                    />
                    <button
                      type="button"
                      onClick={() => saveEdit(t.id)}
                      className="rounded-lg bg-emerald-600 p-1.5 text-white"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditId(null)}
                      className="rounded-lg border p-1.5"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <p className="font-medium amharic text-sm">{t.title_am}</p>
                )}
                <p className="mt-0.5 text-[11px] text-[var(--foreground)]/45">
                  {t.priority}
                  {t.due_date ? ` · ${t.due_date}` : ""}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-1">
                <select
                  value={t.status}
                  onChange={(e) => setStatus(t.id, e.target.value)}
                  className="rounded-lg border border-[var(--border)] px-2 py-1 text-[11px] amharic"
                >
                  {STATUSES.map((s) => (
                    <option key={s.v} value={s.v}>
                      {s.l}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => {
                    setEditId(t.id);
                    setEditTitle(t.title_am);
                  }}
                  className="rounded-lg border border-[var(--border)] p-1.5 hover:bg-[var(--muted)]"
                  title="አርትዕ"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => remove(t.id)}
                  className="rounded-lg bg-red-600/90 p-1.5 text-white"
                  title="ሰርዝ"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </li>
        ))}
        {tasks.length === 0 && (
          <p className="text-sm text-[var(--foreground)]/50 amharic">
            ምንም ተግባር የለም።
          </p>
        )}
      </ul>
    </div>
  );
}
