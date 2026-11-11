# 0001 — Next.js App Router with TypeScript strict

- **Status:** Accepted
- **Date:** 2026-11-11

## Context

The rebuild needs file-based routes, server rendering, server actions, and a single deployable web app. The prototype used one client component with a `switch` on page state, which prevented deep linking, code splitting, and server-side data access.

## Decision

Use Next.js 15 with the App Router, TypeScript in `strict` mode, and a `src/` directory. Routes live in `src/app/[locale]/`; product logic lives in `src/features/`. Client components are opt-in (`"use client"` only where interaction requires it).

## Consequences

- Every page is a real URL, so links, refresh, and sharing work.
- Data access happens in server components, `queries.ts`, and `actions.ts`, not in client components.
- Route groups (`(public)`, `(auth)`, `(dashboard)`) separate layouts without changing URLs.
