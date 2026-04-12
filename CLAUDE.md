# dondecastro.com — Personal Brand Website

## Project Overview

Portfolio and blog site for Don De Castro, a Technical Animator and Motion Edit Supervisor with 20+ years in feature film, AAA games, and virtual production. The site serves two primary audiences:

1. **Hiring managers / recruiters** looking for demo reels and professional background
2. **Industry peers / community** interested in technical art explorations, blog content, and interactive demos

## Tech Stack

- **Framework:** Astro (astro.build)
- **Styling:** Tailwind CSS 4
- **Content:** Astro Content Collections with MDX for blog posts
- **Interactive embeds:** Three.js, p5.js, GLSL (loaded per-post, not globally)
- **Deployment:** Netlify via GitHub (auto-deploy on push to `main`)
- **Domain:** www.dondecastro.com

## Site Structure

```
/                     → Home (hero + featured reel + recent work)
/reel                 → Demo Reels page (primary reels, embedded video)
/work                 → Portfolio / Selected Work (project cards with detail pages)
/work/[slug]          → Individual project page
/blog                 → Blog index (filterable by tag)
/blog/[slug]          → Individual blog post (MDX, supports interactive components)
/about                → Bio, resume download link, contact info
```

## Content Collections

### Blog Posts (`src/content/blog/`)
Frontmatter schema:
```yaml
title: string
date: date
description: string
tags: string[]          # e.g. ["rigging", "math", "touchdesigner", "houdini", "three.js"]
thumbnail: string       # path to thumbnail image
videoEmbed: string?     # optional YouTube/Vimeo URL
draft: boolean
```

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

### Typography
- Display/headings: A distinctive sans-serif (e.g., Syne, Clash Display, or similar; never Inter, Roboto, or Arial)
- Body: A clean, readable sans-serif that pairs well (e.g., Outfit, General Sans, Satoshi)
- Monospace (for code in blog posts): JetBrains Mono or similar

### Color Palette
- Background: Near-black (#0a0a0a or similar dark tone)
- Text: Off-white (#e8e8e8) for body, brighter white for headings
- Accent: A single bold accent color (to be decided, something that pops against dark; consider electric blue, amber, or a warm highlight)
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

## Blog Post Workflow

1. Create new `.mdx` file in `src/content/blog/`
2. Add frontmatter (title, date, tags, thumbnail, etc.)
3. Write content in Markdown
4. For interactive demos, import and use components:
   ```mdx
   import InteractiveCanvas from '../../components/InteractiveCanvas.astro';

   Here's the rigging concept in action:

   <InteractiveCanvas type="threejs" src="/demos/rig-demo.js" />
   ```
5. Commit and push; Netlify auto-deploys.

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
