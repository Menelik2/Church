import type { Metadata } from "next";
import { Noto_Sans_Ethiopic, Noto_Serif_Ethiopic } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
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
    default: "\u121b\u12a5\u1270\u1218 \u12ad\u122d\u1235\u1276\u1235 \u1230\u1295\u1260\u1275 \u1275/\u1264\u1275 | \u1215\u130d\u1293 \u12f0\u1295\u1265",
    template: "%s | \u121b\u12a5\u1270\u1218 \u12ad\u122d\u1235\u1276\u1235 \u1230\u1295\u1260\u1275 \u1275/\u1264\u1275",
  },
  description:
    "\u12e8\u12f0\u1265\u1228 \u1230\u120b\u121d \u1260\u12d3\u1208 \u12a5\u130d\u12da\u12a0\u1265\u1204\u122d \u1264\u1270 \u12ad\u122d\u1235\u1272\u12eb\u1295 \u121b\u12a5\u1270\u1218 \u12ad\u122d\u1235\u1276\u1235 \u1230\u1295\u1260\u1275 \u1275/\u1264\u1275 \u12e8\u12cd\u1235\u1325 \u1218\u1270\u12f3\u12f0\u122a\u12eb \u1215\u130d\u1293 \u12f0\u1295\u1265 \u2014 Digital knowledge platform",
  keywords: [
    "\u121b\u12a5\u1270\u1218 \u12ad\u122d\u1235\u1276\u1235",
    "\u1230\u1295\u1260\u1275 \u1275\u121d\u1215\u122d\u1275 \u1264\u1275",
    "\u12a2\u1275\u12ee\u1335\u12eb \u12a6\u122d\u1276\u12f5\u12ad\u1235",
    "\u1263\u1205\u122d \u12f3\u122d",
    "\u1215\u130d\u1293 \u12f0\u1295\u1265",
  ],
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "\u121b\u12a5\u1270\u1218 \u12ad\u122d\u1235\u1276\u1235 \u1230\u1295\u1260\u1275 \u1275/\u1264\u1275 | \u1215\u130d\u1293 \u12f0\u1295\u1265",
    description: "\u12e8\u12cd\u1235\u1325 \u1218\u1270\u12f3\u12f0\u122a\u12eb \u1215\u130d\u1293 \u12f0\u1295\u1265 \u12f2\u1302\u1273\u120d \u1218\u12f5\u1228\u12ad",
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
      </body>
    </html>
  );
}
