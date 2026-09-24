"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ImagePlus, X } from "lucide-react";

function toSlug(text: string) {
  return (
    text
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\u1200-\u137F-]/g, "")
      .slice(0, 80) || `ann-${Date.now()}`
  );
}

export function AnnouncementForm() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [titleAm, setTitleAm] = useState("");
  const [bodyAm, setBodyAm] = useState("");
  const [published, setPublished] = useState(true);
  const [featured, setFeatured] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("ምስሉ ከ 5MB በታች መሆን አለበት።");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("እባክዎ ምስል ብቻ ይምረጡ።");
      return;
    }
    setError(null);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function clearImage() {
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function uploadImage(supabase: ReturnType<typeof createClient>, slug: string) {
    if (!imageFile) return null;
    const ext = imageFile.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${slug}-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("announcement-images")
      .upload(path, imageFile, { cacheControl: "3600", upsert: false });
    if (upErr) throw new Error(upErr.message);
    const { data } = supabase.storage.from("announcement-images").getPublicUrl(path);
    return data.publicUrl;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const slug = toSlug(titleAm);

    try {
      let image_url: string | null = null;
      try {
        image_url = await uploadImage(supabase, slug);
      } catch (imgErr) {
        console.warn("image upload failed", imgErr);
        setError(
          "ምስል መጫን አልተሳካም። Storage bucket (announcement-images) ያረጋግጡ። ጽሁፉ ብቻ ይቀመጣል።"
        );
      }

      const { error: err } = await supabase.from("announcements").insert({
        title_am: titleAm,
        body_am: bodyAm,
        slug,
        published,
        is_featured: featured,
        published_at: published ? new Date().toISOString() : null,
        image_url,
      });

      if (err) {
        setError(err.message);
        setSaving(false);
        return;
      }

      setTitleAm("");
      setBodyAm("");
      setFeatured(true);
      clearImage();
      router.refresh();
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : "ስህተት ተከስቷል");
    }
    setSaving(false);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1 amharic">ርዕስ</label>
        <input
          value={titleAm}
          onChange={(e) => setTitleAm(e.target.value)}
          required
          placeholder="የወቅታዊ ጉዳይ ርዕስ"
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm amharic"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 amharic">ይዘት</label>
        <textarea
          value={bodyAm}
          onChange={(e) => setBodyAm(e.target.value)}
          required
          rows={5}
          placeholder="ሙሉ መግለጫ…"
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm amharic"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 amharic">ምስል (አማራጭ)</label>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={onFileChange}
          className="hidden"
          id="ann-image"
        />
        {imagePreview ? (
          <div className="relative overflow-hidden rounded-xl border border-[var(--border)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imagePreview} alt="" className="h-40 w-full object-cover" />
            <button
              type="button"
              onClick={clearImage}
              className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white"
              aria-label="ምስል አስወግድ"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <label
            htmlFor="ann-image"
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--border)] bg-[var(--muted)]/30 px-4 py-8 text-center transition hover:bg-[var(--muted)]/50"
          >
            <ImagePlus className="h-8 w-8 text-[var(--primary)]/60" />
            <span className="text-sm amharic text-[var(--foreground)]/70">ምስል ይምረጡ</span>
            <span className="text-[11px] text-[var(--foreground)]/45">JPEG · PNG · WebP · ከ5MB በታች</span>
          </label>
        )}
      </div>

      <div className="flex flex-wrap gap-4 text-sm amharic">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
          አትም (በድረ-ገጽ ይታይ)
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
          በመነሻ ገጽ አሳይ
        </label>
      </div>
      {error && <p className="text-sm text-red-600 amharic">{error}</p>}
      <button
        type="submit"
        disabled={saving}
        className="rounded-xl bg-[var(--primary)] text-white px-4 py-2.5 text-sm font-semibold disabled:opacity-50 amharic"
      >
        {saving ? "እየተቀመጠ…" : "ወቅታዊ ጉዳይ ፍጠር"}
      </button>
    </form>
  );
}
