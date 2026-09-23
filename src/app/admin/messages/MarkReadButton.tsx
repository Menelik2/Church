"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export function MarkReadButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function mark() {
    setLoading(true);
    const supabase = createClient();
    await supabase.from("contact_messages").update({ is_read: true }).eq("id", id);
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={mark}
      disabled={loading}
      className="text-xs rounded-lg border border-[var(--border)] px-2 py-1 hover:bg-[var(--muted)] disabled:opacity-50"
    >
      እንደተነበበ ምልክት
    </button>
  );
}
