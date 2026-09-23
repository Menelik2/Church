# Supabase setup — ማኅተመ ክርስቶስ

## 1. Create project

https://supabase.com → New project

## 2. Environment

Copy `.env.example` → `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # server / seed only
```

## 3. Run migrations (SQL Editor, in order)

1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_rls_admin_policies.sql`
3. `supabase/migrations/003_operational_workflows.sql`
4. `supabase/migrations/004_elections.sql`

## 4. Seed regulations

```bash
npm install
npm run seed
```

## 5. First admin user

1. Sign up via `/admin/login` (or Supabase Auth → Users)
2. In SQL Editor:

```sql
UPDATE profiles SET role = 'super_admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'you@example.com');
```

## 6. Run app

```bash
npm run dev
```

- Public: http://localhost:3000
- Admin: http://localhost:3000/admin
- Operations: http://localhost:3000/admin/operations

## Notes

- Contact details are **not** in the PDF — set them under `/admin/settings`.
- PDF text remains authoritative for articles 1–16.
