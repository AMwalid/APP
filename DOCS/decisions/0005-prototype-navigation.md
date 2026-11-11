# 0005 — Navigation and visual contract from the prototype

- **Status:** Accepted
- **Date:** 2026-11-11

## Context

`DOCS/reference/screenshots/` and `DOCS/reference/ui-notes/` are empty. The only visual source is the old prototype's rendered Tailwind classes. The product owner chose to keep the prototype's navigation instead of redesigning the IA.

## Decision

- Top-level nav: Parents, Students, Teachers, Institutions, Store, About.
- Right-side actions: Login, Sign Up, Book a Demo.
- Dropdown contents and target routes are recorded in `DOCS/ARCHITECTURE.md` §10.
- The visual contract is the prototype's rendered Tailwind values (colors, spacing, typography, breakpoints, hover/active states). Reimplement them with semantic tokens; do not copy component code or inline styles.
- Screenshots will be added later and become the regression baseline.

## Consequences

- The navbar must match the prototype visually, not structurally.
- Nav data lives in `src/lib/constants/navigation.ts`; labels live in both message files.
- Any future IA change is a product decision, not an implementation detail.
