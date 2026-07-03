import { sampleArticles, type Article } from "@/data/sample-content";
import { getSanityClient } from "./client";

const localPriorityArticleSlugs = new Set([
  "quy-trinh-dau-tu-cho-nguoi-moi",
  "quy-du-phong-bao-nhieu-la-du-truoc-khi-dau-tu",
  "lai-suat-thuc-la-gi",
  "lai-suat-ngan-hang-thang-6-2026-dung-chi-nhin-con-so-cao-nhat",
  "lpbank-sacombank-giam-lai-suat-nguoi-gui-tien-nen-hieu-dieu-gi",
  "lai-suat-tien-gui-va-co-phieu-ngan-hang-lien-quan-voi-nhau-ra-sao",
  "khi-niem-dinh-gia-pe-va-bien-an-toan",
  "lai-kep-va-chi-phi-co-hoi",
]);

const localPriorityArticles = sampleArticles.filter((article) =>
  localPriorityArticleSlugs.has(article.slug),
);

function includeLocalLatestArticles(articles: Article[]): Article[] {
  const existingSlugs = new Set(articles.map((article) => article.slug));

  return [
    ...localPriorityArticles.filter((article) => !existingSlugs.has(article.slug)),
    ...articles,
  ];
}

const articleProjection = `{
  title,
  "slug": slug.current,
  summary,
  "category": category->title,
  "categorySlug": category->slug.current,
  "tags": tags[]->title,
  "author": author->name,
  publishedAt,
  "lastReviewedAt": _updatedAt,
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

    return articles.length > 0 ? includeLocalLatestArticles(articles) : sampleArticles;
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
