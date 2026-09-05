"use client";

import { usePathname } from "next/navigation";
import { Category, Post } from "./CourseList";
import Link from "next/link";

export default function CourseListItem({
  cat,
  post,
}: {
  cat: Category;
  post: Post;
}) {
  const pathname = usePathname();
  const getSlug = (): string => {
    if (cat.isRoot) {
      return `/cours/${post.slug}`;
    }
    return `/cours/${cat.slug}/${post.slug}`;
  };
  return (
    <>
      <Link
        href={getSlug()}
        className={`transition-colors ${pathname === getSlug() ? "font-medium text-neutral-950 underline dark:text-white" : "hover:text-neutral-950 dark:hover:text-white"}`}
      >
        {post.metadata?.shortTitle || post.metadata?.title || post.slug}
      </Link>
    </>
  );
}
