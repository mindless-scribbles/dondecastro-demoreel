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

## In Progress: `feature/journal-collection` (local only, not pushed, not merged)

Ready to ship except for the next item. Don reviewed it on the draft deploy and says it's good so far. Ship as one PR → preview → merge when Don says so.

**What's on the branch (5 commits):**
- Journal is one Markdown file per entry: `src/content/journal/YYYY-MM-DD-slug/index.md`, with photos, clips and posters beside it. Schema: `src/content.config.ts` (title optional, date, format, category, tags, youtube, cover, images[], videos[], source, draft). Every page reads `getJournal()` in `src/lib/journal.ts`: sorted by date, stable chronological ids (oldest = [001]), untitled posts use the caption's first sentence (hashtags stripped), `isVideo` = play badge, `wide` = YouTube-only 2-column card.
- 11 entries: 5 YouTube (Motion Toolset 01-03, Gameplay, Keyframe) + 6 Instagram (walk-cycle, blue-pencil-portraits, distracted-drawing, toonsquid-pose-breakdowns, sketch-papers, gesture-drawing-session).
- `npm run journal:from-youtube <url>`: writes an entry using the local upload date.
- `npm run journal:from-instagram -- <export.zip> --list | --pick N --slug s --category C`: HTML export → entry folder. Hashtags dropped, @handles linked, ffmpeg poster for reels. Export used: `/mnt/b/Downloads/instagram-mindless_scribbles-2026-09-27-66FRlYtW.zip` (last year only).
- Journal entry pages: header nav is Home / Expertise / Contact.

**NEXT (Don's request): a better journal post layout.**
- Current entry page, `src/pages/journal/[slug].astro` + `src/layouts/JournalEntryLayout.astro`:
  - Grayscale hero image (55vh phone / 70vh) with the title overlaid.
  - Meta row (Year / Format / Category / Ref).
  - Then the YouTube embed, or local clips (`.clip`, max 80vh), or photos (`.photo`), then "View on Instagram/YouTube", then the Markdown body in a 720px column with a drop cap.
  - Field Logs sidebar (sticky from 1024) and a "Proceed to project" footer.
- It was designed for long YouTube articles. Short Instagram posts (one photo or a vertical reel and a caption) don't suit it: the hero repeats the photo, and the caption sits far below the media.
- Start by asking Don what he dislikes and what he wants (e.g. Instagram-like media-first layout for photo/reel posts, carousel for multi-photo, where the title/date/caption go), then plan (touches >2 files).

**Open items on this branch (Don may answer):**
- Fallback titles: the gesture post reads "Yesterday's gesture drawing session with __etav__ and some doodles by…". Give it a real `title`, or suggest titles for all six.
- "View on Instagram" links to the profile: the export has no post URLs. Don can paste per-post URLs into `source.url`.
- The desktop grid uses `grid-auto-flow: dense`, so [001] walk-cycle fills a hole before [002]. Could switch to strict chronological order with gaps.
- For posts older than Sep 2025, request an **All time** export.

## Next Steps

- [ ] Reel panel background is a stock Unsplash photo (`ReelPanel.astro` `.video-placeholder`). Don will provide a frame from his own work; swap it in.
- [ ] If a reel is re-uploaded or added: update its `id`, `res` and `duration` in the `reels` array in `ReelPanel.astro` (get them with `uvx yt-dlp -J <url>`).
- [ ] Article follow-ups Don may answer: what "DMC" stands for (entry 003), Unreal version in entry 002 (captions said "5.81"), whether "Anabot" = animBot (entry 002), keep or cut the Claude credit (entry 001).
- [ ] Contact success banner never shows (static build; read `?success=1` client-side).
- [ ] Add journal entries with `npm run journal:from-youtube <url> --slug <slug>`; the newest automatically becomes the featured card.

## Active Context

Dev server command: `npm run dev` (localhost:4321). For width checks, the Chrome window couldn't be resized, so injecting same-origin iframes at fixed widths and measuring via JS worked well.
