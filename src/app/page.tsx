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
} from "lucide-react";
import { DOCUMENT_META, DEPARTMENTS } from "@/data/regulations";
import { EthiopianCross } from "@/components/orthodox/EthiopianCross";
import { OrnamentFrame } from "@/components/orthodox/OrnamentFrame";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/motion/FadeIn";
import { TiltCard } from "@/components/motion/TiltCard";
import { motion } from "framer-motion";

const quickCards = [
  { href: "/about", title: "መግቢያ", desc: "ታሪክና አመሠራረት", icon: Church },
  { href: "/vision", title: "ርእይ", desc: "የሰንበት ት/ቤቱ ርእይ", icon: Sparkles },
  { href: "/mission", title: "ተልዕኮ", desc: "የሰንበት ት/ቤቱ ተልዕኮ", icon: Heart },
  { href: "/objectives", title: "ዓላማ", desc: "አጠቃላይ ዓላማዎች", icon: BookOpen },
  { href: "/organization", title: "መዋቅር", desc: "የድርጅት መዋቅር", icon: Users },
  { href: "/membership/rights", title: "መብት", desc: "የአገልጋይ መብት", icon: BookOpen },
  { href: "/membership/responsibilities", title: "ግዴታ", desc: "የአገልጋይ ግዴታ", icon: BookOpen },
  { href: "/programs", title: "መርሐግብራት", desc: "በሰንበት ት/ቤቱ ስር ያሉ", icon: Sparkles },
];

export default function HomePage() {
  return (
    <div className="bg-cross-pattern overflow-x-hidden">
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-burgundy-950)] via-[var(--color-burgundy-900)] to-[var(--color-charcoal)]" />
        <motion.div
          className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-[var(--color-gold-500)]/10 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_auto] gap-10 items-center">
            <div className="max-w-3xl">
              <FadeIn>
                <p className="text-sm font-medium tracking-wide text-[var(--color-gold-300)] mb-3 amharic">
                  {DOCUMENT_META.church_am} · {DOCUMENT_META.diocese_am}
                </p>
              </FadeIn>
              <FadeIn delay={0.1}>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white amharic leading-tight">
                  {DOCUMENT_META.organization_am}
                </h1>
              </FadeIn>
              <FadeIn delay={0.2}>
                <p className="mt-4 text-xl text-[var(--color-gold-200)] amharic flex items-center gap-2">
                  <span className="inline-block h-px w-8 bg-[var(--color-gold-400)]" />
                  የውስጥ መተዳደሪያ ሕግና ደንብ
                </p>
              </FadeIn>
              <FadeIn delay={0.3}>
                <p className="mt-6 text-base text-white/80 leading-relaxed max-w-2xl amharic">
                  ይህ ድረ-ገጽ የማኅተመ ክርስቶስ ሰንበት ት/ቤት የውስጥ መተዳደሪያ ሕግና ደንብን በዲጂታል
                  መልክ ያቀርባል። ሙሉ ሰነዱን ማንበብ፣ መፈለግ እና ማውረድ ይቻላል።
                </p>
              </FadeIn>
              <FadeIn delay={0.4}>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/rules"
                    className="group inline-flex items-center gap-2 rounded-xl bg-[var(--color-gold-500)] px-5 py-3 text-sm font-semibold text-[var(--color-charcoal)] shadow-lg transition hover:bg-[var(--color-gold-400)]"
                  >
                    <BookOpen className="h-4 w-4" />
                    ሕግና ደንብ ያንብቡ
                    <ChevronRight className="h-4 w-4 opacity-60" />
                  </Link>
                  <Link
                    href="/pdf"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/5 px-5 py-3 text-sm font-medium text-white backdrop-blur transition hover:bg-white/15"
                  >
                    <Download className="h-4 w-4" />
                    PDF ያውርዱ
                  </Link>
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-gold-400)]/40 px-5 py-3 text-sm font-medium text-[var(--color-gold-200)] transition hover:bg-[var(--color-gold-500)]/10"
                  >
                    አገልግሎቶች
                  </Link>
                </div>
              </FadeIn>
            </div>
            <FadeIn delay={0.25} direction="left" className="hidden lg:flex justify-center">
              <OrnamentFrame className="p-1">
                <div className="flex flex-col items-center justify-center gap-3 px-10 py-12 bg-gradient-to-b from-[var(--color-burgundy-950)] to-[var(--color-charcoal)]">
                  <EthiopianCross size={96} />
                  <p className="text-[var(--color-gold-300)] text-sm amharic font-medium">ማኅተመ ክርስቶስ</p>
                  <p className="text-white/50 text-xs">ሰኔ 30/2016 ዓ.ም.</p>
                </div>
              </OrnamentFrame>
            </FadeIn>
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-transparent via-[var(--color-gold-500)] to-transparent" />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="flex items-center gap-3 mb-8">
            <EthiopianCross size={28} animate={false} />
            <div>
              <h2 className="text-2xl font-bold text-[var(--primary)] amharic">ፈጣን መዳረሻ</h2>
              <p className="text-sm text-[var(--foreground)]/60">ከሕግና ደንቡ የተወሰዱ ዋና ክፍሎች</p>
            </div>
          </div>
        </FadeIn>
        <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickCards.map((card) => {
            const Icon = card.icon;
            return (
              <StaggerItem key={card.href}>
                <Link href={card.href} className="block h-full">
                  <TiltCard className="h-full cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-burgundy-50)] text-[var(--primary)]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold amharic text-[var(--primary)]">{card.title}</h3>
                        <p className="mt-1 text-sm text-[var(--foreground)]/60 amharic">{card.desc}</p>
                      </div>
                    </div>
                  </TiltCard>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerChildren>
      </section>

      <section className="border-t border-[var(--border)] bg-[var(--muted)]/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="flex items-end justify-between mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[var(--primary)] amharic">ክፍለ ግብረ አገልግሎት</h2>
                <p className="text-sm text-[var(--foreground)]/60 amharic mt-1">በሰንበት ት/ቤቱ ስር ያሉ ክፍሎች</p>
              </div>
              <Link href="/departments" className="text-sm font-medium text-[var(--primary)] hover:underline inline-flex items-center gap-1">
                ሁሉንም ይመልከቱ <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </FadeIn>
          <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DEPARTMENTS.slice(0, 6).map((d) => (
              <StaggerItem key={d.slug}>
                <Link href={`/departments/${d.slug}`}>
                  <OrnamentFrame className="h-full transition hover:scale-[1.02]">
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[var(--color-gold-500)]">✦</span>
                        <h3 className="font-semibold amharic text-[var(--primary)]">{d.title_am}</h3>
                      </div>
                      <p className="text-sm text-[var(--foreground)]/65 line-clamp-2">{d.title_en}</p>
                    </div>
                  </OrnamentFrame>
                </Link>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <FadeIn>
          <OrnamentFrame>
            <div className="relative overflow-hidden px-6 py-12 sm:px-12 text-center bg-gradient-to-br from-[var(--color-burgundy-950)] to-[var(--color-burgundy-800)]">
              <div className="relative">
                <h2 className="text-2xl sm:text-3xl font-bold text-white amharic">አገልግሎቶችና ማመልከቻ</h2>
                <p className="mt-3 text-white/75 amharic max-w-xl mx-auto">
                  የአባልነት ማመልከቻ፣ የሰርግ አጃቢ ጥያቄ እና ሌሎች የሰንበት ት/ቤት አገልግሎቶች
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Link href="/services/membership" className="rounded-xl bg-[var(--color-gold-500)] px-5 py-3 text-sm font-semibold text-[var(--color-charcoal)] hover:bg-[var(--color-gold-400)] transition">
                    የአባልነት ማመልከቻ
                  </Link>
                  <Link href="/services/wedding" className="rounded-xl border border-white/30 px-5 py-3 text-sm font-medium text-white hover:bg-white/10 transition">
                    የሰርግ አጃቢ ጥያቄ
                  </Link>
                </div>
              </div>
            </div>
          </OrnamentFrame>
        </FadeIn>
      </section>
    </div>
  );
}
