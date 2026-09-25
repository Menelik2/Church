import Link from "next/link";
import { notFound } from "next/navigation";
import { requireStaff } from "@/lib/auth/require-admin";
import { getWorkspace, DEPARTMENT_WORKSPACES } from "@/data/department-workspaces";
import { createClient } from "@/lib/supabase/server";
import { TaskPanel } from "@/components/workspace/TaskPanel";
import { FinancePanel } from "@/components/workspace/FinancePanel";
import { InventoryPanel } from "@/components/workspace/InventoryPanel";
import { RecordPanel } from "@/components/workspace/RecordPanel";
import { ClassesPanel } from "@/components/workspace/ClassesPanel";
import { CharityPanel } from "@/components/workspace/CharityPanel";
import { MediaPanel } from "@/components/workspace/MediaPanel";
import { MezmurPanel } from "@/components/workspace/MezmurPanel";
import { MeetingPanel } from "@/components/workspace/MeetingPanel";
import { ReportPanel } from "@/components/workspace/ReportPanel";
import { RelationsPanel } from "@/components/workspace/RelationsPanel";
import { CheckoutPanel } from "@/components/workspace/CheckoutPanel";
import { ChairPanel } from "@/components/workspace/ChairPanel";
import { ChildrenPanel } from "@/components/workspace/ChildrenPanel";
import { ArtsPanel } from "@/components/workspace/ArtsPanel";
import { DeptDisciplinePanel } from "@/components/workspace/DeptDisciplinePanel";
import { ArrowLeft, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export function generateStaticParams() {
  return DEPARTMENT_WORKSPACES.map((d) => ({ slug: d.code }));
}

async function selectRows<T = Record<string, unknown>>(
  query: PromiseLike<{ data: T[] | null; error: unknown }>
): Promise<T[]> {
  try {
    const { data, error } = await query;
    if (error) return [];
    return (data as T[]) ?? [];
  } catch {
    return [];
  }
}

type TaskRow = {
  id: string;
  title_am: string;
  status: string;
  priority: string | null;
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
  body: string | null;
  record_type: string;
  record_date: string | null;
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
  meetings: "ስብሰባ",
  reports: "ሪፖርት",
  members: "አባላት",
  songs: "መዝሙር",
  services: "አገልግሎት",
  assets: "መሳሪያ",
  relations: "ግንኙነት",
  arts: "ኪነጥበብ",
  discipline: "ክትትል",
  children: "ሕፃናት",
  chair: "ሰብሳቢ",
};

export default async function WorkspacePage({
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
    mezmurMembers,
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
    selectRows<TaskRow>(
      supabase
        .from("department_tasks")
        .select("id, title_am, status, priority, due_date")
        .eq("department_code", slug)
        .order("created_at", { ascending: false })
        .limit(50)
    ),
    selectRows<FinanceRow>(
      supabase
        .from("department_finance")
        .select("id, entry_type, category, amount_birr, description_am, entry_date")
        .eq("department_code", slug)
        .order("entry_date", { ascending: false })
        .limit(50)
    ),
    selectRows<InventoryRow>(
      supabase
        .from("department_inventory")
        .select("id, name_am, category, quantity, condition, location")
        .eq("department_code", slug)
        .order("name_am")
        .limit(100)
    ),
    selectRows<RecordRow>(
      supabase
        .from("department_records")
        .select("id, title_am, record_type, record_date, body")
        .eq("department_code", slug)
        .order("record_date", { ascending: false })
        .limit(50)
    ),
    selectRows(supabase.from("education_classes").select("*").limit(50)),
    selectRows(supabase.from("class_attendance").select("*").limit(100)),
    selectRows(supabase.from("charity_projects").select("*").limit(50)),
    selectRows(supabase.from("media_logs").select("*").limit(50)),
    selectRows(supabase.from("mezmur_members").select("*").limit(100)),
    selectRows(supabase.from("mezmur_assets").select("*").limit(50)),
    selectRows(supabase.from("mezmur_songs").select("*").limit(50)),
    selectRows(supabase.from("mezmur_services").select("*").limit(50)),
    selectRows(supabase.from("new_member_register").select("*").limit(50)),
    selectRows(supabase.from("course_enrollments").select("*").limit(50)),
    selectRows(
      supabase
        .from("department_records")
        .select("id, title_am, body, record_date, meta, created_at")
        .eq("department_code", slug)
        .eq("record_type", "checkout")
        .order("created_at", { ascending: false })
        .limit(50)
    ),
    selectRows(supabase.from("official_correspondence").select("*").limit(50)),
    selectRows(supabase.from("chair_approvals").select("*").limit(50)),
    selectRows(supabase.from("executive_discipline").select("*").limit(50)),
    selectRows(supabase.from("annual_action_plans").select("*").limit(50)),
    selectRows(supabase.from("children_groups").select("*").limit(50)),
    selectRows(supabase.from("children_activities").select("*").limit(50)),
    selectRows(supabase.from("arts_events").select("*").limit(50)),
    selectRows(supabase.from("disciplinary_cases").select("*").limit(50)),
  ]);

  const tabs = [
    "overview",
    ...ws.modules,
    ...(slug === "nebrat" ? (["checkout"] as const) : []),
  ];

  return (
    <div className="pb-16 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link
            href="/admin/departments"
            className="inline-flex items-center gap-1 text-sm text-[var(--primary)] amharic mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            ክፍሎች
          </Link>
          <h1 className="text-2xl font-bold text-[var(--primary)] amharic">
            {ws.title_am}
          </h1>
          {ws.title_en && (
            <p className="text-sm text-[var(--foreground)]/55">{ws.title_en}</p>
          )}
          {ws.description_am && (
            <p className="mt-2 text-sm text-[var(--foreground)]/70 amharic max-w-xl">
              {ws.description_am}
            </p>
          )}
        </div>
        <Link
          href={`/departments/${slug}`}
          target="_blank"
          className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] px-3 py-1.5 text-xs amharic"
        >
          የህዝብ ገጽ <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="flex flex-wrap gap-1.5 border-b border-[var(--border)] pb-2">
        {tabs.map((t) => (
          <Link
            key={t}
            href={`/admin/workspace/${slug}?tab=${t}`}
            className={`rounded-full px-3 py-1.5 text-xs amharic transition ${
              activeTab === t
                ? "bg-[var(--primary)] text-white"
                : "bg-[var(--muted)]/40 text-[var(--foreground)]/70 hover:bg-[var(--muted)]"
            }`}
          >
            {TAB_LABELS[t] ?? t}
          </Link>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="ተግባራት" value={tasks.length} />
          <StatCard label="ሒሳብ" value={finance.length} />
          <StatCard label="ንብረት" value={inventory.length} />
          <StatCard label="መዝገቦች" value={records.length} />
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
        <CheckoutPanel
          departmentCode={slug}
          items={inventory.map((i) => ({
            id: i.id,
            name_am: i.name_am,
            quantity: i.quantity,
          }))}
          initial={(
            checkouts as Array<{
              id: string;
              title_am?: string;
              body?: string | null;
              created_at?: string;
              meta?: Record<string, unknown>;
            }>
          ).map((r) => {
            const m = (r.meta ?? {}) as Record<string, unknown>;
            return {
              id: r.id,
              item_id: String(m.item_id ?? ""),
              item_name:
                typeof m.item_name === "string" ? m.item_name : undefined,
              borrower_name: String(m.borrower_name ?? r.title_am ?? "—"),
              quantity: Number(m.quantity ?? 1),
              purpose: (m.purpose as string | null) ?? r.body ?? null,
              checked_out_at: String(m.checked_out_at ?? r.created_at ?? ""),
              due_date: (m.due_date as string | null) ?? null,
              returned_at: (m.returned_at as string | null) ?? null,
              status: String(m.status ?? "out"),
            };
          })}
        />
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
      {activeTab === "media" && <MediaPanel initial={mediaLogs} />}
      {activeTab === "charity" && <CharityPanel initial={charityProjects} />}
      {(activeTab === "members" ||
        activeTab === "songs" ||
        activeTab === "services" ||
        activeTab === "assets") && (
        <MezmurPanel
          initialMembers={mezmurMembers as never}
          initialAssets={mezmurAssets as never}
          initialSongs={mezmurSongs as never}
          initialServices={mezmurServices as never}
        />
      )}
      {activeTab === "relations" && (
        <RelationsPanel
          initialMembers={newMembers as never}
          initialCourses={courses as never}
        />
      )}
      {activeTab === "correspondence" && (
        <RecordPanel
          departmentCode={slug}
          recordType="correspondence"
          title="ደብዳቤና ማስታወሻ"
          initial={records.filter((r) => r.record_type === "correspondence")}
        />
      )}
      {activeTab === "meetings" && (
        <MeetingPanel
          departmentCode={slug}
          initial={
            records.filter((r) => r.record_type === "meeting") as never
          }
        />
      )}
      {activeTab === "reports" && (
        <ReportPanel
          departmentCode={slug}
          initial={
            records.filter((r) => r.record_type === "report") as never
          }
        />
      )}
      {activeTab === "arts" && <ArtsPanel initial={artsEvents as never} />}
      {activeTab === "discipline" && (
        <DeptDisciplinePanel initial={deptDiscipline as never} />
      )}
      {activeTab === "children" && (
        <ChildrenPanel
          initialGroups={childrenGroups as never}
          initialActivities={childrenActivities as never}
        />
      )}
      {activeTab === "chair" && (
        <ChairPanel
          initialCorr={correspondence as never}
          initialApprovals={approvals as never}
          initialDiscipline={disciplineCases as never}
          initialPlans={actionPlans as never}
        />
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-3">
      <p className="text-xs amharic text-[var(--foreground)]/55">{label}</p>
      <p className="text-2xl font-bold tabular-nums">{value}</p>
    </div>
  );
}
