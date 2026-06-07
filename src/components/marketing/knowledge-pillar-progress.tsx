"use client";

import { getKnowledgeProgressId } from "@/lib/knowledge/progress-storage";
import { useKnowledgeProgress } from "@/lib/knowledge/use-knowledge-progress";

type KnowledgePillarProgressProps = {
  pillarSlug: string;
  moduleSlugs: string[];
};

export function KnowledgePillarProgress({
  pillarSlug,
  moduleSlugs,
}: KnowledgePillarProgressProps) {
  const { progress } = useKnowledgeProgress();
  const completedCount = moduleSlugs.filter((moduleSlug) =>
    progress.completedModules.includes(getKnowledgeProgressId(pillarSlug, moduleSlug)),
  ).length;
  const percent =
    moduleSlugs.length > 0 ? Math.round((completedCount / moduleSlugs.length) * 100) : 0;

  return (
    <div className="mt-4 rounded-md border border-[#e0e5dc] bg-white p-3">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-bold text-[#17201b]">Tiến độ học</span>
        <span className="font-black text-[#0f766e]">{percent}%</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e8ede4]">
        <div className="h-full rounded-full bg-[#0f766e]" style={{ width: `${percent}%` }} />
      </div>
      <p className="mt-2 text-xs font-semibold text-[#66736c]">
        {completedCount}/{moduleSlugs.length} module đã học
      </p>
    </div>
  );
}
