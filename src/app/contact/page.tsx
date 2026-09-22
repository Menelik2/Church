import { DOCUMENT_META } from "@/data/regulations";

export const metadata = {
  title: "አግኙን",
  description: "ማኅተመ ክርስቶስ ሰንበት ት/ቤትን ያግኙ",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-[var(--primary)] amharic">
        አግኙን
      </h1>
      <p className="mt-2 text-[var(--foreground)]/60 amharic">
        የማኅተመ ክርስቶስ ሰንበት ት/ቤት
      </p>

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
        <div className="pt-4 border-t border-[var(--border)]">
          <p className="text-sm text-[var(--foreground)]/60 amharic leading-relaxed">
            አድራሻ፣ ስልክ፣ ኢሜይል እና የቢሮ ሰዓት በአስተዳዳሪው በኩል በሲስተሙ ውስጥ
            ይገለጻል። በምንጭ ሰነዱ ውስጥ የተወሰነ የመገኛ መረጃ አልተገኘም።
          </p>
        </div>
      </div>

      <form className="mt-10 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">ስም</label>
          <input
            type="text"
            name="name"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)]"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">ኢሜይል</label>
          <input
            type="email"
            name="email"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">መልእክት</label>
          <textarea
            name="message"
            rows={4}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)]"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          ላክ
        </button>
        <p className="text-xs text-[var(--foreground)]/50 text-center">
          መልእክቶች በአስተዳዳሪው ዳሽቦርድ ላይ ይቀመጣሉ (Supabase)።
        </p>
      </form>
    </div>
  );
}
