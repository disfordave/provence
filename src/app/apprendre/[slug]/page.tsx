import { notFound } from "next/navigation";
import { Metadata } from "next";
import TableOfContents from "@/components/TableOfContents";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let Post: React.ComponentType;

  try {
    ({ default: Post } = await import(`@/content/${slug}.mdx`));
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message.includes("Cannot find module") ||
        error.message.includes("Module not found"))
    ) {
      notFound();
    }

    throw error;
  }

  return (
    <>
      <div className="p-4 lg:grid lg:grid-cols-4 lg:gap-4">
        <div className="hidden lg:col-span-1 lg:block" aria-hidden="true"></div>
        <article
          data-mdx-content
          className="prose prose-neutral dark:prose-invert prose-blockquote:font-medium prose-blockquote:not-italic prose-blockquote:prose-p:before:content-none prose-blockquote:prose-p:after:content-none prose-a:hover:no-underline col-span-2 mx-auto lg:max-w-full"
        >
          <Post />
        </article>
        <div className="hidden rounded-2xl border border-neutral-200 p-4 sm:sticky sm:top-4 sm:h-fit sm:max-h-[75vh] sm:overflow-y-auto lg:col-span-1 lg:block dark:border-neutral-800">
          <TableOfContents />
        </div>
      </div>
    </>
  );
}

export const metadata: Metadata = {
  title: "Bienvenue sur la langue française",
  description: "Apprendre le français de manière interactive et efficace",
};
