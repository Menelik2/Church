import { ARTICLES, DOCUMENT_META } from "@/data/regulations";
import Link from "next/link";

export const metadata = {
  title: "ተልዕኮ",
  description: "የማኅተመ ክርስቶስ ሰንበት ት/ቤት ተልዕኮ",
};

export default function MissionPage() {
  const mission = ARTICLES["4"];

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm font-medium text-[var(--primary)]">አንቀጽ 4</p>
      <h1 className="mt-2 text-3xl font-bold text-[var(--primary)] amharic">
        {mission.title_am}
      </h1>

      <div className="mt-10 space-y-6">
        {mission.content_am.split("\n\n").map((para, i) => (
          <div
            key={i}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm amharic leading-relaxed"
          >
            {para}
          </div>
        ))}
      </div>

      <p className="mt-8 text-sm text-[var(--foreground)]/50">
        {DOCUMENT_META.organization_am} · {DOCUMENT_META.revision_date_am}
      </p>

      <div className="mt-10 flex gap-4">
        <Link href="/vision" className="text-sm font-medium text-[var(--foreground)]/60 hover:underline">
          ← ርእይ
        </Link>
        <Link href="/objectives" className="text-sm font-medium text-[var(--primary)] hover:underline">
          ዓላማ →
        </Link>
      </div>
    </div>
  );
}
