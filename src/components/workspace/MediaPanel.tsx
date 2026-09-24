"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatAppError, type AppError } from "@/lib/errors";
import { ErrorBanner, SuccessBanner } from "@/components/ui/ErrorBanner";
import { Camera, FileText, Mic, Plus, Video, Filter } from "lucide-react";

type MediaRow = {
  id: string;
  title_am: string;
  media_type: string | null;
  event_name: string | null;
  storage_url: string | null;
  notes: string | null;
  created_at?: string;
};

const TYPE_LABEL: Record<string, string> = {
  photo: "ፎቶ",
  video: "ቪዲዮ",
  audio: "ድምጽ",
  document: "ሰነድ",
};

const TYPE_ICON: Record<string, typeof Camera> = {
  photo: Camera,
  video: Video,
  audio: Mic,
  document: FileText,
};

const SUB_UNITS = [
  "የቀረጻ ንዑስ ክፍል",
  "የቅንብር ንዑስ ክፍል",
  "የበይነ መረብ ንዑስ ክፍል",
  "ቁጥጥር",
  "ዶክመንቴሽን",
  "የጋዜጠኝነት",
  "ስልጠና",
] as const;

export function MediaPanel({ initial }: { initial: MediaRow[] }) {
  const [items, setItems] = useState(initial);
  const [title, setTitle] = useState("");
  const [mediaType, setMediaType] = useState("photo");
  const [eventName, setEventName] = useState("");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [subUnit, setSubUnit] = useState<string>(SUB_UNITS[0]);
  const [filterType, setFilterType] = useState<string>("all");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (filterType === "all") return items;
    return items.filter((m) => m.media_type === filterType);
  }, [items, filterType]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    setError(null);
    setOk(null);
    try {
      const supabase = createClient();
      const noteParts = [
        subUnit ? `ንዑስ፡ ${subUnit}` : null,
        notes.trim() || null,
      ].filter(Boolean);
      const { data, error: dbErr } = await supabase
        .from("media_logs")
        .insert({
          title_am: title.trim(),
          media_type: mediaType,
          event_name: eventName.trim() || null,
          storage_url: url.trim() || null,
          notes: noteParts.length ? noteParts.join(" · ") : null,
        })
        .select("id, title_am, media_type, event_name, storage_url, notes, created_at")
        .single();
      if (dbErr) {
        setError(formatAppError(dbErr));
        return;
      }
      if (data) setItems((list) => [data as MediaRow, ...list]);
      setTitle("");
      setEventName("");
      setUrl("");
      setNotes("");
      setOk("ሚዲያ ተመዝግቧል");
    } catch (err) {
      setError(formatAppError(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      {error && <ErrorBanner error={error} onDismiss={() => setError(null)} />}
      {ok && <SuccessBanner message={ok} />}

      <div className="rounded-2xl border border-[var(--color-gold-300)]/40 bg-gradient-to-br from-[var(--color-gold-50)]/50 to-[var(--card)] p-4">
        <p className="text-xs font-semibold amharic text-[var(--primary)]">ሚዲያና ዶክመንቴሽን · ንዑስ ክፍሎች</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {SUB_UNITS.map((s) => (
            <span
              key={s}
              className="rounded-full border border-[var(--color-gold-300)]/50 bg-white/80 px-2.5 py-0.5 text-[10px] amharic text-[var(--foreground)]/70"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      <form onSubmit={add} className="grid gap-2 sm:grid-cols-2 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
        <p className="sm:col-span-2 text-sm font-semibold amharic text-[var(--primary)]">አዲስ መዝገብ</p>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="ርዕስ… *"
          required
          className="sm:col-span-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm amharic"
        />
        <select
          value={mediaType}
          onChange={(e) => setMediaType(e.target.value)}
          className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm amharic"
        >
          {Object.entries(TYPE_LABEL).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        <select
          value={subUnit}
          onChange={(e) => setSubUnit(e.target.value)}
          className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm amharic"
        >
          {SUB_UNITS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <input
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          placeholder="ዝግጅት / ክስተት (ምርቃት፣ ጉባኤ…)"
          className="sm:col-span-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm amharic"
        />
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="አገናኝ (URL) — Drive / YouTube / Cloud"
          className="sm:col-span-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm"
        />
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="ማስታወሻ (አማራጭ)"
          rows={2}
          className="sm:col-span-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm amharic"
        />
        <button
          type="submit"
          disabled={saving}
          className="sm:col-span-2 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50 amharic"
        >
          <Plus className="h-4 w-4" /> {saving ? "እየተቀመጠ…" : "መዝገብ አክል"}
        </button>
      </form>

      <div className="flex flex-wrap items-center gap-2">
        <Filter className="h-3.5 w-3.5 text-[var(--foreground)]/40" />
        <button
          type="button"
          onClick={() => setFilterType("all")}
          className={`rounded-full px-3 py-1 text-[11px] font-medium amharic ${
            filterType === "all"
              ? "bg-[var(--primary)] text-white"
              : "border border-[var(--border)] text-[var(--foreground)]/60"
          }`}
        >
          ሁሉም ({items.length})
        </button>
        {Object.entries(TYPE_LABEL).map(([k, v]) => (
          <button
            key={k}
            type="button"
            onClick={() => setFilterType(k)}
            className={`rounded-full px-3 py-1 text-[11px] font-medium amharic ${
              filterType === k
                ? "bg-[var(--primary)] text-white"
                : "border border-[var(--border)] text-[var(--foreground)]/60"
            }`}
          >
            {v} ({items.filter((m) => m.media_type === k).length})
          </button>
        ))}
      </div>

      <ul className="space-y-2">
        {filtered.length === 0 && (
          <li className="rounded-xl border border-dashed border-[var(--border)] py-10 text-center text-sm text-[var(--foreground)]/50 amharic">
            ምንም መዝገብ የለም — ከላይ ይመዝግቡ።
          </li>
        )}
        {filtered.map((m) => {
          const Icon = TYPE_ICON[m.media_type ?? ""] ?? FileText;
          return (
            <li
              key={m.id}
              className="flex gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-3 shadow-sm"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium amharic text-[var(--primary)]">{m.title_am}</p>
                <p className="mt-0.5 text-[11px] text-[var(--foreground)]/50 amharic">
                  {TYPE_LABEL[m.media_type ?? ""] ?? m.media_type}
                  {m.event_name ? ` · ${m.event_name}` : ""}
                </p>
                {m.notes && (
                  <p className="mt-1 text-[11px] text-[var(--foreground)]/45 amharic line-clamp-2">{m.notes}</p>
                )}
                {m.storage_url && (
                  <a
                    href={m.storage_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-xs font-semibold text-[var(--primary)] hover:underline"
                  >
                    ክፈት →
                  </a>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
