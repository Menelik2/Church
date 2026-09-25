"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export function MarkReadButton({
  id,
  table = "contact_messages",
}: {
  id: string;
  table?: "contact_messages" | "membership_notifications";
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function mark() {
    setLoading(true);
    try {
      const supabase = createClient();
      await supabase.from(table).update({ is_read: true }).eq("id", id);
    } finally {
      setLoading(false);
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={mark}
      disabled={loading}
      className="rounded-lg border border-[var(--border)] px-2 py-1 text-xs hover:bg-[var(--muted)] disabled:opacity-50 amharic"
    >
      {loading ? "…" : "እንደተነበበ"}
    </button>
  );
}
