// The letter is read from the character typed, so it follows the keyboard
// layout: M is not where it is on QWERTY on a French AZERTY keyboard. When the
// layout types another script, such as Korean, the physical key stands in.
function typedLetter(event: KeyboardEvent): string | null {
  const key = event.key.toLowerCase();
  if (/^[a-z]$/.test(key)) {
    return key;
  }

  const physical = /^Key([A-Z])$/.exec(event.code);
  if (physical && key.length === 1 && key.charCodeAt(0) > 127) {
    return physical[1].toLowerCase();
  }

  return null;
}

// Single-letter shortcuts, as on GitHub or YouTube. They never fire while
// typing in a field, the search box included.
export function isSingleKeyShortcut(
  event: KeyboardEvent,
  letter: string,
): boolean {
  if (
    event.metaKey ||
    event.ctrlKey ||
    event.altKey ||
    event.repeat ||
    event.isComposing
  ) {
    return false;
  }

  const target = event.target as Partial<HTMLElement> | null;
  if (
    target?.isContentEditable ||
    target?.closest?.("input, textarea, select")
  ) {
    return false;
  }

  return typedLetter(event) === letter;
}
