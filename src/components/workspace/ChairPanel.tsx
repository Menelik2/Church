"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { formatAppError, type AppError } from "@/lib/errors";
import { ErrorBanner, SuccessBanner } from "@/components/ui/ErrorBanner";

type Corr = {
  id: string;
  direction: string;
  subject_am: string;
  from_party: string | null;
  status: string;
  routed_to_dept: string | null;
  received_at: string | null;
};

type Approval = {
  id: string;
  approval_type: string;
  title_am: string;
  amount_birr: number | null;
  status: string;
};

type Discipline = {
  id: string;
  subject_name_am: string;
  reason: string;
  step: number;
  status: string;
  votes_for: number | null;
  votes_against: number | null;
  votes_total: number | null;
};

type Plan = {
  id: string;
  year: number;
  title_am: string;
  status: string;
};

const SUPERVISED = [
  { code: "kutator", label: "ቁጥጥርና ክርስትያናዊ ሕይወት ክትትል" },
  { code: "hisab", label: "ሒሳብ ክፍል" },
  { code: "nebrat", label: "ንብረት ክፍል" },
  { code: "media", label: "ሚዲያ ክፍል" },
];

const STEP_LABEL: Record<number, string> = {
  1: "7.1 ምክር",
  2: "7.2 የደብዳቤ ማስጠንቀቂያ",
  3: "7.3 የድምጽ ስብሰባ",
  4: "7.3 ታግዷል (2/3)",
  5: "7.5 አልተፈጸመም",
  6: "7.6 በደብዳቤ ተገልጿል",
};

export function ChairPanel({
  initialCorr,
  initialApprovals,
  initialDiscipline,
  initialPlans,
}: {
  initialCorr: Corr[];
  initialApprovals: Approval[];
  initialDiscipline: Discipline[];
  initialPlans: Plan[];
}) {
  const [corr, setCorr] = useState(initialCorr);
  const [approvals, setApprovals] = useState(initialApprovals);
  const [discipline, setDiscipline] = useState(initialDiscipline);
  const [plans, setPlans] = useState(initialPlans);
  const [error, setError] = useState<AppError | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // correspondence form
  const [cSubject, setCSubject] = useState("");
  const [cFrom, setCFrom] = useState("");
  const [cDir, setCDir] = useState<"incoming" | "outgoing">("incoming");

  // approval form
  const [aTitle, setATitle] = useState("");
  const [aType, setAType] = useState("finance_expense");
  const [aAmount, setAAmount] = useState("");

  // discipline form
  const [dName, setDName] = useState("");
  const [dReason, setDReason] = useState("");

  // plan form
  const [pTitle, setPTitle] = useState("");
  const [pYear, setPYear] = useState(String(new Date().getFullYear()));

  async function addCorr(e: React.FormEvent) {
    e.preventDefault();
    if (!cSubject.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data, error: dbErr } = await supabase
        .from("official_correspondence")
        .insert({
          direction: cDir,
          subject_am: cSubject.trim(),
          from_party: cFrom.trim() || null,
          status: "open",
        })
        .select(
          "id, direction, subject_am, from_party, status, routed_to_dept, received_at"
        )
        .single();
      if (dbErr) {
        setError(formatAppError(dbErr));
        return;
      }
      if (data) setCorr((c) => [data as Corr, ...c]);
      setCSubject("");
      setCFrom("");
      setOk("ደብዳቤ ተመዝግቧል");
    } catch (err) {
      setError(formatAppError(err));
    } finally {
      setSaving(false);
    }
  }

  async function routeCorr(id: string, dept: string) {
    setError(null);
    try {
      const supabase = createClient();
      const { error: dbErr } = await supabase
        .from("official_correspondence")
        .update({ status: "routed", routed_to_dept: dept })
        .eq("id", id);
      if (dbErr) {
        setError(formatAppError(dbErr));
        return;
      }
      setCorr((list) =>
        list.map((c) =>
          c.id === id ? { ...c, status: "routed", routed_to_dept: dept } : c
        )
      );
      setOk("ወደ ክፍል ተመርቷል");
    } catch (err) {
      setError(formatAppError(err));
    }
  }

  async function replyCorr(id: string) {
    setError(null);
    try {
      const supabase = createClient();
      const { error: dbErr } = await supabase
        .from("official_correspondence")
        .update({ status: "replied" })
        .eq("id", id);
      if (dbErr) {
        setError(formatAppError(dbErr));
        return;
      }
      setCorr((list) =>
        list.map((c) => (c.id === id ? { ...c, status: "replied" } : c))
      );
      setOk("መልስ ተሰጥቷል");
    } catch (err) {
      setError(formatAppError(err));
    }
  }

  async function addApproval(e: React.FormEvent) {
    e.preventDefault();
    if (!aTitle.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data, error: dbErr } = await supabase
        .from("chair_approvals")
        .insert({
          approval_type: aType,
          title_am: aTitle.trim(),
          amount_birr: aAmount ? Number(aAmount) : null,
          status: "pending",
        })
        .select("id, approval_type, title_am, amount_birr, status")
        .single();
      if (dbErr) {
        setError(formatAppError(dbErr));
        return;
      }
      if (data) setApprovals((a) => [data as Approval, ...a]);
      setATitle("");
      setAAmount("");
      setOk("ለፈቃድ ተመዝግቧል");
    } catch (err) {
      setError(formatAppError(err));
    } finally {
      setSaving(false);
    }
  }

  async function decideApproval(id: string, status: "approved" | "rejected") {
    setError(null);
    try {
      const supabase = createClient();
      const { error: dbErr } = await supabase
        .from("chair_approvals")
        .update({
          status,
          decided_at: new Date().toISOString(),
        })
        .eq("id", id);
      if (dbErr) {
        setError(formatAppError(dbErr));
        return;
      }
      setApprovals((list) =>
        list.map((a) => (a.id === id ? { ...a, status } : a))
      );
      setOk(status === "approved" ? "ጸድቋል" : "ውድቅ ሆኗል");
    } catch (err) {
      setError(formatAppError(err));
    }
  }

  async function addDiscipline(e: React.FormEvent) {
    e.preventDefault();
    if (!dName.trim() || !dReason.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data, error: dbErr } = await supabase
        .from("executive_discipline")
        .insert({
          subject_name_am: dName.trim(),
          reason: dReason.trim(),
          step: 1,
          status: "open",
        })
        .select(
          "id, subject_name_am, reason, step, status, votes_for, votes_against, votes_total"
        )
        .single();
      if (dbErr) {
        setError(formatAppError(dbErr));
        return;
      }
      if (data) setDiscipline((d) => [data as Discipline, ...d]);
      setDName("");
      setDReason("");
      setOk("የሥራ አስፈጻሚ ክትትል ተጀምሯል (7.1 ምክር)");
    } catch (err) {
      setError(formatAppError(err));
    } finally {
      setSaving(false);
    }
  }

  async function advanceDiscipline(id: string, nextStep: number, extra?: Partial<Discipline>) {
    setError(null);
    try {
      const supabase = createClient();
      let status = "open";
      if (nextStep === 4) status = "suspended";
      if (nextStep === 5 || nextStep === 6) status = "closed";

      const { error: dbErr } = await supabase
        .from("executive_discipline")
        .update({
          step: nextStep,
          status,
          updated_at: new Date().toISOString(),
          ...(extra?.votes_for != null ? { votes_for: extra.votes_for } : {}),
          ...(extra?.votes_against != null
            ? { votes_against: extra.votes_against }
            : {}),
          ...(extra?.votes_total != null ? { votes_total: extra.votes_total } : {}),
          ...(nextStep === 6 ? { letter_sent: true } : {}),
        })
        .eq("id", id);
      if (dbErr) {
        setError(formatAppError(dbErr));
        return;
      }
      setDiscipline((list) =>
        list.map((d) =>
          d.id === id
            ? {
                ...d,
                step: nextStep,
                status,
                ...extra,
              }
            : d
        )
      );
      setOk(STEP_LABEL[nextStep] || "ተሻሽሏል");
    } catch (err) {
      setError(formatAppError(err));
    }
  }

  async function recordVote(id: string, votesFor: number, votesTotal: number) {
    const votesAgainst = Math.max(0, votesTotal - votesFor);
    const twoThirds = votesTotal * (2 / 3);
    if (votesFor >= twoThirds) {
      await advanceDiscipline(id, 4, {
        votes_for: votesFor,
        votes_against: votesAgainst,
        votes_total: votesTotal,
      });
    } else {
      await advanceDiscipline(id, 5, {
        votes_for: votesFor,
        votes_against: votesAgainst,
        votes_total: votesTotal,
      });
    }
  }

  async function addPlan(e: React.FormEvent) {
    e.preventDefault();
    if (!pTitle.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data, error: dbErr } = await supabase
        .from("annual_action_plans")
        .insert({
          year: Number(pYear) || new Date().getFullYear(),
          title_am: pTitle.trim(),
          status: "draft",
        })
        .select("id, year, title_am, status")
        .single();
      if (dbErr) {
        setError(formatAppError(dbErr));
        return;
      }
      if (data) setPlans((p) => [data as Plan, ...p]);
      setPTitle("");
      setOk("የድርጊት መርሃ ግብር ተመዝግቧል");
    } catch (err) {
      setError(formatAppError(err));
    } finally {
      setSaving(false);
    }
  }

  async function approvePlan(id: string) {
    setError(null);
    try {
      const supabase = createClient();
      const { error: dbErr } = await supabase
        .from("annual_action_plans")
        .update({
          status: "approved",
          approved_at: new Date().toISOString(),
        })
        .eq("id", id);
      if (dbErr) {
        setError(formatAppError(dbErr));
        return;
      }
      setPlans((list) =>
        list.map((p) => (p.id === id ? { ...p, status: "approved" } : p))
      );
      setOk("መርሃ ግብር ጸድቋል");
    } catch (err) {
      setError(formatAppError(err));
    }
  }

  const statusAm: Record<string, string> = {
    open: "ክፍት",
    replied: "ተመልሷል",
    routed: "ተመርቷል",
    archived: "ተከማችቷል",
    pending: "በመጠባበቅ",
    approved: "ጸድቋል",
    rejected: "ውድቅ",
    resolved: "ተፈትቷል",
    suspended: "ታግዷል",
    closed: "ተዘግቷል",
    draft: "ረቂቅ",
    in_progress: "በሥራ ላይ",
    reviewed: "ተገምግሟል",
    completed: "ተጠናቋል",
  };

  return (
    <div className="space-y-10">
      {error && <ErrorBanner error={error} onDismiss={() => setError(null)} />}
      {ok && <SuccessBanner message={ok} />}

      {/* Supervised departments — duty 18 */}
      <section>
        <h3 className="text-sm font-semibold amharic mb-2">
          በስሩ የሚመሩ ክፍሎች (ተግባር 18)
        </h3>
        <div className="grid gap-2 grid-cols-2 sm:grid-cols-4">
          {SUPERVISED.map((d) => (
            <Link
              key={d.code}
              href={`/admin/workspace/${d.code}`}
              className="rounded-xl border border-[var(--border)] px-3 py-3 text-sm amharic hover:border-[var(--primary)]"
            >
              {d.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Correspondence — duty 5 */}
      <section className="rounded-2xl border border-[var(--border)] p-4 space-y-3">
        <h3 className="text-sm font-semibold amharic">ደብዳቤና መልስ (ተግባር 5)</h3>
        <form onSubmit={addCorr} className="grid gap-2 sm:grid-cols-2">
          <select
            value={cDir}
            onChange={(e) => setCDir(e.target.value as "incoming" | "outgoing")}
            className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm amharic"
          >
            <option value="incoming">ገቢ</option>
            <option value="outgoing">ወጪ</option>
          </select>
          <input
            value={cFrom}
            onChange={(e) => setCFrom(e.target.value)}
            placeholder="ከ / ለ"
            className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm amharic"
          />
          <input
            required
            value={cSubject}
            onChange={(e) => setCSubject(e.target.value)}
            placeholder="ርዕሰ ጉዳይ"
            className="sm:col-span-2 rounded-xl border border-[var(--border)] px-3 py-2 text-sm amharic"
          />
          <button
            type="submit"
            disabled={saving}
            className="sm:col-span-2 rounded-xl bg-[var(--primary)] py-2.5 text-sm text-white"
          >
            መዝግብ
          </button>
        </form>
        <ul className="space-y-2">
          {corr.map((c) => (
            <li
              key={c.id}
              className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm amharic"
            >
              <div className="flex flex-wrap justify-between gap-2">
                <span className="font-medium">{c.subject_am}</span>
                <span className="text-xs text-[var(--primary)]">
                  {statusAm[c.status] ?? c.status}
                </span>
              </div>
              <p className="text-[11px] text-[var(--foreground)]/50">
                {c.direction === "incoming" ? "ገቢ" : "ወጪ"}
                {c.from_party ? ` · ${c.from_party}` : ""}
                {c.routed_to_dept ? ` · → ${c.routed_to_dept}` : ""}
              </p>
              {c.status === "open" && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => replyCorr(c.id)}
                    className="rounded-lg bg-emerald-700 text-white text-[11px] px-2 py-1"
                  >
                    መልስ ሰጥቻለሁ
                  </button>
                  {SUPERVISED.map((d) => (
                    <button
                      key={d.code}
                      type="button"
                      onClick={() => routeCorr(c.id, d.code)}
                      className="rounded-lg border border-[var(--border)] text-[11px] px-2 py-1"
                    >
                      → {d.code}
                    </button>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* Approvals — duties 2, 14 */}
      <section className="rounded-2xl border border-[var(--border)] p-4 space-y-3">
        <h3 className="text-sm font-semibold amharic">
          ፈቃድና ፊርማ (ተግባር 2፣ 14)
        </h3>
        <form onSubmit={addApproval} className="grid gap-2 sm:grid-cols-2">
          <select
            value={aType}
            onChange={(e) => setAType(e.target.value)}
            className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm amharic"
          >
            <option value="finance_expense">ከፍተኛ ሂሳብ / ወጭ</option>
            <option value="agenda">አጀንዳ</option>
            <option value="decision">ውሳኔ</option>
            <option value="action_plan">ድርጊት መርሃ ግብር</option>
            <option value="other">ሌላ</option>
          </select>
          <input
            value={aAmount}
            onChange={(e) => setAAmount(e.target.value)}
            type="number"
            placeholder="ብር (ከሆነ)"
            className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
          />
          <input
            required
            value={aTitle}
            onChange={(e) => setATitle(e.target.value)}
            placeholder="ርዕስ"
            className="sm:col-span-2 rounded-xl border border-[var(--border)] px-3 py-2 text-sm amharic"
          />
          <button
            type="submit"
            disabled={saving}
            className="sm:col-span-2 rounded-xl bg-[var(--primary)] py-2.5 text-sm text-white"
          >
            ለፈቃድ አስገባ
          </button>
        </form>
        <ul className="space-y-2">
          {approvals.map((a) => (
            <li
              key={a.id}
              className="flex flex-wrap items-center gap-2 rounded-xl border border-[var(--border)] px-3 py-2 text-sm amharic"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium">{a.title_am}</p>
                <p className="text-[11px] text-[var(--foreground)]/50">
                  {a.approval_type}
                  {a.amount_birr != null ? ` · ${a.amount_birr} ብር` : ""} ·{" "}
                  {statusAm[a.status] ?? a.status}
                </p>
              </div>
              {a.status === "pending" && (
                <>
                  <button
                    type="button"
                    onClick={() => decideApproval(a.id, "approved")}
                    className="rounded-lg bg-emerald-700 text-white text-xs px-3 py-1.5"
                  >
                    አጽድቅ / ፊርማ
                  </button>
                  <button
                    type="button"
                    onClick={() => decideApproval(a.id, "rejected")}
                    className="rounded-lg bg-red-700 text-white text-xs px-3 py-1.5"
                  >
                    ውድቅ
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* Executive discipline — duty 7 */}
      <section className="rounded-2xl border border-[var(--border)] p-4 space-y-3">
        <h3 className="text-sm font-semibold amharic">
          የሥራ አስፈጻሚ ክትትል (ተግባር 7.1–7.6)
        </h3>
        <form onSubmit={addDiscipline} className="grid gap-2 sm:grid-cols-2">
          <input
            required
            value={dName}
            onChange={(e) => setDName(e.target.value)}
            placeholder="የሥራ አስፈጻሚ ስም"
            className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm amharic"
          />
          <input
            required
            value={dReason}
            onChange={(e) => setDReason(e.target.value)}
            placeholder="ምክንያት"
            className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm amharic"
          />
          <button
            type="submit"
            disabled={saving}
            className="sm:col-span-2 rounded-xl bg-[var(--primary)] py-2.5 text-sm text-white"
          >
            ምክር ጀምር (7.1)
          </button>
        </form>
        <ul className="space-y-3">
          {discipline.map((d) => (
            <li
              key={d.id}
              className="rounded-xl border border-[var(--border)] px-3 py-3 text-sm amharic"
            >
              <p className="font-medium">{d.subject_name_am}</p>
              <p className="text-[11px] text-[var(--foreground)]/55">{d.reason}</p>
              <p className="mt-1 text-xs text-[var(--primary)]">
                {STEP_LABEL[d.step] ?? `ደረጃ ${d.step}`} ·{" "}
                {statusAm[d.status] ?? d.status}
                {d.votes_total != null
                  ? ` · ድምጽ ${d.votes_for}/${d.votes_total}`
                  : ""}
              </p>
              {d.status === "open" && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {d.step === 1 && (
                    <button
                      type="button"
                      onClick={() => advanceDiscipline(d.id, 2)}
                      className="rounded-lg border border-[var(--border)] text-xs px-2 py-1"
                    >
                      → 7.2 ማስጠንቀቂያ
                    </button>
                  )}
                  {d.step === 2 && (
                    <button
                      type="button"
                      onClick={() => advanceDiscipline(d.id, 3)}
                      className="rounded-lg border border-[var(--border)] text-xs px-2 py-1"
                    >
                      → 7.3 ድምጽ ጥራ
                    </button>
                  )}
                  {d.step === 3 && (
                    <>
                      <button
                        type="button"
                        onClick={() => recordVote(d.id, 8, 11)}
                        className="rounded-lg bg-emerald-700 text-white text-xs px-2 py-1"
                        title="Example: 8/11 ≥ 2/3"
                      >
                        2/3+ አለ (ታገድ)
                      </button>
                      <button
                        type="button"
                        onClick={() => recordVote(d.id, 5, 11)}
                        className="rounded-lg bg-amber-700 text-white text-xs px-2 py-1"
                      >
                        ከግማሽ በታች
                      </button>
                    </>
                  )}
                </div>
              )}
              {d.step === 4 && d.status === "suspended" && (
                <button
                  type="button"
                  onClick={() => advanceDiscipline(d.id, 6)}
                  className="mt-2 rounded-lg bg-[var(--primary)] text-white text-xs px-2 py-1"
                >
                  7.6 በደብዳቤ አሳውቅ
                </button>
              )}
            </li>
          ))}
        </ul>
        <p className="text-[11px] text-[var(--foreground)]/45 amharic">
          ድምጽ ሲቆጠር ≥ 2/3 ከሆነ ታገዳል (7.3)፤ ከግማሽ በላይ ካልሆነ ተፈጻሚ አይደለም
          (7.5)። የሰብሳቢ ድምጽ ተቆጣሪነት (7.4) በስብሰባ መዝገብ ይታያል።
        </p>
      </section>

      {/* Annual plans — duties 10–11 */}
      <section className="rounded-2xl border border-[var(--border)] p-4 space-y-3">
        <h3 className="text-sm font-semibold amharic">
          የዓመት ድርጊት መርሃ ግብር (ተግባር 10–11)
        </h3>
        <form onSubmit={addPlan} className="flex flex-wrap gap-2">
          <input
            value={pYear}
            onChange={(e) => setPYear(e.target.value)}
            className="w-24 rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
          />
          <input
            required
            value={pTitle}
            onChange={(e) => setPTitle(e.target.value)}
            placeholder="ርዕስ"
            className="flex-1 rounded-xl border border-[var(--border)] px-3 py-2 text-sm amharic"
          />
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm text-white"
          >
            አክል
          </button>
        </form>
        <ul className="space-y-2">
          {plans.map((p) => (
            <li
              key={p.id}
              className="flex flex-wrap items-center gap-2 rounded-xl border border-[var(--border)] px-3 py-2 text-sm amharic"
            >
              <span className="flex-1">
                {p.year} · {p.title_am}{" "}
                <span className="text-[11px] text-[var(--foreground)]/50">
                  ({statusAm[p.status] ?? p.status})
                </span>
              </span>
              {p.status === "draft" && (
                <button
                  type="button"
                  onClick={() => approvePlan(p.id)}
                  className="rounded-lg bg-emerald-700 text-white text-xs px-3 py-1.5"
                >
                  አጽድቅ
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap gap-2 text-sm">
        <Link
          href="/admin/operations/meetings"
          className="rounded-xl border border-[var(--border)] px-4 py-2 amharic"
        >
          ስብሰባዎች (ኮረም ≥ ግማሽ)
        </Link>
        <Link
          href="/admin/operations/membership"
          className="rounded-xl border border-[var(--border)] px-4 py-2 amharic"
        >
          የአባልነት ፈቃዶች
        </Link>
        <Link
          href="/admin/operations/discipline"
          className="rounded-xl border border-[var(--border)] px-4 py-2 amharic"
        >
          አባላት ዲስፕሊን
        </Link>
      </div>
    </div>
  );
}
