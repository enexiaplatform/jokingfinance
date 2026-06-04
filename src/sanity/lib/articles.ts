import { sampleArticles, type Article } from "@/data/sample-content";
import { getSanityClient } from "./client";

const articleProjection = `{
  title,
  "slug": slug.current,
  summary,
  "category": category->title,
  "categorySlug": category->slug.current,
  "tags": tags[]->title,
  "author": author->name,
  publishedAt,
  difficulty,
  readingTime,
  "coverImageUrl": coverImage.asset->url,
  "relatedStocks": relatedStocks[],
  relatedMissionSlug,
  seoTitle,
  seoDescription,
  body
}`;

export async function getArticles(): Promise<Article[]> {
  const client = getSanityClient();

  if (!client) {
    return sampleArticles;
  }

  try {
    const articles = await client.fetch<Article[]>(
      `*[_type == "article" && status == "published"] | order(publishedAt desc) ${articleProjection}`,
    );

    return articles.length > 0 ? articles : sampleArticles;
  } catch {
    return sampleArticles;
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const client = getSanityClient();

  if (!client) {
    return sampleArticles.find((article) => article.slug === slug) ?? null;
  }

  try {
    const article = await client.fetch<Article | null>(
      `*[_type == "article" && slug.current == $slug][0] ${articleProjection}`,
      { slug },
    );

    return article ?? sampleArticles.find((item) => item.slug === slug) ?? null;
  } catch {
    return sampleArticles.find((article) => article.slug === slug) ?? null;
  }
}
