"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { formatAppError } from "@/lib/supabase/safe-count";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";

type Dept = {
  id: string;
  title_am: string;
  title_en: string | null;
  slug: string;
  order_index: number;
  published: boolean;
  description_am: string | null;
};

function toSlug(t: string) {
  return (
    t
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\u1200-\u137F-]/g, "")
      .slice(0, 40) || `dept-${Date.now().toString(36)}`
  );
}

export function DepartmentsClient({ initial }: { initial: Dept[] }) {
  const router = useRouter();
  const [list, setList] = useState(initial);
  const [titleAm, setTitleAm] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [desc, setDesc] = useState("");
  const [published, setPublished] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [edit, setEdit] = useState<Dept | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!titleAm.trim()) return;
    setSaving(true);
    setErr(null);
    setMsg(null);
    try {
      const supabase = createClient();
      if (edit) {
        const { data, error } = await supabase
          .from("departments")
          .update({
            title_am: titleAm.trim(),
            title_en: titleEn.trim() || null,
            description_am: desc.trim() || null,
            published,
            updated_at: new Date().toISOString(),
          })
          .eq("id", edit.id)
          .select(
            "id, title_am, title_en, slug, order_index, published, description_am"
          )
          .single();
        if (error) throw error;
        if (data) {
          setList((l) => l.map((d) => (d.id === edit.id ? (data as Dept) : d)));
        }
        setMsg("ተዘምኗል");
        setEdit(null);
      } else {
        const slug = toSlug(titleEn || titleAm);
        const maxOrder = list.reduce(
          (m, d) => Math.max(m, d.order_index || 0),
          0
        );
        const { data, error } = await supabase
          .from("departments")
          .insert({
            title_am: titleAm.trim(),
            title_en: titleEn.trim() || null,
            description_am: desc.trim() || null,
            slug,
            order_index: maxOrder + 1,
            published,
          })
          .select(
            "id, title_am, title_en, slug, order_index, published, description_am"
          )
          .single();
        if (error) throw error;
        if (data) setList((l) => [...l, data as Dept]);
        setMsg("ተመዝግቧል");
      }
      setTitleAm("");
      setTitleEn("");
      setDesc("");
      setPublished(true);
      router.refresh();
    } catch (e) {
      setErr(formatAppError(e));
    } finally {
      setSaving(false);
    }
  }

  function startEdit(d: Dept) {
    setEdit(d);
    setTitleAm(d.title_am);
    setTitleEn(d.title_en || "");
    setDesc(d.description_am || "");
    setPublished(d.published);
    setMsg(null);
    setErr(null);
  }

  async function remove(id: string) {
    if (!confirm("ይህን ክፍል ማጥፋት ይፈልጋሉ?")) return;
    try {
      const supabase = createClient();
      const { error } = await supabase.from("departments").delete().eq("id", id);
      if (error) throw error;
      setList((l) => l.filter((d) => d.id !== id));
      if (edit?.id === id) setEdit(null);
      router.refresh();
    } catch (e) {
      setErr(formatAppError(e));
    }
  }

  async function togglePub(d: Dept) {
    try {
      const supabase = createClient();
      const next = !d.published;
      const { error } = await supabase
        .from("departments")
        .update({ published: next })
        .eq("id", d.id);
      if (error) throw error;
      setList((l) =>
        l.map((x) => (x.id === d.id ? { ...x, published: next } : x))
      );
    } catch (e) {
      setErr(formatAppError(e));
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--primary)] amharic">
        የአገልግሎት ክፍሎች
      </h1>
      <p className="text-sm text-[var(--foreground)]/60 mt-1 amharic">
        ፍጠር · አርትዕ · አትም · ሰርዝ — ከህግና ደንብ አንቀጽ 10
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <form
          onSubmit={onSubmit}
          className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6"
        >
          <h2 className="font-semibold amharic">
            {edit ? "ክፍል አርትዕ" : "አዲስ ክፍል"}
          </h2>
          <input
            value={titleAm}
            onChange={(e) => setTitleAm(e.target.value)}
            required
            placeholder="ስም (አማርኛ)"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm amharic"
          />
          <input
            value={titleEn}
            onChange={(e) => setTitleEn(e.target.value)}
            placeholder="Name (English)"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
          />
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="መግለጫ…"
            rows={3}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm amharic"
          />
          <label className="flex items-center gap-2 text-sm amharic">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            ታትሟል (በድረ-ገጽ ይታይ)
          </label>
          {err && <p className="text-sm text-red-600 amharic">{err}</p>}
          {msg && <p className="text-sm text-emerald-600 amharic">{msg}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1 rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 amharic"
            >
              <Plus className="h-4 w-4" />
              {saving ? "…" : edit ? "አስቀምጥ" : "ፍጠር"}
            </button>
            {edit && (
              <button
                type="button"
                onClick={() => {
                  setEdit(null);
                  setTitleAm("");
                  setTitleEn("");
                  setDesc("");
                }}
                className="rounded-xl border px-4 py-2 text-sm amharic"
              >
                ሰርዝ
              </button>
            )}
          </div>
        </form>

        <div>
          <h2 className="font-semibold amharic mb-3">
            ያሉ ክፍሎች ({list.length})
          </h2>
          <ul className="space-y-2">
            {list.map((d) => (
              <li
                key={d.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--border)] p-3"
              >
                <div className="min-w-0">
                  <p className="font-medium amharic text-sm">{d.title_am}</p>
                  <p className="text-[11px] text-[var(--foreground)]/45">
                    {d.slug} · #{d.order_index}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-1">
                  <button
                    type="button"
                    onClick={() => togglePub(d)}
                    className={`rounded-full px-2 py-0.5 text-[11px] ${
                      d.published
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {d.published ? "ታትሟል" : "ረቂቅ"}
                  </button>
                  <Link
                    href={`/admin/workspace/${d.slug}`}
                    className="rounded-lg border p-1.5"
                    title="ዳሽቦርድ"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => startEdit(d)}
                    className="rounded-lg border p-1.5"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(d.id)}
                    className="rounded-lg bg-red-600/90 p-1.5 text-white"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            ))}
            {list.length === 0 && (
              <p className="text-sm text-[var(--foreground)]/50 amharic">
                ምንም ክፍል የለም።
              </p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
