# Admin setup — fanakulu4@gmail.com

## Steps (Supabase Dashboard)

### 1. Create the auth user (if not already)
1. Open your Supabase project
2. **Authentication → Users → Add user**
3. Email: `fanakulu4@gmail.com`
4. Set a strong password (only you know it)
5. Confirm email if required (or disable “Confirm email” in Auth settings for testing)

### 2. Promote to super_admin
1. **SQL Editor → New query**
2. Paste and run:

```sql
UPDATE public.profiles
SET
  role = 'super_admin',
  is_active = true,
  email = COALESCE(email, 'fanakulu4@gmail.com'),
  updated_at = NOW()
WHERE email = 'fanakulu4@gmail.com'
   OR id IN (
     SELECT id FROM auth.users WHERE email = 'fanakulu4@gmail.com'
   );

INSERT INTO public.profiles (id, email, role, is_active)
SELECT u.id, u.email, 'super_admin'::user_role, true
FROM auth.users u
WHERE u.email = 'fanakulu4@gmail.com'
  AND NOT EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.id = u.id
  );

SELECT id, email, role, is_active
FROM public.profiles
WHERE email = 'fanakulu4@gmail.com';
```

You should see `role = super_admin` and `is_active = true`.

### 3. Log in
1. Open: `https://YOUR-DOMAIN/admin/login`
2. Email: `fanakulu4@gmail.com`
3. Password: the one you set in step 1

### Notes
- Passwords are never stored in this repo and cannot be recovered from code.
- Allowed admin roles: `super_admin`, `admin`, `editor`.
- If login redirects back to login, check `profiles.role` and `is_active`.
