import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";
import { BookOpen, Megaphone, Mail, Calendar } from "lucide-react";

export default async function AdminDashboard() {
  const { profile } = await requireAdmin();
  const supabase = await createClient();

  const [
    { count: articlesCount },
    { count: announcementsCount },
    { count: unreadMessages },
    { count: eventsCount },
  ] = await Promise.all([
    supabase.from("articles").select("*", { count: "exact", head: true }),
    supabase
      .from("announcements")
      .select("*", { count: "exact", head: true })
      .eq("published", true),
    supabase
      .from("contact_messages")
      .select("*", { count: "exact", head: true })
      .eq("is_read", false),
    supabase
      .from("events")
      .select("*", { count: "exact", head: true })
      .eq("published", true),
  ]);

  const cards = [
    { label: "አንቀጾች", value: articlesCount ?? 0, href: "/admin/articles", icon: BookOpen },
    { label: "ታትመው የወጡ ማስታወቂያዎች", value: announcementsCount ?? 0, href: "/admin/announcements", icon: Megaphone },
    { label: "ያልተነበቡ መልዕክቶች", value: unreadMessages ?? 0, href: "/admin/messages", icon: Mail },
    { label: "ዝግጅቶች", value: eventsCount ?? 0, href: "/admin/events", icon: Calendar },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--primary)] amharic">ዳሽቦርድ</h1>
      <p className="mt-1 text-sm text-[var(--foreground)]/60">
        እንኳን ደህና መጡ፣ {profile.full_name_am || profile.full_name_en || profile.email}
        <span className="ml-2 rounded-full bg-[var(--primary)]/10 px-2 py-0.5 text-xs text-[var(--primary)]">
          {profile.role}
        </span>
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 hover:border-[var(--color-burgundy-300)] transition"
          >
            <div className="flex items-center justify-between">
              <Icon className="h-5 w-5 text-[var(--primary)]" />
              <span className="text-2xl font-bold tabular-nums">{value}</span>
            </div>
            <p className="mt-2 text-sm amharic text-[var(--foreground)]/70">{label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
        <h2 className="font-semibold amharic text-[var(--primary)]">ፈጣን አገናኞች</h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li>
            <Link href="/rules" className="text-[var(--primary)] hover:underline">
              የሕግና ደንብ አንባቢ →
            </Link>
          </li>
          <li>
            <Link href="/admin/articles" className="text-[var(--primary)] hover:underline">
              አንቀጾችን አርትዕ →
            </Link>
          </li>
          <li>
            <Link href="/admin/announcements" className="text-[var(--primary)] hover:underline">
              አዲስ ማስታወቂያ →
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
