import type { Article } from "@/app/cours/[...slug]/page";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { Fragment } from "react/jsx-runtime";
import CourseListItem from "./CourseListItem";

export type Post = {
  slug: string;
  metadata: Article["metadata"];
};

export type Category = {
  isRoot: boolean;
  slug: string;
  posts: Post[];
};

const joinedPath = [process.cwd(), "src", "content"];

export async function getPosts(categorySlug?: string): Promise<Post[]> {
  const contentDir = path.join(...joinedPath, categorySlug ?? "");

  const files = await readdir(contentDir, {
    withFileTypes: true,
  });

  const mdxFiles = files.filter(
    (file) => file.isFile() && file.name.endsWith(".mdx"),
  );

  const posts = await Promise.all(
    mdxFiles.map(async (file) => {
      const slug = file.name.replace(/\.mdx$/, "");

      const subFolder = categorySlug ? `${categorySlug}/` : "";
      const { metadata } = await import(
        `../../src/content/${subFolder}${file.name}`
      );

      return {
        slug,
        metadata: metadata as Article["metadata"],
      };
    }),
  );

  return posts;
}

export async function getCategories(): Promise<Category[]> {
  const contentDir = path.join(...joinedPath);

  const files = await readdir(contentDir, {
    withFileTypes: true,
  });

  const posts = await getPosts();

  const rootPosts = {
    isRoot: true,
    slug: "root-content",
    posts: posts,
  };

  const categories = files.filter((file) => file.isDirectory());

  const categoryData = await Promise.all(
    categories.map(async (cat) => {
      const posts = await getPosts(cat.name);
      return {
        isRoot: false,
        slug: cat.name,
        posts: posts,
      };
    }),
  );

  return [rootPosts, ...categoryData];
}

export default async function CourseList() {
  const cats = await getCategories();

  return (
    <nav aria-label="Cours" className="rounded-2xl">
      <p className="mb-2 text-base font-bold">Cours</p>
      <ul className="space-y-2 text-sm leading-6 text-neutral-700 dark:text-neutral-300">
        {cats.map((cat) => (
          <Fragment key={cat.slug}>
            {cat.isRoot ? (
              cat.posts.map((post) => (
                <li key={post.slug}>
                  <CourseListItem post={post} cat={cat} />
                </li>
              ))
            ) : (
              <li key={cat.slug}>
                <p className="mb-2 font-bold uppercase">{cat.slug}</p>
                <ul>
                  {cat.posts.map((post) => (
                    <li key={post.slug} className="mb-2">
                      <CourseListItem post={post} cat={cat} />
                    </li>
                  ))}
                </ul>
              </li>
            )}
          </Fragment>
        ))}
      </ul>
    </nav>
  );
}
