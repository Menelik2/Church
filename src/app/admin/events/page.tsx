import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";
import { EventForm } from "./EventForm";
import { Calendar, MapPin } from "lucide-react";
import { EventPublishToggle } from "./EventPublishToggle";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  await requireAdmin();
  const supabase = await createClient();

  const { data: events, error } = await supabase
    .from("events")
    .select("id, title_am, description_am, location, starts_at, ends_at, published, slug")
    .order("starts_at", { ascending: false })
    .limit(80);

  const now = Date.now();

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary)] amharic">ዝግጅቶች</h1>
          <p className="mt-1 text-sm text-[var(--foreground)]/55 amharic">
            አዲስ ዝግጅት ይፍጠሩ · በድረ-ገጹ `/events` ይታያሉ
          </p>
        </div>
        <a
          href="/events"
          target="_blank"
          rel="noreferrer"
          className="text-xs font-semibold text-[var(--primary)] amharic underline-offset-2 hover:underline"
        >
          ድረ-ገጽ ይመልከቱ →
        </a>
      </div>

      {error && (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error.message}
        </p>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 font-semibold amharic text-[var(--primary)]">
            <Calendar className="h-4 w-4" /> አዲስ ዝግጅት
          </h2>
          <EventForm />
        </div>

        <div>
          <h2 className="mb-4 font-semibold amharic text-[var(--primary)]">
            ያሉ ዝግጅቶች ({(events ?? []).length})
          </h2>
          <ul className="space-y-3">
            {(events ?? []).map((ev) => {
              const start = new Date(ev.starts_at).getTime();
              const end = ev.ends_at ? new Date(ev.ends_at).getTime() : null;
              let statusLabel = "የሚመጣ";
              let statusClass = "bg-[var(--primary)]/10 text-[var(--primary)]";
              if (end && start <= now && end >= now) {
                statusLabel = "እየተካሄደ";
                statusClass = "bg-emerald-500/15 text-emerald-700";
              } else if (start < now && (!end || end < now)) {
                statusLabel = "ያለፈ";
                statusClass = "bg-[var(--foreground)]/8 text-[var(--foreground)]/55";
              }

              return (
                <li
                  key={ev.id}
                  className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="font-medium amharic text-[var(--primary)]">{ev.title_am}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold amharic ${statusClass}`}>
                      {statusLabel}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-[var(--foreground)]/50">
                    {new Date(ev.starts_at).toLocaleString("am-ET")}
                    {ev.ends_at ? ` – ${new Date(ev.ends_at).toLocaleTimeString("am-ET", { hour: "2-digit", minute: "2-digit" })}` : ""}
                  </p>
                  {ev.location && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-[var(--foreground)]/50 amharic">
                      <MapPin className="h-3 w-3" /> {ev.location}
                    </p>
                  )}
                  {ev.description_am && (
                    <p className="mt-2 line-clamp-2 text-xs amharic text-[var(--foreground)]/65">
                      {ev.description_am}
                    </p>
                  )}
                  <div className="mt-3 flex items-center justify-between gap-2 border-t border-[var(--border)] pt-3">
                    <span className={`text-[11px] font-medium amharic ${ev.published ? "text-emerald-700" : "text-amber-700"}`}>
                      {ev.published ? "ታትሟል" : "ረቂቅ"}
                    </span>
                    <EventPublishToggle id={ev.id} published={!!ev.published} />
                  </div>
                </li>
              );
            })}
            {(!events || events.length === 0) && (
              <p className="rounded-xl border border-dashed border-[var(--border)] px-4 py-8 text-center text-sm text-[var(--foreground)]/50 amharic">
                ምንም ዝግጅት የለም። ከግራው ፍጠሩ።
              </p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
