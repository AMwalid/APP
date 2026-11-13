# AGENTS.md — IBNI

## What this is

IBNI: an Arabic-first (RTL), trilingual AR/FR/EN education platform for Algeria. The repo is a **shell**: Next.js 15 App Router, TypeScript strict, Tailwind v4, shadcn/ui, next-intl, Supabase clients. The navbar and real homepage are not built yet.

Product scope: `DOCS/spec.md`. Binding structure/rules: `DOCS/ARCHITECTURE.md`. Decisions: `DOCS/decisions/`.

## Commands

```bash
pnpm install
pnpm dev        # next dev --turbopack
pnpm lint       # ESLint 9 + import boundaries
pnpm typecheck  # tsc --noEmit
pnpm build
```

Gate before finishing: `pnpm lint` → `pnpm typecheck` → `pnpm build`. There is no test runner yet.

pnpm only. Do not add `package-lock.json`, `yarn.lock`, or `bun.lockb`.

## Structure and rules

- Routes only in `src/app/[locale]/` (`(public)`, `(auth)`, `(dashboard)` groups). Pages stay thin.
- Product code in `src/features/<topic>/` with `actions.ts`, `queries.ts`, `schemas.ts`, `types.ts`, `components/`, and a public `index.ts`. Import another feature only through its `index.ts`; never `@/features/x/...` internals.
- `src/components/{ui,layout,shared}`, `src/lib/{supabase,i18n,constants,utils}`, `src/config`, `src/messages`, `src/styles`. Do not invent folders.
- Only `queries.ts`/`actions.ts` may touch Supabase. `components/` and `lib/` never import `features/`. These rules are enforced by `eslint.config.mjs`; fix the import, don't disable the rule.
- Schema changes only as ordered files in `supabase/migrations/`; regenerate `src/types/database.ts` with `supabase gen types`. Never hand-edit generated types or `components/ui/*`.
- i18n: `ar` is the default, `fr` and `en` secondary. `localePrefix: "always"`, `localeDetection: false`; `dir` is set in `src/app/[locale]/layout.tsx`. Every user-visible string goes in `src/messages/ar.json`, `fr.json` and `en.json`. Use logical properties (`ms-*`, `me-*`, `start-*`, `end-*`), not `left`/`right`.
- Navigation is a product contract inherited from the prototype (see ARCHITECTURE §3): Parents, Students, Teachers, Institutions, Store, About + Login, Sign Up, Book a Demo. Do not rename or reorder.
- Visual source of truth is the prototype's rendered Tailwind values, expressed through tokens in `src/styles/globals.css` (`primary`, `primary-hover`, `primary-deep`, `surface-muted`, `border`, `muted-foreground`). Do not hardcode `green-600`/`gray-*` or copy prototype components. No `framer-motion`; use CSS transitions with `prefers-reduced-motion`.

## Gotchas

- Env: copy `.env.example` to `.env.local`. `src/config/env.ts` throws on import if Supabase public vars are missing; keep `lib/supabase/*` out of pages until env is configured.
- The old prototypes at `DOCS/reference/reference/old-prototypes/` are full Next apps containing `node_modules/`, `.next/`, and `.git/`. Read individual files; never install, build, run, or bulk-search them. Repo-root glob/ripgrep without excluding them is slow and times out.
- `DOCS/reference/screenshots/` and `DOCS/reference/ui-notes/` are still empty. Screenshots will be added later as the regression baseline.
- Docs folder is `DOCS/` (uppercase), even where older text says `docs/`.
