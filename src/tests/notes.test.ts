import { afterEach, expect, test, vi } from "vitest";

// Just enough of the Web Storage API for the note store.
function createStorage({ full = false } = {}) {
  const items = new Map<string, string>();

  return {
    getItem: (key: string) => items.get(key) ?? null,
    setItem: (key: string, value: string) => {
      if (full) throw new Error("QuotaExceededError");
      items.set(key, value);
    },
  };
}

// The store keeps module state, so every test starts from a fresh copy.
async function loadStore(storage = createStorage()) {
  vi.resetModules();
  vi.stubGlobal("localStorage", storage);
  vi.stubGlobal("window", new EventTarget());
  return import("@/lib/notes");
}

afterEach(() => {
  vi.unstubAllGlobals();
});

test("starts empty and reads back what was written", async () => {
  const { readNote, writeNote } = await loadStore();

  expect(readNote()).toBe("");
  writeNote("assister à = to attend");
  expect(readNote()).toBe("assister à = to attend");
});

test("tells subscribers about every write until they unsubscribe", async () => {
  const { subscribeToNote, writeNote } = await loadStore();
  const listener = vi.fn();

  const unsubscribe = subscribeToNote(listener);
  writeNote("a");
  unsubscribe();
  writeNote("b");

  expect(listener).toHaveBeenCalledTimes(1);
});

test("picks up a note saved in another tab, and only that key", async () => {
  const { subscribeToNote } = await loadStore();
  const listener = vi.fn();

  subscribeToNote(listener);
  window.dispatchEvent(Object.assign(new Event("storage"), { key: "notes" }));
  window.dispatchEvent(Object.assign(new Event("storage"), { key: "theme" }));

  expect(listener).toHaveBeenCalledTimes(1);
});

test("keeps the note in memory when storage refuses it", async () => {
  const { readNote, writeNote } = await loadStore(
    createStorage({ full: true }),
  );

  writeNote("pas de stockage");
  expect(readNote()).toBe("pas de stockage");
});
