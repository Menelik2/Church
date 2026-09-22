"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Search } from "lucide-react";

const navLinks = [
  { href: "/", label: "መነሻ" },
  { href: "/rules", label: "ሕግና ደንብ" },
  { href: "/about", label: "ስለ እኛ" },
  { href: "/departments", label: "ክፍሎች" },
  { href: "/programs", label: "መርሐግብራት" },
  { href: "/contact", label: "አግኙን" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--background)]/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary)] text-white text-sm font-bold">
            መክ
          </div>
          <div className="hidden sm:block">
            <span className="block text-sm font-bold text-[var(--primary)] amharic leading-tight">
              ማኅተመ ክርስቶስ
            </span>
            <span className="block text-xs text-[var(--foreground)]/70">
              ሰንበት ት/ቤት
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--foreground)]/80 transition hover:bg-[var(--muted)] hover:text-[var(--primary)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/search"
            className="rounded-lg p-2 text-[var(--foreground)]/70 hover:bg-[var(--muted)] hover:text-[var(--primary)]"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Link>
          <button
            type="button"
            className="md:hidden rounded-lg p-2 text-[var(--foreground)]/70 hover:bg-[var(--muted)]"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-[var(--border)] bg-[var(--background)] md:hidden">
          <nav className="flex flex-col px-4 py-3 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-base font-medium text-[var(--foreground)] hover:bg-[var(--muted)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
