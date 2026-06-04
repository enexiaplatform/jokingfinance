import type { Metadata } from "next";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { ArrowRight, Clock } from "lucide-react";
import { PublicFooter } from "@/components/marketing/public-footer";
import { PublicNav } from "@/components/marketing/public-nav";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { Disclaimer } from "@/components/ui/disclaimer";
import { findMission } from "@/data/sample-content";
import { formatDate, formatDifficulty } from "@/lib/format";
import { getArticleBySlug, getArticles } from "@/sanity/lib/articles";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  return {
    title: article?.seoTitle ?? article?.title ?? "Bài học - JokingFinance",
    description: article?.seoDescription ?? article?.summary,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  const articles = await getArticles();

  if (!article) {
    return (
      <>
        <PublicNav />
        <main className="bg-[#fffdf8] px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-[#17201b]">Không tìm thấy bài học.</h1>
          <ButtonLink href="/articles" className="mt-6">
            Quay lại bài học
          </ButtonLink>
        </main>
        <PublicFooter />
      </>
    );
  }

  const relatedMission = findMission(article.relatedMissionSlug);
  const relatedArticles = articles
    .filter((item) => item.slug !== article.slug && item.categorySlug === article.categorySlug)
    .slice(0, 3);
  const plainBody = article.body.every((block) => typeof block === "string");

  return (
    <>
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
              <p className="mt-5 text-sm text-[#66736c]">
                {article.author} · {formatDate(article.publishedAt)}
              </p>
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
              <h2 className="text-xl font-bold text-[#17201b]">Luyện tập bài học này</h2>
              <p className="mt-2 text-sm leading-6 text-[#5b6861]">
                Đọc xong bài này, hãy luyện tập bằng một nhiệm vụ nhỏ trong JokingFinance.
              </p>
              <ButtonLink
                href={relatedMission ? `/missions/${relatedMission.slug}` : "/missions"}
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

            <Disclaimer className="mt-10" />

            {relatedArticles.length > 0 ? (
              <section className="mt-12">
                <h2 className="text-2xl font-bold text-[#17201b]">Bài học liên quan</h2>
                <div className="mt-4 grid gap-3">
                  {relatedArticles.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/articles/${item.slug}`}
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
