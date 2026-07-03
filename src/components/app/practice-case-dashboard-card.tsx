"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Scale } from "lucide-react";
import { practiceCases } from "@/data/practice-cases";
import { usePracticeCaseProgress } from "@/lib/practice-cases/use-practice-case-progress";

export function PracticeCaseDashboardCard() {
  const { progress } = usePracticeCaseProgress();
  const completedSlugs = new Set(progress.results.map((item) => item.slug));
  const completedCount = completedSlugs.size;
  const nextCase =
    practiceCases.find((item) => !completedSlugs.has(item.slug)) ?? practiceCases[0];

  return (
    <section className="rounded-md border border-[#d0ded3] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-[#d65a31]" aria-hidden="true" />
            <h2 className="text-xl font-bold text-[#17201b]">Luyện quyết định</h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-[#5b6861]">
            Case giả lập buộc bạn chọn cách xử lý trước khi đọc phần phân tích.
          </p>
        </div>
        <div className="shrink-0 rounded-md border border-[#e2d3a7] bg-[#fff8df] px-3 py-2 text-center">
          <p className="font-black text-[#8a5a0a]">
            {completedCount}/{practiceCases.length}
          </p>
          <p className="text-[11px] font-semibold text-[#80671d]">đã hoàn thành</p>
        </div>
      </div>

      <div className="mt-4 rounded-md border border-[#e0e5dc] bg-[#fffdf8] p-4">
        <p className="text-xs font-bold uppercase text-[#0f766e]">
          {completedCount === practiceCases.length ? "Làm lại để nâng điểm" : "Tình huống tiếp theo"}
        </p>
        <h3 className="mt-2 font-bold leading-6 text-[#17201b]">{nextCase.title}</h3>
        <p className="mt-2 text-sm leading-6 text-[#5b6861]">{nextCase.summary}</p>
        <Link
          href={`/cases/${nextCase.slug}`}
          className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#0f766e] hover:text-[#115e59]"
        >
          Bắt đầu xử lý
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      {completedCount > 0 ? (
        <p className="mt-4 flex gap-2 text-sm leading-6 text-[#4c5d54]">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0f766e]" aria-hidden="true" />
          Kết quả được lưu trên thiết bị để bạn quay lại so sánh quy trình.
        </p>
      ) : null}
    </section>
  );
}
