import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { CandidateForm } from "./CandidateForm";
import { CycleStatusActions } from "./CycleStatusActions";
import Link from "next/link";

export default async function ElectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const supabase = await createClient();
  const { data: cycle } = await supabase.from("election_cycles").select("*").eq("id", id).single();
  if (!cycle) notFound();
  const { data: positions } = await supabase.from("election_positions").select("*, election_candidates(*)").eq("cycle_id", id).order("title_am");
  const { data: servants } = await supabase.from("servants").select("id, full_name_am").eq("status", "active").order("full_name_am");

  return (
    <div>
      <Link href="/admin/operations/elections" className="text-sm text-[var(--primary)] hover:underline">← ምርጫዎች</Link>
      <h1 className="mt-2 text-2xl font-bold text-[var(--primary)] amharic">{cycle.title_am}</h1>
      <p className="text-sm text-[var(--foreground)]/60">{cycle.term_start} → {cycle.term_end} · {cycle.status}</p>
      <div className="mt-3"><CycleStatusActions id={cycle.id} status={cycle.status} /></div>
      <p className="mt-4 text-xs text-[var(--foreground)]/50 amharic">ተከታታይ 2 ጊዜ ከተመረጠ ለ3ኛ አንድ ዘመን ማሳለፍ · እጩ 2/3 · እጣ</p>
      <ul className="mt-8 space-y-6">
        {(positions ?? []).map((pos) => (
          <li key={pos.id} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
            <h2 className="font-semibold amharic text-[var(--primary)]">{pos.title_am}</h2>
            <ul className="mt-2 space-y-1 text-sm">
              {(pos.election_candidates as { id: string; full_name_am: string; consecutive_terms: number; eligible: boolean }[] | null)?.map((c) => (
                <li key={c.id} className="amharic">
                  {c.full_name_am}
                  <span className="text-xs text-[var(--foreground)]/50"> · ዘመን {c.consecutive_terms}{!c.eligible && " · ብቁ አይደለም"}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3"><CandidateForm positionId={pos.id} servants={servants ?? []} /></div>
          </li>
        ))}
      </ul>
    </div>
  );
}
