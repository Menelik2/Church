"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, X } from "lucide-react";
import { compressImageClient } from "@/lib/images/compress";

export type AnnouncementEdit = {
  id: string;
  title_am: string;
  body_am: string;
  published: boolean;
  is_featured: boolean;
  image_url: string | null;
};

type Props = {
  edit?: AnnouncementEdit | null;
  onDone?: () => void;
};

export function AnnouncementForm({ edit = null, onDone }: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [titleAm, setTitleAm] = useState(edit?.title_am ?? "");
  const [bodyAm, setBodyAm] = useState(edit?.body_am ?? "");
  const [published, setPublished] = useState(edit?.published ?? true);
  const [featured, setFeatured] = useState(edit?.is_featured ?? true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    edit?.image_url ?? null
  );
  const [removeImage, setRemoveImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  useEffect(() => {
    if (edit) {
      setTitleAm(edit.title_am);
      setBodyAm(edit.body_am);
      setPublished(edit.published);
      setFeatured(edit.is_featured);
      setImagePreview(edit.image_url);
      setImageFile(null);
      setRemoveImage(false);
      setError(null);
      setOk(null);
    }
  }, [edit]);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      setError("ምስሉ ከ 8MB በታች መሆን አለበት (ከመጫን በፊት ይጨመቃል)።");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("እባክዎ ምስል ብቻ ይምረጡ።");
      return;
    }
    setError(null);
    setRemoveImage(false);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function clearImage() {
    setImageFile(null);
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setRemoveImage(true);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function uploadViaApi(file: File): Promise<string> {
    // Client-side compression middleware (canvas) before network
    let toSend = file;
    try {
      toSend = await compressImageClient(file);
    } catch {
      toSend = file;
    }

    const fd = new FormData();
    fd.append("file", toSend);
    const res = await fetch("/api/admin/announcements/upload", {
      method: "POST",
      body: fd,
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(json.error || `Upload failed (${res.status})`);
    }
    if (!json.url) throw new Error("URL አልተመለሰም");
    return json.url as string;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!titleAm.trim() || !bodyAm.trim()) return;
    setSaving(true);
    setError(null);
    setOk(null);

    try {
      let image_url: string | null | undefined = undefined;

      if (imageFile) {
        try {
          image_url = await uploadViaApi(imageFile);
        } catch (imgErr) {
          const detail =
            imgErr instanceof Error ? imgErr.message : String(imgErr);
          setError(`ምስል መጫን አልተሳካም፦ ${detail}`);
          setSaving(false);
          return;
        }
      } else if (removeImage) {
        image_url = null;
      }

      if (edit) {
        const payload: Record<string, unknown> = {
          id: edit.id,
          title_am: titleAm.trim(),
          body_am: bodyAm.trim(),
          published,
          is_featured: featured,
        };
        if (image_url !== undefined) payload.image_url = image_url;

        const res = await fetch("/api/admin/announcements", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(json.error || "ማዘመን አልተሳካም");
          setSaving(false);
          return;
        }
        setOk("ተዘምኗል");
        onDone?.();
        router.refresh();
      } else {
        const res = await fetch("/api/admin/announcements", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title_am: titleAm.trim(),
            body_am: bodyAm.trim(),
            published,
            is_featured: featured,
            image_url: image_url ?? null,
          }),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(json.error || "መፍጠር አልተሳካም");
          setSaving(false);
          return;
        }
        setTitleAm("");
        setBodyAm("");
        setFeatured(true);
        setPublished(true);
        setImageFile(null);
        setImagePreview(null);
        setRemoveImage(false);
        if (fileRef.current) fileRef.current.value = "";
        setOk(image_url ? "ወቅታዊ ጉዳይ + ምስል ተመዝግቧል" : "ወቅታዊ ጉዳይ ተመዝግቧል");
        router.refresh();
      }
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : "ስህተት ተከስቷል");
    }
    setSaving(false);
  }

  const isEdit = Boolean(edit);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {isEdit && (
        <p className="text-xs text-[var(--primary)] amharic font-medium">
          እየተስተካከለ · {edit?.title_am}
        </p>
      )}
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
        <label className="block text-sm font-medium mb-1 amharic">
          ምስል (አማራጭ)
        </label>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={onFileChange}
          className="hidden"
          id={isEdit ? "ann-image-edit" : "ann-image"}
        />
        {imagePreview ? (
          <div className="relative overflow-hidden rounded-xl border border-[var(--border)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagePreview}
              alt=""
              className="h-40 w-full object-cover"
            />
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
            htmlFor={isEdit ? "ann-image-edit" : "ann-image"}
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--border)] bg-[var(--muted)]/30 px-4 py-8 text-center transition hover:bg-[var(--muted)]/50"
          >
            <ImagePlus className="h-8 w-8 text-[var(--primary)]/60" />
            <span className="text-sm amharic text-[var(--foreground)]/70">
              ምስል ይምረጡ
            </span>
            <span className="text-[11px] text-[var(--foreground)]/45">
              JPEG · PNG · WebP · ከ8MB (ይጨመቃል)
            </span>
          </label>
        )}
      </div>

      <div className="flex flex-wrap gap-4 text-sm amharic">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          አትም (በድረ-ገጽ ይታይ)
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
          />
          በመነሻ ገጽ አሳይ
        </label>
      </div>
      {error && (
        <p className="text-sm text-red-600 amharic whitespace-pre-wrap">
          {error}
        </p>
      )}
      {ok && <p className="text-sm text-emerald-600 amharic">{ok}</p>}
      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 rounded-xl bg-[var(--primary)] text-white px-4 py-2.5 text-sm font-semibold disabled:opacity-50 amharic"
        >
          {saving
            ? "እየተቀመጠ…"
            : isEdit
              ? "ለውጦችን አስቀምጥ"
              : "ወቅታዊ ጉዳይ ፍጠር"}
        </button>
        {isEdit && onDone && (
          <button
            type="button"
            onClick={onDone}
            className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm amharic"
          >
            ሰርዝ
          </button>
        )}
      </div>
    </form>
  );
}
