import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDepartmentsPage() {
  await requireAdmin();
  const supabase = await createClient();

  const { data: departments } = await supabase
    .from("departments")
    .select("*")
    .order("order_index", { ascending: true });

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--primary)] amharic">የአገልግሎት ክፍሎች</h1>
      <p className="text-sm text-[var(--foreground)]/60 mt-1">ከ PDF አንቀጽ 10 የተወሰዱ 10 ክፍሎች</p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--border)]">
        <table className="w-full text-sm">
          <thead className="bg-[var(--muted)] text-left">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3 amharic">ስም</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">ሁኔታ</th>
            </tr>
          </thead>
          <tbody>
            {(departments ?? []).map((d) => (
              <tr key={d.id} className="border-t border-[var(--border)]">
                <td className="px-4 py-3">{d.order_index}</td>
                <td className="px-4 py-3 amharic font-medium">{d.title_am}</td>
                <td className="px-4 py-3 text-[var(--foreground)]/50">{d.slug}</td>
                <td className="px-4 py-3">{d.published ? "ታትሟል" : "ረቂቅ"}</td>
              </tr>
            ))}
            {(!departments || departments.length === 0) && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-[var(--foreground)]/50">
                  ክፍሎች የሉም። <code className="text-xs">npm run seed</code>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
