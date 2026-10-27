import type { MetadataRoute } from "next";
import { getItems } from "@/lib/store";
import { site } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const items = await getItems();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${site.url}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${site.url}/browse`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${site.url}/list-item`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site.url}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${site.url}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${site.url}/login`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${site.url}/register`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${site.url}/legal/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${site.url}/legal/kdpa`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${site.url}/legal/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${site.url}/legal/cookies`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  const itemRoutes: MetadataRoute.Sitemap = items
    .filter((item) => item.status === "live")
    .map((item) => ({
      url: `${site.url}/item/${item.slug}`,
      lastModified: new Date(item.createdAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  return [...staticRoutes, ...itemRoutes];
}
