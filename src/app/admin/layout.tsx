import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/auth/require-admin";
import { AdminNav } from "./AdminNav";
import { AdminSignOut } from "./AdminSignOut";
import { AdminMobileNav } from "./AdminMobileNav";
import { EthiopianCross } from "@/components/orthodox/EthiopianCross";

export const metadata = {
  title: "አስተዳደር · ማእተመ ክርስቶስ",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const STAFF_ROLES = ["super_admin", "admin", "editor", "department_manager"];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--muted)]/40">
      <AdminShell>{children}</AdminShell>
    </div>
  );
}

async function AdminShell({ children }: { children: React.ReactNode }) {
  const session = await getSessionProfile();

  if (!session?.profile) {
    return <>{children}</>;
  }

  const role = session.profile.role;
  const isStaff = STAFF_ROLES.includes(role);

  if (!isStaff) {
    redirect("/");
  }

  if (session.profile.is_active === false) {
    redirect("/admin/login?error=inactive");
  }

  const name =
    session.profile.full_name_am ||
    session.profile.full_name_en ||
    session.profile.email ||
    "አስተዳዳሪ";

  const roleLabel: Record<string, string> = {
    super_admin: "ሱፐር አድሚን",
    admin: "አድሚን",
    editor: "አርታዒ",
    department_manager: "የክፍል ሃላፊ",
  };

  return (
    <div className="flex min-h-screen">
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--card)] sticky top-0 h-screen shadow-sm">
        <div className="border-b border-[var(--border)] px-4 py-4">
          <Link href="/admin" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--primary)]/10">
              <EthiopianCross size={22} gold animate={false} />
            </span>
            <span>
              <span className="block font-bold text-[var(--primary)] amharic text-sm leading-tight">
                አስተዳደር
              </span>
              <span className="block text-[10px] text-[var(--foreground)]/40 amharic">
                ማኅተመ ክርስቶስ
              </span>
            </span>
          </Link>
          <div className="mt-3 rounded-xl bg-[var(--muted)]/50 px-3 py-2">
            <p className="truncate text-xs font-semibold amharic text-[var(--foreground)]/80">
              {name}
            </p>
            <p className="mt-0.5 text-[10px] font-medium text-[var(--primary)] amharic">
              {roleLabel[role] ?? role}
            </p>
          </div>
        </div>

        <AdminNav />

        <div className="mt-auto border-t border-[var(--border)] p-3 space-y-1">
          <AdminSignOut />
          <Link
            href="/"
            className="flex items-center justify-center rounded-xl px-3 py-2 text-xs text-[var(--foreground)]/50 transition hover:bg-[var(--muted)] hover:text-[var(--primary)] amharic"
          >
            ← ወደ ድረ-ገጽ
          </Link>
        </div>
      </aside>

      <main className="flex-1 min-w-0 overflow-auto pb-24 md:pb-0">
        <div className="md:hidden sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--card)]/95 px-4 py-2.5 backdrop-blur">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)]/10">
              <EthiopianCross size={18} gold animate={false} />
            </span>
            <span className="font-bold text-[var(--primary)] amharic text-sm">አስተዳደር</span>
          </Link>
          <AdminSignOut />
        </div>
        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">{children}</div>
      </main>

      <AdminMobileNav />
    </div>
  );
}
