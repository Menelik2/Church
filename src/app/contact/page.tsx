import { DOCUMENT_META } from "@/data/regulations";
import { ContactForm } from "./ContactForm";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "አግኙን",
  description: "ማኅተመ ክርስቶስ ሰንበት ት/ቤትን ያግኙ",
};

export default async function ContactPage() {
  let contact: {
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    note?: string | null;
  } = { note: "Not provided in the source document." };

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "contact")
      .maybeSingle();
    if (data?.value && typeof data.value === "object") {
      contact = data.value as typeof contact;
    }
  } catch {
    // Supabase not configured
  }

  const hasContact =
    Boolean(contact.email) || Boolean(contact.phone) || Boolean(contact.address);

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-[var(--primary)] amharic">አግኙን</h1>
      <p className="mt-2 text-[var(--foreground)]/60 amharic">የማኅተመ ክርስቶስ ሰንበት ት/ቤት</p>

      <div className="mt-10 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
        <div>
          <p className="text-xs font-medium text-[var(--foreground)]/50">ድርጅት</p>
          <p className="amharic font-medium">{DOCUMENT_META.organization_am}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-[var(--foreground)]/50">ቤተ ክርስቲያን</p>
          <p className="amharic">{DOCUMENT_META.church_am}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-[var(--foreground)]/50">ሀገረ ስብከት</p>
          <p className="amharic">{DOCUMENT_META.diocese_am}</p>
        </div>

        {hasContact ? (
          <div className="pt-4 border-t border-[var(--border)] space-y-2 text-sm amharic">
            {contact.address && (
              <p>
                <span className="text-[var(--foreground)]/50">አድራሻ፡ </span>
                {contact.address}
              </p>
            )}
            {contact.phone && (
              <p>
                <span className="text-[var(--foreground)]/50">ስልክ፡ </span>
                <a href={`tel:${contact.phone}`} className="text-[var(--primary)]">{contact.phone}</a>
              </p>
            )}
            {contact.email && (
              <p>
                <span className="text-[var(--foreground)]/50">ኢሜይል፡ </span>
                <a href={`mailto:${contact.email}`} className="text-[var(--primary)]">{contact.email}</a>
              </p>
            )}
          </div>
        ) : (
          <div className="pt-4 border-t border-[var(--border)]">
            <p className="text-sm text-[var(--foreground)]/60 amharic leading-relaxed">
              አድራሻ፣ ስልክ እና ኢሜይል በምንጭ ሰነዱ ውስጥ አልተገኘም። አስተዳዳሪው በአስተዳደር ቅንብሮች ውስጥ ማስገባት ይችላል።
            </p>
          </div>
        )}
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold amharic text-[var(--primary)] mb-4">መልእክት ይላኩ</h2>
        <ContactForm />
      </div>
    </div>
  );
}
