import { getCollection, type CollectionEntry } from "astro:content";
import { getImage } from "astro:assets";

export interface JournalItem {
  entry: CollectionEntry<"journal">;
  slug: string;
  /** Stable, chronological: the oldest entry is [001]. */
  id: string;
  title: string;
  subtitle?: string;
  date: Date;
  /** Has a YouTube embed or a local clip: shows the play badge. */
  isVideo: boolean;
  /** YouTube entries: 2-column, 16:9 card. Reels stay 1-column so vertical clips aren't cropped wide. */
  wide: boolean;
  /** Local clips with built URLs. */
  videos: { url: string; poster?: ImageMetadata }[];
  /** Card chips: year, format, category, then any extra tags. */
  tags: string[];
  /** Card and hero image URL (optimized when local). */
  thumb: string;
}

const TITLE_MAX = 80;

// Local clips beside entries, resolved to built (fingerprinted) URLs.
const clipUrls = import.meta.glob<string>("/src/content/journal/**/*.mp4", {
  query: "?url",
  import: "default",
  eager: true,
});

/**
 * Title for untitled posts: the body's first line as plain text, without hashtags or
 * @ signs, cut at the first sentence end or a word boundary near TITLE_MAX.
 */
function titleFromBody(body: string | undefined): string {
  const line = (body ?? "")
    .split("\n")
    .map((l) => l.trim())
    .find((l) => l.length > 0);
  if (!line) return "Untitled";
  const plain = line
    .replace(/^>\s*/, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\\([_*[\]<>])/g, "$1")
    .replace(/[*`]/g, "")
    .replace(/(^|\s)#[\w.]+/g, " ")
    .replace(/(^|\s)@([\w.]+)/g, "$1$2")
    .replace(/\s+/g, " ")
    .trim();
  const sentence = plain.match(/^.+?[.!?](?=\s|$)/)?.[0] ?? plain;
  if (sentence.length <= TITLE_MAX) return sentence || "Untitled";
  const cut = sentence.slice(0, TITLE_MAX);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:]$/, "") + "…";
}

async function thumbFor(data: CollectionEntry<"journal">["data"]): Promise<string> {
  const local = data.cover ?? data.images[0]?.src ?? data.videos[0]?.poster;
  if (data.cover || (!data.youtube && local)) {
    return (await getImage({ src: local!, width: 1280, format: "webp" })).src;
  }
  if (data.youtube) return `https://i.ytimg.com/vi/${data.youtube}/maxresdefault.jpg`;
  return "";
}

/** All published journal entries, newest first, with stable chronological ids. */
export async function getJournal(): Promise<JournalItem[]> {
  const entries = await getCollection("journal", ({ data }) => !(import.meta.env.PROD && data.draft));
  entries.sort((a, b) => a.data.date.getTime() - b.data.date.getTime() || a.id.localeCompare(b.id));

  const items = await Promise.all(
    entries.map(async (entry, i): Promise<JournalItem> => {
      const { data } = entry;
      const folder = "/" + (entry.filePath ?? "").replace(/\/index\.md$/, "");
      const videos = data.videos.map((v) => {
        const url = clipUrls[`${folder}/${v.src.replace(/^\.\//, "")}`];
        if (!url) throw new Error(`Journal "${entry.id}": video not found: ${v.src}`);
        return { url, poster: v.poster };
      });
      return {
        entry,
        slug: entry.id,
        id: `[${String(i + 1).padStart(3, "0")}]`,
        title: data.title ?? titleFromBody(entry.body),
        subtitle: data.subtitle,
        date: data.date,
        isVideo: Boolean(data.youtube) || videos.length > 0,
        wide: Boolean(data.youtube),
        videos,
        tags: [String(data.date.getUTCFullYear()), data.format, data.category, ...data.tags],
        thumb: await thumbFor(data),
      };
    }),
  );

  return items.reverse();
}
