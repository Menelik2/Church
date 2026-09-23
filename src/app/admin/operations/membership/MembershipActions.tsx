"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { ONBOARDING_STEPS } from "@/data/onboarding-steps";

export function MembershipActions({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function setStatus(status: "approved" | "rejected" | "needs_info") {
    setLoading(true);
    const supabase = createClient();
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
        }
      }
    }
    await supabase
      .from("membership_applications")
      .update({ status, reviewed_at: new Date().toISOString() })
      .eq("id", id);
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <button
        type="button"
        disabled={loading}
        onClick={() => setStatus("approved")}
        className="rounded-lg bg-emerald-700 text-white text-xs px-3 py-1.5 disabled:opacity-50"
      >
        አጽድቅ → አገልጋይ + onboarding
      </button>
      <button
        type="button"
        disabled={loading}
        onClick={() => setStatus("needs_info")}
        className="rounded-lg border border-[var(--border)] text-xs px-3 py-1.5 disabled:opacity-50"
      >
        ተጨማሪ መረጃ
      </button>
      <button
        type="button"
        disabled={loading}
        onClick={() => setStatus("rejected")}
        className="rounded-lg bg-red-700 text-white text-xs px-3 py-1.5 disabled:opacity-50"
      >
        ውድቅ
      </button>
    </div>
  );
}
