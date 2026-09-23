"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatAppError, type AppError } from "@/lib/errors";
import { ErrorBanner, SuccessBanner } from "@/components/ui/ErrorBanner";

type Item = {
  id: string;
  name_am: string;
  quantity: number;
};

type Checkout = {
  id: string;
  item_id: string;
  borrower_name: string;
  quantity: number;
  purpose: string | null;
  checked_out_at: string;
  due_date: string | null;
  returned_at: string | null;
  status: string;
};

export function CheckoutPanel({
  items: initialItems,
  initial,
}: {
  items: Item[];
  initial: Checkout[];
}) {
  const [stock, setStock] = useState(initialItems);
  const [rows, setRows] = useState(initial);
  const [itemId, setItemId] = useState("");
  const [borrower, setBorrower] = useState("");
  const [qty, setQty] = useState("1");
  const [purpose, setPurpose] = useState("");
  const [due, setDue] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const itemName = (id: string) =>
    stock.find((i) => i.id === id)?.name_am ?? "—";

  const available = (id: string) =>
    stock.find((i) => i.id === id)?.quantity ?? 0;

  async function checkout(e: React.FormEvent) {
    e.preventDefault();
    if (!itemId || !borrower.trim()) return;
    const n = Math.max(1, Number(qty) || 1);
    const have = available(itemId);
    if (n > have) {
      setError({
        messageAm: `በቂ ንብረት የለም (ያለው: ${have})`,
        messageEn: `Insufficient stock (available: ${have})`,
      });
      return;
    }
    setSaving(true);
    setError(null);
    setOk(null);
    try {
      const supabase = createClient();
      const { data, error: dbErr } = await supabase
        .from("property_checkouts")
        .insert({
          item_id: itemId,
          borrower_name: borrower.trim(),
          quantity: n,
          purpose: purpose.trim() || null,
          due_date: due || null,
          status: "out",
        })
        .select(
          "id, item_id, borrower_name, quantity, purpose, checked_out_at, due_date, returned_at, status"
        )
        .single();
      if (dbErr) {
        setError(formatAppError(dbErr));
        return;
      }

      const nextQty = have - n;
      const { error: stockErr } = await supabase
        .from("property_items")
        .update({ quantity: nextQty })
        .eq("id", itemId);
      if (stockErr) {
        setError(formatAppError(stockErr));
        return;
      }

      setStock((list) =>
        list.map((i) => (i.id === itemId ? { ...i, quantity: nextQty } : i))
      );
      if (data) setRows((r) => [data as Checkout, ...r]);
      setBorrower("");
      setPurpose("");
      setDue("");
      setQty("1");
      setOk("ውሰት ተመዝግቧል");
    } catch (err) {
      setError(formatAppError(err));
    } finally {
      setSaving(false);
    }
  }

  async function markReturned(id: string) {
    setError(null);
    setOk(null);
    const row = rows.find((r) => r.id === id);
    if (!row || row.status !== "out") return;
    try {
      const supabase = createClient();
      const now = new Date().toISOString();
      const { error: dbErr } = await supabase
        .from("property_checkouts")
        .update({ status: "returned", returned_at: now })
        .eq("id", id);
      if (dbErr) {
        setError(formatAppError(dbErr));
        return;
      }

      const current = available(row.item_id);
      const nextQty = current + row.quantity;
      const { error: stockErr } = await supabase
        .from("property_items")
        .update({ quantity: nextQty })
        .eq("id", row.item_id);
      if (stockErr) {
        setError(formatAppError(stockErr));
        return;
      }

      setStock((list) =>
        list.map((i) =>
          i.id === row.item_id ? { ...i, quantity: nextQty } : i
        )
      );
      setRows((list) =>
        list.map((r) =>
          r.id === id
            ? { ...r, status: "returned", returned_at: now }
            : r
        )
      );
      setOk("ተመልሷል");
    } catch (err) {
      setError(formatAppError(err));
    }
  }

  const open = rows.filter((r) => r.status === "out");
  const closed = rows.filter((r) => r.status !== "out").slice(0, 15);

  return (
    <div className="space-y-6">
      {error && <ErrorBanner error={error} onDismiss={() => setError(null)} />}
      {ok && <SuccessBanner message={ok} />}

      <section className="rounded-2xl border border-[var(--border)] p-4 space-y-3">
        <h3 className="text-sm font-semibold amharic">አዲስ ውሰት</h3>
        <form onSubmit={checkout} className="grid gap-2 sm:grid-cols-2">
          <select
            required
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
            className="rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm amharic"
          >
            <option value="">ንብረት ምረጥ</option>
            {stock.map((i) => (
              <option key={i.id} value={i.id} disabled={i.quantity <= 0}>
                {i.name_am} ({i.quantity})
              </option>
            ))}
          </select>
          <input
            required
            value={borrower}
            onChange={(e) => setBorrower(e.target.value)}
            placeholder="የወሰደው ስም"
            className="rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm amharic"
          />
          <input
            type="number"
            min={1}
            max={itemId ? available(itemId) : undefined}
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            className="rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm"
          />
          <input
            type="date"
            value={due}
            onChange={(e) => setDue(e.target.value)}
            className="rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm"
          />
          <input
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="ዓላማ / አገልግሎት"
            className="sm:col-span-2 rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm amharic"
          />
          <button
            type="submit"
            disabled={saving || (itemId ? available(itemId) <= 0 : false)}
            className="sm:col-span-2 rounded-xl bg-[var(--primary)] py-2.5 text-sm font-medium text-white disabled:opacity-50"
          >
            ውሰት መዝግብ
          </button>
        </form>
      </section>

      <section>
        <h3 className="text-sm font-semibold amharic mb-2">
          ክፍት ውሰቶች ({open.length})
        </h3>
        <ul className="space-y-2">
          {open.length === 0 && (
            <li className="text-sm text-[var(--foreground)]/50 amharic py-4 text-center">
              ምንም ክፍት ውሰት የለም
            </li>
          )}
          {open.map((r) => (
            <li
              key={r.id}
              className="flex flex-wrap items-center gap-2 rounded-xl border border-[var(--border)] px-3 py-3 text-sm"
            >
              <div className="flex-1 min-w-0 amharic">
                <p className="font-medium">{itemName(r.item_id)}</p>
                <p className="text-[11px] text-[var(--foreground)]/50">
                  {r.borrower_name} · ብዛት {r.quantity}
                  {r.due_date ? ` · እስከ ${r.due_date}` : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => markReturned(r.id)}
                className="rounded-lg bg-emerald-700 text-white text-xs px-3 py-1.5"
              >
                ተመለሰ
              </button>
            </li>
          ))}
        </ul>
      </section>

      {closed.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold amharic mb-2 text-[var(--foreground)]/50">
            የተመለሱ
          </h3>
          <ul className="space-y-1 text-xs amharic text-[var(--foreground)]/60">
            {closed.map((r) => (
              <li key={r.id}>
                {itemName(r.item_id)} → {r.borrower_name} · {r.status}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
