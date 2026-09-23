import type { SupabaseClient } from "@supabase/supabase-js";
import { formatAppError, type AppError } from "@/lib/errors";

export type SafeResult<T> = {
  data: T;
  error: AppError | null;
};

/** Count rows; returns 0 if table missing or RLS blocks. */
export async function safeCount(
  supabase: SupabaseClient,
  table: string,
  filters?: (q: ReturnType<SupabaseClient["from"]>) => unknown
): Promise<number> {
  const r = await safeCountDetailed(supabase, table, filters);
  return r.data;
}

export async function safeCountDetailed(
  supabase: SupabaseClient,
  table: string,
  filters?: (q: ReturnType<SupabaseClient["from"]>) => unknown
): Promise<SafeResult<number>> {
  try {
    let q = supabase.from(table).select("*", { count: "exact", head: true });
    if (filters) q = filters(q as never) as typeof q;
    const { count, error } = await q;
    if (error) {
      return { data: 0, error: formatAppError(error) };
    }
    return { data: count ?? 0, error: null };
  } catch (e) {
    return { data: 0, error: formatAppError(e) };
  }
}

/** Select list; returns [] on any error (missing table, RLS, network). */
export async function safeSelect<T>(
  supabase: SupabaseClient,
  table: string,
  build: (
    q: ReturnType<SupabaseClient["from"]>
  ) => PromiseLike<{ data: T[] | null; error: unknown }>
): Promise<T[]> {
  const r = await safeSelectDetailed<T>(supabase, table, build);
  return r.data;
}

export async function safeSelectDetailed<T>(
  supabase: SupabaseClient,
  table: string,
  build: (
    q: ReturnType<SupabaseClient["from"]>
  ) => PromiseLike<{ data: T[] | null; error: unknown }>
): Promise<SafeResult<T[]>> {
  try {
    const q = supabase.from(table);
    const { data, error } = await build(q as never);
    if (error) {
      return { data: [], error: formatAppError(error) };
    }
    return { data: (data as T[]) ?? [], error: null };
  } catch (e) {
    return { data: [], error: formatAppError(e) };
  }
}
