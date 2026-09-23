"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function DisciplineForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [reason, setReason] = useState("");
  const [step, setStep] = useState("1");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from("disciplinary_cases").insert({
      servant_name: name.trim(),
      reason: reason.trim(),
      step: parseInt(step, 10),
      status: "open",
    });
    setLoading(false);
    if (error) {
      setErr(error.message);
      return;
    }
    setName("");
    setReason("");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input required placeholder="የአገልጋይ ስም" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-[var(--border)] px-3 py-2 text-sm amharic" />
      <textarea required placeholder="ምክንያት" value={reason} onChange={(e) => setReason(e.target.value)} rows={3} className="w-full rounded-xl border border-[var(--border)] px-3 py-2 text-sm amharic" />
      <select value={step} onChange={(e) => setStep(e.target.value)} className="w-full rounded-xl border border-[var(--border)] px-3 py-2 text-sm">
        <option value="1">1 — የክፍል ተጠሪ ምክር</option>
        <option value="2">2 — ቁጥጥር ክፍል</option>
        <option value="3">3 — ስራ አመራር ኮሚቴ</option>
      </select>
      {err && <p className="text-sm text-red-600">{err}</p>}
      <button type="submit" disabled={loading} className="rounded-xl bg-[var(--primary)] text-white px-4 py-2 text-sm">መዝግብ</button>
    </form>
  );
}
