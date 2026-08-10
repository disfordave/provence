import { notFound } from "next/navigation";
import { Metadata } from "next";
import TableOfContents from "@/components/TableOfContents";
import { getContentSlugs, getOutline } from "@/lib/content";

// Every document is known at build time, so anything else is a 404 without
// ever invoking the server.
export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getContentSlugs();

  return slugs.map((slug) => ({ slug }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const outline = await getOutline(slug);

  if (!outline) {
    notFound();
  }

  const { default: Post } = await import(`@/content/${slug}.mdx`);

  return (
    <div className="p-4 lg:grid lg:grid-cols-4 lg:gap-4">
      <div className="hidden lg:col-span-1 lg:block" aria-hidden="true"></div>
      <article
        data-mdx-content
        className="prose prose-neutral dark:prose-invert prose-blockquote:font-medium prose-blockquote:not-italic prose-blockquote:prose-p:before:content-none prose-blockquote:prose-p:after:content-none prose-a:hover:no-underline col-span-2 mx-auto lg:mx-0 lg:max-w-full"
      >
        <Post />
      </article>
      {outline.headings.length > 0 && (
        <div className="hidden rounded-2xl border border-neutral-200 p-4 sm:sticky sm:top-4 sm:h-fit sm:max-h-[75vh] sm:overflow-y-auto lg:col-span-1 lg:block dark:border-neutral-800">
          <TableOfContents items={outline.headings} />
        </div>
      )}
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const outline = await getOutline(slug);

  // The root layout's title template appends the site name; `absolute` opts out
  // of it so the fallback isn't "La langue française | La langue française".
  if (!outline?.title) {
    return { title: { absolute: "La langue française" } };
  }

  return { title: outline.title };
}
