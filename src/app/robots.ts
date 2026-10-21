import type { MetadataRoute } from "next";
import { fetchSiteSettings } from "@/lib/site-settings";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await fetchSiteSettings();

  // WordPress-style "discourage search engines" — same disallow-everything
  // behavior as WordPress's own virtual robots.txt when that box is
  // checked. It's an advisory signal, not an enforced block.
  if (settings.discourage_search_engines) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
  };
}
