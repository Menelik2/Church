"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export function ServantStatusActions({
  id,
  name,
  status,
  phone,
  email,
}: {
  id: string;
  name: string;
  status: string;
  phone?: string | null;
  email?: string | null;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");

  async function setStatus(next: "active" | "suspended" | "reinstated" | "inactive") {
    setLoading(true);
    const supabase = createClient();

    await supabase
      .from("servants")
      .update({
        status: next === "reinstated" ? "active" : next,
        notes: note.trim()
          ? `${note.trim()} [${next} ${new Date().toISOString().slice(0, 10)}]`
          : undefined,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    const kind =
      next === "suspended"
        ? "suspended"
        : next === "reinstated" || next === "active"
          ? "reinstated"
          : "needs_info";

    if (next === "suspended" || next === "reinstated" || next === "active") {
      await supabase.from("membership_notifications").insert({
        servant_id: id,
        kind: next === "suspended" ? "suspended" : "reinstated",
        title_am:
          next === "suspended"
            ? `ታግዷል — ${name}`
            : `ተመልሷል — ${name}`,
        body_am:
          note.trim() ||
          (next === "suspended"
            ? "ከአገልግሎት ታግዷል።"
            : "መስፈርቶች ከተረጋገጡ በኋላ ወደ አገልጋይነት ተመልሷል።"),
        recipient_name: name,
        recipient_phone: phone,
        recipient_email: email,
      });

      // journey event
      await supabase.from("journey_events").insert({
        subject_type: "servant",
        subject_id: id,
        from_stage: status,
        to_stage: next === "reinstated" ? "active" : next,
        note: note.trim() || `status → ${next}`,
      });
    }

    setLoading(false);
    setNote("");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-1.5 min-w-[140px]">
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="ማስታወሻ…"
        className="text-xs rounded-lg border border-[var(--border)] px-2 py-1 bg-[var(--background)]"
      />
      <div className="flex flex-wrap gap-1">
        {(status === "active" || status === "reinstated") && (
          <button
            type="button"
            disabled={loading}
            onClick={() => setStatus("suspended")}
            className="text-[10px] rounded bg-amber-700 text-white px-2 py-1 disabled:opacity-50"
          >
            አግድ
          </button>
        )}
        {(status === "suspended" || status === "inactive") && (
          <button
            type="button"
            disabled={loading}
            onClick={() => setStatus("reinstated")}
            className="text-[10px] rounded bg-emerald-700 text-white px-2 py-1 disabled:opacity-50"
          >
            መልስ (Art.14)
          </button>
        )}
        {status === "applicant" && (
          <button
            type="button"
            disabled={loading}
            onClick={() => setStatus("active")}
            className="text-[10px] rounded bg-emerald-700 text-white px-2 py-1 disabled:opacity-50"
          >
            አግብር
          </button>
        )}
      </div>
    </div>
  );
}
