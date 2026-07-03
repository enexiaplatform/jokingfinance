import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, FileCheck2 } from "lucide-react";
import { PublicFooter } from "@/components/marketing/public-footer";
import { PublicNav } from "@/components/marketing/public-nav";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Đọc thử ebook quy trình đầu tư - JokingFinance",
  description:
    "Đọc thử checklist bảy bước giúp người mới chuẩn bị trước khi chọn cổ phiếu và dùng tiền thật.",
  alternates: {
    canonical: "/ebook/sample",
  },
  robots: {
    index: false,
    follow: true,
  },
};

const checklist = [
  "Khoản tiền này có cần dùng trong 12 tháng tới không?",
  "Quỹ dự phòng và nợ lãi cao đã được xử lý chưa?",
  "Bạn giải thích được doanh nghiệp kiếm tiền như thế nào không?",
  "Luận điểm mua và dữ kiện chứng minh mình sai là gì?",
  "Nếu nhận định sai, tỷ trọng hiện tại gây thiệt hại bao nhiêu?",
  "Bạn đã thử quyết định này trong mô phỏng chưa?",
  "Ngày nào bạn sẽ xem lại quyết định và dựa trên dữ kiện nào?",
];

export default function EbookSamplePage() {
  return (
    <>
      <PublicNav />
      <main className="bg-[#fffdf8]">
        <section className="border-b border-[#d9ddd3] bg-[#edf5ee] px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <Badge tone="green">Bản đọc thử miễn phí</Badge>
            <h1 className="mt-4 text-4xl font-black leading-tight text-[#17201b] md:text-5xl">
              Checklist 7 bước trước khi chọn một cổ phiếu.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#43534a]">
              Đây là một phần làm việc thật trong ebook đang biên tập. Không cần để lại
              email để đọc và không có danh sách mã nên mua.
            </p>
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
            <article>
              <div className="rounded-md border border-[#d0ded3] bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <FileCheck2 className="h-6 w-6 text-[#0f766e]" aria-hidden="true" />
                  <h2 className="text-2xl font-bold text-[#17201b]">
                    Dùng checklist như thế nào?
                  </h2>
                </div>
                <p className="mt-4 leading-7 text-[#4c5d54]">
                  Trả lời từng câu bằng một hoặc hai dòng. Nếu bạn chưa trả lời được,
                  đừng vội lấp chỗ trống bằng một câu chuyện nghe có vẻ hợp lý. Hãy ghi
                  rõ “chưa biết” và biến nó thành việc cần tìm hiểu.
                </p>
                <p className="mt-4 leading-7 text-[#4c5d54]">
                  Checklist không dự đoán giá. Nó giúp bạn tách quyết định có quy trình
                  khỏi quyết định bị kéo bởi tin nóng, cảm xúc hoặc ý kiến của người khác.
                </p>
              </div>

              <ol className="mt-6 grid gap-3">
                {checklist.map((item, index) => (
                  <li
                    key={item}
                    className="flex gap-3 rounded-md border border-[#e0e5dc] bg-white p-4"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#0f766e] font-mono text-xs font-bold text-white">
                      {index + 1}
                    </span>
                    <span className="leading-7 text-[#314039]">{item}</span>
                  </li>
                ))}
              </ol>

              <div className="mt-8 rounded-md border border-[#b9d9c5] bg-[#f2fbf4] p-5">
                <h2 className="text-xl font-bold text-[#17201b]">Cách tự kiểm tra</h2>
                <ul className="mt-4 grid gap-3 text-sm leading-6 text-[#43534a]">
                  {[
                    "Câu trả lời có dựa trên dữ kiện hay chỉ là kỳ vọng?",
                    "Bạn đã viết điều gì có thể chứng minh mình sai chưa?",
                    "Tỷ trọng có đủ nhỏ để bạn vẫn bình tĩnh khi giá giảm?",
                  ].map((item) => (
                    <li key={item} className="flex gap-2">
                      <CheckCircle2
                        className="mt-1 h-4 w-4 shrink-0 text-[#0f766e]"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>

            <aside>
              <div className="sticky top-6 rounded-md bg-[#17201b] p-5 text-white">
                <p className="text-sm font-bold uppercase text-[#9bc9ac]">
                  Bản đầy đủ đang biên tập
                </p>
                <h2 className="mt-3 text-2xl font-bold">
                  Nhận thông báo và ba trang đọc thử tiếp theo.
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#cdd9d1]">
                  Danh sách chờ chỉ dùng để cập nhật ebook. Không gửi khuyến nghị mua bán.
                </p>
                <Link
                  href="/request-access?interest=ebook"
                  data-analytics-event="ebook_interest_click"
                  data-analytics-label="Nhận phần đọc thử tiếp theo"
                  data-analytics-location="ebook_sample_sidebar"
                  className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-[#d65a31] px-4 text-sm font-bold text-white hover:brightness-95"
                >
                  Nhận phần đọc thử tiếp theo
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
