"use client";

import { useEffect } from "react";
import { formatAppError } from "@/lib/errors";
import { AlertTriangle } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[admin error]", error);
  }, [error]);

  const e = formatAppError(error);

  return (
    <div className="min-h-[50vh] flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <AlertTriangle className="h-10 w-10 text-red-600 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-red-900 amharic">
          {e.messageAm}
        </h2>
        {e.messageEn && (
          <p className="mt-1 text-sm text-red-800/80">{e.messageEn}</p>
        )}
        {e.hintAm && (
          <p className="mt-3 text-xs text-red-800 amharic">{e.hintAm}</p>
        )}
        {(e.code || e.detail || error.digest) && (
          <details className="mt-4 text-left">
            <summary className="text-[11px] text-red-700 cursor-pointer">
              ቴክኒካል ዝርዝር
            </summary>
            <pre className="mt-2 text-[10px] text-red-800/70 whitespace-pre-wrap break-all font-mono">
              {e.code ? `code: ${e.code}\n` : ""}
              {error.digest ? `digest: ${error.digest}\n` : ""}
              {e.detail || error.message}
            </pre>
          </details>
        )}
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-medium text-white"
        >
          እንደገና ሞክር
        </button>
      </div>
    </div>
  );
}
