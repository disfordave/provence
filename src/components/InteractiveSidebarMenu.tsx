"use client";

import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

export default function InteractiveSidebarMenu({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

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

  return (
    <>
      <button
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-30 block lg:hidden ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden="true" // Hides the blank backdrop from screen reader clutter
        tabIndex={-1}
      ></button>
      <div
        className={`fixed inset-y-0 left-0 z-40 block w-full max-w-96 overflow-auto bg-neutral-50/25 p-8 shadow-xl backdrop-blur-xl lg:hidden dark:bg-neutral-950/25 ${isOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300`}
        aria-label="Sidebar Menu"
        aria-hidden={!isOpen}
      >
        {children}
      </div>

      <div className="">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed right-4 bottom-4 z-50 block rounded-full bg-neutral-950 p-3 text-nowrap text-white shadow-xl transition-colors hover:bg-neutral-800 lg:hidden dark:bg-neutral-50 dark:text-black dark:hover:bg-neutral-200"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close menu" : "Open menu"}
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
