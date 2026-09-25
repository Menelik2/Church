"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  Search,
  Plus,
  UserCheck,
  UserX,
  Users,
  RefreshCw,
} from "lucide-react";

export type ServantRow = {
  id: string;
  full_name_am: string;
  phone: string | null;
  email: string | null;
  status: string;
  stage_service: string | null;
  journey_stage: string | null;
  is_orthodox: boolean | null;
  completed_course: boolean | null;
  accepts_doctrine: boolean | null;
  respects_bylaws: boolean | null;
  proper_attire: boolean | null;
  has_confessor: boolean | null;
  pays_monthly: boolean | null;
  church_marriage: boolean | null;
  joined_at: string | null;
  notes: string | null;
  onboarding_started_at: string | null;
  onboarding_completed_at: string | null;
  created_at: string | null;
};

const STAGE_LABEL: Record<string, string> = {
  timihirt: "ትምህርት",
  "kine-tibeb": "ኪነጥበብ",
  mezmur: "መዝሙር",
};

const STATUS_AM: Record<string, string> = {
  active: "ንቁ",
  reinstated: "ተመልሷል",
  suspended: "ታግዷል",
  inactive: "ቦዘኔ",
  applicant: "አመልካች",
  rejected: "ውድቅ",
};

const STATUS_STYLE: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200",
  reinstated: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200",
  suspended: "bg-amber-100 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200",
  inactive: "bg-[var(--muted)] text-[var(--foreground)]/60",
  applicant: "bg-sky-100 text-sky-900 dark:bg-sky-950/40 dark:text-sky-200",
  rejected: "bg-red-100 text-red-900 dark:bg-red-950/40 dark:text-red-200",
};

const JOURNEY_AM: Record<string, string> = {
  visitor: "ጎብኚ",
  registered: "ተመዝጋቢ",
  course: "ኮርስ",
  servant: "አገልጋይ",
};

function criteriaScore(s: ServantRow): number {
  return [
    s.is_orthodox,
    s.completed_course,
    s.accepts_doctrine,
    s.respects_bylaws,
    s.proper_attire,
    s.has_confessor,
    s.pays_monthly,
    !!s.stage_service,
    s.church_marriage !== false,
  ].filter(Boolean).length;
}

export function ServantsRegistry({ initial }: { initial: ServantRow[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(initial);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [showAdd, setShowAdd] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  // Add form
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [stage, setStage] = useState("timihirt");
  const [statusNew, setStatusNew] = useState("active");
  const [saving, setSaving] = useState(false);

  // Per-row note
  const [notes, setNotes] = useState<Record<string, string>>({});

  const counts = useMemo(() => {
    const c = {
      all: rows.length,
      active: 0,
      suspended: 0,
      applicant: 0,
      inactive: 0,
      rejected: 0,
    };
    for (const s of rows) {
      if (s.status === "active" || s.status === "reinstated") c.active++;
      else if (s.status === "suspended") c.suspended++;
      else if (s.status === "applicant") c.applicant++;
      else if (s.status === "inactive") c.inactive++;
      else if (s.status === "rejected") c.rejected++;
    }
    return c;
  }, [rows]);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return rows.filter((s) => {
      if (statusFilter === "active") {
        if (s.status !== "active" && s.status !== "reinstated") return false;
      } else if (statusFilter !== "all" && s.status !== statusFilter) {
        return false;
      }
      if (stageFilter !== "all" && s.stage_service !== stageFilter) return false;
      if (!qq) return true;
      return (
        s.full_name_am.toLowerCase().includes(qq) ||
        (s.phone || "").toLowerCase().includes(qq) ||
        (s.email || "").toLowerCase().includes(qq)
      );
    });
  }, [rows, q, statusFilter, stageFilter]);

  async function addServant(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("ስም ያስፈልጋል።");
      return;
    }
    setSaving(true);
    setError(null);
    setOk(null);
    try {
      const supabase = createClient();
      const now = new Date().toISOString();
      const payload = {
        full_name_am: name.trim(),
        phone: phone.trim() || null,
        email: email.trim() || null,
        status: statusNew,
        stage_service: stage || null,
        journey_stage: statusNew === "active" ? "servant" : "registered",
        joined_at: statusNew === "active" ? now.slice(0, 10) : null,
        onboarding_started_at: statusNew === "active" ? now : null,
      };
      const { data, error: dbErr } = await supabase
        .from("servants")
        .insert(payload)
        .select("*")
        .single();
      if (dbErr) {
        setError(dbErr.message);
        return;
      }
      if (data) {
        setRows((r) => [data as ServantRow, ...r]);
        try {
          await supabase.from("journey_events").insert({
            subject_type: "servant",
            subject_id: data.id,
            from_stage: null,
            to_stage: payload.journey_stage,
            note: "manual register",
          });
        } catch {
          /* optional */
        }
      }
      setName("");
      setPhone("");
      setEmail("");
      setShowAdd(false);
      setOk("አገልጋይ ተመዝግቧል።");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "መመዝገብ አልተሳካም።");
    } finally {
      setSaving(false);
    }
  }

  async function setStatus(
    id: string,
    nameAm: string,
    current: string,
    next: "active" | "suspended" | "inactive" | "rejected"
  ) {
    setBusyId(id);
    setError(null);
    setOk(null);
    const note = (notes[id] || "").trim();
    const supabase = createClient();

    const existing = rows.find((r) => r.id === id);
    const prevNotes = existing?.notes || "";
    const stamp = new Date().toISOString().slice(0, 10);
    const newNotes = note
      ? `${prevNotes ? prevNotes + "\n" : ""}[${next} ${stamp}] ${note}`
      : prevNotes || null;

    const updatePayload: Record<string, unknown> = {
      status: next,
      updated_at: new Date().toISOString(),
    };
    if (newNotes) updatePayload.notes = newNotes;
    if (next === "active") {
      updatePayload.journey_stage = "servant";
      if (!existing?.joined_at) {
        updatePayload.joined_at = new Date().toISOString().slice(0, 10);
      }
    }

    const { error: dbErr } = await supabase
      .from("servants")
      .update(updatePayload)
      .eq("id", id);

    if (dbErr) {
      setError(dbErr.message);
      setBusyId(null);
      return;
    }

    setRows((list) =>
      list.map((r) =>
        r.id === id
          ? {
              ...r,
              status: next,
              notes: (updatePayload.notes as string) ?? r.notes,
              journey_stage:
                next === "active" ? "servant" : r.journey_stage,
            }
          : r
      )
    );

    // Notifications + journey (best-effort)
    try {
      if (next === "suspended" || next === "active") {
        await supabase.from("membership_notifications").insert({
          servant_id: id,
          kind: next === "suspended" ? "suspended" : "reinstated",
          title_am:
            next === "suspended" ? `ታግዷል — ${nameAm}` : `ተመልሷል — ${nameAm}`,
          body_am:
            note ||
            (next === "suspended"
              ? "ከአገልግሎት ታግዷል።"
              : "መስፈርቶች ከተረጋገጡ በኋላ ወደ አገልጋይነት ተመልሷል።"),
          recipient_name: nameAm,
          recipient_phone: existing?.phone,
          recipient_email: existing?.email,
        });
      }
      await supabase.from("journey_events").insert({
        subject_type: "servant",
        subject_id: id,
        from_stage: current,
        to_stage: next,
        note: note || `status → ${next}`,
      });
    } catch {
      /* non-blocking */
    }

    setNotes((n) => ({ ...n, [id]: "" }));
    setOk(
      next === "suspended"
        ? `${nameAm} ታግዷል።`
        : next === "active"
          ? `${nameAm} ንቁ/ተመልሷል።`
          : `ሁኔታ ተቀይሯል።`
    );
    setBusyId(null);
    router.refresh();
  }

  return (
    <div className="space-y-5">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950/30 dark:text-red-200">
          {error}
        </div>
      )}
      {ok && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:bg-emerald-950/30">
          {ok}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { key: "all", label: "ሁሉም", n: counts.all, icon: Users },
          { key: "active", label: "ንቁ", n: counts.active, icon: UserCheck },
          { key: "suspended", label: "ታግዷል", n: counts.suspended, icon: UserX },
          { key: "applicant", label: "አመልካች", n: counts.applicant, icon: RefreshCw },
        ].map(({ key, label, n, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setStatusFilter(key)}
            className={`rounded-2xl border p-3 text-left transition ${
              statusFilter === key
                ? "border-[var(--primary)] bg-[var(--primary)]/5 ring-1 ring-[var(--primary)]/30"
                : "border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)]"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--foreground)]/50 amharic">{label}</span>
              <Icon className="h-3.5 w-3.5 text-[var(--foreground)]/30" />
            </div>
            <p className="mt-1 text-xl font-bold text-[var(--primary)]">{n}</p>
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--foreground)]/40" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ስም / ስልክ / ኢሜይል ፈልግ…"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] py-2.5 pl-10 pr-3 text-sm amharic focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)]"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm amharic"
          >
            <option value="all">ሁሉም መድረክ</option>
            <option value="timihirt">ትምህርት</option>
            <option value="kine-tibeb">ኪነጥበብ</option>
            <option value="mezmur">መዝሙር</option>
          </select>
          <button
            type="button"
            onClick={() => setShowAdd((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white amharic"
          >
            <Plus className="h-4 w-4" /> አዲስ አገልጋይ
          </button>
        </div>
      </div>

      {/* Add form */}
      {showAdd && (
        <form
          onSubmit={addServant}
          className="grid gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 sm:grid-cols-2"
        >
          <p className="sm:col-span-2 text-sm font-semibold amharic text-[var(--primary)]">
            በእጅ መመዝገብ (አንቀጽ 14)
          </p>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ሙሉ ስም *"
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm amharic"
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="ስልክ"
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ኢሜይል"
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm"
          />
          <select
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm amharic"
          >
            <option value="timihirt">ትምህርት</option>
            <option value="kine-tibeb">ኪነጥበብ</option>
            <option value="mezmur">መዝሙር</option>
          </select>
          <select
            value={statusNew}
            onChange={(e) => setStatusNew(e.target.value)}
            className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm amharic"
          >
            <option value="active">ንቁ አገልጋይ</option>
            <option value="applicant">አመልካች</option>
          </select>
          <div className="sm:col-span-2 flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50 amharic"
            >
              {saving ? "እየተቀመጠ…" : "መዝግብ"}
            </button>
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm amharic"
            >
              ሰርዝ
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-[var(--border)]">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-[var(--muted)] text-left">
            <tr>
              <th className="px-4 py-3 amharic">ስም</th>
              <th className="px-4 py-3 amharic">ሁኔታ</th>
              <th className="px-4 py-3 amharic">መድረክ</th>
              <th className="px-4 py-3 amharic">መመዘኛ</th>
              <th className="px-4 py-3 amharic">ስልክ</th>
              <th className="px-4 py-3 amharic">Onboarding</th>
              <th className="px-4 py-3 amharic">እርምጃ</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => {
              const score = criteriaScore(s);
              const busy = busyId === s.id;
              return (
                <tr key={s.id} className="border-t border-[var(--border)] align-top">
                  <td className="px-4 py-3">
                    <p className="font-medium amharic">{s.full_name_am}</p>
                    <p className="text-[10px] text-[var(--foreground)]/45">
                      {JOURNEY_AM[s.journey_stage || ""] || s.journey_stage || "—"}
                      {s.joined_at ? ` · ${s.joined_at}` : ""}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs rounded-full px-2 py-0.5 font-medium ${
                        STATUS_STYLE[s.status] || "bg-[var(--muted)]"
                      }`}
                    >
                      {STATUS_AM[s.status] || s.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 amharic">
                    {STAGE_LABEL[s.stage_service || ""] || s.stage_service || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-semibold ${
                        score >= 8
                          ? "text-emerald-700"
                          : score >= 5
                            ? "text-amber-700"
                            : "text-red-700"
                      }`}
                      title="አንቀጽ 14 መመዘኛ"
                    >
                      {score}/9
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs">{s.phone || "—"}</td>
                  <td className="px-4 py-3 text-xs amharic">
                    {s.onboarding_completed_at
                      ? "✓ ተጠናቋል"
                      : s.onboarding_started_at
                        ? "በሂደት"
                        : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex min-w-[150px] flex-col gap-1.5">
                      <input
                        value={notes[s.id] || ""}
                        onChange={(e) =>
                          setNotes((n) => ({ ...n, [s.id]: e.target.value }))
                        }
                        placeholder="ማስታወሻ…"
                        className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2 py-1 text-xs"
                      />
                      <div className="flex flex-wrap gap-1">
                        {(s.status === "active" || s.status === "reinstated") && (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() =>
                              setStatus(s.id, s.full_name_am, s.status, "suspended")
                            }
                            className="rounded bg-amber-700 px-2 py-1 text-[10px] text-white disabled:opacity-50"
                          >
                            አግድ
                          </button>
                        )}
                        {(s.status === "suspended" ||
                          s.status === "inactive" ||
                          s.status === "applicant") && (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() =>
                              setStatus(s.id, s.full_name_am, s.status, "active")
                            }
                            className="rounded bg-emerald-700 px-2 py-1 text-[10px] text-white disabled:opacity-50"
                          >
                            {s.status === "applicant" ? "አግብር" : "መልስ (14)"}
                          </button>
                        )}
                        {s.status !== "inactive" && s.status !== "rejected" && (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() =>
                              setStatus(s.id, s.full_name_am, s.status, "inactive")
                            }
                            className="rounded border border-[var(--border)] px-2 py-1 text-[10px] disabled:opacity-50"
                          >
                            ቦዘኔ
                          </button>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-12 text-center text-[var(--foreground)]/50 amharic"
                >
                  {rows.length === 0 ? (
                    <>
                      መዝገብ ባዶ ነው።{" "}
                      <Link
                        href="/admin/operations/membership"
                        className="text-[var(--primary)] underline"
                      >
                        ጥያቄዎችን አጽድቁ
                      </Link>{" "}
                      ወይም ከላይ «አዲስ አገልጋይ» ይጨምሩ።
                    </>
                  ) : (
                    "ምንም ውጤት የለም — ፍለጋ/ማጣሪያ ይቀይሩ።"
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-[var(--foreground)]/45 amharic leading-relaxed">
        ማሳሰቢያ (አንቀጽ 14)፦ መስፈርቶች ባለማሟላት ከአገልግሎት የተገደ ሰው አሁን ካሟላ እና ቁጥጥር ክፍል ካረጋገጠ ሥራ
        አስፈጻሚ ወደ አገልጋይነት ሊመልስ ይችላል። «መልስ (14)» ይጠቀሙ።
      </p>
    </div>
  );
}
