import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ARTICLES, DOCUMENT_META } from "@/data/regulations";
import { ChevronLeft, ChevronRight, BookOpen, Home, List } from "lucide-react";

type Props = { params: Promise<{ article: string }> };

export async function generateStaticParams() {
  return Object.keys(ARTICLES).map((n) => ({ article: n }));
}

export async function generateMetadata({ params }: Props) {
  const { article } = await params;
  const art = ARTICLES[article];
  if (!art) return { title: "አንቀጽ" };
  return {
    title: `${art.title_am} · ሕግና ደንብ`,
    description: art.content_am.slice(0, 160),
  };
}

function renderBody(content: string) {
  const lines = content.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  const blocks: { type: "p" | "li" | "h"; text: string }[] = [];

  for (const line of lines) {
    if (/^(\d+\.\d*|\d+\.|[•●◆▪◦·\-–—])\s*/.test(line) || /^\d+\.\d+/.test(line)) {
      blocks.push({ type: "li", text: line.replace(/^[•●◆▪◦·\-–—]\s*/, "").trim() });
    } else if (/^\d+\.\s+[^\d]/.test(line) && line.length < 80) {
      blocks.push({ type: "h", text: line });
    } else if (/^\d+\.\d+\./.test(line) || /^[0-9]+\.[0-9]/.test(line)) {
      blocks.push({ type: "h", text: line });
    } else {
      blocks.push({ type: "p", text: line });
    }
  }

  const elements: ReactNode[] = [];
  let listBuf: string[] = [];

  const flushList = (key: string) => {
    if (listBuf.length === 0) return;
    elements.push(
      <ul key={key} className="my-4 space-y-2.5 border-l-2 border-[var(--color-gold-300)]/50 pl-4">
        {listBuf.map((t, i) => (
          <li key={i} className="text-[15px] leading-[1.85] amharic text-[var(--foreground)]/85 relative">
            <span className="absolute -left-[1.15rem] top-2 h-1.5 w-1.5 rounded-full bg-[var(--color-gold-500)]" />
            {t}
          </li>
        ))}
      </ul>
    );
    listBuf = [];
  };

  blocks.forEach((b, i) => {
    if (b.type === "li") {
      listBuf.push(b.text);
      return;
    }
    flushList(`l-${i}`);
    if (b.type === "h") {
      elements.push(
        <h3 key={`h-${i}`} className="mt-8 mb-2 text-base font-bold amharic text-[var(--primary)] first:mt-0">
          {b.text}
        </h3>
      );
    } else {
      elements.push(
        <p key={`p-${i}`} className="mb-4 text-[15px] leading-[1.9] amharic text-[var(--foreground)]/85">
          {b.text}
        </p>
      );
    }
  });
  flushList("l-end");
  return elements;
}

export default async function ArticlePage({ params }: Props) {
  const { article } = await params;
  const art = ARTICLES[article];
  if (!art) notFound();

  const nums = Object.keys(ARTICLES).map(Number).sort((a, b) => a - b);
  const idx = nums.indexOf(art.number);
  const prev = idx > 0 ? nums[idx - 1] : null;
  const next = idx < nums.length - 1 ? nums[idx + 1] : null;
  const all = nums.map((n) => ARTICLES[String(n)]).filter(Boolean);

  return (
    <div className="bg-cross-pattern min-h-screen pb-28 lg:pb-12">
      <div className="border-b border-[var(--border)] bg-[var(--card)]/90 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto flex h-12 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <nav className="flex min-w-0 items-center gap-1.5 text-xs text-[var(--foreground)]/50 amharic">
            <Link href="/" className="hover:text-[var(--primary)] shrink-0">
              <Home className="h-3.5 w-3.5" />
            </Link>
            <span>/</span>
            <Link href="/rules" className="hover:text-[var(--primary)] shrink-0">
              ሕግና ደንብ
            </Link>
            <span>/</span>
            <span className="truncate text-[var(--foreground)]">አንቀጽ {art.number}</span>
          </nav>
          <Link href="/rules" className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-[var(--primary)] amharic">
            <List className="h-3.5 w-3.5" />
            ሁሉም
          </Link>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_240px] lg:px-8 lg:py-12">
        <article>
          <header className="mb-8">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary)] text-lg font-bold text-white shadow-md">
                {art.number}
              </span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-gold-600)]">
                  አንቀጽ {art.number} / {nums.length}
                </p>
                <h1 className="text-2xl font-bold leading-snug amharic text-[var(--primary)] sm:text-3xl">
                  {art.title_am}
                </h1>
              </div>
            </div>
            {art.title_en && (
              <p className="mt-2 text-sm text-[var(--foreground)]/45">{art.title_en}</p>
            )}
          </header>

          <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm sm:p-10">
            <div className="max-w-prose">{renderBody(art.content_am)}</div>

            <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-6">
              <p className="text-[11px] text-[var(--foreground)]/40 amharic">
                {DOCUMENT_META.organization_am} · {DOCUMENT_META.revision_date_am}
              </p>
              <Link href="/pdf" className="text-[11px] font-semibold text-[var(--primary)] amharic">
                ኦፊሴላዊ PDF →
              </Link>
            </footer>
          </div>

          <nav className="mt-6 grid grid-cols-2 gap-3">
            {prev ? (
              <Link
                href={`/rules/${prev}`}
                className="flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 transition hover:border-[var(--color-gold-400)]"
              >
                <ChevronLeft className="h-4 w-4 shrink-0 text-[var(--primary)]" />
                <span className="min-w-0">
                  <span className="block text-[10px] text-[var(--foreground)]/45 amharic">ቀዳሚ</span>
                  <span className="block truncate text-sm font-semibold amharic text-[var(--primary)]">
                    {ARTICLES[String(prev)]?.title_am ?? `አንቀጽ ${prev}`}
                  </span>
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/rules/${next}`}
                className="flex items-center justify-end gap-2 rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-right transition hover:border-[var(--color-gold-400)]"
              >
                <span className="min-w-0">
                  <span className="block text-[10px] text-[var(--foreground)]/45 amharic">ቀጣይ</span>
                  <span className="block truncate text-sm font-semibold amharic text-[var(--primary)]">
                    {ARTICLES[String(next)]?.title_am ?? `አንቀጽ ${next}`}
                  </span>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-[var(--primary)]" />
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-16 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[var(--primary)]" />
              <p className="text-xs font-bold amharic text-[var(--primary)]">አንቀጾች</p>
            </div>
            <nav className="max-h-[70vh] space-y-0.5 overflow-y-auto">
              {all.map((a) => (
                <Link
                  key={a.number}
                  href={`/rules/${a.number}`}
                  className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition ${
                    a.number === art.number
                      ? "bg-[var(--primary)]/10 font-semibold text-[var(--primary)]"
                      : "text-[var(--foreground)]/60 hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  <span className="tabular-nums opacity-60">{a.number}</span>
                  <span className="amharic line-clamp-1">{a.title_am}</span>
                </Link>
              ))}
            </nav>
          </div>
        </aside>
      </div>
    </div>
  );
}
