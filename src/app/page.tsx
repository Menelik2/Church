import { createClient } from "@/lib/supabase/server";
import { HomePageClient, type HomeAnnouncement } from "@/components/home/HomePageClient";

export const dynamic = "force-dynamic";

async function getAnnouncements(): Promise<HomeAnnouncement[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("announcements")
      .select("id, title_am, body_am, slug, image_url, is_featured, published_at, created_at")
      .eq("published", true)
      .order("is_featured", { ascending: false })
      .order("published_at", { ascending: false })
      .limit(6);
    return (data as HomeAnnouncement[]) ?? [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const announcements = await getAnnouncements();
  return <HomePageClient announcements={announcements} />;
}
