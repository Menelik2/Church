import Link from "next/link";
import { BookOpen, Download, Info, ChevronRight } from "lucide-react";
import { DOCUMENT_META, DEPARTMENTS } from "@/data/regulations";

const quickCards = [
  { href: "/about", title: "መግቢያ", desc: "ታሪክና አመሠራረት" },
  { href: "/vision", title: "ርእይ", desc: "የሰንበት ት/ቤቱ ርእይ" },
  { href: "/mission", title: "ተልዕኮ", desc: "የሰንበት ት/ቤቱ ተልዕኮ" },
  { href: "/objectives", title: "ዓላማ", desc: "አጠቃላይ ዓላማዎች" },
  { href: "/organization", title: "መዋቅር", desc: "የድርጅት መዋቅር" },
  { href: "/membership/rights", title: "መብት", desc: "የአገልጋይ መብት" },
  { href: "/membership/responsibilities", title: "ግዴታ", desc: "የአገልጋይ ግዴታ" },
  { href: "/programs", title: "መርሐግብራት", desc: "በሰንበት ት/ቤቱ ስር ያሉ" },
];

export default function HomePage() {
  return (
    <div className="bg-cross-pattern">
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-burgundy-950)] via-[var(--color-burgundy-900)] to-[var(--color-charcoal)] opacity-95" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-medium tracking-wide text-[var(--color-gold-300)] mb-3">
              {DOCUMENT_META.church_am} · {DOCUMENT_META.diocese_am}
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white amharic leading-tight">
              {DOCUMENT_META.organization_am}
            </h1>
            <p className="mt-4 text-xl text-[var(--color-gold-200)] amharic">
              የውስጥ መተዳደሪያ ሕግና ደንብ
            </p>
            <p className="mt-6 text-base text-white/80 leading-relaxed max-w-2xl amharic">
              ይህ ድረ-ገጽ የማኅተመ ክርስቶስ ሰንበት ት/ቤት የውስጥ መተዳደሪያ ሕግና ደንብን በዲጂታል
              መልክ ያቀርባል። ሙሉ ሰነዱን ማንበብ፣ መፈለግ እና ማውረድ ይቻላል።
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/rules"
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-gold-500)] px-5 py-3 text-sm font-semibold text-[var(--color-charcoal)] shadow-lg transition hover:bg-[var(--color-gold-400)]"
              >
                <BookOpen className="h-4 w-4" />
                ሕግና ደንብ ያንብቡ
              </Link>
              <Link
                href="/pdf"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                <Download className="h-4 w-4" />
                ሙሉ PDF ያውርዱ
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-medium text-white/90 transition hover:bg-white/10"
              >
                <Info className="h-4 w-4" />
                ስለ ማኅተመ ክርስቶስ
              </Link>
            </div>
            <p className="mt-6 text-xs text-white/50">
              የተሻሻለበት ቀን · {DOCUMENT_META.revision_date_am} · {DOCUMENT_META.page_count} ገጾች
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-[var(--primary)] amharic">ፈጣን መዳረሻ</h2>
          <p className="mt-2 text-[var(--foreground)]/60">ወደ ዋና ክፍሎች በቀጥታ ይሂዱ</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm transition hover:border-[var(--color-burgundy-300)] hover:shadow-md"
            >
              <h3 className="font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)] amharic">{card.title}</h3>
              <p className="mt-1 text-sm text-[var(--foreground)]/60">{card.desc}</p>
              <span className="mt-3 inline-flex items-center text-xs font-medium text-[var(--primary)] opacity-0 transition group-hover:opacity-100">
                ይመልከቱ <ChevronRight className="h-3 w-3 ml-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-[var(--border)] bg-[var(--muted)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h2 className="text-xl font-bold text-[var(--primary)] amharic">ኦፊሴላዊ ሰነድ</h2>
              <p className="mt-2 text-[var(--foreground)]/70 max-w-xl amharic">
                ሙሉ የውስጥ መተዳደሪያ ሕግና ደንብ — አንቀጾች 1–16። በመስመር ላይ ያንብቡ ወይም PDF ያውርዱ።
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/rules" className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white">
                <BookOpen className="h-4 w-4" /> ዲጂታል አንባቢ
              </Link>
              <Link href="/pdf" className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-5 py-3 text-sm font-semibold">
                <Download className="h-4 w-4" /> PDF
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[var(--primary)] amharic">የአገልግሎት ክፍሎች</h2>
            <p className="mt-1 text-[var(--foreground)]/60">10 ዋና ክፍሎች</p>
          </div>
          <Link href="/departments" className="text-sm font-medium text-[var(--primary)] hover:underline">ሁሉንም ይመልከቱ →</Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {DEPARTMENTS.map((d) => (
            <Link key={d.slug} href={`/departments/${d.slug}`} className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-center text-sm font-medium amharic transition hover:border-[var(--color-burgundy-300)] hover:text-[var(--primary)]">
              {d.title_am}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
