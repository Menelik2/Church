"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function WeddingRequestPage() {
  const [groom, setGroom] = useState("");
  const [bride, setBride] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [escort, setEscort] = useState("12");
  const [outside, setOutside] = useState(false);
  const [orthodox, setOrthodox] = useState(false);
  const [idOrConfessor, setIdOrConfessor] = useState(false);
  const [servant, setServant] = useState(false);
  const [deacon, setDeacon] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const count = parseInt(escort, 10) || 0;
    if (count < 12) {
      setErr("ዝቅተኛው የአጃቢ ቁጥር 12 ነው (አንቀጽ 15)።");
      return;
    }
    setStatus("loading");
    setErr(null);
    const supabase = createClient();
    const { error } = await supabase.from("wedding_requests").insert({
      groom_name: groom.trim(),
      bride_name: bride.trim(),
      contact_phone: phone.trim(),
      contact_email: email.trim() || null,
      wedding_date: date,
      wedding_location: location.trim() || null,
      outside_bahir_dar: outside,
      is_orthodox_both: orthodox,
      parish_id_or_confessor: idOrConfessor,
      escort_count: count,
      prepayment_birr: servant || deacon ? 0 : 1500,
      is_church_servant: servant,
      is_deacon: deacon,
      status: "submitted",
    });
    if (error) {
      setStatus("error");
      setErr(error.message);
      return;
    }
    setStatus("ok");
  }

  if (status === "ok") {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="amharic text-lg font-medium text-emerald-700">ጥያቄ ተልኳል። የግንኙነት ክፍል ይመረምራል።</p>
        <Link href="/services" className="mt-4 inline-block text-[var(--primary)] hover:underline">← ተመለስ</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-bold text-[var(--primary)] amharic">የሰርግ አጃቢ ጥያቄ</h1>
      <p className="mt-2 text-sm text-[var(--foreground)]/60 amharic">አንቀጽ 15 — ቅድመ ክፍያ 1500 ብር · አጃቢ ≥ 12</p>
      <Link href="/rules/15" className="text-sm text-[var(--primary)] hover:underline">ሙሉ አንቀጽ 15 →</Link>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">ወንድ *</label>
            <input required value={groom} onChange={(e) => setGroom(e.target.value)} className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm amharic" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">ሴት *</label>
            <input required value={bride} onChange={(e) => setBride(e.target.value)} className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm amharic" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">ስልክ *</label>
          <input required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">ኢሜይል</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">የሰርግ ቀን *</label>
          <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">ቦታ</label>
          <input value={location} onChange={(e) => setLocation(e.target.value)} className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm amharic" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">አጃቢ ቁጥር (≥12) *</label>
          <input type="number" min={12} required value={escort} onChange={(e) => setEscort(e.target.value)} className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm" />
        </div>
        <div className="space-y-2 text-sm amharic">
          <label className="flex gap-2"><input type="checkbox" checked={orthodox} onChange={(e) => setOrthodox(e.target.checked)} /> ሁለቱም ኦርቶድክስ</label>
          <label className="flex gap-2"><input type="checkbox" checked={idOrConfessor} onChange={(e) => setIdOrConfessor(e.target.checked)} /> መታወቂያ/ንስኃ አባት</label>
          <label className="flex gap-2"><input type="checkbox" checked={outside} onChange={(e) => setOutside(e.target.checked)} /> ከባህር ዳር ውጭ</label>
          <label className="flex gap-2"><input type="checkbox" checked={servant} onChange={(e) => setServant(e.target.checked)} /> አገልጋይ</label>
          <label className="flex gap-2"><input type="checkbox" checked={deacon} onChange={(e) => setDeacon(e.target.checked)} /> ዲያቆን</label>
        </div>
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button type="submit" disabled={status === "loading"} className="w-full rounded-xl bg-[var(--primary)] text-white py-2.5 text-sm font-medium disabled:opacity-50">
          {status === "loading" ? "…" : "ጥያቄ ላክ"}
        </button>
      </form>
    </div>
  );
}
