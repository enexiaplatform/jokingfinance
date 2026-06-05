import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import type { Article } from "@/data/sample-content";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatDifficulty } from "@/lib/format";

type ArticleCardProps = {
  article: Article;
};

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-md border border-[#e0e5dc] bg-white shadow-sm">
      <div className="flex h-36 items-end bg-[#dff0e5] p-4">
        <div className="w-full rounded-md border border-[#bad5c2] bg-[#fffdf8] p-3">
          <p className="text-xs font-semibold uppercase text-[#66736c]">Bài học tài chính</p>
          <p className="mt-2 line-clamp-2 text-sm font-bold text-[#17201b]">
            {article.title}
          </p>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="green">{article.category}</Badge>
          <Badge tone="neutral">{formatDifficulty(article.difficulty)}</Badge>
        </div>
        <h2 className="mt-4 text-xl font-bold leading-7 text-[#17201b]">
          <Link href={`/articles/${article.slug}`} className="hover:text-[#0f766e]">
            {article.title}
          </Link>
        </h2>
        <p className="mt-3 flex-1 text-sm leading-6 text-[#5b6861]">
          {article.summary}
        </p>
        <div className="mt-5 flex items-center justify-between gap-3 text-xs text-[#66736c]">
          <span>{formatDate(article.publishedAt)}</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {article.readingTime} phút
          </span>
        </div>
        <Link
          href={`/articles/${article.slug}`}
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#0f766e] hover:text-[#115e59]"
        >
          Đọc bài học
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
