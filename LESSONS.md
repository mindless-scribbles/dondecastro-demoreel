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
