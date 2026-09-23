"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Article } from "@/types/database";

export function ArticleEditForm({ article }: { article: Article }) {
  const router = useRouter();
  const [titleAm, setTitleAm] = useState(article.title_am);
  const [titleEn, setTitleEn] = useState(article.title_en ?? "");
  const [contentAm, setContentAm] = useState(article.content_am);
  const [published, setPublished] = useState(article.published);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const supabase = createClient();
    const { error } = await supabase
      .from("articles")
      .update({
        title_am: titleAm,
        title_en: titleEn || null,
        content_am: contentAm,
        published,
      })
      .eq("id", article.id);

    setSaving(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("ተቀምጧል።");
    router.refresh();
  }

  return (
    <form onSubmit={onSave} className="space-y-5 max-w-3xl">
      <div>
        <label className="block text-sm font-medium mb-1.5">ርዕስ (አማርኛ)</label>
        <input
          value={titleAm}
          onChange={(e) => setTitleAm(e.target.value)}
          required
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm amharic"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Title (EN)</label>
        <input
          value={titleEn}
          onChange={(e) => setTitleEn(e.target.value)}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">ይዘት (አማርኛ)</label>
        <textarea
          value={contentAm}
          onChange={(e) => setContentAm(e.target.value)}
          required
          rows={16}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm amharic leading-relaxed font-mono"
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="rounded"
        />
        ታትሟል (በድረ-ገጽ ይታይ)
      </label>

      {message && (
        <p className={`text-sm ${message.includes("ተቀምጧል") ? "text-emerald-600" : "text-red-600"}`}>
          {message}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-[var(--primary)] text-white px-5 py-2.5 text-sm font-medium disabled:opacity-50"
        >
          {saving ? "በማስቀመጥ ላይ…" : "አስቀምጥ"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/articles")}
          className="rounded-xl border border-[var(--border)] px-5 py-2.5 text-sm"
        >
          ተመለስ
        </button>
      </div>
    </form>
  );
}
