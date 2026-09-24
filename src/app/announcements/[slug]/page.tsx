import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CommentForm } from "@/components/announcements/CommentForm";
import { MessageCircle } from "lucide-react";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("announcements")
      .select("title_am, body_am")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    if (data) {
      return {
        title: data.title_am,
        description: data.body_am?.slice(0, 140),
      };
    }
  } catch {
    /* ignore */
  }
  return { title: "ወቅታዊ ጉዳይ" };
}

export default async function AnnouncementDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: a } = await supabase
    .from("announcements")
    .select("id, title_am, body_am, slug, image_url, is_featured, published_at, created_at")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (!a) notFound();

  const { data: comments } = await supabase
    .from("announcement_comments")
    .select("id, author_name, body, created_at")
    .eq("announcement_id", a.id)
    .eq("is_approved", true)
    .order("created_at", { ascending: true });

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/announcements" className="text-sm font-semibold text-[var(--primary)] amharic">
        ← ወቅታዊ ጉዳዮች
      </Link>

      <header className="mt-6">
        {a.is_featured && (
          <span className="text-xs rounded-full bg-[var(--color-gold-100)] text-[var(--color-gold-800)] px-2 py-0.5 amharic">
            በመነሻ
          </span>
        )}
        <h1 className="mt-2 text-2xl font-bold amharic text-[var(--primary)] sm:text-3xl">
          {a.title_am}
        </h1>
        <time className="mt-2 block text-sm text-[var(--foreground)]/50">
          {new Date(a.published_at || a.created_at).toLocaleDateString("am-ET", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      </header>

      {a.image_url && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--border)] shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={a.image_url} alt={a.title_am} className="w-full object-cover max-h-[28rem]" />
        </div>
      )}

      <div className="mt-6 prose-am text-[var(--foreground)]/85 amharic whitespace-pre-wrap leading-relaxed">
        {a.body_am}
      </div>

      <section className="mt-12 border-t border-[var(--border)] pt-8">
        <div className="mb-4 flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-[var(--primary)]" />
          <h2 className="text-lg font-bold amharic text-[var(--primary)]">
            አስተያየቶች ({(comments ?? []).length})
          </h2>
        </div>

        <ul className="mb-6 space-y-3">
          {(comments ?? []).map((c) => (
            <li key={c.id} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
              <p className="text-sm font-semibold amharic text-[var(--foreground)]">{c.author_name}</p>
              <p className="mt-1 text-sm amharic leading-relaxed text-[var(--foreground)]/80">{c.body}</p>
              <time className="mt-1 block text-[11px] text-[var(--foreground)]/40">
                {new Date(c.created_at).toLocaleString("am-ET")}
              </time>
            </li>
          ))}
          {(comments ?? []).length === 0 && (
            <li className="text-sm text-[var(--foreground)]/50 amharic">እስካሁን የጸደቀ አስተያየት የለም።</li>
          )}
        </ul>

        <CommentForm announcementId={a.id} />
      </section>
    </article>
  );
}
