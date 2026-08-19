"use client";

import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";

export default function InteractiveSidebarMenu({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  // Toggle background scrolling
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape and return focus to the toggle button
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        toggleButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-30 block lg:hidden ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden="true" // Hides the blank backdrop from screen reader clutter
        tabIndex={-1}
      ></button>
      <div
        className={`fixed inset-x-4 inset-y-4 z-40 block max-w-96 overflow-auto bg-neutral-50/25 p-6 shadow-xl backdrop-blur-xl lg:hidden dark:bg-neutral-950/25 ${isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"} rounded-2xl border border-neutral-500/25 transition-all duration-300`}
        aria-label="Menu latéral"
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        {children}
        <div className="h-12" aria-hidden="true"></div>
      </div>

      <div className="">
        <button
          ref={toggleButtonRef}
          onClick={() => setIsOpen(!isOpen)}
          className="fixed right-8 bottom-8 z-50 block rounded-full bg-neutral-950 p-3 text-nowrap text-white shadow-xl transition-colors hover:bg-neutral-800 lg:hidden dark:bg-neutral-50 dark:text-black dark:hover:bg-neutral-200"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {isOpen ? (
            <XMarkIcon className="size-6" />
          ) : (
            <Bars3Icon className="size-6" />
          )}
        </button>
      </div>
    </>
  );
}
