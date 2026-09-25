"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

/** Exact Article 14 criteria (1–9) */
const criteria = [
  { key: "is_orthodox", label: "1. የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ሃይማኖት ተከታይ የሆንኩ" },
  {
    key: "completed_course",
    label: "2. በሰንበት ት/ቤቱ የሚሰጠውን የተከታታይ ትምህርት (ኮርስ) ስልጠና በአግባቡ ተምሬ ያጠናቀቅኩ / የተመረቅኩ",
  },
  {
    key: "accepts_doctrine",
    label: "3. የቤ/ክርስትያንን ድግማ፣ ቀኖና እና ሥርዓት ለመጠበቅና ለመፈጸም ፈቃደኛ የሆንኩ",
  },
  { key: "respects_bylaws", label: "4. የሰንበት ትምህርት ቤቱን የውስጥ መተዳደሪያ ድንብ የማከብር" },
  { key: "proper_attire", label: "5. ሥርዓተ ቤ/ያንን የጠበቀ አለበባስ የምከተል" },
  { key: "has_confessor", label: "6. የንስኃ አባት ያለኝና በንስኃ ህይወት የምመላለስ" },
  { key: "will_pay_monthly", label: "7. ወርሐዊ መዋጮ የማዋጣ" },
  {
    key: "stage_ready",
    label: "8. የመድረክ አገልግሎት (ትምህርት / ኪነጥበብ / መዝሙር) መስጠት የምችል — ከታች ይምረጡ",
  },
  {
    key: "church_marriage",
    label:
      "9. ጋብቻዬ በሥርዓተ ቤ/ክርስትያን (ተክሉል / መዓስባን) ነው — ወይም ከውጭ ከሆነ አሁን በንስኃና ቁርባን ህይወት እመላለሳለሁ / አይመለከተኝም",
  },
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

  const checkedCount = criteria.filter((c) => checks[c.key]).length;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setErr("ሙሉ ስም ያስፈልጋል።");
      return;
    }
    if (!stage) {
      setErr("የመድረክ አገልግሎት (ትምህርት / ኪነጥበብ / መዝሙር) መምረጥ ያስፈልጋል።");
      return;
    }
    setStatus("loading");
    setErr(null);
    try {
      const supabase = createClient();
      const payload = {
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
        status: "pending" as const,
      };

      // Insert without .select() first — avoids RLS failure on RETURNING
      // when SELECT policy was missing for anon.
      const { error } = await supabase.from("membership_applications").insert(payload);

      if (error) {
        setStatus("error");
        const msg = error.message || "";
        if (/row-level security|RLS|policy/i.test(msg)) {
          setErr(
            "ጥያቄውን ማስቀመጥ አልተቻለም (ደህንነት ፖሊሲ)። እባክዎ ገጹን አድስ አድርገው እንደገና ይሞክሩ። ችግሩ ከቀጠለ አስተዳዳሪን ያነጋግሩ።"
          );
        } else {
          setErr(msg || "ጥያቄውን መላክ አልተሳካም።");
        }
        return;
      }

      // Best-effort admin notification (no application_id required)
      try {
        await supabase.from("membership_notifications").insert({
          kind: "application_submitted",
          title_am: `አዲስ የአባልነት ጥያቄ — ${name.trim()}`,
          body_am: `መመዘኛ ራስ-ማረጋገጫ: ${checkedCount}/9 · መድረክ: ${stage}${phone.trim() ? ` · ስልክ: ${phone.trim()}` : ""}`,
          recipient_name: name.trim(),
          recipient_phone: phone.trim() || null,
          recipient_email: email.trim() || null,
        });
      } catch {
        // non-blocking
      }

      setStatus("ok");
    } catch (e) {
      setStatus("error");
      setErr(
        e instanceof Error ? e.message : "ጥያቄውን መላክ አልተሳካም። እንደገና ይሞክሩ።"
      );
    }
  }

  if (status === "ok") {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 p-8">
          <p className="amharic text-lg font-semibold text-emerald-800 dark:text-emerald-200">
            ጥያቄዎ ተልኳል።
          </p>
          <p className="mt-2 text-sm text-emerald-700/80 amharic">
            ቁጥጥር ክፍልና ሥራ አስፈጻሚ መመዘኛዎቹን ያረጋግጡና ውሳኔ ይሰጣሉ።
          </p>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
          <Link href="/rules/14" className="text-[var(--primary)] hover:underline">
            አንቀጽ 14
          </Link>
          <Link href="/services" className="text-[var(--foreground)]/60 hover:underline">
            ← አገልግሎቶች
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:px-6 sm:py-16">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--primary)]">
        አንቀጽ 14
      </p>
      <h1 className="mt-1 text-2xl font-bold text-[var(--primary)] amharic sm:text-3xl">
        የቋሚ አባልነት / አገልጋይነት ጥያቄ
      </h1>
      <p className="mt-2 text-sm text-[var(--foreground)]/60 amharic leading-relaxed">
        እነዚህን መስፈርቶች የሚያሟላ ብቻ አገልጋይ / ቋሚ አባል ይሆናል። ሙሉ ጽሑፍን ከአንቀጽ 14 ያንብቡ።
      </p>
      <Link
        href="/rules/14"
        className="mt-2 inline-block text-sm font-medium text-[var(--primary)] hover:underline"
      >
        ሙሉ አንቀጽ 14 →
      </Link>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 amharic">ሙሉ ስም *</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2.5 text-sm amharic focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)]"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">ስልክ</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">ዕድሜ</label>
            <input
              type="number"
              min={10}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)]"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">ኢሜይል</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)]"
          />
        </div>

        <fieldset className="rounded-2xl border border-[var(--border)] p-4 space-y-3">
          <legend className="text-sm font-semibold amharic px-1">
            መመዘኛ መስፈርቶች ({checkedCount}/9)
          </legend>
          {criteria.map((c) => (
            <label key={c.key} className="flex gap-2.5 text-sm amharic items-start leading-snug">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 shrink-0 rounded border-[var(--border)]"
                checked={!!checks[c.key]}
                onChange={(e) =>
                  setChecks((prev) => ({ ...prev, [c.key]: e.target.checked }))
                }
              />
              <span>{c.label}</span>
            </label>
          ))}
        </fieldset>

        <div>
          <label className="block text-sm font-medium mb-1 amharic">
            የመድረክ አገልግሎት * (አንቀጽ 14 ነጥብ 8)
          </label>
          <select
            required
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)]"
          >
            <option value="">— ይምረጡ —</option>
            <option value="timihirt">ትምህርት</option>
            <option value="kine-tibeb">ኪነጥበብ</option>
            <option value="mezmur">መዝሙር</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">ተጨማሪ መልእክት</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            placeholder="ለምሳሌ፦ ከአገልግሎት ተገድጄ ነበር አሁን መስፈርቶችን አሟልቻለሁ…"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2.5 text-sm amharic focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)]"
          />
        </div>

        {err && (
          <p className="text-sm text-red-600 bg-red-50 dark:bg-red-950/30 rounded-lg px-3 py-2">
            {err}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded-xl bg-[var(--primary)] text-white py-3 text-sm font-semibold disabled:opacity-50 hover:opacity-90 transition"
        >
          {status === "loading" ? "በመላክ ላይ…" : "ጥያቄ ላክ"}
        </button>
        <p className="text-xs text-center text-[var(--foreground)]/50 amharic">
          ማሳሰቢያ፦ ከአገልግሎት የተገደ ሰው መስፈርቶችን ካሟላ ቁጥጥር ክፍል ካረጋገጠ ሥራ አስፈጻሚ ወደ አገልጋይነት ሊመልስ ይችላል።
        </p>
      </form>
    </div>
  );
}
