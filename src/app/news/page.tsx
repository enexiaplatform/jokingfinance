import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Filter,
  Layers3,
  Newspaper,
  Radar,
  Search,
} from "lucide-react";
import { PublicFooter } from "@/components/marketing/public-footer";
import { PublicNav } from "@/components/marketing/public-nav";
import { Badge } from "@/components/ui/badge";
import { Disclaimer } from "@/components/ui/disclaimer";
import { newsBriefs, newsLenses, getNewsThemes, type NewsImpact } from "@/data/news-intelligence";
import { formatDate } from "@/lib/format";

type NewsPageProps = {
  searchParams?: Promise<{
    q?: string;
    theme?: string;
    impact?: NewsImpact;
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

export const metadata = {
  title: "Tin tức phân tích - JokingFinance",
  description:
    "Bàn phân tích tin tức tài chính: biến tin thị trường thành câu hỏi, tín hiệu cần theo dõi và bài học liên quan.",
};

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const params = await searchParams;
  const query = params?.q?.trim().toLowerCase() ?? "";
  const theme = params?.theme ?? "";
  const impact = params?.impact ?? "";
  const themes = getNewsThemes();
  const filteredBriefs = newsBriefs.filter((brief) => {
    const matchesQuery = query
      ? `${brief.title} ${brief.summary} ${brief.theme}`.toLowerCase().includes(query)
      : true;
    const matchesTheme = theme ? brief.theme === theme : true;
    const matchesImpact = impact ? brief.impact === impact : true;

    return matchesQuery && matchesTheme && matchesImpact;
  });

  return (
    <>
      <PublicNav />
      <main className="bg-[#fffdf8]">
        <section className="border-b border-[#d9ddd3] bg-[#edf5ee] px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div>
              <Badge tone="green">News Intelligence</Badge>
              <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight tracking-normal text-[#17201b] md:text-5xl">
                Đọc tin tức như một người đang học ra quyết định.
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-[#43534a]">
                Mỗi tin được bóc thành câu hỏi chính, tác động, tín hiệu cần theo dõi, lỗi đọc sai
                thường gặp và module kiến thức liên quan. Đây là lớp phân tích giáo dục, không phải
                khuyến nghị mua bán.
              </p>
            </div>

            <div className="grid gap-3">
              {newsLenses.map((lens, index) => (
                <div key={lens.label} className="rounded-md border border-[#d0ded3] bg-white p-4 shadow-sm">
                  <p className="text-xs font-bold uppercase text-[#0f766e]">Lớp đọc {index + 1}</p>
                  <h2 className="mt-1 font-bold text-[#17201b]">{lens.label}</h2>
                  <p className="mt-1 text-sm leading-6 text-[#5b6861]">{lens.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-[#e0e5dc] bg-white px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <form className="grid gap-3 rounded-md border border-[#d9ddd3] bg-[#fffdf8] p-3 shadow-sm lg:grid-cols-[1fr_260px_220px_auto]">
              <label className="flex min-h-11 items-center gap-2 rounded-md border border-[#d9ddd3] bg-white px-3">
                <Search className="h-4 w-4 text-[#66736c]" aria-hidden="true" />
                <input
                  name="q"
                  defaultValue={params?.q ?? ""}
                  placeholder="Tìm tin, chủ đề hoặc tín hiệu..."
                  className="min-w-0 flex-1 bg-transparent text-sm text-[#17201b] outline-none"
                />
              </label>
              <label className="flex min-h-11 items-center gap-2 rounded-md border border-[#d9ddd3] bg-white px-3">
                <Filter className="h-4 w-4 text-[#66736c]" aria-hidden="true" />
                <select name="theme" defaultValue={theme} className="min-w-0 flex-1 bg-transparent text-sm text-[#17201b] outline-none">
                  <option value="">Tất cả chủ đề</option>
                  {themes.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
              <select
                name="impact"
                defaultValue={impact}
                className="min-h-11 rounded-md border border-[#d9ddd3] bg-white px-3 text-sm text-[#17201b]"
              >
                <option value="">Mọi mức tác động</option>
                <option value="high">Tác động cao</option>
                <option value="medium">Tác động vừa</option>
                <option value="low">Tác động thấp</option>
              </select>
              <button
                type="submit"
                className="min-h-11 rounded-md bg-[#0f766e] px-4 text-sm font-semibold text-white hover:bg-[#115e59]"
              >
                Lọc tin
              </button>
            </form>
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Badge tone="gold">Bản tin phân tích</Badge>
                <h2 className="mt-3 text-3xl font-bold tracking-normal text-[#17201b]">
                  {filteredBriefs.length} brief đang có trong bàn tin.
                </h2>
              </div>
              <p className="max-w-2xl text-sm leading-6 text-[#5b6861]">
                Bản demo dùng brief giáo dục có kiểm soát thay vì tự bịa tin realtime. Khi nối Sanity
                hoặc nguồn tin thật, các khối dưới đây sẽ là khung biên tập để nhập tin nhanh hơn.
              </p>
            </div>

            <div className="mt-8 grid gap-6">
              {filteredBriefs.map((brief) => (
                <article key={brief.slug} className="rounded-md border border-[#dce4da] bg-white p-5 shadow-sm">
                  <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge tone={brief.impact === "high" ? "gold" : "green"}>
                          {impactLabels[brief.impact]}
                        </Badge>
                        <Badge tone="neutral">{statusLabels[brief.status]}</Badge>
                        <span className="text-xs font-semibold text-[#66736c]">
                          {brief.theme} · {formatDate(brief.publishedAt)} · {brief.readingTime} phút
                        </span>
                      </div>

                      <h3 className="mt-4 text-2xl font-black leading-8 text-[#17201b]">
                        <Link href={`/news/${brief.slug}`} className="hover:text-[#0f766e]">
                          {brief.title}
                        </Link>
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-[#5b6861]">{brief.summary}</p>

                      <div className="mt-5 rounded-md border border-[#b9d9c5] bg-[#f2fbf4] p-4">
                        <div className="flex gap-3">
                          <Radar className="mt-0.5 h-5 w-5 shrink-0 text-[#0f766e]" aria-hidden="true" />
                          <div>
                            <p className="text-sm font-bold uppercase text-[#0f766e]">Câu hỏi chính</p>
                            <p className="mt-1 font-semibold leading-7 text-[#17201b]">
                              {brief.keyQuestion}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 grid gap-4 md:grid-cols-2">
                        <div className="rounded-md border border-[#e0e5dc] bg-[#fffdf8] p-4">
                          <div className="flex items-center gap-2">
                            <Newspaper className="h-4 w-4 text-[#0f766e]" aria-hidden="true" />
                            <h4 className="font-bold text-[#17201b]">Vì sao đáng chú ý?</h4>
                          </div>
                          <ul className="mt-3 grid gap-2">
                            {brief.whyItMatters.map((item) => (
                              <li key={item} className="text-sm leading-6 text-[#4c5d54]">
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="rounded-md border border-[#e0e5dc] bg-[#fffdf8] p-4">
                          <div className="flex items-center gap-2">
                            <Layers3 className="h-4 w-4 text-[#0f766e]" aria-hidden="true" />
                            <h4 className="font-bold text-[#17201b]">Tín hiệu cần theo dõi</h4>
                          </div>
                          <ul className="mt-3 grid gap-2">
                            {brief.signalsToWatch.map((item) => (
                              <li key={item} className="text-sm leading-6 text-[#4c5d54]">
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="mt-5 rounded-md border border-[#efc1af] bg-[#fff3ef] p-4">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-[#9a3412]" aria-hidden="true" />
                          <h4 className="font-bold text-[#9a3412]">Lỗi đọc sai thường gặp</h4>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {brief.commonMisreadings.map((item) => (
                            <span key={item} className="rounded-full border border-[#efc1af] bg-white px-3 py-1 text-xs font-semibold text-[#7c3a20]">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>

                      <Link
                        href={`/news/${brief.slug}`}
                        className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#0f766e] hover:text-[#115e59]"
                      >
                        Mở phân tích chi tiết
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </div>

                    <aside className="grid content-start gap-4">
                      <div className="rounded-md border border-[#e0e5dc] bg-[#fffdf8] p-4">
                        <h4 className="font-bold text-[#17201b]">Vùng bị ảnh hưởng</h4>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {brief.affectedAreas.map((item) => (
                            <span key={item} className="rounded-full border border-[#d7ded5] bg-white px-2.5 py-1 text-xs font-semibold text-[#4a5a52]">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-md border border-[#d0ded3] bg-white p-4">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-[#0f766e]" aria-hidden="true" />
                          <h4 className="font-bold text-[#17201b]">Học tiếp phần liên quan</h4>
                        </div>
                        <div className="mt-3 grid gap-2">
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

                      <div className="rounded-md border border-[#e0e5dc] bg-white p-4">
                        <h4 className="font-bold text-[#17201b]">Ghi chú nguồn</h4>
                        <p className="mt-2 text-sm leading-6 text-[#5b6861]">{brief.sourceNote}</p>
                      </div>
                    </aside>
                  </div>
                </article>
              ))}
            </div>

            {filteredBriefs.length === 0 ? (
              <div className="rounded-md border border-[#e0e5dc] bg-white p-8 text-center">
                <p className="font-semibold text-[#17201b]">Chưa có brief phù hợp.</p>
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
