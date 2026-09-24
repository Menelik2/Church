"use client";

import type { ReactElement } from "react";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ARTICLES, DOCUMENT_META } from "@/data/regulations";
import { Search, BookOpen, ArrowRight, SearchX, AlertCircle } from "lucide-react";

type Hit = {
  number: number;
  title_am: string;
  title_en?: string;
  snippet: string;
};

const SUGGESTIONS = ["አገልጋይ", "ጠቅላላ ጉባኤ", "ራዕይ", "መብት", "11"] as const;

type SearchMeta = {
  hits: Hit[];
  emptyReason: null | "too_short" | "invalid_number" | "no_match";
  invalidNumber?: number;
};

function searchArticles(q: string): SearchMeta {
  const term = q.trim().toLowerCase();
  if (!term) return { hits: [], emptyReason: null };

  const numMatch = term.match(/(?:አንቀጽ|art(?:icle)?|#)?\s*(\d{1,2})\s*$/i);
  if (numMatch && term.replace(/\s/g, "").length <= 12) {
    const n = Number(numMatch[1]);
    const art = ARTICLES[String(n)];
    if (art) {
      return {
        hits: [
          {
            number: art.number,
            title_am: art.title_am,
            title_en: art.title_en,
            snippet: art.content_am.replace(/\s+/g, " ").slice(0, 160) + "…",
          },
        ],
        emptyReason: null,
      };
    }
    if (/^\d{1,2}$/.test(term.replace(/\s/g, "")) || /አንቀጽ|art|#/i.test(term)) {
      return { hits: [], emptyReason: "invalid_number", invalidNumber: n };
    }
  }

  if (term.length < 2) {
    return { hits: [], emptyReason: "too_short" };
  }

  const hits: Hit[] = [];
  for (const art of Object.values(ARTICLES)) {
    const hay = `${art.number} ${art.title_am} ${art.title_en ?? ""} ${art.content_am}`.toLowerCase();
    if (!hay.includes(term)) continue;
    const idx = art.content_am.toLowerCase().indexOf(term);
    let snippet: string;
    if (idx >= 0) {
      const start = Math.max(0, idx - 40);
      snippet =
        (start > 0 ? "…" : "") +
        art.content_am.slice(start, start + 140).replace(/\s+/g, " ") +
        "…";
    } else {
      snippet = art.content_am.replace(/\s+/g, " ").slice(0, 140) + "…";
    }
    hits.push({
      number: art.number,
      title_am: art.title_am,
      title_en: art.title_en,
      snippet,
    });
  }
  hits.sort((a, b) => a.number - b.number);
  return {
    hits,
    emptyReason: hits.length === 0 ? "no_match" : null,
  };
}

function Highlight({ text, term }: { text: string; term: string }) {
  if (!term || term.length < 2) return <>{text}</>;
  const lower = text.toLowerCase();
  const t = term.toLowerCase();
  const parts: Array<string | ReactElement> = [];
  let i = 0;
  let key = 0;
  while (i < text.length) {
    const found = lower.indexOf(t, i);
    if (found === -1) {
      parts.push(text.slice(i));
      break;
    }
    if (found > i) parts.push(text.slice(i, found));
    parts.push(
      <mark key={key++} className="rounded bg-[var(--color-gold-200)] px-0.5 text-[var(--color-burgundy-900)]">
        {text.slice(found, found + t.length)}
      </mark>
    );
    i = found + t.length;
  }
  return <>{parts}</>;
}

export default function SearchPage() {
  const [q, setQ] = useState("");
  const { hits: results, emptyReason, invalidNumber } = useMemo(
    () => searchArticles(q),
    [q]
  );
  const term = q.trim();

  return (
    <div className="bg-cross-pattern min-h-screen pb-28 lg:pb-16">
      <section className="border-b border-[var(--border)] bg-gradient-to-br from-[var(--color-burgundy-950)] via-[var(--color-burgundy-900)] to-[var(--color-burgundy-800)]">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-gold-300)] amharic">
            {DOCUMENT_META.organization_am}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white amharic">ፈልግ</h1>
          <p className="mt-2 text-sm text-white/70 amharic">በሕግና ደንብ (አንቀጽ 1–16) ውስጥ ይፈልጉ</p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 -mt-5 relative z-10 sm:px-6">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--foreground)]/40" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ቃል፣ ርዕስ ወይም አንቀጽ ቁጥር… (ለም. መብት፣ 11)"
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--card)] py-4 pl-12 pr-4 text-base shadow-lg amharic focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)]"
            autoFocus
            aria-describedby="search-status"
          />
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        {term.length >= 1 && results.length > 0 && (
          <p id="search-status" role="status" aria-live="polite" className="mb-4 text-sm text-[var(--foreground)]/50 amharic">
            {results.length} ውጤት ተገኝቷል
          </p>
        )}

        <ul className="space-y-3">
          {results.map((r) => (
            <li key={r.number}>
              <Link
                href={`/rules/${r.number}`}
                className="group flex gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm transition hover:border-[var(--color-gold-400)] hover:shadow-md"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)] text-sm font-bold text-white">
                  {r.number}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-semibold amharic text-[var(--primary)]">
                    <Highlight text={r.title_am} term={term} />
                  </span>
                  {r.title_en && (
                    <span className="mt-0.5 block text-[11px] text-[var(--foreground)]/40">{r.title_en}</span>
                  )}
                  <span className="mt-2 block text-sm leading-relaxed text-[var(--foreground)]/60 amharic line-clamp-2">
                    <Highlight text={r.snippet} term={term} />
                  </span>
                </span>
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[var(--foreground)]/20 transition group-hover:text-[var(--primary)]" />
              </Link>
            </li>
          ))}
        </ul>

        {/* Empty states */}
        {emptyReason === "too_short" && (
          <div
            id="search-status"
            role="status"
            aria-live="polite"
            className="rounded-2xl border border-amber-200/80 bg-amber-50/50 px-6 py-10 text-center"
          >
            <AlertCircle className="mx-auto h-8 w-8 text-amber-600" />
            <p className="mt-3 text-sm font-semibold amharic text-[var(--foreground)]/80">
              ቢያንስ 2 ፊደል ይጻፉ
            </p>
            <p className="mt-1 text-xs text-[var(--foreground)]/50 amharic">
              ወይም የአንቀጽ ቁጥር ከ 1 እስከ 16
            </p>
          </div>
        )}

        {emptyReason === "invalid_number" && (
          <div
            id="search-status"
            role="status"
            aria-live="polite"
            className="rounded-2xl border border-amber-200/80 bg-amber-50/50 px-6 py-10 text-center"
          >
            <SearchX className="mx-auto h-8 w-8 text-amber-600" />
            <p className="mt-3 text-sm font-semibold amharic text-[var(--foreground)]/80">
              አንቀጽ {invalidNumber} የለም
            </p>
            <p className="mt-1 text-xs text-[var(--foreground)]/50 amharic">
              በሕግና ደንብ ውስጥ አንቀጾች ከ 1 እስከ 16 ብቻ ናቸው
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {[1, 3, 11, 16].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setQ(String(n))}
                  className="rounded-full border border-[var(--border)] bg-white px-3 py-1 text-xs font-semibold text-[var(--primary)]"
                >
                  አንቀጽ {n}
                </button>
              ))}
            </div>
            <Link href="/rules" className="mt-4 inline-block text-sm font-semibold text-[var(--primary)] amharic">
              ሁሉንም አንቀጾች ይመልከቱ →
            </Link>
          </div>
        )}

        {emptyReason === "no_match" && (
          <div
            id="search-status"
            role="status"
            aria-live="polite"
            className="rounded-2xl border border-dashed border-[var(--border)] px-6 py-12 text-center"
          >
            <SearchX className="mx-auto h-9 w-9 text-[var(--foreground)]/30" />
            <p className="mt-3 text-sm font-semibold amharic text-[var(--foreground)]/80">
              «{term}» ውጤት አልተገኘም
            </p>
            <p className="mt-1 text-xs text-[var(--foreground)]/50 amharic">
              ሆሄት ወይም አጭር ቃል ይሞክሩ · ምሳሌዎች ከታች
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setQ(s)}
                  className="rounded-full border border-[var(--border)] bg-[var(--card)] px-3.5 py-1.5 text-xs font-medium amharic text-[var(--primary)] shadow-sm transition hover:border-[var(--color-gold-400)]"
                >
                  {s}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setQ("")}
              className="mt-4 text-xs font-semibold text-[var(--foreground)]/45 amharic underline-offset-2 hover:underline"
            >
              ፍለጋ አጽዳ
            </button>
            <div className="mt-2">
              <Link href="/rules" className="text-sm font-semibold text-[var(--primary)] amharic">
                ሁሉንም አንቀጾች ይመልከቱ →
              </Link>
            </div>
          </div>
        )}

        {!term && (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-center">
            <BookOpen className="mx-auto h-7 w-7 text-[var(--primary)]/40" />
            <p className="mt-3 text-sm text-[var(--foreground)]/55 amharic">
              ምሳሌዎች — ጠቅ በማድረግ ይሞክሩ
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setQ(s)}
                  className="rounded-full border border-[var(--border)] bg-[var(--muted)]/30 px-3.5 py-1.5 text-xs font-medium amharic text-[var(--primary)] transition hover:border-[var(--color-gold-400)]"
                >
                  {s}
                </button>
              ))}
            </div>
            <Link href="/rules" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[var(--primary)] amharic">
              ሕግና ደንብ ማውጫ <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
