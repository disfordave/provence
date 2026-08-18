import { Article } from "@/app/cours/[slug]/page";
import { readdir } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";

type Post = {
  slug: string;
  metadata: Article["metadata"];
};

export async function getPosts(): Promise<Post[]> {
  "use server";

  const contentDir = path.join(process.cwd(), "src", "content");

  const files = await readdir(contentDir, {
    withFileTypes: true,
  });

  const mdxFiles = files.filter(
    (file) => file.isFile() && file.name.endsWith(".mdx"),
  );

  const posts = await Promise.all(
    mdxFiles.map(async (file) => {
      const slug = file.name.replace(/\.mdx$/, "");

      const { metadata } = await import(`../../src/content/${file.name}`);

      return {
        slug,
        metadata: metadata as Article["metadata"],
      };
    }),
  );

  return posts;
}

export default async function CourseList() {
  const posts = await getPosts();

  return (
    <nav aria-label="Cours" className="rounded-2xl">
      <p className="mb-2 text-base font-semibold">Cours</p>
      <ol className="space-y-2 text-sm leading-6 text-neutral-700 dark:text-neutral-300">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/cours/${post.slug}`}
              className="transition-colors hover:text-neutral-950 dark:hover:text-white"
            >
              {post.metadata?.title || post.slug}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
