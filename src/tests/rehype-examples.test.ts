import { expect, test } from "vitest";
import rehypeExamples from "@/lib/rehype-examples.mjs";

type Node = {
  type: string;
  value?: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: Node[];
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

test("takes the label out of the sentence that follows it", () => {
  const [paragraph] = transform(
    element(
      "p",
      element("strong", text("Exemple :")),
      text(" Je gagne un bon salaire."),
    ),
  );

  expect(paragraph.properties).toEqual({ dataExample: "Exemple" });
  expect(paragraph.children).toEqual([text(" Je gagne un bon salaire.")]);
});

test("empties a label on its own and leaves the examples under it", () => {
  const examples = element("ul", element("li", text("le livre")));
  const [paragraph] = transform(
    element("p", element("strong", text("Exemples"))),
    text("\n"),
    examples,
  );

  expect(paragraph.properties).toEqual({ dataExample: "Exemples" });
  expect(paragraph.children).toEqual([]);
  expect(examples).toEqual(element("ul", element("li", text("le livre"))));
});

test("finds labels inside other elements", () => {
  const [quote] = transform(
    element(
      "blockquote",
      element("p", element("strong", text("Exemple :")), text(" Où vas-tu ?")),
    ),
  );

  expect(quote.children?.[0].properties).toEqual({ dataExample: "Exemple" });
});

test("leaves other bold openings alone", () => {
  const [paragraph] = transform(
    element("p", element("strong", text("dont")), text(" remplace de + nom.")),
  );

  expect(paragraph.properties).toEqual({});
  expect(paragraph.children).toHaveLength(2);
});
