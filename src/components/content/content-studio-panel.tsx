"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Eye,
  FilePenLine,
  Image as ImageIcon,
  Newspaper,
  Save,
  SearchCheck,
  Send,
  Tags,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { MetricCard } from "@/components/ui/metric-card";

type ContentStatus = "draft" | "scheduled" | "published";

type ContentDraft = {
  id: string;
  title: string;
  summary: string;
  category: string;
  tags: string;
  coverImage: string;
  seoTitle: string;
  seoDescription: string;
  body: string;
  status: ContentStatus;
  updatedAt: string;
};

const STORAGE_KEY = "jokingfinance-content-studio-v1";

const emptyDraft: ContentDraft = {
  id: "",
  title: "",
  summary: "",
  category: "Chứng khoán nhập môn",
  tags: "",
  coverImage: "",
  seoTitle: "",
  seoDescription: "",
  body: "",
  status: "draft",
  updatedAt: "",
};

const seedDrafts: ContentDraft[] = [
  {
    id: "ban-tin-thi-truong-cho-nguoi-moi",
    title: "Bản tin thị trường cho người mới: nên đọc gì trước?",
    summary:
      "Một khung đọc tin tài chính nhẹ nhàng để người mới không bị cuốn theo tiêu đề nóng.",
    category: "Chứng khoán nhập môn",
    tags: "thị trường, người mới, kỷ luật",
    coverImage: "",
    seoTitle: "Bản tin thị trường cho người mới",
    seoDescription:
      "Cách đọc tin tài chính hằng ngày mà không biến tin nóng thành quyết định vội.",
    body:
      "Tin tài chính không phải lúc nào cũng là tín hiệu hành động. Người mới nên đọc để hiểu bối cảnh, ghi lại câu hỏi và chỉ mô phỏng quyết định khi đã có luận điểm rõ.",
    status: "scheduled",
    updatedAt: "2026-06-04T08:00:00.000Z",
  },
  {
    id: "kiem-tra-luan-diem-truoc-khi-mua",
    title: "Ba câu hỏi kiểm tra luận điểm trước khi mua",
    summary:
      "Bài viết ngắn giúp người đọc tự kiểm tra lý do mua trước khi vào phần mô phỏng.",
    category: "Phòng luyện tập",
    tags: "luận điểm, mô phỏng, giao dịch",
    coverImage: "",
    seoTitle: "Kiểm tra luận điểm trước khi mua cổ phiếu",
    seoDescription:
      "Ba câu hỏi giúp người mới viết lý do mua cổ phiếu rõ ràng hơn.",
    body:
      "Trước khi mua, hãy trả lời: vì sao doanh nghiệp này đáng quan tâm, rủi ro chính là gì, và điều gì sẽ khiến mình đổi ý. Nếu chưa trả lời được, hãy để quyết định ở trạng thái nháp.",
    status: "draft",
    updatedAt: "2026-06-04T09:30:00.000Z",
  },
];

const statusLabels: Record<ContentStatus, string> = {
  draft: "Bản nháp",
  scheduled: "Sẵn sàng đăng",
  published: "Đã xuất bản",
};

const statusTones: Record<ContentStatus, "neutral" | "gold" | "green"> = {
  draft: "neutral",
  scheduled: "gold",
  published: "green",
};

function createId(title: string) {
  const normalized = title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return normalized || `bai-viet-${Date.now()}`;
}

function formatUpdatedAt(value: string) {
  if (!value) return "Chưa lưu";

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function ContentStudioPanel() {
  const [drafts, setDrafts] = useState<ContentDraft[]>(seedDrafts);
  const [form, setForm] = useState<ContentDraft>(emptyDraft);
  const [message, setMessage] = useState("");
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setDrafts(JSON.parse(stored) as ContentDraft[]);
      }
      setStorageReady(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!storageReady) return;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
  }, [drafts, storageReady]);

  const wordCount = useMemo(() => {
    return form.body.trim().split(/\s+/).filter(Boolean).length;
  }, [form.body]);

  const seoReady = Boolean(form.seoTitle && form.seoDescription && form.title && form.summary);
  const scheduledCount = drafts.filter((draft) => draft.status === "scheduled").length;
  const publishedCount = drafts.filter((draft) => draft.status === "published").length;

  function updateField(name: keyof ContentDraft, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function saveDraft(status: ContentStatus) {
    if (!form.title.trim() || !form.body.trim()) {
      setMessage("Cần có tiêu đề và nội dung trước khi lưu.");
      return;
    }

    const now = new Date().toISOString();
    const nextDraft = {
      ...form,
      id: form.id || createId(form.title),
      status,
      updatedAt: now,
    };

    setDrafts((current) => {
      const rest = current.filter((draft) => draft.id !== nextDraft.id);
      return [nextDraft, ...rest];
    });
    setForm(nextDraft);
    setMessage(status === "draft" ? "Đã lưu bản nháp." : "Đã đưa bài vào hàng chờ đăng.");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    saveDraft("draft");
  }

  function loadDraft(draft: ContentDraft) {
    setForm(draft);
    setMessage("Đã mở bản nháp.");
  }

  function resetForm() {
    setForm(emptyDraft);
    setMessage("Đã mở bài viết mới.");
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 rounded-md border border-[#d9ddd3] bg-[#fffdf8] p-6 shadow-sm xl:flex-row xl:items-center">
        <div>
          <Badge tone="green">Tòa soạn nội dung</Badge>
          <h1 className="mt-3 text-3xl font-bold text-[#17201b]">
            Viết bài hằng ngày mà không cần sửa mã nguồn
          </h1>
          <p className="mt-2 max-w-3xl text-[#5b6861]">
            Quản lý tiêu đề, nội dung, ảnh, thẻ, chuyên mục, trường tìm kiếm và trạng thái xuất bản trong một màn hình.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <ButtonLink href="/studio" variant="secondary">
            <FilePenLine className="h-4 w-4" aria-hidden="true" />
            Mở Sanity Studio
          </ButtonLink>
          <ButtonLink href="/articles" variant="secondary">
            <Eye className="h-4 w-4" aria-hidden="true" />
            Xem website
          </ButtonLink>
        </div>
      </div>

      {message ? (
        <p className="rounded-md border border-[#d9ddd3] bg-white p-3 text-sm text-[#4c5d54]">
          {message}
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Bài trong tòa soạn" value={drafts.length} helper="Nháp, chờ đăng và đã xuất bản" />
        <MetricCard label="Sẵn sàng đăng" value={scheduledCount} tone="warning" helper="Đã đủ nội dung xuất bản" />
        <MetricCard label="Đã xuất bản" value={publishedCount} tone="positive" helper="Theo dữ liệu tòa soạn thử nghiệm" />
        <MetricCard label="Từ trong bản đang viết" value={wordCount} helper={seoReady ? "Đã đủ trường tìm kiếm" : "Cần bổ sung trường tìm kiếm"} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={handleSubmit} className="grid gap-4 rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
          <div className="flex flex-col justify-between gap-3 border-b border-[#e0e5dc] pb-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-xl font-bold text-[#17201b]">Bài viết</h2>
              <p className="mt-1 text-sm text-[#5b6861]">Cập nhật lần cuối: {formatUpdatedAt(form.updatedAt)}</p>
            </div>
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex min-h-10 items-center justify-center rounded-md border border-[#b7c4ba] bg-white px-3 text-sm font-semibold text-[#314039] hover:bg-[#f3fbf4]"
            >
              Bài mới
            </button>
          </div>

          <label className="grid gap-2 text-sm font-semibold text-[#314039]">
            Tiêu đề
            <input
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
              required
              className="min-h-11 rounded-md border border-[#d9ddd3] px-3"
              placeholder="Nhập tiêu đề bài viết"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-[#314039]">
            Tóm tắt
            <textarea
              value={form.summary}
              onChange={(event) => updateField("summary", event.target.value)}
              required
              rows={3}
              className="rounded-md border border-[#d9ddd3] px-3 py-2"
              placeholder="Tóm tắt ngắn cho trang danh sách và chia sẻ"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-[#314039]">
              Chuyên mục
              <select
                value={form.category}
                onChange={(event) => updateField("category", event.target.value)}
                className="min-h-11 rounded-md border border-[#d9ddd3] bg-white px-3"
              >
                <option>Chứng khoán nhập môn</option>
                <option>Tài chính cá nhân</option>
                <option>Đọc báo cáo tài chính</option>
                <option>Phân tích ngành</option>
                <option>Phòng luyện tập</option>
                <option>Sai lầm tài chính</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-[#314039]">
              Thẻ
              <input
                value={form.tags}
                onChange={(event) => updateField("tags", event.target.value)}
                className="min-h-11 rounded-md border border-[#d9ddd3] px-3"
                placeholder="Ví dụ: cổ phiếu, người mới, kỷ luật"
              />
            </label>
          </div>

          <label className="grid gap-2 text-sm font-semibold text-[#314039]">
            Ảnh bìa
            <input
              value={form.coverImage}
              onChange={(event) => updateField("coverImage", event.target.value)}
              className="min-h-11 rounded-md border border-[#d9ddd3] px-3"
              placeholder="Đường dẫn ảnh bìa"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-[#314039]">
              Tiêu đề tìm kiếm
              <input
                value={form.seoTitle}
                onChange={(event) => updateField("seoTitle", event.target.value)}
                className="min-h-11 rounded-md border border-[#d9ddd3] px-3"
                placeholder="Tiêu đề khi hiển thị trên công cụ tìm kiếm"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-[#314039]">
              Mô tả tìm kiếm
              <input
                value={form.seoDescription}
                onChange={(event) => updateField("seoDescription", event.target.value)}
                className="min-h-11 rounded-md border border-[#d9ddd3] px-3"
                placeholder="Mô tả ngắn cho kết quả tìm kiếm"
              />
            </label>
          </div>

          <label className="grid gap-2 text-sm font-semibold text-[#314039]">
            Nội dung
            <textarea
              value={form.body}
              onChange={(event) => updateField("body", event.target.value)}
              required
              rows={10}
              className="rounded-md border border-[#d9ddd3] px-3 py-2"
              placeholder="Viết nội dung bài ở đây"
            />
          </label>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="submit"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-[#b7c4ba] bg-white px-4 text-sm font-semibold text-[#314039] hover:bg-[#f3fbf4]"
            >
              <Save className="h-4 w-4" aria-hidden="true" />
              Lưu nháp
            </button>
            <button
              type="button"
              onClick={() => saveDraft("scheduled")}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#0f766e] px-4 text-sm font-semibold text-white hover:bg-[#115e59]"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
              Đưa vào hàng chờ đăng
            </button>
          </div>
        </form>

        <div className="grid gap-6">
          <section className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-[#e0e5dc] pb-4">
              <div>
                <h2 className="text-xl font-bold text-[#17201b]">Bản xem trước</h2>
                <p className="mt-1 text-sm text-[#5b6861]">{form.category}</p>
              </div>
              <Badge tone={seoReady ? "green" : "gold"}>
                {seoReady ? "Đủ trường tìm kiếm" : "Thiếu trường tìm kiếm"}
              </Badge>
            </div>
            <div className="mt-4 grid gap-4">
              <div className="flex min-h-36 items-center justify-center rounded-md border border-[#d9ddd3] bg-[#edf5ee]">
                <ImageIcon className="h-8 w-8 text-[#0f766e]" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-2xl font-bold leading-8 text-[#17201b]">
                  {form.title || "Tiêu đề bài viết"}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#5b6861]">
                  {form.summary || "Tóm tắt sẽ hiển thị ở đây."}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge tone="green">{form.category}</Badge>
                {form.tags
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter(Boolean)
                  .slice(0, 4)
                  .map((tag) => (
                    <Badge key={tag} tone="neutral">
                      {tag}
                    </Badge>
                  ))}
              </div>
            </div>
          </section>

          <section className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-[#17201b]">Hàng chờ nội dung</h2>
            <div className="mt-4 grid gap-3">
              {drafts.map((draft) => (
                <button
                  key={draft.id}
                  type="button"
                  onClick={() => loadDraft(draft)}
                  className="rounded-md border border-[#e0e5dc] p-3 text-left hover:border-[#0f766e]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-[#17201b]">{draft.title}</span>
                    <Badge tone={statusTones[draft.status]}>{statusLabels[draft.status]}</Badge>
                  </div>
                  <div className="mt-3 grid gap-2 text-xs text-[#66736c] sm:grid-cols-3">
                    <span className="inline-flex items-center gap-1">
                      <Newspaper className="h-3.5 w-3.5" aria-hidden="true" />
                      {draft.category}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Tags className="h-3.5 w-3.5" aria-hidden="true" />
                      {draft.tags || "Chưa có thẻ"}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                      {formatUpdatedAt(draft.updatedAt)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-md border border-[#d9ddd3] bg-[#f8fbf7] p-5">
            <div className="flex items-center gap-2">
              <SearchCheck className="h-5 w-5 text-[#0f766e]" aria-hidden="true" />
              <h2 className="text-lg font-bold text-[#17201b]">Luồng xuất bản chuẩn</h2>
            </div>
            <div className="mt-4 grid gap-2 text-sm text-[#4c5d54]">
              <p>Viết bài trong tòa soạn hoặc Sanity Studio.</p>
              <p>Gắn chuyên mục, thẻ, ảnh bìa và trường tìm kiếm.</p>
              <p>Chuyển trạng thái từ bản nháp sang sẵn sàng đăng.</p>
              <p>Bài đã xuất bản xuất hiện ngoài trang bài viết.</p>
            </div>
            <Link href="/studio" className="mt-4 inline-flex text-sm font-semibold text-[#0f766e]">
              Đi tới hệ quản trị gốc
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
