"use client";

import Link from "next/link";
import { ArrowRight, BookMarked, CheckCircle2 } from "lucide-react";
import {
  createKnowledgeSlug,
  getKnowledgeModuleUrl,
  knowledgePillars,
} from "@/data/knowledge-library";
import { getKnowledgeProgressId } from "@/lib/knowledge/progress-storage";
import { useKnowledgeProgress } from "@/lib/knowledge/use-knowledge-progress";

export function KnowledgeDashboardCard() {
  const { progress } = useKnowledgeProgress();
  const allModules = knowledgePillars.flatMap((pillar) =>
    pillar.modules.map((knowledgeModule) => {
      const moduleSlug = createKnowledgeSlug(knowledgeModule.title);

      return {
        pillar,
        knowledgeModule,
        moduleSlug,
        id: getKnowledgeProgressId(pillar.slug, moduleSlug),
        href: getKnowledgeModuleUrl(pillar, knowledgeModule),
      };
    }),
  );
  const completedCount = allModules.filter((item) =>
    progress.completedModules.includes(item.id),
  ).length;
  const percent =
    allModules.length > 0 ? Math.round((completedCount / allModules.length) * 100) : 0;
  const nextModule =
    allModules.find((item) => !progress.completedModules.includes(item.id)) ?? allModules[0];

  return (
    <section className="rounded-md border border-[#d0ded3] bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <BookMarked className="h-5 w-5 text-[#0f766e]" aria-hidden="true" />
            <h2 className="text-xl font-bold text-[#17201b]">Hôm nay nên học gì tiếp?</h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-[#5b6861]">
            Thư viện kiến thức đang theo dõi tiến độ học module của bạn trên máy này.
          </p>
        </div>
        <div className="min-w-28 rounded-md border border-[#b9d9c5] bg-[#f2fbf4] px-4 py-3 text-center">
          <p className="text-2xl font-black text-[#0f766e]">{percent}%</p>
          <p className="text-xs font-semibold text-[#66736c]">toàn thư viện</p>
        </div>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#e8ede4]">
        <div className="h-full rounded-full bg-[#0f766e]" style={{ width: `${percent}%` }} />
      </div>

      <div className="mt-5 rounded-md border border-[#e0e5dc] bg-[#fffdf8] p-4">
        <p className="text-xs font-bold uppercase text-[#0f766e]">
          {completedCount === allModules.length ? "Đã hoàn thành thư viện" : "Module tiếp theo"}
        </p>
        <h3 className="mt-2 text-lg font-bold leading-7 text-[#17201b]">
          {nextModule?.knowledgeModule.title}
        </h3>
        <p className="mt-2 text-sm leading-6 text-[#5b6861]">
          {nextModule?.knowledgeModule.goal}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold text-[#66736c]">
          <span>{nextModule?.pillar.title}</span>
          <span aria-hidden="true">/</span>
          <span>
            {completedCount}/{allModules.length} module đã học
          </span>
        </div>
        <Link
          href={nextModule?.href ?? "/knowledge"}
          className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#0f766e] hover:text-[#115e59]"
        >
          {completedCount === allModules.length ? "Xem lại thư viện" : "Học tiếp"}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      {completedCount > 0 ? (
        <p className="mt-4 flex gap-2 text-sm leading-6 text-[#4c5d54]">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0f766e]" aria-hidden="true" />
          Bạn đã bắt đầu xây nền kiến thức. Giữ nhịp nhỏ mỗi ngày sẽ tốt hơn học dồn một lần.
        </p>
      ) : null}
    </section>
  );
}
