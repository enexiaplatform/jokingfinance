export const SAVED_CONTENT_STORAGE_KEY = "jokingfinance-saved-content-v1";
export const SAVED_CONTENT_EVENT = "jokingfinance-saved-content-updated";

export type SavedContentKind = "knowledge" | "news";

export type SavedContentItem = {
  id: string;
  kind: SavedContentKind;
  title: string;
  summary: string;
  href: string;
  savedAt: string;
};

export type SavedContentSnapshot = {
  items: SavedContentItem[];
};
