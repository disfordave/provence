"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Toggle background scrolling
  useEffect(() => {
    if (isOpen) {
      searchInputRef.current?.focus();
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
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <>
      <div
        className={`fixed inset-0 z-100 backdrop-blur-md ${isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"} flex items-center justify-center transition-opacity`}
      >
        <div className="relative flex h-full w-full justify-center overflow-auto">
          <div
            className={`absolute z-101 h-full w-full`}
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute top-[20vh] z-102 flex w-full max-w-xl flex-col gap-2 p-4">
            <form
              className="flex items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                console.log(searchText);
              }}
            >
              <input
                type={"search"}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full rounded-full border-2 border-neutral-500/20 bg-white px-4 py-2 shadow-2xl transition-colors focus:border-black focus:outline-0 dark:bg-neutral-900 dark:focus:border-white"
                placeholder="Rechercher..."
                ref={searchInputRef}
              />
              <button
                type="submit"
                className="rounded-full border border-transparent bg-neutral-950 p-2.5 text-nowrap text-white shadow-2xl transition-colors hover:bg-neutral-800 dark:bg-neutral-50 dark:text-black dark:hover:bg-neutral-200"
              >
                <MagnifyingGlassIcon className="size-5" />
              </button>
            </form>
            <div
              onClick={(event) => {
                const link = (event.target as HTMLElement).closest("a");
                if (!link) return;
                setIsOpen(false);
              }}
              className="rounded-2xl border-2 border-neutral-500/20 bg-white p-4 shadow-2xl dark:bg-neutral-900"
            >
              <ul>
                <li>
                  <Link href={"#"}>Result</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <button onClick={() => setIsOpen(true)} className="flex gap-2">
        <div className="text hidden w-48 rounded-full border-2 border-transparent bg-white px-2 py-0.75 text-left transition-colors focus:border-black focus:outline-0 lg:block dark:bg-neutral-900 dark:focus:border-white">
          <span className="opacity-60">Rechercher...</span>
        </div>
        <div className="rounded-full border border-transparent bg-neutral-950 p-1.5 text-nowrap text-white transition-colors hover:bg-neutral-800 dark:bg-neutral-50 dark:text-black dark:hover:bg-neutral-200">
          <MagnifyingGlassIcon className="size-5" />
        </div>
      </button>
    </>
  );
}
