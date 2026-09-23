"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const criteria = [
  { key: "is_orthodox", label: "የኢትዮጵያ ኦርቶድክስ ተዋሕዶ ሃይማኖት ተከታይ ነኝ" },
  { key: "completed_course", label: "የተከታታይ ትምህርት (ኮርስ) አጠናቄያለሁ / እየተማርኩ ነኝ" },
  { key: "accepts_doctrine", label: "ዶግማ፣ ቀኖና እና ሥርዓት ለመጠበቅ ፈቃደኛ ነኝ" },
  { key: "respects_bylaws", label: "የውስጥ መተዳደሪያ ደንብ አከብራለሁ" },
  { key: "proper_attire", label: "ሥርዓተ ቤተ ክርስቲያን የጠበቀ አለባበስ እከተላለሁ" },
  { key: "has_confessor", label: "የንስኃ አባት አለኝና በንስኃ ህይወት እመላለሳለሁ" },
  { key: "will_pay_monthly", label: "ወርሃዊ መዋጮ ለማዋጣት ዝግጁ ነኝ" },
  { key: "church_marriage", label: "ጋብቻዬ በሥርዓተ ቤተ ክርስቲያን ነው (ወይም አይመለከተኝም)" },
] as const;

export default function MembershipApplicationPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [stage, setStage] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErr(null);
    const supabase = createClient();
    const { error } = await supabase.from("membership_applications").insert({
      full_name_am: name.trim(),
      phone: phone.trim() || null,
      email: email.trim() || null,
      age: age ? parseInt(age, 10) : null,
      is_orthodox: !!checks.is_orthodox,
      completed_course: !!checks.completed_course,
      accepts_doctrine: !!checks.accepts_doctrine,
      respects_bylaws: !!checks.respects_bylaws,
      proper_attire: !!checks.proper_attire,
      has_confessor: !!checks.has_confessor,
      will_pay_monthly: !!checks.will_pay_monthly,
      church_marriage: !!checks.church_marriage,
      preferred_stage: stage || null,
      message: message.trim() || null,
      status: "pending",
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
        <p className="amharic text-lg font-medium text-emerald-700">ጥያቄዎ ተልኳል። አስተዳዳሪዎች ይመረምራሉ።</p>
        <Link href="/services" className="mt-4 inline-block text-[var(--primary)] hover:underline">← ተመለስ</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-bold text-[var(--primary)] amharic">የቋሚ አባልነት / አገልጋይነት ጥያቄ</h1>
      <p className="mt-2 text-sm text-[var(--foreground)]/60 amharic">አንቀጽ 14 — መመዘኛ መስፈርቶች</p>
      <Link href="/rules/14" className="text-sm text-[var(--primary)] hover:underline">ሙሉ አንቀጽ 14 →</Link>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">ሙሉ ስም *</label>
          <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm amharic" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">ስልክ</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">ዕድሜ</label>
            <input type="number" min={10} value={age} onChange={(e) => setAge(e.target.value)} className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">ኢሜይል</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm" />
        </div>
        <fieldset className="rounded-xl border border-[var(--border)] p-4 space-y-2">
          <legend className="text-sm font-semibold amharic px-1">መመዘኛ (አንቀጽ 14)</legend>
          {criteria.map((c) => (
            <label key={c.key} className="flex gap-2 text-sm amharic items-start">
              <input type="checkbox" className="mt-1" checked={!!checks[c.key]} onChange={(e) => setChecks((prev) => ({ ...prev, [c.key]: e.target.checked }))} />
              <span>{c.label}</span>
            </label>
          ))}
        </fieldset>
        <div>
          <label className="block text-sm font-medium mb-1">የመድረክ አገልግሎት</label>
          <select value={stage} onChange={(e) => setStage(e.target.value)} className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm">
            <option value="">— ይምረጡ —</option>
            <option value="timihirt">ትምህርት</option>
            <option value="kine-tibeb">ኪነ ጥበብ</option>
            <option value="mezmur">መዝሙር</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">መልእክት</label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm amharic" />
        </div>
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button type="submit" disabled={status === "loading"} className="w-full rounded-xl bg-[var(--primary)] text-white py-2.5 text-sm font-medium disabled:opacity-50">
          {status === "loading" ? "በመላክ ላይ…" : "ጥያቄ ላክ"}
        </button>
      </form>
    </div>
  );
}
