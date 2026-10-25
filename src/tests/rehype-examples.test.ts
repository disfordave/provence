import { expect, test } from "vitest";
import rehypeExamples from "@/lib/rehype-examples.mjs";

type Node = {
  type: string;
  value?: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: Node[];
  attributes?: { value: string }[];
};

function text(value: string): Node {
  return { type: "text", value };
}

function element(tagName: string, ...children: Node[]): Node {
  return { type: "element", tagName, properties: {}, children };
}

function transform(...children: Node[]) {
  rehypeExamples()({ type: "root", children });
  return children;
}

// What the <ListenButton> ending this node reads, if there is one.
function spokenText(node?: Node) {
  const last = node?.children?.at(-1);
  return last?.type === "mdxJsxTextElement"
    ? last.attributes?.[0].value
    : undefined;
}

test("reads the sentence that follows the label on the same line", () => {
  const [paragraph] = transform(
    element(
      "p",
      element("strong", text("Exemple :")),
      text(" Je gagne un bon salaire."),
    ),
  );

  expect(paragraph.properties).toEqual({ dataExample: "Exemple" });
  expect(paragraph.children?.[0]).toEqual(text(" Je gagne un bon salaire."));
  expect(spokenText(paragraph)).toBe("Je gagne un bon salaire.");
});

test("reads each item of the list under a label on its own", () => {
  const [paragraph, , list] = transform(
    element("p", element("strong", text("Exemples"))),
    text("\n"),
    element(
      "ul",
      text("\n"),
      element("li", text("le livre")),
      text("\n"),
      element("li", text("la maison")),
    ),
  );

  expect(paragraph.properties).toEqual({ dataExample: "Exemples" });
  expect(paragraph.children).toEqual([]);
  expect(
    list.children?.filter((node) => node.type === "element").map(spokenText),
  ).toEqual(["le livre", "la maison"]);
});

test("reads the quotes after a label, with a pause at the arrow", () => {
  const quote = (...children: Node[]) =>
    element("blockquote", text("\n"), element("p", ...children), text("\n"));
  const [, , first, , second, , rule] = transform(
    element("p", element("strong", text("Exemple :"))),
    text("\n"),
    quote(
      element("strong", text("mon")),
      text(" livre → déterminant possessif"),
    ),
    text("\n"),
    quote(text("le "), element("strong", text("mien")), text(" → pronom")),
    text("\n"),
    element("hr"),
  );

  expect(spokenText(first.children?.[1])).toBe(
    "mon livre, déterminant possessif",
  );
  expect(spokenText(second.children?.[1])).toBe("le mien, pronom");
  expect(rule.children).toEqual([]);
});

test("leaves other bold openings alone", () => {
  const [paragraph] = transform(
    element("p", element("strong", text("dont")), text(" remplace de + nom.")),
  );

  expect(paragraph.properties).toEqual({});
  expect(paragraph.children).toHaveLength(2);
});
