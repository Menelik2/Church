import Link from "next/link";
import { ARTICLES, DEPARTMENTS, DOCUMENT_META } from "@/data/regulations";

export const metadata = {
  title: "መዋቅር",
  description: "የማኅተመ ክርስቶስ ሰንበት ት/ቤት የድርጅት መዋቅር",
};

export default function OrganizationPage() {
  const art10 = ARTICLES["10"];
  const art6 = ARTICLES["6"];
  const art7 = ARTICLES["7"];
  const art8 = ARTICLES["8"];

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-[var(--primary)] amharic">
        የድርጅት መዋቅር
      </h1>
      <p className="mt-2 text-[var(--foreground)]/60 amharic">
        {DOCUMENT_META.organization_am} · አንቀጽ 6–10
      </p>

      <div className="mt-10 space-y-6">
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
          <h2 className="text-lg font-semibold text-[var(--primary)] amharic">
            ጠቅላላ ጉባኤ (አንቀጽ 6)
          </h2>
          <p className="mt-3 text-sm amharic leading-relaxed text-[var(--foreground)]/80 line-clamp-4">
            {art6?.content_am}
          </p>
          <Link href="/rules/6" className="mt-3 inline-block text-sm text-[var(--primary)] hover:underline">
            ሙሉ አንቀጽ →
          </Link>
        </section>

        <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
          <h2 className="text-lg font-semibold text-[var(--primary)] amharic">
            አማካሪ ቦርድ (አንቀጽ 7)
          </h2>
          <p className="mt-3 text-sm amharic leading-relaxed text-[var(--foreground)]/80 line-clamp-4">
            {art7?.content_am}
          </p>
          <Link href="/rules/7" className="mt-3 inline-block text-sm text-[var(--primary)] hover:underline">
            ሙሉ አንቀጽ →
          </Link>
        </section>

        <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
          <h2 className="text-lg font-semibold text-[var(--primary)] amharic">
            ስራ አስፈጻሚ ኮሚቴ (አንቀጽ 8–10)
          </h2>
          <p className="mt-3 text-sm amharic leading-relaxed text-[var(--foreground)]/80 line-clamp-3">
            {art8?.content_am}
          </p>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <Link href="/rules/8" className="text-[var(--primary)] hover:underline">አንቀጽ 8</Link>
            <Link href="/rules/9" className="text-[var(--primary)] hover:underline">አንቀጽ 9</Link>
            <Link href="/rules/10" className="text-[var(--primary)] hover:underline">አንቀጽ 10</Link>
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
          <h2 className="text-lg font-semibold text-[var(--primary)] amharic mb-4">
            የአገልግሎት ክፍሎች
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {DEPARTMENTS.map((d) => (
              <Link
                key={d.slug}
                href={`/departments/${d.slug}`}
                className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm amharic hover:border-[var(--color-burgundy-300)] hover:text-[var(--primary)]"
              >
                {d.order}. {d.title_am}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
