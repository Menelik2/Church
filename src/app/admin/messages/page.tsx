import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";
import { MarkReadButton } from "./MarkReadButton";

export default async function AdminMessagesPage() {
  await requireAdmin();
  const supabase = await createClient();

  const { data: messages } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--primary)] amharic">የመገኛ መልዕክቶች</h1>
      <p className="text-sm text-[var(--foreground)]/60 mt-1">ከእውቂያ ቅጽ የመጡ መልዕክቶች</p>

      <ul className="mt-6 space-y-3">
        {(messages ?? []).map((m) => (
          <li
            key={m.id}
            className={`rounded-2xl border p-5 ${
              m.is_read
                ? "border-[var(--border)] bg-[var(--card)] opacity-80"
                : "border-[var(--primary)]/30 bg-[var(--primary)]/5"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-medium">{m.name}</p>
                <p className="text-xs text-[var(--foreground)]/50">
                  {[m.email, m.phone].filter(Boolean).join(" · ") || "—"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <time className="text-xs text-[var(--foreground)]/40">
                  {new Date(m.created_at).toLocaleString("am-ET")}
                </time>
                {!m.is_read && <MarkReadButton id={m.id} />}
              </div>
            </div>
            {m.subject && <p className="mt-2 text-sm font-medium">{m.subject}</p>}
            <p className="mt-2 text-sm whitespace-pre-wrap">{m.message}</p>
          </li>
        ))}
        {(!messages || messages.length === 0) && (
          <p className="text-sm text-[var(--foreground)]/50 py-8 text-center">ምንም መልዕክት የለም።</p>
        )}
      </ul>
    </div>
  );
}
