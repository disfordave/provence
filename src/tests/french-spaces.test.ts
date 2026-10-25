import { expect, test } from "vitest";
import rehypeFrenchSpaces, { frenchSpaces } from "@/lib/french-spaces.mjs";

test("keeps the space before ? ! ; : » and after « on the same line", () => {
  expect(frenchSpaces("Tu viens ? Oui ! Bon ; voilà : « Allons-y »")).toBe(
    "Tu viens ? Oui ! Bon ; voilà : « Allons-y »",
  );
});

test("leaves English punctuation and other spaces alone", () => {
  expect(frenchSpaces("You're right! Really? 10:30")).toBe(
    "You're right! Really? 10:30",
  );
});

test("changes the text of a course but not its code", () => {
  const sentence = { type: "text", value: "Où vas-tu ?" };
  const code = { type: "text", value: "a ? b : c" };
  const tree = {
    type: "root",
    children: [
      { type: "element", tagName: "p", children: [sentence] },
      { type: "element", tagName: "code", children: [code] },
    ],
  };

  rehypeFrenchSpaces()(tree);

  expect(sentence.value).toBe("Où vas-tu ?");
  expect(code.value).toBe("a ? b : c");
});
