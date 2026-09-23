import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";
import { safeCount } from "@/lib/supabase/safe-count";
import {
  UserPlus,
  Heart,
  AlertTriangle,
  Calendar,
  Users,
  Wallet,
  FileText,
  Vote,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function OperationsHubPage() {
  await requireAdmin();
  const supabase = await createClient();

  const [
    pendingMembership,
    pendingWeddings,
    openDiscipline,
    upcomingMeetings,
    activeServants,
    openElections,
  ] = await Promise.all([
    safeCount(supabase, "membership_applications", (q) =>
      (q as { eq: (c: string, v: string) => unknown }).eq("status", "pending")
    ),
    safeCount(supabase, "wedding_requests", (q) =>
      (q as { eq: (c: string, v: string) => unknown }).eq("status", "submitted")
    ),
    safeCount(supabase, "disciplinary_cases", (q) =>
      (q as { eq: (c: string, v: string) => unknown }).eq("status", "open")
    ),
    safeCount(supabase, "meetings", (q) =>
      (q as { eq: (c: string, v: string) => unknown }).eq("status", "scheduled")
    ),
    safeCount(supabase, "servants", (q) =>
      (q as { eq: (c: string, v: string) => unknown }).eq("status", "active")
    ),
    safeCount(supabase, "election_cycles"),
  ]);

  const cards = [
    {
      href: "/admin/operations/membership",
      label: "የአባልነት ጥያቄዎች",
      value: pendingMembership,
      icon: UserPlus,
      hint: "በመጠባበቅ",
    },
    {
      href: "/admin/operations/weddings",
      label: "የሰርግ ጥያቄዎች",
      value: pendingWeddings,
      icon: Heart,
      hint: "አዲስ",
    },
    {
      href: "/admin/operations/discipline",
      label: "የቅጣት ሂደት",
      value: openDiscipline,
      icon: AlertTriangle,
      hint: "ክፍት",
    },
    {
      href: "/admin/operations/meetings",
      label: "ስብሰባዎች",
      value: upcomingMeetings,
      icon: Calendar,
      hint: "ታቅደዋል",
    },
    {
      href: "/admin/operations/servants",
      label: "አገልጋዮች",
      value: activeServants,
      icon: Users,
      hint: "ንቁ",
    },
    {
      href: "/admin/operations/contributions",
      label: "ወርሃዊ መዋጮ",
      value: "—",
      icon: Wallet,
      hint: "አንቀጽ 12/14",
    },
    {
      href: "/admin/operations/reports",
      label: "የክፍል ሪፖርቶች",
      value: "—",
      icon: FileText,
      hint: "ሩብ ዓመት",
    },
    {
      href: "/admin/operations/elections",
      label: "ምርጫ",
      value: openElections,
      icon: Vote,
      hint: "አንቀጽ 10 · 2 ዓመት",
    },
  ];

  return (
    <div className="pb-16">
      <h1 className="text-2xl font-bold text-[var(--primary)] amharic">የስራ ሂደቶች</h1>
      <p className="mt-1 text-sm text-[var(--foreground)]/60 amharic">
        ከህግና ደንብ ተግባራዊ ሂደቶች (አንቀጽ 6–16)
      </p>
      <div className="mt-6 grid gap-3 grid-cols-2 lg:grid-cols-4">
        {cards.map(({ href, label, value, icon: Icon, hint }) => (
          <Link
            key={href}
            href={href}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 sm:p-5 hover:border-[var(--color-burgundy-300)] active:scale-[0.99] transition"
          >
            <div className="flex items-center justify-between gap-2">
              <Icon className="h-5 w-5 text-[var(--primary)] shrink-0" />
              <span className="text-xl sm:text-2xl font-bold tabular-nums">{value}</span>
            </div>
            <p className="mt-2 text-xs sm:text-sm amharic font-medium leading-snug">{label}</p>
            <p className="text-[11px] text-[var(--foreground)]/50">{hint}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
