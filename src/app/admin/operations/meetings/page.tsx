import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";
import { MeetingForm } from "./MeetingForm";

export default async function AdminMeetingsPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data: meetings } = await supabase.from("meetings").select("*").order("scheduled_at", { ascending: false }).limit(50);
  const typeLabel: Record<string, string> = {
    general_assembly: "ጠቅላላ ጉባኤ",
    advisory_board: "አማካሪ ቦርድ",
    executive: "ስራ አስፈጻሚ",
    department: "ክፍል",
    other: "ሌላ",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--primary)] amharic">ስብሰባዎች</h1>
      <p className="text-sm text-[var(--foreground)]/60 mt-1 amharic">አንቀጽ 6 · 7</p>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
          <MeetingForm />
        </div>
        <ul className="space-y-3">
          {(meetings ?? []).map((m) => (
            <li key={m.id} className="rounded-xl border border-[var(--border)] p-4">
              <p className="font-medium amharic">{m.title_am}</p>
              <p className="text-xs text-[var(--foreground)]/50">{typeLabel[m.meeting_type]} · {new Date(m.scheduled_at).toLocaleString("am-ET")}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
