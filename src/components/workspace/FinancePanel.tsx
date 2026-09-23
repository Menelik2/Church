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
  const [type, setType] = useState<"income" | "expense">("income");
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

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return;
    setSaving(true);
    setMsg(null);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("finance_entries")
      .insert({
        entry_type: type,
        category,
        amount_birr: amt,
        description_am: desc || null,
        entry_date: new Date().toISOString().slice(0, 10),
      })
      .select("*")
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
          <p className="text-[10px] text-emerald-700 amharic">ገቢ</p>
          <p className="text-lg font-bold tabular-nums text-emerald-800">
            {income.toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl bg-red-50 border border-red-100 p-3 text-center">
          <p className="text-[10px] text-red-700 amharic">ወጪ</p>
          <p className="text-lg font-bold tabular-nums text-red-800">
            {expense.toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl bg-[var(--muted)] border border-[var(--border)] p-3 text-center">
          <p className="text-[10px] text-[var(--foreground)]/60 amharic">ቀሪ</p>
          <p className="text-lg font-bold tabular-nums">
            {(income - expense).toLocaleString()}
          </p>
        </div>
      </div>

      <form onSubmit={onSave} className="space-y-3 rounded-2xl border border-[var(--border)] p-4">
        <div className="grid grid-cols-2 gap-2">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as "income" | "expense")}
            className="rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm"
          >
            <option value="income">ገቢ</option>
            <option value="expense">ወጪ</option>
          </select>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm"
          >
            <option value="monthly_contribution">ወርሃዊ መዋጮ</option>
            <option value="donation">ስጦታ</option>
            <option value="expense_ops">የስራ ወጪ</option>
            <option value="charity">በጎ አድራጎት</option>
            <option value="other">ሌላ</option>
          </select>
        </div>
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="መጠን (ብር)"
          required
          className="w-full rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm"
        />
        <input
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="መግለጫ…"
          className="w-full rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm amharic"
        />
        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-xl bg-[var(--primary)] py-2.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {saving ? "በማስቀመጥ…" : "መዝግብ"}
        </button>
        {msg && <p className="text-xs text-emerald-600">{msg}</p>}
      </form>

      <ul className="space-y-2 max-h-64 overflow-y-auto">
        {entries.map((e) => (
          <li
            key={e.id}
            className="flex justify-between gap-2 rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
          >
            <span className="amharic truncate">
              {e.description_am || e.category}
            </span>
            <span
              className={
                e.entry_type === "income"
                  ? "text-emerald-700 font-semibold tabular-nums"
                  : "text-red-700 font-semibold tabular-nums"
              }
            >
              {e.entry_type === "income" ? "+" : "-"}
              {Number(e.amount_birr).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
