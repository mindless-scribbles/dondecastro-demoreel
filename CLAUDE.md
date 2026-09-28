# dondecastro.com — Personal Brand Website

## Project Overview

Portfolio and blog site for Don De Castro, a Technical Animator and Motion Edit Supervisor with 20+ years in feature film, AAA games, and virtual production. The site serves two primary audiences:

1. **Hiring managers / recruiters** looking for demo reels and professional background
2. **Industry peers / community** interested in technical art explorations, blog content, and interactive demos

## Tech Stack

- **Framework:** Astro (astro.build)
- **Styling:** Tailwind CSS 4
- **Content:** Astro Content Collections (Markdown); the journal is `src/content/journal/`
- **Interactive embeds:** Three.js, p5.js, GLSL (loaded per-post, not globally)
- **Deployment:** Netlify via GitHub (auto-deploy on push to `main`)
- **Domain:** www.dondecastro.com

## Site Structure

```
/                     → Home (reel panel + hero + journal grid, newest entry featured)
/journal              → Full journal archive
/journal/[slug]       → Journal entry (media layout for photos/reels, article layout for YouTube posts)
/expertise            → Bio and resume download
/contact              → Contact form and details
```

## Content Collections

### Journal (`src/content/journal/`)
The journal is the blog: the site is where Don posts first. One folder per entry, `YYYY-MM-DD-slug/index.md`, with that entry's photos beside it. Schema lives in `src/content.config.ts`; `src/lib/journal.ts` (`getJournal()`) sorts by date, assigns stable ids (oldest = [001]) and is what every page reads.
```yaml
slug: string            # URL: /journal/<slug>
title: string?          # optional; untitled posts use the body's first line
date: date              # local date (not UTC)
subtitle: string?
format: string          # VIDEO, PHOTO, CAROUSEL
category: string        # RIGGING, TOOLS, ANIM, ANIM/VFX, ...
tags: string[]?         # extra card chips
youtube: string?        # video id, embedded above the article
cover: image?           # local; else YouTube thumb, else first photo
images: {src, alt}[]?   # local photos, optimized by Astro
videos: {src, poster}[]? # local clips (./clip.mp4), e.g. Instagram reels
source: {platform: youtube|instagram, url}?
draft: boolean?         # hidden in production builds
```
The Markdown body is the article or caption. The newest entry is automatically the featured card.

### Projects (`src/content/work/`)
Frontmatter schema:
```yaml
title: string
client: string          # e.g. "Lightstorm Entertainment", "Personal"
role: string            # e.g. "Motion Edit Supervisor", "Technical Animator"
year: number
description: string
tags: string[]
thumbnail: string
videoEmbed: string?
images: string[]?
featured: boolean       # show on homepage
sortOrder: number       # manual sort for portfolio page
```

## Design Direction

### Aesthetic
Refined, cinematic, dark-themed. Think high-end motion graphics studio site, not generic portfolio template. The work should be the hero; the design supports it without competing.

STYLE_GUIDE.md is the source of truth for the as-built tokens and patterns.

### Typography
- Display/headings and the header brand: Syne (never Inter, Roboto, or Arial)
- Labels, nav, metadata, UI: Space Mono
- Reading text (journal articles and captions): Hanken Grotesk
- No serif anywhere

### Color Palette
- Background: near-black #070709
- Text: off-white #f4f4f5
- Monochrome: the work carries the color. The #ff3300 accent is used only on the home page tagline and the reel panel.
- Subtle grays for borders, cards, secondary text

### Layout Principles
- Generous whitespace
- Full-bleed hero sections for reel/video content
- Grid-based portfolio layout with hover reveals
- Blog posts: readable column width (max ~70ch), with breakout areas for interactive content and media

## Component Library

Build these as reusable Astro/MDX components:

### VideoEmbed
- Accepts YouTube or Vimeo URL
- Lazy-loads iframe (show thumbnail + play button, load iframe on click)
- Responsive 16:9 aspect ratio
- Optional caption

### InteractiveCanvas
- Wrapper for Three.js / p5.js sketches in blog posts
- Handles resize, loading state, error boundary
- Props: `type` ("threejs" | "p5"), `src` (path to script)

### ProjectCard
- Thumbnail with hover overlay (title, role, year)
- Links to detail page

### TagFilter
- Horizontal scrollable tag list for blog and portfolio pages
- Client-side filtering (no page reload)

### CodeBlock
- Syntax-highlighted code blocks for blog posts
- Copy button

## Video Embed Strategy

- **Demo reels:** Embed from YouTube or Vimeo. Use facade pattern (thumbnail + play button, load iframe on click) for fast page loads.
- **Blog content:** Same embed approach for longer videos. For short clips or loops, consider self-hosted MP4/WebM if files are small (<20MB), otherwise embed from YouTube.
- **Interactive demos:** Rendered client-side via Three.js or p5.js components in MDX.

## Journal Post Workflow

- **From a YouTube video:** `npm run journal:from-youtube <url> [--slug my-slug] [--date YYYY-MM-DD]` creates the entry with the title, local upload date and embed filled in. Then fill in `subtitle`, `category` and the article.
- **Photo post:** create `src/content/journal/YYYY-MM-DD-slug/index.md`, drop the photos in the same folder, list them under `images:` (`src: ./photo.jpg`), and write the caption as the body. Title is optional.
- Commit and push; Netlify auto-deploys from `main`. Preview first with a Netlify draft deploy (see STATUS.md).
- **From Instagram:** request "Download your information" (Posts + Reels, **All time**), then `npm run journal:from-instagram -- <export.zip> --list` and `... --pick N --slug my-slug --category DRAWING`. It copies the photos or clip (plus an ffmpeg poster frame), converts the caption to Markdown (@handles become links) and links `source` to the profile, since the export has no post URLs. Fill in the image alt text afterwards.
- Not yet built: a phone-friendly posting page that writes these same files.

## Development Commands

```bash
npm run dev          # Start dev server (localhost:4321)
npm run build        # Production build
npm run preview      # Preview production build locally
```

## Key Conventions

- All images go in `src/assets/` (Astro optimizes them at build time)
- Public static files (fonts, demo scripts, downloadable resume) go in `public/`
- Use Astro's `<Image />` component for optimized images
- Keep pages server-rendered by default; only add `client:load` or `client:visible` directives for interactive components
- Mobile-first responsive design
- Aim for 90+ Lighthouse scores across all categories

## Content Tags (initial set, expandable)

- `rigging`
- `animation`
- `math`
- `touchdesigner`
- `houdini`
- `three.js`
- `glsl`
- `unreal-engine`
- `motion-capture`
- `pipeline`
- `python`

## Future Considerations

- RSS feed for blog
- Open Graph images auto-generated per post
- Search functionality if blog grows
- Comments (giscus or similar GitHub-based system)
- Dark/light theme toggle (start dark-only, add toggle later)

## Session Continuity

At the start of every session, read STATUS.md before doing anything else. Orient yourself before writing any code.

At the end of every session (when I say "wrap up", "park this", "let's stop", "goodnight", or similar), update STATUS.md with:

- What we worked on this session
- Which files were created or modified
- Key decisions made
- Clear next steps (specific, not vague)

## Learning Loop

Read LESSONS.md at session start alongside STATUS.md.

After any correction or mistake:

1. Fix the immediate problem
2. Add a lesson to LESSONS.md that prevents the same mistake
3. Keep lessons concrete and short

## Planning

Enter Plan Mode for any task that touches more than 2 files. Do not start coding until I approve the plan. If something goes sideways mid-implementation, stop and re-plan instead of patching.

## Verification

Never mark a task complete without verifying the change works:

- At minimum, run `npm run build` and confirm no errors.
- For UI changes, start the dev server (`npm run dev`) and spot-check the affected pages before reporting done. Type-check/build success is not feature success.
- No test suite exists yet. When we add one, update this section to require passing tests before completion, and write tests for any new behavior.

## Context Management

Use subagents for any investigation that requires reading more than 5 files. Keep the main context clean. Run `/compact` proactively when context usage exceeds 50%.
