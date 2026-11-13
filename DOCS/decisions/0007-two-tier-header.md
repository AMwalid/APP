# 0007 — Two-tier header

- **Status:** Accepted
- **Date:** 2026-11-13

## Context

Decision 0005 pinned the header to the old prototype: one white sticky bar, six
sections on one side, Login / Sign Up / Book a Demo on the other. The product
owner then supplied a reference (YaSchools) whose header has a different
structure: a slim dark utility strip above a main bar, with the primary
navigation centred between the brand and the calls to action.

Decision 0005 says the rebuild matches the prototype *visually, not
structurally*. Adopting the new skeleton is therefore a product decision that
has to be recorded, not an implementation detail.

## Decision

Adopt the reference's structure, keep IBNI's visual language.

- Two tiers inside a single sticky `<header>`:
  - a dark utility bar (`bg-primary-deep`, 2.25rem, hidden below `md`) with
    quick links on the start edge and the locale switcher plus Login on the
    end edge;
  - the white main bar (4rem) with brand, the six sections centred in the free
    space, then an icon-only search control, Sign Up and Book a Demo.
- Login moves out of the action cluster into the utility bar. `NAV_ACTIONS`
  stays as the ordered superset (`NAV_LOGIN` + `NAV_CTAS`) so the mobile sheet
  renders every account action in one place.
- The search control is a button that opens a placeholder command palette.
  It does not navigate and there is no index yet.
- Both tiers stay on screen when scrolling. `--header-height` is the total and
  grows at `md`, where the utility bar appears.

## Consequences

- Colours, radii, shadows, fonts and motion still come only from
  `src/styles/globals.css`. The dark bar reuses `primary-deep`; no new colour
  token was added.
- The navigation is centred by construction: the main bar is
  `grid-cols-[1fr_auto_1fr]`, so the two side tracks are equal and the `auto`
  navigation track lands on the container's axis. At 1280px the content box is
  1201px; Arabic (521.9px nav) and English (576.3px nav) centre exactly, but
  French (651.9px nav) plus its 299.6px action cluster needs 1275.2px, so the
  side tracks hit the cluster's min-content floor and French sits 37.1px off
  centre. Closing that gap means tightening the navigation or the CTAs.
- Below `xl` the sheet is the only navigation surface, so it must also carry
  the utility links or they become unreachable on phones.
- Replacing the placeholder palette with real search only touches
  `src/components/layout/search-button.tsx`; the trigger and its accessible
  name stay.
