"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/admin";
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    errorParam === "inactive"
      ? "መለያዎ አልተንቀሳቀሰም። አስተዳዳሪን ያነጋግሩ።"
      : errorParam === "auth"
        ? "ማረጋገጫ አልተሳካም። እንደገና ይሞክሩ።"
        : null
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    router.push(next);
    router.refresh();
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
        <p className="text-sm text-red-600 bg-red-50 dark:bg-red-950/30 rounded-lg px-3 py-2">
          {error}
        </p>
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
