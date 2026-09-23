"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Item = {
  id: string;
  name_am: string;
  category: string | null;
  quantity: number;
  condition: string;
  location: string | null;
};

export function InventoryPanel({ initial }: { initial: Item[] }) {
  const [items, setItems] = useState(initial);
  const [name, setName] = useState("");
  const [qty, setQty] = useState("1");
  const [category, setCategory] = useState("other");
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("property_items")
      .insert({
        name_am: name.trim(),
        quantity: Number(qty) || 1,
        category,
        condition: "good",
      })
      .select("id, name_am, category, quantity, condition, location")
      .single();
    setSaving(false);
    if (!error && data) {
      setItems((list) => [data as Item, ...list]);
      setName("");
      setQty("1");
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={onSubmit} className="space-y-2 rounded-2xl border border-[var(--border)] p-4">
        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="የንብረት ስም…"
          className="w-full rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm amharic" />
        <div className="grid grid-cols-2 gap-2">
          <input type="number" value={qty} onChange={(e) => setQty(e.target.value)} placeholder="ብዛት"
            className="rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm" />
          <select value={category} onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm amharic">
            <option value="furniture">ቤት እቃ</option>
            <option value="liturgical">ሥርዓተ ቤተ ክርስቲያን</option>
            <option value="media">ሚዲያ</option>
            <option value="office">ቢሮ</option>
            <option value="other">ሌላ</option>
          </select>
        </div>
        <button type="submit" disabled={saving}
          className="w-full rounded-xl bg-[var(--primary)] py-2.5 text-sm font-medium text-white disabled:opacity-50">
          አክል
        </button>
      </form>
      <ul className="space-y-2">
        {items.length === 0 && (
          <li className="text-center text-sm text-[var(--foreground)]/50 amharic py-6">ምንም ንብረት የለም</li>
        )}
        {items.map((it) => (
          <li key={it.id} className="flex justify-between rounded-xl border border-[var(--border)] px-3 py-3 text-sm">
            <span className="amharic font-medium">{it.name_am}</span>
            <span className="text-[var(--foreground)]/60">{it.quantity} · {it.condition}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
