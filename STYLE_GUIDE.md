# Style Guide — dondecastro.com

The as-built conventions of the site. When a new template is pasted in, normalize it against the tokens and patterns below before merging. If a template conflicts with something here, the default is to rewrite the template — not to diverge. If a divergence is intentional, update this guide in the same change so the next paste has a coherent reference.

Canonical source of truth is the code. This document points to it.

---

## 1. Color tokens

Defined in the `@theme` block of `src/styles/global.css`:

| Token            | Value      | Role                                                                   |
| ---------------- | ---------- | ---------------------------------------------------------------------- |
| `--color-bg`     | `#070709`  | Page background. Near-black, never pure `#000`.                        |
| `--color-text`   | `#f4f4f5`  | Primary text, button labels, heading fills.                            |
| `--color-accent` | `#ff3300`  | Home page only: the tagline (`HomeHero`) and the reel panel (`ReelPanel`). |
| `--color-muted`  | `#52525b`  | Secondary text, nav links at rest, metadata labels.                    |
| `--color-hover`  | `rgba(244, 244, 245, 0.55)` | Neutral link and nav hover.                          |

Rules:
- The site is monochrome; the work carries the color. The accent lives only in `HomeHero.astro` (tagline) and `ReelPanel.astro` (hover borders, the red fill bar, its own focus ring). `grep -rn "color-accent\|255, 51, 0\|#ff3300" src/` should find only those two files and `global.css`.
- Focus rings are off-white (`--color-text`); selection is off-white at 25%.
- Muted is for de-emphasis. Nav links rest at `#71717a` and move to `--color-hover`.
- Borders are almost always `rgba(244, 244, 245, 0.1–0.3)` — a low-opacity off-white — not a named token. This reads as a hairline on the near-black bg.

## 2. Typography

Three fonts, defined in the `@theme` block of `src/styles/global.css`. Each has a single role — do not mix them. No serif anywhere.

### Syne — display / headings / brand
- Family: `var(--font-display)`
- Weight 800 uppercase (`letter-spacing: -0.02em`, `line-height: 1`) for the hero and section headings. Canonical: `.hero-title` in `src/components/HomeHero.astro`.
- Weight 700 uppercase for the header brand (§6).
- Weight 600 normal case for card, entry and pager titles.

### Space Mono — labels, nav, metadata, form UI
- Family: `var(--font-mono)` (also the `html` default in `global.css:17`)
- Weight: 700
- `text-transform: uppercase`
- `letter-spacing: 0.1em` (standard) up to `0.3em` (small labels)
- Sizes: `0.54rem`–`0.875rem`. Smaller weights at smaller breakpoints.
- Canonical: tagline in `HomeHero.astro` (`.tagline`), sub-button label in `ReelPanel.astro` (`.sub-label`), nav links in `src/components/SiteHeader.astro`, form labels in `src/pages/contact.astro`.

### Hanken Grotesk — reading text
- Family: `var(--font-body)`, weights 400 / 600
- Journal articles, captions and subtitles only. Everything else stays Space Mono.
- Reading tokens (`:root` in `global.css`):

| Token | Value | Use |
|---|---|---|
| `--text-read` / `--leading-read` | 18 / 1.7 (phone 16 / 1.6) | Article and caption body |
| `--text-lead` / `--leading-lead` | 22 / 1.6 (phone 18) | First paragraph of a video article |
| `--text-subtitle` / `--leading-subtitle` | 24 / 1.4 | Article subtitle, gray `#a1a1aa` |
| `--text-read-heading` | 28 | Prose h2 (Syne 600) |
| `--text-quote` | 32 | Blockquote (Syne 600, between hairlines, from 768; `--text-title` on phone) |

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
- Sticky elements below the header offset by `--header-height` (57 phone, 65 touch, 97 pointer from 768). It mirrors `SiteHeader.astro`, so change both together. Canonical uses: the reel panel's scroll margin, the journal entry text column.
- **Never use `orientation` media queries.** Size things with `aspect-ratio` and the breakpoints above so iPad portrait/landscape follow the same rules as everything else.

### Interaction rules
- Tap targets are at least `--touch-target` (48px). For links inside a tighter text row, keep the row height and bleed the target with negative block margins, e.g. `min-height: var(--touch-target); margin-block: calc((var(--leading-body) - var(--touch-target)) / 2)` (contact details).
- Hover effects go inside `@media (hover: hover)`. Anything revealed on hover must be visible by default on `hover: none` (e.g. the reel sub-buttons). Exception: journal card thumbnails stay grayscale on touch (§3 Cards).
- `body` uses `overflow-x: clip`, not `hidden`. `hidden` turns body into a scroll container and breaks `position: sticky`.

### Page rhythm
- Home: `--space-8` between sections on phone, `--space-12` from 768 up.
- Section heading row: Syne heading + mono meta, `--space-2` padding and hairline underneath, `--space-3` to content.
- Prose container stays `max-width: 68ch` (`MarkdownLayout.astro`). From 768 up it sits on a `--color-surface` card (`--radius-lg`, `--space-6` padding); phone stays open for width.
- **Media frame** (the home-card frame): `--color-surface`, 1px `--color-border`, `--radius-lg`, `--space-1` padding; the photo, clip or video inside gets `--radius-md`. Used for all journal entry media.

### Journal entry layouts (`src/pages/journal/[slug].astro`)
- Shared: mono breadcrumb `Journal / [id]` at the top, and previous/next cards at the bottom (2 columns from 768, `--color-surface` cards with a mono label, Syne 600 title and chevron). No wrap-around: the ends show "This is the first entry" / "This is the latest entry".
- **Media layout** (photo and reel posts): from 1024 a 12-column grid, media across 8 and the text column across 4 (sticky under the header). Below 1024 it stacks, media first. Text column: category and format chips, Syne 600 title (untitled posts show no visible title, only the caption; the h1 stays for screen readers) (32 phone, 40 from 768, 48 from 1024), mono date, caption in `--text-read`, "View on Instagram ↗" button. Multiple photos stack; vertical clips are capped at 80vh.
- **Article layout** (YouTube posts): the header (title max 1104px, subtitle, a 4-column meta list Date / Format / Category / Ref over a hairline) and the YouTube facade span the full page width, left-aligned to the page margin. The facade is the thumbnail + a 72px play button; the click swaps in the `youtube-nocookie` player. Below it, only the body is a centered 720px column (lead first paragraph), with "Watch on YouTube ↗" at its left edge.
- Prose styles for both are global in `src/layouts/JournalEntryLayout.astro` (the bodies are Markdown): left-aligned, no drop cap.

### Cards (canonical: `src/components/JournalCard.astro`, grid: `JournalGrid.astro`)
- Card: `--color-surface`, `--radius-lg`, 1px `--color-border`, `--space-1` padding around a `--radius-md` thumbnail, `--space-2` to the meta block.
- Title Syne 600, id in mono muted (off-white on hover), tags as `--radius-sm` chips on `--color-surface-raised` (off-white 12% tint on hover).
- Grid: 1 column phone, 2 iPad portrait, 4 from 1024. Video entries (`video: true`) span 2 columns wherever there are 2+.
- Order and ids: newest first by `date`; ids are stable and chronological (oldest = [001]), so a post keeps its number forever.
- Featured: the first (newest) entry spans the full row. From 1024 it's side by side (16:9 thumb over 3 of 4 columns, meta in the 4th, bottom-aligned); below that it's a full-width card. It adds an off-white "Latest [id]" kicker, a `--text-title` title from 768, and the entry's subtitle.
- Thumbnails: grayscale everywhere, including touch; color on hover for pointer devices only. Color on a phone appears only on the journal entry page.
- Untitled posts (photo and reel posts with no frontmatter `title`) show no title on the card: id and tags only. The caption's first sentence stays as a visually hidden label.

## 4. Links & hover

- Base: no underline. Color is either `inherit` (in prose) or `--color-muted` (in nav and chrome).
- Hover: color transitions to `--color-hover` (off-white at 55%) over `0.2`–`0.3s ease`.
- Journal prose links are the exception to "no underline": off-white with a `--color-border-strong` underline.
- Canonical: prose links in `src/layouts/MarkdownLayout.astro`, contact detail links in `src/pages/contact.astro`, nav links in `src/components/SiteHeader.astro`.

## 5. Buttons — and the sub-button fill animation

Button shell:
- `1px solid var(--color-border-strong)` border, `--radius-md`, translucent dark background with backdrop blur when over media, `inline-flex`, `min-height: var(--touch-target)`.
- Padding: `--space-2 --space-4` (primary) or `0 --space-3` (sub). Canonical: `src/components/ReelPanel.astro`.
- Label: Space Mono, weight 700, uppercase, letter-spacing `0.2em`–`0.25em`.
- Hover (inside `@media (hover: hover)`): `border-color` transitions over `0.3s ease` to `--color-text` (to `--color-accent` inside ReelPanel only).

### The red-bar fill animation (canonical)

Defined in `src/components/ReelPanel.astro` (the `<script>` and `.btn-fill`).

- Each sub-button has an absolutely-positioned `.btn-fill` child, `inset: 0`, `background: var(--color-accent)`, behind the label (`z-index: -1`).
- Two CSS custom properties drive it: `--fill-origin` (`left` or `right`) and `--fill-scale` (`0` or `1`).
- The fill uses `transform: scaleX(var(--fill-scale, 0))` with `transform-origin: var(--fill-origin, left)` and a `0.3s ease` transform transition.
- On `pointerenter` of a sibling sub-button, JS compares `getBoundingClientRect().left` of the incoming vs. the currently-active button. If moving right, the previous button fills out to the right (scale 0) and the new one fills in from the left (scale 1). Moving left reverses both origins.
- On `pointerleave` of the container, the active button collapses back left.

**Use this exact pattern for any new sub-button row.** Do not animate `width` for the same effect. Single buttons (contact submit, resume download) use the same `.btn-fill` and just set `--fill-scale: 1` on `:hover` inside `@media (hover: hover)`; no JS needed. Outside ReelPanel the fill is off-white (`--color-text`) and the label flips to `--color-bg` while filled.

## 6. Header & nav

Canonical: `src/components/SiteHeader.astro`.
- Brand: one line, `Don De&nbsp;Castro`, Syne 700 uppercase, `white-space: nowrap`, `--color-text`. 14/24 on phone and touch (so it sits beside the nav row at 390px), `--text-title` 24/32 on pointer devices from 768.
- Home scroll fade: the home page passes `fadeBrand`. A script sets `--brand-alpha` (0 at the top → 1 once `.hero-title` passes under the header), and the brand color is `rgba(244,244,245, calc(0.2 + 0.8 * var(--brand-alpha, 1)))`, so it is full white without JS and on every other page.
- Nav: row with `--space-2` gap on phone and all touch devices (48px tap height); stacked right-aligned column with `--space-1` gap on pointer devices from 768 up.
- Sticky variant: translucent bg with blur, hairline bottom border. Every page uses it.
- Nav items: Space Mono uppercase, 10px phone / `--text-mini` from 768, color `#71717a`, hover `--color-hover`. The `<nav>` has `aria-label="Main"`.
- The Journal link points at `/#journal` (the home page section); `/journal` stays as the full archive.

## 7. Forms

Canonical: `src/pages/contact.astro`.
- Vertical stack, `--space-4` between fields.
- Labels: `--text-mini` Space Mono uppercase, `--tracking-mini`, muted.
- Inputs & textareas: transparent background, **bottom border only** (no box, `--color-border-strong`), border transitions to `--color-text` on `:focus-within`. Input text is `--text-body` (16px; smaller makes iOS zoom on focus), 48px min height.
- No placeholder-as-label. Use explicit `<label>`.
- Success message: off-white text in a `--color-border-strong` box.

## 8. Prose (MDX / markdown)

All prose styling lives in `src/layouts/MarkdownLayout.astro`. When authoring `.mdx` blog posts or `.md` pages, **do not** redefine heading, link, or list styles inline — inherit from the layout. If a post needs something unusual (e.g. a full-bleed image or an interactive canvas), scope the override to that one block; don't override prose defaults globally.

## 9. Known inconsistencies — do not propagate

When a template matches the non-canonical variant, rewrite it to the canonical one.

All pages are on the §3 tokens as of 2026-09-27, and the fixed `.frame` overlay has been removed from `BaseLayout.astro`. Remaining known off-token values:

- `JournalCard.astro` and the entry pager: `.title` 20px; tag/chip color `#a1a1aa`.
- `SiteHeader.astro`: nav links 10px on phone and 16px tall on pointer devices (touch gets 48px).
- Journal entry titles: 40 and 48px (56 leading) are outside the type scale.
- Off-white text at partial opacity (`rgba(244, 244, 245, 0.85 / 0.5 / 0.35)`) and muted at partial opacity have no tokens yet.

## 10. Stale intent docs (out of scope here)

`decisions.md` "Typography" section still names Clash Display / Outfit / JetBrains Mono. The code uses Syne / Space Mono / Hanken Grotesk. Treat this guide as the source of truth for what the code actually does; reconcile those files in a separate pass.
