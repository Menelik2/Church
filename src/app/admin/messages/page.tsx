import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";
import { MarkReadButton } from "./MarkReadButton";
import { Bell, Mail, UserCheck } from "lucide-react";

export const dynamic = "force-dynamic";

const KIND_AM: Record<string, string> = {
  application_submitted: "አዲስ ጥያቄ",
  approved: "ጸድቋል",
  rejected: "ውድቅ",
  needs_info: "ተጨማሪ መረጃ",
  suspended: "ታግዷል",
  reinstated: "ተመልሷል",
};

const KIND_STYLE: Record<string, string> = {
  application_submitted: "bg-sky-100 text-sky-900 dark:bg-sky-950/40 dark:text-sky-200",
  approved: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200",
  rejected: "bg-red-100 text-red-900 dark:bg-red-950/40 dark:text-red-200",
  needs_info: "bg-amber-100 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200",
  suspended: "bg-amber-100 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200",
  reinstated: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200",
};

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  await requireAdmin();
  const { tab: tabParam } = await searchParams;
  const tab = tabParam === "contact" ? "contact" : "servants";

  const supabase = await createClient();

  const [{ data: messages }, { data: notifs, error: notifErr }] = await Promise.all([
    supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("membership_notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(150),
  ]);

  const unreadContact = (messages ?? []).filter((m) => !m.is_read).length;
  const unreadServant = (notifs ?? []).filter((n) => !n.is_read).length;

  return (
    <div className="pb-16">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary)] amharic">መልዕክቶች እና ማሳወቂያዎች</h1>
          <p className="mt-1 text-sm text-[var(--foreground)]/60 amharic">
            የአገልጋይ ሁኔታ · የአባልነት ጥያቄ · የእውቂያ ቅጽ
          </p>
        </div>
        <div className="flex gap-3 text-sm">
          <Link
            href="/admin/operations/servants"
            className="font-medium text-[var(--primary)] hover:underline amharic"
          >
            አገልጋዮች →
          </Link>
          <Link
            href="/admin/operations/membership"
            className="font-medium text-[var(--primary)] hover:underline amharic"
          >
            ጥያቄዎች →
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex flex-wrap gap-2 border-b border-[var(--border)] pb-px">
        <Link
          href="/admin/messages?tab=servants"
          className={`inline-flex items-center gap-2 rounded-t-xl px-4 py-2.5 text-sm font-medium amharic transition ${
            tab === "servants"
              ? "border border-b-0 border-[var(--border)] bg-[var(--card)] text-[var(--primary)]"
              : "text-[var(--foreground)]/60 hover:text-[var(--foreground)]"
          }`}
        >
          <Bell className="h-4 w-4" />
          አገልጋይ / አባልነት
          {unreadServant > 0 && (
            <span className="rounded-full bg-[var(--primary)] px-2 py-0.5 text-[10px] font-bold text-white">
              {unreadServant}
            </span>
          )}
        </Link>
        <Link
          href="/admin/messages?tab=contact"
          className={`inline-flex items-center gap-2 rounded-t-xl px-4 py-2.5 text-sm font-medium amharic transition ${
            tab === "contact"
              ? "border border-b-0 border-[var(--border)] bg-[var(--card)] text-[var(--primary)]"
              : "text-[var(--foreground)]/60 hover:text-[var(--foreground)]"
          }`}
        >
          <Mail className="h-4 w-4" />
          የእውቂያ ቅጽ
          {unreadContact > 0 && (
            <span className="rounded-full bg-[var(--primary)] px-2 py-0.5 text-[10px] font-bold text-white">
              {unreadContact}
            </span>
          )}
        </Link>
      </div>

      {tab === "servants" && (
        <div className="mt-4 space-y-3">
          {notifErr && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              ማሳወቂያዎችን ማምጣት አልተሳካም: {notifErr.message}
              <p className="mt-1 text-xs">
                Supabase ላይ migration 014 / 017 ይሩጡ (membership_notifications).
              </p>
            </div>
          )}

          {(notifs ?? []).map((n) => (
            <li
              key={n.id}
              className={`list-none rounded-2xl border p-5 ${
                n.is_read
                  ? "border-[var(--border)] bg-[var(--card)] opacity-85"
                  : "border-[var(--primary)]/30 bg-[var(--primary)]/5"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        KIND_STYLE[n.kind] || "bg-[var(--muted)]"
                      }`}
                    >
                      {KIND_AM[n.kind] || n.kind}
                    </span>
                    {!n.is_read && (
                      <span className="text-[10px] font-semibold text-[var(--primary)]">አዲስ</span>
                    )}
                  </div>
                  <p className="mt-1.5 font-medium amharic text-[var(--primary)]">{n.title_am}</p>
                  {n.body_am && (
                    <p className="mt-1 text-sm text-[var(--foreground)]/70 amharic whitespace-pre-wrap">
                      {n.body_am}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-[var(--foreground)]/45">
                    {[n.recipient_name, n.recipient_phone, n.recipient_email]
                      .filter(Boolean)
                      .join(" · ") || "—"}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <time className="text-xs text-[var(--foreground)]/40">
                    {n.created_at
                      ? new Date(n.created_at).toLocaleString("am-ET")
                      : ""}
                  </time>
                  {!n.is_read && (
                    <MarkReadButton id={n.id} table="membership_notifications" />
                  )}
                  {n.servant_id && (
                    <Link
                      href="/admin/operations/servants"
                      className="inline-flex items-center gap-1 text-[11px] text-[var(--primary)] hover:underline"
                    >
                      <UserCheck className="h-3 w-3" /> መዝገብ
                    </Link>
                  )}
                  {n.application_id && (
                    <Link
                      href="/admin/operations/membership"
                      className="text-[11px] text-[var(--primary)] hover:underline"
                    >
                      ጥያቄ →
                    </Link>
                  )}
                </div>
              </div>
            </li>
          ))}

          {(!notifs || notifs.length === 0) && !notifErr && (
            <p className="py-12 text-center text-sm text-[var(--foreground)]/50 amharic">
              ምንም የአገልጋይ/አባልነት ማሳወቂያ የለም።
              <br />
              <span className="text-xs">
                ጥያቄ ሲላክ፣ ሲጸድቅ፣ ሲታገድ ወይም ሲመለስ እዚህ ይታያል።
              </span>
            </p>
          )}
        </div>
      )}

      {tab === "contact" && (
        <ul className="mt-4 space-y-3">
          {(messages ?? []).map((m) => (
            <li
              key={m.id}
              className={`rounded-2xl border p-5 ${
                m.is_read
                  ? "border-[var(--border)] bg-[var(--card)] opacity-80"
                  : "border-[var(--primary)]/30 bg-[var(--primary)]/5"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium">{m.name}</p>
                  <p className="text-xs text-[var(--foreground)]/50">
                    {[m.email, m.phone].filter(Boolean).join(" · ") || "—"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <time className="text-xs text-[var(--foreground)]/40">
                    {new Date(m.created_at).toLocaleString("am-ET")}
                  </time>
                  {!m.is_read && <MarkReadButton id={m.id} table="contact_messages" />}
                </div>
              </div>
              {m.subject && <p className="mt-2 text-sm font-medium">{m.subject}</p>}
              <p className="mt-2 whitespace-pre-wrap text-sm">{m.message}</p>
            </li>
          ))}
          {(!messages || messages.length === 0) && (
            <p className="py-8 text-center text-sm text-[var(--foreground)]/50">
              ምንም የእውቂያ መልዕክት የለም።
            </p>
          )}
        </ul>
      )}
    </div>
  );
}
