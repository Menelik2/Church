"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatAppError, type AppError } from "@/lib/errors";
import { ErrorBanner, SuccessBanner } from "@/components/ui/ErrorBanner";

type Member = {
  id: string;
  full_name_am: string;
  voice_part: string | null;
  is_active: boolean;
};

type Asset = {
  id: string;
  asset_type: string;
  name_am: string;
  quantity: number;
  condition: string | null;
  assigned_member_id: string | null;
};

export function MezmurPanel({
  initialMembers,
  initialAssets,
}: {
  initialMembers: Member[];
  initialAssets: Asset[];
}) {
  const [members, setMembers] = useState(initialMembers);
  const [assets, setAssets] = useState(initialAssets);
  const [name, setName] = useState("");
  const [voice, setVoice] = useState("");
  const [assetName, setAssetName] = useState("");
  const [assetType, setAssetType] = useState<"instrument" | "costume">(
    "instrument"
  );
  const [rehearsalNote, setRehearsalNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [presentIds, setPresentIds] = useState<Set<string>>(new Set());

  async function addMember(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data, error: dbErr } = await supabase
        .from("mezmur_members")
        .insert({
          full_name_am: name.trim(),
          voice_part: voice.trim() || null,
          is_active: true,
        })
        .select("id, full_name_am, voice_part, is_active")
        .single();
      if (dbErr) {
        setError(formatAppError(dbErr));
        return;
      }
      if (data) setMembers((m) => [data as Member, ...m]);
      setName("");
      setVoice("");
      setOk("አባል ተጨመረ");
    } catch (err) {
      setError(formatAppError(err));
    } finally {
      setSaving(false);
    }
  }

  async function addAsset(e: React.FormEvent) {
    e.preventDefault();
    if (!assetName.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data, error: dbErr } = await supabase
        .from("mezmur_assets")
        .insert({
          asset_type: assetType,
          name_am: assetName.trim(),
          quantity: 1,
          condition: "good",
        })
        .select(
          "id, asset_type, name_am, quantity, condition, assigned_member_id"
        )
        .single();
      if (dbErr) {
        setError(formatAppError(dbErr));
        return;
      }
      if (data) setAssets((a) => [data as Asset, ...a]);
      setAssetName("");
      setOk("ንብረት ተመዝግቧል");
    } catch (err) {
      setError(formatAppError(err));
    } finally {
      setSaving(false);
    }
  }

  function togglePresent(id: string) {
    setPresentIds((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }

  async function saveRehearsal() {
    setSaving(true);
    setError(null);
    setOk(null);
    try {
      const supabase = createClient();
      const { data: reh, error: rErr } = await supabase
        .from("mezmur_rehearsals")
        .insert({
          rehearsal_date: new Date().toISOString().slice(0, 10),
          notes: rehearsalNote.trim() || null,
        })
        .select("id")
        .single();
      if (rErr || !reh) {
        setError(formatAppError(rErr));
        return;
      }
      const active = members.filter((m) => m.is_active);
      const rows = active.map((m) => ({
        rehearsal_id: reh.id,
        member_id: m.id,
        status: presentIds.has(m.id) ? "present" : "absent",
      }));
      if (rows.length) {
        const { error: aErr } = await supabase
          .from("mezmur_rehearsal_attendance")
          .insert(rows);
        if (aErr) {
          setError(formatAppError(aErr));
          return;
        }
      }
      setOk(`ልምምድ ተመዝግቧል (${presentIds.size} ተገኝተዋል)`);
      setPresentIds(new Set());
      setRehearsalNote("");
    } catch (err) {
      setError(formatAppError(err));
    } finally {
      setSaving(false);
    }
  }

  const instruments = assets.filter((a) => a.asset_type === "instrument");
  const costumes = assets.filter((a) => a.asset_type === "costume");

  return (
    <div className="space-y-8">
      {error && <ErrorBanner error={error} onDismiss={() => setError(null)} />}
      {ok && <SuccessBanner message={ok} />}

      <section>
        <h3 className="text-sm font-semibold amharic mb-2">የመዝሙር አባላት</h3>
        <form onSubmit={addMember} className="flex flex-wrap gap-2 mb-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ስም"
            className="flex-1 min-w-[8rem] rounded-xl border border-[var(--border)] px-3 py-2 text-sm amharic"
          />
          <input
            value={voice}
            onChange={(e) => setVoice(e.target.value)}
            placeholder="ድምጽ (ተኖር…)"
            className="w-32 rounded-xl border border-[var(--border)] px-3 py-2 text-sm amharic"
          />
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm text-white"
          >
            አክል
          </button>
        </form>
        <ul className="space-y-1">
          {members.map((m) => (
            <li
              key={m.id}
              className="text-sm amharic flex justify-between border-b border-[var(--border)]/50 py-1.5"
            >
              <span>{m.full_name_am}</span>
              <span className="text-[var(--foreground)]/45 text-xs">
                {m.voice_part || "—"}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-[var(--border)] p-4">
        <h3 className="text-sm font-semibold amharic mb-2">የዛሬ ልምምድ መገኘት</h3>
        <ul className="space-y-1 mb-3 max-h-48 overflow-y-auto">
          {members
            .filter((m) => m.is_active)
            .map((m) => (
              <li key={m.id}>
                <label className="flex items-center gap-2 text-sm amharic cursor-pointer">
                  <input
                    type="checkbox"
                    checked={presentIds.has(m.id)}
                    onChange={() => togglePresent(m.id)}
                  />
                  {m.full_name_am}
                </label>
              </li>
            ))}
        </ul>
        <input
          value={rehearsalNote}
          onChange={(e) => setRehearsalNote(e.target.value)}
          placeholder="ማስታወሻ…"
          className="w-full rounded-xl border border-[var(--border)] px-3 py-2 text-sm amharic mb-2"
        />
        <button
          type="button"
          disabled={saving}
          onClick={saveRehearsal}
          className="w-full rounded-xl bg-[var(--primary)] py-2.5 text-sm text-white disabled:opacity-50"
        >
          ልምምድ አስቀምጥ
        </button>
      </section>

      <section>
        <h3 className="text-sm font-semibold amharic mb-2">
          መሳሪያዎችና ልብሶች
        </h3>
        <form onSubmit={addAsset} className="flex flex-wrap gap-2 mb-3">
          <select
            value={assetType}
            onChange={(e) =>
              setAssetType(e.target.value as "instrument" | "costume")
            }
            className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm amharic"
          >
            <option value="instrument">መሳሪያ</option>
            <option value="costume">ልብስ</option>
          </select>
          <input
            value={assetName}
            onChange={(e) => setAssetName(e.target.value)}
            placeholder="ስም"
            className="flex-1 rounded-xl border border-[var(--border)] px-3 py-2 text-sm amharic"
          />
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm text-white"
          >
            አክል
          </button>
        </form>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium text-[var(--foreground)]/50 amharic mb-1">
              መሳሪያዎች
            </p>
            <ul className="text-sm amharic space-y-1">
              {instruments.map((a) => (
                <li key={a.id}>
                  {a.name_am} ×{a.quantity}
                </li>
              ))}
              {instruments.length === 0 && (
                <li className="text-[var(--foreground)]/40">—</li>
              )}
            </ul>
          </div>
          <div>
            <p className="text-xs font-medium text-[var(--foreground)]/50 amharic mb-1">
              ልብሶች
            </p>
            <ul className="text-sm amharic space-y-1">
              {costumes.map((a) => (
                <li key={a.id}>
                  {a.name_am} ×{a.quantity}
                </li>
              ))}
              {costumes.length === 0 && (
                <li className="text-[var(--foreground)]/40">—</li>
              )}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
