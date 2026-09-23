"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  LayoutGrid,
  Workflow,
  BookOpen,
  Settings,
} from "lucide-react";

const items = [
  { href: "/admin", label: "ዳሽቦርድ", icon: LayoutDashboard, exact: true },
  { href: "/admin/workspace", label: "ክፍሎች", icon: LayoutGrid },
  { href: "/admin/operations", label: "ሂደቶች", icon: Workflow },
  { href: "/admin/articles", label: "አንቀጾች", icon: BookOpen },
  { href: "/admin/settings", label: "ቅንብር", icon: Settings },
];

export function AdminMobileNav() {
  const pathname = usePathname();

  // Hide on login
  if (pathname === "/admin/login") return null;

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-[var(--border)] bg-[var(--card)]/95 backdrop-blur-md safe-area-pb">
      <ul className="grid grid-cols-5 gap-0">
        {items.map(({ href, label, icon: Icon, exact }) => {
          const active = exact
            ? pathname === href
            : pathname === href || pathname.startsWith(href + "/");
          return (
            <li key={href}>
              <Link
                href={href}
                className={`flex flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] amharic ${
                  active
                    ? "text-[var(--primary)] font-semibold"
                    : "text-[var(--foreground)]/55"
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.25 : 1.75} />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
