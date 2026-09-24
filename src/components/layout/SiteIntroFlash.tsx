"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { churchFront } from "@/data/church-photos";
import { DOCUMENT_META } from "@/data/regulations";

const AUTO_MS = 4200;

export function SiteIntroFlash() {
  const [visible, setVisible] = useState(true);
  const [phase, setPhase] = useState(0); // 0 cross, 1 titles, 2 ready to exit

  const dismiss = useCallback(() => {
    setVisible(false);
  }, []);

  useEffect(() => {
    // Always show intro on every load / refresh
    setVisible(true);
    setPhase(0);

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const t1 = window.setTimeout(() => setPhase(1), 500);
    const t2 = window.setTimeout(() => setPhase(2), 1800);
    const t3 = window.setTimeout(() => dismiss(), AUTO_MS);

    return () => {
      document.body.style.overflow = prev;
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [dismiss]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro-flash"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.04,
            transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
          }}
          role="dialog"
          aria-label="Site introduction"
          onClick={dismiss}
        >
          {/* Hero background */}
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 4.2, ease: "easeOut" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={churchFront}
              alt=""
              className="h-full w-full object-cover object-[center_40%]"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-[var(--color-burgundy-950)]/75" />
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-burgundy-950)]/40 via-transparent to-[var(--color-burgundy-950)]/90" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,_rgba(201,145,47,0.22),_transparent_60%)]" />
          </motion.div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center px-6 text-center max-w-lg">
            <motion.div
              initial={{ opacity: 0, scale: 0.4, rotate: -12 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.1 }}
              className="relative mb-6"
            >
              <motion.div
                className="absolute -inset-6 rounded-full bg-[var(--color-gold-400)]/30 blur-2xl"
                animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.75, 0.4] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              />
              <svg
                viewBox="0 0 64 80"
                className="relative h-16 w-12 text-[var(--color-gold-400)] drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)] sm:h-20 sm:w-14"
                fill="currentColor"
                aria-hidden
              >
                <rect x="28" y="4" width="8" height="72" rx="1" />
                <rect x="10" y="22" width="44" height="8" rx="1" />
                <rect x="18" y="38" width="28" height="6" rx="1" />
                <circle cx="32" cy="12" r="5" className="text-[var(--color-gold-300)]" />
              </svg>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-300)] amharic sm:text-xs">
                {DOCUMENT_META.church_am}
              </p>
              <h1 className="mt-2 text-xl font-bold leading-snug text-white amharic drop-shadow-lg sm:text-2xl md:text-3xl">
                {DOCUMENT_META.organization_am}
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4"
            >
              <p className="text-[11px] font-medium tracking-wide text-[var(--color-gold-200)]/95 sm:text-sm">
                Debre Selam Beale Egziabher Church
              </p>
              <p className="mt-1 text-sm font-semibold text-white/90 sm:text-base">
                Makhteme Kristos Sunday School
              </p>
              <p className="mt-2 text-[11px] text-white/60 sm:text-xs">
                Bahir Dar Diocese · Ethiopian Orthodox Tewahedo
              </p>
            </motion.div>

            <motion.div
              className="mt-6 h-px w-16 bg-gradient-to-r from-transparent via-[var(--color-gold-400)] to-transparent"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={phase >= 1 ? { scaleX: 1, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
            />

            <motion.p
              className="mt-5 text-xs text-white/75 amharic sm:text-sm"
              initial={{ opacity: 0 }}
              animate={phase >= 2 ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              እንኳን ደህና መጡ · Welcome
            </motion.p>

            <motion.button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                dismiss();
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-8 rounded-full border border-white/25 bg-white/10 px-5 py-2 text-[11px] font-medium text-white/90 backdrop-blur-sm transition hover:bg-white/20 amharic sm:text-xs"
            >
              ጀምር · Enter
            </motion.button>
          </div>

          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 origin-left bg-[var(--color-gold-400)]"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: AUTO_MS / 1000, ease: "linear" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
