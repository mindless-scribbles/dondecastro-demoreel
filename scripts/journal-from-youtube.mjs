#!/usr/bin/env node
// Scaffold a journal entry from a YouTube URL.
// Usage: node scripts/journal-from-youtube.mjs <youtube-url> [--slug my-slug]

const args = process.argv.slice(2);
if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
  console.error("Usage: node scripts/journal-from-youtube.mjs <youtube-url> [--slug my-slug]");
  process.exit(args.length === 0 ? 1 : 0);
}

const url = args.find((a) => !a.startsWith("--"));
const slugIdx = args.indexOf("--slug");
const slugOverride = slugIdx !== -1 ? args[slugIdx + 1] : null;

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
  const author = oembed.author_name ?? "";

  const candidates = [
    `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`, // 1280x720 if uploader supplied
    `https://i.ytimg.com/vi/${videoId}/sddefault.jpg`,     // 640x480
    `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,     // 480x360
  ];
  let thumb = candidates[candidates.length - 1];
  for (const url of candidates) {
    if (await headOk(url)) {
      thumb = url;
      break;
    }
  }

  const slug = slugOverride ?? kebab(title) ?? videoId;

  const tsTitle = title.replace(/"/g, '\\"');
  const iframeTitle = tsTitle;

  const out = `// Paste into src/data/journalEntries.ts and fill in the TODO fields.
// Source: ${url}
// Channel: ${author}
{
  slug: "${slug}",
  title: "${tsTitle}",
  id: "[TODO]", // e.g. "[001]" — keep stable with sidebar order
  tags: ["TODO_YEAR", "TODO_FORMAT", "TODO_CATEGORY"],
  image: "${thumb}",
  cellClass: "cell-TODO", // e.g. "cell-1" — positional; cell-video overrides width/aspect
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
      title: "${iframeTitle}",
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

  process.stdout.write(out);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
