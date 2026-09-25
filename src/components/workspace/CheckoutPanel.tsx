"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatAppError } from "@/lib/supabase/safe-count";

type Item = {
  id: string;
  name_am: string;
  quantity: number;
};

type Checkout = {
  id: string;
  item_id: string;
  item_name?: string;
  borrower_name: string;
  quantity: number;
  purpose: string | null;
  checked_out_at: string;
  due_date: string | null;
  returned_at: string | null;
  status: string;
};

/**
 * ንብረት ውሰት — uses department_inventory for stock + department_records
 * (record_type = checkout) so we never hit property_items FK mismatch.
 */
export function CheckoutPanel({
  departmentCode,
  items: initialItems,
  initial,
}: {
  departmentCode: string;
  items: Item[];
  initial: Checkout[];
}) {
  const [stock, setStock] = useState(initialItems);
  const [rows, setRows] = useState(initial);
  const [itemId, setItemId] = useState(initialItems[0]?.id ?? "");
  const [borrower, setBorrower] = useState("");
  const [qty, setQty] = useState("1");
  const [purpose, setPurpose] = useState("");
  const [due, setDue] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const itemName = (id: string) =>
    stock.find((i) => i.id === id)?.name_am ??
    rows.find((r) => r.item_id === id)?.item_name ??
    "—";

  const available = (id: string) =>
    stock.find((i) => i.id === id)?.quantity ?? 0;

  const open = useMemo(
    () => rows.filter((r) => r.status === "out"),
    [rows]
  );
  const closed = useMemo(
    () => rows.filter((r) => r.status !== "out"),
    [rows]
  );

  async function checkout(e: React.FormEvent) {
    e.preventDefault();
    if (!itemId || !borrower.trim()) {
      setError("እባክዎ ንብረት እና ተበዳሪ ስም ይሙሉ።");
      return;
    }
    const n = Math.max(1, Number(qty) || 1);
    const have = available(itemId);
    if (n > have) {
      setError(`በቂ ንብረት የለም (ያለው: ${have})`);
      return;
    }

    setSaving(true);
    setError(null);
    setOk(null);

    try {
      const supabase = createClient();
      const name = itemName(itemId);
      const now = new Date().toISOString();

      const meta = {
        item_id: itemId,
        item_name: name,
        quantity: n,
        borrower_name: borrower.trim(),
        purpose: purpose.trim() || null,
        due_date: due || null,
        status: "out",
        checked_out_at: now,
        returned_at: null,
      };

      const { data, error: insErr } = await supabase
        .from("department_records")
        .insert({
          department_code: departmentCode,
          record_type: "checkout",
          title_am: `${name} → ${borrower.trim()}`,
          body: purpose.trim() || null,
          record_date: now.slice(0, 10),
          meta,
        })
        .select("id, title_am, body, record_date, meta, created_at")
        .single();

      if (insErr) {
        setError(formatAppError(insErr));
        setSaving(false);
        return;
      }

      const nextQty = have - n;
      const { error: stockErr } = await supabase
        .from("department_inventory")
        .update({ quantity: nextQty, updated_at: now })
        .eq("id", itemId);

      if (stockErr) {
        await supabase.from("department_records").delete().eq("id", data.id);
        setError(formatAppError(stockErr));
        setSaving(false);
        return;
      }

      setStock((list) =>
        list.map((i) => (i.id === itemId ? { ...i, quantity: nextQty } : i))
      );

      const row: Checkout = {
        id: data.id,
        item_id: itemId,
        item_name: name,
        borrower_name: borrower.trim(),
        quantity: n,
        purpose: purpose.trim() || null,
        checked_out_at: now,
        due_date: due || null,
        returned_at: null,
        status: "out",
      };
      setRows((list) => [row, ...list]);
      setBorrower("");
      setQty("1");
      setPurpose("");
      setDue("");
      setOk("ውሰት ተመዝግቧል");
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : "ስህተት ተከስቷል");
    }
    setSaving(false);
  }

  async function markReturned(id: string) {
    setError(null);
    setOk(null);
    const row = rows.find((r) => r.id === id);
    if (!row || row.status !== "out") return;

    try {
      const supabase = createClient();
      const now = new Date().toISOString();
      const meta = {
        item_id: row.item_id,
        item_name: row.item_name || itemName(row.item_id),
        quantity: row.quantity,
        borrower_name: row.borrower_name,
        purpose: row.purpose,
        due_date: row.due_date,
        status: "returned",
        checked_out_at: row.checked_out_at,
        returned_at: now,
      };

      const { error: upErr } = await supabase
        .from("department_records")
        .update({
          meta,
          title_am: `${meta.item_name} → ${row.borrower_name} (ተመለሰ)`,
          updated_at: now,
        })
        .eq("id", id);

      if (upErr) {
        setError(formatAppError(upErr));
        return;
      }

      const current = available(row.item_id);
      const nextQty = current + row.quantity;
      const { error: stockErr } = await supabase
        .from("department_inventory")
        .update({ quantity: nextQty, updated_at: now })
        .eq("id", row.item_id);

      if (stockErr) {
        setError(formatAppError(stockErr));
      } else {
        setStock((list) =>
          list.map((i) =>
            i.id === row.item_id ? { ...i, quantity: nextQty } : i
          )
        );
      }

      setRows((list) =>
        list.map((r) =>
          r.id === id
            ? { ...r, status: "returned", returned_at: now }
            : r
        )
      );
      setOk("ንብረት ተመልሷል");
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : "ስህተት ተከስቷል");
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 space-y-3">
        <h3 className="text-sm font-semibold amharic">አዲስ ውሰት</h3>
        {error && (
          <p className="text-sm text-red-600 amharic whitespace-pre-wrap rounded-lg bg-red-500/10 px-3 py-2">
            {error}
          </p>
        )}
        {ok && (
          <p className="text-sm text-emerald-700 amharic rounded-lg bg-emerald-500/10 px-3 py-2">
            {ok}
          </p>
        )}
        {stock.length === 0 ? (
          <p className="text-sm text-[var(--foreground)]/55 amharic py-4 text-center">
            መጀመሪያ ከ«ንብረት» ትር ንብረት ያክሉ፣ ከዚያ ውሰት ይመዝግቡ።
          </p>
        ) : (
          <form onSubmit={checkout} className="grid gap-2 sm:grid-cols-2">
            <select
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
              required
              className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm amharic"
            >
              {stock.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name_am} ({i.quantity})
                </option>
              ))}
            </select>
            <input
              value={borrower}
              onChange={(e) => setBorrower(e.target.value)}
              required
              placeholder="ተበዳሪ ስም"
              className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm amharic"
            />
            <input
              type="number"
              min={1}
              max={itemId ? available(itemId) : undefined}
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm"
            />
            <input
              type="date"
              value={due}
              onChange={(e) => setDue(e.target.value)}
              className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm"
            />
            <input
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="ዓላማ / አገልግሎት"
              className="sm:col-span-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm amharic"
            />
            <button
              type="submit"
              disabled={saving || (itemId ? available(itemId) <= 0 : true)}
              className="sm:col-span-2 rounded-xl bg-[var(--primary)] py-2.5 text-sm font-medium text-white disabled:opacity-50 amharic"
            >
              {saving ? "በመቀመጥ…" : "ውሰት መዝግብ"}
            </button>
          </form>
        )}
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
                className="rounded-lg bg-emerald-700 text-white text-xs px-3 py-1.5 amharic"
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
