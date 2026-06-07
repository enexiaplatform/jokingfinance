"use client";

import Link from "next/link";
import { ArrowRight, BookMarked, BookmarkX, Newspaper } from "lucide-react";
import { useSavedContent } from "@/lib/saved-content/use-saved-content";

export function SavedContentPanel() {
  const { items, removeItem } = useSavedContent();
  const knowledgeItems = items.filter((item) => item.kind === "knowledge");
  const newsItems = items.filter((item) => item.kind === "news");

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-bold text-[#17201b]">Danh sách học đã lưu</h1>
        <p className="mt-2 max-w-3xl text-[#5b6861]">
          Lưu module và brief tin tức cần đọc lại. Danh sách này hiện được giữ trên trình duyệt.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-md border border-[#d0ded3] bg-white p-4 shadow-sm">
          <p className="text-3xl font-black text-[#0f766e]">{items.length}</p>
          <p className="mt-1 text-sm text-[#5b6861]">Nội dung đã lưu</p>
        </div>
        <div className="rounded-md border border-[#d0ded3] bg-white p-4 shadow-sm">
          <p className="text-3xl font-black text-[#0f766e]">{knowledgeItems.length}</p>
          <p className="mt-1 text-sm text-[#5b6861]">Module kiến thức</p>
        </div>
        <div className="rounded-md border border-[#d0ded3] bg-white p-4 shadow-sm">
          <p className="text-3xl font-black text-[#0f766e]">{newsItems.length}</p>
          <p className="mt-1 text-sm text-[#5b6861]">Brief tin tức</p>
        </div>
      </div>

      {items.length === 0 ? (
        <section className="rounded-md border border-[#d0ded3] bg-white p-8 text-center shadow-sm">
          <BookMarked className="mx-auto h-8 w-8 text-[#0f766e]" aria-hidden="true" />
          <h2 className="mt-4 text-xl font-bold text-[#17201b]">Chưa có nội dung nào được lưu</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#5b6861]">
            Mở thư viện hoặc bàn tin, chọn “Lưu để học”, nội dung sẽ xuất hiện tại đây.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              href="/knowledge"
              className="inline-flex min-h-10 items-center gap-2 rounded-md bg-[#0f766e] px-4 text-sm font-bold text-white hover:bg-[#115e59]"
            >
              Mở thư viện
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/news"
              className="inline-flex min-h-10 items-center gap-2 rounded-md border border-[#d0ded3] bg-white px-4 text-sm font-bold text-[#314039] hover:border-[#0f766e]"
            >
              Mở bàn tin
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          <SavedGroup
            title="Module kiến thức"
            emptyText="Chưa lưu module nào."
            items={knowledgeItems}
            icon={BookMarked}
            onRemove={removeItem}
          />
          <SavedGroup
            title="Brief tin tức"
            emptyText="Chưa lưu brief tin tức nào."
            items={newsItems}
            icon={Newspaper}
            onRemove={removeItem}
          />
        </div>
      )}
    </div>
  );
}

type SavedGroupProps = {
  title: string;
  emptyText: string;
  items: ReturnType<typeof useSavedContent>["items"];
  icon: typeof BookMarked;
  onRemove: (id: string) => void;
};

function SavedGroup({ title, emptyText, items, icon: Icon, onRemove }: SavedGroupProps) {
  return (
    <section className="rounded-md border border-[#d0ded3] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-[#0f766e]" aria-hidden="true" />
        <h2 className="text-xl font-bold text-[#17201b]">{title}</h2>
      </div>
      <div className="mt-4 grid gap-3">
        {items.map((item) => (
          <article key={item.id} className="rounded-md border border-[#e0e5dc] bg-[#fffdf8] p-4">
            <h3 className="font-bold leading-6 text-[#17201b]">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-[#5b6861]">{item.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href={item.href}
                className="inline-flex min-h-9 items-center gap-2 rounded-md bg-[#0f766e] px-3 text-sm font-bold text-white hover:bg-[#115e59]"
              >
                Mở lại
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                className="inline-flex min-h-9 items-center gap-2 rounded-md border border-[#d0ded3] bg-white px-3 text-sm font-bold text-[#7c3a20] hover:border-[#d65a31]"
              >
                <BookmarkX className="h-4 w-4" aria-hidden="true" />
                Bỏ lưu
              </button>
            </div>
          </article>
        ))}
        {items.length === 0 ? (
          <p className="rounded-md border border-dashed border-[#d0ded3] p-5 text-sm text-[#66736c]">
            {emptyText}
          </p>
        ) : null}
      </div>
    </section>
  );
}
