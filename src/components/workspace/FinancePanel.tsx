"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Entry = {
  id: string;
  entry_type: string;
  category: string;
  amount_birr: number;
  description_am: string | null;
  entry_date: string;
};

export function FinancePanel({ initial }: { initial: Entry[] }) {
  const [entries, setEntries] = useState(initial);
  const [entryType, setEntryType] = useState<"income" | "expense">("income");
  const [category, setCategory] = useState("monthly_contribution");
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const income = entries
    .filter((e) => e.entry_type === "income")
    .reduce((s, e) => s + Number(e.amount_birr), 0);
  const expense = entries
    .filter((e) => e.entry_type === "expense")
    .reduce((s, e) => s + Number(e.amount_birr), 0);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("finance_entries")
      .insert({
        entry_type: entryType,
        category,
        amount_birr: Number(amount),
        description_am: desc || null,
      })
      .select("id, entry_type, category, amount_birr, description_am, entry_date")
      .single();
    setSaving(false);
    if (error) {
      setMsg(error.message);
      return;
    }
    if (data) setEntries((list) => [data as Entry, ...list]);
    setAmount("");
    setDesc("");
    setMsg("ተመዝግቧል");
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3 text-center">
          <p className="text-[10px] amharic text-emerald-700">ገቢ</p>
          <p className="text-lg font-bold tabular-nums text-emerald-800">{income.toFixed(0)}</p>
        </div>
        <div className="rounded-xl bg-red-50 border border-red-100 p-3 text-center">
          <p className="text-[10px] amharic text-red-700">ወጪ</p>
          <p className="text-lg font-bold tabular-nums text-red-800">{expense.toFixed(0)}</p>
        </div>
        <div className="rounded-xl bg-[var(--muted)] border border-[var(--border)] p-3 text-center">
          <p className="text-[10px] amharic text-[var(--foreground)]/60">ቀሪ</p>
          <p className="text-lg font-bold tabular-nums">{(income - expense).toFixed(0)}</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-3 rounded-2xl border border-[var(--border)] p-4">
        <div className="grid grid-cols-2 gap-2">
          <select value={entryType} onChange={(e) => setEntryType(e.target.value as "income" | "expense")}
            className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm amharic">
            <option value="income">ገቢ</option>
            <option value="expense">ወጪ</option>
          </select>
          <select value={category} onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm amharic">
            <option value="monthly_contribution">ወርሃዊ መዋጮ</option>
            <option value="donation">ስጦታ</option>
            <option value="expense_ops">የስራ ወጪ</option>
            <option value="charity">በጎ አድራጎት</option>
            <option value="other">ሌላ</option>
          </select>
        </div>
        <input type="number" step="0.01" required value={amount} onChange={(e) => setAmount(e.target.value)}
          placeholder="መጠን (ብር)" className="w-full rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm" />
        <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="መግለጫ…"
          className="w-full rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm amharic" />
        <button type="submit" disabled={saving}
          className="w-full rounded-xl bg-[var(--primary)] py-2.5 text-sm font-medium text-white disabled:opacity-50">
          {saving ? "በማስቀመጥ…" : "መዝግብ"}
        </button>
        {msg && <p className="text-xs text-emerald-600 amharic">{msg}</p>}
      </form>

      <ul className="space-y-2">
        {entries.map((e) => (
          <li key={e.id} className="flex justify-between rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm">
            <span className="amharic">{e.description_am || e.category}</span>
            <span className={e.entry_type === "income" ? "text-emerald-700 font-semibold" : "text-red-700 font-semibold"}>
              {e.entry_type === "income" ? "+" : "-"}{Number(e.amount_birr).toFixed(0)} ብር
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
