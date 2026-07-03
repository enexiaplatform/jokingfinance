"use client";

import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Circle,
  RotateCcw,
  ShieldAlert,
  Trophy,
} from "lucide-react";
import type { PracticeCase } from "@/data/practice-cases";
import { usePracticeCaseProgress } from "@/lib/practice-cases/use-practice-case-progress";

type PracticeCasePlayerProps = {
  practiceCase: PracticeCase;
};

function getResultMessage(percent: number) {
  if (percent >= 90) {
    return {
      title: "Quy trình rất vững",
      message:
        "Bạn đã ưu tiên dữ kiện, giới hạn rủi ro và giữ được quyền chờ khi bằng chứng chưa đủ.",
    };
  }

  if (percent >= 65) {
    return {
      title: "Nền tảng tốt, còn vài điểm cần siết",
      message:
        "Bạn đã nhìn đúng phần lớn vấn đề. Hãy đọc lại những lựa chọn bị cảm xúc hoặc một con số riêng lẻ chi phối.",
    };
  }

  return {
    title: "Nên làm lại sau phần debrief",
    message:
      "Điểm số không phải phán xét. Nó đang chỉ ra nơi quy trình dễ bị tin nóng, lợi nhuận kỳ vọng hoặc cảm giác chắc chắn kéo lệch.",
  };
}

export function PracticeCasePlayer({ practiceCase }: PracticeCasePlayerProps) {
  const { progress, saveResult } = usePracticeCaseProgress();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const checkpoint = practiceCase.checkpoints[currentIndex];
  const selectedOptionIndex = answers[currentIndex];
  const selectedOption =
    selectedOptionIndex === undefined
      ? undefined
      : checkpoint.options[selectedOptionIndex];
  const maxScore = practiceCase.checkpoints.reduce(
    (total, item) => total + Math.max(...item.options.map((option) => option.score)),
    0,
  );
  const score = practiceCase.checkpoints.reduce((total, item, index) => {
    const answerIndex = answers[index];
    return total + (answerIndex === undefined ? 0 : item.options[answerIndex].score);
  }, 0);
  const percent = Math.round((score / maxScore) * 100);
  const previousResult = progress.results.find((item) => item.slug === practiceCase.slug);
  const resultMessage = getResultMessage(percent);

  function chooseOption(optionIndex: number) {
    if (selectedOptionIndex !== undefined) {
      return;
    }

    setAnswers((current) => ({
      ...current,
      [currentIndex]: optionIndex,
    }));
  }

  function continueCase() {
    if (currentIndex < practiceCase.checkpoints.length - 1) {
      setCurrentIndex((current) => current + 1);
      return;
    }

    saveResult({
      slug: practiceCase.slug,
      score,
      maxScore,
      completedAt: new Date().toISOString(),
    });
    setFinished(true);
  }

  function restartCase() {
    setAnswers({});
    setCurrentIndex(0);
    setFinished(false);
  }

  if (finished) {
    return (
      <section className="rounded-md border border-[#b9d9c5] bg-[#f2fbf4] p-5 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-[#0f766e]" aria-hidden="true" />
              <p className="text-sm font-bold uppercase text-[#0f766e]">
                Hoàn thành tình huống
              </p>
            </div>
            <h2 className="mt-3 text-3xl font-black text-[#17201b]">
              {resultMessage.title}
            </h2>
            <p className="mt-3 max-w-2xl leading-7 text-[#4c5d54]">
              {resultMessage.message}
            </p>
          </div>
          <div className="min-w-32 rounded-md border border-[#b9d9c5] bg-white px-5 py-4 text-center">
            <p className="text-4xl font-black text-[#0f766e]">{percent}%</p>
            <p className="mt-1 text-xs font-semibold text-[#66736c]">
              {score}/{maxScore} điểm quy trình
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3">
          {practiceCase.checkpoints.map((item, index) => {
            const answerIndex = answers[index];
            const option = item.options[answerIndex];

            return (
              <div
                key={item.title}
                className="rounded-md border border-[#d0ded3] bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase text-[#0f766e]">
                      Quyết định {index + 1}
                    </p>
                    <p className="mt-1 font-bold text-[#17201b]">{option.label}</p>
                  </div>
                  <span className="shrink-0 text-sm font-black text-[#0f766e]">
                    +{option.score}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-[#5b6861]">
                  {option.feedback}
                </p>
              </div>
            );
          })}
        </div>

        <article className="mt-6 rounded-md border border-[#d0ded3] bg-white p-5">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[#0f766e]" aria-hidden="true" />
            <h3 className="text-2xl font-bold text-[#17201b]">Debrief chuyên sâu</h3>
          </div>
          <div className="mt-5 rounded-md border border-[#b9d9c5] bg-[#f2fbf4] p-4">
            <h4 className="font-bold text-[#17201b]">Cách tiếp cận vững</h4>
            <p className="mt-2 text-sm leading-7 text-[#314039]">
              {practiceCase.debrief.strongApproach}
            </p>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-md border border-[#efc1af] bg-[#fff3ef] p-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-[#9a3412]" aria-hidden="true" />
                <h4 className="font-bold text-[#9a3412]">Dấu hiệu cảnh báo</h4>
              </div>
              <ul className="mt-3 grid gap-2">
                {practiceCase.debrief.warningSigns.map((item) => (
                  <li key={item} className="text-sm leading-6 text-[#7c3a20]">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-md border border-[#e0e5dc] bg-[#fffdf8] p-4">
              <h4 className="font-bold text-[#17201b]">Câu hỏi phản tư</h4>
              <ol className="mt-3 grid gap-2">
                {practiceCase.debrief.reflectionQuestions.map((item, index) => (
                  <li key={item} className="text-sm leading-6 text-[#4c5d54]">
                    {index + 1}. {item}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </article>

        <button
          type="button"
          onClick={restartCase}
          className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-[#b7c4ba] bg-white px-4 text-sm font-bold text-[#17201b] hover:border-[#0f766e]"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Làm lại tình huống
        </button>
      </section>
    );
  }

  return (
    <section className="rounded-md border border-[#d0ded3] bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase text-[#0f766e]">
            Quyết định {currentIndex + 1}/{practiceCase.checkpoints.length}
          </p>
          <h2 className="mt-2 text-2xl font-black leading-8 text-[#17201b]">
            {checkpoint.title}
          </h2>
        </div>
        {previousResult ? (
          <span className="rounded-full border border-[#d7ded5] bg-[#fffdf8] px-3 py-1.5 text-xs font-bold text-[#4a5a52]">
            Điểm lần gần nhất: {Math.round((previousResult.score / previousResult.maxScore) * 100)}%
          </span>
        ) : null}
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#e8ede4]">
        <div
          role="progressbar"
          aria-label="Tiến độ tình huống"
          aria-valuemin={0}
          aria-valuemax={practiceCase.checkpoints.length}
          aria-valuenow={currentIndex + (selectedOption ? 1 : 0)}
          className="h-full rounded-full bg-[#0f766e] transition-[width]"
          style={{
            width: `${((currentIndex + (selectedOption ? 1 : 0)) / practiceCase.checkpoints.length) * 100}%`,
          }}
        />
      </div>

      <div className="mt-5 rounded-md border border-[#e0e5dc] bg-[#fffdf8] p-4">
        <p className="text-sm leading-7 text-[#4c5d54]">{checkpoint.situation}</p>
        <h3 className="mt-4 text-lg font-bold leading-7 text-[#17201b]">
          {checkpoint.question}
        </h3>
      </div>

      <div className="mt-4 grid gap-3">
        {checkpoint.options.map((option, optionIndex) => {
          const isSelected = selectedOptionIndex === optionIndex;
          const optionClass = isSelected
            ? "border-[#0f766e] bg-[#f2fbf4]"
            : selectedOption
              ? "border-[#e0e5dc] bg-white opacity-60"
              : "border-[#e0e5dc] bg-white hover:border-[#0f766e] hover:bg-[#fbfefb]";

          return (
            <button
              key={option.label}
              type="button"
              disabled={selectedOptionIndex !== undefined}
              onClick={() => chooseOption(optionIndex)}
              className={`flex min-h-14 items-start gap-3 rounded-md border p-4 text-left transition-colors ${optionClass}`}
            >
              {isSelected ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#0f766e]" aria-hidden="true" />
              ) : (
                <Circle className="mt-0.5 h-5 w-5 shrink-0 text-[#87938c]" aria-hidden="true" />
              )}
              <span className="font-semibold leading-6 text-[#17201b]">{option.label}</span>
            </button>
          );
        })}
      </div>

      {selectedOption ? (
        <div
          className="mt-5 rounded-md border border-[#b9d9c5] bg-[#f2fbf4] p-4"
          aria-live="polite"
        >
          <p className="text-xs font-bold uppercase text-[#0f766e]">
            Phản hồi quyết định · +{selectedOption.score} điểm
          </p>
          <p className="mt-2 text-sm leading-6 text-[#314039]">
            {selectedOption.feedback}
          </p>
          <button
            type="button"
            onClick={continueCase}
            className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#0f766e] px-4 text-sm font-bold text-white hover:bg-[#115e59]"
          >
            {currentIndex === practiceCase.checkpoints.length - 1
              ? "Xem tổng kết"
              : "Sang quyết định tiếp theo"}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </section>
  );
}
