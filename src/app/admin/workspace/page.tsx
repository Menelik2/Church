import Link from "next/link";
import { DEPARTMENT_WORKSPACES } from "@/data/department-workspaces";
import { requireStaff } from "@/lib/auth/require-admin";
import { Crown, Building2, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function WorkspaceIndexPage() {
  await requireStaff();
  const leadership = DEPARTMENT_WORKSPACES.filter((d) => d.is_leadership);
  const depts = DEPARTMENT_WORKSPACES.filter((d) => !d.is_leadership);

  return (
    <div className="pb-16">
      <h1 className="text-2xl font-bold text-[var(--primary)] amharic">
        የክፍል ዳሽቦርዶች
      </h1>
      <p className="mt-1 text-sm text-[var(--foreground)]/60 amharic">
        እያንዳንዱ ክፍልና አመራር የራሱ ተግባርና የስራ ቦታ አለው
      </p>

      <h2 className="mt-8 mb-3 flex items-center gap-2 text-sm font-bold amharic text-[var(--color-gold-600)]">
        <Crown className="h-4 w-4" /> አመራር
      </h2>
      <div className="grid gap-3 sm:grid-cols-3">
        {leadership.map((d) => (
          <Link
            key={d.code}
            href={`/admin/workspace/${d.code}`}
            className="group rounded-2xl border border-[var(--color-gold-300)] bg-gradient-to-br from-[var(--color-gold-50)] to-white p-5 shadow-sm active:scale-[0.99] transition"
          >
            <p className="font-bold amharic text-[var(--primary)] text-lg">{d.title_am}</p>
            <p className="text-xs text-[var(--foreground)]/55 mt-1">{d.title_en}</p>
            <p className="mt-2 text-xs amharic text-[var(--foreground)]/70 line-clamp-2">
              {d.description_am}
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[var(--primary)]">
              ክፈት <ChevronRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        ))}
      </div>

      <h2 className="mt-10 mb-3 flex items-center gap-2 text-sm font-bold amharic text-[var(--primary)]">
        <Building2 className="h-4 w-4" /> ክፍሎች
      </h2>
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {depts.map((d) => (
          <Link
            key={d.code}
            href={`/admin/workspace/${d.code}`}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 hover:border-[var(--color-burgundy-300)] active:scale-[0.99] transition"
          >
            <p className="font-semibold amharic text-[var(--primary)]">{d.title_am}</p>
            <p className="text-xs text-[var(--foreground)]/50">{d.title_en}</p>
            <p className="mt-2 text-xs amharic text-[var(--foreground)]/65 line-clamp-2">
              {d.description_am}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
