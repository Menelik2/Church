import type { SupabaseClient } from "@supabase/supabase-js";

export type ServantNotifKind =
  | "application_submitted"
  | "approved"
  | "rejected"
  | "needs_info"
  | "suspended"
  | "reinstated";

export async function insertServantNotification(
  supabase: SupabaseClient,
  input: {
    kind: ServantNotifKind;
    title_am: string;
    body_am?: string | null;
    application_id?: string | null;
    servant_id?: string | null;
    recipient_name?: string | null;
    recipient_phone?: string | null;
    recipient_email?: string | null;
  }
) {
  const { error } = await supabase.from("membership_notifications").insert({
    kind: input.kind,
    title_am: input.title_am,
    body_am: input.body_am ?? null,
    application_id: input.application_id ?? null,
    servant_id: input.servant_id ?? null,
    recipient_name: input.recipient_name ?? null,
    recipient_phone: input.recipient_phone ?? null,
    recipient_email: input.recipient_email ?? null,
    is_read: false,
  });
  return { error };
}
