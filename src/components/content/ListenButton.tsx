"use client";

import { SpeakerWaveIcon, StopIcon } from "@heroicons/react/20/solid";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

// Reading aloud relies on the browser's speech synthesis. The server cannot
// tell whether the browser has it, so the button appears once the page runs.
function subscribe() {
  return () => {};
}

function hasSpeechSynthesis() {
  return "speechSynthesis" in window;
}

function hasSpeechSynthesisOnServer() {
  return false;
}

// Some browsers load their voices late. Without a French voice at hand, the
// language of the sentence still lets the browser choose one.
function findFrenchVoice() {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((voice) => voice.lang === "fr-FR") ??
    voices.find((voice) => voice.lang.startsWith("fr")) ??
    null
  );
}

// Added after each course example by `rehype-examples.mjs`.
export default function ListenButton({ text }: { text: string }) {
  const isSupported = useSyncExternalStore(
    subscribe,
    hasSpeechSynthesis,
    hasSpeechSynthesisOnServer,
  );
  const [isSpeaking, setIsSpeaking] = useState(false);
  // Chrome can drop an utterance that nothing refers to before it ends, and
  // the button would then stay on "Arrêter".
  const utteranceRef = useRef<SpeechSynthesisUtterance>(null);

  // Leaving the page stops the reading.
  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  if (!isSupported) return null;

  function toggle() {
    // One example at a time: a new reading interrupts the current one, whose
    // button resets when its utterance ends.
    window.speechSynthesis.cancel();
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "fr-FR";
    utterance.voice = findFrenchVoice();
    utterance.rate = 0.9;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  }

  const label = isSpeaking ? "Arrêter la lecture" : "Écouter l'exemple";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="ml-1.5 inline-flex p-0.5 align-middle text-neutral-500 transition-colors hover:bg-neutral-200 hover:text-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-white"
    >
      {isSpeaking ? (
        <StopIcon className="size-4" />
      ) : (
        <SpeakerWaveIcon className="size-4" />
      )}
    </button>
  );
}
