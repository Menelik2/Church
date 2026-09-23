import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";
import { AttendanceRoll } from "./AttendanceRoll";

export const dynamic = "force-dynamic";

const MS_DAY = 24 * 60 * 60 * 1000;
const ALERT_DAYS = 14;

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function daysSince(dateStr: string | null | undefined, fallback: string | null) {
  const base = dateStr || fallback;
  if (!base) return null;
  const t = new Date(base + (base.length === 10 ? "T12:00:00Z" : "")).getTime();
  if (Number.isNaN(t)) return null;
  return Math.floor((Date.now() - t) / MS_DAY);
}

export default async function AdminAttendancePage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  await requireAdmin();
  const { date: dateParam } = await searchParams;
  const date =
    dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam) ? dateParam : todayISO();

  const supabase = await createClient();

  const [{ data: servants }, { data: dayRows }, { data: presentRows }] =
    await Promise.all([
      supabase
        .from("servants")
        .select("id, full_name_am, phone, status, joined_at, created_at")
        .eq("status", "active")
        .order("full_name_am")
        .limit(300),
      supabase
        .from("servant_attendance")
        .select("servant_id, status")
        .eq("attendance_date", date)
        .eq("gathering_type", "regular"),
      supabase
        .from("servant_attendance")
        .select("servant_id, attendance_date")
        .eq("status", "present")
        .order("attendance_date", { ascending: false })
        .limit(2000),
    ]);

  const dayMap = new Map(
    (dayRows ?? []).map((r) => [r.servant_id, r.status as "present" | "absent" | "excused"])
  );

  const lastPresent = new Map<string, string>();
  for (const r of presentRows ?? []) {
    if (!lastPresent.has(r.servant_id)) {
      lastPresent.set(r.servant_id, r.attendance_date);
    }
  }

  const roll = (servants ?? []).map((s) => ({
    id: s.id,
    full_name_am: s.full_name_am,
    phone: s.phone,
    existingStatus: dayMap.get(s.id) ?? null,
  }));

  const alerts = (servants ?? [])
    .map((s) => {
      const last = lastPresent.get(s.id) ?? null;
      const since = daysSince(last, s.joined_at || s.created_at?.slice?.(0, 10));
      return {
        id: s.id,
        full_name_am: s.full_name_am,
        phone: s.phone,
        lastPresent: last,
        daysSince: since,
      };
    })
    .filter((a) => a.daysSince !== null && (a.daysSince as number) >= ALERT_DAYS)
    .sort((a, b) => (b.daysSince ?? 0) - (a.daysSince ?? 0));

  return (
    <div className="pb-16">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary)] amharic">
            መገኘት እና ክትትል
          </h1>
          <p className="mt-1 text-sm text-[var(--foreground)]/60 amharic">
            የቀን መገኘት መዝገብ · ከ{ALERT_DAYS} ቀን በላይ ያልታዩ ማስጠንቀቂያ
          </p>
        </div>
        <Link
          href="/admin/operations"
          className="text-sm text-[var(--primary)] hover:underline amharic"
        >
          ← ሂደቶች
        </Link>
      </div>

      {/* Alerts */}
      <section className="mt-8">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <h2 className="text-lg font-semibold amharic">ማስጠንቀቂያ (2 ሳምንት+)</h2>
          <span className="rounded-full bg-amber-500/15 text-amber-800 px-2.5 py-0.5 text-xs font-semibold tabular-nums">
            {alerts.length}
          </span>
        </div>
        {alerts.length === 0 ? (
          <p className="text-sm text-[var(--foreground)]/50 amharic rounded-xl border border-[var(--border)] px-4 py-6 text-center">
            ከ{ALERT_DAYS} ቀን በላይ ያልታየ ንቁ አገልጋይ የለም።
          </p>
        ) : (
          <ul className="space-y-2">
            {alerts.map((a) => (
              <li
                key={a.id}
                className="rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 flex flex-wrap justify-between gap-2"
              >
                <div>
                  <p className="font-semibold amharic text-sm">{a.full_name_am}</p>
                  <p className="text-xs text-[var(--foreground)]/55">
                    {[a.phone, a.lastPresent ? `መጨረሻ: ${a.lastPresent}` : "መገኘት አልተመዘገበም"]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
                <span className="text-xs font-semibold text-amber-800 tabular-nums self-center">
                  {a.daysSince} ቀን
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Roll call */}
      <section className="mt-12">
        <h2 className="text-lg font-semibold amharic mb-3">የቀን መገኘት</h2>
        <form method="get" className="mb-4 flex flex-wrap items-end gap-3">
          <label className="text-xs amharic text-[var(--foreground)]/70 block">
            ቀን
            <input
              type="date"
              name="date"
              defaultValue={date}
              className="mt-1 block rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm"
            />
          </label>
          <button
            type="submit"
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm amharic"
          >
            ቀይር
          </button>
        </form>
        <AttendanceRoll date={date} servants={roll} />
      </section>
    </div>
  );
}
