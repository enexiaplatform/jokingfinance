import { ArticleCard } from "@/components/marketing/article-card";
import { PublicFooter } from "@/components/marketing/public-footer";
import { PublicNav } from "@/components/marketing/public-nav";
import { Badge } from "@/components/ui/badge";
import { getArticles } from "@/sanity/lib/articles";

type TagPageProps = {
  params: Promise<{ slug: string }>;
};

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params;
  const articles = (await getArticles()).filter((article) =>
    article.tags.some((tag) => normalize(tag) === slug),
  );

  return (
    <>
      <PublicNav />
      <main className="bg-[#fffdf8] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Badge tone="blue">Thẻ</Badge>
          <h1 className="mt-4 text-4xl font-bold text-[#17201b]">#{slug}</h1>
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
