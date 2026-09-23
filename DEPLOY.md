# Deploy notes

Latest functional fixes are on `main`.

## Required on Vercel

1. **Git → Production Branch** must be `main`
2. **Root Directory** must be empty (repo root)
3. Redeploy with **Use existing Build Cache = OFF**
4. Keep **only one** Vercel project linked to this repo  
   (duplicate projects: `church`, `churchsethio`, `churchsethios` each burn deploy quota)

## Rate limit (Hobby)

If GitHub shows a red ✕ with:

`Deployment rate limited — retry in 24 hours`

- Code is fine; Vercel blocked more deploys for ~24h
- Disconnect extra Vercel Git connections
- Wait, then **Redeploy** from the single remaining project
- Project `makhteme-kristos` may already have succeeded while others failed

## Supabase

Run migrations **001–010** in the SQL editor before using:

- Member journey (`/admin/operations/journey`)
- Mezmur roster (`/admin/workspace/mezmur?tab=choir`)
- Relations register (`/admin/workspace/genegnet?tab=correspondence`)
- Property checkout (`/admin/workspace/nebrat?tab=checkout`)

## Fixed issues

- Property checkout now decrements / restores `property_items.quantity`
- Journey advance completes course enrollments and updates `new_member_register`
- Error hints point to migrations 001–010
- Workspace quick-links for ውሰት and የአባል ጉዞ
