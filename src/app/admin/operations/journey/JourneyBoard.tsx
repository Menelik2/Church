"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatAppError, type AppError } from "@/lib/errors";
import { ErrorBanner, SuccessBanner } from "@/components/ui/ErrorBanner";
import {
  JOURNEY_STAGES,
  nextStage,
  stageLabel,
} from "@/data/journey-stages";

type Visitor = {
  id: string;
  full_name_am: string;
  phone: string | null;
  first_visit_date: string | null;
  status: string;
};

type Servant = {
  id: string;
  full_name_am: string;
  phone: string | null;
  journey_stage: string | null;
  status: string;
};

export function JourneyBoard({
  initialVisitors,
  initialServants,
}: {
  initialVisitors: Visitor[];
  initialServants: Servant[];
}) {
  const [visitors, setVisitors] = useState(initialVisitors);
  const [servants, setServants] = useState(initialServants);
  const [vName, setVName] = useState("");
  const [vPhone, setVPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  async function addVisitor(e: React.FormEvent) {
    e.preventDefault();
    if (!vName.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data, error: dbErr } = await supabase
        .from("visitors")
        .insert({
          full_name_am: vName.trim(),
          phone: vPhone.trim() || null,
          status: "active",
        })
        .select("id, full_name_am, phone, first_visit_date, status")
        .single();
      if (dbErr) {
        setError(formatAppError(dbErr));
        return;
      }
      if (data) {
        setVisitors((v) => [data as Visitor, ...v]);
        await supabase.from("journey_events").insert({
          subject_type: "visitor",
          subject_id: data.id,
          from_stage: null,
          to_stage: "visitor",
        });
      }
      setVName("");
      setVPhone("");
      setOk("ጎብኝ ተመዝግቧል");
    } catch (err) {
      setError(formatAppError(err));
    } finally {
      setSaving(false);
    }
  }

  async function convertVisitor(v: Visitor) {
    setSaving(true);
    setError(null);
    try {
      const supabase = createClient();
      const now = new Date().toISOString();
      const { data: servant, error: sErr } = await supabase
        .from("servants")
        .insert({
          full_name_am: v.full_name_am,
          phone: v.phone,
          status: "active",
          journey_stage: "registered",
          joined_at: now.slice(0, 10),
          onboarding_started_at: now,
        })
        .select("id, full_name_am, phone, journey_stage, status")
        .single();
      if (sErr || !servant) {
        setError(formatAppError(sErr));
        return;
      }
      await supabase
        .from("visitors")
        .update({ status: "converted", converted_servant_id: servant.id })
        .eq("id", v.id);
      await supabase.from("journey_events").insert({
        subject_type: "servant",
        subject_id: servant.id,
        from_stage: "visitor",
        to_stage: "registered",
        note: `from visitor ${v.id}`,
      });
      setVisitors((list) => list.filter((x) => x.id !== v.id));
      setServants((list) => [servant as Servant, ...list]);
      setOk("ወደ ተመዝጋቢ ተቀይሯል");
    } catch (err) {
      setError(formatAppError(err));
    } finally {
      setSaving(false);
    }
  }

  async function advanceServant(s: Servant) {
    const next = nextStage(s.journey_stage || "registered");
    if (!next) return;
    setSaving(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error: dbErr } = await supabase
        .from("servants")
        .update({ journey_stage: next })
        .eq("id", s.id);
      if (dbErr) {
        setError(formatAppError(dbErr));
        return;
      }
      await supabase.from("journey_events").insert({
        subject_type: "servant",
        subject_id: s.id,
        from_stage: s.journey_stage,
        to_stage: next,
      });
      if (next === "course") {
        await supabase.from("course_enrollments").insert({
          servant_id: s.id,
          full_name_am: s.full_name_am,
          course_name: "ተከታታይ ትምህርት",
          status: "enrolled",
        });
      }
      if (next === "servant") {
        await supabase
          .from("servants")
          .update({ completed_course: true })
          .eq("id", s.id);
      }
      setServants((list) =>
        list.map((x) =>
          x.id === s.id ? { ...x, journey_stage: next } : x
        )
      );
      setOk(`ወደ ${stageLabel(next)} ተሸጋገረ`);
    } catch (err) {
      setError(formatAppError(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {error && <ErrorBanner error={error} onDismiss={() => setError(null)} />}
      {ok && <SuccessBanner message={ok} />}

      <form
        onSubmit={addVisitor}
        className="flex flex-wrap gap-2 rounded-2xl border border-[var(--border)] p-4"
      >
        <input
          value={vName}
          onChange={(e) => setVName(e.target.value)}
          placeholder="የጎብኝ ስም"
          className="flex-1 min-w-[10rem] rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm amharic"
        />
        <input
          value={vPhone}
          onChange={(e) => setVPhone(e.target.value)}
          placeholder="ስልክ"
          className="w-36 rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm"
        />
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm text-white disabled:opacity-50"
        >
          ጎብኝ አክል
        </button>
      </form>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {JOURNEY_STAGES.map((stage) => {
          const isVisitorCol = stage.key === "visitor";
          const cards = isVisitorCol
            ? visitors
                .filter((v) => v.status === "active")
                .map((v) => ({ kind: "visitor" as const, data: v }))
            : servants
                .filter(
                  (s) =>
                    (s.journey_stage || "registered") === stage.key &&
                    s.status === "active"
                )
                .map((s) => ({ kind: "servant" as const, data: s }));

          return (
            <div
              key={stage.key}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3 min-h-[12rem]"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold amharic text-[var(--primary)]">
                  {stage.label_am}
                </h2>
                <span className="text-xs tabular-nums text-[var(--foreground)]/50">
                  {cards.length}
                </span>
              </div>
              <ul className="space-y-2">
                {cards.map((c) =>
                  c.kind === "visitor" ? (
                    <li
                      key={c.data.id}
                      className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-2.5 py-2"
                    >
                      <p className="text-sm font-medium amharic">
                        {c.data.full_name_am}
                      </p>
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => convertVisitor(c.data)}
                        className="mt-1.5 text-[11px] text-[var(--primary)] amharic hover:underline"
                      >
                        → ተመዝጋቢ
                      </button>
                    </li>
                  ) : (
                    <li
                      key={c.data.id}
                      className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-2.5 py-2"
                    >
                      <p className="text-sm font-medium amharic">
                        {c.data.full_name_am}
                      </p>
                      {nextStage(c.data.journey_stage || "registered") && (
                        <button
                          type="button"
                          disabled={saving}
                          onClick={() => advanceServant(c.data)}
                          className="mt-1.5 text-[11px] text-[var(--primary)] amharic hover:underline"
                        >
                          →{" "}
                          {stageLabel(
                            nextStage(c.data.journey_stage || "registered")!
                          )}
                        </button>
                      )}
                    </li>
                  )
                )}
                {cards.length === 0 && (
                  <li className="text-[11px] text-[var(--foreground)]/40 amharic text-center py-4">
                    ባዶ
                  </li>
                )}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
