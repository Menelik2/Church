import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";
import { DisciplineForm } from "./DisciplineForm";

export default async function AdminDisciplinePage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data: cases } = await supabase.from("disciplinary_cases").select("*").order("created_at", { ascending: false }).limit(50);
  const stepLabel = (s: number) => (s === 1 ? "1. የክፍል ተጠሪ" : s === 2 ? "2. ቁጥጥር ክፍል" : "3. ስራ አመራር");

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--primary)] amharic">የቅጣት ሂደት</h1>
      <p className="text-sm text-[var(--foreground)]/60 mt-1 amharic">አንቀጽ 13 — ሶስት ደረጃዎች</p>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
          <h2 className="font-semibold amharic mb-4">አዲስ ጉዳይ</h2>
          <DisciplineForm />
        </div>
        <ul className="space-y-3">
          {(cases ?? []).map((c) => (
            <li key={c.id} className="rounded-xl border border-[var(--border)] p-4">
              <p className="font-medium amharic">{c.servant_name}</p>
              <p className="text-xs text-[var(--foreground)]/50">{stepLabel(c.step)} · {c.status}</p>
              <p className="mt-2 text-sm amharic">{c.reason}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
