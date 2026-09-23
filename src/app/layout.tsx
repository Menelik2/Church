import type { Metadata } from "next";
import { Noto_Sans_Ethiopic, Noto_Serif_Ethiopic } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
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
    default: "ደብረ ሰላም በዓለ እግዚአብሔር ቤተ ክርስቲያን · ማእተመ ክርስቶስ ሰንበት ት/ቤት",
    template: "%s | ደብረ ሰላም በዓለ እግዚአብሔር",
  },
  description:
    "የደብረ ሰላም በዓለ እግዚአብሔር ቤተ ክርስቲያን እና የማእተመ ክርስቶስ ሰንበት ት/ቤት ኦፊሴላዊ ድረ-ገጽ — አገልግሎት፣ ዝግጅት፣ ክፍሎች፣ አባልነት እና ሕግና ደንብ። ባሕር ዳር ሀገረ ስብከት።",
  keywords: [
    "ደብረ ሰላም በዓለ እግዚአብሔር",
    "ማእተመ ክርስቶስ",
    "ሰንበት ትምሕርት ቤት",
    "ኢትዮጵያ ኦርጦዶክስ ተዋሕዶ",
    "ባሕር ዳር",
    "ቤተ ክርስቲያን",
  ],
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "ደብረ ሰላም በዓለ እግዚአብሔር ቤተ ክርስቲያን · ማእተመ ክርስቶስ ሰንበት ት/ቤት",
    description: "ኦፊሴላዊ የቤተ ክርስቲያን እና የሰንበት ት/ቤት ድረ-ገጽ — አገልግሎት፣ ዝግጅት፣ ክፍሎች",
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
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <MobileBottomNav />
      </body>
    </html>
  );
}
