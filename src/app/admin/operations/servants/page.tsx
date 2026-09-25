import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";
import { ServantsRegistry, type ServantRow } from "./ServantsRegistry";

export const dynamic = "force-dynamic";

export default async function AdminServantsPage() {
  await requireAdmin();
  const supabase = await createClient();

  const { data: servants, error } = await supabase
    .from("servants")
    .select(
      "id, full_name_am, phone, email, status, stage_service, journey_stage, is_orthodox, completed_course, accepts_doctrine, respects_bylaws, proper_attire, has_confessor, pays_monthly, church_marriage, joined_at, notes, onboarding_started_at, onboarding_completed_at, created_at"
    )
    .order("created_at", { ascending: false })
    .limit(300);

  const rows = (servants ?? []) as ServantRow[];

  return (
    <div className="pb-16">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary)] amharic">
            አገልጋዮች መዝገብ
          </h1>
          <p className="mt-1 text-sm text-[var(--foreground)]/60 amharic">
            ቋሚ አባላት — አንቀጽ 11–14 · ጠቅላላ {rows.length}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
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
          <Link
            href="/admin/operations/journey"
            className="font-medium text-[var(--primary)] hover:underline amharic"
          >
            ጉዞ →
          </Link>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          መረጃ ማምጣት አልተሳካም: {error.message}
        </div>
      )}

      <div className="mt-6">
        <ServantsRegistry initial={rows} />
      </div>
    </div>
  );
}
