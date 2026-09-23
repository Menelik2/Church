"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { formatAppError, type AppError } from "@/lib/errors";
import { ErrorBanner } from "@/components/ui/ErrorBanner";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/admin";
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(() => {
    if (errorParam === "inactive") {
      return {
        messageAm: "መለያዎ አልተንቀሳቀሰም",
        messageEn: "Account inactive",
        hintAm: "አስተዳዳሪን ያነጋግሩ ወይም is_active = true ያድርጉ።",
      };
    }
    if (errorParam === "auth") {
      return {
        messageAm: "ማረጋገጫ አልተሳካም",
        messageEn: "Authentication failed",
        hintAm: "እንደገና ይሞክሩ።",
      };
    }
    return null;
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (
        !process.env.NEXT_PUBLIC_SUPABASE_URL ||
        !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ) {
        setError({
          messageAm: "Supabase አልተዋቀረም",
          messageEn: "Missing environment variables",
          hintAm:
            "በVercel ላይ NEXT_PUBLIC_SUPABASE_URL እና NEXT_PUBLIC_SUPABASE_ANON_KEY ያክሉ።",
        });
        return;
      }

      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        const mapped = formatAppError(authError);
        // Friendlier auth messages
        if (
          authError.message?.toLowerCase().includes("invalid login") ||
          authError.message?.toLowerCase().includes("invalid credentials")
        ) {
          setError({
            messageAm: "ኢሜይል ወይም የይለፍ ቃል ትክክል አይደለም",
            messageEn: "Invalid login credentials",
            code: authError.status?.toString(),
            detail: authError.message,
            hintAm: "የይለፍ ቃልዎን በSupabase Auth → Users ላይ ያረጋግጡ።",
          });
        } else {
          setError(mapped);
        }
        return;
      }

      router.push(next);
      router.refresh();
    } catch (err) {
      setError(formatAppError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1.5" htmlFor="email">
          ኢሜይል
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]/40"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5" htmlFor="password">
          የይለፍ ቃል
        </label>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]/40"
        />
      </div>

      {error && (
        <ErrorBanner error={error} onDismiss={() => setError(null)} />
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-[var(--primary)] text-white font-medium py-2.5 text-sm hover:opacity-90 disabled:opacity-50 transition"
      >
        {loading ? "በመግባት ላይ…" : "ግባ"}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
      <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[var(--primary)] amharic">
            የአስተዳዳሪ መግቢያ
          </h1>
          <p className="mt-1 text-sm text-[var(--foreground)]/60">
            ማኅተመ ክርስቶስ ሰንበት ት/ቤት
          </p>
        </div>
        <Suspense fallback={<p className="text-sm text-center">…</p>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
