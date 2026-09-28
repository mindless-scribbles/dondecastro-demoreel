# Build plan: journal entry redesign + plain header + monochrome site

## Context

Don reviewed mockups on the design canvas (https://claude.ai/artifact/Lhhdx66g8qbWU7DCKM7jWx, "Personal style" boards) and approved this direction:

- The current entry page was built for long YouTube articles. Short Instagram posts don't suit it: the grayscale hero repeats the photo, and the caption sits far below.
- He wants the work to carry the color. The orange accent stays **only** on the home page tagline and the reel panel.
- The Playfair "MS / Creative Agency" mark gives way to a plain **DON DE CASTRO** (Syne 700, all caps).
- Reading text moves to a proportional sans (Hanken Grotesk), which Don finds easier to read than Space Mono.

Decisions from this session:
- **Field Logs sidebar:** removed.
- **Accent:** removed everywhere except the home tagline and ReelPanel, including Contact and Expertise.
- **Branch:** work continues on `feature/journal-collection` (local, not pushed) and ships as one PR.

## Step 0: set up for /clear (after approval, before any code)

1. Copy this plan into the repo as `PLAN-journal-redesign.md`.
2. In STATUS.md, add an "In Progress" pointer to it, the canvas URL, and the decisions above.
3. Commit both (docs only). Don runs `/clear`. The next session reads STATUS.md, LESSONS.md and the plan, then executes steps 1–7.

## Step 1: tokens and fonts

**`src/layouts/BaseLayout.astro:26-31`** (Google Fonts link):
- Drop Playfair.
- Add `Hanken+Grotesk:wght@400;600`.
- Keep Syne. Add weight 700, which the brand needs.

**`src/styles/global.css`:**
- Replace `--font-serif` with `--font-body: "Hanken Grotesk", ui-sans-serif, system-ui, sans-serif`.
- Add reading tokens:
  - `--text-read` 18px / 1.7
  - `--text-lead` 22px / 1.6
  - `--text-subtitle` 24px / 1.4
  - `--text-read-heading` 28px
  - `--text-quote` 32px
  - phone reading size 16px / 1.6
- Add `--color-hover: rgba(244,244,245,0.55)` as the neutral link hover.
- `:focus-visible` outline becomes `var(--color-text)`. `::selection` becomes `rgba(244,244,245,0.25)`.
- Keep `--color-accent` (used only by HomeHero and ReelPanel). ReelPanel gets a scoped `:focus-visible` rule in accent, so the panel keeps its orange ring.

## Step 2: header (`src/components/SiteHeader.astro`)

**Brand:**
- Replace the Playfair letters with one line: `<a href="/" class="brand" aria-label="Don De Castro, home">Don De&nbsp;Castro</a>`.
- Style: Syne 700, uppercase, `white-space: nowrap`, `--color-text`.
- Size: 14px / 24px on phone and touch (it fits beside the nav row at 390px), `--text-title` 24/32 from 768.

**Nav:**
- Markup, stacking rules and tap targets unchanged.
- Hover goes from the accent to `--color-hover`.
- Add `aria-label="Main"`.

**Home scroll fade:**
- Add a new `fadeBrand` prop. The home page passes it, and the header renders it as `data-fade-brand`.
- A bare `<script>` in the ReelPanel style finds `[data-fade-brand]` and sets a `--brand-alpha` custom property.
  - Scroll handler throttled with rAF.
  - Progress runs from 0 at page top to 1 when `.hero-title` passes under the header.
- The brand color is `rgba(244,244,245, calc(0.2 + 0.8 * var(--brand-alpha, 1)))`, so it defaults to full white without JS.
- Reduced motion: the same mapping, with no CSS transition.

**Header height:**
- After the brand change, measure the real header heights: phone, touch, and pointer from 768.
- Update `--header-height` in `global.css:74-97` to match. `ReelPanel.astro:459,465` depends on it.
- Delete the `hasMiddle` slot only if `journal.astro` no longer needs its "Journal" middle label. Keep it otherwise.

## Step 3: journal entry page

Files: `src/pages/journal/[slug].astro`, `src/layouts/JournalEntryLayout.astro`, `src/lib/journal.ts`.

**Data (`[slug].astro` getStaticPaths:7-14):**
- Replace the wrap-around `next` with `older` (index+1) and `newer` (index−1) from the newest-first `getJournal()` list, with no wrapping.
- The oldest entry shows a static "This is the first entry" card, and the newest shows "This is the latest entry".

**Layout choice:**
- **Article layout:** entries with `youtube` (the existing `entry.wide`).
- **Media layout:** photo and reel posts.

**Shared top:**
- Breadcrumb in mono 12px caps: `Journal / [id]`, where "Journal" links to `/journal`.
- Chips: category and format, `--radius-sm` on `--color-surface-raised`, 10px mono.
- Title: Syne 600, normal case.
- Date: local date, mono caps.

**Media layout:**
- From 1024: a two-column grid, media spanning 8 of 12 columns and the text block spanning 4.
- Below 1024: stacked, media first, then chips, title, date, caption.
- Media (images or local clips) sits in the **home-card frame**: `--color-surface`, 1px `--color-border`, `--radius-lg`, `--space-1` padding. Inside, the media has `--radius-md`.
- Multiple photos stack in the media column. A carousel is out of scope.
- Keep Astro `<Image>` (`widths` updated for the wider column) and the `.clip` video behavior.
- Title size: 48px from 1024, 32px on phone.
- Caption: Markdown body in `--font-body`, 18px desktop / 16px phone.
- Source button: "View on Instagram ↗", 1px `--color-border-strong`, `--radius-md`, 48px min height, mono caps.

**Article layout:**
- Header block: 48px title, `--text-subtitle` subtitle in gray `#a1a1aa`, and a 4-column meta list (Date / Format / Category / Ref) above a hairline.
- **YouTube becomes a facade:**
  - Thumbnail (`entry.thumb`) in the same frame, with a 72px play button (translucent dark, 1px strong border, `--radius-md`).
  - Clicking it swaps in the `youtube-nocookie` iframe with autoplay. Small script, ReelPanel style.
  - This matches the CLAUDE.md "Video Embed Strategy".
- Body in a 720px column: `--text-read`, and the first paragraph at `--text-lead`.
- "Watch on YouTube ↗" button after the body.

**Global prose styles (`JournalEntryLayout.astro:35-114`):**
- Paragraphs: `--font-body`, `--color-text`, left-aligned (no longer justified).
- h2: Syne 600, `--text-read-heading`.
- Blockquote: Syne 600 at `--text-quote`, between two hairlines, no italics, no accent border.
- Links: underline in `--color-border-strong`, hover `--color-hover`.
- Remove the drop cap and `.inline-metadata`.

**Removed:**
- The grayscale hero and its overlay.
- The meta row styles that are replaced.
- The "© 2026 … FIELD LOGS" footer and the `.proceed` link.
- `FieldLogsSidebar` import and grid: delete `src/components/FieldLogsSidebar.astro`, which only this layout uses.

**Prev/next cards:**
- A 2-column grid (stacked on phone) of `--color-surface` cards: `--radius-lg`, border, `--space-3` padding.
- Each card: a mono label ("Previous · [007]"), a Syne 600 title, and a chevron.

## Step 4: remove the accent elsewhere

Follow the explorer's inventory:
- **JournalCard:** the kicker becomes `--color-text`. The hover id, tag tint and play badge move to neutral (tag hover `rgba(244,244,245,0.12)`).
- **MarkdownLayout** (Expertise): h3 becomes `--color-text`. Bullets use `--color-muted`, and link hover uses `--color-hover`. The download button's `.btn-fill` turns off-white, and its label flips to `--color-bg` while filled.
- **contact.astro:**
  - Focus underline becomes `--color-text`.
  - The success box and copied tip become neutral.
  - The status dot becomes off-white with no glow.
  - The submit fill works like the download button, and link hover uses `--color-hover`.
- **`journal.astro` archive:** check for any accent use and neutralize it.
- **Done check:** `grep -rn "color-accent\|255, 51, 0\|#ff3300" src/` should find only `global.css` (the token), `HomeHero.astro` and `ReelPanel.astro`.

## Step 5: home page

- `src/pages/index.astro`: `<SiteHeader sticky fadeBrand />`.
- HomeHero and ReelPanel stay as they are, keeping the accent.

## Step 6: docs

**STYLE_GUIDE.md:**
- §1: the accent is scoped to the home tagline and ReelPanel.
- §2: fonts are now Syne (display, and the brand), Space Mono (labels) and Hanken Grotesk (reading). Playfair is removed.
- Reading type tokens.
- §3: media frame, and the journal entry layouts. Replace the grayscale-hero exception.
- §4: link hover is the neutral 55%.
- §5: fill bars are off-white outside ReelPanel.
- §6: header brand and scroll fade.
- §9: remove the resolved items.

**CLAUDE.md:**
- "Design Direction": fonts and accent.
- Site structure: `/journal`.

## Step 7: verify

1. `npm run build`: no errors, and all 11 entries build.
2. `npm run dev`. Spot-check in Chrome, using the fixed-width same-origin iframe trick from STATUS.md at 390 / 768 / 1024 / 1440:
   - Home: brand faint at top, full white once the hero name passes, and the header height matches (the reel isn't clipped under the header).
   - Photo entry (gesture-drawing-session): two columns at 1024+, stacked on phone, image in the frame.
   - Reel entry (walk-cycle): vertical clip in the frame, capped at 80vh.
   - Video entry (forward-limb-off-plane-roll): the facade loads the iframe on click, and the reading sizes are right.
   - Oldest entry (walk-cycle) and newest entry show the first/latest cards.
   - Expertise and Contact: no orange. Keyboard focus ring visible.
   - `DON DE CASTRO` never wraps (LESSONS: surname), including at 390.
3. Grep check from step 4.
4. Netlify draft deploy (the command in STATUS.md, never `--prod`). Don checks it on iPhone and iPad via QR code.
5. Update STATUS.md at the end. Add a LESSONS entry if anything bites.
