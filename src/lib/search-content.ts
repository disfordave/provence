import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import GithubSlugger from "github-slugger";
import type { Article } from "@/app/cours/[...slug]/page";
import type { SearchEntry } from "@/lib/search";

const CONTENT_DIR = path.join(process.cwd(), "src", "content");

const HEADING = /^(#{1,6})\s+(.*)$/;

// Turns MDX into the plain text a reader actually sees, so module syntax and
// markup never show up in a snippet or match a query.
function plain(mdx: string): string {
  return mdx
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/-{3,}/g, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_`>|#]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// One entry per h2-h4, matching the headings `TableOfContents` lists, so a
// result can link straight to the section instead of the top of the article.
export function parseArticle(
  slug: string,
  title: string,
  source: string,
): SearchEntry[] {
  const slugger = new GithubSlugger();
  const body = source
    .replace(/^export const [\s\S]*?^};$/gm, "")
    .replace(/^import .*$/gm, "")
    .replace(/```[\s\S]*?```/g, "");

  const entries: SearchEntry[] = [];
  // Indexed by heading depth: h2 at 0, h3 at 1, h4 at 2.
  const trail: string[] = [];
  let current = { href: `/cours/${slug}`, title, headings: [] as string[] };
  let chunk: string[] = [];

  const flush = () => {
    const text = plain(chunk.join("\n"));
    if (text || current.headings.length > 0) {
      entries.push({ ...current, text });
    }
    chunk = [];
  };

  for (const line of body.split("\n")) {
    const match = HEADING.exec(line);

    if (!match) {
      chunk.push(line);
      continue;
    }

    const level = match[1].length;
    const heading = plain(match[2]);
    // `rehype-slug` slugs every heading, so each one has to consume a slug here
    // too, otherwise repeated headings get different numbered suffixes.
    const id = slugger.slug(heading);

    // The h1 only repeats the article title, which is already its own field.
    if (level === 1) {
      continue;
    }

    // Anything deeper than the table of contents stays part of its section.
    if (level > 4) {
      chunk.push(heading);
      continue;
    }

    // A heading closes every section deeper than itself, so the trail is
    // truncated to this level before the new heading joins it.
    trail.length = Math.min(trail.length, level - 2);
    trail.push(heading);

    flush();
    current = { href: `/cours/${slug}#${id}`, title, headings: [...trail] };
  }

  flush();

  return entries;
}

// The MDX is compiled into the bundle, so the searchable text has to be read
// from the source files. `outputFileTracingIncludes` ships them with the build.
export async function buildSearchIndex(): Promise<SearchEntry[]> {
  const files = await readdir(CONTENT_DIR, { recursive: true });

  const articles = await Promise.all(
    files
      .filter((file) => file.endsWith(".mdx"))
      .map(async (file) => {
        const slug = file
          .replace(/\.mdx$/, "")
          .split(path.sep)
          .join("/");
        const source = await readFile(path.join(CONTENT_DIR, file), "utf8");
        const { metadata } = (await import(`@/content/${slug}.mdx`)) as Article;

        return parseArticle(
          slug,
          metadata?.shortTitle ?? metadata?.title ?? slug,
          source,
        );
      }),
  );

  return articles.flat();
}
