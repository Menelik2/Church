import Link from "next/link";
import { notFound } from "next/navigation";
import { DEPARTMENTS } from "@/data/regulations";
import { getDepartmentDetail } from "@/data/department-details";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return DEPARTMENTS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const dept = DEPARTMENTS.find((d) => d.slug === slug);
  if (!dept) return { title: "ክፍል" };
  return { title: dept.title_am, description: `${dept.title_am} — የአገልግሎት ክፍል` };
}

export default async function DepartmentDetailPage({ params }: Props) {
  const { slug } = await params;
  const dept = DEPARTMENTS.find((d) => d.slug === slug);
  if (!dept) notFound();

  const detail = getDepartmentDetail(slug);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-[var(--foreground)]/60">
        <Link href="/departments" className="hover:text-[var(--primary)]">
          ክፍሎች
        </Link>
        <span className="mx-2">/</span>
        <span>{dept.title_am}</span>
      </nav>

      <p className="text-sm font-medium text-[var(--primary)]">
        ክፍል {dept.order}
      </p>
      <h1 className="mt-2 text-3xl font-bold text-[var(--primary)] amharic">
        {dept.title_am}
      </h1>
      <p className="mt-1 text-[var(--foreground)]/50">{dept.title_en}</p>

      {detail ? (
        <>
          <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 amharic leading-relaxed">
            <p className="text-[var(--foreground)]/90">{detail.intro_am}</p>

            <ol className="mt-6 space-y-3 list-decimal list-inside text-[var(--foreground)]/85">
              {detail.duties_am.map((duty, i) => (
                <li key={i} className="leading-relaxed pl-1">
                  {duty}
                </li>
              ))}
            </ol>
          </div>

          {detail.sub_departments_am.length > 0 && (
            <section className="mt-10">
              <h2 className="text-xl font-bold text-[var(--foreground)] amharic mb-4">
                በስሩ ያሉ ንዑስ ክፍሎች
              </h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {detail.sub_departments_am.map((sub, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 amharic"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--primary)]/10 text-sm font-semibold text-[var(--primary)]">
                      {i + 1}
                    </span>
                    {sub}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      ) : (
        <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 amharic leading-relaxed">
          <p>
            ይህ ክፍል የማኅተመ ክርስቶስ ሰንበት ት/ቤት የስራ አስፈጻሚ መዋቅር አካል ነው
            (አንቀጽ 10)። ዝርዝር ተግባርና ኃላፊነት በውስጥ መተዳደሪያ ሕግና ደንብ ውስጥ
            ተቀምጧል።
          </p>
          <p className="mt-4 text-sm text-[var(--foreground)]/70">
            ሙሉ የመዋቅር መግለጫ ለማንበብ{" "}
            <Link href="/rules/10" className="text-[var(--primary)] hover:underline">
              አንቀጽ 10
            </Link>{" "}
            ይመልከቱ።
          </p>
        </div>
      )}

      <div className="mt-10 flex gap-4">
        <Link
          href="/departments"
          className="text-sm font-medium text-[var(--primary)] hover:underline"
        >
          ← ሁሉም ክፍሎች
        </Link>
        <Link
          href="/rules/10"
          className="text-sm text-[var(--foreground)]/60 hover:underline"
        >
          የመዋቅር አንቀጽ
        </Link>
      </div>
    </div>
  );
}
