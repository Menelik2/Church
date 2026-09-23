"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export function MembershipActions({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function setStatus(status: "approved" | "rejected" | "needs_info") {
    setLoading(true);
    const supabase = createClient();
    await supabase
      .from("membership_applications")
      .update({ status, reviewed_at: new Date().toISOString() })
      .eq("id", id);
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <button type="button" disabled={loading} onClick={() => setStatus("approved")} className="rounded-lg bg-emerald-700 text-white text-xs px-3 py-1.5 disabled:opacity-50">አጽድቅ</button>
      <button type="button" disabled={loading} onClick={() => setStatus("needs_info")} className="rounded-lg border border-[var(--border)] text-xs px-3 py-1.5 disabled:opacity-50">ተጨማሪ መረጃ</button>
      <button type="button" disabled={loading} onClick={() => setStatus("rejected")} className="rounded-lg bg-red-700 text-white text-xs px-3 py-1.5 disabled:opacity-50">ውድቅ</button>
    </div>
  );
}
