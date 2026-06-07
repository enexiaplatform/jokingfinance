import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Layers3,
  Newspaper,
  Radar,
} from "lucide-react";
import { SaveContentButton } from "@/components/app/save-content-button";
import { PublicFooter } from "@/components/marketing/public-footer";
import { PublicNav } from "@/components/marketing/public-nav";
import { Badge } from "@/components/ui/badge";
import { Disclaimer } from "@/components/ui/disclaimer";
import { getNewsBriefBySlug, newsBriefs, type NewsImpact } from "@/data/news-intelligence";
import { formatDate } from "@/lib/format";

type NewsDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const impactLabels: Record<NewsImpact, string> = {
  low: "Tác động thấp",
  medium: "Tác động vừa",
  high: "Tác động cao",
};

const statusLabels = {
  evergreen: "Khung học tập",
  watchlist: "Cần theo dõi",
  developing: "Đang phát triển",
};

export function generateStaticParams() {
  return newsBriefs.map((brief) => ({
    slug: brief.slug,
  }));
}

export async function generateMetadata({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const brief = getNewsBriefBySlug(slug);

  return {
    title: brief ? `${brief.title} - Tin tức phân tích - JokingFinance` : "Tin tức phân tích - JokingFinance",
    description: brief?.summary,
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const brief = getNewsBriefBySlug(slug);

  if (!brief) {
    notFound();
  }

  return (
    <>
      <PublicNav />
      <main className="bg-[#fffdf8]">
        <section className="border-b border-[#d9ddd3] bg-[#edf5ee] px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#0f766e] hover:text-[#115e59]"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Quay lại bàn tin
            </Link>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <Badge tone={brief.impact === "high" ? "gold" : "green"}>
                {impactLabels[brief.impact]}
              </Badge>
              <Badge tone="neutral">{statusLabels[brief.status]}</Badge>
              <span className="text-sm font-semibold text-[#66736c]">
                {brief.theme} · {formatDate(brief.publishedAt)} · {brief.readingTime} phút
              </span>
            </div>
            <h1 className="mt-5 text-4xl font-black leading-tight tracking-normal text-[#17201b] md:text-5xl">
              {brief.title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#43534a]">{brief.summary}</p>
            <div className="mt-6">
              <SaveContentButton
                id={`news:${brief.slug}`}
                kind="news"
                title={brief.title}
                summary={brief.summary}
                href={`/news/${brief.slug}`}
              />
            </div>
          </div>
        </section>

        <section className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="grid gap-6">
              <article className="rounded-md border border-[#b9d9c5] bg-[#f2fbf4] p-5 shadow-sm">
                <div className="flex gap-3">
                  <Radar className="mt-0.5 h-5 w-5 shrink-0 text-[#0f766e]" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-bold uppercase text-[#0f766e]">Câu hỏi chính</p>
                    <h2 className="mt-2 text-2xl font-bold leading-8 text-[#17201b]">
                      {brief.keyQuestion}
                    </h2>
                  </div>
                </div>
              </article>

              <article className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <Newspaper className="h-5 w-5 text-[#0f766e]" aria-hidden="true" />
                  <h2 className="text-2xl font-bold text-[#17201b]">Vì sao đáng chú ý?</h2>
                </div>
                <ul className="mt-4 grid gap-3">
                  {brief.whyItMatters.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-6 text-[#4c5d54]">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0f766e]" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <Layers3 className="h-5 w-5 text-[#0f766e]" aria-hidden="true" />
                  <h2 className="text-2xl font-bold text-[#17201b]">Tín hiệu cần theo dõi</h2>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {brief.signalsToWatch.map((item) => (
                    <div key={item} className="rounded-md border border-[#e0e5dc] bg-[#fffdf8] p-3">
                      <p className="text-sm font-semibold leading-6 text-[#17201b]">{item}</p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-md border border-[#efc1af] bg-[#fff3ef] p-5">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-[#9a3412]" aria-hidden="true" />
                  <h2 className="text-2xl font-bold text-[#9a3412]">Lỗi đọc sai thường gặp</h2>
                </div>
                <ul className="mt-4 grid gap-3">
                  {brief.commonMisreadings.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-6 text-[#7c3a20]">
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#d65a31]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
                <h2 className="text-2xl font-bold text-[#17201b]">Cách dùng brief này trong mô phỏng</h2>
                <ol className="mt-4 grid gap-3">
                  <li className="rounded-md border border-[#e0e5dc] bg-[#fffdf8] p-3 text-sm leading-6 text-[#4c5d54]">
                    1. Viết lại tin bằng một câu không dùng cảm xúc.
                  </li>
                  <li className="rounded-md border border-[#e0e5dc] bg-[#fffdf8] p-3 text-sm leading-6 text-[#4c5d54]">
                    2. Chọn một tín hiệu cần theo dõi và ghi vào nhật ký.
                  </li>
                  <li className="rounded-md border border-[#e0e5dc] bg-[#fffdf8] p-3 text-sm leading-6 text-[#4c5d54]">
                    3. Nếu định giao dịch trong mô phỏng, viết điều kiện khiến luận điểm sai trước.
                  </li>
                </ol>
              </article>
            </div>

            <aside className="space-y-5">
              <div className="rounded-md border border-[#d0ded3] bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-[#0f766e]" aria-hidden="true" />
                  <h2 className="text-xl font-bold text-[#17201b]">Học tiếp phần liên quan</h2>
                </div>
                <div className="mt-4 grid gap-3">
                  {brief.knowledgeLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="inline-flex items-center justify-between gap-2 rounded-md border border-[#e0e5dc] bg-[#fffdf8] px-3 py-2 text-sm font-semibold text-[#0f766e] hover:border-[#0f766e]"
                    >
                      <span>{link.title}</span>
                      <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
                <h2 className="text-xl font-bold text-[#17201b]">Vùng bị ảnh hưởng</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {brief.affectedAreas.map((item) => (
                    <span key={item} className="rounded-full border border-[#d7ded5] bg-[#fffdf8] px-2.5 py-1 text-xs font-semibold text-[#4a5a52]">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
                <h2 className="text-xl font-bold text-[#17201b]">Ghi chú nguồn</h2>
                <p className="mt-3 text-sm leading-6 text-[#5b6861]">{brief.sourceNote}</p>
              </div>
            </aside>
          </div>
          <Disclaimer className="mx-auto mt-8 max-w-5xl" />
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
