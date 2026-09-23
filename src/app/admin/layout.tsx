import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/auth/require-admin";
import { AdminNav } from "./AdminNav";
import { AdminSignOut } from "./AdminSignOut";
import { AdminMobileNav } from "./AdminMobileNav";

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
    <div className="min-h-screen bg-[var(--background)]">
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

  return (
    <div className="flex min-h-screen">
      <aside className="hidden md:flex w-60 flex-col border-r border-[var(--border)] bg-[var(--card)] sticky top-0 h-screen">
        <div className="p-5 border-b border-[var(--border)]">
          <Link href="/admin" className="font-bold text-[var(--primary)] amharic">
            አስተዳደር
          </Link>
          <p className="text-xs text-[var(--foreground)]/50 mt-0.5 truncate">
            {session.profile.email}
          </p>
        </div>
        <AdminNav />
        <div className="mt-auto p-4 border-t border-[var(--border)]">
          <AdminSignOut />
          <Link
            href="/"
            className="mt-2 block text-center text-xs text-[var(--foreground)]/50 hover:text-[var(--primary)]"
          >
            ← ወደ ድረ-ገጽ
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-auto pb-20 md:pb-0">
        <div className="md:hidden border-b border-[var(--border)] px-3 py-2.5 flex items-center justify-between bg-[var(--card)] sticky top-0 z-30">
          <Link href="/admin" className="font-bold text-[var(--primary)] amharic text-sm">
            አስተዳደር
          </Link>
          <AdminSignOut />
        </div>
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">{children}</div>
      </main>

      <AdminMobileNav />
    </div>
  );
}
