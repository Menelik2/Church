"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { EthiopianCross } from "@/components/orthodox/EthiopianCross";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/", label: "መነሻ" },
  { href: "/rules", label: "ሕግና ደንብ" },
  { href: "/about", label: "ስለ እኛ" },
  { href: "/departments", label: "ክፍሎች" },
  { href: "/services", label: "አገልግሎቶች" },
  { href: "/announcements", label: "ማስታወቂያ" },
  { href: "/events", label: "ዝግጅቶች" },
  { href: "/contact", label: "አግኙን" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-md">
      <div className="h-0.5 bg-gradient-to-r from-[var(--color-burgundy-800)] via-[var(--color-gold-500)] to-[var(--color-burgundy-800)]" />
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="transition group-hover:scale-110">
            <EthiopianCross size={36} animate={false} />
          </div>
          <div className="hidden sm:block">
            <span className="block text-sm font-bold text-[var(--primary)] amharic leading-tight">
              ማኅተመ ክርስቶስ
            </span>
            <span className="block text-xs text-[var(--foreground)]/60">
              ሰንበት ት/ቤት
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-0.5">
          {navLinks.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-lg px-3 py-2 text-sm font-medium transition",
                  active
                    ? "text-[var(--primary)]"
                    : "text-[var(--foreground)]/70 hover:text-[var(--primary)] hover:bg-[var(--muted)]"
                )}
              >
                {link.label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-[var(--color-gold-500)]"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href="/search"
            className="rounded-lg p-2 text-[var(--foreground)]/70 hover:bg-[var(--muted)] hover:text-[var(--primary)]"
            aria-label="ፈልግ"
          >
            <Search className="h-5 w-5" />
          </Link>
          <button
            type="button"
            className="lg:hidden rounded-lg p-2 text-[var(--foreground)]/70 hover:bg-[var(--muted)]"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "ዝጋ" : "ምናሌ"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden overflow-hidden border-t border-[var(--border)] bg-[var(--card)]"
          >
            <ul className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium amharic text-[var(--foreground)]/80 hover:bg-[var(--muted)] hover:text-[var(--primary)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
