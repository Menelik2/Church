import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";
import { EventForm } from "./EventForm";

export default async function AdminEventsPage() {
  await requireAdmin();
  const supabase = await createClient();

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .order("starts_at", { ascending: false })
    .limit(50);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--primary)] amharic">ዝግጅቶች</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
          <h2 className="font-semibold amharic mb-4">አዲስ ዝግጅት</h2>
          <EventForm />
        </div>
        <div>
          <h2 className="font-semibold amharic mb-4">ያሉ ዝግጅቶች</h2>
          <ul className="space-y-3">
            {(events ?? []).map((ev) => (
              <li key={ev.id} className="rounded-xl border border-[var(--border)] p-4">
                <p className="font-medium amharic">{ev.title_am}</p>
                <p className="text-xs text-[var(--foreground)]/50 mt-1">
                  {new Date(ev.starts_at).toLocaleString("am-ET")}
                  {ev.location ? ` · ${ev.location}` : ""}
                  {" · "}
                  {ev.published ? "ታትሟል" : "ረቂቅ"}
                </p>
              </li>
            ))}
            {(!events || events.length === 0) && (
              <p className="text-sm text-[var(--foreground)]/50">ምንም ዝግጅት የለም።</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
