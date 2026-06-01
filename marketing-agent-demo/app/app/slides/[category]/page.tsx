import { notFound, redirect } from "next/navigation";
import {
  getCanonicalCategoryId,
  getCategory,
} from "@/data/slides/registry";

export default function SlideCategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const category = getCanonicalCategoryId(params.category);
  if (!getCategory(category)) notFound();

  redirect(`/slides/${category}/1`);
}
