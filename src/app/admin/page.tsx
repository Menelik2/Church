import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";
import { DEPARTMENT_WORKSPACES } from "@/data/department-workspaces";
import {
  BookOpen, Megaphone, Mail, Calendar, LayoutGrid, Workflow, Crown, Building2, ChevronRight,
} from "lucide-react";

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
    supabase.from("announcements").select("*", { count: "exact", head: true }).eq("published", true),
    supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("is_read", false),
    supabase.from("events").select("*", { count: "exact", head: true }).eq("published", true),
  ]);

  const cards = [
    { label: "አንቀጾች", value: articlesCount ?? 0, href: "/admin/articles", icon: BookOpen },
    { label: "ማስታወቂያዎች", value: announcementsCount ?? 0, href: "/admin/announcements", icon: Megaphone },
    { label: "ያልተነበቡ መልዕክቶች", value: unreadMessages ?? 0, href: "/admin/messages", icon: Mail },
    { label: "ዝግጅቶች", value: eventsCount ?? 0, href: "/admin/events", icon: Calendar },
  ];

  const leadership = DEPARTMENT_WORKSPACES.filter((d) => d.is_leadership);
  const depts = DEPARTMENT_WORKSPACES.filter((d) => !d.is_leadership);

  return (
    <div className="pb-12">
      <h1 className="text-2xl font-bold text-[var(--primary)] amharic">ዳሽቦርድ</h1>
      <p className="mt-1 text-sm text-[var(--foreground)]/60">
        እንኳን ደህና መጡ፣ {profile.full_name_am || profile.full_name_en || profile.email}
        <span className="ml-2 rounded-full bg-[var(--primary)]/10 px-2 py-0.5 text-xs text-[var(--primary)]">{profile.role}</span>
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, href, icon: Icon }) => (
          <Link key={href} href={href} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 hover:border-[var(--color-burgundy-300)] transition">
            <div className="flex items-center justify-between">
              <Icon className="h-5 w-5 text-[var(--primary)]" />
              <span className="text-2xl font-bold tabular-nums">{value}</span>
            </div>
            <p className="mt-2 text-sm amharic text-[var(--foreground)]/70">{label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Link href="/admin/workspace" className="flex items-center gap-3 rounded-2xl border border-[var(--color-gold-300)] bg-gradient-to-br from-[var(--color-gold-50)] to-white p-5">
          <LayoutGrid className="h-8 w-8 text-[var(--color-gold-600)]" />
          <div>
            <p className="font-bold amharic text-[var(--primary)]">የክፍል ዳሽቦርዶች</p>
            <p className="text-xs amharic text-[var(--foreground)]/60">ሰብሳቢ · ፀሐፊ · 10 ክፍሎች — ሙሉ ስራ</p>
          </div>
          <ChevronRight className="ml-auto h-5 w-5 text-[var(--foreground)]/30" />
        </Link>
        <Link href="/admin/operations" className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
          <Workflow className="h-8 w-8 text-[var(--primary)]" />
          <div>
            <p className="font-bold amharic text-[var(--primary)]">ሂደቶች</p>
            <p className="text-xs amharic text-[var(--foreground)]/60">አባልነት · ሰርግ · ምርጫ · ዲስፕሊን</p>
          </div>
          <ChevronRight className="ml-auto h-5 w-5 text-[var(--foreground)]/30" />
        </Link>
      </div>

      <h2 className="mt-10 mb-3 flex items-center gap-2 text-sm font-bold amharic text-[var(--color-gold-600)]">
        <Crown className="h-4 w-4" /> የስራ አመራር ኮሚቴ
      </h2>
      <div className="grid gap-3 sm:grid-cols-3">
        {leadership.map((d) => (
          <Link key={d.code} href={`/admin/workspace/${d.code}`}
            className="rounded-2xl border border-[var(--color-gold-200)] bg-[var(--card)] p-4 hover:border-[var(--color-gold-400)] transition">
            <p className="font-bold amharic text-[var(--primary)] text-lg">{d.title_am}</p>
            <p className="text-xs text-[var(--foreground)]/50">{d.title_en}</p>
            <p className="mt-2 text-xs amharic text-[var(--foreground)]/65 line-clamp-2">{d.description_am}</p>
          </Link>
        ))}
      </div>

      <h2 className="mt-10 mb-3 flex items-center gap-2 text-sm font-bold amharic text-[var(--primary)]">
        <Building2 className="h-4 w-4" /> ክፍሎች (10)
      </h2>
      <div className="grid gap-2.5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        {depts.map((d) => (
          <Link key={d.code} href={`/admin/workspace/${d.code}`}
            className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-3.5 hover:border-[var(--color-burgundy-300)] transition">
            <p className="text-sm font-semibold amharic text-[var(--primary)] leading-snug">{d.title_am}</p>
            <p className="mt-0.5 text-[10px] text-[var(--foreground)]/45">{d.title_en}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
