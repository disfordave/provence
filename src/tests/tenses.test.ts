import { expect, test } from "vitest";
import { getTense } from "@/components/content/TensesSlider";

test('returns "Présent" for reference=0 and evenement=0', () => {
  expect(getTense(0, 0)).toBe("Présent");
});

test('returns "Passé récent" for reference=0 and evenement=-1', () => {
  expect(getTense(0, -1)).toBe("Passé récent");
});

test('returns "Passé composé" for reference=0 and evenement=-2', () => {
  expect(getTense(0, -2)).toBe("Passé composé");
});

test('returns "Futur proche" for reference=0 and evenement=1', () => {
  expect(getTense(0, 1)).toBe("Futur proche");
});

test('returns "Futur simple" for reference=0 and evenement=2', () => {
  expect(getTense(0, 2)).toBe("Futur simple");
});

test('returns "Plus-que-parfait" for reference=-1 and evenement=-2', () => {
  expect(getTense(-1, -2)).toBe("Plus-que-parfait");
});

test('returns "Imparfait / Passé composé" for reference=-1 and evenement=-1', () => {
  expect(getTense(-1, -1)).toBe("Imparfait / Passé composé");
});

test('returns "Conditionnel présent" for reference=-1 and evenement=0', () => {
  expect(getTense(-1, 0)).toBe("Conditionnel présent");
});

test('returns "Futur antérieur" for reference=1 and evenement=0', () => {
  expect(getTense(1, 0)).toBe("Futur antérieur");
});

test('returns "Futur simple" for reference=1 and evenement=1', () => {
  expect(getTense(1, 1)).toBe("Futur simple");
});

test('returns "Futur simple" for reference=1 and evenement=2', () => {
  expect(getTense(1, 2)).toBe("Futur simple");
});
