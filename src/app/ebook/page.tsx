import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, CheckCircle2 } from "lucide-react";
import { PublicFooter } from "@/components/marketing/public-footer";
import { PublicNav } from "@/components/marketing/public-nav";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Ebook quy trình đầu tư cho người mới - JokingFinance",
  description:
    "Đăng ký nhận thông báo về ebook hướng dẫn người mới xây quy trình đọc dữ kiện, viết luận điểm và quản trị rủi ro.",
  alternates: { canonical: "/ebook" },
};

const chapters = [
  "Phân biệt dữ kiện, câu chuyện và kỳ vọng thị trường.",
  "Viết luận điểm mua trong ba dòng và đặt điều kiện sai.",
  "Đọc P/E, dòng tiền và nợ vay mà không dùng máy móc.",
  "Thiết kế tỷ trọng, kịch bản xấu và biên an toàn.",
  "Tạo nhật ký để xem lại quyết định thay vì chỉ nhìn lãi lỗ.",
];

export default function EbookPage() {
  return (
    <>
      <PublicNav />
      <main className="bg-[#fffdf8]">
        <section className="border-b border-[#d9ddd3] bg-[#edf5ee] px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <Badge tone="gold">Đang biên tập</Badge>
              <h1 className="mt-4 text-4xl font-black leading-tight text-[#17201b] md:text-5xl">
                Ebook: Quy trình đầu tư cho người mới, trước khi chọn cổ phiếu.
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-[#43534a]">
                Một tài liệu thực hành nối kiến thức nền tảng với checklist, tình huống và
                mẫu nhật ký. Không có danh sách mã nên mua và không hứa hẹn lợi nhuận.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/request-access?interest=ebook"
                  data-analytics-event="ebook_interest_click"
                  data-analytics-label="Nhận thông báo khi phát hành"
                  data-analytics-location="ebook_hero"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#0f766e] px-5 text-sm font-bold text-white hover:bg-[#115e59]"
                >
                  Nhận thông báo khi phát hành
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/ebook/sample"
                  data-analytics-event="ebook_sample_click"
                  data-analytics-label="Đọc thử checklist miễn phí"
                  data-analytics-location="ebook_hero"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-[#b7c4ba] bg-white px-5 text-sm font-bold text-[#17201b] hover:border-[#0f766e]"
                >
                  Đọc thử miễn phí
                </Link>
              </div>
            </div>
            <div className="rounded-md border border-[#d0ded3] bg-white p-6 shadow-sm">
              <BookOpenCheck className="h-8 w-8 text-[#0f766e]" aria-hidden="true" />
              <p className="mt-4 text-sm font-bold uppercase text-[#0f766e]">
                Định dạng dự kiến
              </p>
              <p className="mt-2 text-2xl font-bold text-[#17201b]">
                Ebook + checklist thực hành
              </p>
              <p className="mt-3 text-sm leading-6 text-[#5b6861]">
                Giá và chính sách hoàn tiền sẽ chỉ được công bố khi bản đọc thử và trang
                thanh toán đã sẵn sàng.
              </p>
            </div>
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold text-[#17201b]">Nội dung dự kiến</h2>
            <div className="mt-6 grid gap-3">
              {chapters.map((chapter) => (
                <div
                  key={chapter}
                  className="flex gap-3 rounded-md border border-[#e0e5dc] bg-white p-4"
                >
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#0f766e]" aria-hidden="true" />
                  <p className="leading-7 text-[#43534a]">{chapter}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
