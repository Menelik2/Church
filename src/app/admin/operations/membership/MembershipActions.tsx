"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { ONBOARDING_STEPS } from "@/data/onboarding-steps";

type AppRow = {
  id: string;
  full_name_am: string;
  phone?: string | null;
  email?: string | null;
  is_orthodox?: boolean;
  completed_course?: boolean;
  accepts_doctrine?: boolean;
  respects_bylaws?: boolean;
  proper_attire?: boolean;
  has_confessor?: boolean;
  will_pay_monthly?: boolean;
  preferred_stage?: string | null;
  church_marriage?: boolean | null;
};

const ADMIN_CHECKS = [
  { key: "admin_verified_orthodox", label: "ኦርቶዶክስ" },
  { key: "admin_verified_course", label: "ኮርስ" },
  { key: "admin_verified_doctrine", label: "ዶግማ" },
  { key: "admin_verified_bylaws", label: "ደንብ" },
  { key: "admin_verified_attire", label: "አለበባስ" },
  { key: "admin_verified_confessor", label: "ንስኃ" },
  { key: "admin_verified_monthly", label: "መዋጮ" },
  { key: "admin_verified_stage", label: "መድረክ" },
  { key: "admin_verified_marriage", label: "ጋብቻ" },
] as const;

export function MembershipActions({
  id,
  row,
}: {
  id: string;
  row?: AppRow;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");
  const [verified, setVerified] = useState<Record<string, boolean>>({});

  async function setStatus(status: "approved" | "rejected" | "needs_info") {
    setLoading(true);
    const supabase = createClient();

    const adminFields: Record<string, boolean> = {};
    for (const c of ADMIN_CHECKS) {
      adminFields[c.key] = !!verified[c.key];
    }

    if (status === "approved") {
      const { data: app } = await supabase
        .from("membership_applications")
        .select("*")
        .eq("id", id)
        .single();

      if (app) {
        const now = new Date().toISOString();
        const journey = app.completed_course ? "servant" : "registered";
        const { data: servant } = await supabase
          .from("servants")
          .insert({
            full_name_am: app.full_name_am,
            phone: app.phone,
            email: app.email,
            status: "active",
            is_orthodox: app.is_orthodox,
            completed_course: app.completed_course,
            accepts_doctrine: app.accepts_doctrine,
            respects_bylaws: app.respects_bylaws,
            proper_attire: app.proper_attire,
            has_confessor: app.has_confessor,
            pays_monthly: app.will_pay_monthly,
            stage_service: app.preferred_stage,
            church_marriage: app.church_marriage,
            joined_at: now.slice(0, 10),
            onboarding_started_at: now,
            journey_stage: journey,
          })
          .select("id")
          .single();

        if (servant?.id) {
          const rows = ONBOARDING_STEPS.map((s) => ({
            servant_id: servant.id,
            step_key: s.key,
            completed:
              s.key === "registration_complete"
                ? true
                : s.key === "course_complete"
                  ? !!app.completed_course
                  : false,
            completed_at:
              s.key === "registration_complete" ||
              (s.key === "course_complete" && app.completed_course)
                ? now
                : null,
          }));
          await supabase.from("onboarding_progress").upsert(rows, {
            onConflict: "servant_id,step_key",
          });
          await supabase.from("journey_events").insert({
            subject_type: "servant",
            subject_id: servant.id,
            from_stage: null,
            to_stage: journey,
            note: "membership approved",
          });
          await supabase.from("new_member_register").insert({
            full_name_am: app.full_name_am,
            phone: app.phone,
            email: app.email,
            application_id: app.id,
            servant_id: servant.id,
            status: app.completed_course ? "graduated" : "registered",
          });

          await supabase.from("membership_notifications").insert({
            application_id: id,
            servant_id: servant.id,
            kind: "approved",
            title_am: `ጸድቋል — ${app.full_name_am}`,
            body_am: note || "ወደ አገልጋይነት ተመዝግቧል።",
            recipient_name: app.full_name_am,
            recipient_phone: app.phone,
            recipient_email: app.email,
          });
        }
      }
    } else {
      const kind = status === "rejected" ? "rejected" : "needs_info";
      await supabase.from("membership_notifications").insert({
        application_id: id,
        kind,
        title_am:
          status === "rejected"
            ? `ውድቅ — ${row?.full_name_am || ""}`
            : `ተጨማሪ መረጃ — ${row?.full_name_am || ""}`,
        body_am: note || null,
        recipient_name: row?.full_name_am,
        recipient_phone: row?.phone,
        recipient_email: row?.email,
      });
    }

    await supabase
      .from("membership_applications")
      .update({
        status,
        reviewed_at: new Date().toISOString(),
        review_note: note.trim() || null,
        ...adminFields,
      })
      .eq("id", id);

    setLoading(false);
    router.refresh();
  }

  return (
    <div className="mt-4 space-y-3 border-t border-[var(--border)] pt-4">
      <p className="text-xs font-semibold text-[var(--foreground)]/60 amharic">
        የቁጥጥር ክፍል ማረጋገጫ (checklist)
      </p>
      <div className="flex flex-wrap gap-2">
        {ADMIN_CHECKS.map((c) => (
          <label
            key={c.key}
            className="inline-flex items-center gap-1.5 text-xs rounded-lg border border-[var(--border)] px-2 py-1 cursor-pointer hover:bg-[var(--muted)]"
          >
            <input
              type="checkbox"
              checked={!!verified[c.key]}
              onChange={(e) =>
                setVerified((p) => ({ ...p, [c.key]: e.target.checked }))
              }
            />
            <span className="amharic">{c.label}</span>
          </label>
        ))}
      </div>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={2}
        placeholder="የግምገማ ማስታወሻ (አማራጭ)…"
        className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm amharic"
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={loading}
          onClick={() => setStatus("approved")}
          className="rounded-lg bg-emerald-700 text-white text-xs px-3 py-2 font-medium disabled:opacity-50"
        >
          አጽድቅ → አገልጋይ + onboarding
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => setStatus("needs_info")}
          className="rounded-lg border border-[var(--border)] text-xs px-3 py-2 disabled:opacity-50"
        >
          ተጨማሪ መረጃ
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => setStatus("rejected")}
          className="rounded-lg bg-red-700 text-white text-xs px-3 py-2 disabled:opacity-50"
        >
          ውድቅ
        </button>
      </div>
    </div>
  );
}
