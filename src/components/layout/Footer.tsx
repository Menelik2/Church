import Link from "next/link";
import { EthiopianCross } from "@/components/orthodox/EthiopianCross";
import { DOCUMENT_META } from "@/data/regulations";

const explore = [
  { href: "/rules", label: "ሕግና ደንብ" },
  { href: "/departments", label: "ክፍሎች" },
  { href: "/services", label: "አገልግሎቶች" },
  { href: "/announcements", label: "ወቅታዊ ጉዳዮች" },
  { href: "/events", label: "ዝግጅቶች" },
  { href: "/programs", label: "መርሐግብራት" },
];

const about = [
  { href: "/about", label: "ስለ እኛ" },
  { href: "/vision", label: "ራዕይ" },
  { href: "/mission", label: "ተልእኮ" },
  { href: "/organization", label: "መዋቅር" },
  { href: "/contact", label: "አግኙን" },
];

const resources = [
  { href: "/pdf", label: "PDF አውርድ" },
  { href: "/search", label: "ፍለጋ" },
  { href: "/admin", label: "አስተዳደር" },
];

export function Footer() {
  return (
    <footer className="pb-20 md:pb-0 border-t border-[var(--border)] bg-[var(--color-burgundy-950)] text-white">
      <div className="h-0.5 bg-gradient-to-r from-transparent via-[var(--color-gold-500)] to-transparent" />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
          <div className="sm:col-span-2 lg:col-span-5">
            <div className="flex items-center gap-3 mb-4">
              <EthiopianCross size={40} animate={false} gold />
              <div>
                <p className="font-bold amharic text-[var(--color-gold-300)] text-base">ማኅተመ ክርስቶስ</p>
                <p className="text-xs text-white/55 amharic">ሰንበት ት/ቤት · ባሕር ዳር</p>
              </div>
            </div>
            <p className="text-sm text-white/65 amharic max-w-md leading-relaxed">
              {DOCUMENT_META.organization_am} — የውስጥ መተዳደሪያ ሕግና ደንብ፣ አገልግሎትና ክፍሎች ዲጂታል መድረክ።
            </p>
            <p className="mt-3 text-xs text-white/40 amharic">{DOCUMENT_META.church_am}</p>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-[var(--color-gold-300)] mb-4 amharic">አሰሳ</h3>
            <ul className="space-y-2.5 text-sm text-white/65">
              {explore.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="amharic transition hover:text-[var(--color-gold-200)]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-[var(--color-gold-300)] mb-4 amharic">ስለ ቤተ ክርስቲያን</h3>
            <ul className="space-y-2.5 text-sm text-white/65">
              {about.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="amharic transition hover:text-[var(--color-gold-200)]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold text-[var(--color-gold-300)] mb-4 amharic">ሰነድ</h3>
            <ul className="space-y-2.5 text-sm text-white/65">
              {resources.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="amharic transition hover:text-[var(--color-gold-200)]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/pdf"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[var(--color-gold-500)] px-4 py-2.5 text-xs font-bold text-[var(--color-charcoal)] transition hover:bg-[var(--color-gold-400)]"
            >
              ኦፊሴላዊ PDF አውርድ
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-center text-xs text-white/45 sm:flex-row sm:text-left amharic">
          <p>© {new Date().getFullYear()} {DOCUMENT_META.organization_am}</p>
          <p>{DOCUMENT_META.revision_date_am}</p>
        </div>
      </div>
    </footer>
  );
}
