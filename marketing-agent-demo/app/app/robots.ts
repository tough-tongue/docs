import type { MetadataRoute } from "next";
import { Config } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  if (Config.is_dev) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
    sitemap: `${Config.app_url}/sitemap.xml`,
  };
}
