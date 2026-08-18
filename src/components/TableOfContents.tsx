"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

type TocItem = {
  id: string;
  level: number;
  text: string;
};

const NO_HEADINGS: TocItem[] = [];

// The headings only exist in the rendered DOM, so the article is treated as an
// external store. `useSyncExternalStore` compares snapshots by identity, so the
// parsed headings are cached and only replaced when the article really changes.
let snapshot: TocItem[] = NO_HEADINGS;
let snapshotKey = "";

function getHeadings(): TocItem[] {
  const article = document.querySelector("[data-mdx-content]");

  if (!article) {
    return NO_HEADINGS;
  }

  const headings = Array.from(
    article.querySelectorAll<HTMLHeadingElement>("h2, h3, h4"),
  )
    .map((heading) => ({
      id: heading.id,
      level: Number(heading.tagName.slice(1)),
      text: heading.textContent?.trim() ?? "",
    }))
    .filter((heading) => heading.id && heading.text.length > 0);

  const key = headings
    .map((heading) => `${heading.level}:${heading.id}:${heading.text}`)
    .join("|");

  if (key !== snapshotKey) {
    snapshotKey = key;
    snapshot = headings;
  }

  return snapshot;
}

function subscribe(onStoreChange: () => void) {
  const article = document.querySelector("[data-mdx-content]");

  if (!article) {
    return () => {};
  }

  const observer = new MutationObserver(onStoreChange);
  observer.observe(article, { childList: true, subtree: true });

  return () => observer.disconnect();
}

// The server has no DOM to read, so it renders nothing and the headings appear
// once the client takes over.
function getServerSnapshot(): TocItem[] {
  return NO_HEADINGS;
}

export default function TableOfContents() {
  const items = useSyncExternalStore(subscribe, getHeadings, getServerSnapshot);

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
