import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";
import { AnnouncementForm } from "./AnnouncementForm";

export default async function AdminAnnouncementsPage() {
  await requireAdmin();
  const supabase = await createClient();

  const { data: items } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--primary)] amharic">ማስታወቂያዎች</h1>
      <p className="text-sm text-[var(--foreground)]/60 mt-1">አዲስ ማስታወቂያ ይፍጠሩ ወይም ያሉትን ያስተዳድሩ</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
          <h2 className="font-semibold amharic mb-4">አዲስ ማስታወቂያ</h2>
          <AnnouncementForm />
        </div>

        <div>
          <h2 className="font-semibold amharic mb-4">ያሉ ማስታወቂያዎች</h2>
          <ul className="space-y-3">
            {(items ?? []).map((a) => (
              <li key={a.id} className="rounded-xl border border-[var(--border)] p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium amharic">{a.title_am}</p>
                  <span
                    className={`shrink-0 text-xs rounded-full px-2 py-0.5 ${
                      a.published ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {a.published ? "ታትሟል" : "ረቂቅ"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-[var(--foreground)]/50">
                  {a.slug} · {new Date(a.created_at).toLocaleDateString("am-ET")}
                </p>
              </li>
            ))}
            {(!items || items.length === 0) && (
              <p className="text-sm text-[var(--foreground)]/50">ምንም ማስታወቂያ የለም።</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
