import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Safe head-count query — never throws; returns 0 on missing table / RLS / network error.
 */
export async function safeCount(
  supabase: SupabaseClient,
  table: string,
  filters?: (q: ReturnType<SupabaseClient["from"]>) => unknown
): Promise<number> {
  try {
    let q = supabase.from(table).select("*", { count: "exact", head: true });
    if (filters) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      q = filters(q as any) as typeof q;
    }
    const { count, error } = await q;
    if (error) return 0;
    return count ?? 0;
  } catch {
    return 0;
  }
}

/**
 * Safe select — returns [] on any error.
 */
export async function safeSelect<T = Record<string, unknown>>(
  supabase: SupabaseClient,
  table: string,
  build?: (q: ReturnType<SupabaseClient["from"]>) => unknown
): Promise<T[]> {
  try {
    let q = supabase.from(table).select("*");
    if (build) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      q = build(q as any) as typeof q;
    }
    const { data, error } = await q;
    if (error || !data) return [];
    return data as T[];
  } catch {
    return [];
  }
}

export function formatAppError(err: unknown): string {
  if (!err) return "ያልታወቀ ስህተት";
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message;
  if (typeof err === "object" && err !== null && "message" in err) {
    return String((err as { message: unknown }).message);
  }
  return "ያልታወቀ ስህተት";
}
