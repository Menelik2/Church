import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";
import { UserPlus, Heart, AlertTriangle, Calendar, Users } from "lucide-react";

export default async function OperationsHubPage() {
  await requireAdmin();
  const supabase = await createClient();

  const [
    { count: pendingMembership },
    { count: pendingWeddings },
    { count: openDiscipline },
    { count: upcomingMeetings },
    { count: activeServants },
  ] = await Promise.all([
    supabase.from("membership_applications").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("wedding_requests").select("*", { count: "exact", head: true }).eq("status", "submitted"),
    supabase.from("disciplinary_cases").select("*", { count: "exact", head: true }).eq("status", "open"),
    supabase.from("meetings").select("*", { count: "exact", head: true }).eq("status", "scheduled"),
    supabase.from("servants").select("*", { count: "exact", head: true }).eq("status", "active"),
  ]);

  const cards = [
    { href: "/admin/operations/membership", label: "የአባልነት ጥያቄዎች", value: pendingMembership ?? 0, icon: UserPlus, hint: "በመጠባበቅ" },
    { href: "/admin/operations/weddings", label: "የሰርግ ጥያቄዎች", value: pendingWeddings ?? 0, icon: Heart, hint: "አዲስ" },
    { href: "/admin/operations/discipline", label: "የቅጣት ሂደት", value: openDiscipline ?? 0, icon: AlertTriangle, hint: "ክፍት" },
    { href: "/admin/operations/meetings", label: "ስብሰባዎች", value: upcomingMeetings ?? 0, icon: Calendar, hint: "ታቅደዋል" },
    { href: "/admin/operations/servants", label: "አገልጋዮች", value: activeServants ?? 0, icon: Users, hint: "ንቁ" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--primary)] amharic">የስራ ሂደቶች</h1>
      <p className="mt-1 text-sm text-[var(--foreground)]/60 amharic">ከህግና ደንብ ተግባራዊ ሂደቶች (አንቀጽ 6–16)</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ href, label, value, icon: Icon, hint }) => (
          <Link key={href} href={href} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 hover:border-[var(--color-burgundy-300)] transition">
            <div className="flex items-center justify-between">
              <Icon className="h-5 w-5 text-[var(--primary)]" />
              <span className="text-2xl font-bold tabular-nums">{value}</span>
            </div>
            <p className="mt-2 text-sm amharic font-medium">{label}</p>
            <p className="text-xs text-[var(--foreground)]/50">{hint}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
