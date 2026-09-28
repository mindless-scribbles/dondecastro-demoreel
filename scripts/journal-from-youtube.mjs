#!/usr/bin/env node
// Create a journal entry from a YouTube URL.
//
// Writes src/content/journal/<date>-<slug>/index.md with the frontmatter filled in
// (title, upload date, video id, source link) and a placeholder body for the article.
// The journal sorts by date, so there is nothing to renumber.
//
// Usage:
//   node scripts/journal-from-youtube.mjs <youtube-url> [--slug my-slug] [--date YYYY-MM-DD] [--dry-run]

import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";

const JOURNAL_DIR = "src/content/journal";

const args = process.argv.slice(2);
if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
  console.error(
    "Usage: node scripts/journal-from-youtube.mjs <youtube-url> [--slug my-slug] [--date YYYY-MM-DD] [--dry-run]",
  );
  process.exit(args.length === 0 ? 1 : 0);
}

const flag = (name) => {
  const i = args.indexOf(name);
  return i !== -1 ? args[i + 1] : null;
};
const url = args.find((a, i) => !a.startsWith("--") && !["--slug", "--date"].includes(args[i - 1]));
const slugOverride = flag("--slug");
const dateOverride = flag("--date");
const dryRun = args.includes("--dry-run");

function parseVideoId(input) {
  try {
    const u = new URL(input);
    if (u.hostname === "youtu.be") return u.pathname.slice(1);
    if (u.hostname.endsWith("youtube.com")) {
      if (u.pathname === "/watch") return u.searchParams.get("v");
      const m = u.pathname.match(/^\/(?:embed|shorts|live)\/([^/?]+)/);
      if (m) return m[1];
    }
  } catch {
    // fall through
  }
  return null;
}

const kebab = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

/** YYYY-MM-DD from the watch page's uploadDate (the uploader's local date), or null. */
async function fetchUploadDate(videoId) {
  try {
    const res = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: { "Accept-Language": "en" },
    });
    const html = await res.text();
    const m =
      html.match(/itemprop="uploadDate" content="(\d{4}-\d{2}-\d{2})/) ??
      html.match(/"uploadDate":"(\d{4}-\d{2}-\d{2})/);
    return m ? m[1] : null;
  } catch {
    return null;
  }
}

const yq = (s) => JSON.stringify(s);

async function main() {
  const videoId = url && parseVideoId(url);
  if (!videoId) {
    console.error(`Error: could not parse a YouTube video id from "${url ?? ""}".`);
    process.exit(1);
  }
  if (dateOverride && !/^\d{4}-\d{2}-\d{2}$/.test(dateOverride)) {
    console.error("Error: --date must be YYYY-MM-DD.");
    process.exit(1);
  }

  const oembedRes = await fetch(
    `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://youtu.be/${videoId}`)}&format=json`,
  );
  if (!oembedRes.ok) {
    console.error(`oEmbed fetch failed: ${oembedRes.status}`);
    process.exit(1);
  }
  const title = ((await oembedRes.json()).title ?? "").replace(/\s+/g, " ").trim();

  let date = dateOverride ?? (await fetchUploadDate(videoId));
  if (!date) {
    date = new Date().toISOString().slice(0, 10);
    console.warn(`  ⚠ couldn't read the upload date; using today (${date}). Pass --date to set it.`);
  }

  const slug = slugOverride ?? (kebab(title) || videoId);
  const dir = `${JOURNAL_DIR}/${date}-${slug}`;
  const file = `---
slug: ${slug}
title: ${yq(title)}
date: ${date}
subtitle: "TODO short descriptor"
format: VIDEO
category: "TODO" # e.g. RIGGING, TOOLS, ANIM, ANIM/VFX
youtube: ${videoId}
source:
  platform: youtube
  url: https://youtu.be/${videoId}
---

TODO: write the article, or paste the YouTube description here.
`;

  if (dryRun) {
    process.stdout.write(`// ${dir}/index.md\n${file}`);
    return;
  }
  // Same slug under any date means the entry already exists.
  const existing = existsSync(JOURNAL_DIR)
    ? readdirSync(JOURNAL_DIR).find((d) => d.replace(/^\d{4}-\d{2}-\d{2}-/, "") === slug)
    : undefined;
  if (existing) {
    console.error(`Error: an entry with slug "${slug}" already exists: ${JOURNAL_DIR}/${existing}`);
    process.exit(1);
  }
  mkdirSync(dir, { recursive: true });
  writeFileSync(`${dir}/index.md`, file);
  console.log(`✓ Created ${dir}/index.md`);
  console.log("  Fill in subtitle, category and the article body.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
