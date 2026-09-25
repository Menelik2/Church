import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/jpg",
]);

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
      return NextResponse.json(
        { error: "እባክዎ እንደገና ይግቡ (unauthorized)" },
        { status: 401 }
      );
    }

    const form = await request.formData();
    const file = form.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "ፋይል አልተገኘም" }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "ምስሉ ከ 5MB በታች መሆን አለበት።" },
        { status: 400 }
      );
    }

    const type = (file.type || "").toLowerCase();
    if (type && !ALLOWED.has(type)) {
      return NextResponse.json(
        { error: "JPEG, PNG, WebP ወይም GIF ብቻ" },
        { status: 400 }
      );
    }

    const ext =
      file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") ||
      "jpg";
    const path = `ann-${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .slice(2, 8)}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: upErr } = await supabase.storage
      .from("announcement-images")
      .upload(path, buffer, {
        contentType: type || "image/jpeg",
        cacheControl: "3600",
        upsert: true,
      });

    if (upErr) {
      const msg = upErr.message || String(upErr);
      let hint = msg;
      if (/bucket|not found|does not exist/i.test(msg)) {
        hint =
          "Bucket «announcement-images» የለም። Supabase → Storage ውስጥ public bucket ይፍጠሩ ወይም SQL migration 014 ያሂዱ።";
      } else if (/policy|row-level|permission|denied|403|401|JWT/i.test(msg)) {
        hint =
          "ፈቃድ የለም። SQL Editor ውስጥ migration 014 (authenticated upload policy) ያሂዱ። · " +
          msg;
      }
      return NextResponse.json({ error: hint }, { status: 400 });
    }

    const { data } = supabase.storage
      .from("announcement-images")
      .getPublicUrl(path);

    if (!data?.publicUrl) {
      return NextResponse.json(
        { error: "Public URL ማግኘት አልተቻለም። Bucket public መሆኑን ያረጋግጡ።" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: data.publicUrl, path });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
