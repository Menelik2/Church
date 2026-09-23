"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { EthiopianCross } from "@/components/orthodox/EthiopianCross";
import { motion, AnimatePresence } from "framer-motion";
import { RippleLink } from "@/components/ui/Ripple";

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

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (pathname.startsWith("/admin")) {
    return (
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center px-4">
          <Link href="/admin" className="font-semibold text-[var(--primary)] amharic text-sm">
            አስተዳደር
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header
      className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur-xl"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="h-0.5 bg-gradient-to-r from-[var(--color-burgundy-800)] via-[var(--color-gold-500)] to-[var(--color-burgundy-800)]" />
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-2 px-3 sm:h-16 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-2">
          <EthiopianCross size={32} animate={false} />
          <div className="min-w-0">
            <span className="block truncate text-[13px] font-bold leading-tight text-[var(--primary)] amharic sm:text-sm">
              ማኅተመ ክርስቶስ
            </span>
            <span className="block truncate text-[10px] leading-tight text-[var(--foreground)]/55 amharic sm:text-xs">
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
              <RippleLink
                key={link.href}
                href={link.href}
                color="primary"
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium",
                  active
                    ? "text-[var(--primary)] bg-[var(--primary)]/8"
                    : "text-[var(--foreground)]/70 hover:text-[var(--primary)] hover:bg-[var(--muted)]"
                )}
              >
                {link.label}
              </RippleLink>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <RippleLink
            href="/search"
            color="primary"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-[var(--foreground)]/70 hover:bg-[var(--muted)]"
            aria-label="ፍለጋ"
          >
            <Search className="h-5 w-5" />
          </RippleLink>
          <button
            type="button"
            className="ripple-host relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl text-[var(--foreground)]/70 transition hover:bg-[var(--muted)] active:scale-95 lg:hidden"
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 top-[calc(3.5rem+env(safe-area-inset-top,0px))] z-40 bg-black/40 lg:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.nav
              initial={{ y: -12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-b border-[var(--border)] bg-[var(--background)] px-3 py-3 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid grid-cols-2 gap-2">
                {navLinks.map((link) => {
                  const active =
                    link.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(link.href);
                  return (
                    <RippleLink
                      key={link.href}
                      href={link.href}
                      color={active ? "light" : "primary"}
                      className={cn(
                        "rounded-2xl px-4 py-3.5 text-center text-sm font-semibold amharic",
                        active
                          ? "bg-[var(--primary)] text-white"
                          : "bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--primary)]/10"
                      )}
                    >
                      {link.label}
                    </RippleLink>
                  );
                })}
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
