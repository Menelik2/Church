"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type RollServant = {
  id: string;
  full_name_am: string;
  phone: string | null;
  existingStatus: "present" | "absent" | "excused" | null;
};

type Status = "present" | "absent" | "excused";

export function AttendanceRoll({
  date,
  servants,
}: {
  date: string;
  servants: RollServant[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [marks, setMarks] = useState<Record<string, Status | "">>(() => {
    const init: Record<string, Status | ""> = {};
    for (const s of servants) {
      init[s.id] = s.existingStatus ?? "";
    }
    return init;
  });
  const [message, setMessage] = useState<string | null>(null);

  function setAll(status: Status) {
    const next: Record<string, Status | ""> = {};
    for (const s of servants) next[s.id] = status;
    setMarks(next);
  }

  async function save() {
    setLoading(true);
    setMessage(null);
    const supabase = createClient();
    const rows = servants
      .filter((s) => marks[s.id])
      .map((s) => ({
        servant_id: s.id,
        attendance_date: date,
        status: marks[s.id] as Status,
        gathering_type: "regular" as const,
      }));

    if (rows.length === 0) {
      setMessage("ምንም ምልክት አልተመረጠም።");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("servant_attendance").upsert(rows, {
      onConflict: "servant_id,attendance_date,gathering_type",
    });

    setLoading(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    setMessage(`ተቀምጧል (${rows.length})`);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setAll("present")}
          className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs amharic"
        >
          ሁሉንም ተገኝቷል
        </button>
        <button
          type="button"
          onClick={() => setAll("absent")}
          className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs amharic"
        >
          ሁሉንም አልተገኘም
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={save}
          className="rounded-lg bg-[var(--primary)] text-white px-4 py-1.5 text-xs font-semibold disabled:opacity-50 amharic"
        >
          {loading ? "በመቀመጥ…" : "አስቀምጥ"}
        </button>
      </div>

      {message && (
        <p className="text-sm text-[var(--foreground)]/70 amharic">{message}</p>
      )}

      <ul className="space-y-2">
        {servants.map((s) => (
          <li
            key={s.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2.5"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium amharic">{s.full_name_am}</p>
              {s.phone && (
                <p className="text-xs text-[var(--foreground)]/50">{s.phone}</p>
              )}
            </div>
            <select
              value={marks[s.id] ?? ""}
              onChange={(e) =>
                setMarks((m) => ({
                  ...m,
                  [s.id]: e.target.value as Status | "",
                }))
              }
              className="rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs px-2 py-1.5 amharic"
            >
              <option value="">—</option>
              <option value="present">ተገኝቷል</option>
              <option value="absent">አልተገኘም</option>
              <option value="excused">በፈቃድ</option>
            </select>
          </li>
        ))}
        {servants.length === 0 && (
          <li className="text-center text-sm text-[var(--foreground)]/50 py-8 amharic">
            ንቁ አገልጋይ የለም።
          </li>
        )}
      </ul>
    </div>
  );
}
