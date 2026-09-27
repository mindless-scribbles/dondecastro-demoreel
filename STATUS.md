# STATUS.md

## Last Session

- **Date:** 2026-09-27
- **Live:** the hybrid redesign, inline reel player and Motion Toolset journal shipped to dondecastro.com via PR #2 (merged 2026-09-27). Real reel specs on the panel chips shipped via the `feature/reel-metadata` PR the same day. Old work branches deleted.
- **Summary:** 8pt design system on every page; reels play inside the panel; journal holds only Don's own work (5 entries, newest featured full-width); reel panel chips show real per-reel resolution and duration on hover/focus, a summary otherwise; made-up Codec and REC chips removed.

## Files Modified (this session, all now on `main`)

- `src/styles/global.css`, all pages and layouts: design-system tokens, `--header-height`, `.frame` removed
- `src/components/ReelPanel.astro`: inline YouTube player; `reels` array holds `res` and `duration` (fps is the shared `FPS` constant, 23.98 per Don; YouTube reports it rounded to 24). Summary chip values are computed from the array.
- `src/data/journalEntries.ts`: 5 entries, all Don's
- `src/components/JournalCard.astro`, `JournalGrid.astro`: featured newest card
- `src/components/HomeHero.astro`, `src/pages/index.astro`: one-line name, smaller phone Journal heading
- `netlify.toml`: 301s for the two retired journal URLs
- `STYLE_GUIDE.md`, `LESSONS.md`

## Key Decisions

- Inline reel player over lightbox. "Play Reel" only reveals the two reel buttons.
- Journal holds only Don's own work. Reels live in the reel panel, not the journal.
- Articles are drafted from Don's own video transcripts (yt-dlp auto-captions → plain text) and descriptions; nothing added that he didn't say.
- Device testing via Netlify draft deploys only: `npm run build && netlify deploy --site ef46c49f-b6b4-46b8-82ec-9b7bebacbd54 --dir dist --no-build --alias hybrid-redesign` (never `--prod`) → https://hybrid-redesign--ddc-experiments.netlify.app. Use a QR code on iOS (typed `--` becomes an em dash).

## Next Steps

- [ ] Reel panel background is a stock Unsplash photo (`ReelPanel.astro` `.video-placeholder`). Don will provide a frame from his own work; swap it in.
- [ ] If a reel is re-uploaded or added: update its `id`, `res` and `duration` in the `reels` array in `ReelPanel.astro` (get them with `uvx yt-dlp -J <url>`).
- [ ] Article follow-ups Don may answer: what "DMC" stands for (entry 003), Unreal version in entry 002 (captions said "5.81"), whether "Anabot" = animBot (entry 002), keep or cut the Claude credit (entry 001).
- [ ] Contact success banner never shows (static build; read `?success=1` client-side).
- [ ] Add journal entries with `npm run journal:from-youtube <url> --slug <slug>`; the newest automatically becomes the featured card.

## Active Context

Dev server command: `npm run dev` (localhost:4321). For width checks, the Chrome window couldn't be resized, so injecting same-origin iframes at fixed widths and measuring via JS worked well.
