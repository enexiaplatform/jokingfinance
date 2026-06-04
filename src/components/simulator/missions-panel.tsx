"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Clock, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Disclaimer } from "@/components/ui/disclaimer";
import { formatDifficulty, formatMissionStatus } from "@/lib/format";
import { useVirtualPortfolio } from "./use-virtual-portfolio";

export function MissionsPanel() {
  const searchParams = useSearchParams();
  const { state, loading, message, updateMissionProgress } = useVirtualPortfolio();
  const [notesBySlug, setNotesBySlug] = useState<Record<string, string>>({});

  useEffect(() => {
    const startSlug = searchParams.get("start");
    if (startSlug) {
      updateMissionProgress(startSlug, "in_progress");
    }
  }, [searchParams, updateMissionProgress]);

  if (loading) {
    return <div className="rounded-md border border-[#d9ddd3] bg-white p-6">Đang tải nhiệm vụ...</div>;
  }

  const progressBySlug = new Map(
    state.missionProgress.map((progress) => [progress.missionSlug, progress]),
  );

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-bold text-[#17201b]">Nhiệm vụ thực hành</h1>
        <p className="mt-2 text-[#5b6861]">Bắt đầu, hoàn thành và ghi chú nhiệm vụ luyện tập.</p>
      </div>

      {message ? (
        <p className="rounded-md border border-[#d9ddd3] bg-white p-3 text-sm text-[#4c5d54]">
          {message}
        </p>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-2">
        {state.missions.map((mission) => {
          const progress = progressBySlug.get(mission.slug);
          const status = progress?.status ?? "not_started";

          return (
            <article key={mission.slug} className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={status === "completed" ? "green" : status === "in_progress" ? "gold" : "neutral"}>
                  {formatMissionStatus(status)}
                </Badge>
                <Badge tone="neutral">{formatDifficulty(mission.difficulty)}</Badge>
                <span className="inline-flex items-center gap-1 text-sm text-[#66736c]">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                  {mission.estimatedMinutes} phút
                </span>
              </div>
              <h2 className="mt-4 text-xl font-bold text-[#17201b]">{mission.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#5b6861]">{mission.description}</p>

              <textarea
                value={notesBySlug[mission.slug] ?? progress?.notes ?? ""}
                onChange={(event) =>
                  setNotesBySlug((current) => ({
                    ...current,
                    [mission.slug]: event.target.value,
                  }))
                }
                rows={3}
                className="mt-4 w-full rounded-md border border-[#d9ddd3] px-3 py-2 text-sm"
                placeholder="Ghi chú khi làm nhiệm vụ"
              />

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() =>
                    updateMissionProgress(
                      mission.slug,
                      "in_progress",
                      notesBySlug[mission.slug] ?? progress?.notes ?? "",
                    )
                  }
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-[#b7c4ba] bg-white px-3 text-sm font-semibold text-[#314039] hover:bg-[#f3fbf4]"
                >
                  <Play className="h-4 w-4" aria-hidden="true" />
                  Bắt đầu nhiệm vụ
                </button>
                <button
                  type="button"
                  onClick={() =>
                    updateMissionProgress(
                      mission.slug,
                      "completed",
                      notesBySlug[mission.slug] ?? progress?.notes ?? "",
                    )
                  }
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-[#0f766e] px-3 text-sm font-semibold text-white hover:bg-[#115e59]"
                >
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  Đánh dấu hoàn thành
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <Disclaimer />
    </div>
  );
}
