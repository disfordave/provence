// French puts a space before ? ! ; : and », and after «. With an ordinary
// space, a line can break there and leave the sign alone at the start of the
// next line, so those spaces become non-breaking ones.
export function frenchSpaces(text) {
  return text.replace(/ (?=[?!;:»])/g, " ").replace(/« /g, "« ");
}

// The same for the text of every course, code aside. It runs after
// rehype-slug, so heading ids are still built from the text as written.
export default function rehypeFrenchSpaces() {
  return (tree) => {
    applyFrenchSpaces(tree);
  };
}

function applyFrenchSpaces(node) {
  if (node.type === "text") {
    node.value = frenchSpaces(node.value);
  } else if (node.children && !["code", "pre"].includes(node.tagName)) {
    node.children.forEach(applyFrenchSpaces);
  }
}
