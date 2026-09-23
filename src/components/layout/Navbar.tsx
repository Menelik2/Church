"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { EthiopianCross } from "@/components/orthodox/EthiopianCross";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/", label: "\u1218\u1290\u123b" },
  { href: "/rules", label: "\u1215\u130d\u1293 \u12f0\u1295\u1265" },
  { href: "/about", label: "\u1235\u1208 \u12a5\u12db" },
  { href: "/departments", label: "\u12ad\u134d\u120e\u127d" },
  { href: "/services", label: "\u12a0\u1308\u120d\u130d\u120e\u1276\u127d" },
  { href: "/announcements", label: "\u121b\u1235\u1273\u12c8\u1242\u12eb" },
  { href: "/events", label: "\u12dd\u130d\u1305\u1276\u127d" },
  { href: "/contact", label: "\u12a0\u130d\u1299\u1295" },
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
              \u121b\u12a5\u1270\u1218 \u12ad\u122d\u1235\u1276\u1235
            </span>
            <span className="block text-xs text-[var(--foreground)]/60">
              \u1230\u1295\u1260\u1275 \u1275/\u1264\u1275
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
            aria-label="\u1348\u120d\u130d"
          >
            <Search className="h-5 w-5" />
          </Link>
          <button
            type="button"
            className="lg:hidden rounded-lg p-2 text-[var(--foreground)]/70 hover:bg-[var(--muted)]"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "\u12dd\u130b" : "\u121d\u1293\u120c"}
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
