import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { ArrowRight, BookOpenCheck, Clock } from "lucide-react";
import { SaveContentButton } from "@/components/app/save-content-button";
import { PublicFooter } from "@/components/marketing/public-footer";
import { PublicNav } from "@/components/marketing/public-nav";
import { JsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { Disclaimer } from "@/components/ui/disclaimer";
import { findMission } from "@/data/sample-content";
import { formatDate, formatDifficulty } from "@/lib/format";
import { getSiteUrl } from "@/lib/site-url";
import { getArticleBySlug, getArticles } from "@/sanity/lib/articles";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

const ebookRelevantArticleSlugs = new Set([
  "quy-trinh-dau-tu-cho-nguoi-moi",
  "quy-du-phong-bao-nhieu-la-du-truoc-khi-dau-tu",
  "viet-3-dong-ly-do-truoc-khi-mua",
]);

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  const canonicalUrl = new URL(`/articles/${slug}`, getSiteUrl()).toString();

  return {
    title: article?.seoTitle ?? article?.title ?? "Bài học - JokingFinance",
    description: article?.seoDescription ?? article?.summary,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: article
      ? {
          type: "article",
          title: article.seoTitle ?? article.title,
          description: article.seoDescription ?? article.summary,
          url: canonicalUrl,
          publishedTime: article.publishedAt,
          modifiedTime: article.lastReviewedAt ?? article.publishedAt,
          authors: [article.author],
        }
      : undefined,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  const articles = await getArticles();

  if (!article) {
    notFound();
  }

  const relatedMission = findMission(article.relatedMissionSlug);
  const relatedArticles = articles
    .filter((item) => item.slug !== article.slug && item.categorySlug === article.categorySlug)
    .slice(0, 3);
  const plainBody = article.body.every((block) => typeof block === "string");
  const articleUrl = new URL(`/articles/${article.slug}`, getSiteUrl()).toString();
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.summary,
    datePublished: article.publishedAt,
    dateModified: article.lastReviewedAt ?? article.publishedAt,
    inLanguage: "vi-VN",
    mainEntityOfPage: articleUrl,
    author: {
      "@type": "Organization",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: "JokingFinance",
      url: getSiteUrl().toString(),
    },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Trang chủ",
        item: getSiteUrl().toString(),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Bài học",
        item: new URL("/articles", getSiteUrl()).toString(),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: articleUrl,
      },
    ],
  };

  return (
    <>
      <JsonLd data={[articleSchema, breadcrumbSchema]} />
      <PublicNav />
      <main className="bg-[#fffdf8]">
        <article>
          <header className="border-b border-[#d9ddd3] bg-[#edf5ee] px-4 py-14 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="green">{article.category}</Badge>
                <Badge tone="neutral">{formatDifficulty(article.difficulty)}</Badge>
                <span className="inline-flex items-center gap-1 text-sm text-[#66736c]">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                  {article.readingTime} phút
                </span>
              </div>
              <h1 className="mt-5 text-4xl font-black leading-tight tracking-normal text-[#17201b] md:text-5xl">
                {article.title}
              </h1>
              <p className="mt-5 text-lg leading-8 text-[#43534a]">
                {article.summary}
              </p>
              <div className="mt-5 flex flex-wrap gap-x-2 gap-y-1 text-sm text-[#66736c]">
                <span>{article.author}</span>
                <span aria-hidden="true">·</span>
                <span>Xuất bản {formatDate(article.publishedAt)}</span>
                {article.lastReviewedAt ? (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>Rà soát {formatDate(article.lastReviewedAt)}</span>
                  </>
                ) : null}
              </div>
              <p className="mt-3 text-sm leading-6 text-[#5b6861]">
                Nội dung được viết cho mục đích giáo dục và rà soát theo{" "}
                <Link
                  href="/editorial-policy"
                  className="font-semibold text-[#0f766e] underline-offset-4 hover:underline"
                >
                  nguyên tắc biên tập của JokingFinance
                </Link>
                .
              </p>
              <div className="mt-6">
                <SaveContentButton
                  id={`article:${article.slug}`}
                  kind="article"
                  title={article.title}
                  summary={article.summary}
                  href={`/articles/${article.slug}`}
                />
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="mb-8 flex min-h-56 items-end rounded-md border border-[#d9ddd3] bg-[#dff0e5] p-5">
              <div className="max-w-xl rounded-md border border-[#bad5c2] bg-[#fffdf8] p-4">
                <p className="text-xs font-semibold uppercase text-[#66736c]">
                  Bài học ưu tiên giáo dục
                </p>
                <p className="mt-2 text-sm leading-6 text-[#314039]">
                  Đọc xong bài này, hãy luyện tập bằng một nhiệm vụ nhỏ trong
                  JokingFinance.
                </p>
              </div>
            </div>

            <div className="jf-prose text-lg text-[#24342c]">
              {plainBody ? (
                article.body.map((paragraph) => (
                  <p key={String(paragraph).slice(0, 40)}>{String(paragraph)}</p>
                ))
              ) : (
                <PortableText value={article.body as unknown as PortableTextBlock[]} />
              )}
            </div>

            <div className="mt-10 rounded-md border border-[#b9d9c5] bg-[#f2fbf4] p-5">
              <h2 className="text-xl font-bold text-[#17201b]">Luyện tập từ bài học này</h2>
              <p className="mt-2 text-sm leading-6 text-[#5b6861]">
                Đọc xong bài này, hãy luyện tập bằng một nhiệm vụ nhỏ trong JokingFinance.
              </p>
              <ButtonLink
                href={relatedMission ? `/missions/${relatedMission.slug}` : "/missions"}
                data-analytics-event="article_mission_click"
                data-analytics-label={relatedMission?.title ?? "Danh sách nhiệm vụ"}
                data-analytics-location={`article:${article.slug}`}
                className="mt-5"
              >
                Bắt đầu nhiệm vụ thực hành
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
            </div>

            {article.relatedStocks.length > 0 ? (
              <div className="mt-8">
                <h2 className="text-lg font-bold text-[#17201b]">Mã cổ phiếu liên quan</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {article.relatedStocks.map((ticker) => (
                    <Badge key={ticker} tone="blue">
                      {ticker}
                    </Badge>
                  ))}
                </div>
                <p className="mt-2 text-sm text-[#66736c]">
                  Các mã này chỉ dùng làm ngữ cảnh học tập, không phải khuyến nghị.
                </p>
              </div>
            ) : null}

            {ebookRelevantArticleSlugs.has(article.slug) ? (
              <section className="mt-10 rounded-md border border-[#e2d3a7] bg-[#fff8df] p-5">
                <div className="flex items-start gap-3">
                  <BookOpenCheck
                    className="mt-1 h-6 w-6 shrink-0 text-[#8a5a0a]"
                    aria-hidden="true"
                  />
                  <div>
                    <h2 className="text-xl font-bold text-[#5b420b]">
                      Dùng thử checklist trước khi đăng ký ebook
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-[#6e5315]">
                      Bản đọc thử gồm bảy câu hỏi để kiểm tra mục tiêu, luận điểm, điều
                      kiện sai và tỷ trọng trước khi chọn cổ phiếu.
                    </p>
                    <Link
                      href="/ebook/sample"
                      data-analytics-event="ebook_sample_click"
                      data-analytics-label="Đọc checklist 7 bước"
                      data-analytics-location={`article:${article.slug}`}
                      className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-md bg-[#8a5a0a] px-4 text-sm font-bold text-white hover:bg-[#6b4508]"
                    >
                      Đọc checklist 7 bước
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </section>
            ) : null}

            <Disclaimer className="mt-10" />

            {relatedArticles.length > 0 ? (
              <section className="mt-12">
                <h2 className="text-2xl font-bold text-[#17201b]">Bài học liên quan</h2>
                <div className="mt-4 grid gap-3">
                  {relatedArticles.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/articles/${item.slug}`}
                      data-analytics-event="related_article_click"
                      data-analytics-label={item.title}
                      data-analytics-location={`article:${article.slug}`}
                      className="rounded-md border border-[#e0e5dc] bg-white p-4 font-semibold text-[#17201b] hover:border-[#0f766e]"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </article>
      </main>
      <PublicFooter />
    </>
  );
}
