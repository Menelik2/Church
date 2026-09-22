import Link from "next/link";
import { DOCUMENT_META } from "@/data/regulations";

const quickLinks = [
  { href: "/rules", label: "ሕግና ደንብ" },
  { href: "/about", label: "ስለ እኛ" },
  { href: "/vision", label: "ርእይ" },
  { href: "/mission", label: "ተልዕኮ" },
  { href: "/departments", label: "ክፍሎች" },
  { href: "/programs", label: "መርሐግብራት" },
  { href: "/membership/rights", label: "የአገልጋይ መብት" },
  { href: "/contact", label: "አግኙን" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--muted)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-bold text-[var(--primary)] amharic">
              {DOCUMENT_META.organization_am}
            </h3>
            <p className="mt-2 text-sm text-[var(--foreground)]/70 amharic leading-relaxed">
              {DOCUMENT_META.church_am}
              <br />
              {DOCUMENT_META.diocese_am}
            </p>
            <p className="mt-3 text-xs text-[var(--foreground)]/50">
              የውስጥ መተዳደሪያ ሕግና ደንብ · {DOCUMENT_META.revision_date_am}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[var(--foreground)] mb-3">
              ፈጣን አገናኞች
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-[var(--foreground)]/70 hover:text-[var(--primary)] transition"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[var(--foreground)] mb-3">
              ሰነድ
            </h4>
            <p className="text-sm text-[var(--foreground)]/70 amharic leading-relaxed">
              ይህ ድረ-ገጽ የማኅተመ ክርስቶስ ሰንበት ት/ቤት የውስጥ መተዳደሪያ ሕግና ደንብን
              በዲጂታል መልክ ያቀርባል። ሙሉ ኦፊሴላዊ PDF ማውረድ ይቻላል።
            </p>
            <Link
              href="/pdf"
              className="mt-3 inline-block text-sm font-medium text-[var(--primary)] hover:underline"
            >
              ሙሉ PDF ያውርዱ →
            </Link>
          </div>
        </div>

        <div className="mt-10 border-t border-[var(--border)] pt-6 flex flex-col sm:flex-row justify-between gap-4 text-xs text-[var(--foreground)]/50">
          <p>
            © {year} {DOCUMENT_META.organization_am}. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-[var(--primary)]">
              ግላዊነት
            </Link>
            <Link href="/terms" className="hover:text-[var(--primary)]">
              ውሎች
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
