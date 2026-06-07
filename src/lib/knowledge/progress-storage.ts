export const KNOWLEDGE_PROGRESS_STORAGE_KEY = "jokingfinance-knowledge-progress-v1";
export const KNOWLEDGE_PROGRESS_EVENT = "jokingfinance-knowledge-progress-updated";

export type KnowledgeProgressSnapshot = {
  completedModules: string[];
};

export type KnowledgeProgressRow = {
  module_id: string;
};

export function getKnowledgeProgressId(pillarSlug: string, moduleSlug: string) {
  return `${pillarSlug}/${moduleSlug}`;
}
