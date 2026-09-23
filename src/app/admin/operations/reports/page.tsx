import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";
import { ReportForm } from "./ReportForm";

export default async function AdminReportsPage() {
  await requireAdmin();
  const supabase = await createClient();
  const [{ data: departments }, { data: reports }] = await Promise.all([
    supabase.from("departments").select("id, name_am, slug").order("sort_order"),
    supabase.from("department_reports").select("*, departments(name_am)").order("period_year", { ascending: false }).order("period_quarter", { ascending: false }).limit(50),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--primary)] amharic">የክፍል ሩብ ዓመት ሪፖርቶች</h1>
      <p className="text-sm text-[var(--foreground)]/60 mt-1 amharic">አንቀጽ 8–10</p>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
          <ReportForm departments={departments ?? []} />
        </div>
        <ul className="space-y-3">
          {(reports ?? []).map((r) => (
            <li key={r.id} className="rounded-xl border border-[var(--border)] p-4">
              <div className="flex justify-between gap-2">
                <p className="font-medium amharic">{(r.departments as { name_am?: string } | null)?.name_am ?? "—"}</p>
                <span className="text-xs">{r.period_year} Q{r.period_quarter} · {r.status}</span>
              </div>
              <p className="mt-2 text-sm amharic line-clamp-3">{r.summary_am}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
