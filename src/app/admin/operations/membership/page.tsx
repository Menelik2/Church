import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";
import { MembershipActions } from "./MembershipActions";

export const dynamic = "force-dynamic";

const CRITERIA: { key: string; label: string }[] = [
  { key: "is_orthodox", label: "1. ኦርቶዶክስ ተዋሕዶ" },
  { key: "completed_course", label: "2. ኮርስ አጠናቋል" },
  { key: "accepts_doctrine", label: "3. ዶግማ/ቀኖና" },
  { key: "respects_bylaws", label: "4. መተዳደሪያ" },
  { key: "proper_attire", label: "5. አለበባስ" },
  { key: "has_confessor", label: "6. ንስኃ አባት" },
  { key: "will_pay_monthly", label: "7. ወርሐዊ መዋጮ" },
  { key: "preferred_stage", label: "8. መድረክ" },
  { key: "church_marriage", label: "9. ጋብቻ/ንስኃ" },
];

const STAGE_LABEL: Record<string, string> = {
  timihirt: "ትምህርት",
  "kine-tibeb": "ኪነጥበብ",
  mezmur: "መዝሙር",
};

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-amber-100 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200",
  approved: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200",
  rejected: "bg-red-100 text-red-900 dark:bg-red-950/40 dark:text-red-200",
  needs_info: "bg-sky-100 text-sky-900 dark:bg-sky-950/40 dark:text-sky-200",
};

export default async function AdminMembershipOpsPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("membership_applications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  const pending = (rows ?? []).filter((r) => r.status === "pending").length;

  return (
    <div className="pb-16">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary)] amharic">
            የአባልነት ጥያቄዎች
          </h1>
          <p className="text-sm text-[var(--foreground)]/60 mt-1 amharic">
            አንቀጽ 14 — መመዘኛ መስፈርቶች · በመጠባበቅ: {pending}
          </p>
        </div>
        <Link
          href="/rules/14"
          className="text-sm text-[var(--primary)] hover:underline"
          target="_blank"
        >
          አንቀጽ 14 →
        </Link>
      </div>

      <ul className="mt-6 space-y-4">
        {(rows ?? []).map((r) => {
          const flags = [
            r.is_orthodox,
            r.completed_course,
            r.accepts_doctrine,
            r.respects_bylaws,
            r.proper_attire,
            r.has_confessor,
            r.will_pay_monthly,
            !!r.preferred_stage,
            r.church_marriage !== false && r.church_marriage !== null
              ? true
              : r.church_marriage === false
                ? false
                : !!r.church_marriage,
          ];
          // church_marriage can be null; count as checked if true OR if they left message about confessor path
          const score =
            [
              r.is_orthodox,
              r.completed_course,
              r.accepts_doctrine,
              r.respects_bylaws,
              r.proper_attire,
              r.has_confessor,
              r.will_pay_monthly,
              !!r.preferred_stage,
              r.church_marriage === true,
            ].filter(Boolean).length;

          return (
            <li
              key={r.id}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold amharic text-base">{r.full_name_am}</p>
                  <p className="text-xs text-[var(--foreground)]/50 mt-0.5">
                    {[r.phone, r.email, r.age ? `${r.age} ዓመት` : null]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  <p className="text-[11px] text-[var(--foreground)]/40 mt-1">
                    {r.created_at
                      ? new Date(r.created_at).toLocaleString("am-ET")
                      : ""}
                  </p>
                </div>
                <span
                  className={`text-xs rounded-full px-2.5 py-1 font-medium ${
                    STATUS_STYLE[r.status] || "bg-[var(--muted)]"
                  }`}
                >
                  {r.status === "pending"
                    ? "በመጠባበቅ"
                    : r.status === "approved"
                      ? "ጸድቋል"
                      : r.status === "rejected"
                        ? "ውድቅ"
                        : r.status === "needs_info"
                          ? "ተጨማሪ መረጃ"
                          : r.status}
                </span>
              </div>

              <div className="mt-4">
                <p className="text-xs font-medium text-[var(--foreground)]/60 mb-2">
                  ራስ-ማረጋገጫ መመዘኛ: {score}/9 · መድረክ:{" "}
                  {STAGE_LABEL[r.preferred_stage] || r.preferred_stage || "—"}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {CRITERIA.map((c, i) => {
                    const ok =
                      c.key === "preferred_stage"
                        ? !!r.preferred_stage
                        : c.key === "church_marriage"
                          ? r.church_marriage === true
                          : !!(r as Record<string, unknown>)[c.key];
                    return (
                      <span
                        key={c.key}
                        className={`text-[10px] sm:text-xs rounded-lg px-2 py-1 border ${
                          ok
                            ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200"
                            : "border-[var(--border)] bg-[var(--muted)] text-[var(--foreground)]/50"
                        }`}
                        title={c.label}
                      >
                        {ok ? "✓" : "○"} {c.label}
                      </span>
                    );
                  })}
                </div>
              </div>

              {r.message && (
                <p className="mt-3 text-sm amharic rounded-xl bg-[var(--muted)] px-3 py-2 leading-relaxed">
                  {r.message}
                </p>
              )}

              {r.review_note && (
                <p className="mt-2 text-xs text-[var(--foreground)]/60">
                  የአስተዳዳሪ ማስታወሻ: {r.review_note}
                </p>
              )}

              {r.status === "pending" && <MembershipActions id={r.id} row={r} />}
            </li>
          );
        })}
        {(!rows || rows.length === 0) && (
          <p className="text-sm text-center text-[var(--foreground)]/50 py-12 amharic">
            ጥያቄ የለም። ተጠቃሚዎች ከ /services/membership ያመለክታሉ።
          </p>
        )}
      </ul>
    </div>
  );
}
