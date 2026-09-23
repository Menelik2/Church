"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatAppError, type AppError } from "@/lib/errors";
import { ErrorBanner, SuccessBanner } from "@/components/ui/ErrorBanner";
import { Plus } from "lucide-react";

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

export function MediaPanel({ initial }: { initial: MediaRow[] }) {
  const [items, setItems] = useState(initial);
  const [title, setTitle] = useState("");
  const [mediaType, setMediaType] = useState("photo");
  const [eventName, setEventName] = useState("");
  const [url, setUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    setError(null);
    setOk(null);
    try {
      const supabase = createClient();
      const { data, error: dbErr } = await supabase
        .from("media_logs")
        .insert({
          title_am: title.trim(),
          media_type: mediaType,
          event_name: eventName.trim() || null,
          storage_url: url.trim() || null,
        })
        .select("id, title_am, media_type, event_name, storage_url, notes")
        .single();
      if (dbErr) {
        setError(formatAppError(dbErr));
        return;
      }
      if (data) setItems((list) => [data as MediaRow, ...list]);
      setTitle("");
      setEventName("");
      setUrl("");
      setOk("ሚዲያ ተመዝግቧል");
    } catch (err) {
      setError(formatAppError(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      {error && <ErrorBanner error={error} onDismiss={() => setError(null)} />}
      {ok && <SuccessBanner message={ok} />}

      <form onSubmit={add} className="grid gap-2 sm:grid-cols-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="ርዕስ…"
          className="sm:col-span-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm amharic"
        />
        <select
          value={mediaType}
          onChange={(e) => setMediaType(e.target.value)}
          className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm amharic"
        >
          {Object.entries(TYPE_LABEL).map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
        <input
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          placeholder="ዝግጅት / ክስተት"
          className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm amharic"
        />
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="አገናኝ (URL)"
          className="sm:col-span-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm"
        />
        <button
          type="submit"
          disabled={saving}
          className="sm:col-span-2 inline-flex items-center justify-center gap-1 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
        >
          <Plus className="h-4 w-4" /> አክል
        </button>
      </form>

      <ul className="space-y-2">
        {items.length === 0 && (
          <li className="text-sm text-[var(--foreground)]/50 amharic py-6 text-center">
            ምንም መዝገብ የለም
          </li>
        )}
        {items.map((m) => (
          <li
            key={m.id}
            className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-3"
          >
            <p className="text-sm font-medium amharic">{m.title_am}</p>
            <p className="text-[11px] text-[var(--foreground)]/45 amharic mt-0.5">
              {TYPE_LABEL[m.media_type ?? ""] ?? m.media_type}
              {m.event_name ? ` · ${m.event_name}` : ""}
            </p>
            {m.storage_url && (
              <a
                href={m.storage_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[var(--primary)] hover:underline mt-1 inline-block"
              >
                ክፈት →
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
