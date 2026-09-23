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

  const tabs: { id: string; label: string }[] = [{ id: "overview", label: "አጠቃላይ" }];
  if (ws.modules.includes("tasks")) tabs.push({ id: "tasks", label: "ተግባራት" });
  if (ws.modules.includes("finance")) tabs.push({ id: "finance", label: "ሂሳብ" });
  if (ws.modules.includes("inventory")) tabs.push({ id: "inventory", label: "ንብረት" });
  if (ws.modules.includes("classes")) tabs.push({ id: "classes", label: "ክፍሎች" });
  if (ws.modules.includes("attendance"))
    tabs.push({ id: "attendance", label: "መገኝት" });
  if (ws.modules.includes("correspondence"))
    tabs.push({ id: "correspondence", label: "ደብዳቤ" });
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
      {activeTab === "finance" && <FinancePanel initial={finance} />}
      {activeTab === "inventory" && <InventoryPanel initial={inventory} />}
      {activeTab === "classes" && (
        <RecordPanel
          departmentCode={slug}
          recordType="class"
          title="የትምሕርት ክፍሎች"
          initial={records.filter((r) => r.record_type === "class")}
        />
      )}
      {(activeTab === "attendance" || activeTab === "choir") && (
        <RecordPanel
          departmentCode={slug}
          recordType="attendance"
          title={activeTab === "choir" ? "የመዝሙር ልምምድ መዝገብ" : "የመገኝት መዝገብ"}
          initial={records.filter((r) => r.record_type === "attendance")}
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
      {activeTab === "media" && (
        <RecordPanel
          departmentCode={slug}
          recordType="media"
          title="ሚዲያ መዝገብ"
          initial={records.filter((r) => r.record_type === "media")}
        />
      )}
      {activeTab === "charity" && (
        <RecordPanel
          departmentCode={slug}
          recordType="event"
          title="የበጎ አድራጎት ፕሮጀክቶች"
          initial={records.filter((r) => r.record_type === "event")}
        />
      )}
    </div>
  );
}
