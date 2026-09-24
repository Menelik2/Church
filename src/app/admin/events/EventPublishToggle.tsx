"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function EventPublishToggle({
  id,
  published,
}: {
  id: string;
  published: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    const supabase = createClient();
    await supabase.from("events").update({ published: !published }).eq("id", id);
    setBusy(false);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      className="rounded-lg border border-[var(--border)] px-2.5 py-1 text-[11px] font-semibold amharic transition hover:bg-[var(--muted)] disabled:opacity-50"
    >
      {busy ? "…" : published ? "ከህትመት አውጣ" : "አትም"}
    </button>
  );
}
