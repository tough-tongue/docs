import { notFound, redirect } from "next/navigation";
import {
  getCanonicalCategoryId,
  getCategory,
} from "@/data/slides/registry";

export default async function SlideCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: rawCategory } = await params;
  const category = getCanonicalCategoryId(rawCategory);
  if (!getCategory(category)) notFound();

  redirect(`/slides/${category}/1`);
}
