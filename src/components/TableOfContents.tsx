import type { Heading } from "@/lib/content";

export default function TableOfContents({ items }: { items: Heading[] }) {
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
            <a
              href={`#${item.id}`}
              className="transition-colors hover:text-neutral-950 dark:hover:text-white"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
