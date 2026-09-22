import type { Metadata } from "next";
import { Noto_Sans_Ethiopic, Noto_Serif_Ethiopic } from "next/font/google";
import "./globals.css";

const notoSansEthiopic = Noto_Sans_Ethiopic({
  variable: "--font-ethiopic",
  subsets: ["ethiopic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const notoSerifEthiopic = Noto_Serif_Ethiopic({
  variable: "--font-serif-eth",
  subsets: ["ethiopic"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ማኅተመ ክርስቶስ ሰንበት ት/ቤት | ሕግና ደንብ",
    template: "%s | ማኅተመ ክርስቶስ ሰንበት ት/ቤት",
  },
  description:
    "የደብረ ሰላም በዓለ እግዚአብሔር ቤተ ክርስቲያን ማኅተመ ክርስቶስ ሰንበት ት/ቤት የውስጥ መተዳደሪያ ሕግና ደንብ — Digital knowledge platform",
  keywords: [
    "ማኅተመ ክርስቶስ",
    "ሰንበት ትምህርት ቤት",
    "ኢትዮጵያ ኦርቶድክስ",
    "ባህር ዳር",
    "ሕግና ደንብ",
  ],
  openGraph: {
    title: "ማኅተመ ክርስቶስ ሰንበት ት/ቤት | ሕግና ደንብ",
    description: "የውስጥ መተዳደሪያ ሕግና ደንብ ዲጂታል መድረክ",
    locale: "am_ET",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="am"
      className={`${notoSansEthiopic.variable} ${notoSerifEthiopic.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-[family-name:var(--font-ethiopic)] bg-[var(--background)] text-[var(--foreground)]">
        {children}
      </body>
    </html>
  );
}
