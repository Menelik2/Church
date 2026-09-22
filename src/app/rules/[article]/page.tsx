import Link from "next/link";
import { notFound } from "next/navigation";
import { ARTICLES, DOCUMENT_META } from "@/data/regulations";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = { params: Promise<{ article: string }> };

export async function generateStaticParams() {
  return Object.keys(ARTICLES).map((n) => ({ article: n }));
}

export async function generateMetadata({ params }: Props) {
  const { article } = await params;
  const art = ARTICLES[article];
  if (!art) return { title: "አንቀጽ" };
  return {
    title: `አንቀጽ ${art.number} · ${art.title_am}`,
    description: art.content_am.slice(0, 160),
  };
}

export default async function ArticlePage({ params }: Props) {
  const { article } = await params;
  const art = ARTICLES[article];
  if (!art) notFound();

  const nums = Object.keys(ARTICLES)
    .map(Number)
    .sort((a, b) => a - b);
  const idx = nums.indexOf(art.number);
  const prev = idx > 0 ? nums[idx - 1] : null;
  const next = idx < nums.length - 1 ? nums[idx + 1] : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-6 flex items-center gap-2 text-sm text-[var(--foreground)]/60">
        <Link href="/rules" className="hover:text-[var(--primary)]">
          ሕግና ደንብ
        </Link>
        <span>/</span>
        <span className="text-[var(--foreground)]">አንቀጽ {art.number}</span>
      </nav>

      <article className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-10 shadow-sm">
        <header className="border-b border-[var(--border)] pb-6 mb-8">
          <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-[var(--primary)] px-2.5 text-sm font-bold text-white">
            {art.number}
          </span>
          <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-[var(--primary)] amharic leading-tight">
            {art.title_am}
          </h1>
          {art.title_en && (
            <p className="mt-1 text-sm text-[var(--foreground)]/50">
              {art.title_en}
            </p>
          )}
        </header>

        <div className="prose-am amharic whitespace-pre-wrap text-[var(--foreground)] leading-relaxed">
          {art.content_am}
        </div>

        <footer className="mt-10 pt-6 border-t border-[var(--border)]">
          <p className="text-xs text-[var(--foreground)]/50">
            {DOCUMENT_META.organization_am} · {DOCUMENT_META.revision_date_am}
          </p>
        </footer>
      </article>

      <nav className="mt-8 flex justify-between gap-4">
        {prev ? (
          <Link
            href={`/rules/${prev}`}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm font-medium transition hover:border-[var(--color-burgundy-300)]"
          >
            <ChevronLeft className="h-4 w-4" />
            አንቀጽ {prev}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/rules/${next}`}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm font-medium transition hover:border-[var(--color-burgundy-300)]"
          >
            አንቀጽ {next}
            <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}
