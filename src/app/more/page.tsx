import Link from "next/link";
import {
  Info,
  Megaphone,
  Calendar,
  Mail,
  Search,
  Download,
  Target,
  Eye,
  Heart,
  Users,
  ChevronRight,
} from "lucide-react";

const links = [
  { href: "/about", label: "ስለ እኛ", desc: "ታሪክና መረጃ", icon: Info },
  { href: "/vision", label: "ርእይ", desc: "የሰንበት ት/ቤቱ ርእይ", icon: Eye },
  { href: "/mission", label: "ተልዕኮ", desc: "ተልዕኮና እሴቶች", icon: Heart },
  { href: "/objectives", label: "ዓላማ", desc: "አጠቃላይ ዓላማዎች", icon: Target },
  { href: "/organization", label: "መዋቅር", desc: "የድርጅት መዋቅር", icon: Users },
  { href: "/announcements", label: "ማስታወቂያ", desc: "አዳዲስ መረጃዎች", icon: Megaphone },
  { href: "/events", label: "ዝግጅቶች", desc: "መርሐግብርና ክስተቶች", icon: Calendar },
  { href: "/search", label: "ፍለጋ", desc: "በሕግና ደንብ ውስጥ ፈልግ", icon: Search },
  { href: "/pdf", label: "PDF ማውረድ", desc: "ኦፊሴላዊ ሰነድ", icon: Download },
  { href: "/contact", label: "አግኙን", desc: "አድራሻና መልእክት", icon: Mail },
];

export default function MorePage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-6 pb-28">
      <h1 className="text-xl font-bold amharic text-[var(--primary)] mb-1">
        ተጨማሪ
      </h1>
      <p className="text-sm text-[var(--foreground)]/60 amharic mb-6">
        ሁሉም ገጾችና አገልግሎቶች
      </p>
      <ul className="space-y-2">
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-3.5 active:scale-[0.98] transition shadow-sm"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block font-semibold amharic text-[var(--foreground)]">
                    {item.label}
                  </span>
                  <span className="block text-xs text-[var(--foreground)]/55 amharic truncate">
                    {item.desc}
                  </span>
                </span>
                <ChevronRight className="h-4 w-4 text-[var(--foreground)]/30 shrink-0" />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
