"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Circle, HelpCircle, XCircle } from "lucide-react";
import type { KnowledgeQuickCheckQuestion } from "@/data/knowledge-lessons";
import { getKnowledgeProgressId } from "@/lib/knowledge/progress-storage";
import { useKnowledgeProgress } from "@/lib/knowledge/use-knowledge-progress";

type KnowledgeQuickCheckProps = {
  pillarSlug: string;
  moduleSlug: string;
  questions: KnowledgeQuickCheckQuestion[];
};

export function KnowledgeQuickCheck({
  pillarSlug,
  moduleSlug,
  questions,
}: KnowledgeQuickCheckProps) {
  const { progress, setModuleCompleted } = useKnowledgeProgress();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const moduleId = getKnowledgeProgressId(pillarSlug, moduleSlug);
  const completed = progress.completedModules.includes(moduleId);
  const score = useMemo(
    () =>
      questions.reduce(
        (total, question, index) =>
          answers[index] === question.correctIndex ? total + 1 : total,
        0,
      ),
    [answers, questions],
  );
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions.length;
  const allCorrect = allAnswered && score === questions.length;

  function chooseAnswer(questionIndex: number, optionIndex: number) {
    setAnswers((current) => ({
      ...current,
      [questionIndex]: optionIndex,
    }));
  }

  function markCompleted() {
    void setModuleCompleted(moduleId, true);
  }

  return (
    <section className="rounded-md border border-[#d0ded3] bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#0f766e]" aria-hidden="true" />
        <div>
          <h2 className="text-2xl font-bold text-[#17201b]">Kiểm tra nhanh</h2>
          <p className="mt-2 text-sm leading-6 text-[#5b6861]">
            Trả lời 3 câu ngắn để tự kiểm tra xem bạn đã hiểu đủ để chuyển sang thực hành chưa.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        {questions.map((question, questionIndex) => {
          const selected = answers[questionIndex];
          const hasAnswered = selected !== undefined;
          const isCorrect = selected === question.correctIndex;

          return (
            <article key={question.question} className="rounded-md border border-[#e0e5dc] bg-[#fffdf8] p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-bold leading-6 text-[#17201b]">{question.question}</h3>
                {hasAnswered ? (
                  isCorrect ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-[#0f766e]" aria-hidden="true" />
                  ) : (
                    <XCircle className="h-5 w-5 shrink-0 text-[#d65a31]" aria-hidden="true" />
                  )
                ) : null}
              </div>
              <div className="mt-3 grid gap-2">
                {question.options.map((option, optionIndex) => {
                  const selectedThisOption = selected === optionIndex;
                  const correctThisOption = question.correctIndex === optionIndex;
                  const optionClass =
                    hasAnswered && correctThisOption
                      ? "border-[#0f766e] bg-[#f2fbf4] text-[#17201b]"
                      : selectedThisOption
                        ? "border-[#d65a31] bg-[#fff3ef] text-[#7c3a20]"
                        : "border-[#e0e5dc] bg-white text-[#314039] hover:border-[#0f766e]";

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => chooseAnswer(questionIndex, optionIndex)}
                      className={`flex min-h-11 items-center gap-2 rounded-md border px-3 text-left text-sm font-semibold transition-colors ${optionClass}`}
                    >
                      {selectedThisOption || (hasAnswered && correctThisOption) ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                      ) : (
                        <Circle className="h-4 w-4 shrink-0" aria-hidden="true" />
                      )}
                      <span>{option}</span>
                    </button>
                  );
                })}
              </div>
              {hasAnswered ? (
                <p className="mt-3 text-sm leading-6 text-[#5b6861]">{question.explanation}</p>
              ) : null}
            </article>
          );
        })}
      </div>

      <div className="mt-5 rounded-md border border-[#e0e5dc] bg-[#fffdf8] p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-[#17201b]">
              Điểm: {score}/{questions.length}
            </p>
            <p className="mt-1 text-xs leading-5 text-[#66736c]">
              {allCorrect
                ? "Bạn đã trả lời đúng toàn bộ phần kiểm tra nhanh."
                : "Bạn có thể chọn lại đáp án để tự sửa hiểu nhầm trước khi đánh dấu hoàn thành."}
            </p>
          </div>
          <button
            type="button"
            onClick={markCompleted}
            disabled={!allCorrect || completed}
            className="inline-flex min-h-10 items-center justify-center rounded-md bg-[#0f766e] px-4 text-sm font-bold text-white hover:bg-[#115e59] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {completed ? "Đã hoàn thành" : "Đánh dấu hoàn thành"}
          </button>
        </div>
      </div>
    </section>
  );
}
