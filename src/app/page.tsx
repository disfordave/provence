import Footer from "@/components/Footer";
import Logo from "@/components/Logo";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="flex h-full flex-col items-center justify-center gap-2 px-4 sm:gap-4">
        <h1 className="text-center text-2xl leading-none font-extrabold tracking-tighter text-nowrap uppercase sm:text-4xl">
          Bonjour et <br />
          bienvenue sur <br />
          <span className="font-extrabold">La langue française</span>
        </h1>
        <Link
          href="/cours/bienvenue"
          className="rounded-full bg-neutral-950 px-4 py-2 text-nowrap text-white transition-colors hover:bg-neutral-800 dark:bg-neutral-50 dark:text-black dark:hover:bg-neutral-200"
        >
          Apprendre le français
        </Link>
        <p className="text-center text-base font-normal sm:text-lg">
          Ce site est en cours de développement.
          <br /> Vous pouvez accéder au site via les liens ci-dessous.
        </p>
        <div className="text-center text-base sm:text-lg">
          <p className="max-w-md text-zinc-600 dark:text-zinc-400">
            <a
              href="https://francais.hsw.is"

              className="underline hover:no-underline"
            >
              francais.hsw.is
            </a>
          </p>
          <p className="max-w-md text-zinc-600 dark:text-zinc-400">
            <a
              href="https://fr.hsw.is"

              className="underline hover:no-underline"
            >
              fr.hsw.is
            </a>
          </p>
        </div>
        <div>
          <a
            href="https://git.hsw.is/provence"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 flex flex-col items-center gap-0.5 transition-opacity hover:opacity-75"
            title="Contribuer ou signaler un problème sur GitHub"
            aria-label="Contribuer ou signaler un problème sur GitHub"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              className="bi bi-github size-8"
              viewBox="0 0 16 16"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
            </svg>
          </a>
        </div>
      </div>
    </>
  );
}
