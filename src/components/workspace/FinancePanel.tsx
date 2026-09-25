"use client";

import { useState } from "react";
import { insertRow, updateRow, deleteRow } from "@/lib/workspace/crud";
import { Plus, Trash2 } from "lucide-react";

type Entry = {
  id: string;
  entry_type: string;
  category: string | null;
  amount_birr: number;
  description_am: string | null;
  entry_date: string | null;
};

export function FinancePanel({
  departmentCode,
  initial,
}: {
  departmentCode: string;
  initial: Entry[];
}) {
  const [rows, setRows] = useState(initial);
  const [entryType, setEntryType] = useState("income");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const totalIn = rows
    .filter((r) => r.entry_type === "income")
    .reduce((s, r) => s + Number(r.amount_birr || 0), 0);
  const totalOut = rows
    .filter((r) => r.entry_type === "expense")
    .reduce((s, r) => s + Number(r.amount_birr || 0), 0);

  async function onAdd(e: React.FormEvent) {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) {
      setErr("ትክክለኛ መጠን ያስገቡ");
      return;
    }
    setSaving(true);
    setErr(null);
    setMsg(null);
    const { data, error } = await insertRow<Entry>(
      "department_finance",
      {
        department_code: departmentCode,
        entry_type: entryType,
        category: category.trim() || null,
        amount_birr: amt,
        description_am: desc.trim() || null,
        entry_date: date || null,
      },
      "id, entry_type, category, amount_birr, description_am, entry_date"
    );
    setSaving(false);
    if (error) {
      setErr(error);
      return;
    }
    if (data) setRows((r) => [data, ...r]);
    setAmount("");
    setDesc("");
    setCategory("");
    setMsg("ተመዝግቧል");
  }

  async function remove(id: string) {
    if (!confirm("ይህን መዝገብ ማጥፋት ይፈልጋሉ?")) return;
    const { error } = await deleteRow("department_finance", id);
    if (error) {
      setErr(error);
      return;
    }
    setRows((r) => r.filter((x) => x.id !== id));
  }

  async function toggleType(id: string, current: string) {
    const next = current === "income" ? "expense" : "income";
    const { error } = await updateRow("department_finance", id, {
      entry_type: next,
    });
    if (error) {
      setErr(error);
      return;
    }
    setRows((r) =>
      r.map((x) => (x.id === id ? { ...x, entry_type: next } : x))
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3">
          <p className="text-[11px] text-emerald-800 amharic">ገቢ</p>
          <p className="text-lg font-bold text-emerald-900">
            {totalIn.toLocaleString()} ብር
          </p>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50/50 p-3">
          <p className="text-[11px] text-red-800 amharic">ወጪ</p>
          <p className="text-lg font-bold text-red-900">
            {totalOut.toLocaleString()} ብር
          </p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 col-span-2 sm:col-span-1">
          <p className="text-[11px] text-[var(--foreground)]/50 amharic">ቀሪ</p>
          <p className="text-lg font-bold text-[var(--primary)]">
            {(totalIn - totalOut).toLocaleString()} ብር
          </p>
        </div>
      </div>

      <form
        onSubmit={onAdd}
        className="space-y-2 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4"
      >
        <p className="text-sm font-semibold amharic text-[var(--primary)]">
          አዲስ መግቢያ
        </p>
        <div className="flex flex-wrap gap-2">
          <select
            value={entryType}
            onChange={(e) => setEntryType(e.target.value)}
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm amharic"
          >
            <option value="income">ገቢ</option>
            <option value="expense">ወጪ</option>
          </select>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="ምድብ"
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm amharic"
          />
          <input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="መጠን (ብር)"
            required
            className="w-28 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
          />
        </div>
        <input
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="መግለጫ…"
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
          <li
            key={r.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--border)] p-3"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium amharic">
                {r.description_am || r.category || "—"}
              </p>
              <p className="text-[11px] text-[var(--foreground)]/45">
                {r.entry_date} · {r.category || ""}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggleType(r.id, r.entry_type)}
                className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                  r.entry_type === "income"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {r.entry_type === "income" ? "ገቢ" : "ወጪ"}{" "}
                {Number(r.amount_birr).toLocaleString()}
              </button>
              <button
                type="button"
                onClick={() => remove(r.id)}
                className="rounded-lg bg-red-600/90 p-1.5 text-white"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </li>
        ))}
        {rows.length === 0 && (
          <p className="text-sm text-[var(--foreground)]/50 amharic">
            ምንም መዝገብ የለም።
          </p>
        )}
      </ul>
    </div>
  );
}
