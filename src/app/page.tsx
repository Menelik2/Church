"use client";

import Link from "next/link";
import Image from "next/image";
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
  Scale,
} from "lucide-react";
import { DOCUMENT_META, DEPARTMENTS } from "@/data/regulations";
import { EthiopianCross } from "@/components/orthodox/EthiopianCross";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/motion/FadeIn";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/** Ethiopian Orthodox / church atmosphere photos (Unsplash — free to use) */
const ORTHODOX_PHOTOS = [
  {
    src: "https://images.unsplash.com/photo-1438032005730-c779502df39b?w=800&q=80",
    alt: "Church interior light",
  },
  {
    src: "https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=800&q=80",
    alt: "Orthodox candles",
  },
  {
    src: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800&q=80",
    alt: "Church architecture",
  },
  {
    src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    alt: "Sacred landscape",
  },
];

const primaryActions = [
  {
    href: "/rules",
    title: "ሕግና ደንብ",
    desc: "አንቀጾች 1–16",
    icon: Scale,
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
  { href: "/about", title: "መግቢያ", desc: "ታሪክ አመጣጥ", icon: Church },
  { href: "/vision", title: "ርእይ", desc: "የሰንበት ት/ቤት ርእይ", icon: Sparkles },
  { href: "/mission", title: "ተልዕኮ", desc: "የሰንበት ት/ቤት ተልዕኮ", icon: Heart },
  { href: "/objectives", title: "ዓላማ", desc: "አጠቃላይ ዓላማዎች", icon: BookOpen },
  { href: "/organization", title: "መዋቅር", desc: "የድርጅት መዋቅር", icon: Users },
  { href: "/departments", title: "ክፍሎች", desc: "አገልግሎት ክፍሎች", icon: Building2 },
  { href: "/services", title: "አገልግሎቶች", desc: "ማመልከቻ", icon: HandHeart },
  { href: "/search", title: "ፍለጋ", desc: "በሕግ ውስጥ ፈልግ", icon: Search },
];

export default function HomePage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.4]);

  return (
    <div className="bg-cross-pattern overflow-x-hidden pb-24 lg:pb-0">
      {/* ── Immersive mobile hero ── */}
      <section ref={heroRef} className="relative min-h-[72vh] sm:min-h-[60vh] overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1438032005730-c779502df39b?w=1400&q=85"
            alt="ቤተ ክርስቲያን"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-burgundy-950)]/85 via-[var(--color-burgundy-900)]/75 to-[var(--color-burgundy-950)]/95" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(201,145,47,0.18),_transparent_55%)]" />
        </motion.div>

        {/* floating gold orbs */}
        <motion.div
          className="absolute top-16 right-6 h-28 w-28 rounded-full bg-[var(--color-gold-500)]/20 blur-3xl"
          animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-24 left-4 h-20 w-20 rounded-full bg-[var(--color-gold-400)]/15 blur-2xl"
          animate={{ scale: [1.1, 0.9, 1.1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 mx-auto flex min-h-[72vh] max-w-7xl flex-col justify-end px-4 pb-10 pt-8 sm:min-h-[60vh] sm:px-6 sm:pb-14 lg:px-8"
        >
          <FadeIn>
            <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 120, damping: 14 }}
                className="mb-4"
              >
                <EthiopianCross size={56} gold animate />
              </motion.div>

              <p className="text-[11px] font-medium tracking-wide text-[var(--color-gold-300)] amharic sm:text-sm">
                {DOCUMENT_META.church_am}
              </p>
              <h1 className="mt-2 max-w-lg text-[1.65rem] font-bold leading-snug text-white amharic sm:text-4xl sm:leading-tight">
                {DOCUMENT_META.organization_am}
              </h1>
              <p className="mt-3 max-w-md text-sm text-white/75 amharic leading-relaxed">
                የውስጥ መተዳደሪያ ሕግና ደንብ — ዲጂታል መድረክ
              </p>
            </div>
          </FadeIn>

          <div className="mt-7 grid grid-cols-2 gap-3 sm:mt-9 sm:max-w-md">
            {primaryActions.map((a, i) => {
              const Icon = a.icon;
              return (
                <motion.div
                  key={a.href}
                  initial={{ y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.08, type: "spring", stiffness: 160 }}
                  whileTap={{ scale: 0.96 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <Link
                    href={a.href}
                    className={
                      a.tone === "primary"
                        ? "flex items-center gap-3 rounded-2xl bg-white px-4 py-4 shadow-xl shadow-black/20"
                        : "flex items-center gap-3 rounded-2xl bg-[var(--color-gold-500)] px-4 py-4 shadow-xl shadow-black/20"
                    }
                  >
                    <span
                      className={
                        a.tone === "primary"
                          ? "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/12 text-[var(--primary)]"
                          : "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-black/10 text-[var(--color-charcoal)]"
                      }
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 text-left">
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
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* ── Orthodox photo strip ── */}
      <section className="relative z-10 -mt-4 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex gap-2.5 overflow-x-auto pb-1 snap-x snap-mandatory scrollbar-none -mx-1 px-1">
            {ORTHODOX_PHOTOS.map((photo, i) => (
              <motion.div
                key={photo.src}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ y: -4 }}
                className="relative h-28 w-[42%] shrink-0 snap-start overflow-hidden rounded-2xl border border-white/20 shadow-md sm:h-36 sm:w-48"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 42vw, 192px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </motion.div>
            ))}
          </div>
          <p className="mt-2 text-center text-[10px] text-[var(--foreground)]/40 amharic">
            ኢትዮጵያ ኦርቶዶክስ ተዋሕዶ — መንፈሳዊ ቅርስ
          </p>
        </div>
      </section>

      {/* ── Quick links — large mobile cards ── */}
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <div className="mb-3 flex items-center justify-between px-0.5">
          <h2 className="text-base font-bold amharic text-[var(--foreground)]">
            ፈጣን አገናኞች
          </h2>
          <Link href="/more" className="text-xs font-medium text-[var(--primary)] amharic">
            ሁሉም →
          </Link>
        </div>
        <StaggerChildren className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
          {quickGrid.map((item) => {
            const Icon = item.icon;
            return (
              <StaggerItem key={item.href}>
                <Link
                  href={item.href}
                  className="group relative flex min-h-[6.25rem] flex-col justify-between overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3.5 shadow-sm active:scale-[0.97] transition-transform"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] transition group-active:bg-[var(--primary)] group-active:text-white">
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <span className="mt-2">
                    <span className="block text-[13px] font-bold amharic text-[var(--foreground)] leading-tight">
                      {item.title}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-[var(--foreground)]/50 amharic leading-snug line-clamp-1">
                      {item.desc}
                    </span>
                  </span>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerChildren>
      </section>

      {/* ── Departments horizontal ── */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
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
        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 snap-x snap-mandatory scrollbar-none sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0">
          {DEPARTMENTS.slice(0, 6).map((d, i) => (
            <motion.div
              key={d.slug}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="w-[75%] shrink-0 snap-start sm:w-auto"
            >
              <Link
                href={`/departments/${d.slug}`}
                className="block h-full rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm active:scale-[0.98] transition"
              >
                <span className="text-sm text-[var(--color-gold-500)]">✦</span>
                <h3 className="mt-1 text-sm font-semibold leading-snug amharic text-[var(--primary)]">
                  {d.title_am}
                </h3>
                {d.title_en && (
                  <p className="mt-1 line-clamp-2 text-xs text-[var(--foreground)]/55">
                    {d.title_en}
                  </p>
                )}
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--color-burgundy-950)] to-[var(--color-burgundy-800)] px-5 py-9 text-center sm:px-10 sm:py-12">
          <div className="absolute inset-0 opacity-30">
            <Image
              src="https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=1000&q=70"
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-[var(--color-burgundy-950)]/80" />
          </div>
          <div className="relative">
            <div className="mx-auto mb-3 flex justify-center opacity-80">
              <EthiopianCross size={40} animate={false} gold />
            </div>
            <h2 className="text-lg font-bold text-white amharic sm:text-2xl">
              አገልግሎቶችና ማመልከቻ
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-white/70 amharic">
              የአባልነት ማመልከቻ፣ የሰርግ አጃቢ ጥያቄ
            </p>
            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center sm:gap-3">
              <Link
                href="/services/membership"
                className="rounded-2xl bg-[var(--color-gold-500)] px-5 py-3.5 text-sm font-bold text-[var(--color-charcoal)] active:scale-[0.98] transition"
              >
                የአባልነት ማመልከቻ
              </Link>
              <Link
                href="/services/wedding"
                className="rounded-2xl border border-white/30 px-5 py-3.5 text-sm font-semibold text-white active:bg-white/10 transition"
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
