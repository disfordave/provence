import { buildSearchIndex } from "@/lib/search-content";

// The index is static per build, so it is written out as `search-index.json`
// and fetched by the client the first time the search panel opens.
export const dynamic = "force-static";

export async function GET() {
  return Response.json(await buildSearchIndex());
}
