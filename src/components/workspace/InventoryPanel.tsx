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
  const [location, setLocation] = useState("");
  const [saving, setSaving] = useState(false);

  async function onAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("property_items")
      .insert({
        name_am: name.trim(),
        quantity: parseInt(qty, 10) || 1,
        location: location || null,
        condition: "good",
        category: "other",
      })
      .select("*")
      .single();
    setSaving(false);
    if (!error && data) {
      setItems((list) => [data as Item, ...list]);
      setName("");
      setQty("1");
      setLocation("");
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={onAdd} className="space-y-2 rounded-2xl border border-[var(--border)] p-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="የንብረት ስም…"
          required
          className="w-full rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm amharic"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            placeholder="ብዛት"
            className="rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm"
          />
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="ቦታ…"
            className="rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm amharic"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-xl bg-[var(--primary)] py-2.5 text-sm font-medium text-white disabled:opacity-50"
        >
          አክል
        </button>
      </form>
      <ul className="space-y-2">
        {items.map((i) => (
          <li
            key={i.id}
            className="flex justify-between rounded-xl border border-[var(--border)] px-3 py-3 text-sm"
          >
            <div>
              <p className="font-medium amharic">{i.name_am}</p>
              <p className="text-[11px] text-[var(--foreground)]/50">
                {i.location || "—"} · {i.condition}
              </p>
            </div>
            <span className="font-bold tabular-nums">×{i.quantity}</span>
          </li>
        ))}
        {items.length === 0 && (
          <li className="text-center text-sm text-[var(--foreground)]/50 amharic py-6">
            ንብረት አልተመዘገበም
          </li>
        )}
      </ul>
    </div>
  );
}
