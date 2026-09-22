import Link from "next/link";
import { DEPARTMENTS } from "@/data/regulations";
import { ChevronRight } from "lucide-react";

export const metadata = {
  title: "ክፍሎች",
  description: "የማኅተመ ክርስቶስ ሰንበት ት/ቤት የአገልግሎት ክፍሎች",
};

export default function DepartmentsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-[var(--primary)] amharic">
        የአገልግሎት ክፍሎች
      </h1>
      <p className="mt-2 text-[var(--foreground)]/60">
        በሥራ አስፈጻሚ መዋቅር ስር ያሉ 10 ዋና ክፍሎች (አንቀጽ 10)
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {DEPARTMENTS.map((d) => (
          <Link
            key={d.slug}
            href={`/departments/${d.slug}`}
            className="group flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm transition hover:border-[var(--color-burgundy-300)] hover:shadow-md"
          >
            <div>
              <span className="text-xs font-medium text-[var(--primary)]">
                {d.order}.
              </span>
              <h2 className="mt-1 text-lg font-semibold amharic group-hover:text-[var(--primary)]">
                {d.title_am}
              </h2>
              <p className="text-sm text-[var(--foreground)]/50">{d.title_en}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-[var(--foreground)]/30 group-hover:text-[var(--primary)]" />
          </Link>
        ))}
      </div>
    </div>
  );
}
