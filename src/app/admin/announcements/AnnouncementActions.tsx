"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AnnouncementActions({
  id,
  published,
  featured,
  onEdit,
}: {
  id: string;
  published: boolean;
  featured: boolean;
  onEdit?: () => void;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function patch(body: Record<string, unknown>) {
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/admin/announcements", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...body }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Update failed");
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "ስህተት");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!confirm("ይህን ወቅታዊ ጉዳይ ሙሉ በሙሉ ማጥፋት ይፈልጋሉ?")) return;
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch(
        `/api/admin/announcements?id=${encodeURIComponent(id)}`,
        { method: "DELETE" }
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Delete failed");
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "ስህተት");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-2 flex flex-wrap items-center gap-2">
      {onEdit && (
        <button
          type="button"
          disabled={busy}
          onClick={onEdit}
          className="rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] px-2 py-1 text-[11px] font-medium amharic hover:bg-[var(--primary)]/20 disabled:opacity-50"
        >
          አርትዕ
        </button>
      )}
      <button
        type="button"
        disabled={busy}
        onClick={() => patch({ published: !published })}
        className="rounded-lg border border-[var(--border)] px-2 py-1 text-[11px] font-medium amharic hover:bg-[var(--muted)] disabled:opacity-50"
      >
        {published ? "ደብቅ" : "አትም"}
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={() => patch({ is_featured: !featured })}
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
