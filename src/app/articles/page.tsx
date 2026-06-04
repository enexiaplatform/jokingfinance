import { Search } from "lucide-react";
import { ArticleCard } from "@/components/marketing/article-card";
import { PublicFooter } from "@/components/marketing/public-footer";
import { PublicNav } from "@/components/marketing/public-nav";
import { Badge } from "@/components/ui/badge";
import { Disclaimer } from "@/components/ui/disclaimer";
import { categories } from "@/data/sample-content";
import { getArticles } from "@/sanity/lib/articles";

type ArticlesPageProps = {
  searchParams?: Promise<{
    q?: string;
    category?: string;
  }>;
};

export const metadata = {
  title: "Bài viết - JokingFinance",
  description: "Bài viết tài chính dễ hiểu, có nhiệm vụ thực hành đi kèm.",
};

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
            <Badge tone="green">Bài viết hằng ngày</Badge>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-normal text-[#17201b]">
              Bài viết tài chính dễ hiểu, có nhiệm vụ thực hành đi kèm.
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
