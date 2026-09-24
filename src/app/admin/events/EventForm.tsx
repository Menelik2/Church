"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function makeSlug(title: string) {
  const base =
    title
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\u1200-\u137F-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 50) || "event";
  return `${base}-${Date.now().toString(36)}`;
}

export function EventForm() {
  const router = useRouter();
  const [titleAm, setTitleAm] = useState("");
  const [descriptionAm, setDescriptionAm] = useState("");
  const [location, setLocation] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [published, setPublished] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setOk(false);

    if (!titleAm.trim()) {
      setError("ርዕስ ያስፈልጋል።");
      setSaving(false);
      return;
    }
    if (!startsAt) {
      setError("መጀመሪያ ሰዓት ያስፈልጋል።");
      setSaving(false);
      return;
    }

    const startDate = new Date(startsAt);
    if (Number.isNaN(startDate.getTime())) {
      setError("ልክ ያልሆነ ቀን/ሰዓት።");
      setSaving(false);
      return;
    }

    let endsIso: string | null = null;
    if (endsAt) {
      const endDate = new Date(endsAt);
      if (Number.isNaN(endDate.getTime())) {
        setError("ልክ ያልሆነ የመጨረሻ ሰዓት።");
        setSaving(false);
        return;
      }
      if (endDate.getTime() < startDate.getTime()) {
        setError("መጨረሻ ሰዓት ከመጀመሪያ በኋላ መሆን አለበት።");
        setSaving(false);
        return;
      }
      endsIso = endDate.toISOString();
    }

    const slug = makeSlug(titleAm);
    const supabase = createClient();
    const { error: err } = await supabase.from("events").insert({
      title_am: titleAm.trim(),
      description_am: descriptionAm.trim() || null,
      location: location.trim() || null,
      starts_at: startDate.toISOString(),
      ends_at: endsIso,
      slug,
      published,
    });

    setSaving(false);
    if (err) {
      setError(err.message || "ማስቀመጥ አልተቻለም።");
      return;
    }

    setTitleAm("");
    setDescriptionAm("");
    setLocation("");
    setStartsAt("");
    setEndsAt("");
    setPublished(true);
    setOk(true);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1 amharic">ርዕስ *</label>
        <input
          value={titleAm}
          onChange={(e) => setTitleAm(e.target.value)}
          required
          placeholder="ምሳሌ፡ የጠቅላላ ጉባኤ ስብሰባ"
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm amharic"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 amharic">መግለጫ</label>
        <textarea
          value={descriptionAm}
          onChange={(e) => setDescriptionAm(e.target.value)}
          rows={3}
          placeholder="ስለ ዝግጅቱ አጭር መግለጫ…"
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm amharic"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 amharic">ቦታ</label>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="ምሳሌ፡ ቤተ ክርስቲያን አዳራሽ"
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm amharic"
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-1 amharic">መጀመሪያ *</label>
          <input
            type="datetime-local"
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
            required
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 amharic">መጨረሻ</label>
          <input
            type="datetime-local"
            value={endsAt}
            onChange={(e) => setEndsAt(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm"
          />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm amharic">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="rounded border-[var(--border)]"
        />
        ወዲያው አትም (በድረ-ገጹ ይታይ)
      </label>
      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 amharic">{error}</p>
      )}
      {ok && (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 amharic">
          ዝግጅቱ ተፈጥሯል።
        </p>
      )}
      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-95 disabled:opacity-50 amharic sm:w-auto"
      >
        {saving ? "እየተቀመጠ…" : "ዝግጅት ፍጠር"}
      </button>
    </form>
  );
}
