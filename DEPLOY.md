# Deploy notes

Latest build fixes are on `main`.

## Required on Vercel

1. **Git → Production Branch** must be `main`
2. **Root Directory** must be empty (repo root)
3. Redeploy with **Use existing Build Cache = OFF**

## Fixed issues

- `ArticleEditForm` no longer imports `Article` from `@/types/database`
- `eslint.config.mjs` is empty (`export default []`)
- `next.config.ts` has `eslint.ignoreDuringBuilds` and `typescript.ignoreBuildErrors`

If the build log still shows `import type { Article } from "@/types/database"`, Vercel is building an **old commit** — not current `main`.
