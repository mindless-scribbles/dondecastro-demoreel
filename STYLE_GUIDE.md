# Style Guide — dondecastro.com

The as-built conventions of the site. When a new template is pasted in, normalize it against the tokens and patterns below before merging. If a template conflicts with something here, the default is to rewrite the template — not to diverge. If a divergence is intentional, update this guide in the same change so the next paste has a coherent reference.

Canonical source of truth is the code. This document points to it.

---

## 1. Color tokens

Defined in `src/styles/global.css:3–6`:

| Token            | Value      | Role                                                                   |
| ---------------- | ---------- | ---------------------------------------------------------------------- |
| `--color-bg`     | `#070709`  | Page background. Near-black, never pure `#000`.                        |
| `--color-text`   | `#f4f4f5`  | Primary text, button labels, heading fills.                            |
| `--color-accent` | `#ff3300`  | Hover, focus, active indicators, button fills, selection. Never bulk.  |
| `--color-muted`  | `#52525b`  | Secondary text, nav links at rest, metadata labels.                    |

Rules:
- Accent is reserved for interaction and emphasis — links on hover, focus rings, the sub-button fill bar, text selection. Do not use it for large blocks of text or backgrounds.
- Muted is for de-emphasis. Nav links rest at muted and move to accent on hover.
- Borders are almost always `rgba(244, 244, 245, 0.1–0.3)` — a low-opacity off-white — not a named token. This reads as a hairline on the near-black bg.

## 2. Typography

Three fonts, defined in `src/styles/global.css:9–11`. Each has a single role — do not mix them.

### Syne — display / headings
- Family: `var(--font-display)`
- Weight: 800
- `text-transform: uppercase`
- `letter-spacing: -0.02em`
- `line-height: 1`
- Canonical: hero h1 in `src/components/HomeHero.astro:89–99`.

### Space Mono — labels, nav, metadata, form UI
- Family: `var(--font-mono)` (also the `html` default in `global.css:17`)
- Weight: 700
- `text-transform: uppercase`
- `letter-spacing: 0.1em` (standard) up to `0.3em` (small labels)
- Sizes: `0.54rem`–`0.875rem`. Smaller weights at smaller breakpoints.
- Canonical: tagline in `HomeHero.astro:101–110`, sub-button label `HomeHero.astro:179–185`, nav links in `src/components/SiteHeader.astro`, form labels in `src/pages/contact.astro`.

### Playfair Display — brand only
- Family: `var(--font-serif)`
- Used exclusively for the brand mark in `src/components/SiteHeader.astro:58–97` (mixed weight 600 upright + weight 400 italic with `-webkit-text-stroke`). Do not introduce serif anywhere else.

### Heading scale (prose and UI)

From `src/layouts/MarkdownLayout.astro:77–114`:
- h1 `clamp(2rem, 5vw, 3rem)`, uppercase, Syne
- h2 `1.25rem`, uppercase
- h3 `0.85rem`, uppercase
- Body: `0.95rem` / `line-height: 1.65`

Hero h1 in `HomeHero.astro:97` is `6.3vw` (`6.75vw` under 1024px) — this is a hero-only exception, not the prose scale.

## 3. Layout & spacing

- **Prose container:** `max-width: 68ch` — `MarkdownLayout.astro:66`.
- **Page base padding:** `1.5rem` desktop, `0.75rem`–`1rem` on mobile — `src/layouts/BaseLayout.astro:45–51`.
- **Viewport frame:** fixed border at `inset: 24px` desktop, `inset: 12px` mobile — `BaseLayout.astro:53–71`. Every page renders inside this frame.
- **Hero vertical rhythm:** `mb-[9rem]` desktop / `mb-[4.5rem]` mobile between hero and what follows.
- **Prose section rhythm:** `1.5rem` between blocks — `MarkdownLayout.astro:95`.
- **Two-column → one-column breakpoint:** `900px`. Canonical: contact grid `src/pages/contact.astro:121–128` (`1fr 1fr` with `gap: 4rem` above, stacked below).

No formal spacing scale exists yet. When a template introduces one, match the existing values above rather than inventing new ones.

## 4. Links & hover

- Base: no underline. Color is either `inherit` (in prose) or `--color-muted` (in nav and chrome).
- Hover: color transitions to `rgba(255, 51, 0, 0.55)` over `0.2`–`0.3s ease`. Not the full accent — the 55% opacity is intentional and softer.
- Canonical: `src/layouts/MarkdownLayout.astro:117–119`, `src/pages/contact.astro:257–265`, nav links in `src/components/SiteHeader.astro:106–120`.

## 5. Buttons — and the sub-button fill animation

Button shell:
- `1px solid rgba(244, 244, 245, 0.3)` border, transparent background, `inline-flex`.
- Padding: `1rem 2.25rem` (primary) or `0.6rem 1.25rem` (sub) — see `HomeHero.astro:124–125, 164–165`.
- Label: Space Mono, weight 700, uppercase, letter-spacing `0.2em`–`0.25em`.
- Hover: `border-color` transitions to `var(--color-accent)` over `0.3s ease`.

### The red-bar fill animation (canonical)

Defined in `src/components/HomeHero.astro:55–77` (JS) and `187–195` (CSS).

- Each sub-button has an absolutely-positioned `.btn-fill` child, `inset: 0`, `background: var(--color-accent)`, behind the label (`z-index: -1`).
- Two CSS custom properties drive it: `--fill-origin` (`left` or `right`) and `--fill-scale` (`0` or `1`).
- The fill uses `transform: scaleX(var(--fill-scale, 0))` with `transform-origin: var(--fill-origin, left)` and a `0.3s ease` transform transition.
- On `pointerenter` of a sibling sub-button, JS compares `getBoundingClientRect().left` of the incoming vs. the currently-active button. If moving right, the previous button fills out to the right (scale 0) and the new one fills in from the left (scale 1). Moving left reverses both origins.
- On `pointerleave` of the container, the active button collapses back left.

**Use this exact pattern for any new sub-button row.** Do not animate `width` for the same effect — that variant exists in `src/pages/contact.astro:224–237` and is flagged as the one to reconcile when it's next touched.

## 6. Header & nav

Canonical: `src/components/SiteHeader.astro`.
- Brand: flex column, Playfair, weight 600 upright line + weight 400 italic line with `-webkit-text-stroke`.
- Nav: flex row, `gap: 12px` (desktop) → `16px` (mobile).
- Nav items: small Space Mono uppercase, color `--color-muted`, hover `rgba(255, 51, 0, 0.55)`.

## 7. Forms

Canonical: `src/pages/contact.astro:143–238`.
- Vertical stack, `gap: 2rem` between fields (`contact.astro:124`).
- Labels: small Space Mono uppercase, muted.
- Inputs & textareas: transparent background, **bottom border only** (no box), border transitions to `--color-accent` on `:focus`.
- No placeholder-as-label. Use explicit `<label>`.
- Success message: bordered accent box.

## 8. Prose (MDX / markdown)

All prose styling lives in `src/layouts/MarkdownLayout.astro:77–161`. When authoring `.mdx` blog posts or `.md` pages, **do not** redefine heading, link, or list styles inline — inherit from the layout. If a post needs something unusual (e.g. a full-bleed image or an interactive canvas), scope the override to that one block; don't override prose defaults globally.

## 9. Known inconsistencies — do not propagate

When a template matches the non-canonical variant, rewrite it to the canonical one.

- **Button fill animation:** hero/reel use `transform: scaleX` with `transform-origin` (canonical). `contact.astro:224–237` animates `width` instead. Prefer `scaleX`.
- **Label font-size breakpoints:** hero tagline steps `0.675rem → 0.585rem → 0.54rem`; contact strips step `0.625rem → 0.55rem`. No unified mini-label scale yet — when next touched, pick one set.
- **Header padding:** `0.75rem`, `1rem`, and `0.5rem` (landscape) are all used in `SiteHeader.astro`. No single base unit. Match what's adjacent rather than introducing a new value.

## 10. Stale intent docs (out of scope here)

`CLAUDE.md` "Design Direction" and `decisions.md` "Typography" section still name Clash Display / Outfit / JetBrains Mono. The code uses Syne / Space Mono / Playfair Display. Treat this guide as the source of truth for what the code actually does; reconcile those files in a separate pass.
