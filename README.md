# ማኅተመ ክርስቶስ ሰንበት ት/ቤት | Makhteme Kristos Sunday School

**የውስጥ መተዳደሪያ ሕግና ደንብ Digital Platform**

Official institutional website for  
**ደብረ ሰላም በዓለ እግዚአብሔር ቤተ ክርስቲያን – ማኅተመ ክርስቶስ ሰንበት ት/ቤት**  
(Bahir Dar Diocese, Ethiopian Orthodox Tewahedo Church)

Source document: *ማኅተመ ክርስቶስ ህግና ደንብ.pdf* (Revised ሰኔ 30/2016 ዓ.ም)

---

## Vision

Transform the static PDF regulations into a professional, searchable, Amharic-first digital knowledge platform for members and visitors.

## Tech Stack

- **Frontend**: Next.js 15 (App Router) + TypeScript + Tailwind CSS 4 + Framer Motion + Lucide
- **i18n**: next-intl (Amharic primary, English secondary)
- **Backend**: Next.js Server Actions / Route Handlers
- **Database & Auth**: Supabase (PostgreSQL + Auth + Storage + RLS)
- **Deployment**: Vercel
- **Fonts**: Noto Sans Ethiopic / Noto Serif Ethiopic

## Current Status (Foundation)

- [x] Project scaffold (Next.js + Tailwind)
- [x] Design system (burgundy / gold / ivory / charcoal)
- [x] Structured content extraction from the official PDF (`src/data/regulations.ts`)
- [x] Full database schema + RLS starter policies (`supabase/migrations/001_initial_schema.sql`)
- [x] Document metadata (revision date preserved exactly)
- [ ] Complete Article 8–13 content population (from full PDF text)
- [ ] Digital document reader (`/rules`) with TOC, search, progress
- [ ] Homepage + all public pages
- [ ] Admin dashboard + CMS
- [ ] Supabase Auth + role-based access
- [ ] PWA + offline reading
- [ ] Full Amharic/English UI strings

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/Menelik2/Church.git
cd Church
npm install --legacy-peer-deps
```

### 2. Environment

Copy `.env.example` → `.env.local` and fill:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key   # server only
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Database

1. Create a Supabase project
2. Run the migration: `supabase/migrations/001_initial_schema.sql` in the SQL editor
3. (Optional) Seed articles from `src/data/regulations.ts`

### 4. Run locally

```bash
npm run dev
```

Open http://localhost:3000

### 5. Deploy to Vercel

Connect the GitHub repo to Vercel, add the environment variables, and deploy.

## Content Rule (Critical)

The uploaded PDF is the **authoritative source**.

- Do **not** invent, summarize, or alter legal rules.
- Keep Amharic text as the source of truth.
- Any missing information must be marked “Not provided in the source document” or made configurable in the admin panel.

## Project Structure

```
src/
  app/                 # App Router pages
  components/          # UI + layout + document reader
  data/                # Structured regulations (from PDF)
  lib/                 # Supabase client, utils, i18n
  types/
messages/              # next-intl translation files
supabase/
  migrations/          # SQL schema
public/                # Static assets + original PDF
```

## Roadmap Priority

1. Finish full article content population from PDF
2. Build `/rules` document reader (TOC + search + progress)
3. Homepage + About / Vision / Mission / Objectives / Departments
4. Supabase Auth + Admin CMS
5. Search, Bookmarks, PWA
6. Polish, SEO, accessibility, performance

## License & Copyright

© 2016–2026 የማኅተመ ክርስቶስ ሰንበት ት/ቤት. All rights reserved.  
Content derived from the official internal regulations document.
