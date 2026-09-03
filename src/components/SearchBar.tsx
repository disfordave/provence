"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useRef } from "react";
import { getSearchIndex } from "@/lib/search-index";
import { search, type SearchEntry, type SearchResult } from "@/lib/search";

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [index, setIndex] = useState<SearchEntry[] | null>(null);
  const [error, setError] = useState<unknown>();
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = useMemo(
    () => (index ? search(index, searchText) : []),
    [index, searchText],
  );
  const query = searchText.trim();

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

  // The index is only needed once someone actually searches, so it is fetched
  // on first open rather than shipped with every page.
  useEffect(() => {
    if (!isOpen || index) return;
    let cancelled = false;
    getSearchIndex()
      .then((entries) => {
        if (!cancelled) setIndex(entries);
      })
      .catch((error) => {
        if (!cancelled) setError(error.message || "Recherche indisponible");
      });
    return () => {
      cancelled = true;
    };
  }, [isOpen, index]);

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

  // Open from anywhere with the shortcut readers expect from a search field.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const close = () => {
    setIsOpen(false);
    setSearchText("");
    setActiveIndex(0);
  };

  useEffect(() => {
    listRef.current
      ?.querySelector(`#search-result-${activeIndex}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, results]);

  const goTo = (result: SearchResult | undefined) => {
    if (!result) return;
    close();
    router.push(result.href);
  };

  return (
    <>
      <div
        inert={!isOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Recherche"
        className={`fixed inset-0 z-100 backdrop-blur-md ${isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"} flex items-center justify-center transition-opacity`}
      >
        <div className="relative flex h-full w-full justify-center overflow-auto">
          <div className={`absolute z-101 h-full w-full`} onClick={close}></div>
          <div className="absolute top-[20vh] z-102 flex w-full max-w-xl flex-col gap-2 p-4">
            <form
              className="flex items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                goTo(results[activeIndex]);
              }}
            >
              <input
                type={"search"}
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  // A new query means a new list, so the highlight starts over.
                  setActiveIndex(0);
                }}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    if (results.length === 0) return;
                    setActiveIndex((i) => Math.min(i + 1, results.length - 1));
                  } else if (event.key === "ArrowUp") {
                    event.preventDefault();
                    setActiveIndex((i) => Math.max(i - 1, 0));
                  }
                }}
                role="combobox"
                aria-expanded={query.length > 0}
                aria-controls="search-results"
                aria-activedescendant={
                  results.length > 0
                    ? `search-result-${activeIndex}`
                    : undefined
                }
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
            {query.length > 0 && (
              <div
                onClick={(event) => {
                  const link = (event.target as HTMLElement).closest("a");
                  if (!link) return;
                  close();
                }}
                className="max-h-96 overflow-auto rounded-2xl border-2 border-neutral-500/20 bg-white p-4 shadow-2xl dark:bg-neutral-900"
              >
                {results.length === 0 ? (
                  <p>
                    {error
                      ? `${error}`
                      : index
                        ? "Aucun résultat"
                        : "Chargement..."}
                  </p>
                ) : (
                  <ul
                    id="search-results"
                    role="listbox"
                    className="flex flex-col gap-2"
                    ref={listRef}
                  >
                    {results.map((result, position) => (
                      <li
                        key={result.href}
                        id={`search-result-${position}`}
                        role="option"
                        aria-selected={position === activeIndex}
                        onMouseEnter={() => setActiveIndex(position)}
                        className={`cursor-pointer rounded-lg p-3 transition-colors ${position === activeIndex ? "bg-neutral-100 dark:bg-neutral-800" : ""}`}
                      >
                        <Link
                          href={result.href}
                          className="flex flex-col gap-1"
                        >
                          <span className="leading-tight font-bold">
                            {result.title}
                          </span>
                          {result.headings.join(" › ") && (
                            <span className="leading-tight font-medium">
                              {result.headings.join(" › ")}
                            </span>
                          )}

                          {result.snippet && (
                            <span className="text-sm leading-tight">
                              {result.snippet}
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
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
