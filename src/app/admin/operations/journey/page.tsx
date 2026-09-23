import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";
import { safeSelect } from "@/lib/supabase/safe-count";
import { JourneyBoard } from "./JourneyBoard";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

type Visitor = {
  id: string;
  full_name_am: string;
  phone: string | null;
  first_visit_date: string | null;
  status: string;
};

type Servant = {
  id: string;
  full_name_am: string;
  phone: string | null;
  journey_stage: string | null;
  status: string;
};

export default async function JourneyPage() {
  await requireAdmin();
  const supabase = await createClient();

  const visitors = await safeSelect<Visitor>(supabase, "visitors", (q) =>
    (q as {
      select: (s: string) => {
        order: (c: string, o: { ascending: boolean }) => {
          limit: (n: number) => PromiseLike<{ data: Visitor[] | null; error: unknown }>;
        };
      };
    })
      .select("id, full_name_am, phone, first_visit_date, status")
      .order("created_at", { ascending: false })
      .limit(100)
  );

  const servants = await safeSelect<Servant>(supabase, "servants", (q) =>
    (q as {
      select: (s: string) => {
        eq: (c: string, v: string) => {
          order: (c: string, o: { ascending: boolean }) => {
            limit: (n: number) => PromiseLike<{ data: Servant[] | null; error: unknown }>;
          };
        };
      };
    })
      .select("id, full_name_am, phone, journey_stage, status")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(300)
  );

  return (
    <div className="pb-16">
      <Link
        href="/admin/operations"
        className="inline-flex items-center gap-1 text-sm text-[var(--primary)] amharic mb-4"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> የስራ ሂደቶች
      </Link>
      <h1 className="text-2xl font-bold text-[var(--primary)] amharic">
        የአባል ጉዞ
      </h1>
      <p className="mt-1 text-sm text-[var(--foreground)]/60 amharic">
        ጎብኝ → ተመዝጋቢ → ኮርስ → አገልጋይ
      </p>
      <div className="mt-6">
        <JourneyBoard initialVisitors={visitors} initialServants={servants} />
      </div>
    </div>
  );
}
