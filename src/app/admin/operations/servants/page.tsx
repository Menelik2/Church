import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";

export default async function AdminServantsPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data: servants } = await supabase
    .from("servants")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary)] amharic">አገልጋዮች መዝገብ</h1>
          <p className="text-sm text-[var(--foreground)]/60 mt-1 amharic">ቋሚ አባላት — አንቀጽ 11–14</p>
        </div>
        <Link
          href="/admin/operations/onboarding"
          className="text-sm font-medium text-[var(--primary)] hover:underline amharic"
        >
          አዲስ አባል መቀበያ →
        </Link>
      </div>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--border)]">
        <table className="w-full text-sm">
          <thead className="bg-[var(--muted)] text-left">
            <tr>
              <th className="px-4 py-3">ስም</th>
              <th className="px-4 py-3">ሁኔታ</th>
              <th className="px-4 py-3">መድረክ</th>
              <th className="px-4 py-3">ስልክ</th>
              <th className="px-4 py-3">Onboarding</th>
            </tr>
          </thead>
          <tbody>
            {(servants ?? []).map((s) => (
              <tr key={s.id} className="border-t border-[var(--border)]">
                <td className="px-4 py-3 amharic font-medium">{s.full_name_am}</td>
                <td className="px-4 py-3">{s.status}</td>
                <td className="px-4 py-3">{s.stage_service || "—"}</td>
                <td className="px-4 py-3">{s.phone || "—"}</td>
                <td className="px-4 py-3 text-xs">
                  {s.onboarding_completed_at
                    ? "✓ ተጠናቋል"
                    : s.onboarding_started_at
                      ? "በሂደት"
                      : "—"}
                </td>
              </tr>
            ))}
            {(!servants || servants.length === 0) && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[var(--foreground)]/50">
                  መዝገብ ባዶ ነው።
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
