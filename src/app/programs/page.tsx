import Link from "next/link";
import { DOCUMENT_META } from "@/data/regulations";
import { PROGRAMS, PROGRAMS_INTRO_AM } from "@/data/programs";

export const metadata = {
  title: "መርሃ ግብራት",
  description: "በሰንበት ት/ቤቱ ስር ያሉ መርሃ ግብራት እና ጉባኤያት",
};

export default function ProgramsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm font-medium text-[var(--primary)]">አንቀጽ 16</p>
      <h1 className="mt-2 text-3xl font-bold text-[var(--primary)] amharic">
        በሰንበት ት/ቤቱ ስር ያሉ መርሃ ግብራት
      </h1>

      <p className="mt-6 amharic leading-relaxed text-[var(--foreground)]/85">
        {PROGRAMS_INTRO_AM}
      </p>

      <ol className="mt-10 space-y-6">
        {PROGRAMS.map((p) => (
          <li
            key={p.id}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--primary)]/10 text-sm font-bold text-[var(--primary)]">
                {p.order}
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-semibold text-[var(--primary)] amharic">
                  {p.title_am}
                </h2>

                {p.subgroups_am && p.subgroups_am.length > 0 && (
                  <ul className="mt-3 space-y-1.5">
                    {p.subgroups_am.map((s) => (
                      <li
                        key={s}
                        className="text-sm amharic text-[var(--foreground)]/80 pl-1"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                )}

                <p className="mt-3 text-sm amharic leading-relaxed text-[var(--foreground)]/80">
                  {p.body_am}
                </p>

                {p.related_href && (
                  <Link
                    href={p.related_href}
                    className="mt-3 inline-block text-sm font-medium text-[var(--primary)] hover:underline amharic"
                  >
                    {p.related_label_am ?? "ተዛማጅ"} →
                  </Link>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-10 text-sm text-[var(--foreground)]/50 amharic">
        {DOCUMENT_META.organization_am} · {DOCUMENT_META.revision_date_am}
      </p>

      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href="/rules/16"
          className="text-sm font-medium text-[var(--primary)] hover:underline amharic"
        >
          ሙሉ አንቀጽ 16 →
        </Link>
        <Link
          href="/departments"
          className="text-sm text-[var(--foreground)]/60 hover:underline amharic"
        >
          የአገልግሎት ክፍሎች
        </Link>
      </div>
    </div>
  );
}
