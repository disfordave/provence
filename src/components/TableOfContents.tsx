"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";

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

function getHeadings(pathname: string): TocItem[] {
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

  const key = [
    pathname,
    ...headings.map(
      (heading) => `${heading.level}:${heading.id}:${heading.text}`,
    ),
  ].join("|");

  if (key !== snapshotKey) {
    snapshotKey = key;
    snapshot = headings;
  }

  return snapshot;
}

function subscribe(onStoreChange: () => void) {
  const article = document.querySelector("[data-mdx-content]");
  const target = article?.parentElement ?? document.body;

  const observer = new MutationObserver(onStoreChange);
  observer.observe(target, { childList: true, subtree: true });

  return () => observer.disconnect();
}

// The server has no DOM to read, so it renders nothing and the headings appear
// once the client takes over.
function getServerSnapshot(): TocItem[] {
  return NO_HEADINGS;
}

const ACTIVE_BAND = 0.3;

function useActiveId(items: TocItem[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((heading) => heading !== null);

    if (headings.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      () => {
        const limit = window.innerHeight * ACTIVE_BAND;
        const passed = headings.filter(
          (heading) => heading.getBoundingClientRect().top <= limit,
        );

        setActiveId((passed.at(-1) ?? headings[0]).id);
      },
      { rootMargin: `0px 0px -${(1 - ACTIVE_BAND) * 100}% 0px` },
    );

    for (const heading of headings) {
      observer.observe(heading);
    }

    return () => observer.disconnect();
  }, [items]);

  return activeId;
}

export default function TableOfContents() {
  const pathname = usePathname();
  const getSnapshot = useCallback(() => getHeadings(pathname), [pathname]);
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const activeId = useActiveId(items);

  if (items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Sommaire" className="rounded-2xl">
      <p className="mb-2 text-base font-bold">Sommaire</p>
      <ol className="space-y-2 text-sm leading-6 text-neutral-700 dark:text-neutral-300">
        {items.map((item) => {
          const isActive = item.id === activeId;

          return (
            <li
              key={item.id}
              className={
                item.level === 3 ? "ml-4" : item.level === 4 ? "ml-8" : ""
              }
            >
              <Link
                href={`#${item.id}`}
                aria-current={isActive ? "location" : undefined}
                className={`transition-colors hover:text-neutral-950 dark:hover:text-white ${
                  isActive
                    ? "font-medium text-neutral-950 underline dark:text-white"
                    : ""
                }`}
              >
                {item.text}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
