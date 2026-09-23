import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";
import { ONBOARDING_STEPS } from "@/data/onboarding-steps";
import { OnboardingPanel } from "./OnboardingPanel";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminOnboardingPage() {
  await requireAdmin();
  const supabase = await createClient();

  const [{ data: activeServants }, { data: mentors }] = await Promise.all([
    supabase
      .from("servants")
      .select(
        "id, full_name_am, phone, status, mentor_id, onboarding_started_at, onboarding_completed_at, joined_at, created_at"
      )
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(150),
    supabase
      .from("servants")
      .select("id, full_name_am")
      .eq("status", "active")
      .order("full_name_am")
      .limit(200),
  ]);

  const ids = (activeServants ?? []).map((s) => s.id);
  const { data: progressRows } =
    ids.length > 0
      ? await supabase
          .from("onboarding_progress")
          .select("servant_id, step_key, completed, notes")
          .in("servant_id", ids)
      : { data: [] as { servant_id: string; step_key: string; completed: boolean; notes: string | null }[] };

  const progressByServant = new Map<
    string,
    { step_key: string; completed: boolean; notes: string | null }[]
  >();
  for (const row of progressRows ?? []) {
    const list = progressByServant.get(row.servant_id) ?? [];
    list.push({
      step_key: row.step_key,
      completed: row.completed,
      notes: row.notes,
    });
    progressByServant.set(row.servant_id, list);
  }

  const mentorOptions = (mentors ?? []).map((m) => ({
    id: m.id,
    full_name_am: m.full_name_am,
  }));

  const inProgress = (activeServants ?? []).filter((s) => !s.onboarding_completed_at);
  const completed = (activeServants ?? []).filter((s) => s.onboarding_completed_at);

  return (
    <div className="pb-16">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary)] amharic">
            አዲስ አባል መቀበያ (Onboarding)
          </h1>
          <p className="mt-1 text-sm text-[var(--foreground)]/60 amharic">
            የመጀመሪያ 90 ቀን — checklist እና አማካሪ ምደባ (retention)
          </p>
        </div>
        <Link
          href="/admin/operations/membership"
          className="text-sm text-[var(--primary)] hover:underline amharic"
        >
          ← የአባልነት ጥያቄዎች
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        <span className="rounded-full bg-[var(--muted)] px-3 py-1 amharic">
          በሂደት: {inProgress.length}
        </span>
        <span className="rounded-full bg-emerald-700/15 text-emerald-800 px-3 py-1 amharic">
          ተጠናቋል: {completed.length}
        </span>
        <span className="rounded-full border border-[var(--border)] px-3 py-1 text-[var(--foreground)]/60">
          {ONBOARDING_STEPS.length} ደረጃዎች
        </span>
      </div>

      <section className="mt-8 space-y-4">
        <h2 className="text-lg font-semibold amharic">በሂደት ላይ</h2>
        {inProgress.length === 0 && (
          <p className="text-sm text-[var(--foreground)]/50 py-6 text-center amharic">
            በሂደት ላይ ያለ አዲስ አባል የለም። ከአባልነት ጥያቄ አጽድቀው ይጀምሩ።
          </p>
        )}
        {inProgress.map((s) => {
          const progress = progressByServant.get(s.id) ?? [];
          const done = progress.filter((p) => p.completed).length;
          return (
            <details
              key={s.id}
              className="group rounded-2xl border border-[var(--border)] bg-[var(--card)] open:shadow-sm"
            >
              <summary className="cursor-pointer list-none px-5 py-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold amharic">{s.full_name_am}</p>
                  <p className="text-xs text-[var(--foreground)]/50">
                    {[s.phone, s.joined_at || s.created_at?.slice?.(0, 10)]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
                <span className="text-xs tabular-nums rounded-full bg-[var(--muted)] px-2.5 py-1">
                  {done}/{ONBOARDING_STEPS.length}
                </span>
              </summary>
              <div className="border-t border-[var(--border)] px-5 pb-5">
                <OnboardingPanel
                  servantId={s.id}
                  mentorId={s.mentor_id}
                  mentors={mentorOptions}
                  progress={progress}
                />
              </div>
            </details>
          );
        })}
      </section>

      {completed.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-semibold amharic mb-3">ተጠናቅቋል</h2>
          <ul className="space-y-2">
            {completed.slice(0, 30).map((s) => (
              <li
                key={s.id}
                className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 flex flex-wrap justify-between gap-2 text-sm"
              >
                <span className="amharic font-medium">{s.full_name_am}</span>
                <span className="text-xs text-[var(--foreground)]/50">
                  {s.onboarding_completed_at
                    ? new Date(s.onboarding_completed_at).toLocaleDateString("am-ET")
                    : ""}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
