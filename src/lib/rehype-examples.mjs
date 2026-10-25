// The courses introduce their examples with a bold label: "**Exemple :**"
// followed by the sentence on the same line, or "**Exemple**" on its own above
// a list or a series of quotes. This plugin takes the label out of its
// paragraph and hands it over to mdx-components.tsx, which styles it.

const LABEL = /^(Exemples?)\s*:?$/;

export default function rehypeExamples() {
  return (tree) => {
    markLabels(tree);
  };
}

function markLabels(parent) {
  for (const node of parent.children) {
    const label = labelOf(node);
    if (label) {
      node.children.shift();
      node.properties.dataExample = label;
      // A label on its own leaves an empty paragraph, which mdx-components.tsx
      // keeps close to the examples under it.
      if (!textOf(node).trim()) node.children = [];
    } else if (node.children) {
      markLabels(node);
    }
  }
}

// "Exemple" or "Exemples" when the paragraph opens with that label in bold.
function labelOf(node) {
  if (node.type !== "element" || node.tagName !== "p") return null;
  const [first] = node.children;
  if (first?.type !== "element" || first.tagName !== "strong") return null;
  return LABEL.exec(textOf(first))?.[1] ?? null;
}

function textOf(node) {
  if (node.type === "text") return node.value;
  return (node.children ?? []).map(textOf).join("");
}
