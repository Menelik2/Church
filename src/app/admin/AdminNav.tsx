"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Megaphone,
  Calendar,
  Building2,
  Mail,
  Settings,
  Workflow,
  LayoutGrid,
} from "lucide-react";

const fullLinks = [
  { href: "/admin", label: "ዳሽቦርድ", icon: LayoutDashboard },
  { href: "/admin/workspace", label: "ክፍል ዳሽቦርድ", icon: LayoutGrid },
  { href: "/admin/operations", label: "ሂደቶች", icon: Workflow },
  { href: "/admin/articles", label: "አንቀጾች", icon: BookOpen },
  { href: "/admin/announcements", label: "ማስታወቂያዎች", icon: Megaphone },
  { href: "/admin/events", label: "ዝግጅቶች", icon: Calendar },
  { href: "/admin/departments", label: "ክፍሎች", icon: Building2 },
  { href: "/admin/messages", label: "መልዕክቶች", icon: Mail },
  { href: "/admin/settings", label: "ቅንብሮች", icon: Settings },
];

/** Department managers only see workspace + their operational links */
const restrictedLinks = [
  { href: "/admin/workspace", label: "ክፍል ዳሽቦርድ", icon: LayoutGrid },
  { href: "/admin/operations/reports", label: "ሪፖርቶች", icon: Workflow },
];

export function AdminNav({ restricted = false }: { restricted?: boolean }) {
  const pathname = usePathname();
  const links = restricted ? restrictedLinks : fullLinks;

  return (
    <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
      {links.map(({ href, label, icon: Icon }) => {
        const active =
          href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition ${
              active
                ? "bg-[var(--primary)]/10 text-[var(--primary)] font-medium"
                : "text-[var(--foreground)]/70 hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="amharic">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
