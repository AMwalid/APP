# ARCHITECTURE.md — IBNI

How the project is organised, and why. Read this before creating any file.
Goal: anyone (including you in 6 months, or an AI) can answer "where does this go?" in under 10 seconds.

## 1. Core idea

One codebase, three layers, organised by **feature** (not by file type).

```
 UI layer        what the user sees      (pages, components)
    ↓ calls
 Server layer    rules and permissions   (actions, queries)
    ↓ calls
 Data layer      storage and security    (Supabase, migrations, RLS)
```

**Dependencies only flow downward.** The UI never touches the database. The database knows nothing about the UI.
This is the "front/back separation", enforced by folders and lint rules instead of by two separate apps. If a native mobile app is added later, the server layer can be exposed as an API without a rewrite.

## 2. Folder structure

```
ibni/
├─ AGENTS.md                 rules for AI and humans
├─ DESIGN.md                 design system
├─ DOCS/
│  ├─ spec.md                what we are building (screens, flows)
│  ├─ ARCHITECTURE.md        this file
│  ├─ decisions/             one short file per big decision (0001-*.md)
│  ├─ backlog.md             ideas that are NOT in the MVP
│  └─ reference/             screenshots and notes from old prototypes
├─ supabase/
│  ├─ migrations/            every schema change, in order
│  └─ seed.sql               test and starter data
├─ public/                   static files, icons, PWA manifest
├─ tests/                    end-to-end tests of the main flows
└─ src/
   ├─ app/[locale]/          ROUTES ONLY (thin: fetch, compose, render)
   │  ├─ (public)/           home, find-resources, institution/[id], teacher/[id], store, about, contact, user-guide, prices, invest
   │  ├─ (auth)/             login, signup, book-demo
   │  └─ (dashboard)/        parents/, students/, teachers/, institutions/, admin/
   ├─ features/              THE PRODUCT, one folder per business topic
   │  ├─ auth/
   │  ├─ parents/            parent dashboard, child profiles, tracking
   │  ├─ students/           student dashboard, progress, gamification
   │  ├─ teachers/           teacher profiles, classes, student records
   │  ├─ institutions/       institution profiles, admin dashboards
   │  ├─ search/             find-resources (schools + teachers)
   │  ├─ store/              marketplace listings, orders, offers
   │  ├─ requests/           contact and information requests + replies
   │  ├─ saves/
   │  ├─ reviews/
   │  ├─ verification/       admin approval, reports
   │  └─ profile/            user settings
   ├─ components/
   │  ├─ ui/                 shadcn primitives (button, input, dialog)
   │  ├─ layout/             header, footer, sidebar, page shells
   │  └─ shared/             generic pieces used by 2+ features (empty-state, rating-stars)
   ├─ lib/
   │  ├─ supabase/           client.ts, server.ts, middleware.ts
   │  ├─ i18n/               next-intl config, helpers
   │  ├─ constants/          wilayas.ts, levels.ts, subjects.ts (single source of truth)
   │  └─ utils/              small pure helpers (format-date, cn)
   ├─ config/
   │  ├─ env.ts              validates environment variables with Zod
   │  └─ site.ts             site name, URLs, limits
   ├─ messages/              ar.json, fr.json
   ├─ styles/                globals.css, theme tokens (from DESIGN.md)
   └─ types/
      └─ database.ts         GENERATED from Supabase. Never edit by hand.
```

### Inside every feature folder

```
features/institutions/
├─ components/       UI pieces for this feature only (institution-card.tsx)
├─ actions.ts        write operations (server actions): create, update, delete
├─ queries.ts        read operations: getInstitutionById, searchInstitutions
├─ schemas.ts        Zod validation (shared by forms and actions)
├─ types.ts          TypeScript types for this feature
└─ index.ts          the PUBLIC door: only what other code may import
```

Not every feature needs every file. Create a file only when it has content.

## 3. Navigation and information architecture

The public navbar is inherited from the prototype and is the contract for the rebuild. Top-level items with a dropdown use Option (A): the whole item is the trigger (disclosure button), and the first row of its dropdown panel is the section landing link (e.g. clicking Parents opens the menu, where the first item is Parents pointing to `/parents`). Items without a dropdown (Store) are plain links. Never nest a button inside a link.

| Top-level | Landing route | Dropdown |
|---|---|---|
| Parents | `/parents` | Find Schools (`/find-resources?tab=schools`), Find Teachers (`/find-resources?tab=teachers`), Track My Kid (`/parents/track-kid`), My Courses (`/parents/my-courses`) |
| Students | `/students` | Find Schools (`/find-resources?tab=schools`), Find Teachers (`/find-resources?tab=teachers`), Track My Progress (`/students/track-progress`), My Courses (`/students/my-courses`) |
| Teachers | `/teachers` | My Profile (`/teachers/profile`), Manage My Classes (`/teachers/classes`) |
| Institutions | `/institutions` | My Profile (`/institutions/profile`), School Dashboard (`/institutions/dashboard`) |
| Store | `/store` | — |
| About | `/about` | About Us (`/about`), Contact Us (`/contact`), User Guide (`/user-guide`), Our Prices (`/prices`), Invest in IBNI (`/invest`) |

The header has two tiers, both inside one sticky `<header>`:

1. **Dark utility bar** — `bg-primary-deep`, 2.25rem tall, hidden below `md`. Quick links on the start edge: Contact Us (`/contact`), About IBNI (`/about`), Help (`/help`). Locale switcher and Login (`/login`) on the end edge.
2. **White main bar** — 4rem tall. Brand on the start edge, the six sections centred in the free space, and on the end edge an icon-only search control (opens a placeholder palette until global search exists) followed by Sign Up (`/signup`, solid) and Book a Demo (`/book-demo`, outlined).

Below `xl` the main bar collapses to brand, search and the hamburger; the sheet carries the sections, the quick links, the locale switcher and all three account actions.

Rules:

- The structure lives in `src/lib/constants/navigation.ts` (`NAV_ITEMS`, `NAV_TOP_LINKS`, `NAV_LOGIN`, `NAV_CTAS`, `NAV_ACTIONS`); labels live in `src/messages/{ar,fr}.json`.
- Both tiers are sticky together. `--header-height` is the total height and grows from `md` up; page shells subtract it.
- The main bar is a `grid-cols-[auto_minmax(0,1fr)_auto]` grid. The navigation is centred in the middle track, not optically centred in the viewport, because the FR action cluster is wider than the brand.
- Desktop dropdowns open on hover and on keyboard focus; the mobile panel traps focus while open.
- The visual contract is the prototype's rendered Tailwind values. See `DOCS/decisions/0005-prototype-navigation.md` and `DOCS/decisions/0007-two-tier-header.md`.
- Changing this IA is a product decision. Do not rename or reorder items during implementation.

## 4. Where does X go?

| I am writing... | It goes in... |
|---|---|
| A new page / URL | `app/[locale]/...` (keep it under ~50 lines) |
| A button, input, dialog | `components/ui` (shadcn) |
| A card showing a school | `features/institutions/components` |
| A marketplace listing or order | `features/store` |
| A navigation item | `lib/constants/navigation.ts` + both message files |
| A component used by 2+ features | `components/shared` |
| Header, footer, sidebar | `components/layout` |
| A database read | `features/<x>/queries.ts` |
| A database write | `features/<x>/actions.ts` |
| Form validation rules | `features/<x>/schemas.ts` |
| List of wilayas or levels | `lib/constants` |
| A tiny pure function | `lib/utils` |
| A table change | new file in `supabase/migrations` |
| Any visible text | `messages/ar.json` + `messages/fr.json` |
| A big technical decision | `DOCS/decisions/` |
| A feature idea not in the MVP | `DOCS/backlog.md` |

If it fits nowhere, stop and ask. Do not invent a new folder.

## 5. Import rules (enforced by lint)

1. `app/` may import from `features/*` (through `index.ts`), `components/`, `lib/`, `config/`.
2. A feature may import from `components/`, `lib/`, `config/`, `types/`.
3. A feature must NOT import another feature's internals. If `requests` needs something from `institutions`, it imports from `features/institutions` (its `index.ts`) only, and only in one direction. No circular imports (A → B → A).
4. `components/` and `lib/` must NOT import from `features/`.
5. Only `queries.ts` and `actions.ts` may use the Supabase server client. Components never import `lib/supabase`.
6. `queries.ts` and `actions.ts` start with `import "server-only"` (or `"use server"`), so they can never leak into browser code.
7. The Supabase service-role key is used in one place only (`lib/supabase/admin.ts`), server-side, and never in a component.

## 6. Naming conventions

- Files and folders: `kebab-case` (`institution-card.tsx`).
- Components: `PascalCase`, one component per file, named like the file.
- Functions: `camelCase`, verbs for actions (`createRequest`), `get...` for queries.
- Database: `snake_case`, plural table names (`institutions`, `request_replies`).
- Constants: `SCREAMING_SNAKE_CASE` only for true constants.
- Translation keys: nested by feature (`institutions.card.viewProfile`).
- Branches: `feat/...`, `fix/...`. Commits: `feat: ...`, `fix: ...`, `chore: ...`.

## 7. Data and security rules

- **Source of truth for types:** run `supabase gen types` after every migration to refresh `types/database.ts`.
- **Migrations only:** never change tables from the dashboard. Every change is a migration file, applied in order.
- **RLS everywhere:** every table has Row Level Security and explicit policies. The server layer adds its own checks too (defence in depth).
- **Roles** live in the `profiles` table and are checked on the server. Never trust the browser.
- **Validation twice:** Zod on the form (for the user) and in the action (for safety), using the same schema from `schemas.ts`.
- **Environment variables:** all read through `config/env.ts`, which fails at startup if one is missing.

## 8. Environments

| Environment | Purpose | Supabase project |
|---|---|---|
| local | daily development | local or `ibni-dev` |
| staging | test before release | `ibni-staging` |
| production | real users | `ibni-prod` |

Never test on production data. Deploy to staging first, check, then promote.

## 9. Growing without chaos

- **New feature:** copy the structure of an existing feature folder. Add it to this file.
- **Folder over ~12 files:** split it into sub-folders by topic.
- **File over ~150 lines:** split it.
- **Two features need the same thing:** move it to `components/shared` or `lib/`, don't import across features.
- **Future mobile app:** expose each feature's `queries.ts` and `actions.ts` through `app/api/...` route handlers. No logic changes needed.
- **Future services (AI, payments):** add them as new features (`features/ai`, `features/payments`) with the same internal structure.

## 10. Anti-patterns (do not do these)

- Database calls inside components or pages.
- Business logic inside pages.
- `utils.ts` or `helpers.ts` dumping grounds. Name files by what they do.
- Copy-pasting a component instead of reusing it.
- Hardcoded wilayas, levels, text or colours.
- Importing from deep inside another feature (`features/teachers/components/x`).
- "temp", "old", "v2", "final" in file names.
- Renaming, reordering, or removing prototype navigation items without a product decision.
- Editing generated files (`types/database.ts`, `components/ui/*`).
