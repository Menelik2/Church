import Link from "next/link";
import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";
import { safeCount } from "@/lib/supabase/safe-count";
import { DEPARTMENT_WORKSPACES } from "@/data/department-workspaces";
import {
  BookOpen,
  Megaphone,
  Mail,
  Calendar,
  LayoutGrid,
  Workflow,
  Crown,
  Building2,
  ChevronRight,
  UserPlus,
  ClipboardList,
  UserCheck,
  GitBranch,
  Users,
} from "lucide-react";

export const dynamic = "force-dynamic";

const MS_DAY = 24 * 60 * 60 * 1000;
const ALERT_DAYS = 14;

export default async function AdminDashboard() {
  const { profile } = await requireStaff();

  if (profile.role === "department_manager") {
    redirect("/admin/workspace");
  }

  const supabase = await createClient();

  const [
    articlesCount,
    announcementsCount,
    unreadMessages,
    eventsCount,
    pendingMembership,
    onboardingOpen,
    activeServants,
    activeVisitors,
  ] = await Promise.all([
    safeCount(supabase, "articles"),
    safeCount(supabase, "announcements", (q) =>
      (q as { eq: (c: string, v: boolean) => unknown }).eq("published", true)
    ),
    safeCount(supabase, "contact_messages", (q) =>
      (q as { eq: (c: string, v: boolean) => unknown }).eq("is_read", false)
    ),
    safeCount(supabase, "events", (q) =>
      (q as { eq: (c: string, v: boolean) => unknown }).eq("published", true)
    ),
    safeCount(supabase, "membership_applications", (q) =>
      (q as { eq: (c: string, v: string) => unknown }).eq("status", "pending")
    ),
    safeCount(supabase, "servants", (q) => {
      const qq = q as {
        eq: (c: string, v: string) => { is: (c: string, v: null) => unknown };
      };
      return qq.eq("status", "active").is("onboarding_completed_at", null);
    }),
    safeCount(supabase, "servants", (q) =>
      (q as { eq: (c: string, v: string) => unknown }).eq("status", "active")
    ),
    safeCount(supabase, "visitors", (q) =>
      (q as { eq: (c: string, v: string) => unknown }).eq("status", "active")
    ),
  ]);

  let attendanceAlerts = 0;
  try {
    const [{ data: active }, { data: presents }] = await Promise.all([
      supabase
        .from("servants")
        .select("id, joined_at, created_at")
        .eq("status", "active")
        .limit(500),
      supabase
        .from("servant_attendance")
        .select("servant_id, attendance_date")
        .eq("status", "present")
        .order("attendance_date", { ascending: false })
        .limit(3000),
    ]);
    const lastPresent = new Map<string, string>();
    for (const r of presents ?? []) {
      if (!lastPresent.has(r.servant_id)) {
        lastPresent.set(r.servant_id, r.attendance_date);
      }
    }
    const now = Date.now();
    for (const s of active ?? []) {
      const last =
        lastPresent.get(s.id) ||
        s.joined_at ||
        (s.created_at ? String(s.created_at).slice(0, 10) : null);
      if (!last) {
        attendanceAlerts += 1;
        continue;
      }
      const t = new Date(
        last + (last.length === 10 ? "T12:00:00Z" : "")
      ).getTime();
      if (Number.isNaN(t) || (now - t) / MS_DAY >= ALERT_DAYS) {
        attendanceAlerts += 1;
      }
    }
  } catch {
    attendanceAlerts = 0;
  }

  const contentCards = [
    {
      label: "አንቀጾች",
      value: articlesCount,
      href: "/admin/articles",
      icon: BookOpen,
    },
    {
      label: "ማስታወቂያዎች",
      value: announcementsCount,
      href: "/admin/announcements",
      icon: Megaphone,
    },
    {
      label: "ያልተነቡት መልዕክቶች",
      value: unreadMessages,
      href: "/admin/messages",
      icon: Mail,
    },
    {
      label: "ዝግጅቶች",
      value: eventsCount,
      href: "/admin/events",
      icon: Calendar,
    },
  ];

  const opsCards = [
    {
      label: "የአባል ጉዞ",
      value: activeVisitors,
      href: "/admin/operations/journey",
      icon: GitBranch,
      hint: "ጎብኝዎች",
    },
    {
      label: "አባልነት ጥያቄ",
      value: pendingMembership,
      href: "/admin/operations/membership",
      icon: UserPlus,
      hint: "በመጠባበቅ",
    },
    {
      label: "መቀበያ (onboarding)",
      value: onboardingOpen,
      href: "/admin/operations/onboarding",
      icon: ClipboardList,
      hint: "ያልተጠናቀቀ",
    },
    {
      label: "መገኘት ማንቂያ",
      value: attendanceAlerts,
      href: "/admin/operations/attendance",
      icon: UserCheck,
      hint: "2 ሳምንት+",
    },
    {
      label: "ንቁ አገልጋዮች",
      value: activeServants,
      href: "/admin/operations/servants",
      icon: Users,
      hint: "active",
    },
  ];

  const leadership = DEPARTMENT_WORKSPACES.filter((d) => d.is_leadership);
  const depts = DEPARTMENT_WORKSPACES.filter((d) => !d.is_leadership);

  const displayName =
    profile.full_name_am || profile.full_name_en || profile.email || "አስተዳዳሪ";

  return (
    <div className="pb-16">
      <h1 className="text-2xl font-bold text-[var(--primary)] amharic">
        ዳሽቦርድ
      </h1>
      <p className="mt-1 text-sm text-[var(--foreground)]/60 amharic">
        እንኳን ደህና መጡ፣ {displayName}
        <span className="ml-2 rounded-full bg-[var(--primary)]/10 px-2 py-0.5 text-xs text-[var(--primary)] font-medium">
          {profile.role}
        </span>
      </p>

      {/* Operational KPIs */}
      <h2 className="mt-8 mb-3 text-xs font-bold uppercase tracking-wide text-[var(--foreground)]/45">
        ሥራ አስፈጻሚ · Operations
      </h2>
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-5">
        {opsCards.map(({ label, value, href, icon: Icon, hint }) => (
          <Link
            key={href}
            href={href}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 hover:border-[var(--color-burgundy-300)] active:scale-[0.99] transition"
          >
            <div className="flex items-center justify-between gap-2">
              <Icon className="h-5 w-5 text-[var(--primary)] shrink-0" />
              <span className="text-xl font-bold tabular-nums">{value}</span>
            </div>
            <p className="mt-2 text-xs sm:text-sm amharic font-medium leading-snug">
              {label}
            </p>
            <p className="text-[11px] text-[var(--foreground)]/45">{hint}</p>
          </Link>
        ))}
      </div>

      {/* Content KPIs */}
      <h2 className="mt-8 mb-3 text-xs font-bold uppercase tracking-wide text-[var(--foreground)]/45">
        ይዘት · Content
      </h2>
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {contentCards.map(({ label, value, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 sm:p-5 hover:border-[var(--color-burgundy-300)] active:scale-[0.99] transition"
          >
            <div className="flex items-center justify-between gap-2">
              <Icon className="h-5 w-5 text-[var(--primary)] shrink-0" />
              <span className="text-xl sm:text-2xl font-bold tabular-nums">
                {value}
              </span>
            </div>
            <p className="mt-2 text-xs sm:text-sm amharic text-[var(--foreground)]/70 leading-snug">
              {label}
            </p>
          </Link>
        ))}
      </div>

      {/* Primary hubs */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Link
          href="/admin/workspace"
          className="flex items-center gap-3 rounded-2xl border border-[var(--color-gold-300)] bg-gradient-to-br from-[var(--color-gold-50)] to-white p-4 sm:p-5 active:scale-[0.99]"
        >
          <LayoutGrid className="h-7 w-7 sm:h-8 sm:w-8 text-[var(--color-gold-600)] shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="font-bold amharic text-[var(--primary)]">
              የክፍል ዳሽቦርዶች
            </p>
            <p className="text-xs amharic text-[var(--foreground)]/60 truncate">
              ሰብሳቢ · ፀሐፊ · መዝሙር · ንብረት · …
            </p>
          </div>
          <ChevronRight className="h-5 w-5 text-[var(--foreground)]/30 shrink-0" />
        </Link>
        <Link
          href="/admin/operations"
          className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 sm:p-5 active:scale-[0.99]"
        >
          <Workflow className="h-7 w-7 sm:h-8 sm:w-8 text-[var(--primary)] shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="font-bold amharic text-[var(--primary)]">ሂደቶች</p>
            <p className="text-xs amharic text-[var(--foreground)]/60 truncate">
              ጉዞ · አባልነት · መገኘት · ሰርግ · ምርጫ
            </p>
          </div>
          <ChevronRight className="h-5 w-5 text-[var(--foreground)]/30 shrink-0" />
        </Link>
      </div>

      <h2 className="mt-10 mb-3 flex items-center gap-2 text-sm font-bold amharic text-[var(--color-gold-600)]">
        <Crown className="h-4 w-4" /> የስራ አመራር ኮሚቴ
      </h2>
      <div className="grid gap-3 sm:grid-cols-3">
        {leadership.map((d) => (
          <Link
            key={d.code}
            href={`/admin/workspace/${d.code}`}
            className="rounded-2xl border border-[var(--color-gold-200)] bg-[var(--card)] p-4 hover:border-[var(--color-gold-400)] active:scale-[0.99] transition"
          >
            <p className="font-bold amharic text-[var(--primary)] text-lg">
              {d.title_am}
            </p>
            <p className="text-xs text-[var(--foreground)]/50">{d.title_en}</p>
            <p className="mt-2 text-xs amharic text-[var(--foreground)]/65 line-clamp-2">
              {d.description_am}
            </p>
          </Link>
        ))}
      </div>

      <h2 className="mt-10 mb-3 flex items-center gap-2 text-sm font-bold amharic text-[var(--primary)]">
        <Building2 className="h-4 w-4" /> ክፍሎች ({depts.length})
      </h2>
      <div className="grid gap-2.5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        {depts.map((d) => (
          <Link
            key={d.code}
            href={`/admin/workspace/${d.code}`}
            className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-3.5 hover:border-[var(--color-burgundy-300)] active:scale-[0.99] transition"
          >
            <p className="text-sm font-semibold amharic text-[var(--primary)] leading-snug">
              {d.title_am}
            </p>
            <p className="mt-0.5 text-[10px] text-[var(--foreground)]/45">
              {d.title_en}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
