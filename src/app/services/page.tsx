import Link from "next/link";
import { UserPlus, Heart, BookOpen, Calendar } from "lucide-react";

export const metadata = {
  title: "አገልግሎቶች",
  description: "የማኅተመ ክርስቶስ ሰንበት ት/ቤት የአገልግሎት ጥያቄዎች እና ሂደቶች",
};

const services = [
  {
    href: "/services/membership",
    title: "የአገልጋይነት / ቋሚ አባልነት ጥያቄ",
    desc: "አንቀጽ 14 — የቋሚ አባልነት መመዘኛ መስፈርቶች",
    icon: UserPlus,
  },
  {
    href: "/services/wedding",
    title: "የሰርግ አጃቢ አገልግሎት",
    desc: "አንቀጽ 15 — የሰርግ እጀባ (ቢያንስ 2 ሳምንት አስቀድሞ)",
    icon: Heart,
  },
  {
    href: "/rules/11",
    title: "የአገልጋይ መብት",
    desc: "አንቀጽ 11",
    icon: BookOpen,
  },
  {
    href: "/rules/12",
    title: "የአገልጋይ ግዴታ",
    desc: "አንቀጽ 12",
    icon: BookOpen,
  },
  {
    href: "/events",
    title: "ዝግጅቶችና ስብሰባዎች",
    desc: "ጠቅላላ ጉባኤ፣ አማካሪ ቦርድ",
    icon: Calendar,
  },
];

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-[var(--primary)] amharic">አገልግሎቶችና ሂደቶች</h1>
      <p className="mt-2 text-sm text-[var(--foreground)]/60 amharic leading-relaxed">
        ከማኅተመ ክርስቶስ ህግና ደንብ የተወሰዱ የአገልግሎት ጥያቄዎች። ሕጋዊ ይዘት አልተቀየረም።
      </p>
      <div className="mt-10 grid gap-4">
        {services.map(({ href, title, desc, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 hover:border-[var(--color-burgundy-300)] transition"
          >
            <Icon className="h-6 w-6 text-[var(--primary)] shrink-0 mt-0.5" />
            <div>
              <h2 className="font-semibold amharic text-[var(--primary)]">{title}</h2>
              <p className="mt-1 text-sm text-[var(--foreground)]/60 amharic">{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
