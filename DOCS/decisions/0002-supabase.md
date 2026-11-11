# 0002 — Supabase for data, auth, and storage

- **Status:** Accepted
- **Date:** 2026-11-11

## Context

`DOCS/ARCHITECTURE.md` assumes Supabase: SQL migrations, Row Level Security, generated TypeScript types, and a service-role key used server-side only. The product needs relational data (users, institutions, teachers, classes, requests, reviews, marketplace listings) with per-role access control.

## Decision

Use Supabase (Postgres + Auth + Storage). Access it through `@supabase/ssr`:

- `src/lib/supabase/client.ts` — browser client.
- `src/lib/supabase/server.ts` — server client bound to cookies.
- `src/lib/supabase/middleware.ts` — session refresh.
- `src/lib/supabase/admin.ts` — service-role client, server-only.

Schema changes are ordered files in `supabase/migrations/`. Regenerate `src/types/database.ts` with `supabase gen types` after every migration; never edit it by hand.

## Consequences

- RLS policies are required on every table; the server layer also re-checks permissions.
- The service-role key must never reach client code.
- Local development needs a Supabase project or the Supabase CLI.
