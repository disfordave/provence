/**
 * Turns heading text into an anchor id.
 *
 * Shared by the MDX heading renderer (which stamps the `id` onto the rendered
 * heading) and the server-side outline parser (which builds the table of
 * contents links). Both must agree or the anchors break.
 */
export function slugifyText(text: string): string {
  const slug = text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "section";
}
