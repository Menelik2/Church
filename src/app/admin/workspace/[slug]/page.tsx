import Link from "next/link";
import { notFound } from "next/navigation";
import { requireStaff } from "@/lib/auth/require-admin";
import { getWorkspace } from "@/data/department-workspaces";
import { createClient } from "@/lib/supabase/server";
import { safeSelect } from "@/lib/supabase/safe-count";
import { TaskPanel } from "@/components/workspace/TaskPanel";
import { FinancePanel } from "@/components/workspace/FinancePanel";
import { InventoryPanel } from "@/components/workspace/InventoryPanel";
import { RecordPanel } from "@/components/workspace/RecordPanel";
import { ClassesPanel } from "@/components/workspace/ClassesPanel";
import { CharityPanel } from "@/components/workspace/CharityPanel";
import { MediaPanel } from "@/components/workspace/MediaPanel";
import { MezmurPanel } from "@/components/workspace/MezmurPanel";
import { RelationsPanel } from "@/components/workspace/RelationsPanel";
import { CheckoutPanel } from "@/components/workspace/CheckoutPanel";
import { ChairPanel } from "@/components/workspace/ChairPanel";
import { ChildrenPanel } from "@/components/workspace/ChildrenPanel";
import { ArtsPanel } from "@/components/workspace/ArtsPanel";
import { DeptDisciplinePanel } from "@/components/workspace/DeptDisciplinePanel";
import { ArrowLeft, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

type TaskRow = {
  id: string;
  title_am: string;
  status: string;
  priority: string;
  due_date: string | null;
};

type FinanceRow = {
  id: string;
  entry_type: string;
  category: string | null;
  amount_birr: number;
  description_am: string | null;
  entry_date: string | null;
};

type InventoryRow = {
  id: string;
  name_am: string;
  category: string | null;
  quantity: number;
  condition: string | null;
  location: string | null;
};

type RecordRow = {
  id: string;
  title_am: string;
  record_type: string;
  record_date: string | null;
  body: string | null;
};

type ClassRow = {
  id: string;
  title_am: string;
  level_am: string | null;
  schedule_note: string | null;
  teacher_name: string | null;
  is_active: boolean;
};

type ClassAttRow = {
  id: string;
  class_id: string;
  attendance_date: string;
  present_count: number;
  notes: string | null;
};

type CharityRow = {
  id: string;
  title_am: string;
  description: string | null;
  status: string;
  budget_birr: number | null;
  spent_birr: number | null;
};

type MediaRow = {
  id: string;
  title_am: string;
  media_type: string;
  event_date: string | null;
  notes: string | null;
};

const TAB_LABELS: Record<string, string> = {
  overview: "አጠቃላይ",
  tasks: "ተግባራት",
  finance: "ሒሳብ",
  inventory: "ንብረት",
  checkout: "ውሰት",
  correspondence: "ደብዳቤ",
  classes: "ክፍሎች",
  attendance: "መገኘት",
  charity: "በጎ አድራጎት",
  media: "ሚዲያ",
  choir: "መዝሙር",
  children: "ሕፃናት",
  arts: "ኪነጥበብ",
  discipline: "ቁጥጥር",
  approvals: "ፈቃድ",
  meetings: "ስብሰባ",
  reports: "ሪፖርት",
};

export default async function DepartmentWorkspacePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  await requireStaff();
  const { slug } = await params;
  const { tab } = await searchParams;
  const ws = getWorkspace(slug);
  if (!ws) notFound();

  const activeTab =
    tab && (ws.modules.includes(tab as never) || tab === "checkout")
      ? tab
      : "overview";

  const supabase = await createClient();

  const [
    tasks,
    finance,
    inventory,
    records,
    classes,
    classAtt,
    charityProjects,
    mediaLogs,
    mezmurRehearsals,
    mezmurAssets,
    mezmurSongs,
    mezmurServices,
    newMembers,
    courses,
    checkouts,
    correspondence,
    approvals,
    disciplineCases,
    actionPlans,
    childrenGroups,
    childrenActivities,
    artsEvents,
    deptDiscipline,
  ] = await Promise.all([
    safeSelect<TaskRow>(
      supabase
        .from("department_tasks")
        .select("id, title_am, status, priority, due_date")
        .eq("department_code", slug)
        .order("created_at", { ascending: false })
        .limit(50)
    ),
    safeSelect<FinanceRow>(
      supabase
        .from("department_finance")
        .select("id, entry_type, category, amount_birr, description_am, entry_date")
        .eq("department_code", slug)
        .order("entry_date", { ascending: false })
        .limit(50)
    ),
    safeSelect<InventoryRow>(
      supabase
        .from("department_inventory")
        .select("id, name_am, category, quantity, condition, location")
        .eq("department_code", slug)
        .order("name_am")
        .limit(100)
    ),
    safeSelect<RecordRow>(
      supabase
        .from("department_records")
        .select("id, title_am, record_type, record_date, body")
        .eq("department_code", slug)
        .order("record_date", { ascending: false })
        .limit(50)
    ),
    safeSelect<ClassRow>(
      supabase
        .from("department_classes")
        .select("id, title_am, level_am, schedule_note, teacher_name, is_active")
        .eq("department_code", slug)
        .order("title_am")
    ),
    safeSelect<ClassAttRow>(
      supabase
        .from("department_class_attendance")
        .select("id, class_id, attendance_date, present_count, notes")
        .order("attendance_date", { ascending: false })
        .limit(30)
    ),
    safeSelect<CharityRow>(
      supabase
        .from("charity_projects")
        .select("id, title_am, description, status, budget_birr, spent_birr")
        .order("created_at", { ascending: false })
        .limit(30)
    ),
    safeSelect<MediaRow>(
      supabase
        .from("media_logs")
        .select("id, title_am, media_type, event_date, notes")
        .order("event_date", { ascending: false })
        .limit(30)
    ),
    safeSelect(
      supabase
        .from("mezmur_rehearsals")
        .select("*")
        .order("rehearsal_date", { ascending: false })
        .limit(40)
    ),
    safeSelect(
      supabase.from("mezmur_assets").select("*").order("name_am").limit(100)
    ),
    safeSelect(
      supabase.from("mezmur_songs").select("*").order("title_am").limit(100)
    ),
    safeSelect(
      supabase
        .from("mezmur_services")
        .select("*")
        .order("service_date", { ascending: false })
        .limit(40)
    ),
    safeSelect(
      supabase
        .from("new_member_register")
        .select("*")
        .order("registered_at", { ascending: false })
        .limit(50)
    ),
    safeSelect(
      supabase
        .from("course_enrollments")
        .select("*")
        .order("enrolled_at", { ascending: false })
        .limit(50)
    ),
    safeSelect(
      supabase
        .from("property_checkouts")
        .select("*")
        .order("checked_out_at", { ascending: false })
        .limit(50)
    ),
    safeSelect(
      supabase
        .from("official_correspondence")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(40)
    ),
    safeSelect(
      supabase
        .from("chair_approvals")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(40)
    ),
    safeSelect(
      supabase
        .from("executive_discipline")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(30)
    ),
    safeSelect(
      supabase
        .from("annual_action_plans")
        .select("*")
        .order("year", { ascending: false })
        .limit(20)
    ),
    safeSelect(
      supabase.from("children_groups").select("*").order("name_am").limit(40)
    ),
    safeSelect(
      supabase
        .from("children_activities")
        .select("*")
        .order("activity_date", { ascending: false })
        .limit(40)
    ),
    safeSelect(
      supabase
        .from("arts_events")
        .select("*")
        .order("event_date", { ascending: false })
        .limit(40)
    ),
    safeSelect(
      supabase
        .from("department_discipline_cases")
        .select("*")
        .eq("department_code", slug)
        .order("created_at", { ascending: false })
        .limit(30)
    ),
  ]);

  const tabs = [
    "overview",
    ...ws.modules.filter((m) => m !== "overview"),
    ...(slug === "nebrat" ? (["checkout"] as const) : []),
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link
            href="/admin/workspace"
            className="mb-2 inline-flex items-center gap-1 text-xs text-[var(--foreground)]/50 hover:text-[var(--primary)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            ክፍሎች
          </Link>
          <h1 className="text-xl font-bold amharic text-[var(--primary)] sm:text-2xl">
            {ws.title_am}
          </h1>
          <p className="mt-0.5 text-sm text-[var(--foreground)]/55">{ws.title_en}</p>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--foreground)]/70 amharic">
            {ws.description_am}
          </p>
        </div>
        <Link
          href={`/departments/${slug}`}
          className="inline-flex items-center gap-1 rounded-xl border border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--foreground)]/70 hover:bg-[var(--muted)]"
        >
          የህዝብ ገጽ <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="flex flex-wrap gap-1.5 border-b border-[var(--border)] pb-2">
        {tabs.map((t) => {
          const href =
            t === "overview"
              ? `/admin/workspace/${slug}`
              : `/admin/workspace/${slug}?tab=${t}`;
          const isActive = activeTab === t;
          return (
            <Link
              key={t}
              href={href}
              className={
                isActive
                  ? "rounded-lg bg-[var(--primary)] px-3 py-1.5 text-xs font-semibold text-white amharic"
                  : "rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--foreground)]/60 hover:bg-[var(--muted)] amharic"
              }
            >
              {TAB_LABELS[t] ?? t}
            </Link>
          );
        })}
      </div>

      {activeTab === "overview" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ws.actions.map((a) => (
            <Link
              key={a.href + a.label_am}
              href={a.href}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm transition hover:border-[var(--color-gold-400)] hover:shadow-md"
            >
              <p className="text-sm font-semibold amharic text-[var(--primary)]">
                {a.label_am}
              </p>
              <p className="mt-1 text-[11px] text-[var(--foreground)]/45">
                {TAB_LABELS[a.module] ?? a.module}
              </p>
            </Link>
          ))}
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-4 sm:col-span-2 lg:col-span-3">
            <p className="text-xs font-medium text-[var(--foreground)]/50 amharic">
              የቅርብ ጊዜ ተግባራት ({tasks.length})
            </p>
            {tasks.length === 0 ? (
              <p className="mt-2 text-sm text-[var(--foreground)]/40 amharic">
                ምንም ተግባር የለም — ከ«ተግባራት» ትር ያክሉ።
              </p>
            ) : (
              <ul className="mt-2 space-y-1.5">
                {tasks.slice(0, 5).map((t) => (
                  <li
                    key={t.id}
                    className="flex items-center justify-between gap-2 text-sm amharic"
                  >
                    <span>{t.title_am}</span>
                    <span className="shrink-0 text-[11px] text-[var(--foreground)]/40">
                      {t.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {activeTab === "tasks" && (
        <TaskPanel departmentCode={slug} initial={tasks} />
      )}
      {activeTab === "finance" && (
        <FinancePanel departmentCode={slug} initial={finance} />
      )}
      {activeTab === "inventory" && (
        <InventoryPanel departmentCode={slug} initial={inventory} />
      )}
      {activeTab === "checkout" && (
        <CheckoutPanel initialInventory={inventory} initialCheckouts={checkouts} />
      )}
      {activeTab === "classes" && (
        <ClassesPanel
          departmentCode={slug}
          initialClasses={classes}
          initialAttendance={classAtt}
        />
      )}
      {activeTab === "attendance" && (
        <ClassesPanel
          departmentCode={slug}
          initialClasses={classes}
          initialAttendance={classAtt}
          focusAttendance
        />
      )}
      {activeTab === "choir" && (
        <MezmurPanel
          initialRehearsals={mezmurRehearsals}
          initialAssets={mezmurAssets}
          initialSongs={mezmurSongs}
          initialServices={mezmurServices}
        />
      )}
      {activeTab === "children" && (
        <ChildrenPanel
          initialGroups={childrenGroups}
          initialActivities={childrenActivities}
        />
      )}
      {activeTab === "arts" && <ArtsPanel initial={artsEvents} />}
      {activeTab === "discipline" && (
        <DeptDisciplinePanel
          departmentCode={slug}
          initial={deptDiscipline}
        />
      )}
      {activeTab === "approvals" && (
        <ChairPanel
          initialCorrespondence={correspondence}
          initialApprovals={approvals}
          initialDiscipline={disciplineCases}
          initialPlans={actionPlans}
        />
      )}
      {activeTab === "correspondence" &&
        (slug === "genegnet" ? (
          <RelationsPanel
            initialRegister={newMembers}
            initialCourses={courses}
          />
        ) : (
          <RecordPanel
            departmentCode={slug}
            recordType="correspondence"
            title="ደብዳቤና ማስታወሻ"
            initial={records.filter((r) => r.record_type === "correspondence")}
          />
        ))}
      {activeTab === "media" && <MediaPanel initial={mediaLogs} />}
      {activeTab === "charity" && <CharityPanel initial={charityProjects} />}
    </div>
  );
}
