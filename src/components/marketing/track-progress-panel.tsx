"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { PORTFOLIO_STORAGE_EVENT, PORTFOLIO_STORAGE_KEY } from "@/lib/simulator/storage";

type TrackProgressItem = {
  slug: string;
  title: string;
};

type TrackProgressPanelProps = {
  trackSlug: string;
  articles: TrackProgressItem[];
  missions: TrackProgressItem[];
};

type StoredTrackProgress = {
  articles: string[];
  missions: string[];
};

type StoredPortfolioProgress = {
  missionProgress?: Array<{
    missionSlug?: string;
    status?: string;
  }>;
};

const emptyProgress = JSON.stringify({ articles: [], missions: [] });

function storageKey(trackSlug: string) {
  return `jokingfinance-track-progress:${trackSlug}`;
}

function toggleSlug(slugs: string[], slug: string) {
  return slugs.includes(slug) ? slugs.filter((item) => item !== slug) : [...slugs, slug];
}

function progressEventName(trackSlug: string) {
  return `jokingfinance-track-progress-updated:${trackSlug}`;
}

function readProgressSnapshot(trackSlug: string) {
  if (typeof window === "undefined") {
    return emptyProgress;
  }

  return localStorage.getItem(storageKey(trackSlug)) ?? emptyProgress;
}

function readPortfolioSnapshot() {
  if (typeof window === "undefined") {
    return "";
  }

  return localStorage.getItem(PORTFOLIO_STORAGE_KEY) ?? "";
}

function parseProgress(snapshot: string): StoredTrackProgress {
  try {
    const parsed = JSON.parse(snapshot) as Partial<StoredTrackProgress>;

    return {
      articles: Array.isArray(parsed.articles) ? parsed.articles : [],
      missions: Array.isArray(parsed.missions) ? parsed.missions : [],
    };
  } catch {
    return { articles: [], missions: [] };
  }
}

function parseCompletedMissionSlugs(snapshot: string) {
  try {
    const parsed = JSON.parse(snapshot) as StoredPortfolioProgress;

    return new Set(
      (parsed.missionProgress ?? [])
        .filter((progress) => progress.status === "completed" && progress.missionSlug)
        .map((progress) => progress.missionSlug as string),
    );
  } catch {
    return new Set<string>();
  }
}

function writeProgress(trackSlug: string, progress: StoredTrackProgress) {
  localStorage.setItem(storageKey(trackSlug), JSON.stringify(progress));
  window.dispatchEvent(new Event(progressEventName(trackSlug)));
}

export function TrackProgressPanel({ trackSlug, articles, missions }: TrackProgressPanelProps) {
  const snapshot = useSyncExternalStore(
    (onStoreChange) => {
      const eventName = progressEventName(trackSlug);
      window.addEventListener(eventName, onStoreChange);
      window.addEventListener("storage", onStoreChange);

      return () => {
        window.removeEventListener(eventName, onStoreChange);
        window.removeEventListener("storage", onStoreChange);
      };
    },
    () => readProgressSnapshot(trackSlug),
    () => emptyProgress,
  );
  const portfolioSnapshot = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener(PORTFOLIO_STORAGE_EVENT, onStoreChange);
      window.addEventListener("storage", onStoreChange);

      return () => {
        window.removeEventListener(PORTFOLIO_STORAGE_EVENT, onStoreChange);
        window.removeEventListener("storage", onStoreChange);
      };
    },
    readPortfolioSnapshot,
    () => "",
  );

  const { articles: checkedArticles, missions: checkedMissions } = parseProgress(snapshot);
  const simulatorCompletedMissionSlugs = parseCompletedMissionSlugs(portfolioSnapshot);
  const effectiveCheckedMissions = missions
    .filter(
      (mission) =>
        checkedMissions.includes(mission.slug) ||
        simulatorCompletedMissionSlugs.has(mission.slug),
    )
    .map((mission) => mission.slug);

  const totalItems = articles.length + missions.length;
  const completedItems = checkedArticles.length + effectiveCheckedMissions.length;
  const percent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  const nextArticle = articles.find((article) => !checkedArticles.includes(article.slug));
  const nextMission = missions.find((mission) => !effectiveCheckedMissions.includes(mission.slug));
  const nextStep = nextArticle
    ? {
        href: `/articles/${nextArticle.slug}`,
        label: "Đọc bài tiếp theo",
        title: nextArticle.title,
        eyebrow: "Bước tiếp theo",
      }
    : nextMission
      ? {
          href: `/missions/${nextMission.slug}`,
          label: "Làm nhiệm vụ tiếp theo",
          title: nextMission.title,
          eyebrow: "Bước tiếp theo",
        }
      : {
          href: "/app/simulator",
          label: "Vào mô phỏng",
          title: "Bạn đã hoàn thành lộ trình này. Hãy đem bài học vào danh mục ảo.",
          eyebrow: "Sẵn sàng luyện sâu",
        };

  const progressText = useMemo(() => {
    if (percent === 100) {
      return "Hoàn thành lộ trình";
    }

    if (completedItems > 0) {
      return "Đang học";
    }

    return "Chưa bắt đầu";
  }, [completedItems, percent]);

  return (
    <section className="rounded-md border border-[#d0ded3] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase text-[#0f766e]">Tiến độ</p>
          <h2 className="mt-2 text-xl font-bold text-[#17201b]">{progressText}</h2>
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#b9d9c5] bg-[#e8f6ed] text-sm font-black text-[#0f766e]">
          {percent}%
        </div>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#e8ede4]">
        <div
          className="h-full rounded-full bg-[#0f766e] transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="mt-5 rounded-md border border-[#b9d9c5] bg-[#f2fbf4] p-4">
        <p className="text-xs font-bold uppercase text-[#0f766e]">{nextStep.eyebrow}</p>
        <p className="mt-2 text-sm font-semibold leading-6 text-[#17201b]">
          {nextStep.title}
        </p>
        <Link
          href={nextStep.href}
          className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-[#0f766e] hover:text-[#115e59]"
        >
          {nextStep.label}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-md border border-[#e0e5dc] bg-[#fffdf8] p-3">
          <p className="font-bold text-[#17201b]">
            {checkedArticles.length}/{articles.length}
          </p>
          <p className="mt-1 text-[#5b6861]">Bài đã đọc</p>
        </div>
        <div className="rounded-md border border-[#e0e5dc] bg-[#fffdf8] p-3">
          <p className="font-bold text-[#17201b]">
            {effectiveCheckedMissions.length}/{missions.length}
          </p>
          <p className="mt-1 text-[#5b6861]">Nhiệm vụ đã làm</p>
        </div>
      </div>

      <div className="mt-5 space-y-5">
        <div>
          <h3 className="text-sm font-bold text-[#17201b]">Bài học</h3>
          <div className="mt-3 space-y-2">
            {articles.map((article) => {
              const checked = checkedArticles.includes(article.slug);

              return (
                <label
                  key={article.slug}
                  className="flex cursor-pointer gap-3 rounded-md border border-[#e0e5dc] bg-[#fffdf8] p-3 text-sm leading-6 text-[#4c5d54] hover:border-[#b9d9c5]"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() =>
                      writeProgress(trackSlug, {
                        articles: toggleSlug(checkedArticles, article.slug),
                        missions: checkedMissions,
                      })
                    }
                    className="mt-1 h-4 w-4 rounded border-[#b7c4ba] text-[#0f766e]"
                  />
                  <span className={checked ? "text-[#0f766e]" : undefined}>{article.title}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-[#17201b]">Nhiệm vụ</h3>
          <div className="mt-3 space-y-2">
            {missions.map((mission) => {
              const checked = effectiveCheckedMissions.includes(mission.slug);
              const syncedFromSimulator = simulatorCompletedMissionSlugs.has(mission.slug);

              return (
                <label
                  key={mission.slug}
                  className="flex cursor-pointer gap-3 rounded-md border border-[#e0e5dc] bg-[#fffdf8] p-3 text-sm leading-6 text-[#4c5d54] hover:border-[#b9d9c5]"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={syncedFromSimulator}
                    onChange={() =>
                      writeProgress(trackSlug, {
                        articles: checkedArticles,
                        missions: toggleSlug(checkedMissions, mission.slug),
                      })
                    }
                    className="mt-1 h-4 w-4 rounded border-[#b7c4ba] text-[#0f766e] disabled:opacity-80"
                  />
                  <span className={checked ? "text-[#0f766e]" : undefined}>
                    {mission.title}
                    {syncedFromSimulator ? (
                      <span className="mt-1 block text-xs font-semibold text-[#66736c]">
                        Đã đồng bộ từ phòng mô phỏng
                      </span>
                    ) : null}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {percent === 100 ? (
        <p className="mt-5 flex gap-2 rounded-md border border-[#b9d9c5] bg-[#f2fbf4] p-3 text-sm font-semibold leading-6 text-[#166534]">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          Lộ trình này đã đủ điều kiện để chuyển sang bước luyện sâu hơn.
        </p>
      ) : null}
    </section>
  );
}
