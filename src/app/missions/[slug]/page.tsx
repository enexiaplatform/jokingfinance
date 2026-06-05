import Link from "next/link";
import { CheckCircle2, Clock, Target } from "lucide-react";
import { PublicFooter } from "@/components/marketing/public-footer";
import { PublicNav } from "@/components/marketing/public-nav";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { Disclaimer } from "@/components/ui/disclaimer";
import { findMission } from "@/data/sample-content";
import { formatDifficulty } from "@/lib/format";

type MissionPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: MissionPageProps) {
  const { slug } = await params;
  const mission = findMission(slug);

  return {
    title: mission ? `${mission.title} - JokingFinance` : "Nhiệm vụ - JokingFinance",
    description: mission?.description,
  };
}

export default async function MissionPage({ params }: MissionPageProps) {
  const { slug } = await params;
  const mission = findMission(slug);

  if (!mission) {
    return (
      <>
        <PublicNav />
        <main className="bg-[#fffdf8] px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-[#17201b]">Không tìm thấy nhiệm vụ.</h1>
          <ButtonLink href="/missions" className="mt-6">
            Quay lại nhiệm vụ
          </ButtonLink>
        </main>
        <PublicFooter />
      </>
    );
  }

  return (
    <>
      <PublicNav />
      <main className="bg-[#fffdf8]">
        <section className="border-b border-[#d9ddd3] bg-[#edf5ee] px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="green">{mission.category}</Badge>
              <Badge tone="neutral">{formatDifficulty(mission.difficulty)}</Badge>
              <span className="inline-flex items-center gap-1 text-sm text-[#66736c]">
                <Clock className="h-4 w-4" aria-hidden="true" />
                {mission.estimatedMinutes} phút
              </span>
            </div>
            <h1 className="mt-5 text-4xl font-black leading-tight tracking-normal text-[#17201b] md:text-5xl">
              {mission.title}
            </h1>
            <p className="mt-5 text-lg leading-8 text-[#43534a]">
              {mission.description}
            </p>
            <ButtonLink href={`/app/missions?start=${mission.slug}`} className="mt-8">
              Bắt đầu luyện tập
            </ButtonLink>
          </div>
        </section>

        <section className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-4xl gap-6">
            <div className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-[#0f766e]" aria-hidden="true" />
                <h2 className="text-xl font-bold text-[#17201b]">Mục tiêu</h2>
              </div>
              <p className="mt-3 leading-7 text-[#4c5d54]">{mission.objective}</p>
            </div>

            <div className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
              <h2 className="text-xl font-bold text-[#17201b]">Cách thực hiện</h2>
              <ol className="mt-4 space-y-3">
                {mission.instructions.map((instruction, index) => (
                  <li key={instruction} className="flex gap-3 text-[#4c5d54]">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#0f766e] font-mono text-xs font-bold text-white">
                      {index + 1}
                    </span>
                    <span className="leading-7">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
              <h2 className="text-xl font-bold text-[#17201b]">Tiêu chí hoàn thành</h2>
              <ul className="mt-4 space-y-3">
                {mission.successCriteria.map((criteria) => (
                  <li key={criteria} className="flex gap-3 text-[#4c5d54]">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#0f766e]" aria-hidden="true" />
                    <span className="leading-7">{criteria}</span>
                  </li>
                ))}
              </ul>
            </div>

            {mission.relatedArticleSlug ? (
              <div className="rounded-md border border-[#b9d9c5] bg-[#f2fbf4] p-5">
                <h2 className="text-xl font-bold text-[#17201b]">Bài học liên quan</h2>
                <p className="mt-2 text-sm leading-6 text-[#5b6861]">
                  Nhiệm vụ này được thiết kế để luyện tập ngay sau bài học liên quan.
                </p>
                <Link
                  href={`/articles/${mission.relatedArticleSlug}`}
                  className="mt-4 inline-flex text-sm font-semibold text-[#0f766e] hover:text-[#115e59]"
                >
                  Đọc bài học liên quan
                </Link>
              </div>
            ) : null}

            <Disclaimer />
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
