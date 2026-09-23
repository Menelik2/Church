-- Promote fanakulu4@gmail.com to super_admin
-- Run this in Supabase Dashboard → SQL Editor AFTER the user has signed up once
-- (profile row is created when the auth user exists).

-- 1) If the user already exists in auth.users + profiles:
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

-- 2) Ensure profile row exists (when auth user exists but profile missing)
INSERT INTO public.profiles (id, email, role, is_active)
SELECT u.id, u.email, 'super_admin'::user_role, true
FROM auth.users u
WHERE u.email = 'fanakulu4@gmail.com'
  AND NOT EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.id = u.id
  );

-- Verify:
-- SELECT id, email, role, is_active FROM public.profiles WHERE email = 'fanakulu4@gmail.com';
