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
  isVideo: boolean;
  /** Card chips: year, format, category, then any extra tags. */
  tags: string[];
  /** Card and hero image URL (optimized when local). */
  thumb: string;
}

const TITLE_MAX = 80;

/** First line of the Markdown body, with Markdown syntax stripped, for untitled posts. */
function titleFromBody(body: string | undefined): string {
  const line = (body ?? "")
    .split("\n")
    .map((l) => l.trim())
    .find((l) => l.length > 0);
  if (!line) return "Untitled";
  const plain = line
    .replace(/^[#>\-*\s]+/, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`]/g, "")
    .trim();
  return plain.length > TITLE_MAX ? plain.slice(0, TITLE_MAX - 1).trimEnd() + "…" : plain;
}

async function thumbFor(data: CollectionEntry<"journal">["data"]): Promise<string> {
  const local = data.cover ?? data.images[0]?.src;
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
      return {
        entry,
        slug: entry.id,
        id: `[${String(i + 1).padStart(3, "0")}]`,
        title: data.title ?? titleFromBody(entry.body),
        subtitle: data.subtitle,
        date: data.date,
        isVideo: Boolean(data.youtube),
        tags: [String(data.date.getUTCFullYear()), data.format, data.category, ...data.tags],
        thumb: await thumbFor(data),
      };
    }),
  );

  return items.reverse();
}
