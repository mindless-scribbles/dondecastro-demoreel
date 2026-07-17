# STATUS.md

## Last Session

- **Date:** 2026-04-14
- **Summary:** Built a repeatable YouTube-to-journal workflow. Added a `video` article block type, a `cell-video` flag for unified card shape, and a `scripts/journal-from-youtube.mjs` helper that edits `src/data/journalEntries.ts` in place — prepending new entries at `[001]`/`cell-1`, cascading existing entries down, and dropping anything past `cell-12` with a warning. Shipped four real video entries: Character FX Demo Reel (001), Avatar Way of Water mocap (002), Gameplay Animation + VFX (003), Keyframe Animation in Unreal (004). Merged `journal-entry-workflow` → `main` and pushed; Netlify deploying.

## Files Modified

- `src/data/journalEntries.ts` — added `ArticleVideo` type, `video?: boolean` flag on entries, replaced four placeholders with real video entries
- `src/pages/journal.astro` — added `cell-video` class for unified 2-col 16:9 video card shape
- `src/pages/journal/[slug].astro` — added video block rendering (responsive 16:9 iframe)
- `scripts/journal-from-youtube.mjs` — NEW, auto-shift scaffolder
- `JOURNAL_WORKFLOW.md` — NEW, workflow doc
- `package.json` — added `journal:from-youtube` npm script

## Key Decisions

- YouTube oEmbed doesn't expose description — document it as a manual-fill step rather than scraping.
- Thumbnail fallback chain: `maxresdefault.jpg` → `sddefault.jpg` → `hqdefault.jpg` (HEAD-checked).
- `video: true` flag drives a dedicated `cell-video` class that forces 2-col span + 16:9 thumb, so all video entries read consistently regardless of `cellClass`.
- Overflow past `cell-12` is dropped with a warning. Archive page deferred — build it when real content starts falling off (planned for next pass).
- Stripped all `<span class="inline-metadata">` highlighting from descriptions for now; re-add per-entry later if desired.

## Next Steps

- [ ] **Archive page** — build an archive page for entries that overflow past `cell-12`. The scaffolder currently drops them with a warning; they need a home once real content starts cascading off the end.
- [ ] **Tweak journal entry typography** — especially the title fonts on the entry pages. User flagged them as needing attention.
- [ ] Verify Netlify deploy of `752c34a` went green on dondecastro.com.

## Active Context
<!-- This section tracks anything Claude needs to know to pick up where we left off. -->
All journal workflow commits are on `main` and pushed (latest: `752c34a Merge branch 'journal-entry-workflow'`). Branch `journal-entry-workflow` has been deleted locally. `STYLE_GUIDE.md` is untracked in the working tree — leave it for now unless the user brings it up.
