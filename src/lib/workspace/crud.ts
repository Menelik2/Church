"use client";

import { createClient } from "@/lib/supabase/client";
import { formatAppError } from "@/lib/supabase/safe-count";

export async function insertRow<T extends Record<string, unknown>>(
  table: string,
  row: Record<string, unknown>,
  select = "*"
): Promise<{ data: T | null; error: string | null }> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from(table)
      .insert(row)
      .select(select)
      .single();
    if (error) return { data: null, error: formatAppError(error) };
    return { data: data as T, error: null };
  } catch (e) {
    return { data: null, error: formatAppError(e) };
  }
}

export async function updateRow(
  table: string,
  id: string,
  patch: Record<string, unknown>
): Promise<{ error: string | null }> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from(table)
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) return { error: formatAppError(error) };
    return { error: null };
  } catch (e) {
    return { error: formatAppError(e) };
  }
}

export async function deleteRow(
  table: string,
  id: string
): Promise<{ error: string | null }> {
  try {
    const supabase = createClient();
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) return { error: formatAppError(error) };
    return { error: null };
  } catch (e) {
    return { error: formatAppError(e) };
  }
}
