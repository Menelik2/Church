import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function slugify(text: string) {
  const base =
    text
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\u1200-\u137F-]/g, "")
      .slice(0, 60) || "ann";
  return `${base}-${Date.now().toString(36)}`;
}

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return { supabase, user: null };
  return { supabase, user };
}

/** CREATE */
export async function POST(request: Request) {
  const { supabase, user } = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const title_am = String(body.title_am || "").trim();
    const body_am = String(body.body_am || "").trim();
    if (!title_am || !body_am) {
      return NextResponse.json(
        { error: "ርዕስ እና ይዘት ያስፈልጋሉ" },
        { status: 400 }
      );
    }

    const published = Boolean(body.published);
    const is_featured = Boolean(body.is_featured);
    const image_url = body.image_url ? String(body.image_url) : null;
    const slug = body.slug ? String(body.slug) : slugify(title_am);

    const { data, error } = await supabase
      .from("announcements")
      .insert({
        title_am,
        body_am,
        slug,
        published,
        is_featured,
        published_at: published ? new Date().toISOString() : null,
        image_url,
        created_by: user.id,
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ data });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Create failed" },
      { status: 500 }
    );
  }
}

/** UPDATE */
export async function PATCH(request: Request) {
  const { supabase, user } = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const id = String(body.id || "");
    if (!id) {
      return NextResponse.json({ error: "id ያስፈልጋል" }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const patch: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (body.title_am !== undefined) patch.title_am = String(body.title_am).trim();
    if (body.body_am !== undefined) patch.body_am = String(body.body_am).trim();
    if (body.image_url !== undefined) {
      patch.image_url = body.image_url ? String(body.image_url) : null;
    }
    if (body.is_featured !== undefined) patch.is_featured = Boolean(body.is_featured);
    if (body.published !== undefined) {
      patch.published = Boolean(body.published);
      patch.published_at = body.published ? new Date().toISOString() : null;
    }

    const { data, error } = await supabase
      .from("announcements")
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ data });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Update failed" },
      { status: 500 }
    );
  }
}

/** DELETE */
export async function DELETE(request: Request) {
  const { supabase, user } = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "id ያስፈልጋል" }, { status: 400 });
    }

    const { data: row } = await supabase
      .from("announcements")
      .select("image_url")
      .eq("id", id)
      .maybeSingle();

    if (row?.image_url) {
      try {
        const marker = "/announcement-images/";
        const idx = row.image_url.indexOf(marker);
        if (idx >= 0) {
          const objectPath = row.image_url.slice(idx + marker.length).split("?")[0];
          if (objectPath) {
            await supabase.storage.from("announcement-images").remove([objectPath]);
          }
        }
      } catch {
        // non-fatal
      }
    }

    const { error } = await supabase.from("announcements").delete().eq("id", id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Delete failed" },
      { status: 500 }
    );
  }
}
