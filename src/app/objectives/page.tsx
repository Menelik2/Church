import { ARTICLES, DOCUMENT_META } from "@/data/regulations";
import Link from "next/link";

export const metadata = {
  title: "ዓላማ",
  description: "የማኅተመ ክርስቶስ ሰንበት ት/ቤት አጠቃላይ ዓላማ",
};

export default function ObjectivesPage() {
  const obj = ARTICLES["5"];
  const items = obj.content_am
    .split("\n")
    .map((l) => l.replace(/^•\s*/, "").trim())
    .filter(Boolean);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm font-medium text-[var(--primary)]">አንቀጽ 5</p>
      <h1 className="mt-2 text-3xl font-bold text-[var(--primary)] amharic">
        {obj.title_am}
      </h1>

      <ol className="mt-10 space-y-4">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-bold text-white">
              {i + 1}
            </span>
            <p className="amharic leading-relaxed text-[var(--foreground)]">
              {item}
            </p>
          </li>
        ))}
      </ol>

      <p className="mt-8 text-sm text-[var(--foreground)]/50">
        {DOCUMENT_META.organization_am} · {DOCUMENT_META.revision_date_am}
      </p>

      <div className="mt-10">
        <Link href="/mission" className="text-sm font-medium text-[var(--primary)] hover:underline">
          ← ተልዕኮ
        </Link>
      </div>
    </div>
  );
}
