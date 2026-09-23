import type { SupabaseClient } from "@supabase/supabase-js";

/** Count rows; returns 0 if table missing or RLS blocks. */
export async function safeCount(
  supabase: SupabaseClient,
  table: string,
  filters?: (q: ReturnType<SupabaseClient["from"]>) => unknown
): Promise<number> {
  try {
    let q = supabase.from(table).select("*", { count: "exact", head: true });
    if (filters) q = filters(q as never) as typeof q;
    const { count, error } = await q;
    if (error) return 0;
    return count ?? 0;
  } catch {
    return 0;
  }
}

/** Select list; returns [] on any error (missing table, RLS, network). */
export async function safeSelect<T>(
  supabase: SupabaseClient,
  table: string,
  build: (q: ReturnType<SupabaseClient["from"]>) => PromiseLike<{ data: T[] | null; error: unknown }>
): Promise<T[]> {
  try {
    const q = supabase.from(table);
    const { data, error } = await build(q as never);
    if (error) return [];
    return (data as T[]) ?? [];
  } catch {
    return [];
  }
}
