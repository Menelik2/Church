import { createClient } from "@/lib/supabase/server";
import { Calendar } from "lucide-react";

export const metadata = {
  title: "ዝግጅቶች",
  description: "የማኅተመ ክርስቶስ ሰንበት ት/ቤት ዝግጅቶች",
};

export default async function EventsPage() {
  let events: {
    id: string;
    title_am: string;
    description_am: string | null;
    location: string | null;
    starts_at: string;
    ends_at: string | null;
  }[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("events")
      .select("id, title_am, description_am, location, starts_at, ends_at")
      .eq("published", true)
      .order("starts_at", { ascending: true })
      .limit(50);
    events = data ?? [];
  } catch {
    // offline
  }

  const now = Date.now();
  const upcoming = events.filter((e) => new Date(e.starts_at).getTime() >= now - 86400000);
  const past = events.filter((e) => new Date(e.starts_at).getTime() < now - 86400000);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <Calendar className="h-7 w-7 text-[var(--primary)]" />
        <h1 className="text-3xl font-bold text-[var(--primary)] amharic">ዝግጅቶች</h1>
      </div>
      <p className="mt-2 text-[var(--foreground)]/60 amharic">የሰንበት ት/ቤቱ መርሐግብር እና ዝግጅቶች</p>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--foreground)]/50 mb-4">የሚመጡ</h2>
        <ul className="space-y-4">
          {upcoming.map((ev) => (
            <li key={ev.id} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
              <h3 className="font-semibold amharic text-[var(--primary)]">{ev.title_am}</h3>
              <p className="mt-1 text-xs text-[var(--foreground)]/50">
                {new Date(ev.starts_at).toLocaleString("am-ET")}
                {ev.location ? ` · ${ev.location}` : ""}
              </p>
              {ev.description_am && (
                <p className="mt-2 text-sm amharic text-[var(--foreground)]/80">{ev.description_am}</p>
              )}
            </li>
          ))}
          {upcoming.length === 0 && (
            <li className="text-sm text-[var(--foreground)]/50 amharic py-4">የሚመጣ ዝግጅት የለም።</li>
          )}
        </ul>
      </section>

      {past.length > 0 && (
        <section className="mt-12">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--foreground)]/50 mb-4">ያለፉ</h2>
          <ul className="space-y-3 opacity-75">
            {past.slice(0, 10).map((ev) => (
              <li key={ev.id} className="rounded-xl border border-[var(--border)] p-4">
                <p className="font-medium amharic text-sm">{ev.title_am}</p>
                <p className="text-xs text-[var(--foreground)]/50">{new Date(ev.starts_at).toLocaleDateString("am-ET")}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
