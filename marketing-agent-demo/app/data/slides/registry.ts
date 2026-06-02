/**
 * Slide deck registry.
 * Validates all category files at import time — catches schema drift early.
 */

import { validateCategoryFile, type Category, type CategoryFile } from "./schema";
import skyPenthouse from "./sky-penthouse.json";
import wraparoundResidence from "./wraparound-residence.json";
import amenities from "./amenities.json";

// Validate at import time (build-time catch)
const RAW_CATEGORIES: CategoryFile[] = [
  validateCategoryFile(wraparoundResidence),
  validateCategoryFile(skyPenthouse),
  validateCategoryFile(amenities),
];

const CATEGORY_ALIASES: Record<string, string> = {
  "property-type-a": "wraparound-residence",
  "property-type-b": "sky-penthouse",
};

export const SLIDE_CATEGORIES: Record<string, CategoryFile> = Object.fromEntries(
  RAW_CATEGORIES.map((c) => [c.meta.id, c]),
);

export const CATEGORY_LIST: Category[] = RAW_CATEGORIES.map((c) => c.meta);

export function getCategory(id: string): CategoryFile | null {
  return SLIDE_CATEGORIES[getCanonicalCategoryId(id)] ?? null;
}

export function getCanonicalCategoryId(id: string): string {
  return CATEGORY_ALIASES[id] ?? id;
}
