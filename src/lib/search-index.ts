"use server";

import { buildSearchIndex } from "@/lib/search-content";
import type { SearchEntry } from "@/lib/search";

// The index is static per build, so it is read from disk once per server
// process and handed to the client the first time the search panel opens.
let cached: Promise<SearchEntry[]> | null = null;

export async function getSearchIndex(): Promise<SearchEntry[]> {
  cached ??= buildSearchIndex();
  return cached;
}
