import { notFound } from "next/navigation";
import { Metadata } from "next";

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
    <article className="prose prose-slate dark:prose-invert prose-blockquote:font-medium prose-blockquote:not-italic prose-blockquote:prose-p:before:content-none prose-blockquote:prose-p:after:content-none mx-auto max-w-3xl px-4 py-4 sm:px-6 lg:py-6">
      <Post />
    </article>
  );
}

export const metadata: Metadata = {
  title: "Bienvenue sur la langue française",
  description: "Apprendre le français de manière interactive et efficace",
};
