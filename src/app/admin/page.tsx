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
  AlertTriangle,
  Sparkles,
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
    { label: "አንቀጾች", value: articlesCount, href: "/admin/articles", icon: BookOpen },
    { label: "ወቅታዊ ጉዳዮች", value: announcementsCount, href: "/admin/announcements", icon: Megaphone },
    {
      label: "ያልተነቡ መልዕክቶች",
      value: unreadMessages,
      href: "/admin/messages",
      icon: Mail,
      alert: unreadMessages > 0,
    },
    { label: "ዝግጅቶች", value: eventsCount, href: "/admin/events", icon: Calendar },
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
      alert: pendingMembership > 0,
    },
    {
      label: "መቀበያ",
      value: onboardingOpen,
      href: "/admin/operations/onboarding",
      icon: ClipboardList,
      hint: "ያልተጠናቀቀ",
      alert: onboardingOpen > 0,
    },
    {
      label: "መገኘት ማንቂያ",
      value: attendanceAlerts,
      href: "/admin/operations/attendance",
      icon: UserCheck,
      hint: "2 ሳምንት+",
      alert: attendanceAlerts > 0,
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

  const roleLabel: Record<string, string> = {
    super_admin: "ሱፐር አድሚን",
    admin: "አድሚን",
    editor: "አርታዒ",
  };

  const alertTotal =
    (unreadMessages > 0 ? 1 : 0) +
    (pendingMembership > 0 ? 1 : 0) +
    (onboardingOpen > 0 ? 1 : 0) +
    (attendanceAlerts > 0 ? 1 : 0);

  return (
    <div className="pb-8">
      <section className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--color-burgundy-950)] via-[var(--color-burgundy-900)] to-[var(--color-burgundy-800)] p-5 sm:p-6 shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_90%_20%,_rgba(201,145,47,0.2),_transparent_50%)]" />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-gold-300)] amharic">
              አስተዳደር ዳሽቦርድ
            </p>
            <h1 className="mt-1 text-xl font-bold text-white amharic sm:text-2xl">
              እንኳን ደህና መጡ፣ {displayName}
            </h1>
            <p className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-white/80 amharic">
              <Sparkles className="h-3 w-3 text-[var(--color-gold-300)]" />
              {roleLabel[profile.role] ?? profile.role}
            </p>
          </div>
          {alertTotal > 0 && (
            <div className="flex items-center gap-2 rounded-xl border border-amber-400/40 bg-amber-500/15 px-3 py-2 text-amber-100">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span className="text-xs font-semibold amharic">{alertTotal} ትኩረት የሚሹ</span>
            </div>
          )}
        </div>
      </section>

      <h2 className="mt-8 mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[var(--foreground)]/45">
        <Workflow className="h-3.5 w-3.5" />
        ሥራ አስፈጻሚ
      </h2>
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-5">
        {opsCards.map(({ label, value, href, icon: Icon, hint, alert }) => (
          <Link
            key={href}
            href={href}
            className={`rounded-2xl border bg-[var(--card)] p-4 shadow-sm transition hover:shadow-md active:scale-[0.99] ${
              alert
                ? "border-amber-300/80 ring-1 ring-amber-200/50"
                : "border-[var(--border)] hover:border-[var(--color-gold-400)]"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                  alert
                    ? "bg-amber-100 text-amber-700"
                    : "bg-[var(--primary)]/10 text-[var(--primary)]"
                }`}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span className="text-xl font-bold tabular-nums text-[var(--foreground)]">{value}</span>
            </div>
            <p className="mt-2.5 text-xs sm:text-sm amharic font-semibold leading-snug text-[var(--foreground)]/85">
              {label}
            </p>
            <p className="text-[11px] text-[var(--foreground)]/40">{hint}</p>
          </Link>
        ))}
      </div>

      <h2 className="mt-8 mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[var(--foreground)]/45">
        <BookOpen className="h-3.5 w-3.5" />
        ይዘት
      </h2>
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {contentCards.map(({ label, value, href, icon: Icon, alert }) => (
          <Link
            key={href}
            href={href}
            className={`rounded-2xl border bg-[var(--card)] p-4 sm:p-5 shadow-sm transition hover:shadow-md active:scale-[0.99] ${
              alert
                ? "border-amber-300/80"
                : "border-[var(--border)] hover:border-[var(--color-gold-400)]"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
                <Icon className="h-4 w-4" />
              </span>
              <span className="text-xl sm:text-2xl font-bold tabular-nums">{value}</span>
            </div>
            <p className="mt-2.5 text-xs sm:text-sm amharic font-medium text-[var(--foreground)]/70 leading-snug">
              {label}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Link
          href="/admin/workspace"
          className="group flex items-center gap-3 rounded-2xl border border-[var(--color-gold-300)] bg-gradient-to-br from-[var(--color-gold-50)] to-[var(--card)] p-4 sm:p-5 shadow-sm transition hover:shadow-md active:scale-[0.99]"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-gold-100)] text-[var(--color-gold-700)]">
            <LayoutGrid className="h-6 w-6" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-bold amharic text-[var(--primary)]">የክፍል ዳሽቦርዶች</p>
            <p className="text-xs amharic text-[var(--foreground)]/55 truncate">
              ሰብሳቢ · ፀሐፊ · መዝሙር · ንብረት · …
            </p>
          </div>
          <ChevronRight className="h-5 w-5 text-[var(--foreground)]/25 transition group-hover:translate-x-0.5 group-hover:text-[var(--primary)]" />
        </Link>
        <Link
          href="/admin/operations"
          className="group flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 sm:p-5 shadow-sm transition hover:border-[var(--color-gold-400)] hover:shadow-md active:scale-[0.99]"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)]">
            <Workflow className="h-6 w-6" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-bold amharic text-[var(--primary)]">ሂደቶች</p>
            <p className="text-xs amharic text-[var(--foreground)]/55 truncate">
              ጉዞ · አባልነት · መገኘት · ሰርግ · ምርጫ
            </p>
          </div>
          <ChevronRight className="h-5 w-5 text-[var(--foreground)]/25 transition group-hover:translate-x-0.5 group-hover:text-[var(--primary)]" />
        </Link>
      </div>

      <h2 className="mt-10 mb-3 flex items-center gap-2 text-sm font-bold amharic text-[var(--color-gold-700)]">
        <Crown className="h-4 w-4" /> የስራ አመራር ኮሚቴ
      </h2>
      <div className="grid gap-3 sm:grid-cols-3">
        {leadership.map((d) => (
          <Link
            key={d.code}
            href={`/admin/workspace/${d.code}`}
            className="rounded-2xl border border-[var(--color-gold-200)] bg-[var(--card)] p-4 shadow-sm transition hover:border-[var(--color-gold-400)] hover:shadow-md active:scale-[0.99]"
          >
            <p className="font-bold amharic text-[var(--primary)] text-base">{d.title_am}</p>
            <p className="text-xs text-[var(--foreground)]/45">{d.title_en}</p>
            <p className="mt-2 text-xs amharic text-[var(--foreground)]/60 line-clamp-2">{d.description_am}</p>
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
            className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-3.5 shadow-sm transition hover:border-[var(--color-gold-400)] hover:shadow-md active:scale-[0.99]"
          >
            <p className="text-sm font-semibold amharic text-[var(--primary)] leading-snug">{d.title_am}</p>
            <p className="mt-0.5 text-[10px] text-[var(--foreground)]/45">{d.title_en}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
