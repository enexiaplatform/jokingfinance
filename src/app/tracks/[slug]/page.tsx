import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BookOpen, CheckCircle2, Clock, Target } from "lucide-react";
import { ArticleCard } from "@/components/marketing/article-card";
import { PublicFooter } from "@/components/marketing/public-footer";
import { PublicNav } from "@/components/marketing/public-nav";
import { TrackProgressPanel } from "@/components/marketing/track-progress-panel";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { Disclaimer } from "@/components/ui/disclaimer";
import {
  findArticle,
  findLearningTrack,
  findMission,
  learningTracks,
} from "@/data/sample-content";
import { formatDifficulty } from "@/lib/format";
import { getSiteUrl } from "@/lib/site-url";

type TrackPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return learningTracks.map((track) => ({ slug: track.slug }));
}

export async function generateMetadata({ params }: TrackPageProps) {
  const { slug } = await params;
  const track = findLearningTrack(slug);

  return {
    title: track ? `${track.title} - JokingFinance` : "Lộ trình học - JokingFinance",
    description: track?.description,
    alternates: {
      canonical: new URL(`/tracks/${slug}`, getSiteUrl()).toString(),
    },
  };
}

export default async function TrackPage({ params }: TrackPageProps) {
  const { slug } = await params;
  const track = findLearningTrack(slug);

  if (!track) {
    notFound();
  }

  const articles = track.articleSlugs
    .map((articleSlug) => findArticle(articleSlug))
    .filter((article) => article !== null);
  const missions = track.missionSlugs
    .map((missionSlug) => findMission(missionSlug))
    .filter((mission) => mission !== null);

  return (
    <>
      <PublicNav />
      <main className="bg-[#fffdf8]">
        <section className="border-b border-[#d9ddd3] bg-[#edf5ee] px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="gold">Lộ trình học</Badge>
                <Badge tone={track.level === "intermediate" ? "blue" : "green"}>
                  {formatDifficulty(track.level)}
                </Badge>
                <span className="inline-flex items-center gap-1 text-sm text-[#66736c]">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                  {track.estimatedMinutes} phút
                </span>
              </div>
              <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight tracking-normal text-[#17201b] md:text-5xl">
                {track.title}
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-[#43534a]">
                {track.description}
              </p>
            </div>

            <div className="rounded-md border border-[#d0ded3] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-[#0f766e]" aria-hidden="true" />
                <h2 className="text-lg font-bold text-[#17201b]">Sau lộ trình này</h2>
              </div>
              <p className="mt-3 text-sm leading-6 text-[#4c5d54]">{track.outcome}</p>
              <ButtonLink href="/app/simulator" className="mt-5 w-full justify-center">
                Vào mô phỏng
              </ButtonLink>
            </div>
          </div>
        </section>

        <section className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[#0f766e]" aria-hidden="true" />
                <h2 className="text-2xl font-bold text-[#17201b]">Bài học theo thứ tự</h2>
              </div>
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                {articles.map((article) => (
                  <ArticleCard key={article.slug} article={article} />
                ))}
              </div>
            </div>

            <aside className="space-y-5">
              <TrackProgressPanel
                trackSlug={track.slug}
                articles={articles.map((article) => ({
                  slug: article.slug,
                  title: article.title,
                }))}
                missions={missions.map((mission) => ({
                  slug: mission.slug,
                  title: mission.title,
                }))}
              />

              <div className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
                <h2 className="text-xl font-bold text-[#17201b]">Nhiệm vụ luyện tập</h2>
                <div className="mt-4 space-y-4">
                  {missions.map((mission, index) => (
                    <article key={mission.slug} className="border-t border-[#e8ede4] pt-4 first:border-t-0 first:pt-0">
                      <p className="text-xs font-bold uppercase text-[#0f766e]">
                        Nhiệm vụ {index + 1}
                      </p>
                      <h3 className="mt-2 text-base font-bold leading-6 text-[#17201b]">
                        {mission.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-[#5b6861]">
                        {mission.description}
                      </p>
                      <Link
                        href={`/missions/${mission.slug}`}
                        className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#0f766e] hover:text-[#115e59]"
                      >
                        Xem nhiệm vụ
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </article>
                  ))}
                </div>
              </div>

              <div className="rounded-md border border-[#b9d9c5] bg-[#f2fbf4] p-5">
                <h2 className="text-xl font-bold text-[#17201b]">Cách học gợi ý</h2>
                <ul className="mt-4 space-y-3">
                  {[
                    "Đọc bài đầu tiên trước khi mở mô phỏng.",
                    "Làm ít nhất một nhiệm vụ sau mỗi nhóm bài.",
                    "Ghi lại điều bạn đổi ý sau khi xem dữ liệu thật.",
                  ].map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-6 text-[#4c5d54]">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0f766e]" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Disclaimer />
            </aside>
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
