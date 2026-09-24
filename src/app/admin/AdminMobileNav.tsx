"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  LayoutGrid,
  Workflow,
  Megaphone,
  Settings,
} from "lucide-react";

const items = [
  { href: "/admin", label: "ዳሽቦርድ", icon: LayoutDashboard, exact: true },
  { href: "/admin/workspace", label: "ክፍሎች", icon: LayoutGrid },
  { href: "/admin/operations", label: "ሂደቶች", icon: Workflow },
  { href: "/admin/announcements", label: "ጉዳዮች", icon: Megaphone },
  { href: "/admin/settings", label: "ቅንብር", icon: Settings },
];

export function AdminMobileNav() {
  const pathname = usePathname();

  if (pathname === "/admin/login") return null;

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-[var(--border)] bg-[var(--card)]/95 backdrop-blur-md pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <ul className="grid grid-cols-5 gap-0">
        {items.map(({ href, label, icon: Icon, exact }) => {
          const active = exact
            ? pathname === href
            : pathname === href || pathname.startsWith(href + "/");
          return (
            <li key={href}>
              <Link
                href={href}
                className={`flex flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] amharic transition ${
                  active
                    ? "text-[var(--primary)] font-semibold"
                    : "text-[var(--foreground)]/50"
                }`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                    active ? "bg-[var(--primary)]/12" : ""
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={active ? 2.25 : 1.75} />
                </span>
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
