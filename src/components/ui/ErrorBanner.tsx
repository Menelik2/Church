"use client";

import { formatAppError, type AppError } from "@/lib/errors";
import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";

export function ErrorBanner({
  error,
  onDismiss,
  className = "",
}: {
  error: unknown;
  onDismiss?: () => void;
  className?: string;
}) {
  const [open, setOpen] = useState(true);
  if (!error || !open) return null;

  const e: AppError =
    typeof error === "object" && error !== null && "messageAm" in error
      ? (error as AppError)
      : formatAppError(error);

  return (
    <div
      role="alert"
      className={`rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/40 dark:border-red-900 px-3 py-3 text-sm ${className}`}
    >
      <div className="flex items-start gap-2">
        <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-red-800 dark:text-red-200 amharic">
            {e.messageAm}
          </p>
          {e.messageEn && (
            <p className="text-xs text-red-700/80 mt-0.5">{e.messageEn}</p>
          )}
          {e.hintAm && (
            <p className="text-xs text-red-700/90 mt-1.5 amharic">{e.hintAm}</p>
          )}
          {(e.code || e.detail) && (
            <details className="mt-2">
              <summary className="text-[11px] text-red-600/80 cursor-pointer select-none">
                ቴክኒካል ዝርዝር
              </summary>
              <pre className="mt-1 text-[10px] leading-relaxed text-red-800/70 whitespace-pre-wrap break-all font-mono">
                {e.code ? `code: ${e.code}\n` : ""}
                {e.detail || ""}
              </pre>
            </details>
          )}
        </div>
        {(onDismiss || true) && (
          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => {
              setOpen(false);
              onDismiss?.();
            }}
            className="text-red-500 hover:text-red-700 p-0.5"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export function SuccessBanner({
  message,
  className = "",
}: {
  message: string;
  className?: string;
}) {
  return (
    <p
      className={`rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800 amharic ${className}`}
    >
      {message}
    </p>
  );
}
