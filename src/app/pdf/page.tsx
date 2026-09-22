import Link from "next/link";
import { DOCUMENT_META } from "@/data/regulations";
import { Download, BookOpen, FileText } from "lucide-react";

export const metadata = {
  title: "PDF ማውረድ",
  description: "የውስጥ መተዳደሪያ ሕግና ደንብ ኦፊሴላዊ PDF",
};

export default function PdfPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 lg:px-8 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--primary)]/10">
        <FileText className="h-8 w-8 text-[var(--primary)]" />
      </div>
      <h1 className="mt-6 text-2xl font-bold text-[var(--primary)] amharic">
        ኦፊሴላዊ PDF
      </h1>
      <p className="mt-3 text-[var(--foreground)]/70 amharic leading-relaxed">
        {DOCUMENT_META.title_am}
      </p>
      <p className="mt-2 text-sm text-[var(--foreground)]/50">
        {DOCUMENT_META.revision_date_am} · {DOCUMENT_META.page_count} ገጾች
      </p>

      <div className="mt-10 space-y-3">
        <a
          href="/documents/makhteme-kristos-regulations.pdf"
          download
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3.5 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <Download className="h-4 w-4" />
          PDF ያውርዱ
        </a>
        <Link
          href="/rules"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-5 py-3.5 text-sm font-semibold transition hover:bg-[var(--muted)]"
        >
          <BookOpen className="h-4 w-4" />
          በመስመር ላይ ያንብቡ
        </Link>
      </div>

      <p className="mt-8 text-xs text-[var(--foreground)]/50 amharic">
        ማስታወሻ፡ PDF ፋይሉ በአስተዳዳሪው በኩል በSupabase Storage ሲጫን እዚህ
        ይገኛል። አሁን ላይ ዲጂታል አንባቢውን ይጠቀሙ።
      </p>
    </div>
  );
}
