# 0008 — English locale

- **Status:** Accepted
- **Date:** 2026-11-13
- **Amends:** 0004 (Arabic-first locale with RTL)

## Context

Decision 0004 fixed the platform at two locales, `ar` and `fr`, with Arabic as
the default. The product owner then asked for English as a third locale: the
same pages, the same navigation contract, reachable at `/en`.

English is not a replacement for French. Algeria's market is Arabic-first and
French-second; English is an additional surface for institutions, partners and
diaspora users, not a change of primary language. Arabic therefore stays the
default and `/` still resolves to `/ar`.

## Decision

- Locales are exactly `["ar", "fr", "en"]`, in that order, in
  `src/lib/i18n/routing.ts`. `defaultLocale` stays `"ar"`.
- Direction is unchanged from 0004: `ar` is `rtl`, `fr` and `en` are `ltr`.
  The existing `dir={locale === "ar" ? "rtl" : "ltr"}` ternary covers `en`
  without modification.
- `localePrefix: "always"` and `localeDetection: false` still hold, so every
  URL carries its locale (`/ar/...`, `/fr/...`, `/en/...`).
- Copy lives in `src/messages/en.json`, mirroring the key tree of `ar.json` and
  `fr.json` exactly. The language switcher renders AR / FR / EN from
  `routing.locales`, so adding a locale to the routing config is the only place
  the toggle's contents are defined.
- English copy is US English, not a transliteration of the French.

## Consequences

- **Three files must stay key-identical.** A key added to one message file and
  not the others fails silently at runtime (next-intl renders the key path), so
  key parity is part of the review checklist, not just a nice-to-have.
- **The locale switcher is a real navigation.** Each option links to the
  current pathname in the target locale, which keeps URLs shareable and works
  without JavaScript. Query strings are dropped until `/find-resources` exists.
- **English is LTR but not the narrowest locale.** At 1280px the navigation is
  ~576px in English against ~652px in French and ~522px in Arabic. French
  remains the worst case for header width, so header layout decisions must be
  validated against French, not English.
- **The accessible name for each language is localized**, e.g. `الإنجليزية`
  in Arabic, `Anglais` in French and `English` in English, so a screen reader
  announces the language in the language the user is currently reading.
- `DOCS/spec.md` still describes an Arabic + French product. That file is the
  product brief and was left untouched; this decision records the delta.
