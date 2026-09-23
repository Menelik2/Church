"use client";

import { cn } from "@/lib/utils";

/** Gold-burgundy decorative frame */
export function OrnamentFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative rounded-2xl p-[2px]",
        "bg-gradient-to-br from-[var(--color-gold-400)] via-[var(--color-burgundy-700)] to-[var(--color-gold-600)]",
        "shadow-[0_8px_30px_rgba(122,28,57,0.15)]",
        className
      )}
    >
      <div className="relative rounded-[14px] bg-[var(--card)] overflow-hidden h-full">
        <span className="pointer-events-none absolute top-1 left-1 text-[var(--color-gold-500)]/40 text-lg leading-none">✦</span>
        <span className="pointer-events-none absolute top-1 right-1 text-[var(--color-gold-500)]/40 text-lg leading-none">✦</span>
        <span className="pointer-events-none absolute bottom-1 left-1 text-[var(--color-gold-500)]/40 text-lg leading-none">✦</span>
        <span className="pointer-events-none absolute bottom-1 right-1 text-[var(--color-gold-500)]/40 text-lg leading-none">✦</span>
        {children}
      </div>
    </div>
  );
}
