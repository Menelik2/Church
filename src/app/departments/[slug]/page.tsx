import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Home,
  List,
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
  CheckCircle2,
  Layers,
} from "lucide-react";
import { DEPARTMENTS, DOCUMENT_META } from "@/data/regulations";
import { getDepartmentDetail } from "@/data/department-details";

type Props = { params: Promise<{ slug: string }> };

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

export async function generateStaticParams() {
  return DEPARTMENTS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const dept = DEPARTMENTS.find((d) => d.slug === slug);
  if (!dept) return { title: "ክፍል" };
  return {
    title: `${dept.title_am} · ክፍሎች`,
    description: `${dept.title_am} — የማኅተመ ክርስቶስ ሰንበት ት/ቤት የአገልግሎት ክፍል`,
  };
}

export default async function DepartmentDetailPage({ params }: Props) {
  const { slug } = await params;
  const dept = DEPARTMENTS.find((d) => d.slug === slug);
  if (!dept) notFound();

  const detail = getDepartmentDetail(slug);
  const Icon = ICONS[dept.slug] ?? Building2;
  const sorted = [...DEPARTMENTS].sort((a, b) => a.order - b.order);
  const idx = sorted.findIndex((d) => d.slug === slug);
  const prev = idx > 0 ? sorted[idx - 1] : null;
  const next = idx < sorted.length - 1 ? sorted[idx + 1] : null;

  return (
    <div className="bg-cross-pattern min-h-screen pb-28 lg:pb-12">
      <div className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--card)]/90 backdrop-blur">
        <div className="mx-auto flex h-12 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <nav className="flex min-w-0 items-center gap-1.5 text-xs text-[var(--foreground)]/50 amharic">
            <Link href="/" className="hover:text-[var(--primary)] shrink-0" aria-label="መነሻ">
              <Home className="h-3.5 w-3.5" />
            </Link>
            <span>/</span>
            <Link href="/departments" className="hover:text-[var(--primary)] shrink-0">
              ክፍሎች
            </Link>
            <span>/</span>
            <span className="truncate text-[var(--foreground)]">{dept.title_am}</span>
          </nav>
          <Link
            href="/departments"
            className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-[var(--primary)] amharic"
          >
            <List className="h-3.5 w-3.5" />
            ሁሉም
          </Link>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_220px] lg:px-8 lg:py-12">
        <article>
          <header className="mb-8">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--primary)] text-white shadow-lg">
                <Icon className="h-8 w-8" strokeWidth={1.75} />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-gold-600)]">
                  ክፍል {dept.order} / {DEPARTMENTS.length}
                </p>
                <h1 className="text-2xl font-bold leading-snug amharic text-[var(--primary)] sm:text-3xl">
                  {dept.title_am}
                </h1>
                <p className="mt-0.5 text-sm text-[var(--foreground)]/45">{dept.title_en}</p>
              </div>
            </div>
          </header>

          {detail ? (
            <>
              <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm sm:p-8">
                <p className="text-[15px] leading-[1.85] amharic text-[var(--foreground)]/85">
                  {detail.intro_am}
                </p>
              </div>

              <section className="mt-8">
                <div className="mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[var(--primary)]" />
                  <h2 className="text-lg font-bold amharic text-[var(--primary)]">
                    ተግባርና ኃላፊነት
                    <span className="ml-2 text-sm font-normal text-[var(--foreground)]/40">
                      ({detail.duties_am.length})
                    </span>
                  </h2>
                </div>
                <ol className="space-y-3">
                  {detail.duties_am.map((duty, i) => (
                    <li
                      key={i}
                      className="flex gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-xs font-bold tabular-nums text-[var(--primary)]">
                        {i + 1}
                      </span>
                      <p className="text-sm leading-relaxed amharic text-[var(--foreground)]/85 pt-1">
                        {duty}
                      </p>
                    </li>
                  ))}
                </ol>
              </section>

              {detail.sub_departments_am.length > 0 && (
                <section className="mt-10">
                  <div className="mb-4 flex items-center gap-2">
                    <Layers className="h-5 w-5 text-[var(--color-gold-600)]" />
                    <h2 className="text-lg font-bold amharic text-[var(--primary)]">
                      በስሩ ያሉ ንዑስ ክፍሎች
                      <span className="ml-2 text-sm font-normal text-[var(--foreground)]/40">
                        ({detail.sub_departments_am.length})
                      </span>
                    </h2>
                  </div>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {detail.sub_departments_am.map((sub, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 rounded-2xl border border-[var(--color-gold-300)]/40 bg-gradient-to-br from-[var(--color-gold-50)]/80 to-[var(--card)] px-4 py-3.5"
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-gold-100)] text-xs font-bold text-[var(--color-gold-800)]">
                          {i + 1}
                        </span>
                        <span className="text-sm font-medium amharic text-[var(--foreground)]/85">
                          {sub}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </>
          ) : (
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm sm:p-8 amharic">
              <p className="text-[15px] leading-relaxed text-[var(--foreground)]/85">
                ይህ ክፍል የማኅተመ ክርስቶስ ሰንበት ት/ቤት የስራ አስፈጻሚ መዋቅር አካል ነው (አንቀጽ 10)።
                ዝርዝር ተግባርና ኃላፊነት በውስጥ መተዳደሪያ ሕግና ደንብ ውስጥ ተቀምጧል።
              </p>
              <Link
                href="/rules/10"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--primary)]"
              >
                <Scale className="h-4 w-4" />
                አንቀጽ 10 ይመልከቱ
              </Link>
            </div>
          )}

          <p className="mt-8 text-[11px] text-[var(--foreground)]/40 amharic">
            {DOCUMENT_META.organization_am} · {DOCUMENT_META.revision_date_am}
          </p>

          <nav className="mt-6 grid grid-cols-2 gap-3">
            {prev ? (
              <Link
                href={`/departments/${prev.slug}`}
                className="flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 transition hover:border-[var(--color-gold-400)]"
              >
                <ChevronLeft className="h-4 w-4 shrink-0 text-[var(--primary)]" />
                <span className="min-w-0">
                  <span className="block text-[10px] text-[var(--foreground)]/45 amharic">ቀዳሚ</span>
                  <span className="block truncate text-sm font-semibold amharic text-[var(--primary)]">
                    {prev.title_am}
                  </span>
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/departments/${next.slug}`}
                className="flex items-center justify-end gap-2 rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-right transition hover:border-[var(--color-gold-400)]"
              >
                <span className="min-w-0">
                  <span className="block text-[10px] text-[var(--foreground)]/45 amharic">ቀጣይ</span>
                  <span className="block truncate text-sm font-semibold amharic text-[var(--primary)]">
                    {next.title_am}
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
              <Building2 className="h-4 w-4 text-[var(--primary)]" />
              <p className="text-xs font-bold amharic text-[var(--primary)]">ክፍሎች</p>
            </div>
            <nav className="max-h-[70vh] space-y-0.5 overflow-y-auto">
              {sorted.map((d) => {
                const DIcon = ICONS[d.slug] ?? Building2;
                return (
                  <Link
                    key={d.slug}
                    href={`/departments/${d.slug}`}
                    className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition ${
                      d.slug === slug
                        ? "bg-[var(--primary)]/10 font-semibold text-[var(--primary)]"
                        : "text-[var(--foreground)]/60 hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    <DIcon className="h-3.5 w-3.5 shrink-0 opacity-70" />
                    <span className="amharic line-clamp-1">{d.title_am}</span>
                  </Link>
                );
              })}
            </nav>
            <Link
              href="/rules/10"
              className="mt-3 flex items-center gap-1.5 border-t border-[var(--border)] pt-3 text-[11px] font-semibold text-[var(--primary)] amharic"
            >
              <Scale className="h-3.5 w-3.5" />
              አንቀጽ 10
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
