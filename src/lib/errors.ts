/**
 * Map Supabase / PostgREST / network errors to user-facing Amharic + technical detail.
 */

export type AppError = {
  /** Short Amharic message for UI */
  messageAm: string;
  /** Optional English */
  messageEn?: string;
  /** Technical code (PGRST116, 42501, etc.) */
  code?: string;
  /** Raw message for admins / console */
  detail?: string;
  /** Suggested fix */
  hintAm?: string;
};

function str(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (typeof v === "object" && v !== null && "message" in v) {
    return String((v as { message: unknown }).message ?? "");
  }
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

export function formatAppError(err: unknown): AppError {
  if (!err) {
    return {
      messageAm: "ያልታወቀ ስህተት ተከስቷል",
      messageEn: "Unknown error",
    };
  }

  const any = err as {
    message?: string;
    code?: string;
    details?: string;
    hint?: string;
    status?: number;
    statusCode?: number;
  };

  const raw = str(any.message || err);
  const code = any.code || undefined;
  const lower = raw.toLowerCase();

  // Missing table / relation
  if (
    code === "42P01" ||
    lower.includes("does not exist") ||
    lower.includes("relation") && lower.includes("exist")
  ) {
    return {
      messageAm: "የውሂብ ሰንጠረዥ አልተገኘም",
      messageEn: "Database table not found",
      code,
      detail: raw,
      hintAm:
        "በSupabase SQL Editor ላይ migrations (001–007) ያሂዱ።",
    };
  }

  // RLS / permission
  if (
    code === "42501" ||
    code === "PGRST301" ||
    lower.includes("row-level security") ||
    lower.includes("permission denied") ||
    lower.includes("not authorized")
  ) {
    return {
      messageAm: "ፈቃድ የለዎትም (RLS)",
      messageEn: "Permission denied",
      code,
      detail: raw,
      hintAm:
        "መግባትዎን ያረጋግጡ፤ role = admin/super_admin መሆኑን በprofiles ያረጋግጡ።",
    };
  }

  // JWT / session
  if (
    lower.includes("jwt") ||
    lower.includes("session") ||
    lower.includes("not authenticated") ||
    any.status === 401
  ) {
    return {
      messageAm: "ክፍለ-ጊዜዎ አልቋል — እንደገና ይግቡ",
      messageEn: "Session expired",
      code,
      detail: raw,
      hintAm: "ወደ /admin/login ይመለሱ።",
    };
  }

  // Unique violation
  if (code === "23505" || lower.includes("duplicate") || lower.includes("unique")) {
    return {
      messageAm: "ይህ መረጃ አስቀድሞ አለ",
      messageEn: "Duplicate entry",
      code,
      detail: raw,
    };
  }

  // Foreign key
  if (code === "23503") {
    return {
      messageAm: "ተያያዥ መረጃ አልተገኘም",
      messageEn: "Related record missing",
      code,
      detail: raw,
    };
  }

  // Network
  if (
    lower.includes("failed to fetch") ||
    lower.includes("network") ||
    lower.includes("fetch")
  ) {
    return {
      messageAm: "ኢንተርኔት / አገልጋይ ግንኙነት አልተሳካም",
      messageEn: "Network error",
      code,
      detail: raw,
      hintAm: "ኢንተርኔትዎን እና NEXT_PUBLIC_SUPABASE_URL ያረጋግጡ።",
    };
  }

  // Missing env / invalid supabase URL
  if (
    lower.includes("supabase") && lower.includes("undefined") ||
    lower.includes("invalid url")
  ) {
    return {
      messageAm: "Supabase አልተዋቀረም",
      messageEn: "Supabase not configured",
      code,
      detail: raw,
      hintAm:
        "በVercel Environment Variables ላይ NEXT_PUBLIC_SUPABASE_URL እና ANON_KEY ያክሉ።",
    };
  }

  return {
    messageAm: "ስህተት ተከስቷል",
    messageEn: raw.slice(0, 120) || "Error",
    code,
    detail: raw || any.details,
    hintAm: any.hint,
  };
}

export function errorToDisplay(err: unknown): string {
  const e = formatAppError(err);
  const parts = [e.messageAm];
  if (e.code) parts.push(`(${e.code})`);
  if (e.hintAm) parts.push(`— ${e.hintAm}`);
  return parts.join(" ");
}
