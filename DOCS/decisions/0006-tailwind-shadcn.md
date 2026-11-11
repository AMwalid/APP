# 0006 — Tailwind CSS and shadcn/ui for the design system

- **Status:** Accepted
- **Date:** 2026-11-11

## Context

The prototype already uses Tailwind and shadcn/Radix. The rebuild needs the same visual language with maintainable, accessible primitives and no copied one-off styling.

## Decision

- Tailwind CSS v4 with design tokens in `src/styles/globals.css`.
- shadcn/ui (Radix primitives) for interactive components; generated primitives live in `src/components/ui/` and are not hand-edited.
- Colors are referenced through semantic tokens (`primary`, `primary-hover`, `primary-deep`, `surface-muted`) that resolve to the prototype's green/neutral values.
- Motion uses CSS transitions and respects `prefers-reduced-motion`; `framer-motion` is not part of the stack.

## Consequences

- Components must not hardcode `green-600`/`gray-*`; they use token-backed utilities.
- New primitives are added with the shadcn CLI, then left untouched.
- Accessibility (focus states, keyboard, ARIA) comes from Radix rather than custom handlers.
