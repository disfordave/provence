import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";
import { getCategories } from "@/components/CourseList";

// `@types/mdx` only declares the default export, so the metadata each article
// exports has to be described here.
export type Article = {
  default: React.ComponentType;
  metadata?: { title?: string; shortTitle?: string; description?: string };
};

// The MDX modules are bundled at build time, so everything about an article
// must come from its module rather than from the filesystem.
async function loadArticle(slug: string[]): Promise<Article | null> {
  try {
    return (await import(`@/content/${slug.join("/")}.mdx`)) as Article;
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message.includes("Cannot find module") ||
        error.message.includes("Module not found"))
    ) {
      return null;
    }

    throw error;
  }
}

export const dynamicParams = false;

export async function generateStaticParams(): Promise<{ slug: string[] }[]> {
  const cats = await getCategories();

  return cats.flatMap((cat) =>
    cat.posts.map((post) => ({
      slug: cat.isRoot ? [post.slug] : [cat.slug, post.slug],
    })),
  );
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const article = await loadArticle(slug);

  if (!article) {
    notFound();
  }

  const Post = article.default;

  return (
    <>
      <article
        data-mdx-content
        className="prose prose-neutral dark:prose-invert prose-blockquote:font-medium prose-blockquote:not-italic prose-blockquote:prose-p:before:content-none prose-blockquote:prose-p:after:content-none prose-a:hover:no-underline prose-table:m-0 prose-table:text-nowrap col-span-2 mx-auto border-neutral-100 p-4 sm:p-6 lg:mx-0 lg:max-w-full lg:border-x dark:border-neutral-800"
      >
        <Post />
      </article>
    </>
  );
}

export async function generateMetadata(
  {
    params,
  }: {
    params: Promise<{ slug: string[] }>;
  },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await params;
  const article = await loadArticle(slug);
  const articleTitle = article?.metadata?.title?.trim();
  const previousImages = (await parent).openGraph?.images ?? [];

  return {
    title: articleTitle
      ? `${articleTitle} | La langue française`
      : "La langue française",
    description: "Apprendre le français de manière interactive et efficace",
    openGraph: {
      title: articleTitle ? articleTitle : "La langue française",
      description: "Apprendre le français de manière interactive et efficace",
      images: previousImages,
    },
  };
}
