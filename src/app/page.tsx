import {
  AcademicCapIcon,
  BookOpenIcon,
  DocumentTextIcon,
  LanguageIcon,
  PuzzlePieceIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { getCategories } from "@/components/CourseList";

const kbdClassName =
  "border border-neutral-400 px-1.5 font-mono text-xs dark:border-neutral-600";

const tileLetters = ["é", "à", "ç", "ê", "œ"];

// Keyed by content folder; a category not listed here gets the generic icon.
const categoryIcons: Record<string, typeof DocumentTextIcon> = {
  vocabulaire: BookOpenIcon,
  grammaire: PuzzlePieceIcon,
  examens: AcademicCapIcon,
  anglophones: LanguageIcon,
};

function CategoryIcon({ slug }: { slug: string }) {
  const Icon = categoryIcons[slug] ?? DocumentTextIcon;
  return (
    <span className="flex size-10 items-center justify-center bg-neutral-950 text-white dark:bg-neutral-50 dark:text-black">
      <Icon className="size-6" />
    </span>
  );
}

export default async function Home() {
  // Built from the content folders, like the sidebar, so a new category or
  // course shows up here without touching this page.
  const categories = (await getCategories()).filter((cat) => !cat.isRoot);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-16 px-4 py-16 sm:py-24">
      <section className="flex flex-col items-center gap-4 text-center">
        <div aria-hidden="true" className="mb-2 flex gap-2">
          {tileLetters.map((letter) => (
            <span
              key={letter}
              className="flex size-12 items-center justify-center border border-neutral-950 text-2xl font-bold odd:-rotate-3 even:rotate-3 nth-3:bg-neutral-950 nth-3:text-white sm:size-14 sm:text-3xl dark:border-neutral-50 dark:nth-3:bg-neutral-50 dark:nth-3:text-black"
            >
              {letter}
            </span>
          ))}
        </div>
        <p className="px-4 font-medium tracking-wide text-neutral-600 uppercase dark:text-neutral-400">
          Bonjour et bienvenue sur
        </p>
        <h1 className="px-4 text-5xl leading-none font-extrabold tracking-tighter uppercase sm:text-7xl">
          La langue française
        </h1>
        <p className="max-w-xl px-4 text-lg text-neutral-700 dark:text-neutral-300">
          Des cours clairs pour comprendre le français, éviter ses pièges et
          réussir le DELF B2.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/cours/bienvenue"
            className="bg-neutral-950 px-5 py-2.5 text-white transition-colors hover:bg-neutral-800 dark:bg-neutral-50 dark:text-black dark:hover:bg-neutral-200"
          >
            Commencer
          </Link>
          <Link
            href="/cours/ressources"
            className="border border-neutral-950 px-5 py-2.5 transition-colors hover:bg-neutral-100 dark:border-neutral-50 dark:hover:bg-neutral-800"
          >
            Ressources
          </Link>
        </div>
        <p className="px-4 text-sm text-neutral-600 dark:text-neutral-400">
          Appuyez sur <kbd className={kbdClassName}>R</kbd> pour rechercher et
          sur <kbd className={kbdClassName}>N</kbd> pour prendre des notes.
        </p>
      </section>
      <section aria-label="Cours" className="grid gap-4 sm:grid-cols-2">
        {categories.map((cat) => (
          <div
            key={cat.slug}
            className="flex flex-col gap-3 border border-neutral-200 p-6 dark:border-neutral-800"
          >
            <div className="flex items-start justify-between gap-4">
              <CategoryIcon slug={cat.slug} />
              <span className="text-sm text-nowrap text-neutral-600 dark:text-neutral-400">
                {cat.posts.length} cours
              </span>
            </div>
            <h2 className="mt-2 font-bold uppercase">
              {cat.title ?? cat.slug}
            </h2>
            {cat.description && (
              <p className="text-neutral-700 dark:text-neutral-300">
                {cat.description}
              </p>
            )}
            <ul className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-2 text-sm">
              {cat.posts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/cours/${cat.slug}/${post.slug}`}
                    className="underline underline-offset-4 hover:no-underline"
                  >
                    {post.metadata?.shortTitle ||
                      post.metadata?.title ||
                      post.slug}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <figure className="flex flex-col items-center gap-2 text-center">
        <blockquote className="max-w-xl text-lg font-medium">
          « Il est interdit de pleurer à cause de la langue française. »
        </blockquote>
        <figcaption className="text-sm text-neutral-600 dark:text-neutral-400">
          — Un enseignant,{" "}
          <a
            href="https://www.youtube.com/watch?v=bKHKnRnL2m8&t=102"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:no-underline"
          >
            Rad (Radio-Canada)
          </a>
        </figcaption>
      </figure>
    </div>
  );
}
