#!/usr/bin/env node
// Prepend a new journal entry from a YouTube URL.
//
// Default behavior: edits src/data/journalEntries.ts in place — inserts the new
// entry at [001] / cell-1, shifts existing entries' id and cellClass down by one,
// and drops anything that overflows past cell-12 (archive-worthy).
//
// Usage:
//   node scripts/journal-from-youtube.mjs <youtube-url> [--slug my-slug]
//   node scripts/journal-from-youtube.mjs <youtube-url> --dry-run   # print the new entry block, don't edit

import { readFileSync, writeFileSync } from "node:fs";

const ENTRIES_FILE = "src/data/journalEntries.ts";
const MAX_CELL = 12;

const args = process.argv.slice(2);
if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
  console.error(
    "Usage: node scripts/journal-from-youtube.mjs <youtube-url> [--slug my-slug] [--dry-run]",
  );
  process.exit(args.length === 0 ? 1 : 0);
}

const url = args.find((a) => !a.startsWith("--"));
const slugIdx = args.indexOf("--slug");
const slugOverride = slugIdx !== -1 ? args[slugIdx + 1] : null;
const dryRun = args.includes("--dry-run");

if (!url) {
  console.error("Error: a YouTube URL is required.");
  process.exit(1);
}

function parseVideoId(input) {
  try {
    const u = new URL(input);
    if (u.hostname === "youtu.be") return u.pathname.slice(1);
    if (u.hostname.endsWith("youtube.com")) {
      if (u.pathname === "/watch") return u.searchParams.get("v");
      const embedMatch = u.pathname.match(/^\/embed\/([^/?]+)/);
      if (embedMatch) return embedMatch[1];
    }
  } catch {
    // fall through
  }
  return null;
}

const videoId = parseVideoId(url);
if (!videoId) {
  console.error(`Error: could not parse a video ID from "${url}".`);
  process.exit(1);
}

function kebab(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

async function headOk(u) {
  try {
    const res = await fetch(u, { method: "HEAD" });
    return res.ok;
  } catch {
    return false;
  }
}

function buildEntry({ slug, title, videoId, thumb }) {
  const tsTitle = title.replace(/"/g, '\\"');
  return `  {
    slug: "${slug}",
    title: "${tsTitle}",
    id: "[001]",
    tags: ["TODO_YEAR", "TODO_FORMAT", "TODO_CATEGORY"],
    image: "${thumb}",
    cellClass: "cell-1",
    hasPage: true,
    video: true,
    year: 0, // TODO
    format: "TODO", // e.g. VIDEO, MOCAP, WEBGL
    category: "TODO", // e.g. FILM, INTERNAL, R&D
    heroImage: "${thumb}",
    subtitle: "TODO short descriptor",
    article: [
      {
        type: "video",
        provider: "youtube",
        videoId: "${videoId}",
        title: "${tsTitle}",
        caption: "Watch on YouTube",
      },
      {
        type: "p",
        dropcap: true,
        html: "TODO: paste the YouTube description here (oEmbed does not expose it).",
      },
    ],
  },
`;
}

function splitEntries(body) {
  const lines = body.split("\n");
  const entries = [];
  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i] === "  {" && start === -1) {
      start = i;
    } else if (lines[i] === "  }," && start !== -1) {
      const text = lines.slice(start, i + 1).join("\n") + "\n";
      entries.push({ text });
      start = -1;
    }
  }
  return entries;
}

function prependEntryToFile(src, newEntryText) {
  const openMarker = "export const journalEntries: JournalEntry[] = [\n";
  const openIdx = src.indexOf(openMarker);
  if (openIdx === -1) throw new Error(`Could not find "${openMarker.trim()}" in ${ENTRIES_FILE}`);
  const bodyStart = openIdx + openMarker.length;

  const closeMatchInBody = /^\];/m.exec(src.slice(bodyStart));
  if (!closeMatchInBody) throw new Error("Could not find array close `];`");
  const bodyEnd = bodyStart + closeMatchInBody.index;

  const pre = src.slice(0, bodyStart);
  const body = src.slice(bodyStart, bodyEnd);
  const post = src.slice(bodyEnd);

  const existing = splitEntries(body);

  const shifted = existing.map((e) => {
    const cellMatch = /cellClass: "cell-(\d+)"/.exec(e.text);
    const cellNum = cellMatch ? parseInt(cellMatch[1], 10) + 1 : Infinity;
    const slugMatch = /slug: "([^"]+)"/.exec(e.text);
    const text = e.text.replace(/cellClass: "cell-\d+"/, `cellClass: "cell-${cellNum}"`);
    return { text, cellNum, slug: slugMatch?.[1] ?? "(unknown)" };
  });

  const kept = [];
  for (const s of shifted) {
    if (s.cellNum > MAX_CELL) {
      console.warn(`  ⚠ dropped (overflowed cell-${MAX_CELL}): ${s.slug}`);
    } else {
      kept.push(s);
    }
  }

  kept.forEach((s, i) => {
    const padded = String(i + 2).padStart(3, "0");
    s.text = s.text.replace(/id: "\[\d+\]"/, `id: "[${padded}]"`);
  });

  const newBody = newEntryText + kept.map((s) => s.text).join("");
  return pre + newBody + post;
}

async function main() {
  const oembedRes = await fetch(
    `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`,
  );
  if (!oembedRes.ok) {
    console.error(`oEmbed fetch failed: ${oembedRes.status}`);
    process.exit(1);
  }
  const oembed = await oembedRes.json();
  const title = oembed.title ?? "";

  const candidates = [
    `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
    `https://i.ytimg.com/vi/${videoId}/sddefault.jpg`,
    `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
  ];
  let thumb = candidates[candidates.length - 1];
  for (const candidate of candidates) {
    if (await headOk(candidate)) {
      thumb = candidate;
      break;
    }
  }

  const slug = slugOverride ?? kebab(title) ?? videoId;
  const entryText = buildEntry({ slug, title, videoId, thumb });

  if (dryRun) {
    process.stdout.write(
      `// Source: ${url}\n// Channel: ${oembed.author_name ?? ""}\n` + entryText,
    );
    return;
  }

  const src = readFileSync(ENTRIES_FILE, "utf8");
  const edited = prependEntryToFile(src, entryText);
  writeFileSync(ENTRIES_FILE, edited);
  console.log(`✓ Prepended "${slug}" at [001] / cell-1 in ${ENTRIES_FILE}`);
  console.log(`  Fill in the TODO fields (year, format, category, tags, subtitle, description).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
