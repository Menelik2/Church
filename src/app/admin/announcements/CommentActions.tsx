"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatAppError } from "@/lib/supabase/safe-count";

export function CommentActions({
  id,
  approved,
}: {
  id: string;
  approved: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function act(action: "approve" | "reject" | "delete") {
    setBusy(true);
    setErr(null);
    try {
      const supabase = createClient();
      if (action === "delete") {
        const { error } = await supabase
          .from("announcement_comments")
          .delete()
          .eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("announcement_comments")
          .update({ is_approved: action === "approve" })
          .eq("id", id);
        if (error) throw error;
      }
      router.refresh();
    } catch (e) {
      setErr(formatAppError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex flex-wrap gap-2">
        {!approved && (
          <button
            type="button"
            disabled={busy}
            onClick={() => act("approve")}
            className="rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white disabled:opacity-50 amharic"
          >
            አጽድቅ
          </button>
        )}
        {approved && (
          <button
            type="button"
            disabled={busy}
            onClick={() => act("reject")}
            className="rounded-lg bg-amber-600 px-2.5 py-1 text-xs font-medium text-white disabled:opacity-50 amharic"
          >
            ደብቅ
          </button>
        )}
        <button
          type="button"
          disabled={busy}
          onClick={() => act("delete")}
          className="rounded-lg bg-red-600/90 px-2.5 py-1 text-xs font-medium text-white disabled:opacity-50 amharic"
        >
          ሰርዝ
        </button>
      </div>
      {err && <p className="text-[10px] text-red-600 amharic">{err}</p>}
    </div>
  );
}
