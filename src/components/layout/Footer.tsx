import Link from "next/link";
import { EthiopianCross } from "@/components/orthodox/EthiopianCross";
import { DOCUMENT_META } from "@/data/regulations";

export function Footer() {
  return (
    <footer className="pb-20 lg:pb-0 border-t border-[var(--border)] bg-[var(--color-burgundy-950)] text-white">
      <div className="h-0.5 bg-gradient-to-r from-transparent via-[var(--color-gold-500)] to-transparent" />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <EthiopianCross size={40} animate={false} gold />
              <div>
                <p className="font-bold amharic text-[var(--color-gold-300)]">
                  ማኅተመ ክርስቶስ
                </p>
                <p className="text-xs text-white/60">ሰንበት ት/ቤት</p>
              </div>
            </div>
            <p className="text-sm text-white/70 amharic max-w-md leading-relaxed">
              {DOCUMENT_META.organization_am} — የውስጥ መተዳደሪያ ሕግና ደንብ ዲጂታል መድረክ።
              ይዘቱ ከኦፊሴላዊው PDF ሰነድ የተወሰደ ነው።
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-gold-300)] mb-3">
              አሰሳ
            </h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link href="/rules" className="hover:text-[var(--color-gold-200)]">
                  ሕግና ደንብ
                </Link>
              </li>
              <li>
                <Link href="/departments" className="hover:text-[var(--color-gold-200)]">
                  ክፍሎች
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[var(--color-gold-200)]">
                  አገልግሎቶች
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[var(--color-gold-200)]">
                  አግኙን
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-gold-300)] mb-3">
              ሰነድ
            </h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link href="/pdf" className="hover:text-[var(--color-gold-200)]">
                  PDF ማውረድ
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-[var(--color-gold-200)]">
                  ፍለጋ
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[var(--color-gold-200)]">
                  አስተዳደር
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/10 text-center text-xs text-white/50 amharic">
          © {new Date().getFullYear()} {DOCUMENT_META.organization_am} ·{" "}
          {DOCUMENT_META.revision_date_am}
        </div>
      </div>
    </footer>
  );
}
