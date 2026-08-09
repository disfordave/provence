import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-1 flex-col items-center justify-between bg-white px-16 py-32 sm:items-start dark:bg-black">
        <div className="flex flex-col items-center gap-1 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl leading-10 font-semibold tracking-tight text-black dark:text-zinc-50">
            Apprendre le français
          </h1>
          <p className="max-w-md text-lg">
            Ce site est en cours de développement. Vous pouvez accéder au site
            via les liens ci-dessous.
          </p>
          <div>
            <p className="max-w-md text-lg text-zinc-600 dark:text-zinc-400">
              <a
                href="https://francais.hsw.is"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:no-underline"
              >
                francais.hsw.is
              </a>
              <span> ou </span>
              <a
                href="https://fr.hsw.is"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:no-underline"
              >
                fr.hsw.is
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
