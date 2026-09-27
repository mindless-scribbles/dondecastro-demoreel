# STATUS.md

## Last Session

- **Date:** 2026-09-27 (second session)
- **Branch:** `redesign/hybrid-layout`. **Not merged, not deployed** by choice: Don likes the layout but wants to hold it. `main` auto-deploys to Netlify, so merging = going live. Plan: merge this together with the reel-player work in one PR later.
- **Summary:** Applied the 8pt design system to every remaining page (journal entries, Field Logs sidebar, Expertise, Contact), then deleted the fixed `.frame` overlay. Don checked it on a real iPad and iPhone via a Netlify draft deploy and asked for two phone fixes: the home hero name stays on one line, and the home Journal heading is smaller on portrait phones.

## Files Modified

- `src/styles/global.css`: `--header-height` token (68 phone / 65 touch / 97 pointer ≥768), mirrors SiteHeader
- `src/layouts/JournalEntryLayout.astro`, `src/pages/journal/[slug].astro`: tokens, 720px reading column in `.page-container`, rounded media; grayscale hero kept on purpose
- `src/components/FieldLogsSidebar.astro`: sticky under the real header height, 32px rows with 48px link tap targets (negative-margin bleed)
- `src/layouts/MarkdownLayout.astro`: sticky header + `.page-container`, prose on a surface card from 768 up (open on phone), canonical scaleX download button
- `src/pages/contact.astro`: sticky header + `.page-container`, scaleX submit fill, 16px inputs, 48px targets, one column below 1024
- `src/layouts/BaseLayout.astro` (+ index, journal): `.frame` and all `body:has(...) .frame` rules removed
- `src/components/HomeHero.astro`: name always one line, sized from available width (`÷14.5`), capped at `--text-hero`
- `src/pages/index.astro`: Journal heading `--text-body` below 768, `--text-heading` from 768
- `src/pages/expertise.md`: `De&nbsp;Castro`
- `STYLE_GUIDE.md`, `LESSONS.md`

## Key Decisions

- Expertise: card from 768 up, no card on phone (Don compared both).
- Journal entry heroes stay grayscale on every device (documented as an exception in STYLE_GUIDE §3).
- Device testing: Netlify **draft** deploys (`netlify deploy --site ef46c49f-b6b4-46b8-82ec-9b7bebacbd54 --dir dist --no-build --alias hybrid-redesign`, never `--prod`) at https://hybrid-redesign--ddc-experiments.netlify.app. The folder isn't `netlify link`ed, so pass `--site`. The URL's `--` gets turned into an em dash when typed on iOS; use a QR code.

## Next Steps

- [ ] **Reel player (new branch `feature/inline-reel-player`, off `redesign/hybrid-layout`)**: reel sub-buttons currently open YouTube in a new tab (`ReelPanel.astro`, `target="_blank"`). Play the YouTube video inline on the page instead.
- [ ] Contact success banner never shows: the site is static, so `Astro.url.searchParams` in `contact.astro` is empty at build time. Read `?success=1` client-side instead.
- [ ] When ready to go live: PR → `main` (includes the redesign and reel work), check the Netlify deploy preview, merge.
- Carried over: journal archive page for entries past `cell-12`; remaining off-token values listed in STYLE_GUIDE §9.

## Active Context

Dev server command: `npm run dev` (localhost:4321). For width checks, the Chrome window couldn't be resized, so injecting same-origin iframes at fixed widths and measuring via JS worked well.
