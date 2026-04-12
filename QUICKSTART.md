# Getting Started with Claude Code

This guide walks through how to use Claude Code to build and iterate on dondecastro.com.

## Initial Setup

```bash
# 1. Create the Astro project
npm create astro@latest dondecastro-site -- --template minimal --typescript strict

# 2. Move into the project
cd dondecastro-site

# 3. Add integrations
npx astro add tailwind
npx astro add mdx
npx astro add netlify    # Netlify adapter for deployment

# 4. Copy CLAUDE.md into the project root
cp /path/to/CLAUDE.md ./CLAUDE.md

# 5. Run the scaffold script
bash /path/to/scaffold.sh

# 6. Verify it works
npm run dev
```

## Working with Claude Code

### Session Workflow

When you start a Claude Code session for this project, Claude will read CLAUDE.md
automatically if it's in the project root. This gives it full context about the site
architecture, design system, and conventions.

Effective patterns for working with Claude Code on this project:

**Build one section at a time.**
Instead of "build the whole site," try:
- "Build the homepage with the hero section and featured reel embed"
- "Create the /reel page with lazy-loaded YouTube embeds"
- "Build the blog index page with tag filtering"
- "Add the project detail page template"

**Iterate on design in small passes.**
- "The nav feels too generic. Make it more distinctive, maybe asymmetric or with a signature element."
- "The project cards need more visual impact on hover. Add a reveal animation."
- "The blog typography needs work. Tighten the heading spacing and add proper code block styling."

**Use Claude Code for content pipeline setup.**
- "Add an RSS feed for the blog"
- "Set up automatic Open Graph image generation per blog post"
- "Create a sitemap.xml"

**Let Claude Code handle the tedious parts.**
- "Create five placeholder blog posts with realistic frontmatter for testing the tag filter"
- "Add responsive breakpoints to the nav (hamburger menu on mobile)"
- "Set up a 404 page that matches the site design"

### Tips for Best Results

1. **Keep CLAUDE.md updated.** When you make design decisions (chose a specific accent
   color, decided on a layout change), update CLAUDE.md so future sessions stay consistent.

2. **Commit frequently.** After each successful section build, commit. If a Claude Code
   session goes sideways, you can revert cleanly.

3. **Reference the design direction.** If output looks too generic, remind Claude Code:
   "Remember, we're going for cinematic and refined, not generic portfolio template."

4. **Use the component library.** When adding new blog features, build them as reusable
   components first (in src/components/), then use them in pages and MDX posts.

## Deployment

The site auto-deploys via Netlify when you push to `main` on GitHub.

```bash
# Link to your existing Netlify site
npx netlify-cli link

# Or deploy manually for testing
npx netlify-cli deploy --prod
```

Make sure your Netlify site is configured to use the Astro build command:
- Build command: `npm run build`
- Publish directory: `dist/`

## Adding Blog Posts

1. Create a new `.mdx` file in `src/content/blog/`:

```mdx
---
title: "Exploring IK Solvers in Three.js"
date: 2025-02-15
description: "Building an interactive IK chain visualization to understand solver behavior."
tags: ["rigging", "three.js", "math"]
thumbnail: "/images/blog/ik-solver-thumb.jpg"
draft: false
---

Your content here. You can use standard Markdown plus import components:

import VideoEmbed from '../../components/VideoEmbed.astro';

<VideoEmbed url="https://www.youtube.com/watch?v=YOUR_VIDEO_ID" caption="IK solver demo" />
```

2. Add the thumbnail image to `src/assets/images/blog/`
3. Commit and push.

## Adding Interactive Demos to Blog Posts

For Three.js, p5.js, or GLSL demos embedded in blog posts:

1. Write the demo script and place it in `public/demos/`
2. Use the InteractiveCanvas component (build this when you need it) in your MDX
3. The component should handle:
   - Lazy initialization (only start rendering when visible)
   - Cleanup on unmount
   - Responsive canvas sizing
   - Loading indicator

## Font Setup

Clash Display (recommended for headings) is available free from fontshare.com:

1. Download the WOFF2 files
2. Place in `public/fonts/`
3. Add @font-face declarations in `src/styles/global.css`
4. Update the CSS custom property `--font-display`

Outfit and JetBrains Mono load from Google Fonts (already in the base layout).

## Project File Structure (after scaffold)

```
dondecastro-site/
  CLAUDE.md                  # Project context for Claude Code
  astro.config.mjs           # Astro configuration
  tailwind.config.mjs        # Tailwind configuration
  src/
    content/
      blog/                  # Blog posts (MDX)
      work/                  # Portfolio projects (MDX)
      content.config.ts      # Collection schemas
    components/
      VideoEmbed.astro       # Lazy-loading video player
      TagFilter.astro        # Tag-based content filtering
      ProjectCard.astro      # Portfolio grid cards (build when needed)
      InteractiveCanvas.astro # Three.js/p5.js wrapper (build when needed)
    layouts/
      BaseLayout.astro       # Site-wide layout (nav, footer, head)
    pages/
      index.astro            # Homepage
      reel.astro             # Demo reels page
      about.astro            # Bio and contact
      blog/
        index.astro          # Blog listing
        [...slug].astro      # Dynamic blog post pages
      work/
        index.astro          # Portfolio grid
        [...slug].astro      # Dynamic project pages
    styles/
      global.css             # Global styles, CSS variables, typography
    assets/
      images/                # Optimized images (processed by Astro)
  public/
    fonts/                   # Self-hosted fonts
    demos/                   # Interactive demo scripts
    downloads/               # Downloadable files (resume PDF, etc.)
```
