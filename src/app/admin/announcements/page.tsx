import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";
import {
  AnnouncementsClient,
  type AnnItem,
  type CommentItem,
} from "./AnnouncementsClient";

export default async function AdminAnnouncementsPage() {
  await requireAdmin();
  const supabase = await createClient();

  let items: AnnItem[] = [];
  let comments: CommentItem[] = [];

  try {
    const { data } = await supabase
      .from("announcements")
      .select(
        "id, title_am, body_am, slug, published, is_featured, image_url, published_at, created_at"
      )
      .order("created_at", { ascending: false })
      .limit(50);
    items = (data as AnnItem[]) ?? [];
  } catch {
    items = [];
  }

  try {
    const { data } = await supabase
      .from("announcement_comments")
      .select(
        "id, author_name, author_email, body, is_approved, created_at, announcement_id, announcements(title_am, slug)"
      )
      .order("created_at", { ascending: false })
      .limit(40);
    comments = (data as unknown as CommentItem[]) ?? [];
  } catch {
    comments = [];
  }

  return <AnnouncementsClient items={items} comments={comments} />;
}
