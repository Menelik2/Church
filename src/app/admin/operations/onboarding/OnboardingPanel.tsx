"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { ONBOARDING_STEPS } from "@/data/onboarding-steps";

type ProgressRow = {
  step_key: string;
  completed: boolean;
  notes: string | null;
};

type MentorOption = { id: string; full_name_am: string };

export function OnboardingPanel({
  servantId,
  mentorId,
  mentors,
  progress,
}: {
  servantId: string;
  mentorId: string | null;
  mentors: MentorOption[];
  progress: ProgressRow[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [localMentor, setLocalMentor] = useState(mentorId ?? "");

  const byKey = Object.fromEntries(progress.map((p) => [p.step_key, p]));

  async function toggleStep(stepKey: string, currentlyDone: boolean) {
    setLoading(true);
    const supabase = createClient();
    const completed = !currentlyDone;
    await supabase.from("onboarding_progress").upsert(
      {
        servant_id: servantId,
        step_key: stepKey,
        completed,
        completed_at: completed ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "servant_id,step_key" }
    );

    if (stepKey === "mentor_assigned" && completed && localMentor) {
      await supabase
        .from("servants")
        .update({ mentor_id: localMentor || null })
        .eq("id", servantId);
    }

    // Mark onboarding complete when all steps done
    const nextProgress = ONBOARDING_STEPS.map((s) =>
      s.key === stepKey ? completed : !!byKey[s.key]?.completed
    );
    if (nextProgress.every(Boolean)) {
      await supabase
        .from("servants")
        .update({ onboarding_completed_at: new Date().toISOString() })
        .eq("id", servantId);
    } else {
      await supabase
        .from("servants")
        .update({ onboarding_completed_at: null })
        .eq("id", servantId);
    }

    setLoading(false);
    router.refresh();
  }

  async function saveMentor(value: string) {
    setLocalMentor(value);
    setLoading(true);
    const supabase = createClient();
    await supabase
      .from("servants")
      .update({ mentor_id: value || null })
      .eq("id", servantId);

    if (value) {
      await supabase.from("onboarding_progress").upsert(
        {
          servant_id: servantId,
          step_key: "mentor_assigned",
          completed: true,
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "servant_id,step_key" }
      );
    }
    setLoading(false);
    router.refresh();
  }

  const doneCount = ONBOARDING_STEPS.filter((s) => byKey[s.key]?.completed).length;

  return (
    <div className="mt-4 space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-xs font-medium amharic text-[var(--foreground)]/70">
          አማካሪ (mentor)
        </label>
        <select
          value={localMentor}
          disabled={loading}
          onChange={(e) => saveMentor(e.target.value)}
          className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-sm amharic min-w-[12rem]"
        >
          <option value="">— አልተመደበም —</option>
          {mentors
            .filter((m) => m.id !== servantId)
            .map((m) => (
              <option key={m.id} value={m.id}>
                {m.full_name_am}
              </option>
            ))}
        </select>
        <span className="text-xs text-[var(--foreground)]/50 tabular-nums">
          {doneCount}/{ONBOARDING_STEPS.length}
        </span>
      </div>

      <ul className="space-y-2">
        {ONBOARDING_STEPS.map((step) => {
          const row = byKey[step.key];
          const done = !!row?.completed;
          return (
            <li
              key={step.key}
              className="flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 px-3 py-2.5"
            >
              <input
                type="checkbox"
                checked={done}
                disabled={loading}
                onChange={() => toggleStep(step.key, done)}
                className="mt-1 h-4 w-4 rounded border-[var(--border)] accent-[var(--primary)]"
              />
              <div className="min-w-0 flex-1">
                <p
                  className={`text-sm amharic font-medium ${done ? "line-through opacity-60" : ""}`}
                >
                  {step.order}. {step.label_am}
                </p>
                <p className="text-xs text-[var(--foreground)]/55 amharic mt-0.5">
                  {step.description_am}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
