"use client";

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
  Scale,
  Building2,
  HandHeart,
} from "lucide-react";
import { EthiopianCross } from "@/components/orthodox/EthiopianCross";
import { motion } from "framer-motion";

const links = [
  { href: "/about", label: "መግቢያ", desc: "ታሪክ አመጣጥ", icon: Info },
  { href: "/vision", label: "ርእይ", desc: "የሰንበት ት/ቤት ርእይ", icon: Eye },
  { href: "/mission", label: "ተልዕኮ", desc: "የሰንበት ት/ቤት ተልዕኮ", icon: Heart },
  { href: "/objectives", label: "ዓላማ", desc: "አጠቃላይ ዓላማዎች", icon: Target },
  { href: "/organization", label: "መዋቅር", desc: "የድርጅት መዋቅር", icon: Users },
  { href: "/rules", label: "ሕግና ደንብ", desc: "አንቀጾች 1–16", icon: Scale },
  { href: "/departments", label: "ክፍሎች", desc: "አገልግሎት ክፍሎች", icon: Building2 },
  { href: "/services", label: "አገልግሎቶች", desc: "ማመልከቻና ጥያቄ", icon: HandHeart },
  { href: "/announcements", label: "ማስታወቂያ", desc: "አዳዲስ መረጃዎች", icon: Megaphone },
  { href: "/events", label: "ዝግጅቶች", desc: "መርሐግብርና ክስተቶች", icon: Calendar },
  { href: "/search", label: "ፍለጋ", desc: "በሕግና ደንብ ውስጥ ፈልግ", icon: Search },
  { href: "/pdf", label: "PDF ማውረድ", desc: "ኦፊሴላዊ ሰነድ", icon: Download },
  { href: "/contact", label: "አግኙን", desc: "አድራሻና መልእክት", icon: Mail },
];

export default function MorePage() {
  return (
    <div className="mx-auto max-w-lg px-4 pt-5 pb-28">
      <div className="mb-6 flex items-center gap-3">
        <EthiopianCross size={36} gold animate={false} />
        <div>
          <h1 className="text-xl font-bold amharic text-[var(--primary)] leading-tight">
            ተጨማሪ መድረኮች
          </h1>
          <p className="text-xs text-[var(--foreground)]/55 amharic">
            ሁሉም ገጾችና አገልግሎቶች
          </p>
        </div>
      </div>

      <ul className="space-y-2.5">
        {links.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.li
              key={item.href}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.25 }}
            >
              <Link
                href={item.href}
                className="flex items-center gap-3.5 rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-3.5 shadow-sm active:scale-[0.98] transition"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)]">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-semibold amharic text-[var(--foreground)]">
                    {item.label}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-[var(--foreground)]/55 amharic">
                    {item.desc}
                  </span>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-[var(--foreground)]/25" />
              </Link>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
