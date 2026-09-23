"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.from("contact_messages").insert({
        name: name.trim(),
        email: email.trim() || null,
        phone: phone.trim() || null,
        subject: subject.trim() || null,
        message: message.trim(),
      });

      if (error) {
        setStatus("error");
        setErrorMsg(error.message);
        return;
      }

      setStatus("ok");
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    } catch {
      setStatus("error");
      setErrorMsg("መልእክት መላክ አልተሳካም። እንደገና ይሞክሩ።");
    }
  }

  if (status === "ok") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 p-6 text-center">
        <p className="amharic font-medium text-emerald-800 dark:text-emerald-200">
          መልእክትዎ ተልኳል። እናመሰግናለን።
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-3 text-sm text-[var(--primary)] hover:underline"
        >
          ሌላ መልእክት ላክ
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="c-name">ስም *</label>
        <input
          id="c-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)]"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="c-email">ኢሜይል</label>
          <input
            id="c-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="c-phone">ስልክ</label>
          <input
            id="c-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)]"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="c-subject">ርዕስ</label>
        <input
          id="c-subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="c-message">መልእክት *</label>
        <textarea
          id="c-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          required
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)]"
        />
      </div>
      {status === "error" && errorMsg && (
        <p className="text-sm text-red-600 bg-red-50 dark:bg-red-950/30 rounded-lg px-3 py-2">{errorMsg}</p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
      >
        {status === "loading" ? "በመላክ ላይ…" : "ላክ"}
      </button>
      <p className="text-xs text-[var(--foreground)]/50 text-center">መልእክቶች በአስተዳዳሪው ዳሽቦርድ ላይ ይቀመጣሉ።</p>
    </form>
  );
}
