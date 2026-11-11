# IBNI

Bilingual (Arabic-first, French) education platform for Algeria.

## Stack

Next.js 15 (App Router), TypeScript strict, Tailwind CSS v4, shadcn/ui, next-intl, Supabase.

## Development

```bash
pnpm install
# copy .env.example to .env.local and fill in the values
pnpm dev
```

Verification gate:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

## Documentation

- `DOCS/ARCHITECTURE.md` — folder layout, import rules, navigation, data rules
- `DOCS/spec.md` — product requirements
- `DOCS/decisions/` — architecture decision records
- `AGENTS.md` — instructions for AI agents working in this repo
