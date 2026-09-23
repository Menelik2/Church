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
  beneficiaries: string | null;
  start_date: string | null;
};

type MediaRow = {
  id: string;
  title_am: string;
  media_type: string | null;
  event_name: string | null;
  storage_url: string | null;
  notes: string | null;
};

type MezmurMember = {
  id: string;
  full_name_am: string;
  voice_part: string | null;
  is_active: boolean;
};

type MezmurAsset = {
  id: string;
  asset_type: string;
  name_am: string;
  quantity: number;
  condition: string | null;
  assigned_member_id: string | null;
};

type RegisterRow = {
  id: string;
  full_name_am: string;
  phone: string | null;
  registered_at: string | null;
  status: string;
  course_enrollment_id: string | null;
};

type CourseRow = {
  id: string;
  full_name_am: string;
  course_name: string;
  status: string;
  started_at: string | null;
  completed_at: string | null;
};

type CheckoutRow = {
  id: string;
  item_id: string;
  borrower_name: string;
  quantity: number;
  purpose: string | null;
  checked_out_at: string;
  due_date: string | null;
  returned_at: string | null;
  status: string;
};

type CorrRow = {
  id: string;
  direction: string;
  subject_am: string;
  from_party: string | null;
  status: string;
  routed_to_dept: string | null;
  received_at: string | null;
};

type ApprovalRow = {
  id: string;
  approval_type: string;
  title_am: string;
  amount_birr: number | null;
  status: string;
};

type DisciplineRow = {
  id: string;
  subject_name_am: string;
  reason: string;
  step: number;
  status: string;
  votes_for: number | null;
  votes_against: number | null;
  votes_total: number | null;
};

type PlanRow = {
  id: string;
  year: number;
  title_am: string;
  status: string;
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

  const activeTab = tab || "overview";
  const supabase = await createClient();

  const tasks = await safeSelect<TaskRow>(supabase, "department_tasks", (q) =>
    (q as {
      select: (s: string) => {
        eq: (c: string, v: string) => {
          order: (c: string, o: { ascending: boolean }) => {
            limit: (n: number) => PromiseLike<{ data: TaskRow[] | null; error: unknown }>;
          };
        };
      };
    })
      .select("id, title_am, status, priority, due_date")
      .eq("department_code", slug)
      .order("created_at", { ascending: false })
      .limit(50)
  );

  const finance =
    slug === "hisab" || slug === "limat"
      ? await safeSelect<FinanceRow>(supabase, "finance_entries", (q) =>
          (q as {
            select: (s: string) => {
              order: (c: string, o: { ascending: boolean }) => {
                limit: (n: number) => PromiseLike<{ data: FinanceRow[] | null; error: unknown }>;
              };
            };
          })
            .select(
              "id, entry_type, category, amount_birr, description_am, entry_date"
            )
            .order("created_at", { ascending: false })
            .limit(50)
        )
      : [];

  const inventory =
    slug === "nebrat"
      ? await safeSelect<InventoryRow>(supabase, "property_items", (q) =>
          (q as {
            select: (s: string) => {
              order: (c: string, o: { ascending: boolean }) => {
                limit: (n: number) => PromiseLike<{ data: InventoryRow[] | null; error: unknown }>;
              };
            };
          })
            .select("id, name_am, category, quantity, condition, location")
            .order("created_at", { ascending: false })
            .limit(100)
        )
      : [];

  const checkouts =
    slug === "nebrat"
      ? await safeSelect<CheckoutRow>(supabase, "property_checkouts", (q) =>
          (q as {
            select: (s: string) => {
              order: (c: string, o: { ascending: boolean }) => {
                limit: (n: number) => PromiseLike<{ data: CheckoutRow[] | null; error: unknown }>;
              };
            };
          })
            .select(
              "id, item_id, borrower_name, quantity, purpose, checked_out_at, due_date, returned_at, status"
            )
            .order("created_at", { ascending: false })
            .limit(80)
        )
      : [];

  const records = await safeSelect<RecordRow>(supabase, "department_records", (q) =>
    (q as {
      select: (s: string) => {
        eq: (c: string, v: string) => {
          order: (c: string, o: { ascending: boolean }) => {
            limit: (n: number) => PromiseLike<{ data: RecordRow[] | null; error: unknown }>;
          };
        };
      };
    })
      .select("id, title_am, record_type, record_date, body")
      .eq("department_code", slug)
      .order("created_at", { ascending: false })
      .limit(30)
  );

  const educationClasses =
    slug === "timihirt" || slug === "hitsanat"
      ? await safeSelect<ClassRow>(supabase, "education_classes", (q) =>
          (q as {
            select: (s: string) => {
              order: (c: string, o: { ascending: boolean }) => {
                limit: (n: number) => PromiseLike<{ data: ClassRow[] | null; error: unknown }>;
              };
            };
          })
            .select(
              "id, title_am, level_am, schedule_note, teacher_name, is_active"
            )
            .order("created_at", { ascending: false })
            .limit(50)
        )
      : [];

  const classAttendance =
    slug === "timihirt" || slug === "hitsanat"
      ? await safeSelect<ClassAttRow>(supabase, "class_attendance", (q) =>
          (q as {
            select: (s: string) => {
              order: (c: string, o: { ascending: boolean }) => {
                limit: (n: number) => PromiseLike<{ data: ClassAttRow[] | null; error: unknown }>;
              };
            };
          })
            .select("id, class_id, attendance_date, present_count, notes")
            .order("attendance_date", { ascending: false })
            .limit(50)
        )
      : [];

  const charityProjects =
    slug === "limat"
      ? await safeSelect<CharityRow>(supabase, "charity_projects", (q) =>
          (q as {
            select: (s: string) => {
              order: (c: string, o: { ascending: boolean }) => {
                limit: (n: number) => PromiseLike<{ data: CharityRow[] | null; error: unknown }>;
              };
            };
          })
            .select(
              "id, title_am, description, status, budget_birr, beneficiaries, start_date"
            )
            .order("created_at", { ascending: false })
            .limit(50)
        )
      : [];

  const mediaLogs =
    slug === "media"
      ? await safeSelect<MediaRow>(supabase, "media_logs", (q) =>
          (q as {
            select: (s: string) => {
              order: (c: string, o: { ascending: boolean }) => {
                limit: (n: number) => PromiseLike<{ data: MediaRow[] | null; error: unknown }>;
              };
            };
          })
            .select("id, title_am, media_type, event_name, storage_url, notes")
            .order("created_at", { ascending: false })
            .limit(50)
        )
      : [];

  const mezmurMembers =
    slug === "mezmur"
      ? await safeSelect<MezmurMember>(supabase, "mezmur_members", (q) =>
          (q as {
            select: (s: string) => {
              order: (c: string, o: { ascending: boolean }) => {
                limit: (n: number) => PromiseLike<{ data: MezmurMember[] | null; error: unknown }>;
              };
            };
          })
            .select("id, full_name_am, voice_part, is_active")
            .order("created_at", { ascending: false })
            .limit(100)
        )
      : [];

  const mezmurAssets =
    slug === "mezmur"
      ? await safeSelect<MezmurAsset>(supabase, "mezmur_assets", (q) =>
          (q as {
            select: (s: string) => {
              order: (c: string, o: { ascending: boolean }) => {
                limit: (n: number) => PromiseLike<{ data: MezmurAsset[] | null; error: unknown }>;
              };
            };
          })
            .select(
              "id, asset_type, name_am, quantity, condition, assigned_member_id"
            )
            .order("created_at", { ascending: false })
            .limit(100)
        )
      : [];

  const newMembers =
    slug === "genegnet"
      ? await safeSelect<RegisterRow>(supabase, "new_member_register", (q) =>
          (q as {
            select: (s: string) => {
              order: (c: string, o: { ascending: boolean }) => {
                limit: (n: number) => PromiseLike<{ data: RegisterRow[] | null; error: unknown }>;
              };
            };
          })
            .select(
              "id, full_name_am, phone, registered_at, status, course_enrollment_id"
            )
            .order("created_at", { ascending: false })
            .limit(100)
        )
      : [];

  const courses =
    slug === "genegnet"
      ? await safeSelect<CourseRow>(supabase, "course_enrollments", (q) =>
          (q as {
            select: (s: string) => {
              order: (c: string, o: { ascending: boolean }) => {
                limit: (n: number) => PromiseLike<{ data: CourseRow[] | null; error: unknown }>;
              };
            };
          })
            .select(
              "id, full_name_am, course_name, status, started_at, completed_at"
            )
            .order("created_at", { ascending: false })
            .limit(100)
        )
      : [];

  const chairCorr =
    slug === "sebabi"
      ? await safeSelect<CorrRow>(supabase, "official_correspondence", (q) =>
          (q as {
            select: (s: string) => {
              order: (c: string, o: { ascending: boolean }) => {
                limit: (n: number) => PromiseLike<{ data: CorrRow[] | null; error: unknown }>;
              };
            };
          })
            .select(
              "id, direction, subject_am, from_party, status, routed_to_dept, received_at"
            )
            .order("created_at", { ascending: false })
            .limit(80)
        )
      : [];

  const chairApprovals =
    slug === "sebabi"
      ? await safeSelect<ApprovalRow>(supabase, "chair_approvals", (q) =>
          (q as {
            select: (s: string) => {
              order: (c: string, o: { ascending: boolean }) => {
                limit: (n: number) => PromiseLike<{ data: ApprovalRow[] | null; error: unknown }>;
              };
            };
          })
            .select("id, approval_type, title_am, amount_birr, status")
            .order("created_at", { ascending: false })
            .limit(80)
        )
      : [];

  const chairDiscipline =
    slug === "sebabi"
      ? await safeSelect<DisciplineRow>(supabase, "executive_discipline", (q) =>
          (q as {
            select: (s: string) => {
              order: (c: string, o: { ascending: boolean }) => {
                limit: (n: number) => PromiseLike<{ data: DisciplineRow[] | null; error: unknown }>;
              };
            };
          })
            .select(
              "id, subject_name_am, reason, step, status, votes_for, votes_against, votes_total"
            )
            .order("created_at", { ascending: false })
            .limit(50)
        )
      : [];

  const chairPlans =
    slug === "sebabi"
      ? await safeSelect<PlanRow>(supabase, "annual_action_plans", (q) =>
          (q as {
            select: (s: string) => {
              order: (c: string, o: { ascending: boolean }) => {
                limit: (n: number) => PromiseLike<{ data: PlanRow[] | null; error: unknown }>;
              };
            };
          })
            .select("id, year, title_am, status")
            .order("created_at", { ascending: false })
            .limit(40)
        )
      : [];

  const tabs: { id: string; label: string }[] = [{ id: "overview", label: "አጠቃላይ" }];
  if (ws.modules.includes("tasks")) tabs.push({ id: "tasks", label: "ተግባራት" });
  if (ws.modules.includes("approvals") && slug === "sebabi")
    tabs.push({ id: "approvals", label: "ሰብሳቢ ሥራ" });
  if (ws.modules.includes("finance")) tabs.push({ id: "finance", label: "ሂሳብ" });
  if (ws.modules.includes("inventory")) {
    tabs.push({ id: "inventory", label: "ንብረት" });
    tabs.push({ id: "checkout", label: "ውሰት" });
  }
  if (ws.modules.includes("classes")) tabs.push({ id: "classes", label: "ክፍሎች" });
  if (ws.modules.includes("attendance") && slug !== "mezmur")
    tabs.push({ id: "attendance", label: "መገኝት" });
  if (ws.modules.includes("correspondence") && slug !== "sebabi")
    tabs.push({ id: "correspondence", label: "ደብዳቤ / መመዝገቢያ" });
  if (ws.modules.includes("media")) tabs.push({ id: "media", label: "ሚዲያ" });
  if (ws.modules.includes("charity")) tabs.push({ id: "charity", label: "በጎ አድራጎት" });
  if (ws.modules.includes("choir")) tabs.push({ id: "choir", label: "መዝሙር" });

  return (
    <div className="pb-16">
      <Link
        href="/admin/workspace"
        className="inline-flex items-center gap-1 text-sm text-[var(--primary)] amharic mb-4"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> ሁሉም ክፍሎች
      </Link>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 mb-6">
        <p className="text-xs font-medium text-[var(--color-gold-600)]">
          {ws.is_leadership ? "አመራር" : "ክፍል"} · {ws.title_en}
        </p>
        <h1 className="text-2xl font-bold amharic text-[var(--primary)] mt-1">
          {ws.title_am}
        </h1>
        <p className="mt-2 text-sm amharic text-[var(--foreground)]/70 leading-relaxed">
          {ws.description_am}
        </p>
      </div>

      <div className="flex gap-1 overflow-x-auto pb-2 mb-5 -mx-1 px-1 scrollbar-none">
        {tabs.map((t) => (
          <Link
            key={t.id}
            href={`/admin/workspace/${slug}?tab=${t.id}`}
            className={
              activeTab === t.id
                ? "shrink-0 rounded-full bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-white amharic"
                : "shrink-0 rounded-full bg-[var(--muted)] px-4 py-2 text-xs font-medium text-[var(--foreground)]/70 amharic"
            }
          >
            {t.label}
          </Link>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {ws.actions.map((a) => (
              <Link
                key={a.href + a.label_am}
                href={a.href}
                className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-4 active:scale-[0.99] transition"
              >
                <span className="font-semibold amharic text-[var(--primary)]">
                  {a.label_am}
                </span>
                <ExternalLink className="h-4 w-4 text-[var(--foreground)]/30" />
              </Link>
            ))}
          </div>
          <div className="rounded-2xl border border-[var(--border)] p-4">
            <p className="text-xs font-semibold amharic text-[var(--foreground)]/50 mb-2">
              የቅርብ ተግባራት
            </p>
            <TaskPanel departmentCode={slug} initial={tasks} />
          </div>
        </div>
      )}

      {activeTab === "tasks" && (
        <TaskPanel departmentCode={slug} initial={tasks} />
      )}
      {activeTab === "approvals" && slug === "sebabi" && (
        <ChairPanel
          initialCorr={chairCorr}
          initialApprovals={chairApprovals}
          initialDiscipline={chairDiscipline}
          initialPlans={chairPlans}
        />
      )}
      {activeTab === "finance" && <FinancePanel initial={finance} />}
      {activeTab === "inventory" && <InventoryPanel initial={inventory} />}
      {activeTab === "checkout" && (
        <CheckoutPanel
          items={inventory.map((i) => ({
            id: i.id,
            name_am: i.name_am,
            quantity: i.quantity,
          }))}
          initial={checkouts}
        />
      )}
      {activeTab === "classes" && (
        <ClassesPanel
          initialClasses={educationClasses}
          initialAttendance={classAttendance}
        />
      )}
      {activeTab === "attendance" && (
        <RecordPanel
          departmentCode={slug}
          recordType="attendance"
          title="የመገኝት መዝገብ"
          initial={records.filter((r) => r.record_type === "attendance")}
        />
      )}
      {activeTab === "choir" && (
        <MezmurPanel
          initialMembers={mezmurMembers}
          initialAssets={mezmurAssets}
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
