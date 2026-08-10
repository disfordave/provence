export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { default: Post } = await import(`@/content/${slug}.mdx`);

  return (
    <article className="prose prose-slate dark:prose-invert mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-24">
      <Post />
    </article>
  );
}

export function generateStaticParams() {
  return [{ slug: "welcome" }];
}

export const dynamicParams = false;
