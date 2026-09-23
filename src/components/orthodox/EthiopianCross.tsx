"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  size?: number;
  animate?: boolean;
  gold?: boolean;
};

/** Ethiopian Orthodox cross (ጠልሰም) motif */
export function EthiopianCross({
  className,
  size = 48,
  animate = true,
  gold = true,
}: Props) {
  const stroke = gold ? "var(--color-gold-400)" : "var(--color-burgundy-200)";
  const fill = gold ? "var(--color-gold-500)" : "var(--color-burgundy-600)";

  const svg = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("drop-shadow-sm", className)}
      aria-hidden
    >
      <path
        d="M32 4 L48 20 L48 44 L32 60 L16 44 L16 20 Z"
        stroke={stroke}
        strokeWidth="1.5"
        fill="none"
        opacity="0.5"
      />
      <rect x="28" y="10" width="8" height="44" rx="1" fill={fill} />
      <rect x="12" y="22" width="40" height="7" rx="1" fill={fill} />
      <rect x="20" y="14" width="24" height="5" rx="1" fill={stroke} />
      <circle cx="32" cy="25.5" r="4" fill={gold ? "var(--color-gold-200)" : "#fff"} opacity="0.9" />
      <circle cx="32" cy="25.5" r="2" fill={fill} />
      <rect x="22" y="50" width="20" height="3" rx="0.5" fill={stroke} />
      <rect x="25" y="54" width="14" height="2.5" rx="0.5" fill={fill} />
    </svg>
  );

  if (!animate) return svg;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6, rotateY: -30 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 14 }}
      style={{ perspective: 600 }}
      className="inline-flex"
    >
      <motion.div
        animate={{ rotateY: [0, 8, 0, -8, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {svg}
      </motion.div>
    </motion.div>
  );
}
