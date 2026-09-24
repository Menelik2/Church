"use client";

import Link from "next/link";
import {
  BookOpen,
  ChevronRight,
  Users,
  Church,
  Heart,
  Building2,
  HandHeart,
  ArrowRight,
  Calendar,
  Search,
  FileText,
  Eye,
  Target,
  Clock,
  MapPin,
  Megaphone,
} from "lucide-react";
import { DOCUMENT_META, DEPARTMENTS } from "@/data/regulations";
import { PROGRAMS } from "@/data/programs";
import { EthiopianCross } from "@/components/orthodox/EthiopianCross";
import { FadeIn } from "@/components/motion/FadeIn";
import { RippleLink } from "@/components/ui/Ripple";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { churchFront, churchAerial, christIcon } from "@/data/church-photos";

const primaryActions = [
  { href: "/about", title: "ስለ ቤተ ክርስቲያን", desc: "ታሪክና አገልግሎት", icon: Church, tone: "primary" as const },
  { href: "/services", title: "አገልግሎቶች", desc: "አባልነት · ሰርግ", icon: HandHeart, tone: "gold" as const },
  { href: "/events", title: "ዝግጅቶች", desc: "መርሐግብርና በዓላት", icon: Calendar, tone: "primary" as const },
  { href: "/search", title: "ፈልግ", desc: "ሕግ · መረጃ", icon: Search, tone: "gold" as const },
];

const stats = [
  { label: "ክፍሎች", value: String(DEPARTMENTS.length), icon: Building2 },
  { label: "መርሐግብራት", value: String(PROGRAMS.length), icon: BookOpen },
  { label: "አገልግሎት", value: "24/7", icon: Heart },
  { label: "አባላት", value: "∞", icon: Users },
];

const serviceTimes = [
  { day: "ሰንበት", time: "ጥዋት 6:00 – 12:00", note: "ቅዳሴ · ሰንበት ት/ቤት" },
  { day: "ረቡዕ", time: "ማታ 5:00 – 7:00", note: "ጸሎትና ምክር" },
  { day: "ዓርብ", time: "ማታ 5:00 – 7:00", note: "የወጣቶች ስብሰባ" },
];

export type HomeAnnouncement = {
  id: string;
  title_am: string;
  body_am: string;
  slug: string;
  image_url?: string | null;
  is_featured: boolean;
  published_at: string | null;
  created_at: string;
};

export function HomePageClient({
  announcements = [],
}: {
  announcements?: HomeAnnouncement[];
}) {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.25]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const iconFloat = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <div className="bg-cross-pattern overflow-x-hidden pb-28 lg:pb-0">
      <section ref={heroRef} className="relative min-h-[92svh] sm:min-h-[85vh] overflow-hidden">
        <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0 will-change-transform">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={churchFront} alt="ደብረ ሰላም በዓለ እግዚአብሔር ቤተ ክርስቲያን" className="h-full w-full object-cover object-[center_42%]" fetchPriority="high" />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-burgundy-950)]/55 via-[var(--color-burgundy-900)]/35 to-[var(--color-burgundy-950)]/88" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_15%,_rgba(201,145,47,0.28),_transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_75%,_rgba(68,11,28,0.55),_transparent_50%)]" />
          <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.35)]" />
        </motion.div>

        <motion.div style={{ y: iconFloat }} className="pointer-events-none absolute right-2 top-[max(4.75rem,env(safe-area-inset-top)+4rem)] z-20 sm:pointer-events-auto sm:right-8 sm:top-28" initial={{ opacity: 0, scale: 0.55, rotate: -8 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 90, damping: 14, delay: 0.35 }}>
          <motion.div className="relative" whileHover={{ scale: 1.06, rotate: 2 }} transition={{ type: "spring", stiffness: 260, damping: 18 }}>
            <motion.div className="absolute -inset-4 rounded-full bg-[var(--color-gold-400)]/35 blur-2xl" animate={{ scale: [1, 1.2, 1], opacity: [0.45, 0.8, 0.45] }} transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }} />
            <div className="relative overflow-hidden rounded-2xl border-[2.5px] border-[var(--color-gold-400)] shadow-[0_12px_40px_rgba(0,0,0,0.45)] ring-2 ring-[var(--color-gold-300)]/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={christIcon} alt="ኢየሱስ ክርስቶስ" className="h-14 w-14 object-cover object-top sm:h-28 sm:w-28" />
            </div>
          </motion.div>
        </motion.div>

        <motion.div style={{ opacity: heroOpacity, y: contentY }} className="relative z-10 mx-auto flex min-h-[92svh] max-w-7xl flex-col justify-end px-4 pb-12 pt-14 sm:min-h-[85vh] sm:px-6 sm:pb-20 sm:pt-16 lg:px-8">
          <FadeIn>
            <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
              <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 130, damping: 12 }} className="mb-3 sm:mb-4">
                <EthiopianCross size={48} gold animate />
              </motion.div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-300)] amharic sm:text-xs sm:tracking-[0.12em]">{DOCUMENT_META.church_am}</p>
              <h1 className="mt-2 max-w-[18ch] pr-16 text-[1.65rem] font-bold leading-[1.28] text-white amharic drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)] sm:max-w-xl sm:pr-0 sm:text-4xl sm:leading-tight lg:text-[2.75rem]">{DOCUMENT_META.organization_am}</h1>
              <p className="mt-3 max-w-md text-[13px] leading-relaxed text-white/90 amharic sm:text-base">የባሕር ዳር ሀገረ ስብከት · ኦፊሴላዊ የቤተ ክርስቲያን እና የሰንበት ት/ቤት ድረ-ገጽ</p>
              <p className="mt-1 text-[11px] text-[var(--color-gold-200)]/90 amharic sm:text-sm">አገልግሎት · ዝግጅት · ክፍሎች · አባልነት</p>
            </div>
          </FadeIn>

          <div className="mt-6 grid grid-cols-2 gap-2.5 sm:mt-9 sm:max-w-xl sm:gap-3">
            {primaryActions.map((a, i) => {
              const Icon = a.icon;
              return (
                <motion.div key={a.href} initial={{ y: 32, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.28 + i * 0.1, type: "spring", stiffness: 150, damping: 16 }} whileTap={{ scale: 0.96 }} whileHover={{ y: -4 }}>
                  <RippleLink href={a.href} color={a.tone === "primary" ? "primary" : "dark"} className={a.tone === "primary" ? "flex min-h-[3.5rem] items-center gap-2.5 rounded-2xl bg-white/95 px-3 py-3 sm:min-h-[3.75rem] sm:gap-3 sm:px-4 sm:py-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.28)] backdrop-blur-md border border-white/50 transition hover-lift" : "flex min-h-[3.5rem] items-center gap-2.5 rounded-2xl bg-[var(--color-gold-500)] px-3 py-3 sm:min-h-[3.75rem] sm:gap-3 sm:px-4 sm:py-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.28)] border border-[var(--color-gold-300)] transition hover-lift"}>
                    <span className={a.tone === "primary" ? "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/12 text-[var(--primary)]" : "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-black/10 text-[var(--color-charcoal)]"}>
                      <Icon className="h-5 w-5" strokeWidth={2.2} />
                    </span>
                    <span className="min-w-0 text-left">
                      <span className={a.tone === "primary" ? "block text-[13px] font-bold leading-tight amharic text-[var(--primary)] sm:text-sm" : "block text-[13px] font-bold leading-tight amharic text-[var(--color-charcoal)] sm:text-sm"}>{a.title}</span>
                      <span className="mt-0.5 block text-[10px] text-black/50 amharic sm:text-[11px]">{a.desc}</span>
                    </span>
                  </RippleLink>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 z-10 leading-[0]">
          <svg viewBox="0 0 1440 56" className="h-9 w-full text-[var(--background)] fill-current sm:h-11" preserveAspectRatio="none">
            <path d="M0,28 C180,48 360,8 540,22 C720,36 900,52 1080,28 C1260,4 1350,18 1440,32 L1440,56 L0,56 Z" />
          </svg>
        </div>
      </section>

      <section className="relative z-10 -mt-1 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5 sm:gap-3.5">
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ type: "spring", stiffness: 120, damping: 18 }} className="col-span-2 relative h-40 overflow-hidden rounded-2xl border border-[var(--color-gold-300)]/35 shadow-lg sm:col-span-3 sm:h-52 sm:rounded-3xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={churchAerial} alt="የቤተ ክርስቲያን አየር እይታ" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                <p className="text-[11px] font-semibold text-white amharic sm:text-sm">ቤተ ክርስቲያን</p>
                <p className="mt-0.5 text-[10px] text-white/70 amharic">ደብረ ሰላም በዓለ እግዚአብሔር</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ delay: 0.1, type: "spring", stiffness: 120, damping: 18 }} className="col-span-2 relative h-40 overflow-hidden rounded-2xl border border-[var(--color-gold-400)]/45 shadow-lg sm:col-span-2 sm:h-52 sm:rounded-3xl">
              <div className="absolute inset-0 bg-[var(--color-burgundy-900)]" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={christIcon} alt="ኢየሱስ ክርስቶስ" className="relative h-full w-full object-cover object-top" />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-burgundy-950)]/70 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-0 right-0 text-center">
                <p className="text-[10px] font-medium text-[var(--color-gold-200)] amharic sm:text-xs">ኢየሱስ ክርስቶስ</p>
              </div>
            </motion.div>
          </div>
          <p className="mt-3 text-center text-[10px] tracking-wide text-[var(--foreground)]/40 amharic sm:text-[11px]">ኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን · ባሕር ዳር ሀገረ ስብከት</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 sm:pt-10 lg:px-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, type: "spring", stiffness: 140, damping: 18 }} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-4 text-center shadow-sm">
                <Icon className="mx-auto h-5 w-5 text-[var(--color-gold-600)]" strokeWidth={2} />
                <p className="mt-2 text-xl font-bold tabular-nums text-[var(--primary)] sm:text-2xl">{s.value}</p>
                <p className="mt-0.5 text-[11px] font-medium text-[var(--foreground)]/55 amharic">{s.label}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {announcements.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 sm:pt-12 lg:px-8">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold amharic text-[var(--primary)] sm:text-xl">ወቅታዊ ጉዳዮች</h2>
              <p className="mt-0.5 text-xs text-[var(--foreground)]/55 amharic">ከአስተዳደር የወጡ ማስታወቂያዎችና ዜናዎች</p>
            </div>
            <Link href="/announcements" className="flex shrink-0 items-center gap-0.5 text-xs font-semibold text-[var(--primary)] amharic">ሁሉም <ChevronRight className="h-3.5 w-3.5" /></Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {announcements.slice(0, 6).map((a, i) => (
              <motion.div key={a.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05, type: "spring", stiffness: 140, damping: 18 }}>
                <Link href={`/announcements/${a.slug}`} className="hover-card block h-full overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
                  {a.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={a.image_url} alt="" className="h-36 w-full object-cover" />
                  ) : null}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--primary)]/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--primary)] amharic">
                        <Megaphone className="h-3 w-3" />ወቅታዊ
                      </span>
                      {a.is_featured && <span className="text-[10px] rounded-full bg-[var(--color-gold-100)] text-[var(--color-gold-800)] px-2 py-0.5">ባህሪይ</span>}
                    </div>
                    <h3 className="mt-2.5 text-sm font-semibold leading-snug amharic text-[var(--primary)]">{a.title_am}</h3>
                    <p className="mt-1.5 line-clamp-3 text-[12px] leading-relaxed text-[var(--foreground)]/60 amharic">{a.body_am}</p>
                    <time className="mt-2 block text-[10px] text-[var(--foreground)]/40">{new Date(a.published_at || a.created_at).toLocaleDateString("am-ET")}</time>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 sm:pt-12 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 120, damping: 18 }}>
            <RippleLink href="/vision" color="primary" className="hover-card block h-full rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-6">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]"><Eye className="h-5 w-5" /></span>
              <h2 className="mt-3 text-base font-bold amharic text-[var(--primary)] sm:text-lg">ራዕይ</h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--foreground)]/70 amharic">በክርስቶስ ትምህርት የተመሰረተ፣ በፍቅርና በአንድነት የሚያድግ ማኅበረሰብ መገንባት።</p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[var(--primary)] amharic">ተጨማሪ <ChevronRight className="h-3.5 w-3.5" /></span>
            </RippleLink>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 120, damping: 18 }}>
            <RippleLink href="/mission" color="gold" className="hover-card block h-full rounded-2xl border border-[var(--color-gold-300)]/50 bg-gradient-to-br from-[var(--color-gold-50)] to-[var(--card)] p-5 shadow-sm sm:p-6">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-gold-100)] text-[var(--color-gold-700)]"><Target className="h-5 w-5" /></span>
              <h2 className="mt-3 text-base font-bold amharic text-[var(--color-gold-800)] sm:text-lg">ተልእኮ</h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--foreground)]/70 amharic">ሰንበት ት/ቤት በኩል ትምህርት፣ አገልግሎትና ክርስቲያናዊ ሕይወት ማሳደግ።</p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-gold-700)] amharic">ተጨማሪ <ChevronRight className="h-3.5 w-3.5" /></span>
            </RippleLink>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 sm:pt-12 lg:px-8">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold amharic text-[var(--primary)] sm:text-xl">የአገልግሎት ጊዜ</h2>
            <p className="mt-0.5 text-xs text-[var(--foreground)]/55 amharic">ሳምንታዊ መርሐግብር</p>
          </div>
          <Link href="/contact" className="flex shrink-0 items-center gap-0.5 text-xs font-semibold text-[var(--primary)] amharic">አድራሻ <ChevronRight className="h-3.5 w-3.5" /></Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {serviceTimes.map((t, i) => (
            <motion.div key={t.day} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07, type: "spring", stiffness: 140, damping: 18 }} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]"><Clock className="h-4 w-4" /></span>
                <p className="text-sm font-bold amharic text-[var(--primary)]">{t.day}</p>
              </div>
              <p className="mt-3 text-sm font-semibold tabular-nums">{t.time}</p>
              <p className="mt-1 text-xs text-[var(--foreground)]/55 amharic">{t.note}</p>
            </motion.div>
          ))}
        </div>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-[var(--foreground)]/45 amharic">
          <MapPin className="h-3.5 w-3.5" /> ባሕር ዳር · ደብረ ሰላም በዓለ እግዚአብሔር ቤተ ክርስቲያን
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 sm:pt-12 lg:px-8">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold amharic text-[var(--primary)] sm:text-xl">የአገልግሎት ክፍሎች</h2>
            <p className="mt-0.5 text-xs text-[var(--foreground)]/55 amharic">ሰንበት ት/ቤት ክፍሎች</p>
          </div>
          <Link href="/departments" className="flex shrink-0 items-center gap-0.5 text-xs font-semibold text-[var(--primary)] amharic">ሁሉም <ChevronRight className="h-3.5 w-3.5" /></Link>
        </div>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
          {DEPARTMENTS.slice(0, 10).map((d, i) => (
            <motion.div key={d.slug} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04, type: "spring", stiffness: 140, damping: 18 }}>
              <Link href={`/departments/${d.slug}`} className="hover-card flex h-full flex-col items-center rounded-2xl border border-[var(--border)] bg-[var(--card)] px-3 py-4 text-center shadow-sm">
                <Building2 className="h-5 w-5 text-[var(--color-gold-600)]" />
                <span className="mt-2 text-[12px] font-semibold leading-snug amharic text-[var(--primary)]">{d.title_am}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 sm:pt-12 lg:px-8">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-bold amharic text-[var(--primary)]">ሕግና ደንብ</h2>
          <p className="mt-1 text-sm text-[var(--foreground)]/60 amharic">የውስጥ መተዳደሪያ · አንቀጽ 1–16</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <RippleLink href="/rules" color="primary" className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white">አንቀጾች <ChevronRight className="h-4 w-4" /></RippleLink>
            <RippleLink href="/search" color="dark" className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-medium">ፈልግ</RippleLink>
          </div>
          <RippleLink href="/regulations.pdf" color="dark" className="mt-4 flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--muted)]/40 px-5 py-4">
            <span className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-[var(--primary)]" />
              <span className="text-sm font-semibold amharic text-[var(--foreground)]">ኦፊሴላዊ PDF አውርድ</span>
            </span>
            <ArrowRight className="h-4 w-4 text-[var(--primary)]" />
          </RippleLink>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 100, damping: 18 }} className="relative overflow-hidden rounded-[1.75rem] border border-[var(--color-gold-400)]/30 shadow-xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={churchAerial} alt="" className="absolute inset-0 h-full w-full object-cover scale-105" aria-hidden />
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-burgundy-950)]/92 via-[var(--color-burgundy-900)]/88 to-[var(--color-burgundy-950)]/92" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,_rgba(201,145,47,0.18),_transparent_60%)]" />
          <div className="relative px-5 py-11 text-center sm:px-10 sm:py-14">
            <div className="mx-auto mb-3 flex justify-center"><EthiopianCross size={42} animate={false} gold /></div>
            <h2 className="text-lg font-bold text-white amharic sm:text-2xl">አገልግሎቶችና ማመልከቻ</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-white/75 amharic leading-relaxed">የአባልነት ማመልከቻ፣ የሰርግ አጃቢ ጥያቄ እና ሌሎች አገልግሎቶች</p>
            <div className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:justify-center sm:gap-3">
              <RippleLink href="/services/membership" color="dark" className="inline-flex items-center justify-center rounded-2xl bg-[var(--color-gold-500)] px-6 py-3.5 text-sm font-bold text-[var(--color-charcoal)] shadow-lg transition hover:bg-[var(--color-gold-400)] hover-lift">የአባልነት ማመልከቻ</RippleLink>
              <RippleLink href="/services/wedding" color="light" className="inline-flex items-center justify-center rounded-2xl border border-white/35 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15 hover-lift">የሰርግ አጃቢ ጥያቄ</RippleLink>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
