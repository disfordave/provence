"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type TocItem = {
  id: string;
  level: number;
  text: string;
};

function getHeadings(): TocItem[] {
  const article = document.querySelector("[data-mdx-content]");

  if (!article) {
    return [];
  }

  return Array.from(article.querySelectorAll<HTMLHeadingElement>("h2, h3, h4"))
    .map((heading) => ({
      id: heading.id,
      level: Number(heading.tagName.slice(1)),
      text: heading.textContent?.trim() ?? "",
    }))
    .filter((heading) => heading.id && heading.text.length > 0);
}

export default function TableOfContents() {
  const [items, setItems] = useState<TocItem[]>([]);

  useEffect(() => {
    setItems(getHeadings());
  }, []);

  if (items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Sommaire" className="rounded-2xl">
      <p className="mb-2 text-base font-semibold">Sommaire</p>
      <ol className="space-y-2 text-sm leading-6 text-neutral-700 dark:text-neutral-300">
        {items.map((item) => (
          <li
            key={item.id}
            className={
              item.level === 3 ? "ml-4" : item.level === 4 ? "ml-8" : ""
            }
          >
            <Link
              href={`#${item.id}`}
              className="transition-colors hover:text-neutral-950 dark:hover:text-white"
            >
              {item.text}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
