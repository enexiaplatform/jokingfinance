import { ArticleCard } from "@/components/marketing/article-card";
import { PublicFooter } from "@/components/marketing/public-footer";
import { PublicNav } from "@/components/marketing/public-nav";
import { Badge } from "@/components/ui/badge";
import { categories } from "@/data/sample-content";
import { getArticles } from "@/sanity/lib/articles";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);
  const articles = (await getArticles()).filter((article) => article.categorySlug === slug);

  return (
    <>
      <PublicNav />
      <main className="bg-[#fffdf8] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Badge tone="green">Chuyên mục</Badge>
          <h1 className="mt-4 text-4xl font-bold text-[#17201b]">
            {category?.title ?? "Chuyên mục"}
          </h1>
          <p className="mt-3 max-w-3xl text-lg leading-8 text-[#5b6861]">
            {category?.description ?? "Các bài viết trong chuyên mục này."}
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
