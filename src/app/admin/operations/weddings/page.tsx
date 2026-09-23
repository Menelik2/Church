import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";
import { WeddingActions } from "./WeddingActions";

export default async function AdminWeddingsPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data: rows } = await supabase.from("wedding_requests").select("*").order("created_at", { ascending: false }).limit(100);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--primary)] amharic">የሰርግ አጃቢ ጥያቄዎች</h1>
      <p className="text-sm text-[var(--foreground)]/60 mt-1 amharic">አንቀጽ 15</p>
      <ul className="mt-6 space-y-4">
        {(rows ?? []).map((r) => (
          <li key={r.id} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
            <div className="flex justify-between gap-2">
              <p className="font-semibold amharic">{r.groom_name} & {r.bride_name}</p>
              <span className="text-xs">{r.status}</span>
            </div>
            <p className="mt-2 text-sm">ቀን: {r.wedding_date} · አጃቢ: {r.escort_count} · ክፍያ: {r.prepayment_birr} ብር</p>
            {["submitted", "under_review"].includes(r.status) && <WeddingActions id={r.id} />}
          </li>
        ))}
        {(!rows || rows.length === 0) && <p className="text-sm text-center py-8 text-[var(--foreground)]/50">ጥያቄ የለም።</p>}
      </ul>
    </div>
  );
}
