"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function CommentActions({ id, approved }: { id: string; approved: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function act(action: "approve" | "reject" | "delete") {
    setBusy(true);
    const supabase = createClient();
    if (action === "delete") {
      await supabase.from("announcement_comments").delete().eq("id", id);
    } else {
      await supabase
        .from("announcement_comments")
        .update({ is_approved: action === "approve" })
        .eq("id", id);
    }
    setBusy(false);
    router.refresh();
  }

  return (
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
  );
}
