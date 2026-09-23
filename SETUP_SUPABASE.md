# Supabase + Admin CMS setup

## 1. Create a Supabase project

1. Go to https://supabase.com and create a project.
2. Open **Project Settings → API** and copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` `secret` key → `SUPABASE_SERVICE_ROLE_KEY`

## 2. Environment

```bash
cp .env.example .env.local
# Edit .env.local with the three values above
```

## 3. Run SQL migrations

In Supabase **SQL Editor**, run in order:

1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_rls_admin_policies.sql`

## 4. Seed data (from PDF extract)

```bash
export $(grep -v '^#' .env.local | xargs)
npm run seed
```

This upserts Articles 1–16, 10 departments, programs, site settings, and a sample announcement.

## 5. Create an admin user

1. In Supabase **Authentication → Users**, add a user (email + password).
2. Promote to super admin:

```sql
UPDATE profiles SET role = 'super_admin' WHERE email = 'you@example.com';
```

## 6. Open Admin CMS

```bash
npm run dev
```

Visit: http://localhost:3000/admin/login

### Admin routes

| Path | Purpose |
|------|---------|
| `/admin` | Dashboard |
| `/admin/articles` | Edit regulation articles |
| `/admin/announcements` | Announcements |
| `/admin/events` | Events |
| `/admin/departments` | Departments |
| `/admin/messages` | Contact inbox |
| `/admin/settings` | Contact settings |

Never commit `.env.local` or the service role key. Keep legal text faithful to the PDF.
