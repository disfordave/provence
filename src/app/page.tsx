import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="flex h-full flex-col items-center justify-center gap-4 px-4 sm:gap-6">
        <h1 className="text-center text-2xl leading-none font-extrabold tracking-tighter text-nowrap uppercase sm:text-4xl">
          Bonjour et <br />
          bienvenue sur <br />
          <span className="font-extrabold">La langue française</span>
        </h1>
        <Link
          href="/cours/bienvenue"
          className="rounded-full bg-neutral-950 px-4 py-2 text-sm text-nowrap text-white transition-colors hover:bg-neutral-800 sm:text-base dark:bg-neutral-50 dark:text-black dark:hover:bg-neutral-200"
        >
          Apprendre le français
        </Link>
      </div>
    </>
  );
}
