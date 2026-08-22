import { expect, test } from "vitest";
import { search } from "@/lib/search";
import { parseArticle } from "@/lib/search-content";

const source = `export const metadata = {
  title: "Les temps du français",
};
import TensesSlider from "@/components/content/TensesSlider";

# Les temps du français

Une **introduction** aux temps.

## Présent

<TensesSlider />

### Le présent

Je gagne un bon salaire.

#### Verbes fréquents

avoir ai as a

## Passé

### L'imparfait

Voir la [conjugaison](https://example.com) des verbes.

#### Verbes fréquents

être étais étais était
`;

const entries = parseArticle(
  "grammaire/temps",
  "Les temps du français",
  source,
);

test("keeps the intro as an article-level entry", () => {
  expect(entries[0]).toEqual({
    href: "/cours/grammaire/temps",
    title: "Les temps du français",
    headings: [],
    text: "Une introduction aux temps.",
  });
});

test("carries the h2-h4 trail down to each section", () => {
  expect(entries.map((entry) => entry.headings)).toEqual([
    [],
    ["Présent"],
    ["Présent", "Le présent"],
    ["Présent", "Le présent", "Verbes fréquents"],
    ["Passé"],
    ["Passé", "L'imparfait"],
    ["Passé", "L'imparfait", "Verbes fréquents"],
  ]);
});

test("links each section to its heading anchor", () => {
  expect(entries.map((entry) => entry.href)).toEqual([
    "/cours/grammaire/temps",
    "/cours/grammaire/temps#présent",
    "/cours/grammaire/temps#le-présent",
    "/cours/grammaire/temps#verbes-fréquents",
    "/cours/grammaire/temps#passé",
    "/cours/grammaire/temps#limparfait",
    "/cours/grammaire/temps#verbes-fréquents-1",
  ]);
});

test("strips module syntax, JSX and markdown from the text", () => {
  expect(entries[2].text).toBe("Je gagne un bon salaire.");
  expect(entries[5].text).toBe("Voir la conjugaison des verbes.");
});

test("matches without accents", () => {
  expect(search(entries, "present")[0].headings.at(-1)).toBe("Le présent");
  expect(search(entries, "imparfait")[0].headings.at(-1)).toBe("L'imparfait");
});

test("tells repeated headings apart by their ancestors", () => {
  const results = search(entries, "verbes frequents");
  expect(results).toHaveLength(2);
  expect(results.map((result) => result.headings.join(" › "))).toEqual([
    "Présent › Le présent › Verbes fréquents",
    "Passé › L'imparfait › Verbes fréquents",
  ]);
});

test("an ancestor narrows a repeated heading down to one section", () => {
  const results = search(entries, "imparfait verbes frequents");
  expect(results).toHaveLength(1);
  expect(results[0].href).toBe("/cours/grammaire/temps#verbes-fréquents-1");
});

test("requires every token to match", () => {
  expect(search(entries, "gagne salaire")).toHaveLength(1);
  expect(search(entries, "gagne introuvable")).toHaveLength(0);
});
