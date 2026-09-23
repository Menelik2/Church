import Link from "next/link";
import { ArrowLeft, BookOpen, Download, Search } from "lucide-react";
import { ARTICLES, TOC, DOCUMENT_META } from "@/data/regulations";

export const metadata = {
  title: "ሕግና ደንብ | የውስጥ መተዳደሪያ",
  description: "ማኅተመ ክርስቶስ ሰንበት ት/ቤት የውስጥ መተዳደሪያ ሕግና ደንብ ሙሉ ጽሑፍ",
};

export default function RulesPage() {
  const articles = Object.values(ARTICLES).sort((a, b) => a.number - b.number);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--card)]/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 rounded-lg hover:bg-[var(--muted)] transition" aria-label="ወደ መነሻ">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="font-semibold text-[var(--primary)] text-sm sm:text-base">ሕግና ደንብ</div>
              <div className="text-xs text-[var(--foreground)]/60 hidden sm:block">
                {DOCUMENT_META.revision_date_am} · {DOCUMENT_META.organization_am}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/search" className="p-2 rounded-lg hover:bg-[var(--muted)]" aria-label="ፈልግ">
              <Search className="w-5 h-5" />
            </Link>
            <Link href="/pdf" className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--primary)] text-white text-xs font-medium px-3 py-2">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">PDF</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-3xl w-full px-4 py-10">
        <div className="flex items-center gap-3 mb-8">
          <BookOpen className="w-8 h-8 text-[var(--primary)]" />
          <div>
            <h1 className="text-2xl font-bold text-[var(--primary)] amharic">የውስጥ መተዳደሪያ ሕግና ደንብ</h1>
            <p className="text-sm text-[var(--foreground)]/60 amharic">አንቀጽ 1–16 · ሙሉ ዝርዝር</p>
          </div>
        </div>

        {TOC && TOC.length > 0 && (
          <section className="mb-10 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
            <h2 className="text-sm font-semibold text-[var(--foreground)]/50 mb-3">ማውጫ</h2>
            <ul className="space-y-1.5">
              {TOC.map((item: { number?: number; title?: string; title_am?: string }, i: number) => (
                <li key={i}>
                  <Link
                    href={item.number ? `/rules/${item.number}` : "#"}
                    className="text-sm amharic text-[var(--foreground)]/80 hover:text-[var(--primary)]"
                  >
                    {item.number ? `አንቀጽ ${item.number} — ` : ""}
                    {item.title_am || item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <ul className="space-y-3">
          {articles.map((a) => (
            <li key={a.number}>
              <Link
                href={`/rules/${a.number}`}
                className="block rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 hover:border-[var(--color-burgundy-300)] transition"
              >
                <span className="text-xs font-medium text-[var(--foreground)]/50">አንቀጽ {a.number}</span>
                <h2 className="mt-1 font-semibold amharic text-[var(--primary)]">{a.title_am}</h2>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
