# ማኅተመ ክርስቶስ ሰንበት ት/ቤት — Digital Platform

Official knowledge platform for **ደብረ ሰላም በዓለ እግዚአብሔር ቤተ ክርስቲያን · ማኅተመ ክርስቶስ ሰንበት ት/ቤት** (Bahir Dar Diocese).

Authoritative content source: *ማኅተመ ክርስቶስ ህግና ደንብ.pdf* (ሰኔ 30/2016 ዓ.ም).

## Stack

- **Next.js 15** (App Router) + TypeScript + Tailwind CSS 4
- **Supabase** (Auth, PostgreSQL, RLS)
- Amharic-first UI (Noto Sans Ethiopic)
- Admin CMS at `/admin`

## Quick start

```bash
npm install
cp .env.example .env.local
# Fill NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY

# In Supabase SQL Editor run:
#   supabase/migrations/001_initial_schema.sql
#   supabase/migrations/002_rls_admin_policies.sql

npm run seed
npm run dev
```

See **[SETUP_SUPABASE.md](./SETUP_SUPABASE.md)** for admin user promotion.

## Public routes

| Path | Description |
|------|-------------|
| `/` | Homepage |
| `/rules`, `/rules/[n]` | Regulations reader (Articles 1–16) |
| `/search` | Search regulations |
| `/about`, `/vision`, `/mission`, `/objectives`, `/organization` | About |
| `/departments`, `/programs` | Structure |
| `/membership/*` | Rights, duties, criteria |
| `/announcements` | Published news |
| `/events` | Events calendar |
| `/contact` | Contact + message form → Supabase |
| `/pdf` | Official PDF download |

## Admin

| Path | Description |
|------|-------------|
| `/admin/login` | Sign in |
| `/admin` | Dashboard |
| `/admin/articles` | Edit articles |
| `/admin/announcements` | Manage announcements |
| `/admin/events` | Manage events |
| `/admin/messages` | Contact inbox |
| `/admin/settings` | Contact details (not in PDF) |

## Deploy (Vercel)

1. Import `Menelik2/Church` on Vercel
2. Set env vars from `.env.example`
3. Deploy — branch `main`

## Content rule

Do **not** invent legal rules. PDF text is authoritative. Missing contact data is admin-configurable only.
