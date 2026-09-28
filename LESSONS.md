# LESSONS.md

Project-specific lessons learned across sessions. Read at session start. Update after any correction or mistake.

## Rules
<!-- Each rule should be concrete and actionable. Format:
     **[Short label]:** What to do (or not do), and why. -->

(No lessons yet. This file will grow as we work together.)

<!-- Example of a good lesson:
**Never modify the config loader without running integration tests:**
Unit tests pass but the config loader has side effects on the database
connection pool. Always run `npm run test:integration` after changes
to src/config/. Learned 2026-04-10 when a config refactor broke
staging for 2 hours. -->

**Use `overflow-x: clip`, never `hidden`, on `body`:** with `html` and `body` both set to `overflow-x: hidden`, body becomes its own scroll container and every `position: sticky` header silently stops sticking. Found 2026-09-27 during the hybrid redesign.

**No `orientation` media queries:** the old home page stacked portrait/landscape special cases with viewport math (`bottom: calc(10vh + 5.18vw + ...)`) and broke on iPad. Size with `aspect-ratio` and the 768 / 1024 / 1280 breakpoints instead (STYLE_GUIDE §3).

**The surname is "De Castro": never let it break as "Don De / Castro":** `text-wrap: balance` on the home hero split the name after "De" on a portrait iPhone. Keep the full name on one line (`white-space: nowrap` with width-based sizing) and use `De&nbsp;Castro` wherever the name can wrap. Found 2026-09-27 on a real iPhone; desktop width checks didn't catch it.

**Journal dates are the local upload date, not UTC:** the YouTube RSS feed's `published` is UTC, so Don's evening uploads in LA showed up a day late (3 of 5 entries were off by one). Use the watch page's `uploadDate` (local, with offset); `scripts/journal-from-youtube.mjs` does this. Found 2026-09-27.

**Script-created elements need `:global()` in scoped styles:** Astro scopes `<style>` selectors with a `data-astro-cid-*` attribute, and elements made with `document.createElement` don't have it. The YouTube facade's iframe rendered at the 300×150 default until the rule became `.frame-video :global(iframe)`. ReelPanel avoids it the same way. Found 2026-09-27.

**Hidden tabs don't run `requestAnimationFrame`:** scroll-driven checks through Claude in Chrome read stale values while `document.hidden` is true. Take a screenshot (which brings the tab forward) before trusting rAF-driven state.

**Read the mockup board before building a layout, not just the plan's summary of it:** the plan said "body in a 720px column", and I squeezed the whole video article into a 960px column with the body off-center. On the canvas, the header and video span the page and only the body is a centered 720px column. Have a subagent pull the exact widths and alignment from the board first. Found 2026-09-27.
