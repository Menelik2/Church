import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";

export default async function AdminArticlesPage() {
  await requireAdmin();
  const supabase = await createClient();

  const { data: articles, error } = await supabase
    .from("articles")
    .select("id, article_number, title_am, title_en, published, updated_at")
    .order("article_number", { ascending: true });

  return (
    <div>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary)] amharic">አንቀጾች</h1>
          <p className="text-sm text-[var(--foreground)]/60 mt-1">
            ከ PDF የተወሰዱ የውስጥ መተዳደሪያ ሕግ አንቀጾች
          </p>
        </div>
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-600">
          መረጃ ማምጣት አልተሳካም። Seed አሂደው እና RLS ያረጋግጡ። ({error.message})
        </p>
      )}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--border)]">
        <table className="w-full text-sm">
          <thead className="bg-[var(--muted)] text-left">
            <tr>
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium amharic">ርዕስ</th>
              <th className="px-4 py-3 font-medium">ሁኔታ</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {(articles ?? []).map((a) => (
              <tr key={a.id} className="border-t border-[var(--border)] hover:bg-[var(--muted)]/50">
                <td className="px-4 py-3 tabular-nums font-medium">{a.article_number}</td>
                <td className="px-4 py-3 amharic">{a.title_am}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs ${
                      a.published
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {a.published ? "ታትሟል" : "ረቂቅ"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/articles/${a.id}`} className="text-[var(--primary)] hover:underline">
                    አርትዕ
                  </Link>
                </td>
              </tr>
            ))}
            {(!articles || articles.length === 0) && !error && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-[var(--foreground)]/50">
                  ምንም አንቀጽ የለም። <code className="text-xs">npm run seed</code> ያሂዱ።
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
