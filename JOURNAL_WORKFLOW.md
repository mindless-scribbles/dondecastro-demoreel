# Journal Workflow

How to add a new journal entry, including entries built around a YouTube video.

## Quick start (YouTube-based entry)

```bash
npm run journal:from-youtube -- https://youtu.be/<VIDEO_ID>
```

This **edits `src/data/journalEntries.ts` in place**:

1. Inserts the new entry at the top of the array, at `id: "[001]"` / `cellClass: "cell-1"`.
2. Shifts every existing entry's `id` and `cellClass` down by one.
3. Drops any entry that overflows past `cell-12` (logged as a warning — archive-worthy once real entries start falling off).

Then fill in the `// TODO` fields on the new entry (year, format, category, tags, subtitle, description) and run:

```bash
npm run dev
```

Open `http://localhost:4321/journal` to confirm the card renders, and `/journal/<slug>` to confirm the entry page + embedded video play.

### Flags

- `--slug my-slug` — override the auto-generated kebab-case slug.
- `--dry-run` — print the new entry block to stdout without touching the file. Useful for previewing.

## What the helper fills in automatically

- `slug` (kebab-cased from title, or `--slug` override)
- `title` (from YouTube oEmbed)
- `image` / `heroImage` — tries `maxresdefault.jpg` → `sddefault.jpg` → `hqdefault.jpg` (HEAD-checked)
- `id: "[001]"` and `cellClass: "cell-1"` (pushes everything else down)
- `video: true`
- `article[0]` — a `video` block with the correct `videoId` and iframe title
- `article[1]` — a paragraph stub for the description

## The `video: true` flag

All YouTube-scaffolded entries get `video: true` automatically. This tells `journal.astro` to render the card with a unified look (2-column grid span, 16:9 thumb at 85% width — the same shape as cell-2) regardless of which `cellClass` it lands in. `cellClass` still sets positional order in the grid, but the shape is locked so every video entry reads consistently.

If you want a non-video card shape for a specific entry (e.g., a tall 3:4 poster for a still-image essay), leave `video` off.

## What you must fill in

YouTube's oEmbed endpoint does not return the video description, tags, or upload date. Fill these in on the new top entry:

- `year` — upload year
- `format` — one of `VIDEO`, `MOCAP`, `RIG`, `WEBGL`, `ESSAY`, etc.
- `category` — one of `FILM`, `GAMES`, `INTERNAL`, `R&D`, etc.
- `tags` — three short uppercase labels (year, format, category by convention)
- `subtitle` — one-line editorial descriptor
- `article[1].html` — paste the YouTube description. Plain prose by default. If you want inline highlighted terms or timecode labels later, say so and we can add `<span class="inline-metadata">…</span>` per-entry — it's not applied automatically.

## Schema

`src/data/journalEntries.ts` defines the article block types. Video blocks look like:

```ts
{
  type: "video",
  provider: "youtube",
  videoId: "4ca-ywgyVdE",
  title: "…",      // optional iframe title for a11y
  caption: "…",    // optional line of caption text below the player
}
```

You can mix `video`, `p`, `quote`, and `image` blocks freely in the `article` array.

## Adding a non-video entry

The helper only handles YouTube videos. For other entries, add a new object to `journalEntries` by hand (and manually shift other IDs/cellClasses if you want it at the top). Set `hasPage: true` if you want a detail page (triggers `getStaticPaths` in `src/pages/journal/[slug].astro`).

## Thumbnails

Not all uploads have a `maxresdefault.jpg`. The helper HEAD-checks and falls back to `sddefault.jpg` → `hqdefault.jpg` automatically. For older uploads or when you want something custom, replace the `image` / `heroImage` URLs with your own asset after the helper runs.

## Overflow past cell-12

The grid holds 12 cells. When an entry shifts past `cell-12`, the script drops it and logs:

```
⚠ dropped (overflowed cell-12): <slug>
```

Until we build the archive page (planned), dropped entries are gone from the built site. Recovery path if you need to undo: `git diff` / `git checkout -- src/data/journalEntries.ts` before committing.
