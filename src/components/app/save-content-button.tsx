"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import type { SavedContentKind } from "@/lib/saved-content/storage";
import { useSavedContent } from "@/lib/saved-content/use-saved-content";

type SaveContentButtonProps = {
  id: string;
  kind: SavedContentKind;
  title: string;
  summary: string;
  href: string;
  className?: string;
};

export function SaveContentButton({
  id,
  kind,
  title,
  summary,
  href,
  className = "",
}: SaveContentButtonProps) {
  const { isSaved, saveItem, removeItem } = useSavedContent();
  const saved = isSaved(id);

  function toggleSaved() {
    if (saved) {
      removeItem(id);
      trackEvent("content_unsaved", {
        content_id: id,
        content_kind: kind,
      });
      return;
    }

    saveItem({
      id,
      kind,
      title,
      summary,
      href,
    });
    trackEvent("content_saved", {
      content_id: id,
      content_kind: kind,
    });
  }

  return (
    <button
      type="button"
      onClick={toggleSaved}
      aria-pressed={saved}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-md border px-3 text-sm font-bold transition-colors ${
        saved
          ? "border-[#0f766e] bg-[#f2fbf4] text-[#0f766e]"
          : "border-[#d0ded3] bg-white text-[#314039] hover:border-[#0f766e]"
      } ${className}`}
    >
      {saved ? (
        <BookmarkCheck className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Bookmark className="h-4 w-4" aria-hidden="true" />
      )}
      {saved ? "Đã lưu" : "Lưu để học"}
    </button>
  );
}
