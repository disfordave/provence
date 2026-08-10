import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import { slugifyText } from "@/lib/slug";

const CONTENT_DIR = path.join(process.cwd(), "src", "content");
const EXTENSION = ".mdx";

/** Heading levels that appear in the table of contents. */
const TOC_MIN_LEVEL = 2;
const TOC_MAX_LEVEL = 4;

export type Heading = {
  id: string;
  level: number;
  text: string;
};

export type Outline = {
  /** Text of the first `#` heading, or `null` when the document has none. */
  title: string | null;
  headings: Heading[];
};

/**
 * Slugs of every document in `src/content`.
 *
 * Only ever called during the build (`generateStaticParams`), so the file
 * system access never reaches the deployed worker.
 */
export const getContentSlugs = cache(async (): Promise<string[]> => {
  const entries = await readdir(CONTENT_DIR, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(EXTENSION))
    .map((entry) => entry.name.slice(0, -EXTENSION.length))
    .sort();
});

/**
 * Title and table of contents for a document, or `null` if the slug is unknown.
 *
 * Validating against `getContentSlugs()` rather than catching a read error also
 * keeps a crafted slug (`../../secrets`) from escaping the content directory.
 */
export const getOutline = cache(
  async (slug: string): Promise<Outline | null> => {
    const slugs = await getContentSlugs();

    if (!slugs.includes(slug)) {
      return null;
    }

    const source = await readFile(
      path.join(CONTENT_DIR, `${slug}${EXTENSION}`),
      "utf8",
    );

    return parseOutline(source);
  },
);

function parseOutline(source: string): Outline {
  const headings: Heading[] = [];
  let title: string | null = null;
  let inFence = false;

  for (const line of source.split(/\r?\n/)) {
    // Ignore `#` lines inside fenced code blocks — they are comments, not headings.
    if (/^\s*(?:```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }

    if (inFence) {
      continue;
    }

    const match = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);

    if (!match) {
      continue;
    }

    const level = match[1].length;
    const text = stripInlineMarkup(match[2]);

    if (!text) {
      continue;
    }

    if (level === 1) {
      title ??= text;
      continue;
    }

    if (level >= TOC_MIN_LEVEL && level <= TOC_MAX_LEVEL) {
      headings.push({ id: slugifyText(text), level, text });
    }
  }

  return { title, headings };
}

/**
 * Reduces a heading to the plain text the browser ends up showing, so the id
 * derived here matches the one the rendered heading gets from its React
 * children (e.g. `2<sup>e</sup> forme` on both sides becomes `2e forme`).
 */
function stripInlineMarkup(text: string): string {
  return text
    .replace(/<[^>]+>/g, "")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/([*_]{1,3})(.+?)\1/g, "$2")
    .replace(/\s+/g, " ")
    .trim();
}
