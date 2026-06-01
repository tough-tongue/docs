import type { MetadataRoute } from "next";
import { CATEGORY_LIST, SLIDE_CATEGORIES } from "@/data/slides/registry";
import { AppConfig } from "@/lib/config";

const BASE = AppConfig.app.url;

export default function sitemap(): MetadataRoute.Sitemap {
  if (AppConfig.app.isDev) return [];

  return [
    { url: BASE, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${BASE}/slides`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    ...CATEGORY_LIST.map((category) => ({
      url: `${BASE}/slides/${category.id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...CATEGORY_LIST.flatMap((category) =>
      Array.from({ length: SLIDE_CATEGORIES[category.id].slides.length }, (_, i) => ({
        url: `${BASE}/slides/${category.id}/${i + 1}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.5,
      })),
    ),
  ];
}
