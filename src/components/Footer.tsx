import Logo from "@/components/Logo";

export default function Footer() {
  const startYear = 2026;
  const currentYear = new Date().getFullYear();
  return (
    <footer className="p-4 text-center text-base text-zinc-600 dark:text-zinc-400">
      <p>
        &copy; {startYear}
        {currentYear !== startYear ? `-${currentYear}` : ""}{" "}
        <a
          href="https://hsw.is"
          className="hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          HSW.is
        </a>
        , <span className="text-nowrap">Tous droits réservés.</span>
      </p>
    </footer>
  );
}
