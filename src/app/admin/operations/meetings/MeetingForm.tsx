"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function MeetingForm() {
  const router = useRouter();
  const [type, setType] = useState("executive");
  const [title, setTitle] = useState("");
  const [when, setWhen] = useState("");
  const [location, setLocation] = useState("");
  const [agenda, setAgenda] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from("meetings").insert({
      meeting_type: type,
      title_am: title.trim(),
      scheduled_at: new Date(when).toISOString(),
      location: location.trim() || null,
      agenda: agenda.trim() || null,
      status: "scheduled",
    });
    setLoading(false);
    if (error) {
      setErr(error.message);
      return;
    }
    setTitle("");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <select value={type} onChange={(e) => setType(e.target.value)} className="w-full rounded-xl border border-[var(--border)] px-3 py-2 text-sm">
        <option value="general_assembly">ጠቅላላ ጉባኤ</option>
        <option value="advisory_board">አማካሪ ቦርድ</option>
        <option value="executive">ስራ አስፈጻሚ</option>
        <option value="department">ክፍል</option>
      </select>
      <input required placeholder="ርዕስ" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border border-[var(--border)] px-3 py-2 text-sm amharic" />
      <input type="datetime-local" required value={when} onChange={(e) => setWhen(e.target.value)} className="w-full rounded-xl border border-[var(--border)] px-3 py-2 text-sm" />
      <input placeholder="ቦታ" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full rounded-xl border border-[var(--border)] px-3 py-2 text-sm" />
      <textarea placeholder="አጀንዳ" value={agenda} onChange={(e) => setAgenda(e.target.value)} rows={3} className="w-full rounded-xl border border-[var(--border)] px-3 py-2 text-sm amharic" />
      {err && <p className="text-sm text-red-600">{err}</p>}
      <button type="submit" disabled={loading} className="rounded-xl bg-[var(--primary)] text-white px-4 py-2 text-sm">መርሐግብር</button>
    </form>
  );
}
