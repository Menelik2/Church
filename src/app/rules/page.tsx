import Link from "next/link";
import {
  BookOpen,
  Download,
  Search,
  Scale,
  Eye,
  Target,
  Building2,
  HandHeart,
  Layers,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { ARTICLES, DOCUMENT_META } from "@/data/regulations";

export const metadata = {
  title: "ሕግና ደንብ | የውስጥ መተዳደሪያ",
  description: "ማኅተመ ክርስቶስ ሰንበት ት/ቤት የውስጥ መተዳደሪያ ሕግና ደንብ — በድረ-ገጽ ሙሉ ማንበብ",
};

const GROUPS: {
  id: string;
  title_am: string;
  desc: string;
  icon: typeof Scale;
  numbers: number[];
}[] = [
  { id: "identity", title_am: "መሰረታዊ", desc: "ስያሜና ትርጓሜ", icon: Scale, numbers: [1, 2] },
  { id: "direction", title_am: "አቅጣጫ", desc: "ራዕይ · ተልእኮ · ዓላማ", icon: Eye, numbers: [3, 4, 5] },
  { id: "governance", title_am: "አስተዳደር", desc: "ጉባኤ · ቦርድ · ኮሚቴ", icon: Building2, numbers: [6, 7, 8, 9, 10] },
  { id: "servants", title_am: "አገልጋይነት", desc: "መብት · ግዴታ · መመዘኛ", icon: HandHeart, numbers: [11, 12, 13, 14, 15] },
  { id: "programs", title_am: "መርሐግብራት", desc: "በሰንበት ት/ቤት ስር", icon: Layers, numbers: [16] },
];

function preview(text: string, max = 90) {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > max ? clean.slice(0, max) + "…" : clean;
}

export default function RulesPage() {
  const byNum = Object.fromEntries(Object.values(ARTICLES).map((a) => [a.number, a]));

  return (
    <div className="bg-cross-pattern min-h-screen pb-28 lg:pb-16">
      <section className="relative overflow-hidden border-b border-[var(--border)] bg-gradient-to-br from-[var(--color-burgundy-950)] via-[var(--color-burgundy-900)] to-[var(--color-burgundy-800)]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,_rgba(201,145,47,0.25),_transparent_55%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-300)] amharic">
            {DOCUMENT_META.organization_am}
          </p>
          <h1 className="mt-2 max-w-2xl text-3xl font-bold leading-tight text-white amharic sm:text-4xl">
            የውስጥ መተዳደሪያ ሕግና ደንብ
          </h1>
          <p className="mt-3 max-w-xl text-sm text-white/75 amharic leading-relaxed">
            አንቀጽ 1–16 · በድረ-ገጽ ሙሉ ማንበብ · {DOCUMENT_META.revision_date_am}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-[var(--primary)] shadow-lg"
            >
              <Search className="h-4 w-4" />
              <span className="amharic">በሕጉ ውስጥ ፈልግ</span>
            </Link>
            <Link
              href="/pdf"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur"
            >
              <Download className="h-4 w-4" />
              <span className="amharic">PDF አውርድ</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 -mt-6 relative z-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "አንቀጾች", value: "16", icon: BookOpen },
            { label: "ክፍሎች", value: "5", icon: Layers },
            { label: "እትም", value: DOCUMENT_META.version, icon: Sparkles },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)] px-3 py-4 text-center shadow-sm"
              >
                <Icon className="mx-auto h-4 w-4 text-[var(--color-gold-600)]" />
                <p className="mt-1.5 text-lg font-bold text-[var(--primary)]">{s.value}</p>
                <p className="text-[11px] text-[var(--foreground)]/50 amharic">{s.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-12">
        {GROUPS.map((g) => {
          const Icon = g.icon;
          return (
            <section key={g.id}>
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-lg font-bold amharic text-[var(--primary)]">{g.title_am}</h2>
                  <p className="text-xs text-[var(--foreground)]/50 amharic">{g.desc}</p>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {g.numbers.map((n) => {
                  const a = byNum[n];
                  if (!a) return null;
                  return (
                    <Link
                      key={n}
                      href={`/rules/${n}`}
                      className="group flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm transition hover:border-[var(--color-gold-400)] hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-lg bg-[var(--primary)] text-xs font-bold text-white">
                          {a.number}
                        </span>
                        <ChevronRight className="h-4 w-4 text-[var(--foreground)]/25 transition group-hover:translate-x-0.5 group-hover:text-[var(--primary)]" />
                      </div>
                      <h3 className="mt-3 text-base font-semibold leading-snug amharic text-[var(--primary)]">
                        {a.title_am}
                      </h3>
                      {a.title_en && (
                        <p className="mt-0.5 text-[11px] text-[var(--foreground)]/40">{a.title_en}</p>
                      )}
                      <p className="mt-2 flex-1 text-xs leading-relaxed text-[var(--foreground)]/55 amharic line-clamp-3">
                        {preview(a.content_am)}
                      </p>
                      <span className="mt-3 text-xs font-semibold text-[var(--primary)] amharic">አንብብ →</span>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-[var(--color-gold-300)]/40 bg-gradient-to-br from-[var(--color-gold-50)] to-[var(--card)] p-6 sm:p-8 text-center">
          <Target className="mx-auto h-8 w-8 text-[var(--color-gold-600)]" />
          <h2 className="mt-3 text-lg font-bold amharic text-[var(--color-gold-900)]">PDF የሚፈልጉ?</h2>
          <p className="mt-1 text-sm text-[var(--foreground)]/60 amharic">ኦፊሴላዊውን ሰነድ ማውረድ ይችላሉ</p>
          <Link
            href="/pdf"
            className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white"
          >
            <Download className="h-4 w-4" />
            <span className="amharic">PDF አውርድ</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
