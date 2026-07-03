import type { MetadataRoute } from "next";
import { getKnowledgeModuleParams } from "@/data/knowledge-library";
import { newsBriefs } from "@/data/news-intelligence";
import { practiceCases } from "@/data/practice-cases";
import {
  categories,
  learningTracks,
  sampleMissions,
} from "@/data/sample-content";
import { getSiteUrl } from "@/lib/site-url";
import { getArticles } from "@/sanity/lib/articles";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const articles = await getArticles();
  const staticRoutes = [
    "",
    "/about",
    "/affiliate-disclosure",
    "/articles",
    "/cases",
    "/contact",
    "/ebook",
    "/editorial-policy",
    "/knowledge",
    "/missions",
    "/news",
    "/pricing",
    "/privacy",
    "/request-access",
    "/risk-disclaimer",
    "/simulator",
    "/start",
    "/terms",
  ];
  const dynamicRoutes = [
    ...categories.map((category) => `/categories/${category.slug}`),
    ...practiceCases.map((practiceCase) => `/cases/${practiceCase.slug}`),
    ...getKnowledgeModuleParams().map(
      ({ pillarSlug, moduleSlug }) =>
        `/knowledge/${pillarSlug}/${moduleSlug}`,
    ),
    ...sampleMissions.map((mission) => `/missions/${mission.slug}`),
    ...newsBriefs.map((brief) => `/news/${brief.slug}`),
    ...learningTracks.map((track) => `/tracks/${track.slug}`),
  ];

  const routeEntries: MetadataRoute.Sitemap = [...staticRoutes, ...dynamicRoutes].map(
    (path) => ({
      url: new URL(path, baseUrl).toString(),
      changeFrequency: path.startsWith("/news") ? "weekly" : "monthly",
      priority:
        path === "" ? 1 : path.split("/").filter(Boolean).length === 1 ? 0.8 : 0.6,
    }),
  );
  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: new URL(`/articles/${article.slug}`, baseUrl).toString(),
    lastModified: article.lastReviewedAt ?? article.publishedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...routeEntries, ...articleEntries];
}
