#!/usr/bin/env node
// Create journal entries from an Instagram "Download your information" export (HTML format).
//
// Reads your_instagram_activity/media/posts_1.html and reels.html from an unzipped export
// folder, or straight from the .zip (only those files and the post/reel media are extracted).
// Each picked post becomes src/content/journal/<date>-<slug>/index.md with its photos or
// clip (plus a poster frame via ffmpeg) copied beside it and the caption (minus hashtags) as the body.
//
// Usage:
//   node scripts/journal-from-instagram.mjs <export.zip|folder> --list
//   node scripts/journal-from-instagram.mjs <export.zip|folder> --pick N --slug my-slug [--category DRAWING] [--dry-run]
//
// The export has no links to your own posts, so `source` points at your profile; paste
// the post URL in by hand if you want the exact post.

import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const JOURNAL_DIR = "src/content/journal";
const PROFILE_URL = "https://www.instagram.com/mindless_scribbles/";
const TIME_ZONE = "America/Los_Angeles"; // the export prints local (Pacific) times

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  return i !== -1 ? args[i + 1] : null;
};
const valueFlags = ["--pick", "--slug", "--category"];
const source = args.find((a, i) => !a.startsWith("--") && !valueFlags.includes(args[i - 1]));
if (!source || args.includes("--help") || args.includes("-h")) {
  console.error(
    "Usage: node scripts/journal-from-instagram.mjs <export.zip|folder> --list\n" +
      "       node scripts/journal-from-instagram.mjs <export.zip|folder> --pick N --slug my-slug [--category DRAWING] [--dry-run]",
  );
  process.exit(source ? 0 : 1);
}

// ---------- Load the export ----------
function exportRoot(path) {
  if (statSync(path).isDirectory()) return path;
  const dir = mkdtempSync(join(tmpdir(), "ig-export-"));
  execFileSync("unzip", ["-oq", path, "your_instagram_activity/media/*", "media/posts/*", "media/reels/*", "-d", dir]);
  return dir;
}

const entities = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
const decode = (s) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&(\w+);/g, (m, name) => entities[name] ?? m);

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "Sep 13, 2026 3:53 pm" (Pacific) -> "2026-09-13T15:53:00-07:00" */
function parseDate(text) {
  const m = text.match(/^(\w{3}) (\d{1,2}), (\d{4}) (\d{1,2}):(\d{2}) (am|pm)$/i);
  if (!m) throw new Error(`Unrecognized date: "${text}"`);
  const [, mon, day, year, h, min, ampm] = m;
  const hour = (Number(h) % 12) + (ampm.toLowerCase() === "pm" ? 12 : 0);
  const p2 = (n) => String(n).padStart(2, "0");
  const local = `${year}-${p2(MONTHS.indexOf(mon) + 1)}-${p2(day)}T${p2(hour)}:${min}:00`;
  // Offset of TIME_ZONE at that moment ("GMT-7" -> "-07:00").
  const probe = new Date(`${local}Z`);
  const name = new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, timeZoneName: "shortOffset" })
    .formatToParts(probe)
    .find((p) => p.type === "timeZoneName").value;
  const [, sign, oh, om] = name.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/) ?? [, "+", "0", "00"];
  return `${local}${sign}${p2(oh)}:${om ?? "00"}`;
}

function parseItems(root) {
  const items = [];
  for (const [file, kind] of [["posts_1.html", "post"], ["reels.html", "reel"]]) {
    const path = join(root, "your_instagram_activity/media", file);
    if (!existsSync(path)) continue;
    const html = readFileSync(path, "utf8");
    for (const block of html.split('<div class="pam _3-95 _2ph- _a6-g uiBoxWhite noborder">').slice(1)) {
      const caption = decode((block.match(/<h2[^>]*>([\s\S]*?)<\/h2>/)?.[1] ?? "").replace(/<[^>]+>/g, "")).trim();
      const media = [...block.matchAll(/<(?:img|video) src="(media\/[^"]+)"/g)].map((m) => m[1]);
      const dates = [...block.matchAll(/<div class="_3-94 _a6-o">(.*?)<\/div>/g)].map((m) => m[1]);
      if (!media.length || !dates.length) continue;
      items.push({ kind, caption, media, date: parseDate(dates.at(-1)) });
    }
  }
  return items.sort((a, b) => a.date.localeCompare(b.date));
}

// ---------- Caption -> Markdown ----------
const escapeMd = (s) => s.replace(/([\\`*_[\]<>])/g, "\\$1");

/** Hashtags (and anything glued to them, like an emoji) are dropped from captions. */
const stripHashtags = (line) => line.replace(/(^|\s)#\S+/g, "$1").replace(/\s+([.,!?])/g, "$1");

/** One caption line: hashtags dropped, @handles become profile links, everything else escaped. */
function lineToMarkdown(line) {
  return stripHashtags(line)
    .trim()
    .replace(/\s{2,}/g, " ")
    .split(/(@[\w.]*\w)/)
    .map((part, i) =>
      i % 2 ? `[${escapeMd(part)}](https://www.instagram.com/${part.slice(1)}/)` : escapeMd(part),
    )
    .join("");
}

function captionToMarkdown(caption) {
  return caption.split(/\n+/).map(lineToMarkdown).filter(Boolean).join("\n\n");
}

// ---------- Main ----------
const root = exportRoot(source);
const items = parseItems(root);

if (args.includes("--list")) {
  items.forEach((it, i) => {
    const first = it.caption.split("\n")[0].slice(0, 70) || "(no caption)";
    console.log(`${String(i + 1).padStart(2)}  ${it.date.slice(0, 16).replace("T", " ")}  ${it.kind.padEnd(4)} ${it.media.length} media  ${first}`);
  });
  process.exit(0);
}

const pick = Number(flag("--pick"));
const item = items[pick - 1];
if (!item) {
  console.error(`Error: --pick must be 1-${items.length} (see --list).`);
  process.exit(1);
}
const slug = flag("--slug");
if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error("Error: --slug is required (lowercase words joined by hyphens).");
  process.exit(1);
}
const category = flag("--category") ?? "TODO";
const existing = existsSync(JOURNAL_DIR)
  ? readdirSync(JOURNAL_DIR).find((d) => d.replace(/^\d{4}-\d{2}-\d{2}-/, "") === slug)
  : undefined;
if (existing) {
  console.error(`Error: an entry with slug "${slug}" already exists: ${JOURNAL_DIR}/${existing}`);
  process.exit(1);
}

const dir = `${JOURNAL_DIR}/${item.date.slice(0, 10)}-${slug}`;
const photos = item.media.filter((m) => /\.(jpe?g|png|webp|heic)$/i.test(m));
const clips = item.media.filter((m) => /\.(mp4|mov)$/i.test(m));
const n = (list, i, base, ext) => (list.length > 1 ? `${base}-${i + 1}.${ext}` : `${base}.${ext}`);
const photoFiles = photos.map((m, i) => n(photos, i, "photo", m.split(".").pop().toLowerCase()));
const clipFiles = clips.map((_, i) => n(clips, i, "clip", "mp4"));
const posterFiles = clips.map((_, i) => n(clips, i, "poster", "jpg"));
const format = item.kind === "reel" || clips.length ? "REEL" : photos.length > 1 ? "CAROUSEL" : "PHOTO";

const yaml = [
  "---",
  `slug: ${slug}`,
  `date: ${item.date}`,
  `format: ${format}`,
  `category: ${JSON.stringify(category)}`,
  photoFiles.length ? "images:" : null,
  ...photoFiles.map((f) => `  - src: ./${f}\n    alt: "TODO describe the image"`),
  clipFiles.length ? "videos:" : null,
  ...clipFiles.map((f, i) => `  - src: ./${f}\n    poster: ./${posterFiles[i]}`),
  "source:",
  "  platform: instagram",
  `  url: ${PROFILE_URL}`,
  "---",
]
  .filter((l) => l !== null)
  .join("\n");
const body = captionToMarkdown(item.caption) || "TODO: write a caption.";
const file = `${yaml}\n\n${body}\n`;

if (args.includes("--dry-run")) {
  process.stdout.write(`// ${dir}/index.md\n${file}`);
  process.exit(0);
}

mkdirSync(dir, { recursive: true });
photos.forEach((m, i) => copyFileSync(join(root, m), join(dir, photoFiles[i])));
clips.forEach((m, i) => {
  copyFileSync(join(root, m), join(dir, clipFiles[i]));
  execFileSync("ffmpeg", ["-v", "error", "-y", "-i", join(dir, clipFiles[i]), "-frames:v", "1", "-q:v", "3", join(dir, posterFiles[i])]);
});
writeFileSync(`${dir}/index.md`, file);
console.log(`✓ Created ${dir}/ (${[...photoFiles, ...clipFiles, ...posterFiles].join(", ")})`);
if (photoFiles.length) console.log("  Fill in the image alt text.");
if (category === "TODO") console.log("  Set the category.");
