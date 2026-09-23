"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Rec = {
  id: string;
  title_am: string;
  record_type: string;
  record_date: string;
  body: string | null;
};

export function RecordPanel({
  departmentCode,
  recordType,
  title,
  initial,
}: {
  departmentCode: string;
  recordType: string;
  title: string;
  initial: Rec[];
}) {
  const [rows, setRows] = useState(initial);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);

  async function onAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("department_records")
      .insert({
        department_code: departmentCode,
        record_type: recordType,
        title_am: name.trim(),
        body: body || null,
        record_date: new Date().toISOString().slice(0, 10),
      })
      .select("id, title_am, record_type, record_date, body")
      .single();
    setSaving(false);
    if (!error && data) {
      setRows((list) => [data as Rec, ...list]);
      setName("");
      setBody("");
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold amharic text-[var(--primary)]">{title}</h3>
      <form onSubmit={onAdd} className="space-y-2 rounded-2xl border border-[var(--border)] p-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ርዕስ…"
          required
          className="w-full rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm amharic"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="ዝርዝር…"
          rows={3}
          className="w-full rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm amharic"
        />
        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-xl bg-[var(--primary)] py-2.5 text-sm font-medium text-white disabled:opacity-50"
        >
          መዝግብ
        </button>
      </form>
      <ul className="space-y-2">
        {rows.map((r) => (
          <li key={r.id} className="rounded-xl border border-[var(--border)] px-3 py-3">
            <p className="text-sm font-medium amharic">{r.title_am}</p>
            <p className="text-[11px] text-[var(--foreground)]/45">{r.record_date}</p>
            {r.body && (
              <p className="mt-1 text-xs amharic text-[var(--foreground)]/70 line-clamp-2">
                {r.body}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
