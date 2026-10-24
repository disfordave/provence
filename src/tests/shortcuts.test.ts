import { expect, test } from "vitest";
import { isSingleKeyShortcut } from "@/lib/shortcuts";

const page = { isContentEditable: false, closest: () => null };
const field = { isContentEditable: false, closest: () => ({}) };

function keydown(init: Partial<KeyboardEvent> & { target?: object }) {
  return {
    key: "n",
    code: "KeyN",
    metaKey: false,
    ctrlKey: false,
    altKey: false,
    repeat: false,
    isComposing: false,
    target: page,
    ...init,
  } as unknown as KeyboardEvent;
}

test("fires for the letter pressed on the page", () => {
  expect(isSingleKeyShortcut(keydown({}), "n")).toBe(true);
  expect(isSingleKeyShortcut(keydown({ key: "N" }), "n")).toBe(true);
  expect(isSingleKeyShortcut(keydown({}), "r")).toBe(false);
});

test("leaves browser shortcuts and held keys alone", () => {
  expect(isSingleKeyShortcut(keydown({ metaKey: true }), "n")).toBe(false);
  expect(isSingleKeyShortcut(keydown({ ctrlKey: true }), "n")).toBe(false);
  expect(isSingleKeyShortcut(keydown({ altKey: true }), "n")).toBe(false);
  expect(isSingleKeyShortcut(keydown({ repeat: true }), "n")).toBe(false);
});

test("never fires while typing", () => {
  expect(isSingleKeyShortcut(keydown({ target: field }), "n")).toBe(false);
  expect(
    isSingleKeyShortcut(
      keydown({ target: { ...page, isContentEditable: true } }),
      "n",
    ),
  ).toBe(false);
  expect(isSingleKeyShortcut(keydown({ isComposing: true }), "n")).toBe(false);
});

test("follows the keyboard layout", () => {
  // On AZERTY, M sits where QWERTY has the semicolon, and KeyM types a comma.
  expect(
    isSingleKeyShortcut(keydown({ key: "m", code: "Semicolon" }), "m"),
  ).toBe(true);
  expect(isSingleKeyShortcut(keydown({ key: ",", code: "KeyM" }), "m")).toBe(
    false,
  );
});

test("falls back to the physical key for other scripts", () => {
  expect(isSingleKeyShortcut(keydown({ key: "ㅡ", code: "KeyM" }), "m")).toBe(
    true,
  );
  expect(isSingleKeyShortcut(keydown({ key: "é", code: "Digit2" }), "m")).toBe(
    false,
  );
});
