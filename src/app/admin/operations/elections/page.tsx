import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";
import { ElectionCycleForm } from "./ElectionCycleForm";
import Link from "next/link";

const DEFAULT_POSITIONS = [
  { key: "chair", title: "ሰብሳቢ" },
  { key: "vice_chair", title: "ምክትል ሰብሳቢ" },
  { key: "secretary", title: "ፀሐፊ" },
  { key: "dept:timihirt", title: "ትምህርት ክፍል" },
  { key: "dept:mezmur", title: "መዝሙር ክፍል" },
  { key: "dept:kine", title: "ኪነጥበብ ክፍል" },
  { key: "dept:hisab", title: "ሒሳብ ክፍል" },
  { key: "dept:hijanat", title: "ሕጻናት ክፍል" },
  { key: "dept:ginignunet", title: "ግንኙነት ክፍል" },
  { key: "dept:kutator", title: "ቁጥጥር ክፍል" },
  { key: "dept:limat", title: "ልማትና በጎ አድራጎት" },
  { key: "dept:media", title: "ሚዲያ" },
  { key: "dept:nibret", title: "ንብረት ክፍል" },
];

export default async function AdminElectionsPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data: cycles } = await supabase.from("election_cycles").select("*").order("term_start", { ascending: false }).limit(20);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--primary)] amharic">የስራ አመራር ምርጫ</h1>
      <div className="mt-2 text-sm text-[var(--foreground)]/60 amharic space-y-1">
        <p>አንቀጽ 10 — ዘመን 2 ዓመት · ተከታታይ ከ2 ጊዜ በላይ አይቻልም</p>
        <p>እጩዎች 2/3 አባላት · መጨረሻ በፀሎት እና እጣ</p>
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
          <ElectionCycleForm defaultPositions={DEFAULT_POSITIONS} />
        </div>
        <ul className="space-y-3">
          {(cycles ?? []).map((c) => (
            <li key={c.id} className="rounded-xl border border-[var(--border)] p-4">
              <div className="flex justify-between gap-2">
                <p className="font-medium amharic">{c.title_am}</p>
                <span className="text-xs">{c.status}</span>
              </div>
              <p className="text-xs text-[var(--foreground)]/50">{c.term_start} → {c.term_end}</p>
              <Link href={`/admin/operations/elections/${c.id}`} className="mt-2 inline-block text-sm text-[var(--primary)] hover:underline">እጩዎች →</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
