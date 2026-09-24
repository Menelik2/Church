"use client";

import type { ReactElement } from "react";
import { useMemo, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ARTICLES } from "@/data/regulations";
import { Search, X, FileText } from "lucide-react";

type Hit = {
  number: number;
  title_am: string;
  title_en?: string;
  snippet: string;
};

function searchArticles(q: string): Hit[] {
  const term = q.trim().toLowerCase();
  if (term.length < 1) return [];

  const numMatch = term.match(/(?:አንቀጽ|art(?:icle)?|#)?\s*(\d{1,2})\s*$/i);
  if (numMatch && term.replace(/\s/g, "").length <= 12) {
    const n = Number(numMatch[1]);
    const art = ARTICLES[String(n)];
    if (art) {
      return [
        {
          number: art.number,
          title_am: art.title_am,
          title_en: art.title_en,
          snippet: art.content_am.replace(/\s+/g, " ").slice(0, 140) + "…",
        },
      ];
    }
  }

  if (term.length < 2) return [];

  const hits: Hit[] = [];
  for (const art of Object.values(ARTICLES)) {
    const hay = `${art.number} ${art.title_am} ${art.title_en ?? ""} ${art.content_am}`.toLowerCase();
    if (!hay.includes(term)) continue;

    const idx = art.content_am.toLowerCase().indexOf(term);
    let snippet: string;
    if (idx >= 0) {
      const start = Math.max(0, idx - 35);
      snippet =
        (start > 0 ? "…" : "") +
        art.content_am.slice(start, start + 130).replace(/\s+/g, " ") +
        "…";
    } else {
      snippet = art.content_am.replace(/\s+/g, " ").slice(0, 120) + "…";
    }
    hits.push({
      number: art.number,
      title_am: art.title_am,
      title_en: art.title_en,
      snippet,
    });
  }
  return hits.sort((a, b) => a.number - b.number);
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
      <mark
        key={key++}
        className="rounded bg-[var(--color-gold-200)] px-0.5 text-[var(--color-burgundy-900)]"
      >
        {text.slice(found, found + t.length)}
      </mark>
    );
    i = found + t.length;
  }
  return <>{parts}</>;
}

export function RulesSearch() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => searchArticles(q), [q]);
  const showPanel = open && q.trim().length >= 1;

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={wrapRef} className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--foreground)]/40" />
        <input
          ref={inputRef}
          type="search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="በአንቀጽ ቁጥር፣ ርዕስ ወይም ቃል ይፈልጉ… (ለም. አገልጋይ፣ 11)"
          className="w-full rounded-2xl border border-[var(--border)] bg-[var(--card)] py-3.5 pl-12 pr-12 text-sm shadow-md amharic placeholder:text-[var(--foreground)]/35 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)]"
          aria-label="በሕግና ደንብ ውስጥ ፈልግ"
          autoComplete="off"
        />
        {q && (
          <button
            type="button"
            onClick={() => {
              setQ("");
              setOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-[var(--foreground)]/40 hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            aria-label="አጽዳ"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {showPanel && (
        <div className="absolute left-0 right-0 z-40 mt-2 max-h-[min(70vh,28rem)] overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xl">
          {results.length === 0 && q.trim().length >= 2 && (
            <p className="px-4 py-8 text-center text-sm text-[var(--foreground)]/50 amharic">
              «{q}» ውጤት አልተገኘም። ሌላ ቃል ይሞክሩ።
            </p>
          )}
          {results.length === 0 && q.trim().length === 1 && (
            <p className="px-4 py-6 text-center text-xs text-[var(--foreground)]/45 amharic">
              ቢያንስ 2 ፊደል ወይም የአንቀጽ ቁጥር ይጻፉ
            </p>
          )}
          {results.length > 0 && (
            <>
              <p className="sticky top-0 border-b border-[var(--border)] bg-[var(--card)] px-4 py-2 text-xs text-[var(--foreground)]/50 amharic">
                {results.length} ውጤት
              </p>
              <ul>
                {results.map((r) => (
                  <li key={r.number} className="border-b border-[var(--border)] last:border-0">
                    <Link
                      href={`/rules/${r.number}`}
                      onClick={() => setOpen(false)}
                      className="flex gap-3 px-4 py-3.5 transition hover:bg-[var(--muted)]/60"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-sm font-bold text-[var(--primary)]">
                        {r.number}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold amharic text-[var(--primary)]">
                          <Highlight text={r.title_am} term={q.trim()} />
                        </span>
                        <span className="mt-0.5 block text-xs leading-relaxed text-[var(--foreground)]/55 amharic line-clamp-2">
                          <Highlight text={r.snippet} term={q.trim()} />
                        </span>
                      </span>
                      <FileText className="mt-1 h-4 w-4 shrink-0 text-[var(--foreground)]/25" />
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}
