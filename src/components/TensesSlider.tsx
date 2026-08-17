"use client";

import { useState } from "react";

export default function TensesSlider() {
  const [reference, setReference] = useState<number>(0);
  const [evenement, setEvenement] = useState<number>(0);
  return (
    <>
      <div className="prose-p:m-0 prose-headings:m-0 flex flex-col items-center gap-4 rounded-2xl bg-neutral-100 p-4 dark:bg-neutral-900">
        <p className="text-center text-xl font-black">Les Temps</p>
        <div className="flex w-full flex-col gap-1">
          <p className="text-center leading-tight font-bold">
            Le moment de l'événement
          </p>
          <div className="flex w-full justify-between">
            <div className="flex-1 text-start">Passé</div>
            <p className="text-center font-medium">Maintenant</p>
            <div className="flex-1 text-end">Futur</div>
          </div>
          <input
            type="range"
            min="-3"
            max="3"
            step="1"
            value={evenement}
            onChange={(e) => setEvenement(parseInt(e.target.value))}
            className="w-full appearance-none rounded-full bg-neutral-300 accent-neutral-500 dark:bg-neutral-700"
          />
        </div>
        <div className="flex w-full flex-col gap-1">
          <p className="text-center leading-tight font-bold">
            Le moment de référence
          </p>
          <div className="flex w-full justify-between">
            <div className="flex-1 text-start">Passé</div>
            <p className="text-center font-medium">Maintenant</p>
            <div className="flex-1 text-end">Futur</div>
          </div>
          <input
            type="range"
            min="-3"
            max="3"
            step="1"
            value={reference}
            onChange={(e) => setReference(parseInt(e.target.value))}
            className="w-full appearance-none rounded-full bg-neutral-300 accent-neutral-500 dark:bg-neutral-700"
          />
        </div>
        <p className="text-center text-lg">
          <span className="font-medium text-neutral-600 dark:text-neutral-400">
            Le temps utilisé:{" "}
          </span>{" "}
          <span className="font-bold">{getTense(reference, evenement)}</span>
        </p>
      </div>
    </>
  );
}

function getTense(reference: number, evenement: number): string {
  // R = S: viewpoint is the present
  if (reference === 0) {
    if (evenement === 0) {
      return "Présent";
    }

    if (evenement === -1) {
      return "Passé récent";
    }

    if (evenement < 0) {
      return "Passé composé";
    }

    if (evenement === 1) {
      return "Futur proche";
    }

    return "Futur simple";
  }

  if (reference < 0) {
    if (evenement < reference) {
      return "Plus-que-parfait";
    }

    if (evenement === reference) {
      return "Imparfait / Passé composé";
    }

    if (evenement > reference) {
      return "Conditionnel présent";
    }
  }

  if (reference > 0) {
    if (evenement < reference) {
      return "Futur antérieur";
    }

    if (evenement === reference) {
      return "Futur simple";
    }

    if (evenement > reference) {
      return "Futur simple";
    }
  }

  return "Dépend du contexte";
}
