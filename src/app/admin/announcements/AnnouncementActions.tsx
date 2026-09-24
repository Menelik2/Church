"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatAppError } from "@/lib/supabase/safe-count";

export function AnnouncementActions({
  id,
  published,
  featured,
}: {
  id: string;
  published: boolean;
  featured: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function togglePublish() {
    setBusy(true);
    setErr(null);
    try {
      const supabase = createClient();
      const next = !published;
      const { error } = await supabase
        .from("announcements")
        .update({
          published: next,
          published_at: next ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);
      if (error) throw error;
      router.refresh();
    } catch (e) {
      setErr(formatAppError(e));
    } finally {
      setBusy(false);
    }
  }

  async function toggleFeatured() {
    setBusy(true);
    setErr(null);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("announcements")
        .update({
          is_featured: !featured,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);
      if (error) throw error;
      router.refresh();
    } catch (e) {
      setErr(formatAppError(e));
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!confirm("ይህን ወቅታዊ ጉዳይ ሙሉ በሙሉ ማጥፋት ይፈልጋሉ?")) return;
    setBusy(true);
    setErr(null);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("announcements")
        .delete()
        .eq("id", id);
      if (error) throw error;
      router.refresh();
    } catch (e) {
      setErr(formatAppError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-2 flex flex-wrap items-center gap-2">
      <button
        type="button"
        disabled={busy}
        onClick={togglePublish}
        className="rounded-lg border border-[var(--border)] px-2 py-1 text-[11px] font-medium amharic hover:bg-[var(--muted)] disabled:opacity-50"
      >
        {published ? "ደብቅ" : "አትም"}
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={toggleFeatured}
        className="rounded-lg border border-[var(--border)] px-2 py-1 text-[11px] font-medium amharic hover:bg-[var(--muted)] disabled:opacity-50"
      >
        {featured ? "ከመነሻ አስወግድ" : "በመነሻ አሳይ"}
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={remove}
        className="rounded-lg bg-red-600/90 px-2 py-1 text-[11px] font-medium text-white amharic disabled:opacity-50"
      >
        ሰርዝ
      </button>
      {err && <p className="w-full text-[10px] text-red-600 amharic">{err}</p>}
    </div>
  );
}
