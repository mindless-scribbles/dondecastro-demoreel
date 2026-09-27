import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// One folder per journal entry: src/content/journal/YYYY-MM-DD-slug/index.md, with that
// entry's photos beside it. The frontmatter `slug` becomes the entry id and its URL
// (/journal/<slug>). The Markdown body is the article or caption.
const journal = defineCollection({
  loader: glob({ pattern: "**/index.md", base: "./src/content/journal" }),
  schema: ({ image }) =>
    z.object({
      /** Optional: untitled posts use the first line of the body. */
      title: z.string().optional(),
      date: z.coerce.date(),
      subtitle: z.string().optional(),
      /** e.g. VIDEO, PHOTO, CAROUSEL */
      format: z.string(),
      /** e.g. RIGGING, TOOLS, ANIM, ANIM/VFX */
      category: z.string(),
      tags: z.array(z.string()).default([]),
      /** YouTube video id; embedded above the article. */
      youtube: z.string().optional(),
      /** Card and hero image. Falls back to the YouTube thumbnail, then the first photo. */
      cover: image().optional(),
      images: z.array(z.object({ src: image(), alt: z.string() })).default([]),
      /** Where this was also posted (e.g. the YouTube or Instagram original). */
      source: z
        .object({ platform: z.enum(["youtube", "instagram"]), url: z.string().url() })
        .optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { journal };
