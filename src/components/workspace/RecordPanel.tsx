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
  const [titleAm, setTitleAm] = useState("");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("department_records")
      .insert({
        department_code: departmentCode,
        record_type: recordType,
        title_am: titleAm.trim(),
        body: body || null,
      })
      .select("id, title_am, record_type, record_date, body")
      .single();
    setSaving(false);
    if (!error && data) {
      setRows((list) => [data as Rec, ...list]);
      setTitleAm("");
      setBody("");
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold amharic text-[var(--primary)]">{title}</h3>
      <form onSubmit={onSubmit} className="space-y-2 rounded-2xl border border-[var(--border)] p-4">
        <input required value={titleAm} onChange={(e) => setTitleAm(e.target.value)} placeholder="ርዕስ…"
          className="w-full rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm amharic" />
        <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} placeholder="ዝርዝር…"
          className="w-full rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm amharic" />
        <button type="submit" disabled={saving}
          className="w-full rounded-xl bg-[var(--primary)] py-2.5 text-sm font-medium text-white disabled:opacity-50">
          መዝግብ
        </button>
      </form>
      <ul className="space-y-2">
        {rows.length === 0 && (
          <li className="text-center text-sm text-[var(--foreground)]/50 amharic py-6">ምንም መዝገብ የለም</li>
        )}
        {rows.map((r) => (
          <li key={r.id} className="rounded-xl border border-[var(--border)] px-3 py-3">
            <p className="text-sm font-medium amharic">{r.title_am}</p>
            {r.body && <p className="mt-1 text-xs text-[var(--foreground)]/60 amharic">{r.body}</p>}
            <p className="mt-1 text-[10px] text-[var(--foreground)]/40">{r.record_date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
