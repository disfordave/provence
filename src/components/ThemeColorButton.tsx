"use client";

import {
  ComputerDesktopIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/20/solid";

import { ThemeToggle } from "themeflip";

export default function ThemeButton() {
  return (
    <>
      <ThemeToggle
        addDarkClass
        className="relative flex h-full max-w-fit items-center justify-center rounded-full border-2 border-transparent bg-white dark:bg-neutral-900"
        indicatorClassName="
    absolute top-0 left-0 z-0 h-full w-1/3
    rounded-full bg-neutral-900
    transition-transform duration-300
    dark:bg-white
    data-[theme=auto]:translate-x-0
    data-[theme=light]:translate-x-full
    data-[theme=dark]:translate-x-[200%]
  "
        buttonClassName="
    relative z-10 flex aspect-square size-full
    items-center justify-center rounded-full p-1.5
    transition-colors duration-300
  "
        activeButtonClassName="
    text-white dark:text-neutral-950
  "
        system={{
          label: "Auto",
          icon: <ComputerDesktopIcon className="size-5" />,
        }}
        light={{
          label: "Clair",
          icon: <SunIcon className="size-5" />,
        }}
        dark={{
          label: "Sombre",
          icon: <MoonIcon className="size-5" />,
        }}
      />
    </>
  );
}
