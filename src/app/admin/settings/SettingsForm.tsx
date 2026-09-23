"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Contact = {
  email: string | null;
  phone: string | null;
  address: string | null;
  note?: string;
};

export function SettingsForm({ initial }: { initial: Contact }) {
  const router = useRouter();
  const [email, setEmail] = useState(initial.email ?? "");
  const [phone, setPhone] = useState(initial.phone ?? "");
  const [address, setAddress] = useState(initial.address ?? "");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    const supabase = createClient();
    const { error } = await supabase.from("site_settings").upsert({
      key: "contact",
      value: {
        email: email || null,
        phone: phone || null,
        address: address || null,
        note:
          !email && !phone && !address
            ? "Not provided in the source document."
            : null,
      },
    });

    setSaving(false);
    if (error) {
      setMsg(error.message);
      return;
    }
    setMsg("ተቀምጧል።");
    router.refresh();
  }

  return (
    <form onSubmit={onSave} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">ኢሜይል</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">ስልክ</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">አድራሻ</label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={2}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
        />
      </div>
      {msg && (
        <p className={`text-sm ${msg.includes("ተቀምጧል") ? "text-emerald-600" : "text-red-600"}`}>
          {msg}
        </p>
      )}
      <button
        type="submit"
        disabled={saving}
        className="rounded-xl bg-[var(--primary)] text-white px-4 py-2 text-sm disabled:opacity-50"
      >
        {saving ? "…" : "አስቀምጥ"}
      </button>
    </form>
  );
}
