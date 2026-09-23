import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";
import { ContributionForm } from "./ContributionForm";

export default async function AdminContributionsPage() {
  await requireAdmin();
  const supabase = await createClient();
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const [{ data: servants }, { data: recent }] = await Promise.all([
    supabase.from("servants").select("id, full_name_am, status").eq("status", "active").order("full_name_am"),
    supabase.from("contributions").select("*, servants(full_name_am)").order("created_at", { ascending: false }).limit(40),
  ]);
  const { data: thisMonth } = await supabase.from("contributions").select("servant_id").eq("period_year", year).eq("period_month", month);
  const paidIds = new Set((thisMonth ?? []).map((c) => c.servant_id));
  const unpaid = (servants ?? []).filter((s) => !paidIds.has(s.id));

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--primary)] amharic">ወርሃዊ መዋጮ</h1>
      <p className="text-sm text-[var(--foreground)]/60 mt-1 amharic">አንቀጽ 12/14 — {year}/{month}</p>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
          <h2 className="font-semibold amharic mb-4">መዋጮ መመዝገብ</h2>
          <ContributionForm servants={servants ?? []} year={year} month={month} />
        </div>
        <div>
          <h2 className="font-semibold amharic mb-2">ያልከፈሉ ({unpaid.length})</h2>
          <ul className="text-sm space-y-1 max-h-40 overflow-y-auto mb-6">
            {unpaid.map((s) => (
              <li key={s.id} className="amharic text-[var(--foreground)]/70">{s.full_name_am}</li>
            ))}
            {unpaid.length === 0 && <li className="text-[var(--foreground)]/50">ሁሉም ክፍለዋል ወይም አገልጋይ የለም።</li>}
          </ul>
          <h2 className="font-semibold amharic mb-2">የቅርብ ጊዜ</h2>
          <ul className="space-y-2">
            {(recent ?? []).map((c) => (
              <li key={c.id} className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm flex justify-between gap-2">
                <span className="amharic">{(c.servants as { full_name_am?: string } | null)?.full_name_am ?? "—"}</span>
                <span className="tabular-nums text-[var(--foreground)]/60">{c.amount_birr} ብር · {c.period_year}/{c.period_month}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
