export type SearchEntry = {
  href: string;
  title: string;
  // The h2-h4 trail down to this section, so a heading that repeats under
  // several tenses is still told apart by its ancestors.
  headings: string[];
  text: string;
};

export type SearchResult = SearchEntry & { snippet: string };

// The content is French, so accents are folded away on both sides of the
// comparison: "eleve" has to find "élève".
export function fold(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

const SNIPPET_RADIUS = 60;

function snippet(text: string, token: string): string {
  const at = fold(text).indexOf(token);
  const start = Math.max(0, at === -1 ? 0 : at - SNIPPET_RADIUS);
  const end = Math.min(text.length, start + SNIPPET_RADIUS * 2 + token.length);

  return [
    start > 0 ? "…" : "",
    text.slice(start, end).trim(),
    end < text.length ? "…" : "",
  ].join("");
}

export function search(
  index: SearchEntry[],
  query: string,
  limit = 8,
): SearchResult[] {
  const tokens = fold(query).split(/\s+/).filter(Boolean);

  if (tokens.length === 0) {
    return [];
  }

  const scored = [];

  for (const entry of index) {
    const heading = fold(entry.headings.at(-1) ?? "");
    const parents = fold(entry.headings.slice(0, -1).join(" "));
    const title = fold(entry.title);
    const text = fold(entry.text);
    let score = 0;

    // Every token has to appear somewhere, so extra words narrow the results
    // instead of widening them.
    if (
      !tokens.every(
        (t) =>
          heading.includes(t) ||
          parents.includes(t) ||
          title.includes(t) ||
          text.includes(t),
      )
    ) {
      continue;
    }

    for (const token of tokens) {
      if (heading.includes(token)) score += 4;
      if (title.includes(token)) score += 3;
      if (parents.includes(token)) score += 2;
      if (text.includes(token)) score += 1;
    }

    scored.push({ entry, score });
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ entry }) => ({
      ...entry,
      snippet: snippet(entry.text, tokens[0]),
    }));
}
