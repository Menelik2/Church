import { ARTICLES, DOCUMENT_META } from "@/data/regulations";
import Link from "next/link";

export const metadata = {
  title: "የአገልጋይ ግዴታ",
  description: "አንቀጽ 12 — የአገልጋይ ግዴታ",
};

export default function ResponsibilitiesPage() {
  const art = ARTICLES["12"];

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm font-medium text-[var(--primary)]">አንቀጽ 12</p>
      <h1 className="mt-2 text-3xl font-bold text-[var(--primary)] amharic">
        {art.title_am}
      </h1>
      <div className="mt-8 prose-am amharic whitespace-pre-wrap leading-relaxed">
        {art.content_am}
      </div>
      <p className="mt-6 text-sm text-[var(--foreground)]/50">
        {DOCUMENT_META.revision_date_am}
      </p>
      <div className="mt-10 flex gap-4">
        <Link href="/membership/rights" className="text-sm font-medium text-[var(--foreground)]/60 hover:underline">
          ← መብት
        </Link>
        <Link href="/membership/requirements" className="text-sm font-medium text-[var(--primary)] hover:underline">
          መመዘኛ →
        </Link>
      </div>
    </div>
  );
}
