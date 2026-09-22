import { ARTICLES, DOCUMENT_META } from "@/data/regulations";
import Link from "next/link";

export const metadata = {
  title: "መመዘኛ መስፈርቶች",
  description: "አንቀጽ 14 — የቋሚ አባልነት መመዘኛ",
};

export default function RequirementsPage() {
  const art = ARTICLES["14"];

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm font-medium text-[var(--primary)]">አንቀጽ 14</p>
      <h1 className="mt-2 text-3xl font-bold text-[var(--primary)] amharic">
        {art.title_am}
      </h1>
      <div className="mt-8 prose-am amharic whitespace-pre-wrap leading-relaxed">
        {art.content_am}
      </div>
      <p className="mt-6 text-sm text-[var(--foreground)]/50">
        {DOCUMENT_META.revision_date_am}
      </p>
      <div className="mt-10">
        <Link href="/membership/responsibilities" className="text-sm font-medium text-[var(--primary)] hover:underline">
          ← ግዴታ
        </Link>
      </div>
    </div>
  );
}
