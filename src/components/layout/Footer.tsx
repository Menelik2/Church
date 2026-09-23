import Link from "next/link";
import { EthiopianCross } from "@/components/orthodox/EthiopianCross";
import { DOCUMENT_META } from "@/data/regulations";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--color-burgundy-950)] text-white">
      <div className="h-0.5 bg-gradient-to-r from-transparent via-[var(--color-gold-500)] to-transparent" />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <EthiopianCross size={40} animate={false} gold />
              <div>
                <p className="font-bold amharic text-[var(--color-gold-300)]">
                  {DOCUMENT_META.organization_am}
                </p>
                <p className="text-xs text-white/60">\u1230\u1295\u1260\u1275 \u1275/\u1264\u1275</p>
              </div>
            </div>
            <p className="text-sm text-white/70 amharic max-w-md leading-relaxed">
              {DOCUMENT_META.organization_am} \u2014 \u12e8\u12cd\u1235\u1325 \u1218\u1270\u12f3\u12f0\u122a\u12eb \u1215\u130d\u1293 \u12f0\u1295\u1265 \u12f2\u1302\u1273\u120d \u1218\u12f5\u1228\u12ad\u1362
              \u12ed\u12d8\u1271 \u12a8\u12a6\u134a\u1234\u120b\u12ca\u12cd PDF \u1230\u1290\u12f5 \u12e8\u1270\u12ce\u1230\u12f0 \u1290\u12cd\u1362
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-gold-300)] mb-3">\u12a0\u1230\u1233</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/rules" className="hover:text-[var(--color-gold-200)]">\u1215\u130d\u1293 \u12f0\u1295\u1265</Link></li>
              <li><Link href="/departments" className="hover:text-[var(--color-gold-200)]">\u12ad\u134d\u120e\u127d</Link></li>
              <li><Link href="/services" className="hover:text-[var(--color-gold-200)]">\u12a0\u1308\u120d\u130d\u120e\u1276\u127d</Link></li>
              <li><Link href="/contact" className="hover:text-[var(--color-gold-200)]">\u12a0\u130d\u1299\u1295</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-gold-300)] mb-3">\u1230\u1290\u12f5</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/pdf" className="hover:text-[var(--color-gold-200)]">PDF \u121b\u12cd\u1228\u12f5</Link></li>
              <li><Link href="/search" className="hover:text-[var(--color-gold-200)]">\u134d\u1208\u130b</Link></li>
              <li><Link href="/admin" className="hover:text-[var(--color-gold-200)]">\u12a0\u1235\u1270\u12f3\u12f0\u122d</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/10 text-center text-xs text-white/50 amharic">
          \u00a9 {new Date().getFullYear()} {DOCUMENT_META.organization_am} \u00b7{" "}
          {DOCUMENT_META.revision_date_am}
        </div>
      </div>
    </footer>
  );
}
