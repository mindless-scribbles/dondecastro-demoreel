# Journal Workflow

How to add a new journal entry, including entries built around a YouTube video.

## Quick start (YouTube-based entry)

```bash
npm run journal:from-youtube -- https://youtu.be/<VIDEO_ID>
```

The helper prints a ready-to-paste `JournalEntry` object. Copy the output, paste it into `src/data/journalEntries.ts`, and fill in the `// TODO` fields (id, tags, year, format, category, cellClass, subtitle, description).

Then:

```bash
npm run dev
```

Open `http://localhost:4321/journal` to confirm the card renders, and `/journal/<slug>` to confirm the entry page + embedded video play.

## What the helper fills in automatically

- `slug` (kebab-cased from title, or `--slug my-slug` to override)
- `title` (from YouTube oEmbed)
- `image` / `heroImage` — tries `maxresdefault.jpg`, falls back to `hqdefault.jpg`
- `article[0]` — a `video` block with the correct `videoId` and iframe title
- `article[1]` — a paragraph stub for the description

## The `video: true` flag

All YouTube-scaffolded entries get `video: true` automatically. This tells `journal.astro` to render the card with a unified look (2-column grid span, 16:9 thumb at 85% width — the same shape as cell-2) regardless of which `cellClass` you put it in. `cellClass` still sets the positional ordering in the grid, but the shape is locked so every video entry reads consistently.

If you want a non-video card shape for a specific entry (e.g., a tall 3:4 poster for a still-image essay), leave `video` off.

## What you must fill in

YouTube's oEmbed endpoint does not return the video description, tags, or upload date. Paste these manually:

- `year` — upload year
- `format` — one of `VIDEO`, `MOCAP`, `RIG`, `WEBGL`, `ESSAY`, etc.
- `category` — one of `FILM`, `GAMES`, `INTERNAL`, `R&D`, etc.
- `tags` — three short uppercase labels (year, format, category by convention)
- `id` — keep stable with the sidebar order (e.g. `[001]`)
- `cellClass` — pick an empty grid cell (`cell-1` through `cell-12`)
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

Just add a new object to `journalEntries` directly. Set `hasPage: true` if you want a detail page (triggers `getStaticPaths` in `src/pages/journal/[slug].astro`).

## Thumbnails

Not all uploads have a `maxresdefault.jpg`. The helper HEAD-checks and falls back to `hqdefault.jpg` automatically. For older uploads or when you want something custom, replace the `image` / `heroImage` URLs with your own asset.
