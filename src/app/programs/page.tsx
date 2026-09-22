import { ARTICLES, DOCUMENT_META } from "@/data/regulations";
import Link from "next/link";

export const metadata = {
  title: "መርሐግብራት",
  description: "በሰንበት ት/ቤቱ ስር ያሉ መርሐግብራት",
};

export default function ProgramsPage() {
  const programs = ARTICLES["16"];

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm font-medium text-[var(--primary)]">አንቀጽ 16</p>
      <h1 className="mt-2 text-3xl font-bold text-[var(--primary)] amharic">
        {programs.title_am}
      </h1>

      <div className="mt-10 prose-am amharic whitespace-pre-wrap leading-relaxed text-[var(--foreground)]">
        {programs.content_am}
      </div>

      <p className="mt-8 text-sm text-[var(--foreground)]/50">
        {DOCUMENT_META.organization_am} · {DOCUMENT_META.revision_date_am}
      </p>

      <div className="mt-10">
        <Link href="/rules/16" className="text-sm font-medium text-[var(--primary)] hover:underline">
          ሙሉ አንቀጽ →
        </Link>
      </div>
    </div>
  );
}
