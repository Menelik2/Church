"use client";

import { useState } from "react";
import { insertRow, updateRow, deleteRow } from "@/lib/workspace/crud";
import { Plus, Trash2, Pencil, Check, X, Calendar } from "lucide-react";

type Meeting = {
  id: string;
  title_am: string;
  record_type: string;
  record_date: string | null;
  body: string | null;
};

export function MeetingPanel({
  departmentCode,
  initial,
}: {
  departmentCode: string;
  initial: Meeting[];
}) {
  const [rows, setRows] = useState(initial);
  const [titleAm, setTitleAm] = useState("");
  const [body, setBody] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [location, setLocation] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");

  async function onAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!titleAm.trim()) return;
    setSaving(true);
    setErr(null);
    setMsg(null);
    const bodyText = [location.trim() && `ቦታ: ${location.trim()}`, body.trim()]
      .filter(Boolean)
      .join("\n");
    const { data, error } = await insertRow<Meeting>(
      "department_records",
      {
        department_code: departmentCode,
        title_am: titleAm.trim(),
        record_type: "meeting",
        record_date: date || null,
        body: bodyText || null,
      },
      "id, title_am, record_type, record_date, body"
    );
    setSaving(false);
    if (error) {
      setErr(error);
      return;
    }
    if (data) setRows((r) => [data, ...r]);
    setTitleAm("");
    setBody("");
    setLocation("");
    setMsg("ስብሰባ ተመዝግቧል");
  }

  async function saveEdit(id: string) {
    const { error } = await updateRow("department_records", id, {
      title_am: editTitle.trim(),
      body: editBody.trim() || null,
    });
    if (error) {
      setErr(error);
      return;
    }
    setRows((r) =>
      r.map((x) =>
        x.id === id
          ? { ...x, title_am: editTitle.trim(), body: editBody.trim() || null }
          : x
      )
    );
    setEditId(null);
  }

  async function remove(id: string) {
    if (!confirm("ይህን ስብሰባ ማጥፋት ይፈልጋሉ?")) return;
    const { error } = await deleteRow("department_records", id);
    if (error) {
      setErr(error);
      return;
    }
    setRows((r) => r.filter((x) => x.id !== id));
  }

  return (
    <div className="space-y-4">
      <form
        onSubmit={onAdd}
        className="space-y-2 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4"
      >
        <p className="text-sm font-semibold amharic text-[var(--primary)] flex items-center gap-1.5">
          <Calendar className="h-4 w-4" /> አዲስ ስብሰባ
        </p>
        <input
          value={titleAm}
          onChange={(e) => setTitleAm(e.target.value)}
          placeholder="ርዕስ (ለም. ሳምንታዊ ስብሰባ)"
          required
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm amharic"
        />
        <div className="flex flex-wrap gap-2">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
          />
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="ቦታ"
            className="flex-1 min-w-[8rem] rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm amharic"
          />
        </div>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="ደቂቃ / ውሳኔዎች…"
          rows={3}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm amharic"
        />
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-1 rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 amharic"
        >
          <Plus className="h-4 w-4" />
          {saving ? "…" : "ጨምር"}
        </button>
      </form>

      {msg && <p className="text-sm text-emerald-600 amharic">{msg}</p>}
      {err && <p className="text-sm text-red-600 amharic">{err}</p>}

      <ul className="space-y-2">
        {rows.map((r) => (
          <li key={r.id} className="rounded-xl border border-[var(--border)] p-3">
            {editId === r.id ? (
              <div className="space-y-2">
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full rounded-lg border px-2 py-1 text-sm amharic"
                />
                <textarea
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border px-2 py-1 text-sm amharic"
                />
                <div className="flex gap-1">
                  <button type="button" onClick={() => saveEdit(r.id)} className="rounded-lg bg-emerald-600 p-1.5 text-white">
                    <Check className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" onClick={() => setEditId(null)} className="rounded-lg border p-1.5">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium amharic text-sm">{r.title_am}</p>
                  {r.body && (
                    <p className="mt-1 text-xs text-[var(--foreground)]/60 amharic whitespace-pre-line line-clamp-4">
                      {r.body}
                    </p>
                  )}
                  <p className="mt-1 text-[11px] text-[var(--foreground)]/40">{r.record_date}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setEditId(r.id);
                      setEditTitle(r.title_am);
                      setEditBody(r.body || "");
                    }}
                    className="rounded-lg border p-1.5"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" onClick={() => remove(r.id)} className="rounded-lg bg-red-600/90 p-1.5 text-white">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
        {rows.length === 0 && (
          <p className="text-sm text-[var(--foreground)]/50 amharic">ምንም ስብሰባ የለም።</p>
        )}
      </ul>
    </div>
  );
}
