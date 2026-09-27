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
- Canonical: hero h1 in `src/components/HomeHero.astro` (`.hero-title`).

### Space Mono — labels, nav, metadata, form UI
- Family: `var(--font-mono)` (also the `html` default in `global.css:17`)
- Weight: 700
- `text-transform: uppercase`
- `letter-spacing: 0.1em` (standard) up to `0.3em` (small labels)
- Sizes: `0.54rem`–`0.875rem`. Smaller weights at smaller breakpoints.
- Canonical: tagline in `HomeHero.astro` (`.tagline`), sub-button label in `ReelPanel.astro` (`.sub-label`), nav links in `src/components/SiteHeader.astro`, form labels in `src/pages/contact.astro`.

### Playfair Display — brand only
- Family: `var(--font-serif)`
- Used exclusively for the brand mark in `src/components/SiteHeader.astro:58–97` (mixed weight 600 upright + weight 400 italic with `-webkit-text-stroke`). Do not introduce serif anywhere else.

### Heading scale (prose and UI)

From `src/layouts/MarkdownLayout.astro:77–114`:
- h1 `clamp(2rem, 5vw, 3rem)`, uppercase, Syne
- h2 `1.25rem`, uppercase
- h3 `0.85rem`, uppercase
- Body: `0.95rem` / `line-height: 1.65`

Hero h1 uses `--text-hero` (see §3). It is a hero-only exception, not the prose scale.

## 3. Design system: 8pt grid, layout, breakpoints

All tokens live in `src/styles/global.css`. Use the tokens; don't write raw px/rem for spacing, radius or type size.

### Spacing (8pt)
`--space-1` 8 · `--space-2` 16 · `--space-3` 24 · `--space-4` 32 · `--space-5` 40 · `--space-6` 48 · `--space-8` 64 · `--space-10` 80 · `--space-12` 96 · `--space-16` 128.
`--space-half` (4px) is only for hairline gaps: chip padding, tag gaps, icon nudges. Tailwind's own 4px base is unchanged, so even-numbered utilities (`p-2`, `gap-4`, `p-6`) also land on the grid; odd ones (`p-3`, `p-5`) don't, so avoid them.

### Radius
`--radius-sm` 4 (tags, chips) · `--radius-md` 8 (buttons, thumbnails) · `--radius-lg` 16 (cards) · `--radius-xl` 24 (reel panel). Declared in `@theme`, so Tailwind's `rounded-sm/md/lg/xl` match.

### Surfaces
`--color-surface` `#111114` (cards) · `--color-surface-raised` `#1a1a1e` (hover state, tags) · `--color-border` (hairline, 10% off-white) · `--color-border-strong` (buttons, 30%).

### Type scale (line-heights snap to 8)
| Token | Size / leading | Use |
|---|---|---|
| `--text-mini` | 12 / 16 | Mono labels, ids, section meta |
| `--text-label` | 14 / 24 | Buttons, tagline from 768 up |
| `--text-body` | 16 / 24 | Body copy |
| `--text-title` | 24 / 32 | Card and page titles |
| `--text-heading` | 32 / 40 | Section headings (Syne 800 uppercase) |
| `--text-hero` | clamp(40, 6.4vw, 96) | Home hero only |

Tracking: `--tracking-label` 0.1em, `--tracking-mini` 0.2em. 10px mono is allowed only for chips/tags inside media or cards.

### Layout grid and breakpoints
| Device | Width | Columns | `--page-margin` | `--gutter` |
|---|---|---|---|---|
| Phone | < 768 | 4 | 16 | 16 |
| iPad portrait | 768–1023 | 8 | 32 | 24 |
| iPad landscape / laptop | 1024–1279 | 12 | 40 | 24 |
| Desktop | ≥ 1280 | 12 | 48 | 24 |

- Wrap page content in `.page-container` (max width 1440, side padding `--page-margin`).
- Scoped `<style>` blocks can't read vars in media queries, so write the literal breakpoints: `768px`, `1024px`, `1280px` (mobile-first `min-width`; use `max-width: 767px` for phone-only rules).
- Sticky elements below the header offset by `--header-height` (68 phone, 65 touch, 97 pointer from 768). It mirrors `SiteHeader.astro`, so change both together. Canonical use: `FieldLogsSidebar.astro`.
- **Never use `orientation` media queries.** Size things with `aspect-ratio` and the breakpoints above so iPad portrait/landscape follow the same rules as everything else.

### Interaction rules
- Tap targets are at least `--touch-target` (48px). For links inside a tighter text row, keep the row height and bleed the target with negative block margins, e.g. `min-height: var(--touch-target); margin-block: calc((var(--leading-body) - var(--touch-target)) / 2)` (contact details, Field Logs sidebar).
- Hover effects go inside `@media (hover: hover)`. Anything revealed on hover must be visible by default on `hover: none` (e.g. the reel sub-buttons, thumbnail color).
- `body` uses `overflow-x: clip`, not `hidden`. `hidden` turns body into a scroll container and breaks `position: sticky`.

### Page rhythm
- Home: `--space-8` between sections on phone, `--space-12` from 768 up.
- Section heading row: Syne heading + mono meta, `--space-2` padding and hairline underneath, `--space-3` to content.
- Prose container stays `max-width: 68ch` (`MarkdownLayout.astro`). From 768 up it sits on a `--color-surface` card (`--radius-lg`, `--space-6` padding); phone stays open for width.
- Journal entry reading column: 720px inside `.page-container` (`journal/[slug].astro`). Video and image blocks use `--radius-lg`.
- **Exception:** journal entry heroes stay grayscale at 70% opacity on every device. This is a deliberate editorial look, not a hover effect, so it doesn't follow the color-on-touch rule for cards.

### Cards (canonical: `src/components/JournalCard.astro`, grid: `JournalGrid.astro`)
- Card: `--color-surface`, `--radius-lg`, 1px `--color-border`, `--space-1` padding around a `--radius-md` thumbnail, `--space-2` to the meta block.
- Title Syne 600, id in mono muted (accent on hover), tags as `--radius-sm` chips on `--color-surface-raised`.
- Grid: 1 column phone, 2 iPad portrait, 4 from 1024. Video entries (`video: true`) span 2 columns wherever there are 2+.
- Featured: the first (newest) entry spans the full row. From 1024 it's side by side (16:9 thumb over 3 of 4 columns, meta in the 4th, bottom-aligned); below that it's a full-width card. It adds an accent "Latest [id]" kicker, a `--text-title` title from 768, and the entry's subtitle.
- Thumbnails: grayscale → color on hover for pointer devices; full color on touch.

## 4. Links & hover

- Base: no underline. Color is either `inherit` (in prose) or `--color-muted` (in nav and chrome).
- Hover: color transitions to `rgba(255, 51, 0, 0.55)` over `0.2`–`0.3s ease`. Not the full accent — the 55% opacity is intentional and softer.
- Canonical: prose links in `src/layouts/MarkdownLayout.astro`, contact detail links in `src/pages/contact.astro`, nav links in `src/components/SiteHeader.astro`.

## 5. Buttons — and the sub-button fill animation

Button shell:
- `1px solid var(--color-border-strong)` border, `--radius-md`, translucent dark background with backdrop blur when over media, `inline-flex`, `min-height: var(--touch-target)`.
- Padding: `--space-2 --space-4` (primary) or `0 --space-3` (sub). Canonical: `src/components/ReelPanel.astro`.
- Label: Space Mono, weight 700, uppercase, letter-spacing `0.2em`–`0.25em`.
- Hover (inside `@media (hover: hover)`): `border-color` transitions to `var(--color-accent)` over `0.3s ease`.

### The red-bar fill animation (canonical)

Defined in `src/components/ReelPanel.astro` (the `<script>` and `.btn-fill`).

- Each sub-button has an absolutely-positioned `.btn-fill` child, `inset: 0`, `background: var(--color-accent)`, behind the label (`z-index: -1`).
- Two CSS custom properties drive it: `--fill-origin` (`left` or `right`) and `--fill-scale` (`0` or `1`).
- The fill uses `transform: scaleX(var(--fill-scale, 0))` with `transform-origin: var(--fill-origin, left)` and a `0.3s ease` transform transition.
- On `pointerenter` of a sibling sub-button, JS compares `getBoundingClientRect().left` of the incoming vs. the currently-active button. If moving right, the previous button fills out to the right (scale 0) and the new one fills in from the left (scale 1). Moving left reverses both origins.
- On `pointerleave` of the container, the active button collapses back left.

**Use this exact pattern for any new sub-button row.** Do not animate `width` for the same effect. Single buttons (contact submit, resume download) use the same `.btn-fill` and just set `--fill-scale: 1` on `:hover` inside `@media (hover: hover)`; no JS needed.

## 6. Header & nav

Canonical: `src/components/SiteHeader.astro`.
- Brand: flex column, Playfair, weight 600 upright line + weight 400 italic line with `-webkit-text-stroke`.
- Nav: row with `--space-2` gap on phone and all touch devices (48px tap height); stacked right-aligned column with `--space-1` gap on pointer devices from 768 up.
- Sticky variant: translucent bg with blur, hairline bottom border. Every page uses it.
- Nav items: Space Mono uppercase, 10px phone / `--text-mini` from 768, color `#71717a`, hover `rgba(255, 51, 0, 0.55)`.
- The Journal link points at `/#journal` (the home page section); `/journal` stays as the full archive.

## 7. Forms

Canonical: `src/pages/contact.astro`.
- Vertical stack, `--space-4` between fields.
- Labels: `--text-mini` Space Mono uppercase, `--tracking-mini`, muted.
- Inputs & textareas: transparent background, **bottom border only** (no box, `--color-border-strong`), border transitions to `--color-accent` on `:focus-within`. Input text is `--text-body` (16px; smaller makes iOS zoom on focus), 48px min height.
- No placeholder-as-label. Use explicit `<label>`.
- Success message: bordered accent box.

## 8. Prose (MDX / markdown)

All prose styling lives in `src/layouts/MarkdownLayout.astro`. When authoring `.mdx` blog posts or `.md` pages, **do not** redefine heading, link, or list styles inline — inherit from the layout. If a post needs something unusual (e.g. a full-bleed image or an interactive canvas), scope the override to that one block; don't override prose defaults globally.

## 9. Known inconsistencies — do not propagate

When a template matches the non-canonical variant, rewrite it to the canonical one.

All pages are on the §3 tokens as of 2026-09-27, and the fixed `.frame` overlay has been removed from `BaseLayout.astro`. Remaining known off-token values:

- `JournalCard.astro`: `.title` 20px, tag color `#a1a1aa`, hover tint `rgba(255, 51, 0, 0.12)`.
- `SiteHeader.astro`: brand sizes 28/36px and 9/10px sub-line; nav links 10px on phone and 16px tall on pointer devices (touch gets 48px).
- Off-white text at partial opacity (`rgba(244, 244, 245, 0.85 / 0.5 / 0.35)`) and muted at partial opacity have no tokens yet.

## 10. Stale intent docs (out of scope here)

`CLAUDE.md` "Design Direction" and `decisions.md` "Typography" section still name Clash Display / Outfit / JetBrains Mono. The code uses Syne / Space Mono / Playfair Display. Treat this guide as the source of truth for what the code actually does; reconcile those files in a separate pass.
