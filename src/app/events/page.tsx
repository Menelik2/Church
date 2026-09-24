import { createClient } from "@/lib/supabase/server";
import {
  Calendar,
  MapPin,
  Clock,
  CalendarDays,
  History,
  Sparkles,
} from "lucide-react";

export const metadata = {
  title: "ዝግጅቶች",
  description: "የማኅተመ ክርስቶስ ሰንበት ት/ቤት ዝግጅቶችና መርሐግብር",
};

export const dynamic = "force-dynamic";

type EventRow = {
  id: string;
  title_am: string;
  description_am: string | null;
  location: string | null;
  starts_at: string;
  ends_at: string | null;
  slug?: string | null;
};

function startOfTodayMs() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function classify(ev: EventRow, now: number, todayStart: number) {
  const start = new Date(ev.starts_at).getTime();
  const end = ev.ends_at ? new Date(ev.ends_at).getTime() : null;

  // Ongoing: started and not yet ended
  if (start <= now && (end === null ? start >= todayStart : end >= now)) {
    if (end !== null && end >= now && start <= now) return "ongoing" as const;
  }
  if (end !== null && start <= now && end >= now) return "ongoing" as const;

  // Upcoming: starts today or later
  if (start >= todayStart) return "upcoming" as const;

  return "past" as const;
}

function formatDateAm(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("am-ET", {
      weekday: "short",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

function formatTimeAm(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString("am-ET", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

function EventCard({
  ev,
  status,
}: {
  ev: EventRow;
  status: "upcoming" | "ongoing" | "past";
}) {
  const badge =
    status === "ongoing"
      ? { label: "እየተካሄደ", className: "bg-emerald-500/15 text-emerald-700 border-emerald-500/25" }
      : status === "upcoming"
        ? { label: "የሚመጣ", className: "bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/20" }
        : { label: "ያለፈ", className: "bg-[var(--foreground)]/8 text-[var(--foreground)]/55 border-[var(--border)]" };

  return (
    <li
      className={
        status === "past"
          ? "rounded-2xl border border-[var(--border)] bg-[var(--card)]/70 p-5 opacity-80"
          : "rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm transition hover:shadow-md hover:border-[var(--color-gold-300)]/40"
      }
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-base font-bold amharic text-[var(--primary)] sm:text-lg">{ev.title_am}</h3>
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold amharic ${badge.className}`}>
          {badge.label}
        </span>
      </div>

      <div className="mt-3 flex flex-col gap-1.5 text-xs text-[var(--foreground)]/60 sm:text-sm">
        <p className="flex items-center gap-2">
          <CalendarDays className="h-3.5 w-3.5 shrink-0 text-[var(--color-gold-600)]" />
          <span className="amharic">{formatDateAm(ev.starts_at)}</span>
        </p>
        <p className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 shrink-0 text-[var(--color-gold-600)]" />
          <span>
            {formatTimeAm(ev.starts_at)}
            {ev.ends_at ? ` – ${formatTimeAm(ev.ends_at)}` : ""}
          </span>
        </p>
        {ev.location && (
          <p className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[var(--color-gold-600)]" />
            <span className="amharic">{ev.location}</span>
          </p>
        )}
      </div>

      {ev.description_am && (
        <p className="mt-3 text-sm leading-relaxed amharic text-[var(--foreground)]/75 whitespace-pre-line">
          {ev.description_am}
        </p>
      )}
    </li>
  );
}

export default async function EventsPage() {
  let events: EventRow[] = [];
  let fetchError = false;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("events")
      .select("id, title_am, description_am, location, starts_at, ends_at, slug")
      .eq("published", true)
      .order("starts_at", { ascending: true })
      .limit(100);

    if (error) {
      fetchError = true;
    } else {
      events = (data as EventRow[]) ?? [];
    }
  } catch {
    fetchError = true;
  }

  const now = Date.now();
  const todayStart = startOfTodayMs();

  const upcoming: EventRow[] = [];
  const ongoing: EventRow[] = [];
  const past: EventRow[] = [];

  for (const ev of events) {
    const kind = classify(ev, now, todayStart);
    if (kind === "ongoing") ongoing.push(ev);
    else if (kind === "upcoming") upcoming.push(ev);
    else past.push(ev);
  }

  // Sort: upcoming soonest first; past newest first
  upcoming.sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime());
  ongoing.sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime());
  past.sort((a, b) => new Date(b.starts_at).getTime() - new Date(a.starts_at).getTime());

  const hasAny = upcoming.length + ongoing.length + past.length > 0;

  return (
    <div className="bg-cross-pattern min-h-[70vh] pb-28 lg:pb-12">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[var(--border)] bg-gradient-to-br from-[var(--color-burgundy-950)] via-[var(--color-burgundy-900)] to-[var(--color-burgundy-950)]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,_rgba(201,145,47,0.2),_transparent_55%)]" />
        <div className="relative mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[var(--color-gold-300)] ring-1 ring-white/15">
              <Calendar className="h-6 w-6" />
            </span>
            <div>
              <h1 className="text-2xl font-bold text-white amharic sm:text-3xl">ዝግጅቶች</h1>
              <p className="mt-1 text-sm text-white/70 amharic">የሰንበት ት/ቤቱ መርሐግብርና ዝግጅቶች</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2 text-[11px] amharic">
            <span className="rounded-full bg-white/10 px-3 py-1 text-white/85 ring-1 ring-white/15">
              የሚመጡ · {upcoming.length}
            </span>
            <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-emerald-100 ring-1 ring-emerald-400/30">
              እየተካሄደ · {ongoing.length}
            </span>
            <span className="rounded-full bg-white/5 px-3 py-1 text-white/60 ring-1 ring-white/10">
              ያለፉ · {past.length}
            </span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 pt-8 sm:px-6 lg:px-8">
        {fetchError && (
          <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm amharic text-amber-900">
            ዝግጅቶችን ማምጣት አልተቻለም። እባክዎ ቆይተው እንደገና ይሞክሩ።
          </div>
        )}

        {!fetchError && !hasAny && (
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card)] px-6 py-14 text-center">
            <Calendar className="mx-auto h-10 w-10 text-[var(--foreground)]/25" />
            <p className="mt-4 text-base font-semibold amharic text-[var(--primary)]">ዝግጅት የለም</p>
            <p className="mt-2 text-sm text-[var(--foreground)]/55 amharic">
              በአሁኑ ጊዜ የታተመ ዝግጅት የለም። አዲስ ዝግጅቶች ሲታተሙ እዚህ ይታያሉ።
            </p>
          </div>
        )}

        {ongoing.length > 0 && (
          <section className="mb-10">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-700 amharic">
                እየተካሄደ ያለ
              </h2>
            </div>
            <ul className="space-y-4">
              {ongoing.map((ev) => (
                <EventCard key={ev.id} ev={ev} status="ongoing" />
              ))}
            </ul>
          </section>
        )}

        <section className="mb-10">
          <div className="mb-4 flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-[var(--primary)]" />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--foreground)]/55 amharic">
              የሚመጡ ዝግጅቶች
            </h2>
          </div>
          <ul className="space-y-4">
            {upcoming.map((ev) => (
              <EventCard key={ev.id} ev={ev} status="upcoming" />
            ))}
            {upcoming.length === 0 && hasAny && (
              <li className="rounded-2xl border border-dashed border-[var(--border)] px-5 py-8 text-center text-sm amharic text-[var(--foreground)]/50">
                የሚመጣ ዝግጅት የለም።
              </li>
            )}
          </ul>
        </section>

        {past.length > 0 && (
          <section className="mb-6">
            <div className="mb-4 flex items-center gap-2">
              <History className="h-4 w-4 text-[var(--foreground)]/40" />
              <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--foreground)]/45 amharic">
                ያለፉ ዝግጅቶች
              </h2>
            </div>
            <ul className="space-y-3">
              {past.slice(0, 15).map((ev) => (
                <EventCard key={ev.id} ev={ev} status="past" />
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
