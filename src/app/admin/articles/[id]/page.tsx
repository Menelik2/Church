import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";
import { ArticleEditForm } from "./ArticleEditForm";

type Props = { params: Promise<{ id: string }> };

export default async function AdminArticleEditPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;
  const supabase = await createClient();

  const { data: article, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !article) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--primary)] amharic">
        አንቀጽ {article.article_number} አርትዕ
      </h1>
      <p className="mt-1 text-sm text-[var(--foreground)]/60 amharic">{article.title_am}</p>
      <p className="mt-2 text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 rounded-lg px-3 py-2 inline-block">
        ማስታወሻ፡ የሕግ ትርጉም ከ PDF ጋር መስማማት አለበት። የትርጉም ለውጥ አያድርጉ።
      </p>
      <div className="mt-6">
        <ArticleEditForm article={article} />
      </div>
    </div>
  );
}
