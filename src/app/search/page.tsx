"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ARTICLES } from "@/data/regulations";
import { Search } from "lucide-react";

export default function SearchPage() {
  const [q, setQ] = useState("");

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term || term.length < 2) return [];

    const hits: { number: number; title_am: string; snippet: string }[] = [];

    for (const art of Object.values(ARTICLES)) {
      const hay = `${art.title_am} ${art.content_am}`.toLowerCase();
      if (hay.includes(term)) {
        const idx = art.content_am.toLowerCase().indexOf(term);
        const start = Math.max(0, idx - 40);
        const snippet =
          (start > 0 ? "…" : "") +
          art.content_am.slice(start, start + 120).replace(/\n/g, " ") +
          "…";
        hits.push({ number: art.number, title_am: art.title_am, snippet });
      }
    }
    return hits.sort((a, b) => a.number - b.number);
  }, [q]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-[var(--primary)] amharic">
        ፈልግ
      </h1>
      <p className="mt-2 text-[var(--foreground)]/60">
        በሕግና ደንብ ውስጥ ይፈልጉ
      </p>

      <div className="mt-8 relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--foreground)]/40" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ቃል ወይም ሐረግ ይጻፉ…"
          className="w-full rounded-2xl border border-[var(--border)] bg-[var(--card)] py-3.5 pl-12 pr-4 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)]"
          autoFocus
        />
      </div>

      {q.trim().length >= 2 && (
        <p className="mt-4 text-sm text-[var(--foreground)]/50">
          {results.length} ውጤት
        </p>
      )}

      <ul className="mt-6 space-y-3">
        {results.map((r) => (
          <li key={r.number}>
            <Link
              href={`/rules/${r.number}`}
              className="block rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm transition hover:border-[var(--color-burgundy-300)]"
            >
              <span className="text-xs font-bold text-[var(--primary)]">
                አንቀጽ {r.number}
              </span>
              <h2 className="mt-1 font-semibold amharic">{r.title_am}</h2>
              <p className="mt-2 text-sm text-[var(--foreground)]/60 amharic line-clamp-2">
                {r.snippet}
              </p>
            </Link>
          </li>
        ))}
      </ul>

      {q.trim().length >= 2 && results.length === 0 && (
        <p className="mt-8 text-center text-[var(--foreground)]/50 amharic">
          ውጤት አልተገኘም። ሌላ ቃል ይሞክሩ።
        </p>
      )}
    </div>
  );
}
