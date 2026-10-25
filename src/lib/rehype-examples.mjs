// The courses introduce their examples with a bold label: "**Exemple :**"
// followed by the sentence on the same line, or "**Exemple**" on its own above
// a list or a series of quotes. This plugin hands the label over to
// mdx-components.tsx, which styles it, and ends every example with a
// <ListenButton> that reads it aloud.

const LABEL = /^(Exemples?)\s*:?$/;

export default function rehypeExamples() {
  return (tree) => {
    findExamples(tree);
  };
}

function findExamples(parent) {
  parent.children.forEach((node, index) => {
    const label = labelOf(node);
    if (label) {
      markExamples(node, label, parent.children.slice(index + 1));
    } else if (node.children) {
      findExamples(node);
    }
  });
}

// "Exemple" or "Exemples" when the paragraph opens with that label in bold.
function labelOf(node) {
  if (node.type !== "element" || node.tagName !== "p") return null;
  const [first] = node.children;
  if (first?.type !== "element" || first.tagName !== "strong") return null;
  return LABEL.exec(textOf(first))?.[1] ?? null;
}

function markExamples(paragraph, label, followingNodes) {
  paragraph.children.shift();
  paragraph.properties.dataExample = label;

  if (textOf(paragraph).trim()) {
    addListenButton(paragraph);
    return;
  }

  // A label on its own introduces the items of the list under it, or the
  // quotes that follow it.
  paragraph.children = [];
  const [next, ...rest] = followingNodes.filter((node) => !isBlank(node));
  if (next?.tagName === "ul" || next?.tagName === "ol") {
    next.children
      .filter((node) => node.type === "element")
      .forEach(addListenButton);
  } else if (next?.tagName === "blockquote") {
    addListenButton(next);
    for (const node of rest) {
      if (node.tagName !== "blockquote") break;
      addListenButton(node);
    }
  }
}

// The button goes at the end of the example, inside its last paragraph when
// there is one, so that it stays on the line of the sentence. An arrow joins
// two forms of a sentence, and the voice pauses there.
function addListenButton(example) {
  const text = textOf(example)
    .replace(/\s*→\s*/g, ", ")
    .replace(/\s+/g, " ")
    .trim();
  const paragraphs = example.children.filter(
    (node) => node.type === "element" && node.tagName === "p",
  );
  (paragraphs.at(-1) ?? example).children.push({
    type: "mdxJsxTextElement",
    name: "ListenButton",
    attributes: [{ type: "mdxJsxAttribute", name: "text", value: text }],
    children: [],
  });
}

function textOf(node) {
  if (node.type === "text") return node.value;
  return (node.children ?? []).map(textOf).join("");
}

function isBlank(node) {
  return node.type === "text" && !node.value.trim();
}
