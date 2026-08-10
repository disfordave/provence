import { Metadata } from "next";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { default: Post } = await import(`@/content/${slug}.mdx`);

  return (
    <article className="prose prose-slate dark:prose-invert mx-auto max-w-3xl px-4 py-4 sm:px-6 lg:py-6">
      <Post />
    </article>
  );
}

export const metadata: Metadata = {
  title: "Bienvenue sur la langue française",
  description: "Apprendre le français de manière interactive et efficace",
};
