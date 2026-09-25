"use client";

import { useState } from "react";
import { insertRow, updateRow, deleteRow } from "@/lib/workspace/crud";
import { Plus, Trash2, Minus, Pencil, Check, X } from "lucide-react";

type Item = {
  id: string;
  name_am: string;
  category: string | null;
  quantity: number;
  condition: string | null;
  location: string | null;
  notes?: string | null;
};

const CONDITIONS = [
  { v: "good", l: "ጥሩ" },
  { v: "fair", l: "መካከለኛ" },
  { v: "poor", l: "ደካማ" },
  { v: "lost", l: "ጠፍቷል" },
];

export function InventoryPanel({
  departmentCode,
  initial,
}: {
  departmentCode: string;
  initial: Item[];
}) {
  const [items, setItems] = useState(initial);
  const [name, setName] = useState("");
  const [qty, setQty] = useState("1");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("other");
  const [condition, setCondition] = useState("good");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  async function onAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setErr(null);
    setMsg(null);
    const { data, error } = await insertRow<Item>(
      "department_inventory",
      {
        department_code: departmentCode,
        name_am: name.trim(),
        quantity: parseInt(qty, 10) || 1,
        location: location.trim() || null,
        condition,
        category,
        notes: notes.trim() || null,
      },
      "id, name_am, category, quantity, condition, location, notes"
    );
    setSaving(false);
    if (error) {
      setErr(error);
      return;
    }
    if (data) {
      setItems((list) => [data, ...list]);
      setName("");
      setQty("1");
      setLocation("");
      setNotes("");
      setMsg("ንብረት ተመዝግቧል");
    }
  }

  async function updateCondition(id: string, next: string) {
    const { error } = await updateRow("department_inventory", id, {
      condition: next,
    });
    if (error) {
      setErr(error);
      return;
    }
    setItems((list) =>
      list.map((i) => (i.id === id ? { ...i, condition: next } : i))
    );
  }

  async function updateQty(id: string, delta: number) {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const next = Math.max(0, item.quantity + delta);
    const { error } = await updateRow("department_inventory", id, {
      quantity: next,
    });
    if (error) {
      setErr(error);
      return;
    }
    setItems((list) =>
      list.map((i) => (i.id === id ? { ...i, quantity: next } : i))
    );
  }

  async function saveEdit(id: string) {
    if (!editName.trim()) return;
    const { error } = await updateRow("department_inventory", id, {
      name_am: editName.trim(),
    });
    if (error) {
      setErr(error);
      return;
    }
    setItems((list) =>
      list.map((i) => (i.id === id ? { ...i, name_am: editName.trim() } : i))
    );
    setEditId(null);
  }

  async function remove(id: string) {
    if (!confirm("ይህን ንብረት ማጥፋት ይፈልጋሉ?")) return;
    const { error } = await deleteRow("department_inventory", id);
    if (error) {
      setErr(error);
      return;
    }
    setItems((list) => list.filter((i) => i.id !== id));
  }

  return (
    <div className="space-y-4">
      <form
        onSubmit={onAdd}
        className="space-y-2 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4"
      >
        <p className="text-sm font-semibold amharic text-[var(--primary)]">
          አዲስ ንብረት
        </p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ስም…"
          required
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm amharic"
        />
        <div className="flex flex-wrap gap-2">
          <input
            type="number"
            min="0"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            className="w-20 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm amharic"
          >
            <option value="furniture">የቤት ዕቃ</option>
            <option value="electronics">ኤሌክትሮኒክስ</option>
            <option value="books">መጻሕፍት</option>
            <option value="liturgical">ሥርዓተ አምልኮ</option>
            <option value="other">ሌላ</option>
          </select>
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm amharic"
          >
            {CONDITIONS.map((c) => (
              <option key={c.v} value={c.v}>
                {c.l}
              </option>
            ))}
          </select>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="ቦታ"
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm amharic"
          />
        </div>
        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="ማስታወሻ…"
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
        {items.map((i) => (
          <li key={i.id} className="rounded-xl border border-[var(--border)] p-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                {editId === i.id ? (
                  <div className="flex gap-1">
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 rounded-lg border px-2 py-1 text-sm amharic"
                    />
                    <button
                      type="button"
                      onClick={() => saveEdit(i.id)}
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
                  <p className="font-medium amharic text-sm">{i.name_am}</p>
                )}
                <p className="text-[11px] text-[var(--foreground)]/45">
                  {i.category} · {i.location || "—"}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-1">
                <button
                  type="button"
                  onClick={() => updateQty(i.id, -1)}
                  className="rounded-lg border p-1"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="min-w-[2rem] text-center text-sm font-semibold">
                  {i.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => updateQty(i.id, 1)}
                  className="rounded-lg border p-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
                <select
                  value={i.condition || "good"}
                  onChange={(e) => updateCondition(i.id, e.target.value)}
                  className="rounded-lg border px-2 py-1 text-[11px] amharic"
                >
                  {CONDITIONS.map((c) => (
                    <option key={c.v} value={c.v}>
                      {c.l}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => {
                    setEditId(i.id);
                    setEditName(i.name_am);
                  }}
                  className="rounded-lg border p-1.5"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => remove(i.id)}
                  className="rounded-lg bg-red-600/90 p-1.5 text-white"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </li>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-[var(--foreground)]/50 amharic">
            ምንም ንብረት የለም።
          </p>
        )}
      </ul>
    </div>
  );
}
