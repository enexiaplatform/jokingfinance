import Link from "next/link";
import { ArrowRight, Clock, Filter, Search } from "lucide-react";
import { PublicFooter } from "@/components/marketing/public-footer";
import { PublicNav } from "@/components/marketing/public-nav";
import { Badge } from "@/components/ui/badge";
import { Disclaimer } from "@/components/ui/disclaimer";
import { sampleMissions } from "@/data/sample-content";
import { formatDifficulty } from "@/lib/format";

export const metadata = {
  title: "Nhiệm vụ - JokingFinance",
  description: "Nhiệm vụ thực hành giúp người mới luyện tài chính bằng điểm ảo.",
  alternates: { canonical: "/missions" },
};

type MissionsPageProps = {
  searchParams?: Promise<{
    q?: string;
    difficulty?: string;
  }>;
};

export default async function MissionsPage({ searchParams }: MissionsPageProps) {
  const params = await searchParams;
  const query = params?.q?.trim().toLocaleLowerCase("vi") ?? "";
  const difficulty = params?.difficulty ?? "";
  const filteredMissions = sampleMissions.filter((mission) => {
    const matchesQuery = query
      ? `${mission.title} ${mission.description} ${mission.category}`
          .toLocaleLowerCase("vi")
          .includes(query)
      : true;
    const matchesDifficulty = difficulty
      ? mission.difficulty === difficulty
      : true;

    return matchesQuery && matchesDifficulty;
  });

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

        <section className="border-b border-[#e0e5dc] bg-white px-4 py-8 sm:px-6 lg:px-8">
          <form className="mx-auto grid max-w-7xl gap-3 rounded-md border border-[#d9ddd3] bg-[#fffdf8] p-3 shadow-sm md:grid-cols-[1fr_240px_auto]">
            <label className="flex min-h-11 items-center gap-2 rounded-md border border-[#d9ddd3] bg-white px-3">
              <Search className="h-4 w-4 text-[#66736c]" aria-hidden="true" />
              <input
                name="q"
                defaultValue={params?.q ?? ""}
                placeholder="Tìm theo kỹ năng hoặc nhiệm vụ..."
                className="min-w-0 flex-1 bg-transparent text-sm text-[#17201b] outline-none"
              />
            </label>
            <label className="flex min-h-11 items-center gap-2 rounded-md border border-[#d9ddd3] bg-white px-3">
              <Filter className="h-4 w-4 text-[#66736c]" aria-hidden="true" />
              <select
                name="difficulty"
                defaultValue={difficulty}
                className="min-w-0 flex-1 bg-transparent text-sm text-[#17201b] outline-none"
              >
                <option value="">Mọi độ khó</option>
                <option value="beginner">Người mới</option>
                <option value="intermediate">Trung cấp</option>
                <option value="advanced">Nâng cao</option>
              </select>
            </label>
            <button
              type="submit"
              className="min-h-11 rounded-md bg-[#0f766e] px-4 text-sm font-bold text-white hover:bg-[#115e59]"
            >
              Lọc nhiệm vụ
            </button>
          </form>
        </section>

        <section className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredMissions.map((mission) => (
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
          {filteredMissions.length === 0 ? (
            <div className="mx-auto max-w-7xl rounded-md border border-[#e0e5dc] bg-white p-8 text-center">
              <p className="font-bold text-[#17201b]">Chưa có nhiệm vụ phù hợp.</p>
              <p className="mt-2 text-sm text-[#5b6861]">
                Thử từ khóa rộng hơn hoặc chọn lại độ khó.
              </p>
              <Link
                href="/missions"
                className="mt-4 inline-flex min-h-10 items-center rounded-md border border-[#b7c4ba] px-4 text-sm font-bold text-[#17201b]"
              >
                Xóa bộ lọc
              </Link>
            </div>
          ) : null}
          <div className="mx-auto mt-8 max-w-7xl">
            <Disclaimer />
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
