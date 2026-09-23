"use client";

import { usePathname } from "next/navigation";
import { Home, BookOpen, Building2, HandHeart, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { RippleLink } from "@/components/ui/Ripple";

const tabs = [
  { href: "/", label: "መነሻ", icon: Home, match: (p: string) => p === "/" },
  {
    href: "/rules",
    label: "ሕግ",
    icon: BookOpen,
    match: (p: string) => p.startsWith("/rules") || p.startsWith("/pdf"),
  },
  {
    href: "/departments",
    label: "ክፍሎች",
    icon: Building2,
    match: (p: string) => p.startsWith("/departments"),
  },
  {
    href: "/services",
    label: "አገልግሎት",
    icon: HandHeart,
    match: (p: string) => p.startsWith("/services"),
  },
  {
    href: "/more",
    label: "ተጨማሪ",
    icon: MoreHorizontal,
    match: (p: string) =>
      p.startsWith("/about") ||
      p.startsWith("/contact") ||
      p.startsWith("/announcements") ||
      p.startsWith("/events") ||
      p.startsWith("/more") ||
      p.startsWith("/vision") ||
      p.startsWith("/mission") ||
      p.startsWith("/objectives") ||
      p.startsWith("/organization"),
  },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 lg:hidden border-t border-[var(--border)] bg-[var(--background)]/92 backdrop-blur-2xl shadow-[0_-4px_24px_rgba(0,0,0,0.06)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      aria-label="ዋና አሰሳ"
    >
      <ul className="mx-auto grid h-[4.25rem] max-w-lg grid-cols-5">
        {tabs.map((tab) => {
          const active = tab.match(pathname);
          const Icon = tab.icon;
          return (
            <li key={tab.href} className="flex">
              <RippleLink
                href={tab.href}
                color="primary"
                className={cn(
                  "relative flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-medium",
                  active
                    ? "text-[var(--primary)]"
                    : "text-[var(--foreground)]/45"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="tab-pill"
                    className="absolute top-1.5 h-1 w-5 rounded-full bg-[var(--color-gold-500)]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span
                  className={cn(
                    "mt-1 flex h-8 w-8 items-center justify-center rounded-xl transition",
                    active && "bg-[var(--primary)]/10"
                  )}
                >
                  <Icon
                    className={cn("h-5 w-5", active && "stroke-[2.35]")}
                    aria-hidden
                  />
                </span>
                <span className="amharic leading-none">{tab.label}</span>
              </RippleLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
