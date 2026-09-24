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
  GitBranch,
  Users,
  ClipboardList,
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  match?: "exact" | "prefix" | "ops";
};

type NavGroup = { title: string; items: NavItem[] };

const groups: NavGroup[] = [
  {
    title: "አጠቃላይ",
    items: [
      { href: "/admin", label: "ዳሽቦርድ", icon: LayoutDashboard, match: "exact" },
      { href: "/admin/workspace", label: "ክፍል ዳሽቦርድ", icon: LayoutGrid },
      { href: "/admin/operations", label: "ሂደቶች", icon: Workflow, match: "ops" },
    ],
  },
  {
    title: "አባላትና አገልግሎት",
    items: [
      { href: "/admin/operations/journey", label: "የአባል ጉዞ", icon: GitBranch },
      { href: "/admin/operations/servants", label: "አገልጋዮች", icon: Users },
      { href: "/admin/operations/onboarding", label: "መቀበያ", icon: ClipboardList },
    ],
  },
  {
    title: "ይዘት",
    items: [
      { href: "/admin/announcements", label: "ወቅታዊ ጉዳዮች", icon: Megaphone },
      { href: "/admin/events", label: "ዝግጅቶች", icon: Calendar },
      { href: "/admin/articles", label: "አንቀጾች", icon: BookOpen },
      { href: "/admin/departments", label: "ክፍሎች", icon: Building2 },
    ],
  },
  {
    title: "ስርዓት",
    items: [
      { href: "/admin/messages", label: "መልዕክቶች", icon: Mail },
      { href: "/admin/settings", label: "ቅንብሮች", icon: Settings },
    ],
  },
];

function isActive(pathname: string, item: NavItem) {
  if (item.match === "exact") return pathname === item.href;
  if (item.match === "ops") {
    return (
      pathname === "/admin/operations" ||
      (pathname.startsWith("/admin/operations/") &&
        !pathname.startsWith("/admin/operations/journey") &&
        !pathname.startsWith("/admin/operations/servants") &&
        !pathname.startsWith("/admin/operations/onboarding"))
    );
  }
  return pathname === item.href || pathname.startsWith(item.href + "/");
}

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
      {groups.map((g) => (
        <div key={g.title}>
          <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-wider text-[var(--foreground)]/35 amharic">
            {g.title}
          </p>
          <ul className="space-y-0.5">
            {g.items.map((item) => {
              const Icon = item.icon;
              const active = isActive(pathname, item);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition ${
                      active
                        ? "bg-[var(--primary)] text-white font-semibold shadow-sm"
                        : "text-[var(--foreground)]/70 hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" strokeWidth={active ? 2.25 : 1.75} />
                    <span className="amharic">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
