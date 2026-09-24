"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function CommentForm({ announcementId }: { announcementId: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const supabase = createClient();
    const { error: err } = await supabase.from("announcement_comments").insert({
      announcement_id: announcementId,
      author_name: name.trim(),
      author_email: email.trim() || null,
      body: body.trim(),
      is_approved: false,
    });
    setSaving(false);
    if (err) {
      setError(err.message);
      return;
    }
    setName("");
    setEmail("");
    setBody("");
    setDone(true);
    router.refresh();
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-5 text-sm amharic text-emerald-900">
        አስተያየትዎ ተልኳል። ከአስተዳደር ማረጋገጫ በኋላ ይታያል።
        <button
          type="button"
          onClick={() => setDone(false)}
          className="mt-2 block text-xs font-semibold underline"
        >
          ሌላ አስተያየት ጻፍ
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 sm:p-5">
      <h3 className="text-sm font-bold amharic text-[var(--primary)]">አስተያየት ይስጡ</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={2}
          placeholder="ስም *"
          className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm amharic"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ኢሜይል (አማራጭ)"
          className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
        />
      </div>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        required
        minLength={2}
        maxLength={2000}
        rows={3}
        placeholder="አስተያየትዎ…"
        className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm amharic"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={saving}
        className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 amharic"
      >
        {saving ? "እየተላከ…" : "ላክ"}
      </button>
    </form>
  );
}
