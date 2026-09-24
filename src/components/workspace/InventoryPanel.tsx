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

const CATEGORIES = [
  { value: "permanent", label: "ቋሚ ንብረት" },
  { value: "consumable", label: "አላቂ ንብረት" },
  { value: "furniture", label: "ቤት እቃ" },
  { value: "equipment", label: "መሳሪያ" },
  { value: "other", label: "ሌላ" },
];

const CONDITIONS = [
  { value: "good", label: "ጥሩ" },
  { value: "fair", label: "መካከለኛ" },
  { value: "poor", label: "መጥፎ / ጥገና" },
  { value: "lost", label: "ጠፍቷል" },
];

export function InventoryPanel({
  departmentCode: _departmentCode,
  initial,
}: {
  departmentCode?: string;
  initial: Item[];
}) {
  const [items, setItems] = useState(initial);
  const [name, setName] = useState("");
  const [qty, setQty] = useState("1");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("permanent");
  const [condition, setCondition] = useState("good");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
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
          location: location.trim() || null,
          category,
          condition,
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
      setCategory("permanent");
      setCondition("good");
      setOk("ንብረት በመዝገብ ገቢ ሆኗል");
    } catch (err) {
      setError(formatAppError(err));
    } finally {
      setSaving(false);
    }
  }

  async function updateCondition(id: string, next: string) {
    setError(null);
    try {
      const supabase = createClient();
      const { error: dbErr } = await supabase
        .from("property_items")
        .update({ condition: next, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (dbErr) {
        setError(formatAppError(dbErr));
        return;
      }
      setItems((list) =>
        list.map((it) => (it.id === id ? { ...it, condition: next } : it))
      );
    } catch (err) {
      setError(formatAppError(err));
    }
  }

  const catLabel = (c: string | null) =>
    CATEGORIES.find((x) => x.value === c)?.label ?? c ?? "—";
  const condLabel = (c: string | null) =>
    CONDITIONS.find((x) => x.value === c)?.label ?? c ?? "—";

  return (
    <div className="space-y-4">
      {error && (
        <ErrorBanner error={error} onDismiss={() => setError(null)} />
      )}
      {ok && <SuccessBanner message={ok} />}

      <p className="text-xs text-[var(--foreground)]/55 amharic leading-relaxed">
        ቋሚና አላቂ ንብረት መመዝገብ · አካባቢ · ሁኔታ — አዲስ ንብረት ሲገባ በመዝገብ ገቢ
        ይደረጋል። ውሰት/መመለስ ከ«ውሰት» ትር ይከናወናል።
      </p>

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
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm amharic"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm amharic"
          >
            {CONDITIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
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
            placeholder="አካባቢ (እቃ ቤት…)"
            className="rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm amharic"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-xl bg-[var(--primary)] py-2.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {saving ? "በማስቀመጥ…" : "ገቢ አድርግ / አክል"}
        </button>
      </form>

      <ul className="space-y-2">
        {items.length === 0 && (
          <li className="text-center text-sm text-[var(--foreground)]/50 amharic py-6">
            ምንም ንብረት አልተመዘገበም — አዲስ ንብረት ከላይ ያክሉ።
          </li>
        )}
        {items.map((it) => (
          <li
            key={it.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--border)] px-3 py-3 text-sm"
          >
            <div className="min-w-0 flex-1">
              <p className="font-medium amharic">{it.name_am}</p>
              <p className="text-[11px] text-[var(--foreground)]/50 amharic">
                {catLabel(it.category)} · {it.location || "—"}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="font-semibold tabular-nums">{it.quantity}</span>
              <select
                value={it.condition || "good"}
                onChange={(e) => updateCondition(it.id, e.target.value)}
                className="rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs px-2 py-1.5 amharic max-w-[7rem]"
                title="ሁኔታ"
              >
                {CONDITIONS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
