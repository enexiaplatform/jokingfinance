"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Clock, Filter, Scale, Search } from "lucide-react";
import {
  practiceCaseDifficultyLabels,
  practiceCases,
  type PracticeCaseDifficulty,
} from "@/data/practice-cases";
import { usePracticeCaseProgress } from "@/lib/practice-cases/use-practice-case-progress";

export function PracticeCaseCatalog() {
  const { progress, clearProgress } = usePracticeCaseProgress();
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState("");
  const [difficulty, setDifficulty] = useState<PracticeCaseDifficulty | "">("");
  const themes = useMemo(
    () => [...new Set(practiceCases.map((item) => item.theme))],
    [],
  );
  const filteredCases = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("vi");

    return practiceCases.filter((practiceCase) => {
      const matchesQuery = normalizedQuery
        ? `${practiceCase.title} ${practiceCase.summary} ${practiceCase.theme}`
            .toLocaleLowerCase("vi")
            .includes(normalizedQuery)
        : true;
      const matchesTheme = theme ? practiceCase.theme === theme : true;
      const matchesDifficulty = difficulty
        ? practiceCase.difficulty === difficulty
        : true;

      return matchesQuery && matchesTheme && matchesDifficulty;
    });
  }, [difficulty, query, theme]);

  return (
    <div>
      <div className="mb-6 grid gap-3 rounded-md border border-[#d9ddd3] bg-white p-3 shadow-sm lg:grid-cols-[1fr_260px_220px]">
        <label className="flex min-h-11 items-center gap-2 rounded-md border border-[#d9ddd3] bg-[#fffdf8] px-3">
          <Search className="h-4 w-4 text-[#66736c]" aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm theo kỹ năng hoặc tình huống..."
            className="min-w-0 flex-1 bg-transparent text-sm text-[#17201b] outline-none"
          />
        </label>
        <label className="flex min-h-11 items-center gap-2 rounded-md border border-[#d9ddd3] bg-[#fffdf8] px-3">
          <Filter className="h-4 w-4 text-[#66736c]" aria-hidden="true" />
          <select
            value={theme}
            onChange={(event) => setTheme(event.target.value)}
            aria-label="Lọc theo chủ đề"
            className="min-w-0 flex-1 bg-transparent text-sm text-[#17201b] outline-none"
          >
            <option value="">Tất cả chủ đề</option>
            {themes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <select
          value={difficulty}
          onChange={(event) =>
            setDifficulty(event.target.value as PracticeCaseDifficulty | "")
          }
          aria-label="Lọc theo độ khó"
          className="min-h-11 rounded-md border border-[#d9ddd3] bg-[#fffdf8] px-3 text-sm text-[#17201b]"
        >
          <option value="">Mọi độ khó</option>
          {Object.entries(practiceCaseDifficultyLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {filteredCases.map((practiceCase) => {
          const caseNumber =
            practiceCases.findIndex((item) => item.slug === practiceCase.slug) + 1;
          const result = progress.results.find((item) => item.slug === practiceCase.slug);
          const percent = result
            ? Math.round((result.score / result.maxScore) * 100)
            : null;

          return (
            <article
              key={practiceCase.slug}
              className="rounded-md border border-[#dce4da] bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#edf5ee] text-sm font-black text-[#0f766e]">
                    {caseNumber}
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase text-[#0f766e]">
                      {practiceCase.theme}
                    </p>
                    <p className="mt-0.5 text-xs font-semibold text-[#66736c]">
                      {practiceCaseDifficultyLabels[practiceCase.difficulty]}
                    </p>
                  </div>
                </div>
                {percent !== null ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#b9d9c5] bg-[#f2fbf4] px-2.5 py-1 text-xs font-bold text-[#0f766e]">
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                    {percent}%
                  </span>
                ) : null}
              </div>

              <h2 className="mt-4 text-2xl font-black leading-8 text-[#17201b]">
                {practiceCase.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#5b6861]">
                {practiceCase.summary}
              </p>

              <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold text-[#66736c]">
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  {practiceCase.duration} phút
                </span>
                <span className="inline-flex items-center gap-1">
                  <Scale className="h-3.5 w-3.5" aria-hidden="true" />
                  {practiceCase.checkpoints.length} quyết định
                </span>
              </div>

              <div className="mt-4 rounded-md border border-[#e0e5dc] bg-[#fffdf8] p-3">
                <p className="text-xs font-bold uppercase text-[#66736c]">Vai trò của bạn</p>
                <p className="mt-1 text-sm font-semibold leading-6 text-[#314039]">
                  {practiceCase.learnerRole}
                </p>
              </div>

              <Link
                href={`/cases/${practiceCase.slug}`}
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#0f766e] hover:text-[#115e59]"
              >
                {percent === null ? "Bắt đầu tình huống" : "Làm lại và nâng điểm"}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </article>
          );
        })}
      </div>

      {filteredCases.length === 0 ? (
        <div className="rounded-md border border-[#d9ddd3] bg-white p-8 text-center">
          <p className="font-bold text-[#17201b]">Chưa có tình huống phù hợp.</p>
          <p className="mt-2 text-sm text-[#5b6861]">
            Thử từ khóa rộng hơn hoặc bỏ bớt bộ lọc.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setTheme("");
              setDifficulty("");
            }}
            className="mt-4 min-h-10 rounded-md border border-[#b7c4ba] bg-white px-4 text-sm font-bold text-[#17201b] hover:border-[#0f766e]"
          >
            Xóa bộ lọc
          </button>
        </div>
      ) : null}

      {progress.results.length > 0 ? (
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={clearProgress}
            className="min-h-10 rounded-md border border-[#d7ded5] bg-white px-3 text-sm font-semibold text-[#5b6861] hover:border-[#d65a31] hover:text-[#9a3412]"
          >
            Đặt lại tiến độ tình huống
          </button>
        </div>
      ) : null}
    </div>
  );
}
