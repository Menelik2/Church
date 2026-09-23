"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatAppError, type AppError } from "@/lib/errors";
import { ErrorBanner, SuccessBanner } from "@/components/ui/ErrorBanner";

type Item = {
  id: string;
  name_am: string;
  category: string | null;
  quantity: number;
  condition: string | null;
  location: string | null;
};

export function InventoryPanel({ initial }: { initial: Item[] }) {
  const [items, setItems] = useState(initial);
  const [name, setName] = useState("");
  const [qty, setQty] = useState("1");
  const [location, setLocation] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setOk(null);
    try {
      const supabase = createClient();
      const { data, error: dbErr } = await supabase
        .from("property_items")
        .insert({
          name_am: name.trim(),
          quantity: Number(qty) || 1,
          location: location || null,
          condition: "good",
        })
        .select("id, name_am, category, quantity, condition, location")
        .single();

      if (dbErr) {
        setError(formatAppError(dbErr));
        return;
      }
      if (data) setItems((list) => [data as Item, ...list]);
      setName("");
      setQty("1");
      setLocation("");
      setOk("ንብረት ተመዝግቧል");
    } catch (err) {
      setError(formatAppError(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <ErrorBanner error={error} onDismiss={() => setError(null)} />
      )}
      {ok && <SuccessBanner message={ok} />}

      <form
        onSubmit={onSubmit}
        className="space-y-2 rounded-2xl border border-[var(--border)] p-4"
      >
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="የንብረት ስም…"
          className="w-full rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm amharic"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            min={0}
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            placeholder="ብዛት"
            className="rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm"
          />
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="አካባቢ…"
            className="rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm amharic"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-xl bg-[var(--primary)] py-2.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {saving ? "በማስቀመጥ…" : "አክል"}
        </button>
      </form>

      <ul className="space-y-2">
        {items.length === 0 && (
          <li className="text-center text-sm text-[var(--foreground)]/50 amharic py-6">
            ምንም ንብረት የለም
          </li>
        )}
        {items.map((it) => (
          <li
            key={it.id}
            className="flex justify-between rounded-xl border border-[var(--border)] px-3 py-3 text-sm"
          >
            <div>
              <p className="font-medium amharic">{it.name_am}</p>
              <p className="text-[11px] text-[var(--foreground)]/50">
                {it.location || "—"} · {it.condition || "—"}
              </p>
            </div>
            <span className="font-semibold tabular-nums">{it.quantity}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
