import { useEffect } from "react";

const OVERLAY_OPEN = "overlay-open";

// Only one overlay (the search or the menu) is open at a time:
// opening one, with a shortcut or a click, closes the others.
export function useExclusiveOverlay(
  name: string,
  isOpen: boolean,
  setIsOpen: (isOpen: boolean) => void,
) {
  useEffect(() => {
    if (isOpen) {
      window.dispatchEvent(new CustomEvent(OVERLAY_OPEN, { detail: name }));
    }
  }, [name, isOpen]);

  useEffect(() => {
    const onOverlayOpen = (event: Event) => {
      if ((event as CustomEvent<string>).detail !== name) {
        setIsOpen(false);
      }
    };
    window.addEventListener(OVERLAY_OPEN, onOverlayOpen);
    return () => window.removeEventListener(OVERLAY_OPEN, onOverlayOpen);
  }, [name, setIsOpen]);
}
