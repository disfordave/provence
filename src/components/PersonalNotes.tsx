"use client";

import { PencilSquareIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { readNote, subscribeToNote, writeNote } from "@/lib/notes";
import { useExclusiveOverlay } from "@/lib/overlays";
import { isSingleKeyShortcut } from "@/lib/shortcuts";

// The server has no storage, and the panel starts closed anyway.
function getServerSnapshot() {
  return "";
}

export default function PersonalNotes() {
  const note = useSyncExternalStore(
    subscribeToNote,
    readNote,
    getServerSnapshot,
  );
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useExclusiveOverlay("notes", isOpen, setIsOpen);

  useEffect(() => {
    const panel = panelRef.current;
    const textarea = textareaRef.current;
    if (!isOpen || !panel || !textarea) return;

    // Opening the panel puts the cursor at the end, where a note usually goes on.
    const previous = document.activeElement;
    const end = textarea.value.length;
    textarea.focus();
    textarea.setSelectionRange(end, end);
    textarea.scrollTop = textarea.scrollHeight;

    // Closing hands focus back to whatever had it before, so a shortcut used
    // mid-page does not leave it on the notes button, where Space would reopen
    // the panel. Focus that has moved elsewhere in the meantime stays there.
    return () => {
      const active = document.activeElement;
      if (active && active !== document.body && !panel.contains(active)) return;

      if (previous instanceof HTMLElement && previous !== document.body) {
        previous.focus();
      } else if (active instanceof HTMLElement) {
        active.blur();
      }
    };
  }, [isOpen]);

  // N opens the notes from anywhere on the page. Inside the panel, an n is just
  // typing, so Escape is the way back out.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isSingleKeyShortcut(event, "n")) {
        event.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      {/* Like the other overlays, a tap outside the panel closes it, but without
          a blur: the page has to stay readable while taking notes. */}
      {isOpen && (
        <button
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50"
          aria-hidden="true"
          tabIndex={-1}
        ></button>
      )}
      <section
        ref={panelRef}
        id="personal-notes"
        aria-label="Notes"
        hidden={!isOpen}
        onKeyDown={(event) => {
          // Escape also ends an IME composition, which must not close the panel.
          if (event.key === "Escape" && !event.nativeEvent.isComposing) {
            setIsOpen(false);
          }
        }}
        className="fixed inset-x-4 top-4 z-50 border border-neutral-500/10 bg-neutral-50 p-4 shadow-2xl sm:inset-x-auto sm:top-auto sm:right-8 sm:bottom-40 sm:w-96 lg:bottom-24 dark:bg-neutral-900"
      >
        <label
          htmlFor="personal-notes-text"
          className="mb-2 block text-base font-bold"
        >
          Notes
        </label>
        <textarea
          id="personal-notes-text"
          ref={textareaRef}
          value={note}
          onChange={(event) => writeNote(event.target.value)}
          placeholder="Un mot, une règle, une phrase entendue..."
          className="block h-64 w-full resize-y border-2 border-transparent bg-white p-3 text-sm leading-6 transition-colors focus:border-black focus:outline-0 dark:bg-neutral-950 dark:focus:border-white"
        />
        <p className="mt-2 text-xs text-neutral-500">
          Enregistré automatiquement dans ce navigateur.
          <span className="hidden lg:inline">
            {" "}
            Raccourcis : N pour ouvrir, Échap pour fermer.
          </span>
        </p>
      </section>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-8 bottom-24 z-50 bg-neutral-950 p-3 text-white shadow-2xl transition-colors hover:bg-neutral-800 lg:bottom-8 dark:bg-neutral-50 dark:text-black dark:hover:bg-neutral-200"
        aria-expanded={isOpen}
        aria-controls="personal-notes"
        aria-label={isOpen ? "Fermer les notes" : "Ouvrir les notes"}
        aria-keyshortcuts="N"
        title="Notes (N)"
      >
        {isOpen ? (
          <XMarkIcon className="size-6" />
        ) : (
          <PencilSquareIcon className="size-6" />
        )}
      </button>
    </>
  );
}
