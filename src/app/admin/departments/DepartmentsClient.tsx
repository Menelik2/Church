"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { formatAppError } from "@/lib/supabase/safe-count";
import {
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Search,
  ArrowUp,
  ArrowDown,
  LayoutGrid,
  Eye,
} from "lucide-react";
import { getWorkspace } from "@/data/department-workspaces";

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
  const [list, setList] = useState(
    [...initial].sort((a, b) => a.order_index - b.order_index)
  );
  const [q, setQ] = useState("");
  const [titleAm, setTitleAm] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [desc, setDesc] = useState("");
  const [published, setPublished] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [edit, setEdit] = useState<Dept | null>(null);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");

  const filtered = useMemo(() => {
    let rows = list;
    if (filter === "published") rows = rows.filter((d) => d.published);
    if (filter === "draft") rows = rows.filter((d) => !d.published);
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter(
      (d) =>
        d.title_am.toLowerCase().includes(s) ||
        (d.title_en || "").toLowerCase().includes(s) ||
        d.slug.toLowerCase().includes(s) ||
        (d.description_am || "").toLowerCase().includes(s)
    );
  }, [list, q, filter]);

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

  async function move(id: string, dir: -1 | 1) {
    const sorted = [...list].sort((a, b) => a.order_index - b.order_index);
    const idx = sorted.findIndex((d) => d.id === id);
    const swap = idx + dir;
    if (idx < 0 || swap < 0 || swap >= sorted.length) return;
    const a = sorted[idx];
    const b = sorted[swap];
    try {
      const supabase = createClient();
      await Promise.all([
        supabase.from("departments").update({ order_index: b.order_index }).eq("id", a.id),
        supabase.from("departments").update({ order_index: a.order_index }).eq("id", b.id),
      ]);
      setList((l) =>
        l.map((d) => {
          if (d.id === a.id) return { ...d, order_index: b.order_index };
          if (d.id === b.id) return { ...d, order_index: a.order_index };
          return d;
        })
      );
    } catch (e) {
      setErr(formatAppError(e));
    }
  }

  const publishedCount = list.filter((d) => d.published).length;

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary)] amharic">የአገልግሎት ክፍሎች</h1>
          <p className="text-sm text-[var(--foreground)]/60 mt-1 amharic">
            ፍጠር · አርትዕ · አትም · ደርድር · ሰርዝ — ከህግና ደንብ አንቀጽ 10
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-[var(--muted)] px-3 py-1 amharic">ጠቅላላ {list.length}</span>
          <span className="rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 amharic">ታትሟል {publishedCount}</span>
          <span className="rounded-full bg-slate-100 text-slate-600 px-3 py-1 amharic">ረቂቅ {list.length - publishedCount}</span>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[12rem]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--foreground)]/40" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ፈልግ (ስም፣ slug…)"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] pl-9 pr-3 py-2 text-sm amharic"
          />
        </div>
        {(["all", "published", "draft"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={
              filter === f
                ? "rounded-full bg-[var(--primary)] px-3 py-1.5 text-xs font-semibold text-white amharic"
                : "rounded-full border border-[var(--border)] px-3 py-1.5 text-xs amharic"
            }
          >
            {f === "all" ? "ሁሉም" : f === "published" ? "ታትሟል" : "ረቂቅ"}
          </button>
        ))}
        <Link
          href="/admin/workspace"
          className="inline-flex items-center gap-1 rounded-xl border border-[var(--border)] px-3 py-2 text-xs font-medium amharic hover:bg-[var(--muted)]"
        >
          <LayoutGrid className="h-3.5 w-3.5" /> ክፍል ዳሽቦርድ
        </Link>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <form onSubmit={onSubmit} className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 h-fit">
          <h2 className="font-semibold amharic">{edit ? "ክፍል አርትዕ" : "አዲስ ክፍል"}</h2>
          <input value={titleAm} onChange={(e) => setTitleAm(e.target.value)} required placeholder="ስም (አማርኛ)"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm amharic" />
          <input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} placeholder="Name (English)"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm" />
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="መግለጫ…" rows={3}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm amharic" />
          <label className="flex items-center gap-2 text-sm amharic">
            <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
            ታትሟል (በድረ-ገጽ ይታይ)
          </label>
          {err && <p className="text-sm text-red-600 amharic">{err}</p>}
          {msg && <p className="text-sm text-emerald-600 amharic">{msg}</p>}
          <div className="flex gap-2">
            <button type="submit" disabled={saving}
              className="inline-flex items-center gap-1 rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 amharic">
              <Plus className="h-4 w-4" />{saving ? "…" : edit ? "አስቀምጥ" : "ፍጠር"}
            </button>
            {edit && (
              <button type="button" onClick={() => { setEdit(null); setTitleAm(""); setTitleEn(""); setDesc(""); }}
                className="rounded-xl border px-4 py-2 text-sm amharic">ሰርዝ</button>
            )}
          </div>
        </form>

        <div>
          <h2 className="font-semibold amharic mb-3">ያሉ ክፍሎች ({filtered.length})</h2>
          <ul className="space-y-2">
            {filtered.slice().sort((a, b) => a.order_index - b.order_index).map((d) => {
              const ws = getWorkspace(d.slug);
              return (
                <li key={d.id} className="rounded-xl border border-[var(--border)] p-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium amharic text-sm">{d.title_am}</p>
                      <p className="text-[11px] text-[var(--foreground)]/45">
                        {d.slug} · #{d.order_index}{ws ? ` · ${ws.modules.length} ሞጁል` : ""}
                      </p>
                      {d.description_am && (
                        <p className="mt-1 text-xs amharic text-[var(--foreground)]/55 line-clamp-2">{d.description_am}</p>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-1">
                      <button type="button" onClick={() => move(d.id, -1)} className="rounded-lg border p-1.5" title="ላይ">
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button type="button" onClick={() => move(d.id, 1)} className="rounded-lg border p-1.5" title="ታች">
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                      <button type="button" onClick={() => togglePub(d)}
                        className={`rounded-full px-2 py-0.5 text-[11px] ${
                          d.published ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                        }`}>{d.published ? "ታትሟል" : "ረቂቅ"}</button>
                      <Link href={`/departments/${d.slug}`} className="rounded-lg border p-1.5" title="የህዝብ ገጽ" target="_blank">
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                      <Link href={`/admin/workspace/${d.slug}`} className="rounded-lg border p-1.5" title="ዳሽቦርድ">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                      <button type="button" onClick={() => startEdit(d)} className="rounded-lg border p-1.5">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button type="button" onClick={() => remove(d.id)} className="rounded-lg bg-red-600/90 p-1.5 text-white">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
            {filtered.length === 0 && (
              <p className="text-sm text-[var(--foreground)]/50 amharic">ምንም ክፍል አልተገኘም።</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
