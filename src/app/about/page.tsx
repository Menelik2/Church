import { HISTORY, DOCUMENT_META } from "@/data/regulations";
import Link from "next/link";

export const metadata = {
  title: "ስለ እኛ",
  description: "የማኅተመ ክርስቶስ ሰንበት ት/ቤት ታሪክና አመሠራረት",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-[var(--primary)] amharic">
        ስለ ማኅተመ ክርስቶስ ሰንበት ት/ቤት
      </h1>
      <p className="mt-2 text-[var(--foreground)]/60">
        {DOCUMENT_META.church_am} · {DOCUMENT_META.diocese_am}
      </p>

      <section className="mt-12">
        <h2 className="text-xl font-bold text-[var(--foreground)] amharic mb-4">
          የማኅተመ ክርስቶስ ሰንበት ት/ቤት አመሰራረት
        </h2>
        <div className="prose-am amharic whitespace-pre-wrap leading-relaxed text-[var(--foreground)]">
          {HISTORY.founding_am}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-xl font-bold text-[var(--foreground)] amharic mb-6">
          ታሪካዊ ጊዜ ሰሌዳ
        </h2>
        <div className="relative border-l-2 border-[var(--color-gold-400)] pl-8 space-y-8">
          {HISTORY.timeline.map((item, i) => (
            <div key={i} className="relative">
              <span className="absolute -left-[41px] top-1 h-4 w-4 rounded-full border-2 border-[var(--color-gold-500)] bg-[var(--card)]" />
              <p className="text-sm font-semibold text-[var(--primary)]">
                {item.year_am}
              </p>
              <p className="mt-1 amharic text-[var(--foreground)]/80">
                {item.event_am}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-14 flex flex-wrap gap-4">
        <Link
          href="/rules"
          className="rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white"
        >
          ሕግና ደንብ ያንብቡ
        </Link>
        <Link
          href="/vision"
          className="rounded-xl border border-[var(--border)] px-5 py-2.5 text-sm font-medium"
        >
          ርእይ
        </Link>
      </div>
    </div>
  );
}
