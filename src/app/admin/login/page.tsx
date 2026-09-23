"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { formatAppError, type AppError } from "@/lib/errors";
import { ErrorBanner } from "@/components/ui/ErrorBanner";

function errorFromParam(errorParam: string | null): AppError | null {
  if (errorParam === "inactive") {
    return {
      messageAm: "መለያዎ አልተንቀሳቀሰም",
      messageEn: "Account inactive",
      hintAm: "አስተዳዳሪን ያነጋግሩ ወይም is_active = true ያድርጉ።",
    };
  }
  if (errorParam === "auth") {
    return {
      messageAm: "ማረጋገጣ አልተሳካም",
      messageEn: "Authentication failed",
      hintAm: "እንደገና ይሞክሩ።",
    };
  }
  if (errorParam === "noprofile") {
    return {
      messageAm: "የመለያ መገለጣ አልተገኘም",
      messageEn: "No profile row",
      hintAm:
        "በSupabase Auth ላይ የጠነ ነገር በprofiles ሰንጠረዥ አይነለም። 007_profile_trigger.sql ያስሩ።",
    };
  }
  if (errorParam === "forbidden") {
    return {
      messageAm: "የአስተዳዳሪ ፈቃድ የለዎት አይደለም",
      messageEn: "Insufficient role",
      hintAm: "profiles.role = admin / super_admin / editor / department_manager ያድርጉ።",
    };
  }
  return null;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/admin";
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(() => errorFromParam(errorParam));

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
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        const mapped = formatAppError(authError);
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

      if (data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("id, role, is_active")
          .eq("id", data.user.id)
          .maybeSingle();

        if (!profile) {
          setError(errorFromParam("noprofile"));
          return;
        }
        if (profile.is_active === false) {
          setError(errorFromParam("inactive"));
          return;
        }
      }

      router.push(next.startsWith("/") ? next : "/admin");
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
            ደብረ ሰላም በዓለ እግዚአብሔር · ማእተመ ክርስቶስ
          </p>
        </div>
        <Suspense fallback={<p className="text-sm text-center">…</p>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
