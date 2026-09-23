import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";
import { MembershipActions } from "./MembershipActions";

export default async function AdminMembershipOpsPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data: rows } = await supabase.from("membership_applications").select("*").order("created_at", { ascending: false }).limit(100);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--primary)] amharic">የአባልነት ጥያቄዎች</h1>
      <p className="text-sm text-[var(--foreground)]/60 mt-1 amharic">አንቀጽ 14</p>
      <ul className="mt-6 space-y-4">
        {(rows ?? []).map((r) => {
          const score = [r.is_orthodox, r.completed_course, r.accepts_doctrine, r.respects_bylaws, r.proper_attire, r.has_confessor, r.will_pay_monthly].filter(Boolean).length;
          return (
            <li key={r.id} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
              <div className="flex flex-wrap justify-between gap-2">
                <div>
                  <p className="font-semibold amharic">{r.full_name_am}</p>
                  <p className="text-xs text-[var(--foreground)]/50">{[r.phone, r.email].filter(Boolean).join(" · ")}</p>
                </div>
                <span className="text-xs rounded-full bg-[var(--muted)] px-2 py-0.5">{r.status}</span>
              </div>
              <p className="mt-2 text-xs">መመዘኛ: {score}/7 · መድረክ: {r.preferred_stage || "—"}</p>
              {r.status === "pending" && <MembershipActions id={r.id} />}
            </li>
          );
        })}
        {(!rows || rows.length === 0) && <p className="text-sm text-center text-[var(--foreground)]/50 py-8">ጥያቄ የለም።</p>}
      </ul>
    </div>
  );
}
