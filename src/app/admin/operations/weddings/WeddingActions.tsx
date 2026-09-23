"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export function WeddingActions({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function setStatus(status: string) {
    setLoading(true);
    const supabase = createClient();
    await supabase.from("wedding_requests").update({ status }).eq("id", id);
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <button type="button" disabled={loading} onClick={() => setStatus("under_review")} className="rounded-lg border border-[var(--border)] text-xs px-3 py-1.5">በግምገማ</button>
      <button type="button" disabled={loading} onClick={() => setStatus("approved")} className="rounded-lg bg-emerald-700 text-white text-xs px-3 py-1.5">አጽድቅ</button>
      <button type="button" disabled={loading} onClick={() => setStatus("rejected")} className="rounded-lg bg-red-700 text-white text-xs px-3 py-1.5">ውድቅ</button>
      <button type="button" disabled={loading} onClick={() => setStatus("cancelled")} className="rounded-lg border border-[var(--border)] text-xs px-3 py-1.5">ሰርዝ</button>
    </div>
  );
}
