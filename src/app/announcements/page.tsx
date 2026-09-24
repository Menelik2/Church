import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Megaphone } from "lucide-react";

export const metadata = {
  title: "ወቅታዊ ጉዳዮች",
  description: "የማኅተመ ክርስቶስ ሰንበት ት/ቤት ወቅታዊ ጉዳዮችና ማስታወቂያዎች",
};

export default async function AnnouncementsPage() {
  let items: {
    id: string;
    title_am: string;
    body_am: string;
    slug: string;
    is_featured: boolean;
    published_at: string | null;
    created_at: string;
  }[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("announcements")
      .select("id, title_am, body_am, slug, is_featured, published_at, created_at")
      .eq("published", true)
      .order("published_at", { ascending: false })
      .limit(50);
    items = data ?? [];
  } catch {
    // offline
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <Megaphone className="h-7 w-7 text-[var(--primary)]" />
        <h1 className="text-3xl font-bold text-[var(--primary)] amharic">ወቅታዊ ጉዳዮች</h1>
      </div>
      <p className="mt-2 text-[var(--foreground)]/60 amharic">
        የሰንበት ት/ቤቱ ኦፊሴላዊ ማስታወቂያዎችና ዜናዎች
      </p>

      <ul className="mt-10 space-y-4">
        {items.map((a) => (
          <li key={a.id} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h2 className="text-lg font-semibold amharic text-[var(--primary)]">{a.title_am}</h2>
              {a.is_featured && (
                <span className="text-xs rounded-full bg-[var(--color-gold-100)] text-[var(--color-gold-800)] px-2 py-0.5">
                  በመነሻ
                </span>
              )}
            </div>
            <time className="text-xs text-[var(--foreground)]/50">
              {new Date(a.published_at || a.created_at).toLocaleDateString("am-ET")}
            </time>
            <p className="mt-3 text-sm amharic leading-relaxed whitespace-pre-wrap text-[var(--foreground)]/80">
              {a.body_am}
            </p>
          </li>
        ))}
        {items.length === 0 && (
          <li className="rounded-2xl border border-dashed border-[var(--border)] p-10 text-center text-sm text-[var(--foreground)]/50 amharic">
            አሁን ምንም ታትሞ የወጣ ወቅታዊ ጉዳይ የለም።
          </li>
        )}
      </ul>

      <p className="mt-8 text-center">
        <Link href="/" className="text-sm font-semibold text-[var(--primary)] amharic">
          ← ወደ መነሻ
        </Link>
      </p>
    </div>
  );
}
