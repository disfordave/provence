"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";
import {
  ComputerDesktopIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/20/solid";

type Theme = "light" | "dark" | "auto";

const STORAGE_KEY = "theme";

const listeners = new Set<() => void>();

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  // Keep other tabs in sync.
  window.addEventListener("storage", onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getSnapshot(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "light" || stored === "dark" ? stored : "auto";
}

function getServerSnapshot(): Theme {
  return "auto";
}

function storeTheme(theme: Theme) {
  if (theme === "auto") {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY, theme);
  }
  listeners.forEach((listener) => listener());
}

export default function ThemeButton() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Layout effect, not effect: it runs before paint, so the dev-mode Strict Mode
  // remount (which clears the class the inline script set) never flashes.
  useLayoutEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      const effectiveTheme =
        theme === "auto" ? (mediaQuery.matches ? "dark" : "light") : theme;

      document.documentElement.classList.toggle(
        "dark",
        effectiveTheme === "dark",
      );
    };

    applyTheme();

    if (theme === "auto") {
      mediaQuery.addEventListener("change", applyTheme);
      return () => mediaQuery.removeEventListener("change", applyTheme);
    }
  }, [theme]);

  const themes = [
    {
      value: "auto",
      label: "Auto",
      icon: <ComputerDesktopIcon className="size-4.5" />,
    },
    {
      value: "light",
      label: "Clair",
      icon: <SunIcon className="size-4.5" />,
    },
    {
      value: "dark",
      label: "Sombre",
      icon: <MoonIcon className="size-4.5" />,
    },
  ];

  return (
    <>
      <div className="relative flex h-full max-w-fit items-center justify-center gap-0 rounded-full border-2 border-transparent bg-white dark:bg-neutral-900">
        <div
          className={`absolute top-0 left-0 z-2 h-full w-1/3 rounded-full bg-neutral-900 transition-transform duration-300 dark:bg-white ${
            theme === themes[0].value
              ? "translate-x-0"
              : theme === themes[1].value
                ? "translate-x-full"
                : "translate-x-[200%]"
          }`}
        ></div>
        {themes.map((t) => (
          <div className="z-4" key={t.value}>
            <button
              onClick={() => storeTheme(t.value as Theme)}
              title={t.label}
              className={`flex aspect-square size-full items-center justify-center rounded-full p-1.5 transition-colors duration-300 ${
                t.value === theme
                  ? "text-white dark:text-neutral-950"
                  : "dark:text-white"
              }`}
            >
              {t.icon}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
