"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function EventForm() {
  const router = useRouter();
  const [titleAm, setTitleAm] = useState("");
  const [descriptionAm, setDescriptionAm] = useState("");
  const [location, setLocation] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [published, setPublished] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const slug =
      titleAm
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w\u1200-\u137F-]/g, "")
        .slice(0, 60) || `event-${Date.now()}`;

    const supabase = createClient();
    const { error: err } = await supabase.from("events").insert({
      title_am: titleAm,
      description_am: descriptionAm || null,
      location: location || null,
      starts_at: new Date(startsAt).toISOString(),
      slug,
      published,
    });

    setSaving(false);
    if (err) {
      setError(err.message);
      return;
    }
    setTitleAm("");
    setDescriptionAm("");
    setLocation("");
    setStartsAt("");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">ርዕስ</label>
        <input
          value={titleAm}
          onChange={(e) => setTitleAm(e.target.value)}
          required
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm amharic"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">መግለጫ</label>
        <textarea
          value={descriptionAm}
          onChange={(e) => setDescriptionAm(e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm amharic"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">ቦታ</label>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">መጀመሪያ ሰዓት</label>
        <input
          type="datetime-local"
          value={startsAt}
          onChange={(e) => setStartsAt(e.target.value)}
          required
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
        አትም
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={saving}
        className="rounded-xl bg-[var(--primary)] text-white px-4 py-2 text-sm disabled:opacity-50"
      >
        {saving ? "…" : "ፍጠር"}
      </button>
    </form>
  );
}
