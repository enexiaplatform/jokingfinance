"use client";

import { CheckCircle2 } from "lucide-react";
import { getKnowledgeProgressId } from "@/lib/knowledge/progress-storage";
import { useKnowledgeProgress } from "@/lib/knowledge/use-knowledge-progress";

type KnowledgeModuleProgressProps = {
  pillarSlug: string;
  moduleSlug: string;
};

export function KnowledgeModuleProgress({
  pillarSlug,
  moduleSlug,
}: KnowledgeModuleProgressProps) {
  const { progress, setModuleCompleted } = useKnowledgeProgress();
  const moduleId = getKnowledgeProgressId(pillarSlug, moduleSlug);
  const completed = progress.completedModules.includes(moduleId);

  function toggleCompleted() {
    void setModuleCompleted(moduleId, !completed);
  }

  return (
    <section className="rounded-md border border-[#b9d9c5] bg-[#f2fbf4] p-5">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#0f766e]" aria-hidden="true" />
        <div>
          <h2 className="text-xl font-bold text-[#17201b]">
            {completed ? "Đã học module này" : "Đánh dấu tiến độ"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#4c5d54]">
            Trạng thái này được lưu trên trình duyệt. Khi bạn đăng nhập, app sẽ đồng bộ lên Supabase.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={toggleCompleted}
        className="mt-4 inline-flex min-h-10 w-full items-center justify-center rounded-md bg-[#0f766e] px-3 text-sm font-bold text-white hover:bg-[#115e59]"
      >
        {completed ? "Bỏ đánh dấu đã học" : "Đánh dấu đã học"}
      </button>
    </section>
  );
}
