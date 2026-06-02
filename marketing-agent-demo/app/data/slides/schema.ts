/**
 * Slide data types and runtime validation.
 *
 * Each category JSON file must conform to CategoryFile.
 * Viewer URL: /slides/<category.id>/<slide.order>
 *
 * Sections:
 * - Types
 * - Runtime validation
 */

// ------------------------------------------------------------------------------
// Types
// ------------------------------------------------------------------------------
export interface SlideImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface SlideSpec {
  label: string;
  value: string;
  unit?: string;
}

export type SlideLayout =
  | "hero"
  | "split"
  | "mosaic"
  | "specsheet"
  | "fullbleed";

export interface Slide {
  id: string;
  order: number;
  eyebrow: string;
  title: string;
  subtitle?: string;
  body?: string;
  layout: SlideLayout;
  images: SlideImage[];
  specs?: SlideSpec[];
}

export interface Category {
  id: string;
  name: string;
  tagline: string;
  description: string;
  useWhen: string;
  cover: string;
  accent?: string;
}

export interface CategoryFile {
  meta: Category;
  slides: Slide[];
}

// ------------------------------------------------------------------------------
// Runtime validation
// ------------------------------------------------------------------------------
export function validateCategoryFile(file: unknown): CategoryFile {
  if (!file || typeof file !== "object") {
    throw new Error("Slide schema: file must be an object");
  }

  const { meta, slides } = file as Partial<CategoryFile>;
  const errors: string[] = [];

  if (!meta?.id) errors.push("meta.id missing");
  if (!meta?.name) errors.push("meta.name missing");
  if (!meta?.tagline) errors.push("meta.tagline missing");
  if (!meta?.description) errors.push("meta.description missing");
  if (!meta?.cover) errors.push("meta.cover missing");
  if (!Array.isArray(slides)) errors.push("slides must be an array");

  if (errors.length) {
    throw new Error(`Slide schema invalid: ${errors.join("; ")}`);
  }

  for (const [i, slide] of (slides as Slide[]).entries()) {
    const expected = i + 1;
    if (slide.order !== expected) {
      errors.push(
        `slides[${i}].order is ${slide.order}, expected ${expected}`,
      );
    }
    if (!slide.id) errors.push(`slides[${i}].id missing`);
    if (!slide.layout) errors.push(`slides[${i}].layout missing`);
    if (!Array.isArray(slide.images)) {
      errors.push(`slides[${i}].images must be an array`);
    }
  }

  if (errors.length) {
    throw new Error(`Slide schema invalid: ${errors.join("; ")}`);
  }

  return file as CategoryFile;
}
