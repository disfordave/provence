import { notFound } from "next/navigation";
import { Metadata } from "next";
import TableOfContents from "@/components/TableOfContents";
import CourseList from "@/components/CourseList";
import InteractiveSidebarMenu from "@/components/InteractiveSidebarMenu";

// `@types/mdx` only declares the default export, so the metadata each article
// exports has to be described here.
export type Article = {
  default: React.ComponentType;
  metadata?: { title?: string; shortTitle?: string; description?: string };
};

// The MDX modules are bundled at build time, so everything about an article
// must come from its module rather than from the filesystem.
async function loadArticle(slug: string): Promise<Article | null> {
  try {
    return (await import(`@/content/${slug}.mdx`)) as Article;
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

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await loadArticle(slug);

  if (!article) {
    notFound();
  }

  const Post = article.default;

  return (
    <>
      <div className="p-4 lg:grid lg:grid-cols-4 lg:gap-4">
        <div className="hidden rounded-2xl border border-neutral-500/25 p-4 sm:sticky sm:top-4 sm:h-fit sm:max-h-[75vh] sm:overflow-y-auto lg:col-span-1 lg:block">
          <CourseList />
        </div>
        <article
          data-mdx-content
          className="prose prose-neutral dark:prose-invert prose-blockquote:font-medium prose-blockquote:not-italic prose-blockquote:prose-p:before:content-none prose-blockquote:prose-p:after:content-none prose-a:hover:no-underline prose-table:m-0 prose-table:text-nowrap col-span-2 mx-auto lg:mx-0 lg:max-w-full"
        >
          <Post />
        </article>
        <div className="hidden rounded-2xl border border-neutral-500/25 p-4 sm:sticky sm:top-4 sm:h-fit sm:max-h-[75vh] sm:overflow-y-auto lg:col-span-1 lg:block">
          <TableOfContents />
        </div>
      </div>
      <InteractiveSidebarMenu>
        <CourseList />
        <hr className="my-4 border-neutral-500/25" />
        <TableOfContents />
      </InteractiveSidebarMenu>
    </>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await loadArticle(slug);
  const articleTitle = article?.metadata?.title?.trim();

  return {
    title: articleTitle
      ? `${articleTitle} | La langue française`
      : "La langue française",
    description: "Apprendre le français de manière interactive et efficace",
    openGraph: {
      title: articleTitle ? articleTitle : "La langue française",
      description: "Apprendre le français de manière interactive et efficace",
    },
  };
}
