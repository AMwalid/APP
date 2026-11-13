# 0004 — Arabic-first locale with RTL

- **Status:** Accepted, amended by [0008](./0008-english-locale.md)
- **Date:** 2026-11-11

> **Update — 2026-11-13.** The locale set is now `["ar", "fr", "en"]` and the
> platform supports English as well as French. Arabic remains the default and
> `/` still resolves to `/ar`; `localeDetection` is still off. Direction is
> unchanged: `ar` is `rtl`, `fr` and `en` are `ltr`. Copy now lives in
> `src/messages/ar.json`, `fr.json` and `en.json`. Everything else in this
> decision still applies. See [0008](./0008-english-locale.md).

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
- Translation keys live in `src/messages/ar.json`, `src/messages/fr.json` and `src/messages/en.json`; no user-visible string is hardcoded.
