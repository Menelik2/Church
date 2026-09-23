"use client";

import Link from "next/link";
import {
  BookOpen,
  ChevronRight,
  Users,
  Church,
  Heart,
  Sparkles,
  Building2,
  HandHeart,
  Scale,
  ArrowRight,
} from "lucide-react";
import { DOCUMENT_META, DEPARTMENTS } from "@/data/regulations";
import { EthiopianCross } from "@/components/orthodox/EthiopianCross";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/motion/FadeIn";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { churchFront, churchAerial, christIcon } from "@/data/church-photos";

const primaryActions = [
  {
    href: "/about",
    title: "ስለ ቤተ ክርስቲያን",
    desc: "ታሪክና አገልግሎት",
    icon: Church,
    tone: "primary" as const,
  },
  {
    href: "/services",
    title: "አገልግሎቶች",
    desc: "አባልነት · ሰርግ",
    icon: HandHeart,
    tone: "gold" as const,
  },
];

const quickGrid = [
  { href: "/about", title: "ስለ እኛ", desc: "ታሪክና አመጣጥ", icon: Church },
  { href: "/events", title: "ዝግጅቶች", desc: "መርሐግብርና በዓላት", icon: Sparkles },
  { href: "/announcements", title: "ማስታወቂያ", desc: "አዳዲስ መረጃዎች", icon: Heart },
  { href: "/programs", title: "መርሐግብራት", desc: "የሰንበት ት/ቤት", icon: BookOpen },
  { href: "/departments", title: "ክፍሎች", desc: "አገልግሎት ክፍሎች", icon: Building2 },
  { href: "/services", title: "አገልግሎቶች", desc: "ማመልከቻ", icon: HandHeart },
  { href: "/contact", title: "ያግኙን", desc: "አድራሻና መልእክት", icon: Users },
  { href: "/rules", title: "ሕግና ደንብ", desc: "ውስጥ መተዳደሪያ", icon: Scale },
];

export default function HomePage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.25]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const iconFloat = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <div className="bg-cross-pattern overflow-x-hidden pb-28 lg:pb-0">
      <section
        ref={heroRef}
        className="relative min-h-[92svh] sm:min-h-[85vh] overflow-hidden"
      >
        <motion.div
          style={{ y: heroY, scale: heroScale }}
          className="absolute inset-0 will-change-transform"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={churchFront}
            alt="ደብረ ሰላም በዓለ እግዚአብሔር ቤተ ክርስቲያን"
            className="h-full w-full object-cover object-[center_42%]"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-burgundy-950)]/55 via-[var(--color-burgundy-900)]/35 to-[var(--color-burgundy-950)]/88" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_15%,_rgba(201,145,47,0.28),_transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_75%,_rgba(68,11,28,0.55),_transparent_50%)]" />
          <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.35)]" />
        </motion.div>

        <motion.div
          style={{ y: iconFloat }}
          className="absolute right-3 top-[max(5.5rem,env(safe-area-inset-top)+4.5rem)] z-20 sm:right-8 sm:top-28"
          initial={{ opacity: 0, scale: 0.55, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 90, damping: 14, delay: 0.35 }}
        >
          <motion.div
            className="relative"
            whileHover={{ scale: 1.06, rotate: 2 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
          >
            <motion.div
              className="absolute -inset-4 rounded-full bg-[var(--color-gold-400)]/35 blur-2xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.45, 0.8, 0.45] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="relative overflow-hidden rounded-2xl border-[2.5px] border-[var(--color-gold-400)] shadow-[0_12px_40px_rgba(0,0,0,0.45)] ring-2 ring-[var(--color-gold-300)]/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={christIcon}
                alt="ኢየሱስ ክርስቶስ"
                className="h-[4.75rem] w-[4.75rem] object-cover object-top sm:h-28 sm:w-28"
              />
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          style={{ opacity: heroOpacity, y: contentY }}
          className="relative z-10 mx-auto flex min-h-[92svh] max-w-7xl flex-col justify-end px-4 pb-14 pt-16 sm:min-h-[85vh] sm:px-6 sm:pb-20 lg:px-8"
        >
          <FadeIn>
            <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 130, damping: 12 }}
                className="mb-3 sm:mb-4"
              >
                <EthiopianCross size={48} gold animate />
              </motion.div>

              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-300)] amharic sm:text-xs sm:tracking-[0.12em]">
                {DOCUMENT_META.church_am}
              </p>
              <h1 className="mt-2 max-w-[20ch] text-[1.85rem] font-bold leading-[1.25] text-white amharic drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)] sm:max-w-xl sm:text-4xl sm:leading-tight lg:text-[2.75rem]">
                {DOCUMENT_META.organization_am}
              </h1>
              <p className="mt-3 max-w-md text-[13px] leading-relaxed text-white/90 amharic sm:text-base">
                የባሕር ዳር ሀገረ ስብከት · ኦፊሴላዊ የቤተ ክርስቲያን እና የሰንበት ት/ቤት ድረ-ገጽ
              </p>
              <p className="mt-1 text-[11px] text-[var(--color-gold-200)]/90 amharic sm:text-sm">
                አገልግሎት · ዝግጅት · ክፍሎች · አባልነት
              </p>
            </div>
          </FadeIn>

          <div className="mt-7 grid grid-cols-2 gap-3 sm:mt-9 sm:max-w-md">
            {primaryActions.map((a, i) => {
              const Icon = a.icon;
              return (
                <motion.div
                  key={a.href}
                  initial={{ y: 32, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: 0.28 + i * 0.1,
                    type: "spring",
                    stiffness: 150,
                    damping: 16,
                  }}
                  whileTap={{ scale: 0.96 }}
                  whileHover={{ y: -4 }}
                >
                  <Link
                    href={a.href}
                    className={
                      a.tone === "primary"
                        ? "flex min-h-[3.75rem] items-center gap-3 rounded-2xl bg-white/95 px-3.5 py-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.28)] backdrop-blur-md border border-white/50 sm:px-4"
                        : "flex min-h-[3.75rem] items-center gap-3 rounded-2xl bg-[var(--color-gold-500)] px-3.5 py-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.28)] border border-[var(--color-gold-300)] sm:px-4"
                    }
                  >
                    <span
                      className={
                        a.tone === "primary"
                          ? "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/12 text-[var(--primary)]"
                          : "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-black/10 text-[var(--color-charcoal)]"
                      }
                    >
                      <Icon className="h-5 w-5" strokeWidth={2.2} />
                    </span>
                    <span className="min-w-0 text-left">
                      <span
                        className={
                          a.tone === "primary"
                            ? "block text-[13px] font-bold leading-tight amharic text-[var(--primary)] sm:text-sm"
                            : "block text-[13px] font-bold leading-tight amharic text-[var(--color-charcoal)] sm:text-sm"
                        }
                      >
                        {a.title}
                      </span>
                      <span className="mt-0.5 block text-[10px] text-black/50 amharic sm:text-[11px]">
                        {a.desc}
                      </span>
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 z-10 leading-[0]">
          <svg
            viewBox="0 0 1440 56"
            className="h-9 w-full text-[var(--background)] fill-current sm:h-11"
            preserveAspectRatio="none"
          >
            <path d="M0,28 C180,48 360,8 540,22 C720,36 900,52 1080,28 C1260,4 1350,18 1440,32 L1440,56 L0,56 Z" />
          </svg>
        </div>
      </section>

      <section className="relative z-10 -mt-1 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-5 gap-2.5 sm:gap-3.5">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
              className="col-span-3 relative h-40 overflow-hidden rounded-2xl border border-[var(--color-gold-300)]/35 shadow-lg sm:h-52 sm:rounded-3xl"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={churchAerial}
                alt="የቤተ ክርስቲያን አየር እይታ"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                <p className="text-[11px] font-semibold text-white amharic sm:text-sm">
                  ቤተ ክርስቲያን — አየር እይታ
                </p>
                <p className="mt-0.5 text-[10px] text-white/70 amharic">
                  ደብረ ሰላም በዓለ እግዚአብሔር
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: 0.1, type: "spring", stiffness: 120, damping: 18 }}
              className="col-span-2 relative h-40 overflow-hidden rounded-2xl border border-[var(--color-gold-400)]/45 shadow-lg sm:h-52 sm:rounded-3xl"
            >
              <div className="absolute inset-0 bg-[var(--color-burgundy-900)]" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={christIcon}
                alt="ኢየሱስ ክርስቶስ"
                className="relative h-full w-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-burgundy-950)]/70 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-0 right-0 text-center">
                <p className="text-[10px] font-medium text-[var(--color-gold-200)] amharic sm:text-xs">
                  ኢየሱስ ክርስቶስ
                </p>
              </div>
            </motion.div>
          </div>
          <p className="mt-3 text-center text-[10px] tracking-wide text-[var(--foreground)]/40 amharic sm:text-[11px]">
            ኢትዮጵያ ኦርጦዶክስ ተዋሕዶ ቤተ ክርስቲያን · ባሕር ዳር ሀገረ ስብከት
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 sm:pt-10 lg:px-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold amharic text-[var(--foreground)] sm:text-lg">
            ፈጣን አገናኞች
          </h2>
          <Link
            href="/more"
            className="flex items-center gap-0.5 text-xs font-semibold text-[var(--primary)] amharic"
          >
            ሁሉም <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <StaggerChildren className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
          {quickGrid.map((item) => {
            const Icon = item.icon;
            return (
              <StaggerItem key={item.href}>
                <Link
                  href={item.href}
                  className="group relative flex min-h-[7rem] flex-col justify-between overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3.5 shadow-sm transition-all active:scale-[0.97] hover:border-[var(--color-burgundy-300)] hover:shadow-md sm:min-h-[7.5rem] sm:p-4"
                >
                  <span className="absolute -right-5 -top-5 h-20 w-20 rounded-full bg-[var(--primary)]/5 transition group-hover:bg-[var(--primary)]/10" />
                  <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] transition group-active:bg-[var(--primary)] group-active:text-white">
                    <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
                  </span>
                  <span className="relative mt-2.5">
                    <span className="block text-[13px] font-bold leading-tight amharic text-[var(--foreground)] sm:text-sm">
                      {item.title}
                    </span>
                    <span className="mt-0.5 block text-[11px] leading-snug text-[var(--foreground)]/50 amharic line-clamp-1">
                      {item.desc}
                    </span>
                  </span>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerChildren>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold amharic text-[var(--primary)] sm:text-xl">
              ክፍሎች
            </h2>
            <p className="mt-0.5 text-xs text-[var(--foreground)]/55 amharic">
              የሰንበት ት/ቤት አደረጃጀት
            </p>
          </div>
          <Link
            href="/departments"
            className="flex shrink-0 items-center gap-0.5 text-xs font-semibold text-[var(--primary)] amharic"
          >
            ሁሉም <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 snap-x snap-mandatory scrollbar-none sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-3.5 sm:overflow-visible sm:px-0">
          {DEPARTMENTS.slice(0, 6).map((d, i) => (
            <motion.div
              key={d.slug}
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, type: "spring", stiffness: 140, damping: 18 }}
              className="w-[72%] shrink-0 snap-start sm:w-auto"
            >
              <Link
                href={`/departments/${d.slug}`}
                className="block h-full rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm transition active:scale-[0.98] hover:border-[var(--color-gold-400)] hover:shadow-md"
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-gold-100)] text-[var(--color-gold-600)] text-sm">
                  ✦
                </span>
                <h3 className="mt-2.5 text-sm font-semibold leading-snug amharic text-[var(--primary)]">
                  {d.title_am}
                </h3>
                {d.title_en && (
                  <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-[var(--foreground)]/50">
                    {d.title_en}
                  </p>
                )}
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 100, damping: 18 }}
          className="relative overflow-hidden rounded-[1.75rem] border border-[var(--color-gold-400)]/30 shadow-xl"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={churchAerial}
            alt=""
            className="absolute inset-0 h-full w-full object-cover scale-105"
            aria-hidden
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-burgundy-950)]/92 via-[var(--color-burgundy-900)]/88 to-[var(--color-burgundy-950)]/92" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,_rgba(201,145,47,0.18),_transparent_60%)]" />

          <div className="relative px-5 py-11 text-center sm:px-10 sm:py-14">
            <div className="mx-auto mb-3 flex justify-center">
              <EthiopianCross size={42} animate={false} gold />
            </div>
            <h2 className="text-lg font-bold text-white amharic sm:text-2xl">
              አገልግሎቶችና ማመልከቻ
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-white/75 amharic leading-relaxed">
              የአባልነት ማመልከቻ፣ የሰርግ አጃቢ ጥያቄ እና ሌሎች አገልግሎቶች
            </p>
            <div className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:justify-center sm:gap-3">
              <Link
                href="/services/membership"
                className="rounded-2xl bg-[var(--color-gold-500)] px-6 py-3.5 text-sm font-bold text-[var(--color-charcoal)] shadow-lg transition active:scale-[0.98] hover:bg-[var(--color-gold-400)]"
              >
                የአባልነት ማመልከቻ
              </Link>
              <Link
                href="/services/wedding"
                className="rounded-2xl border border-white/35 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition active:bg-white/15 hover:bg-white/15"
              >
                የሰርግ አጃቢ ጥያቄ
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
