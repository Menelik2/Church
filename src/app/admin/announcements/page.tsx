import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";
import { AnnouncementForm } from "./AnnouncementForm";
import { CommentActions } from "./CommentActions";
import Link from "next/link";

export default async function AdminAnnouncementsPage() {
  await requireAdmin();
  const supabase = await createClient();

  const { data: items } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  const { data: comments } = await supabase
    .from("announcement_comments")
    .select("id, author_name, author_email, body, is_approved, created_at, announcement_id, announcements(title_am, slug)")
    .order("created_at", { ascending: false })
    .limit(40);

  const pending = (comments ?? []).filter((c) => !c.is_approved);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--primary)] amharic">ወቅታዊ ጉዳዮች</h1>
      <p className="text-sm text-[var(--foreground)]/60 mt-1 amharic">
        ምስል ያለው ጽሁፍ ይፍጠሩ · አስተያየቶችን ያጽድቁ
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
          <h2 className="font-semibold amharic mb-4">አዲስ ወቅታዊ ጉዳይ</h2>
          <AnnouncementForm />
        </div>

        <div>
          <h2 className="font-semibold amharic mb-4">ያሉ ጉዳዮች</h2>
          <ul className="space-y-3">
            {(items ?? []).map((a) => (
              <li key={a.id} className="rounded-xl border border-[var(--border)] p-4">
                <div className="flex gap-3">
                  {a.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={a.image_url}
                      alt=""
                      className="h-14 w-14 shrink-0 rounded-lg object-cover"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium amharic">{a.title_am}</p>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <span
                          className={`text-xs rounded-full px-2 py-0.5 ${
                            a.published
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {a.published ? "ታትሟል" : "ረቂቅ"}
                        </span>
                        {a.is_featured && (
                          <span className="text-xs rounded-full bg-[var(--color-gold-100)] text-[var(--color-gold-800)] px-2 py-0.5">
                            መነሻ
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-[var(--foreground)]/50 line-clamp-2 amharic">
                      {a.body_am}
                    </p>
                    <Link
                      href={`/announcements/${a.slug}`}
                      className="mt-1 inline-block text-xs font-semibold text-[var(--primary)] amharic"
                    >
                      በድረ-ገጽ ይመልከቱ →
                    </Link>
                  </div>
                </div>
              </li>
            ))}
            {(!items || items.length === 0) && (
              <p className="text-sm text-[var(--foreground)]/50 amharic">ምንም ወቅታዊ ጉዳይ የለም።</p>
            )}
          </ul>
        </div>
      </div>

      <section className="mt-12">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold amharic text-[var(--primary)]">አስተያየቶች</h2>
          {pending.length > 0 && (
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-900 amharic">
              {pending.length} በመጠባበቅ ላይ
            </span>
          )}
        </div>
        <ul className="space-y-3">
          {(comments ?? []).map((c) => {
            const ann = c.announcements as { title_am?: string; slug?: string } | null;
            return (
              <li
                key={c.id}
                className={`rounded-xl border p-4 ${
                  c.is_approved
                    ? "border-[var(--border)] bg-[var(--card)]"
                    : "border-amber-200 bg-amber-50/50"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold amharic">{c.author_name}</p>
                    {c.author_email && (
                      <p className="text-[11px] text-[var(--foreground)]/45">{c.author_email}</p>
                    )}
                    <p className="mt-2 text-sm amharic leading-relaxed">{c.body}</p>
                    <p className="mt-1 text-[11px] text-[var(--foreground)]/40">
                      {ann?.title_am ? `በ «${ann.title_am}» · ` : ""}
                      {new Date(c.created_at).toLocaleString("am-ET")}
                      {!c.is_approved && " · በመጠባበቅ"}
                    </p>
                  </div>
                  <CommentActions id={c.id} approved={c.is_approved} />
                </div>
              </li>
            );
          })}
          {(!comments || comments.length === 0) && (
            <p className="text-sm text-[var(--foreground)]/50 amharic">እስካሁን አስተያየት የለም።</p>
          )}
        </ul>
      </section>
    </div>
  );
}
