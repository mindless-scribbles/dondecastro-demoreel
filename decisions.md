# Architecture & Design Decisions

This document captures the reasoning behind key decisions for dondecastro.com,
so that future Claude Code sessions (and future-you) have the full context.

## Framework: Astro over Next.js

**Decision:** Use Astro as the static site generator.

**Why:**
- The site is primarily content-driven (portfolio, blog, embedded video). Astro is
  purpose-built for this; it ships zero JavaScript by default and only hydrates
  interactive components where explicitly needed.
- Astro's Content Collections give us typed frontmatter schemas for blog posts and
  projects, which keeps content structured and queryable without a CMS.
- MDX support means blog posts can import and use interactive components (Three.js
  sketches, p5.js demos) inline alongside prose.
- Next.js would work, but it's heavier than needed for a portfolio/blog. The React
  runtime overhead doesn't buy us anything here since most pages are static.
- Astro has first-class Netlify adapter support, and the site is already deployed
  on Netlify via GitHub.

**Trade-off:** If the site ever needs authenticated user features, dynamic API routes,
or server-side logic beyond static generation, Next.js would be worth revisiting.
For a portfolio and blog, Astro is the better fit.


## Video Hosting: Embed from YouTube/Vimeo, Don't Self-Host

**Decision:** Embed demo reels from YouTube or Vimeo rather than hosting video files.

**Why:**
- Self-hosting video is expensive. Bandwidth costs scale with views, and serving
  adaptive bitrate streams requires either a CDN with video processing (like
  Cloudflare Stream, Mux, or AWS MediaConvert) or accepting poor mobile performance.
- YouTube handles adaptive bitrate, global CDN delivery, and player UI for free.
  Vimeo Pro does the same with a cleaner player and no suggested videos at the end,
  which is more professional for a reel page.
- The facade pattern (show a static thumbnail + play button, only load the iframe
  when clicked) eliminates the performance cost of embedding. The page loads fast
  with just an image; the iframe and video player only initialize on interaction.
- For short clips or loops in blog posts (under ~20MB), self-hosted MP4/WebM is
  fine since Netlify serves static assets on their CDN. But anything reel-length
  should be embedded.

**Vimeo vs YouTube:**
- YouTube: free, massive reach, but shows suggested videos and YouTube branding.
  Using youtube-nocookie.com domain and rel=0 parameter minimizes this.
- Vimeo Pro (~$20/month): cleaner player, password protection for client work,
  no suggested videos, more professional appearance. Worth considering for the
  primary reel page.
- Either works. The VideoEmbed component supports both.


## Design Direction: Dark, Cinematic, Refined

**Decision:** Dark theme with a cinematic, high-end feel. Not generic dark mode.

**Why:**
- The primary content is video and visual work. Dark backgrounds make video embeds,
  images, and interactive demos pop without competing for attention.
- The target audience (hiring managers, supervisors, peers in VFX/games) expects
  a polished, professional presentation. A dark cinematic aesthetic signals that
  the person behind the site understands visual craft.
- Avoids the "generic portfolio template" look that plagues most personal sites.
  The combination of a distinctive display font (Clash Display), generous whitespace,
  and a single bold accent color creates a signature feel.

**Guard rails:**
- Dark does not mean gloomy. Use enough contrast and an energetic accent color.
- Let the work be the hero. The design supports, never competes with, the content.
- Start dark-only. A light mode toggle can come later if wanted, but it's not
  a priority and adds complexity.


## Typography: Clash Display + Outfit + JetBrains Mono

**Decision:** Three-font stack with clear roles.

- **Clash Display** (headings): Distinctive, geometric sans-serif from Fontshare.
  Free for commercial use. Self-hosted in public/fonts/ for performance.
- **Outfit** (body text): Clean, highly readable, pairs well with Clash Display
  without being boring. Loaded from Google Fonts.
- **JetBrains Mono** (code blocks in blog): Industry-standard monospace, familiar
  to technical readers. Loaded from Google Fonts.

**Why not Inter/Roboto/system fonts:**
These are the default choices for AI-generated sites and generic templates. Using
them immediately signals "template." Clash Display is less common and gives the
site a recognizable typographic identity.


## Content Architecture: Astro Content Collections with MDX

**Decision:** Use Astro Content Collections for blog posts and portfolio projects,
authored in MDX.

**Why:**
- Content Collections enforce typed frontmatter schemas. Every blog post must have
  a title, date, description, tags, and thumbnail. Every project must have a client,
  role, year, and sort order. This prevents broken pages from incomplete metadata.
- MDX lets blog posts include interactive components. A post about IK solvers can
  import a Three.js visualization and render it inline. A post about TouchDesigner
  can embed a video walkthrough. This is critical for the kind of technical content
  Don wants to publish.
- No external CMS needed. Posts are Markdown files in the repo, versioned with Git,
  deployed automatically on push. Simple to maintain.
- Tags enable filtering on the blog index and portfolio page without any backend.


## Blog Interactive Demos: Per-Post Loading, Not Global

**Decision:** Interactive libraries (Three.js, p5.js, GLSL utilities) load only on
pages that use them, not site-wide.

**Why:**
- Most pages (homepage, reel, about, text-only blog posts) don't need Three.js or
  p5.js. Loading them globally would add hundreds of KB to every page for no benefit.
- Astro's `client:visible` directive means an interactive component's JavaScript only
  loads when the user scrolls it into view. This keeps initial page load fast even on
  posts with heavy demos.
- Each demo is self-contained: a script in public/demos/ loaded by the
  InteractiveCanvas component. This keeps demos isolated and easy to add or remove.


## Deployment: Netlify via GitHub Auto-Deploy

**Decision:** Keep the existing Netlify + GitHub setup. Push to main, site deploys.

**Why:**
- Already in place and working for the current site.
- Netlify's free tier is more than sufficient for a portfolio site.
- Astro's Netlify adapter handles SSR if ever needed, but static output is the
  default and preferred mode.
- Build command: `npm run build`, publish directory: `dist/`.


## Lazy-Load Video Facade Pattern

**Decision:** Never load a YouTube/Vimeo iframe until the user clicks play.

**Why:**
- A single YouTube iframe adds ~500KB+ of resources (player JS, API calls,
  thumbnail fetch, ad scripts). On a reel page with multiple videos, this
  compounds fast.
- The facade pattern: render a static thumbnail image with a CSS play button
  overlay. On click, replace the facade with the real iframe (with autoplay=1
  so playback starts immediately). The user experience is seamless, but the
  page loads in a fraction of the time.
- This is especially important for mobile visitors and for Lighthouse performance
  scores.
- The VideoEmbed component in the scaffold already implements this pattern.
