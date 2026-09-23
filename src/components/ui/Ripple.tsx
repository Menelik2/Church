"use client";

import {
  useCallback,
  useState,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type RippleItem = {
  id: number;
  x: number;
  y: number;
  size: number;
};

type ColorVariant = "primary" | "gold" | "light" | "dark";

const RIPPLE_BG: Record<ColorVariant, string> = {
  primary: "rgba(142, 29, 61, 0.28)",
  gold: "rgba(201, 145, 47, 0.35)",
  light: "rgba(255, 255, 255, 0.4)",
  dark: "rgba(0, 0, 0, 0.18)",
};

function useRipple() {
  const [ripples, setRipples] = useState<RippleItem[]>([]);

  const spawn = useCallback((e: PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2.2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const id = Date.now() + Math.random();
    setRipples((prev) => [...prev, { id, x, y, size }]);
    window.setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
  }, []);

  return { ripples, spawn };
}

function RippleLayer({
  ripples,
  color = "primary",
}: {
  ripples: RippleItem[];
  color?: ColorVariant;
}) {
  return (
    <>
      {ripples.map((r) => (
        <span
          key={r.id}
          className="ripple-wave pointer-events-none absolute rounded-full"
          style={
            {
              left: r.x,
              top: r.y,
              width: r.size,
              height: r.size,
              background: RIPPLE_BG[color],
            } as CSSProperties
          }
          aria-hidden
        />
      ))}
    </>
  );
}

type SurfaceProps = {
  className?: string;
  children: ReactNode;
  color?: ColorVariant;
  as?: "button" | "div" | "span";
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  "aria-label"?: string;
};

/** Interactive surface with Material-style ripple (touch + mouse). */
export function RippleSurface({
  className,
  children,
  color = "primary",
  as = "div",
  type = "button",
  onClick,
  disabled,
  "aria-label": ariaLabel,
}: SurfaceProps) {
  const { ripples, spawn } = useRipple();
  const shared = {
    className: cn(
      "ripple-host relative overflow-hidden isolate",
      "transition-[background-color,box-shadow,transform,border-color] duration-200",
      "active:scale-[0.985]",
      className
    ),
    onPointerDown: disabled ? undefined : spawn,
  };

  if (as === "button") {
    return (
      <button
        type={type}
        disabled={disabled}
        aria-label={ariaLabel}
        onClick={onClick}
        {...shared}
      >
        <RippleLayer ripples={ripples} color={color} />
        {children}
      </button>
    );
  }

  const Tag = as;
  return (
    <Tag {...shared} onClick={onClick} aria-label={ariaLabel}>
      <RippleLayer ripples={ripples} color={color} />
      {children}
    </Tag>
  );
}

type LinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
  color?: ColorVariant;
  prefetch?: boolean;
  "aria-label"?: string;
};

/** Next.js Link with touch-friendly ripple + desktop hover-ready host. */
export function RippleLink({
  href,
  className,
  children,
  color = "primary",
  prefetch,
  "aria-label": ariaLabel,
}: LinkProps) {
  const { ripples, spawn } = useRipple();

  return (
    <Link
      href={href}
      prefetch={prefetch}
      aria-label={ariaLabel}
      onPointerDown={spawn}
      className={cn(
        "ripple-host relative overflow-hidden isolate",
        "transition-[background-color,box-shadow,transform,border-color,color] duration-200",
        "active:scale-[0.985]",
        className
      )}
    >
      <RippleLayer ripples={ripples} color={color} />
      {children}
    </Link>
  );
}
