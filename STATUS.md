# STATUS.md

## Last Session

- **Date:** 2026-09-27 (evening)
- **Live:** the journal collection and the journal redesign shipped to dondecastro.com via the `feature/journal-collection` PR (merged 2026-09-27).
- **Summary:** executed `PLAN-journal-redesign.md` steps 1–7, plus Don's device-review changes: untitled posts show only the caption (entry page and cards), card thumbnails stay grayscale on touch, the video article matches the mockup (full-width header and video, centered 720px body), and Expertise reading text is Hanken Grotesk.

## Files Modified (this session)

- `src/styles/global.css`: `--font-body` (Hanken Grotesk), reading tokens, `--color-hover`, neutral focus/selection, `--header-height` phone 68 → 57
- `src/layouts/BaseLayout.astro`: fonts (Playfair out; Hanken in; Syne 700)
- `src/components/SiteHeader.astro`: DON DE CASTRO brand, `fadeBrand` prop + scroll script, `aria-label="Main"`
- `src/pages/journal/[slug].astro`: media and article layouts, YouTube facade, older/newer pager
- `src/layouts/JournalEntryLayout.astro`: sidebar removed, global prose styles
- `src/lib/journal.ts`: `untitled` flag, `formatDate()`
- `src/components/JournalCard.astro`: neutral hovers, no title when untitled, grayscale on touch
- `src/layouts/MarkdownLayout.astro`, `src/pages/contact.astro`: accent removed; Expertise text in Hanken
- `src/components/ReelPanel.astro`: scoped orange focus ring; `src/pages/index.astro`: `fadeBrand`
- Deleted `src/components/FieldLogsSidebar.astro`
- `STYLE_GUIDE.md`, `CLAUDE.md`, `LESSONS.md`

## Key Decisions

- Monochrome site; orange only on the home tagline and the reel panel.
- Untitled posts (all six Instagram posts) have no visible title on the entry page or cards; the caption's first sentence remains as a hidden label, the pager title and the `<title>`.
- Card thumbnails are grayscale on touch; color on a phone appears only inside an entry.
- Device testing via Netlify draft deploys only: `npm run build && netlify deploy --site ef46c49f-b6b4-46b8-82ec-9b7bebacbd54 --dir dist --no-build --alias hybrid-redesign` (never `--prod`) → https://hybrid-redesign--ddc-experiments.netlify.app. QR code: `uvx --from qrcode qr --ascii <url>` (typed `--` on iOS becomes an em dash).

## Next Steps

- [ ] Pager (previous/next) cards still show the caption's first sentence for untitled posts. Don may want them untitled too ("Previous · [007]" + tags).
- [ ] "View on Instagram" links to the profile; Don can paste per-post URLs into `source.url`.
- [ ] Desktop grid uses `grid-auto-flow: dense`, so [001] fills a hole before [002]. Could switch to strict order.
- [ ] For Instagram posts older than Sep 2025, request an **All time** export.
- [ ] Touch-screen header height (65) was reasoned, not measured; Don's iPhone check looked fine.
- [ ] `PLAN-journal-redesign.md` is done; delete it when no longer useful.

- [ ] Reel panel background is a stock Unsplash photo (`ReelPanel.astro` `.video-placeholder`). Don will provide a frame from his own work; swap it in.
- [ ] If a reel is re-uploaded or added: update its `id`, `res` and `duration` in the `reels` array in `ReelPanel.astro` (get them with `uvx yt-dlp -J <url>`).
- [ ] Article follow-ups Don may answer: what "DMC" stands for (entry 003), Unreal version in entry 002 (captions said "5.81"), whether "Anabot" = animBot (entry 002), keep or cut the Claude credit (entry 001).
- [ ] Contact success banner never shows (static build; read `?success=1` client-side).
- [ ] Add journal entries with `npm run journal:from-youtube <url> --slug <slug>`; the newest automatically becomes the featured card.

## Active Context

Dev server command: `npm run dev` (localhost:4321). For width checks, the Chrome window couldn't be resized, so injecting same-origin iframes at fixed widths and measuring via JS worked well.
