#!/bin/bash
# dondecastro.com — Project Scaffold Setup
# Run this AFTER initializing with: npm create astro@latest dondecastro-site
#
# This script creates the directory structure and placeholder files
# for the site. Run from the project root.

set -e

echo "=== Setting up dondecastro.com project structure ==="

# Content collections
mkdir -p src/content/blog
mkdir -p src/content/work

# Components
mkdir -p src/components

# Layouts
mkdir -p src/layouts

# Pages
mkdir -p src/pages/blog
mkdir -p src/pages/work

# Assets (images, processed by Astro)
mkdir -p src/assets/images/projects
mkdir -p src/assets/images/blog

# Public static files
mkdir -p public/fonts
mkdir -p public/demos
mkdir -p public/downloads

# Styles
mkdir -p src/styles

echo "=== Creating placeholder content ==="

# Content collection config
cat > src/content.config.ts << 'EOF'
import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string(),
    tags: z.array(z.string()),
    thumbnail: z.string(),
    videoEmbed: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const work = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    client: z.string(),
    role: z.string(),
    year: z.number(),
    description: z.string(),
    tags: z.array(z.string()),
    thumbnail: z.string(),
    videoEmbed: z.string().optional(),
    images: z.array(z.string()).optional(),
    featured: z.boolean().default(false),
    sortOrder: z.number().default(0),
  }),
});

export const collections = { blog, work };
EOF

# Sample blog post
cat > src/content/blog/hello-world.mdx << 'EOF'
---
title: "First Post: Building This Site"
date: 2025-01-01
description: "How I built this portfolio site with Astro, Tailwind, and Claude Code."
tags: ["pipeline", "python"]
thumbnail: "/images/blog/hello-world.jpg"
draft: false
---

# Welcome

This is a placeholder post. Replace it with real content.
EOF

# Sample project
cat > src/content/work/avatar-fire-and-ash.mdx << 'EOF'
---
title: "Avatar: Fire and Ash"
client: "Lightstorm Entertainment"
role: "Motion Edit Supervisor"
year: 2025
description: "Motion capture supervision and pipeline development for the Avatar franchise."
tags: ["motion-capture", "pipeline", "animation"]
thumbnail: "/images/projects/avatar-faa.jpg"
featured: true
sortOrder: 1
---

Project details go here.
EOF

# Global styles
cat > src/styles/global.css << 'EOF'
@import "tailwindcss";

/* ========================================
   Custom Properties
   ======================================== */

:root {
  --color-bg: #0a0a0a;
  --color-bg-raised: #141414;
  --color-bg-elevated: #1e1e1e;
  --color-text: #e8e8e8;
  --color-text-muted: #888888;
  --color-text-bright: #ffffff;
  --color-accent: #3b82f6;        /* Blue accent; adjust to preference */
  --color-accent-hover: #60a5fa;
  --color-border: #2a2a2a;

  --font-display: "Clash Display", sans-serif;
  --font-body: "Outfit", sans-serif;
  --font-mono: "JetBrains Mono", monospace;

  --max-content-width: 70ch;
  --max-page-width: 1400px;
}

/* ========================================
   Base Styles
   ======================================== */

html {
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-body);
  scroll-behavior: smooth;
}

body {
  margin: 0;
  min-height: 100vh;
}

::selection {
  background-color: var(--color-accent);
  color: var(--color-text-bright);
}

/* ========================================
   Typography
   ======================================== */

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-display);
  color: var(--color-text-bright);
  line-height: 1.1;
}

a {
  color: var(--color-accent);
  text-decoration: none;
  transition: color 0.2s ease;
}

a:hover {
  color: var(--color-accent-hover);
}

/* ========================================
   Blog Prose
   ======================================== */

.prose {
  max-width: var(--max-content-width);
  line-height: 1.75;
}

.prose h2 {
  margin-top: 2.5rem;
  margin-bottom: 1rem;
}

.prose p {
  margin-bottom: 1.25rem;
}

.prose code {
  font-family: var(--font-mono);
  font-size: 0.875em;
  background: var(--color-bg-elevated);
  padding: 0.15em 0.4em;
  border-radius: 4px;
}

.prose pre {
  background: var(--color-bg-elevated);
  padding: 1.5rem;
  border-radius: 8px;
  overflow-x: auto;
  margin: 1.5rem 0;
}

.prose pre code {
  background: none;
  padding: 0;
}

/* ========================================
   Video Embed Facade
   ======================================== */

.video-facade {
  position: relative;
  aspect-ratio: 16 / 9;
  background: var(--color-bg-raised);
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
}

.video-facade img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.video-facade:hover img {
  transform: scale(1.02);
}

.video-facade .play-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 72px;
  height: 72px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}

.video-facade:hover .play-button {
  background: var(--color-accent);
}
EOF

# Base layout
cat > src/layouts/BaseLayout.astro << 'EOF'
---
interface Props {
  title: string;
  description?: string;
}

const { title, description = "Don De Castro — Technical Animator & Motion Edit Supervisor" } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />

    <!-- Open Graph -->
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />

    <!-- Fonts (replace with your chosen fonts) -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
      rel="stylesheet"
    />
    <!-- Note: Clash Display is from Fontshare (fontshare.com), not Google Fonts.
         Download and self-host in public/fonts/, or swap for another display font. -->

    <title>{title}</title>

    <link rel="stylesheet" href="/src/styles/global.css" />
  </head>
  <body>
    <nav class="site-nav">
      <div class="nav-inner">
        <a href="/" class="nav-logo">Don De Castro</a>
        <div class="nav-links">
          <a href="/reel">Reel</a>
          <a href="/work">Work</a>
          <a href="/blog">Blog</a>
          <a href="/about">About</a>
        </div>
      </div>
    </nav>

    <main>
      <slot />
    </main>

    <footer class="site-footer">
      <p>&copy; {new Date().getFullYear()} Don De Castro. All rights reserved.</p>
    </footer>
  </body>
</html>

<style>
  .site-nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background: rgba(10, 10, 10, 0.85);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--color-border);
  }

  .nav-inner {
    max-width: var(--max-page-width);
    margin: 0 auto;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .nav-logo {
    font-family: var(--font-display);
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-text-bright);
  }

  .nav-links {
    display: flex;
    gap: 2rem;
  }

  .nav-links a {
    color: var(--color-text-muted);
    font-size: 0.9rem;
    font-weight: 500;
    letter-spacing: 0.02em;
    transition: color 0.2s ease;
  }

  .nav-links a:hover {
    color: var(--color-text-bright);
  }

  .site-footer {
    border-top: 1px solid var(--color-border);
    padding: 2rem;
    text-align: center;
    color: var(--color-text-muted);
    font-size: 0.85rem;
  }

  main {
    padding-top: 4rem; /* offset for fixed nav */
  }
</style>
EOF

# VideoEmbed component
cat > src/components/VideoEmbed.astro << 'EOF'
---
interface Props {
  url: string;
  title?: string;
  caption?: string;
}

const { url, title = "Video", caption } = Astro.props;

// Extract video ID and platform
function getVideoInfo(url: string) {
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) {
    return {
      platform: "youtube" as const,
      id: ytMatch[1],
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?rel=0`,
      thumbnailUrl: `https://img.youtube.com/vi/${ytMatch[1]}/maxresdefault.jpg`,
    };
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return {
      platform: "vimeo" as const,
      id: vimeoMatch[1],
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?dnt=1`,
      thumbnailUrl: null, // Vimeo requires API call for thumbnails
    };
  }

  return null;
}

const videoInfo = getVideoInfo(url);
---

{videoInfo && (
  <div class="video-embed" data-embed-url={videoInfo.embedUrl}>
    <div class="video-facade" role="button" tabindex="0" aria-label={`Play ${title}`}>
      {videoInfo.thumbnailUrl && (
        <img
          src={videoInfo.thumbnailUrl}
          alt={`Thumbnail for ${title}`}
          loading="lazy"
        />
      )}
      <div class="play-button">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
          <polygon points="5,3 19,12 5,21" />
        </svg>
      </div>
    </div>
    {caption && <p class="video-caption">{caption}</p>}
  </div>
)}

<script>
  // Lazy-load: replace facade with iframe on click
  document.querySelectorAll('.video-embed').forEach((container) => {
    const facade = container.querySelector('.video-facade');
    if (!facade) return;

    const activate = () => {
      const embedUrl = container.getAttribute('data-embed-url');
      if (!embedUrl) return;

      const iframe = document.createElement('iframe');
      iframe.src = embedUrl + '&autoplay=1';
      iframe.allow = 'autoplay; fullscreen; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;border:none;';

      const wrapper = document.createElement('div');
      wrapper.style.cssText = 'position:relative;aspect-ratio:16/9;border-radius:8px;overflow:hidden;';
      wrapper.appendChild(iframe);

      facade.replaceWith(wrapper);
    };

    facade.addEventListener('click', activate);
    facade.addEventListener('keydown', (e: Event) => {
      if ((e as KeyboardEvent).key === 'Enter' || (e as KeyboardEvent).key === ' ') {
        e.preventDefault();
        activate();
      }
    });
  });
</script>

<style>
  .video-embed {
    margin: 1.5rem 0;
  }

  .video-caption {
    margin-top: 0.5rem;
    font-size: 0.85rem;
    color: var(--color-text-muted);
    text-align: center;
  }
</style>
EOF

# Tag filter component
cat > src/components/TagFilter.astro << 'EOF'
---
interface Props {
  tags: string[];
  activeTag?: string;
  basePath: string;  // e.g., "/blog" or "/work"
}

const { tags, activeTag, basePath } = Astro.props;
const sortedTags = [...tags].sort();
---

<div class="tag-filter">
  <a
    href={basePath}
    class:list={["tag-pill", { active: !activeTag }]}
  >
    All
  </a>
  {sortedTags.map((tag) => (
    <a
      href={`${basePath}?tag=${tag}`}
      class:list={["tag-pill", { active: activeTag === tag }]}
    >
      {tag}
    </a>
  ))}
</div>

<style>
  .tag-filter {
    display: flex;
    gap: 0.5rem;
    overflow-x: auto;
    padding: 0.5rem 0;
    scrollbar-width: none;
  }

  .tag-filter::-webkit-scrollbar {
    display: none;
  }

  .tag-pill {
    white-space: nowrap;
    padding: 0.35rem 1rem;
    border-radius: 999px;
    font-size: 0.8rem;
    font-weight: 500;
    border: 1px solid var(--color-border);
    color: var(--color-text-muted);
    transition: all 0.2s ease;
  }

  .tag-pill:hover {
    border-color: var(--color-accent);
    color: var(--color-text);
  }

  .tag-pill.active {
    background: var(--color-accent);
    border-color: var(--color-accent);
    color: var(--color-text-bright);
  }
</style>
EOF

echo ""
echo "=== Scaffold complete ==="
echo ""
echo "Next steps:"
echo "  1. cd into your Astro project directory"
echo "  2. Run this script: bash scaffold.sh"
echo "  3. Install fonts (Clash Display from fontshare.com, self-host in public/fonts/)"
echo "  4. Replace placeholder content with real project/blog data"
echo "  5. npm run dev to start developing"
echo ""
