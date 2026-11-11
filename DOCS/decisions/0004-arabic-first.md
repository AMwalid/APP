# 0004 — Arabic-first locale with RTL

- **Status:** Accepted
- **Date:** 2026-11-11

## Context

`DOCS/spec.md` requires Arabic and French, with Arabic as the primary market language. The prototype was English-only and LTR, so its layout cannot be ported as-is.

## Decision

- Locales: `ar` and `fr`; `ar` is the default.
- `localePrefix: "always"` — every URL carries its locale (`/ar/...`, `/fr/...`).
- `localeDetection: false` — `/` always resolves to `/ar`, not the browser language.
- `<html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>`.
- Use logical CSS properties (`ms-*`, `me-*`, `start-*`, `end-*`) instead of `left`/`right`.

## Consequences

- Every page and test must run in both directions.
- The navbar's dropdowns and mobile panel must mirror correctly in RTL.
- Translation keys live in `src/messages/ar.json` and `src/messages/fr.json`; no user-visible string is hardcoded.
