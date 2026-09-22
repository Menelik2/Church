import { ARTICLES, DOCUMENT_META } from "@/data/regulations";
import Link from "next/link";

export const metadata = {
  title: "ርእይ",
  description: "የማኅተመ ክርስቶስ ሰንበት ት/ቤት ርእይ",
};

export default function VisionPage() {
  const vision = ARTICLES["3"];

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm font-medium text-[var(--primary)]">አንቀጽ 3</p>
      <h1 className="mt-2 text-3xl font-bold text-[var(--primary)] amharic">
        {vision.title_am}
      </h1>
      {vision.title_en && (
        <p className="mt-1 text-[var(--foreground)]/50">{vision.title_en}</p>
      )}

      <blockquote className="mt-10 rounded-2xl border-l-4 border-[var(--color-gold-500)] bg-[var(--muted)] p-8 amharic text-lg leading-relaxed text-[var(--foreground)]">
        {vision.content_am}
      </blockquote>

      <p className="mt-8 text-sm text-[var(--foreground)]/50">
        {DOCUMENT_META.organization_am} · {DOCUMENT_META.revision_date_am}
      </p>

      <div className="mt-10 flex gap-4">
        <Link
          href="/mission"
          className="text-sm font-medium text-[var(--primary)] hover:underline"
        >
          ተልዕኮ →
        </Link>
        <Link
          href="/rules/3"
          className="text-sm font-medium text-[var(--foreground)]/60 hover:underline"
        >
          ሙሉ አንቀጽ
        </Link>
      </div>
    </div>
  );
}
