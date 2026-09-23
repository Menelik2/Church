import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "./SettingsForm";

export default async function AdminSettingsPage() {
  await requireAdmin(["super_admin", "admin"]);
  const supabase = await createClient();

  const { data: rows } = await supabase.from("site_settings").select("*");

  const map: Record<string, Record<string, unknown>> = {};
  for (const r of rows ?? []) {
    map[r.key] = r.value as Record<string, unknown>;
  }

  const contact = (map.contact ?? {
    email: null,
    phone: null,
    address: null,
    note: "Not provided in the source document.",
  }) as {
    email: string | null;
    phone: string | null;
    address: string | null;
    note?: string;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--primary)] amharic">ቅንብሮች</h1>
      <p className="text-sm text-[var(--foreground)]/60 mt-1">
        የድርጅት እውቂያ (በ PDF ያልተገኘ መረጃ እዚህ ይሞላል)
      </p>

      <div className="mt-8 max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
        <h2 className="font-semibold amharic mb-4">እውቂያ</h2>
        <SettingsForm initial={contact} />
      </div>
    </div>
  );
}
