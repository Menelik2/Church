import Link from "next/link";
import {
  Building2,
  ChevronRight,
  Palette,
  Calculator,
  GraduationCap,
  ShieldCheck,
  Music2,
  HeartHandshake,
  Baby,
  Network,
  Camera,
  Package,
  Scale,
  Layers,
} from "lucide-react";
import { DEPARTMENTS, DOCUMENT_META } from "@/data/regulations";
import { getDepartmentDetail } from "@/data/department-details";

export const metadata = {
  title: "የአገልግሎት ክፍሎች",
  description: "ማኅተመ ክርስቶስ ሰንበት ት/ቤት — 10 ዋና የአገልግሎት ክፍሎች (አንቀጽ 10)",
};

const ICONS: Record<string, typeof Palette> = {
  "kine-tibeb": Palette,
  hisab: Calculator,
  timihirt: GraduationCap,
  kutator: ShieldCheck,
  mezmur: Music2,
  limat: HeartHandshake,
  hitsanat: Baby,
  genegnet: Network,
  media: Camera,
  nebrat: Package,
};

const BLURBS: Record<string, string> = {
  "kine-tibeb": "ጥበብና ባህል አገልግሎት",
  hisab: "ገቢ · ወጭ · ሪፖርት",
  timihirt: "ትምህርተ ሃይማኖትና ስልጠና",
  kutator: "ክትትልና ክርስትያናዊ ሕይወት",
  mezmur: "መዝሙርና የአጀብ አገልግሎት",
  limat: "ልማት · በጎ አድራጎት",
  hitsanat: "ሕፃናትና ታዳጊዎች",
  genegnet: "አባላት · ግንኙነት · ጽዋ",
  media: "ሚዲያና ሰነድ",
  nebrat: "ንብረት አስተዳደር",
};

export default function DepartmentsPage() {
  return (
    <div className="bg-cross-pattern min-h-screen pb-28 md:pb-16">
      <section className="relative overflow-hidden border-b border-[var(--border)] bg-gradient-to-br from-[var(--color-burgundy-950)] via-[var(--color-burgundy-900)] to-[var(--color-burgundy-800)]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_80%,_rgba(201,145,47,0.22),_transparent_50%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-300)] amharic">
            {DOCUMENT_META.organization_am}
          </p>
          <h1 className="mt-2 max-w-2xl text-3xl font-bold leading-tight text-white amharic sm:text-4xl">
            የአገልግሎት ክፍሎች
          </h1>
          <p className="mt-3 max-w-xl text-sm text-white/75 amharic leading-relaxed">
            በሥራ አስፈጻሚ መዋቅር ስር ያሉ 10 ዋና ክፍሎች · አንቀጽ 10
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/rules/10"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-[var(--primary)] shadow-lg"
            >
              <Scale className="h-4 w-4" />
              <span className="amharic">አንቀጽ 10 አንብብ</span>
            </Link>
            <Link
              href="/organization"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur"
            >
              <Layers className="h-4 w-4" />
              <span className="amharic">መዋቅር</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-4 -mt-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "ክፍሎች", value: String(DEPARTMENTS.length), icon: Building2 },
            { label: "መዋቅር", value: "አንቀጽ 10", icon: Scale },
            { label: "አገልግሎት", value: "ሙሉ", icon: HeartHandshake },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)] px-3 py-4 text-center shadow-sm"
              >
                <Icon className="mx-auto h-4 w-4 text-[var(--color-gold-600)]" />
                <p className="mt-1.5 text-sm font-bold text-[var(--primary)] sm:text-lg">{s.value}</p>
                <p className="text-[11px] text-[var(--foreground)]/50 amharic">{s.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DEPARTMENTS.map((d) => {
            const Icon = ICONS[d.slug] ?? Building2;
            const detail = getDepartmentDetail(d.slug);
            const blurb = BLURBS[d.slug] ?? d.title_en;
            const subCount = detail?.sub_departments_am?.length ?? 0;
            const dutyCount = detail?.duties_am?.length ?? 0;

            return (
              <Link
                key={d.slug}
                href={`/departments/${d.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm transition hover:border-[var(--color-gold-400)] hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] transition group-hover:bg-[var(--primary)] group-hover:text-white">
                    <Icon className="h-6 w-6" strokeWidth={1.75} />
                  </span>
                  <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-lg bg-[var(--muted)] px-2 text-xs font-bold tabular-nums text-[var(--foreground)]/55">
                    {d.order}
                  </span>
                </div>

                <h2 className="mt-4 text-lg font-bold leading-snug amharic text-[var(--primary)]">
                  {d.title_am}
                </h2>
                <p className="mt-0.5 text-[11px] text-[var(--foreground)]/40">{d.title_en}</p>
                <p className="mt-2 flex-1 text-xs leading-relaxed text-[var(--foreground)]/60 amharic">
                  {blurb}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[var(--border)] pt-3">
                  {dutyCount > 0 && (
                    <span className="rounded-full bg-[var(--primary)]/8 px-2 py-0.5 text-[10px] font-medium text-[var(--primary)] amharic">
                      {dutyCount} ተግባራት
                    </span>
                  )}
                  {subCount > 0 && (
                    <span className="rounded-full bg-[var(--color-gold-100)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-gold-800)] amharic">
                      {subCount} ንዑስ
                    </span>
                  )}
                  <span className="ml-auto flex items-center gap-0.5 text-xs font-semibold text-[var(--primary)] amharic opacity-70 transition group-hover:opacity-100">
                    ዝርዝር
                    <ChevronRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-center sm:p-8">
          <Building2 className="mx-auto h-8 w-8 text-[var(--primary)]/50" />
          <p className="mt-3 text-sm amharic text-[var(--foreground)]/70 leading-relaxed max-w-lg mx-auto">
            እያንዳንዱ ክፍል ተጠሪነቱ ለሥራ አስፈጻሚ ኮሚቴ ሲሆን ዝርዝር ተግባርና ኃላፊነት በውስጥ መተዳደሪያ ሕግ (አንቀጽ 10) ተቀምጧል።
          </p>
          <Link
            href="/rules/10"
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--primary)] amharic"
          >
            ሙሉ መዋቅር አንብብ <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
