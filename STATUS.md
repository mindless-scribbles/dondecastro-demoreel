# STATUS.md

## Last Session

- **Date:** 2026-09-27 (third session block)
- **Branches** (stacked, none merged, `main` untouched):
  - `redesign/hybrid-layout` (pushed): 8pt design system on every page.
  - `feature/inline-reel-player` (pushed): reels play inside the panel.
  - `content/motion-toolset-journal` (**not pushed yet**, current): new journal entries, trimmed journal, featured card, redirects.
- **Summary:** Built lightbox and inline reel players; Don tested both on laptop/iPhone/iPad and chose inline. Added three September YouTube uploads as journal entries ("Motion Toolset 01-03") with articles drafted from the video transcripts; Don says they're faithful. Removed every journal entry that isn't Don's own work plus the Character FX and Avatar mocap entries (already the reel buttons). Newest entry is now a full-width featured card.

## Files Modified

- `src/components/ReelPanel.astro`: reel buttons play a youtube-nocookie embed inside the panel ("Now playing" bar + 48px close above the video, Esc closes, closing removes the iframe). Panel lands `--space-2` below the header; height-capped so the video fits on screen. Links keep YouTube hrefs for modifier-click / no-JS.
- `src/data/journalEntries.ts`: 5 entries, all Don's: forward-limb-off-plane-roll, quick-offset-and-pivot-offset, ikfk-match-and-sequencer-shortcuts, gameplay-animation-and-vfx-testing, keyframe-animation-in-unreal
- `src/components/JournalCard.astro`, `JournalGrid.astro`: `featured` card for the first entry
- `netlify.toml`: 301s from `/journal/character-fx-demo-reel` and `/journal/mocap-avatar-way-of-water` to `/`
- `STYLE_GUIDE.md`, `STATUS.md`

## Key Decisions

- Inline reel player over lightbox. "Play Reel" only reveals the two reel buttons.
- Journal holds only Don's own work. Reels live in the reel panel, not the journal.
- Articles are drafted from Don's own video transcripts (yt-dlp auto-captions → plain text) and descriptions; nothing added that he didn't say.
- Device testing via Netlify draft deploys only: `npm run build && netlify deploy --site ef46c49f-b6b4-46b8-82ec-9b7bebacbd54 --dir dist --no-build --alias hybrid-redesign` (never `--prod`) → https://hybrid-redesign--ddc-experiments.netlify.app. Use a QR code on iOS (typed `--` becomes an em dash).

## Next Steps

- [ ] Push `content/motion-toolset-journal`.
- [ ] Go live: one PR from `content/motion-toolset-journal` → `main` (it contains the redesign and reel player), check the Netlify deploy preview, merge.
- [ ] Reel panel background is a stock Unsplash photo (`ReelPanel.astro` `.video-placeholder`). Don will provide a frame from his own work; swap it in.
- [ ] Article follow-ups Don may answer: what "DMC" stands for (entry 003), Unreal version in entry 002 (captions said "5.81"), whether "Anabot" = animBot (entry 002), keep or cut the Claude credit (entry 001).
- [ ] Contact success banner never shows (static build; read `?success=1` client-side).
- [ ] Add journal entries with `npm run journal:from-youtube <url> --slug <slug>`; the scaffolder drops entries past cell-12, and the newest automatically becomes the featured card.

## Active Context

Dev server command: `npm run dev` (localhost:4321). For width checks, the Chrome window couldn't be resized, so injecting same-origin iframes at fixed widths and measuring via JS worked well.
