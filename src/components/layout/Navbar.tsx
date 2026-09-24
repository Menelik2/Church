"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Search, ChevronDown, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { EthiopianCross } from "@/components/orthodox/EthiopianCross";
import { motion, AnimatePresence } from "framer-motion";
import { RippleLink } from "@/components/ui/Ripple";

const primaryLinks = [
  { href: "/", label: "መነሻ" },
  { href: "/rules", label: "ሕግና ደንብ" },
  { href: "/departments", label: "ክፍሎች" },
  { href: "/services", label: "አገልግሎቶች" },
  { href: "/announcements", label: "ወቅታዊ" },
  { href: "/events", label: "ዝግጅቶች" },
];

const moreLinks = [
  { href: "/about", label: "ስለ እኛ" },
  { href: "/vision", label: "ራዕይ" },
  { href: "/mission", label: "ተልእኮ" },
  { href: "/organization", label: "መዋቅር" },
  { href: "/programs", label: "መርሐግብራት" },
  { href: "/contact", label: "አግኙን" },
  { href: "/pdf", label: "PDF አውርድ" },
];

function linkActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const pathname = usePathname();
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  if (pathname.startsWith("/admin")) return null;

  const moreActive = moreLinks.some((l) => linkActive(pathname, l.href));

  return (
    <header
      className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur-xl"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="h-0.5 bg-gradient-to-r from-[var(--color-burgundy-800)] via-[var(--color-gold-500)] to-[var(--color-burgundy-800)]" />

      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2.5">
          <EthiopianCross size={34} animate={false} />
          <div className="min-w-0 hidden sm:block">
            <span className="block truncate text-sm font-bold leading-tight text-[var(--primary)] amharic">
              ማኅተመ ክርስቶስ
            </span>
            <span className="block truncate text-[11px] leading-tight text-[var(--foreground)]/50 amharic">
              ሰንበት ት/ቤት
            </span>
          </div>
          <span className="sm:hidden font-bold text-[var(--primary)] amharic text-sm">ማኅተመ ክርስቶስ</span>
        </Link>

        <nav className="hidden md:flex flex-1 items-center justify-center gap-0.5 min-w-0">
          {primaryLinks.map((link) => {
            const active = linkActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-2.5 py-2 text-[13px] font-medium amharic whitespace-nowrap transition lg:px-3 lg:text-sm",
                  active
                    ? "text-[var(--primary)] bg-[var(--primary)]/10 font-semibold"
                    : "text-[var(--foreground)]/65 hover:text-[var(--primary)] hover:bg-[var(--muted)]"
                )}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="relative" ref={moreRef}>
            <button
              type="button"
              onClick={() => setMoreOpen((v) => !v)}
              className={cn(
                "inline-flex items-center gap-0.5 rounded-lg px-2.5 py-2 text-[13px] font-medium amharic transition lg:px-3 lg:text-sm",
                moreActive || moreOpen
                  ? "text-[var(--primary)] bg-[var(--primary)]/10 font-semibold"
                  : "text-[var(--foreground)]/65 hover:text-[var(--primary)] hover:bg-[var(--muted)]"
              )}
              aria-expanded={moreOpen}
            >
              ተጨማሪ
              <ChevronDown className={cn("h-3.5 w-3.5 transition", moreOpen && "rotate-180")} />
            </button>
            <AnimatePresence>
              {moreOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full z-50 mt-1.5 w-52 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] py-1.5 shadow-xl"
                >
                  {moreLinks.map((link) => {
                    const active = linkActive(pathname, link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          "block px-4 py-2.5 text-sm amharic transition",
                          active
                            ? "bg-[var(--primary)]/10 font-semibold text-[var(--primary)]"
                            : "text-[var(--foreground)]/75 hover:bg-[var(--muted)] hover:text-[var(--primary)]"
                        )}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        <div className="flex shrink-0 items-center gap-1.5">
          <Link
            href="/search"
            className="hidden lg:inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-xs font-medium text-[var(--foreground)]/70 transition hover:border-[var(--color-gold-400)] hover:text-[var(--primary)]"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="amharic">ፈልግ</span>
          </Link>
          <Link
            href="/search"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-[var(--foreground)]/70 transition hover:bg-[var(--muted)] lg:hidden"
            aria-label="ፍለጋ"
          >
            <Search className="h-5 w-5" />
          </Link>
          <Link
            href="/pdf"
            className="hidden xl:inline-flex items-center gap-1.5 rounded-xl bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-white transition hover:opacity-95"
          >
            <FileText className="h-3.5 w-3.5" />
            <span className="amharic">PDF</span>
          </Link>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-[var(--foreground)]/70 transition hover:bg-[var(--muted)] md:hidden"
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
            className="fixed inset-0 top-[calc(3.5rem+env(safe-area-inset-top,0px))] z-40 bg-black/40 md:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.nav
              initial={{ y: -12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-[var(--border)] bg-[var(--background)] px-3 py-3 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid grid-cols-2 gap-2">
                {[...primaryLinks, ...moreLinks].map((link) => {
                  const active = linkActive(pathname, link.href);
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
