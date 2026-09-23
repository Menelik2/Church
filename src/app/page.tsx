"use client";

import Link from "next/link";
import {
  BookOpen,
  Download,
  ChevronRight,
  Users,
  Church,
  Heart,
  Sparkles,
  Building2,
  HandHeart,
  Search,
} from "lucide-react";
import { DOCUMENT_META, DEPARTMENTS } from "@/data/regulations";
import { EthiopianCross } from "@/components/orthodox/EthiopianCross";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/motion/FadeIn";
import { motion } from "framer-motion";

const primaryActions = [
  {
    href: "/rules",
    title: "ሕግና ደንብ",
    desc: "አንቀጾች 1–16",
    icon: BookOpen,
    tone: "primary" as const,
  },
  {
    href: "/pdf",
    title: "PDF",
    desc: "ኦፊሴላዊ ሰነድ",
    icon: Download,
    tone: "gold" as const,
  },
];

const quickGrid = [
  { href: "/about", title: "መግቢያ", desc: "ታሪክ", icon: Church },
  { href: "/vision", title: "ርእይ", desc: "ራዕይ", icon: Sparkles },
  { href: "/mission", title: "ተልዕኮ", desc: "ተልዕኮ", icon: Heart },
  { href: "/objectives", title: "ዓላማ", desc: "ዓላማዎች", icon: BookOpen },
  { href: "/organization", title: "መዋቅር", desc: "ድርጅት", icon: Users },
  { href: "/departments", title: "ክፍሎች", desc: "አገልግሎት", icon: Building2 },
  { href: "/services", title: "አገልግሎቶች", desc: "ማመልከቻ", icon: HandHeart },
  { href: "/search", title: "ፍለጋ", desc: "ፈልግ", icon: Search },
];

export default function HomePage() {
  return (
    <div className="bg-cross-pattern overflow-x-hidden pb-20 lg:pb-0">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-burgundy-950)] via-[var(--color-burgundy-900)] to-[var(--color-charcoal)]" />
        <motion.div
          className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-[var(--color-gold-500)]/15 blur-3xl"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <div className="relative mx-auto max-w-7xl px-4 pt-8 pb-10 sm:px-6 sm:pt-14 sm:pb-16 lg:px-8">
          <FadeIn>
            <div className="flex items-start gap-3">
              <div className="mt-1 hidden sm:block">
                <EthiopianCross size={48} gold animate />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium tracking-wide text-[var(--color-gold-300)] amharic sm:text-sm">
                  {DOCUMENT_META.church_am}
                </p>
                <h1 className="mt-1 text-[1.35rem] font-bold leading-snug text-white amharic sm:text-3xl sm:leading-tight">
                  {DOCUMENT_META.organization_am}
                </h1>
                <p className="mt-2 text-sm text-white/70 amharic max-w-xl leading-relaxed">
                  የውስጥ መተዳደሪያ ሕግና ደንብ — ዲጂታል መድረክ
                </p>
              </div>
            </div>
          </FadeIn>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:max-w-md">
            {primaryActions.map((a) => {
              const Icon = a.icon;
              return (
                <Link
                  key={a.href}
                  href={a.href}
                  className={
                    a.tone === "primary"
                      ? "flex items-center gap-3 rounded-2xl bg-white px-4 py-3.5 shadow-lg active:scale-[0.98] transition"
                      : "flex items-center gap-3 rounded-2xl bg-[var(--color-gold-500)] px-4 py-3.5 shadow-lg active:scale-[0.98] transition"
                  }
                >
                  <span
                    className={
                      a.tone === "primary"
                        ? "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]"
                        : "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black/10 text-[var(--color-charcoal)]"
                    }
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span
                      className={
                        a.tone === "primary"
                          ? "block text-sm font-bold amharic text-[var(--primary)]"
                          : "block text-sm font-bold amharic text-[var(--color-charcoal)]"
                      }
                    >
                      {a.title}
                    </span>
                    <span className="block text-[11px] text-black/50 amharic">
                      {a.desc}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 -mt-2 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-3 shadow-sm sm:p-5">
          <div className="mb-3 flex items-center justify-between px-1">
            <h2 className="text-sm font-bold amharic text-[var(--foreground)]">
              ፈጣን አገናኞች
            </h2>
            <Link
              href="/more"
              className="text-xs font-medium text-[var(--primary)] amharic"
            >
              ሁሉም →
            </Link>
          </div>
          <StaggerChildren className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
            {quickGrid.map((item) => {
              const Icon = item.icon;
              return (
                <StaggerItem key={item.href}>
                  <Link
                    href={item.href}
                    className="flex flex-col items-start gap-2 rounded-2xl bg-[var(--muted)]/60 px-3.5 py-3.5 active:scale-[0.97] transition min-h-[5.5rem]"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
                      <Icon className="h-[18px] w-[18px]" />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold amharic text-[var(--foreground)] leading-tight">
                        {item.title}
                      </span>
                      <span className="block text-[11px] text-[var(--foreground)]/50 amharic mt-0.5">
                        {item.desc}
                      </span>
                    </span>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerChildren>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold amharic text-[var(--primary)] sm:text-xl">
              ክፍሎች
            </h2>
            <p className="text-xs text-[var(--foreground)]/55 amharic mt-0.5">
              የሰንበት ት/ቤት አደረጃጀት
            </p>
          </div>
          <Link
            href="/departments"
            className="flex items-center gap-0.5 text-xs font-semibold text-[var(--primary)] amharic shrink-0"
          >
            ሁሉም <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory scrollbar-none sm:grid sm:grid-cols-3 sm:overflow-visible sm:mx-0 sm:px-0">
          {DEPARTMENTS.slice(0, 6).map((d) => (
            <Link
              key={d.slug}
              href={`/departments/${d.slug}`}
              className="snap-start shrink-0 w-[72%] sm:w-auto rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 active:scale-[0.98] transition shadow-sm"
            >
              <span className="text-[var(--color-gold-500)] text-sm">✦</span>
              <h3 className="mt-1 font-semibold amharic text-[var(--primary)] text-sm leading-snug">
                {d.title_am}
              </h3>
              {d.title_en && (
                <p className="mt-1 text-xs text-[var(--foreground)]/55 line-clamp-2">
                  {d.title_en}
                </p>
              )}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--color-burgundy-950)] to-[var(--color-burgundy-800)] px-5 py-8 text-center sm:px-10 sm:py-10">
          <div className="absolute top-3 left-1/2 -translate-x-1/2 opacity-20">
            <EthiopianCross size={80} animate={false} gold />
          </div>
          <div className="relative">
            <h2 className="text-lg font-bold text-white amharic sm:text-2xl">
              አገልግሎቶችና ማመልከቻ
            </h2>
            <p className="mt-2 text-sm text-white/70 amharic max-w-md mx-auto">
              የአባልነት ማመልከቻ፣ የሰርግ አጃቢ ጥያቄ
            </p>
            <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:justify-center sm:gap-3">
              <Link
                href="/services/membership"
                className="rounded-2xl bg-[var(--color-gold-500)] px-5 py-3.5 text-sm font-bold text-[var(--color-charcoal)] active:scale-[0.98] transition"
              >
                የአባልነት ማመልከቻ
              </Link>
              <Link
                href="/services/wedding"
                className="rounded-2xl border border-white/25 px-5 py-3.5 text-sm font-semibold text-white active:bg-white/10 transition"
              >
                የሰርግ አጃቢ ጥያቄ
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
