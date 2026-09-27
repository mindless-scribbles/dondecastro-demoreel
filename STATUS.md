# STATUS.md

## Last Session

- **Date:** 2026-09-27
- **Branch:** `redesign/hybrid-layout` (pushed). **Do not merge to `main` or deploy** until the whole site is on the new design system. `main` auto-deploys to Netlify.
- **Summary:** Looked at a Porsche Design System v4 mockup and kept only its structure: a scrolling home page and rounded journal cards. Colors and fonts stayed ours. Set up a formal 8pt design system (tokens + layout grid for phone / iPad / desktop). Rebuilt the home page as a scroll (reel → hero → journal cards), and moved `/journal` onto the same card grid. Documented everything in `STYLE_GUIDE.md` §3.

## Files Modified

- `src/styles/global.css`: 8pt spacing, radius, surface, type-scale and layout-grid tokens, `.page-container`, `:focus-visible`, body `overflow-x: clip`
- `src/pages/index.astro`: scrolling home with `#journal` section; hides the fixed `.frame`
- `src/pages/journal.astro`: uses `JournalGrid`; `cell-1…12` span recipe no longer rendered (field kept in data for the scaffolder)
- `src/components/JournalCard.astro`, `src/components/JournalGrid.astro`: NEW
- `src/components/ReelPanel.astro`: in-flow, aspect-ratio sized, owns the sub-button fill script
- `src/components/HomeHero.astro`: title + tagline only
- `src/components/SiteHeader.astro`: tokens, touch targets, Journal → `/#journal`
- `STYLE_GUIDE.md`: new §3 design system, refreshed §2/§5/§6/§9 references

## Key Decisions

- Hybrid, not a PDS clone: keep `#070709` / `#f4f4f5` / `#ff3300` / `#52525b` and Syne / Space Mono / Playfair; borrow PDS structure (scroll layout, rounded surface cards, frosted controls over media).
- Breakpoints 768 / 1024 / 1280. No `orientation` media queries anywhere. Hover effects only inside `@media (hover: hover)`.
- `/journal` stays as the full archive; home shows all entries for now.

## Next Steps: apply the design system to the rest of the site

Work on `redesign/hybrid-layout`. For each page: replace raw px/rem with tokens from `global.css`, wrap content in `.page-container`, remove orientation queries, gate hover, 48px touch targets. Then check at 390 / 820 / 1180 / 1440 widths.

- [ ] **Journal entry pages**: `src/layouts/JournalEntryLayout.astro`, `src/pages/journal/[slug].astro` (280 lines), `src/components/FieldLogsSidebar.astro` (its `top: 3.5rem` sticky offset assumes the old header height; header is now 97px on desktop, so update the offset or make it a token). Consider rounded video/image blocks to match the cards.
- [ ] **Expertise**: `src/pages/expertise.md` via `src/layouts/MarkdownLayout.astro` (prose 68ch column, heading scale → type tokens).
- [ ] **Contact**: `src/pages/contact.astro`. Also fix the known `width` fill animation to the canonical `scaleX` pattern (STYLE_GUIDE §5/§9) and move the label sizes to `--text-mini`.
- [ ] **BaseLayout `.frame`**: every page now hides it. Once all pages are converted, delete the frame and the per-page `body:has(...) .frame` rules.
- [ ] Test on a real iPad and phone (touch behavior can't be emulated in desktop Chrome).
- [ ] When everything is converted: open a PR `redesign/hybrid-layout` → `main`, check the Netlify deploy preview, then merge.
- Carried over, still open: journal archive page for entries past `cell-12`; journal entry title typography (fold into the entry-page pass above).

## Active Context

Dev server command: `npm run dev` (localhost:4321). For width checks, the Chrome window couldn't be resized, so injecting same-origin iframes at fixed widths and measuring via JS worked well.
