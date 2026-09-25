import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  compressImageServer,
  IMAGE_LIMITS,
} from "@/lib/images/compress";

export const runtime = "nodejs";

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

    if (file.size > IMAGE_LIMITS.maxInputBytes) {
      return NextResponse.json(
        {
          error: `ምስሉ ከ ${Math.round(IMAGE_LIMITS.maxInputBytes / 1024 / 1024)}MB በታች መሆን አለበት።`,
        },
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

    const raw = Buffer.from(await file.arrayBuffer());

    // --- Image compression middleware ---
    const compressed = await compressImageServer(raw, type || undefined);

    const path = `ann-${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .slice(2, 8)}.${compressed.ext}`;

    const { error: upErr } = await supabase.storage
      .from("announcement-images")
      .upload(path, compressed.buffer, {
        contentType: compressed.contentType,
        cacheControl: "31536000",
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

    const ratio =
      compressed.originalBytes > 0
        ? Math.round(
            (1 - compressed.compressedBytes / compressed.originalBytes) * 100
          )
        : 0;

    return NextResponse.json({
      url: data.publicUrl,
      path,
      contentType: compressed.contentType,
      width: compressed.width,
      height: compressed.height,
      originalBytes: compressed.originalBytes,
      compressedBytes: compressed.compressedBytes,
      savedPercent: Math.max(0, ratio),
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
