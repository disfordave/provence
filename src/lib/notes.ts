const STORAGE_KEY = "notes";

const listeners = new Set<() => void>();

// Set when the browser refuses to store the note (private browsing, full
// quota), so what was typed stays on screen for the rest of the visit.
let unsaved: string | null = null;

export function readNote(): string {
  if (unsaved !== null) {
    return unsaved;
  }

  try {
    return localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

export function writeNote(note: string) {
  try {
    localStorage.setItem(STORAGE_KEY, note);
    unsaved = null;
  } catch {
    unsaved = note;
  }

  for (const listener of listeners) {
    listener();
  }
}

// The `storage` event only fires in the other tabs, so a note typed in one tab
// reaches every open tab instead of being overwritten by a stale copy.
export function subscribeToNote(onStoreChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    // A null key means the whole storage was cleared.
    if (event.key === STORAGE_KEY || event.key === null) {
      onStoreChange();
    }
  };

  listeners.add(onStoreChange);
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStorage);
  };
}
