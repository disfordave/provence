"use client";

import { ArrowUpIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  window.addEventListener("resize", onChange);
  return () => {
    window.removeEventListener("scroll", onChange);
    window.removeEventListener("resize", onChange);
  };
}

// The button only shows once the reader is a screen away from the top.
function isAwayFromTop() {
  return window.scrollY > window.innerHeight;
}

// The server cannot know the scroll position, and a page starts at the top.
function isAwayFromTopOnServer() {
  return false;
}

export default function BackToTop() {
  const isVisible = useSyncExternalStore(
    subscribe,
    isAwayFromTop,
    isAwayFromTopOnServer,
  );
  // Below lg, the course pages keep the bottom corner for the menu button, so
  // this button moves up there. Elsewhere it takes the corner.
  const isAboveMenu = usePathname().startsWith("/cours");

  return (
    <button
      onClick={() => window.scrollTo({ top: 0 })}
      // While hidden, it is out of the tab order and of screen readers too.
      inert={!isVisible}
      aria-label="Retour en haut de la page"
      title="Retour en haut"
      className={`fixed right-8 z-50 bg-neutral-950 p-3 text-white shadow-2xl transition hover:bg-neutral-800 dark:bg-neutral-50 dark:text-black dark:hover:bg-neutral-200 ${isAboveMenu ? "bottom-24 lg:bottom-8" : "bottom-8"} ${isVisible ? "opacity-100" : "pointer-events-none opacity-0"}`}
    >
      <ArrowUpIcon className="size-6" />
    </button>
  );
}
