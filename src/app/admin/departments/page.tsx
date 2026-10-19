import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";
import { DepartmentsClient } from "./DepartmentsClient";

export const dynamic = "force-dynamic";

export default async function AdminDepartmentsPage() {
  await requireAdmin();
  const supabase = await createClient();

  let departments: Array<{
    id: string;
    title_am: string;
    title_en: string | null;
    slug: string;
    order_index: number;
    published: boolean;
    description_am: string | null;
  }> = [];

  try {
    const { data, error } = await supabase
      .from("departments")
      .select(
        "id, title_am, title_en, slug, order_index, published, description_am"
      )
      .order("order_index", { ascending: true });
    if (!error && data) departments = data;
  } catch {
    departments = [];
  }

  return <DepartmentsClient initial={departments} />;
}
