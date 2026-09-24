import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";
import { ServantStatusActions } from "./ServantStatusActions";

export const dynamic = "force-dynamic";

const STAGE_LABEL: Record<string, string> = {
  timihirt: "ትምህርት",
  "kine-tibeb": "ኪነጥበብ",
  mezmur: "መዝሙር",
};

const STATUS_STYLE: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200",
  reinstated: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200",
  suspended: "bg-amber-100 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200",
  inactive: "bg-[var(--muted)] text-[var(--foreground)]/60",
  applicant: "bg-sky-100 text-sky-900 dark:bg-sky-950/40 dark:text-sky-200",
  rejected: "bg-red-100 text-red-900 dark:bg-red-950/40 dark:text-red-200",
};

const STATUS_AM: Record<string, string> = {
  active: "ንቁ",
  reinstated: "ተመልሷል",
  suspended: "ታግዷል",
  inactive: "ቦዘኔ",
  applicant: "አመልካች",
  rejected: "ውድቅ",
};

export default async function AdminServantsPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data: servants } = await supabase
    .from("servants")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(150);

  const counts = {
    active: (servants ?? []).filter((s) => s.status === "active" || s.status === "reinstated")
      .length,
    suspended: (servants ?? []).filter((s) => s.status === "suspended").length,
  };

  return (
    <div className="pb-16">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary)] amharic">አገልጋዮች መዝገብ</h1>
          <p className="text-sm text-[var(--foreground)]/60 mt-1 amharic">
            ቋሚ አባላት — አንቀጽ 11–14 · ንቁ {counts.active} · ታግደዋል {counts.suspended}
          </p>
        </div>
        <div className="flex gap-3 text-sm">
          <Link
            href="/admin/operations/membership"
            className="font-medium text-[var(--primary)] hover:underline amharic"
          >
            ጥያቄዎች →
          </Link>
          <Link
            href="/admin/operations/onboarding"
            className="font-medium text-[var(--primary)] hover:underline amharic"
          >
            መቀበያ →
          </Link>
        </div>
      </div>

      <p className="mt-3 text-xs text-[var(--foreground)]/50 amharic leading-relaxed max-w-2xl">
        ማሳሰቢያ (አንቀጽ 14)፦ መስፈርቶች ባለማሟላት ከአገልግሎት የተገደ ሰው አሁን ካሟላ እና ቁጥጥር ክፍል ካረጋገጠ ሥራ
        አስፈጻሚ ወደ አገልጋይነት ሊመልስ ይችላል።
      </p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--border)]">
        <table className="w-full text-sm">
          <thead className="bg-[var(--muted)] text-left">
            <tr>
              <th className="px-4 py-3">ስም</th>
              <th className="px-4 py-3">ሁኔታ</th>
              <th className="px-4 py-3">መድረክ</th>
              <th className="px-4 py-3">ስልክ</th>
              <th className="px-4 py-3">Onboarding</th>
              <th className="px-4 py-3">እርምጃ</th>
            </tr>
          </thead>
          <tbody>
            {(servants ?? []).map((s) => (
              <tr key={s.id} className="border-t border-[var(--border)]">
                <td className="px-4 py-3 amharic font-medium">{s.full_name_am}</td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs rounded-full px-2 py-0.5 font-medium ${
                      STATUS_STYLE[s.status] || "bg-[var(--muted)]"
                    }`}
                  >
                    {STATUS_AM[s.status] || s.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {STAGE_LABEL[s.stage_service] || s.stage_service || "—"}
                </td>
                <td className="px-4 py-3">{s.phone || "—"}</td>
                <td className="px-4 py-3 text-xs">
                  {s.onboarding_completed_at
                    ? "✓ ተጠናቋል"
                    : s.onboarding_started_at
                      ? "በሂደት"
                      : "—"}
                </td>
                <td className="px-4 py-3">
                  <ServantStatusActions
                    id={s.id}
                    name={s.full_name_am}
                    status={s.status}
                    phone={s.phone}
                    email={s.email}
                  />
                </td>
              </tr>
            ))}
            {(!servants || servants.length === 0) && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[var(--foreground)]/50">
                  መዝገብ ባዶ ነው። ጥያቄዎች ከጸደቁ በኋላ እዚህ ይታያሉ።
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
