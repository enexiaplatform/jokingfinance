export const PRACTICE_CASE_PROGRESS_STORAGE_KEY = "jokingfinance-practice-case-progress-v1";
export const PRACTICE_CASE_PROGRESS_EVENT = "jokingfinance-practice-case-progress-updated";

export type PracticeCaseResult = {
  slug: string;
  score: number;
  maxScore: number;
  completedAt: string;
};

export type PracticeCaseProgressSnapshot = {
  results: PracticeCaseResult[];
};
