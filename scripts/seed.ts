/**
 * Seed Supabase from authoritative regulations.ts + articles-extra.ts
 *
 * Usage:
 *   1. Copy .env.example → .env.local and fill Supabase keys
 *   2. Run migrations in Supabase SQL editor (001 then 002)
 *   3. npm run seed
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY (never commit this).
 */

import { createClient } from "@supabase/supabase-js";
import { ARTICLES, DEPARTMENTS, DOCUMENT_META, HISTORY } from "../src/data/regulations";

function slugify(n: number) {
  return `article-${n}`;
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error(
      "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in env"
    );
    process.exit(1);
  }

  const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log("Seeding Makhteme Kristos data from PDF extract…");

  const articleRows = Object.values(ARTICLES).map((a) => ({
    article_number: a.number,
    title_am: a.title_am,
    title_en: a.title_en ?? null,
    slug: slugify(a.number),
    content_am: a.content_am,
    content_en: null,
    order_index: a.number,
    published: true,
  }));

  const { error: artErr } = await supabase
    .from("articles")
    .upsert(articleRows, { onConflict: "article_number" });

  if (artErr) {
    console.error("Articles seed failed:", artErr.message);
    process.exit(1);
  }
  console.log(`✓ Articles upserted (${articleRows.length})`);

  const deptRows = DEPARTMENTS.map((d) => ({
    slug: d.slug,
    title_am: d.title_am,
    title_en: d.title_en ?? null,
    description_am: null,
    order_index: d.order,
    published: true,
  }));

  const { error: deptErr } = await supabase
    .from("departments")
    .upsert(deptRows, { onConflict: "slug" });

  if (deptErr) {
    console.error("Departments seed failed:", deptErr.message);
    process.exit(1);
  }
  console.log(`✓ Departments upserted (${deptRows.length})`);

  const programs = [
    { slug: "children", title_am: "የሕፃናት መርሐግብር", title_en: "Children Program", description_am: "ደቂቅ (7-10)፣ ማዕከላውያን (11-17)", order_index: 1, published: true },
    { slug: "youth", title_am: "የወጣቶች መርሐግብር", title_en: "Youth Program", description_am: null, order_index: 2, published: true },
    { slug: "workers", title_am: "የባለሥራዎች ጉባኤ", title_en: "Workers Assembly", description_am: null, order_index: 3, published: true },
    { slug: "campus", title_am: "የመሰናድ ግቢ ጉባኤ", title_en: "Campus Assembly", description_am: null, order_index: 4, published: true },
    { slug: "st-michael", title_am: "የቅዱስ ሚካኤል የጽዋ ማህበር", title_en: "St. Michael Cup Society", description_am: null, order_index: 5, published: true },
  ];

  const { error: progErr } = await supabase
    .from("programs")
    .upsert(programs, { onConflict: "slug" });

  if (progErr) {
    console.error("Programs seed failed:", progErr.message);
    process.exit(1);
  }
  console.log(`✓ Programs upserted (${programs.length})`);

  const settings = [
    {
      key: "organization",
      value: {
        name_am: DOCUMENT_META.organization_am,
        name_en: DOCUMENT_META.organization_en,
        church_am: DOCUMENT_META.church_am,
        diocese_am: DOCUMENT_META.diocese_am,
        revision_date_am: DOCUMENT_META.revision_date_am,
      },
    },
    {
      key: "contact",
      value: {
        email: null,
        phone: null,
        address: null,
        note: "Not provided in the source document.",
      },
    },
    {
      key: "history",
      value: {
        intro_am: HISTORY.intro_am,
        founding_am: HISTORY.founding_am,
        timeline: HISTORY.timeline,
      },
    },
  ];

  for (const s of settings) {
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key: s.key, value: s.value });
    if (error) {
      console.error(`Setting ${s.key} failed:`, error.message);
      process.exit(1);
    }
  }
  console.log(`✓ Site settings upserted (${settings.length})`);

  const { error: annErr } = await supabase.from("announcements").upsert(
    {
      title_am: "እንኳን ደህና መጡ",
      title_en: "Welcome",
      slug: "welcome",
      body_am:
        "ወደ ማኅተመ ክርስቶስ ሰንበት ት/ቤት ድረ-ገጽ እንኳን በደህና መጡ። የውስጥ መተዳደሪያ ሕግና ደንብ በዚህ ጣቢያ ላይ ማንበብ ይችላሉ።",
      body_en:
        "Welcome to the Makhteme Kristos Sunday School website. You can read the internal regulations here.",
      category: "general",
      is_featured: true,
      published: true,
      published_at: new Date().toISOString(),
    },
    { onConflict: "slug" }
  );

  if (annErr) console.warn("Announcement seed:", annErr.message);
  else console.log("✓ Sample announcement");

  console.log("\nSeed complete. Promote a user to super_admin in SQL:");
  console.log(
    `  UPDATE profiles SET role = 'super_admin' WHERE email = 'you@example.com';`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
