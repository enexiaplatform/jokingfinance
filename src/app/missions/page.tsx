import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { PublicFooter } from "@/components/marketing/public-footer";
import { PublicNav } from "@/components/marketing/public-nav";
import { Badge } from "@/components/ui/badge";
import { Disclaimer } from "@/components/ui/disclaimer";
import { sampleMissions } from "@/data/sample-content";
import { formatDifficulty } from "@/lib/format";

export const metadata = {
  title: "Nhiệm vụ - JokingFinance",
  description: "Nhiệm vụ thực hành giúp người mới luyện tài chính bằng điểm ảo.",
};

export default function MissionsPage() {
  return (
    <>
      <PublicNav />
      <main className="bg-[#fffdf8]">
        <section className="border-b border-[#d9ddd3] bg-[#edf5ee] px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Badge tone="green">Nhiệm vụ thực hành</Badge>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-normal text-[#17201b]">
              Nhiệm vụ nhỏ để biến bài học thành hành động.
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-[#5b6861]">
              Mỗi nhiệm vụ tập trung vào một thói quen: phân bổ, viết luận điểm,
              nhận diện sợ bỏ lỡ, xem lại danh mục và quản trị rủi ro.
            </p>
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-3">
            {sampleMissions.map((mission) => (
              <article
                key={mission.slug}
                className="flex h-full flex-col rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap gap-2">
                  <Badge tone="green">{mission.category}</Badge>
                  <Badge tone="neutral">{formatDifficulty(mission.difficulty)}</Badge>
                </div>
                <h2 className="mt-4 text-xl font-bold leading-7 text-[#17201b]">
                  <Link href={`/missions/${mission.slug}`} className="hover:text-[#0f766e]">
                    {mission.title}
                  </Link>
                </h2>
                <p className="mt-3 flex-1 text-sm leading-6 text-[#5b6861]">
                  {mission.description}
                </p>
                <div className="mt-5 flex items-center gap-2 text-sm text-[#66736c]">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                  {mission.estimatedMinutes} phút
                </div>
                <Link
                  href={`/missions/${mission.slug}`}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#0f766e] hover:text-[#115e59]"
                >
                  Xem nhiệm vụ
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
          <div className="mx-auto mt-8 max-w-7xl">
            <Disclaimer />
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
