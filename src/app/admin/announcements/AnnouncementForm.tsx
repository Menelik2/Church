"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function toSlug(text: string) {
  return (
    text
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\u1200-\u137F-]/g, "")
      .slice(0, 80) || `ann-${Date.now()}`
  );
}

export function AnnouncementForm() {
  const router = useRouter();
  const [titleAm, setTitleAm] = useState("");
  const [bodyAm, setBodyAm] = useState("");
  const [published, setPublished] = useState(true);
  const [featured, setFeatured] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const slug = toSlug(titleAm);

    const { error: err } = await supabase.from("announcements").insert({
      title_am: titleAm,
      body_am: bodyAm,
      slug,
      published,
      is_featured: featured,
      published_at: published ? new Date().toISOString() : null,
    });

    setSaving(false);

    if (err) {
      setError(err.message);
      return;
    }

    setTitleAm("");
    setBodyAm("");
    setFeatured(true);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1 amharic">ርዕስ</label>
        <input
          value={titleAm}
          onChange={(e) => setTitleAm(e.target.value)}
          required
          placeholder="የወቅታዊ ጉዳይ ርዕስ"
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm amharic"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 amharic">ይዘት</label>
        <textarea
          value={bodyAm}
          onChange={(e) => setBodyAm(e.target.value)}
          required
          rows={5}
          placeholder="ሙሉ መግለጫ…"
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm amharic"
        />
      </div>
      <div className="flex flex-wrap gap-4 text-sm amharic">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          አትም (በድረ-ገጽ ይታይ)
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
          />
          በመነሻ ገጽ አሳይ
        </label>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={saving}
        className="rounded-xl bg-[var(--primary)] text-white px-4 py-2.5 text-sm font-semibold disabled:opacity-50 amharic"
      >
        {saving ? "እየተቀመጠ…" : "ወቅታዊ ጉዳይ ፍጠር"}
      </button>
    </form>
  );
}
