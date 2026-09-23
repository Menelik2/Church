-- Auto-create profile when a new auth user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, is_active)
  VALUES (
    NEW.id,
    NEW.email,
    'visitor',
    true
  )
  ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Promote known admin (idempotent)
UPDATE public.profiles
SET role = 'super_admin', is_active = true, updated_at = NOW()
WHERE email = 'fanakulu4@gmail.com'
   OR id IN (SELECT id FROM auth.users WHERE email = 'fanakulu4@gmail.com');

INSERT INTO public.profiles (id, email, role, is_active)
SELECT u.id, u.email, 'super_admin'::user_role, true
FROM auth.users u
WHERE u.email = 'fanakulu4@gmail.com'
  AND NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = u.id);
