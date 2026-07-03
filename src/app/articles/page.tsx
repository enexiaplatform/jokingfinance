import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, CheckCircle2, Search } from "lucide-react";
import { ArticleCard } from "@/components/marketing/article-card";
import { PublicFooter } from "@/components/marketing/public-footer";
import { PublicNav } from "@/components/marketing/public-nav";
import { Badge } from "@/components/ui/badge";
import { Disclaimer } from "@/components/ui/disclaimer";
import { categories, learningTracks } from "@/data/sample-content";
import { formatDifficulty } from "@/lib/format";
import { getArticles } from "@/sanity/lib/articles";

type ArticlesPageProps = {
  searchParams?: Promise<{
    q?: string;
    category?: string;
  }>;
};

export async function generateMetadata({
  searchParams,
}: ArticlesPageProps): Promise<Metadata> {
  const params = await searchParams;
  const isFiltered = Boolean(params?.q || params?.category);

  return {
    title: "Bài học tài chính cho người mới - JokingFinance",
    description: "Bài học tài chính dễ hiểu, có nhiệm vụ thực hành đi kèm.",
    alternates: {
      canonical: "/articles",
    },
    robots: isFiltered
      ? {
          index: false,
          follow: true,
        }
      : undefined,
  };
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const params = await searchParams;
  const query = params?.q?.trim().toLowerCase() ?? "";
  const category = params?.category ?? "";
  const articles = await getArticles();
  const filteredArticles = articles.filter((article) => {
    const matchesQuery = query
      ? `${article.title} ${article.summary}`.toLowerCase().includes(query)
      : true;
    const matchesCategory = category ? article.categorySlug === category : true;

    return matchesQuery && matchesCategory;
  });

  return (
    <>
      <PublicNav />
      <main className="bg-[#fffdf8]">
        <section className="border-b border-[#d9ddd3] bg-[#edf5ee] px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Badge tone="green">Bài học hằng ngày</Badge>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-normal text-[#17201b]">
              Bài học tài chính dễ hiểu, có nhiệm vụ thực hành đi kèm.
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-[#5b6861]">
              Không phải tin nóng, không phải phím hàng. Đây là thư viện bài
              viết để người mới hiểu khái niệm rồi luyện trong phần mô phỏng.
            </p>

            <form className="mt-8 grid gap-3 rounded-md border border-[#d9ddd3] bg-white p-3 shadow-sm md:grid-cols-[1fr_240px_auto]">
              <label className="flex min-h-11 items-center gap-2 rounded-md border border-[#d9ddd3] px-3">
                <Search className="h-4 w-4 text-[#66736c]" aria-hidden="true" />
                <input
                  name="q"
                  defaultValue={params?.q ?? ""}
                  placeholder="Tìm theo tiêu đề hoặc tóm tắt"
                  className="min-w-0 flex-1 bg-transparent text-sm text-[#17201b] outline-none"
                />
              </label>
              <select
                name="category"
                defaultValue={category}
                className="min-h-11 rounded-md border border-[#d9ddd3] bg-white px-3 text-sm text-[#17201b]"
              >
                <option value="">Tất cả chuyên mục</option>
                {categories.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.title}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="min-h-11 rounded-md bg-[#0f766e] px-4 text-sm font-semibold text-white hover:bg-[#115e59]"
              >
                Tìm
              </button>
            </form>
          </div>
        </section>

        <section className="border-b border-[#d0ded3] bg-[#f2fbf4] px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <Badge tone="green">Tin tức phân tích</Badge>
              <h2 className="mt-3 text-2xl font-bold tracking-normal text-[#17201b]">
                Muốn đọc tin theo tác động thay vì chỉ đọc tiêu đề?
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#5b6861]">
                Bàn tin mới bóc mỗi sự kiện thành câu hỏi chính, tín hiệu cần theo dõi,
                lỗi đọc sai thường gặp và module kiến thức liên quan.
              </p>
            </div>
            <Link
              href="/news"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#0f766e] px-4 text-sm font-bold text-white hover:bg-[#115e59]"
            >
              Mở bàn tin phân tích
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>

        <section className="border-b border-[#e0e5dc] bg-white px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Badge tone="gold">Lộ trình đề xuất</Badge>
                <h2 className="mt-3 text-2xl font-bold tracking-normal text-[#17201b]">
                  Đi từng bước, học xong là có việc để luyện.
                </h2>
              </div>
              <p className="max-w-2xl text-sm leading-6 text-[#5b6861]">
                Mỗi lộ trình gom bài đọc, nhiệm vụ và bài tập mô phỏng để người mới
                biết nên bắt đầu ở đâu.
              </p>
            </div>

            <div className="mt-7 grid gap-4 lg:grid-cols-3">
              {learningTracks.map((track, index) => (
                <article
                  key={track.slug}
                  className="flex h-full flex-col rounded-md border border-[#dce4da] bg-[#fffdf8] p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase text-[#0f766e]">
                        Bước {index + 1}
                      </p>
                      <h3 className="mt-2 text-xl font-bold leading-7 text-[#17201b]">
                        {track.title}
                      </h3>
                    </div>
                    <Badge tone={track.level === "intermediate" ? "blue" : "green"}>
                      {formatDifficulty(track.level)}
                    </Badge>
                  </div>

                  <p className="mt-4 flex-1 text-sm leading-6 text-[#5b6861]">
                    {track.description}
                  </p>

                  <div className="mt-5 rounded-md border border-[#e0e5dc] bg-white p-3">
                    <p className="flex items-start gap-2 text-sm font-semibold leading-6 text-[#17201b]">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-[#0f766e]" />
                      {track.outcome}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2 text-xs text-[#66736c]">
                    <span>{track.articleSlugs.length} bài học</span>
                    <span aria-hidden="true">/</span>
                    <span>{track.missionSlugs.length} nhiệm vụ</span>
                    <span aria-hidden="true">/</span>
                    <span>{track.estimatedMinutes} phút</span>
                  </div>

                  <Link
                    href={`/tracks/${track.slug}`}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#0f766e] hover:text-[#115e59]"
                  >
                    Bắt đầu lộ trình
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
            {filteredArticles.length === 0 ? (
              <div className="rounded-md border border-[#e0e5dc] bg-white p-8 text-center">
                <p className="font-semibold text-[#17201b]">Chưa có bài phù hợp.</p>
                <p className="mt-2 text-sm text-[#5b6861]">
                  Thử bỏ bộ lọc hoặc tìm bằng từ khóa rộng hơn.
                </p>
              </div>
            ) : null}
            <Disclaimer className="mt-8" />
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
