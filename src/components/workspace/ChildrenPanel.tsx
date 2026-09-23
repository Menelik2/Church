"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatAppError, type AppError } from "@/lib/errors";
import { ErrorBanner, SuccessBanner } from "@/components/ui/ErrorBanner";

type Group = {
  id: string;
  band: string;
  title_am: string;
  facilitator_name: string | null;
  is_active: boolean;
};

type Activity = {
  id: string;
  group_id: string | null;
  activity_type: string;
  title_am: string;
  activity_date: string | null;
  present_count: number | null;
};

const BAND_AM: Record<string, string> = {
  deqiq: "ደቂቅ (7–10)",
  maekelawi: "ማዕከላዊያን (11–17)",
};

export function ChildrenPanel({
  initialGroups,
  initialActivities,
}: {
  initialGroups: Group[];
  initialActivities: Activity[];
}) {
  const [groups, setGroups] = useState(initialGroups);
  const [activities, setActivities] = useState(initialActivities);
  const [band, setBand] = useState("deqiq");
  const [gTitle, setGTitle] = useState("");
  const [fac, setFac] = useState("");
  const [aTitle, setATitle] = useState("");
  const [aType, setAType] = useState("lesson");
  const [aGroup, setAGroup] = useState("");
  const [present, setPresent] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  async function addGroup(e: React.FormEvent) {
    e.preventDefault();
    if (!gTitle.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data, error: dbErr } = await supabase
        .from("children_groups")
        .insert({
          band,
          title_am: gTitle.trim(),
          facilitator_name: fac.trim() || null,
          age_min: band === "deqiq" ? 7 : 11,
          age_max: band === "deqiq" ? 10 : 17,
          is_active: true,
        })
        .select("id, band, title_am, facilitator_name, is_active")
        .single();
      if (dbErr) {
        setError(formatAppError(dbErr));
        return;
      }
      if (data) setGroups((g) => [data as Group, ...g]);
      setGTitle("");
      setFac("");
      setOk("ቡድን ተመዝግቧል");
    } catch (err) {
      setError(formatAppError(err));
    } finally {
      setSaving(false);
    }
  }

  async function addActivity(e: React.FormEvent) {
    e.preventDefault();
    if (!aTitle.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data, error: dbErr } = await supabase
        .from("children_activities")
        .insert({
          group_id: aGroup || null,
          activity_type: aType,
          title_am: aTitle.trim(),
          present_count: present ? Number(present) : null,
          activity_date: new Date().toISOString().slice(0, 10),
        })
        .select(
          "id, group_id, activity_type, title_am, activity_date, present_count"
        )
        .single();
      if (dbErr) {
        setError(formatAppError(dbErr));
        return;
      }
      if (data) setActivities((a) => [data as Activity, ...a]);
      setATitle("");
      setPresent("");
      setOk("እንቅስቃሴ ተመዝግቧል");
    } catch (err) {
      setError(formatAppError(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      {error && <ErrorBanner error={error} onDismiss={() => setError(null)} />}
      {ok && <SuccessBanner message={ok} />}

      <section className="rounded-2xl border border-[var(--border)] p-4 space-y-3">
        <h3 className="text-sm font-semibold amharic">ደቂቅ / ማዕከላዊያን ቡድን</h3>
        <form onSubmit={addGroup} className="grid gap-2 sm:grid-cols-3">
          <select
            value={band}
            onChange={(e) => setBand(e.target.value)}
            className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm amharic"
          >
            <option value="deqiq">ደቂቅ (7–10)</option>
            <option value="maekelawi">ማዕከላዊያን (11–17)</option>
          </select>
          <input
            required
            value={gTitle}
            onChange={(e) => setGTitle(e.target.value)}
            placeholder="የቡድን ስም"
            className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm amharic"
          />
          <input
            value={fac}
            onChange={(e) => setFac(e.target.value)}
            placeholder="አስተማሪ / አመራር"
            className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm amharic"
          />
          <button
            type="submit"
            disabled={saving}
            className="sm:col-span-3 rounded-xl bg-[var(--primary)] py-2.5 text-sm text-white"
          >
            ቡድን አክል
          </button>
        </form>
        <ul className="space-y-1 text-sm amharic">
          {groups.map((g) => (
            <li
              key={g.id}
              className="flex justify-between border-b border-[var(--border)]/50 py-1.5"
            >
              <span>
                {g.title_am}{" "}
                <span className="text-[11px] text-[var(--foreground)]/45">
                  ({BAND_AM[g.band] ?? g.band})
                </span>
              </span>
              <span className="text-xs text-[var(--foreground)]/50">
                {g.facilitator_name || "—"}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-[var(--border)] p-4 space-y-3">
        <h3 className="text-sm font-semibold amharic">
          ትምህርት / ድራማ / ሐዋርያዊ ጉዞ
        </h3>
        <form onSubmit={addActivity} className="grid gap-2 sm:grid-cols-2">
          <select
            value={aType}
            onChange={(e) => setAType(e.target.value)}
            className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm amharic"
          >
            <option value="lesson">ትምህርት</option>
            <option value="drama">ድራማ / ጭውውት</option>
            <option value="trip">ሐዋርያዊ ጉዞ</option>
            <option value="other">ሌላ</option>
          </select>
          <select
            value={aGroup}
            onChange={(e) => setAGroup(e.target.value)}
            className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm amharic"
          >
            <option value="">ቡድን (አማራጭ)</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.title_am}
              </option>
            ))}
          </select>
          <input
            required
            value={aTitle}
            onChange={(e) => setATitle(e.target.value)}
            placeholder="ርዕስ"
            className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm amharic"
          />
          <input
            type="number"
            min={0}
            value={present}
            onChange={(e) => setPresent(e.target.value)}
            placeholder="ተገኝተዋል"
            className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={saving}
            className="sm:col-span-2 rounded-xl bg-[var(--primary)] py-2.5 text-sm text-white"
          >
            እንቅስቃሴ መዝግብ
          </button>
        </form>
        <ul className="space-y-1 text-sm amharic">
          {activities.slice(0, 25).map((a) => (
            <li
              key={a.id}
              className="flex justify-between border-b border-[var(--border)]/40 py-1.5"
            >
              <span>
                {a.title_am}{" "}
                <span className="text-[11px] text-[var(--foreground)]/45">
                  · {a.activity_type} · {a.activity_date}
                </span>
              </span>
              <span className="tabular-nums text-xs">
                {a.present_count ?? "—"}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
