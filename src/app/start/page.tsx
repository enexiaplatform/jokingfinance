import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  LineChart,
  Scale,
} from "lucide-react";
import { PublicFooter } from "@/components/marketing/public-footer";
import { PublicNav } from "@/components/marketing/public-nav";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Bắt đầu học tài chính trong 15 phút - JokingFinance",
  description:
    "Lộ trình ngắn cho người mới: đọc một bài nền tảng, xử lý một tình huống và mở danh mục mô phỏng bằng điểm ảo.",
  alternates: {
    canonical: "/start",
  },
};

const steps = [
  {
    number: "01",
    title: "Nắm một khái niệm",
    description:
      "Đọc bài nhập môn về cổ phiếu để hiểu bạn đang sở hữu điều gì và vì sao giá biến động.",
    href: "/articles/co-phieu-la-gi",
    action: "Đọc bài 5 phút",
    icon: BookOpen,
  },
  {
    number: "02",
    title: "Ra một quyết định",
    description:
      "Xử lý tình huống chia khoản thưởng để luyện thứ tự ưu tiên trước khi nghĩ tới lợi nhuận.",
    href: "/cases/chia-tien-thuong-cuoi-nam",
    action: "Làm case 7 phút",
    icon: Scale,
  },
  {
    number: "03",
    title: "Thử bằng điểm ảo",
    description:
      "Mở mô phỏng, chọn một mã và viết lý do trước khi đặt lệnh. Không dùng tiền thật.",
    href: "/app/simulator",
    action: "Mở mô phỏng",
    icon: LineChart,
  },
];

export default function StartPage() {
  return (
    <>
      <PublicNav />
      <main className="bg-[#fffdf8]">
        <section className="border-b border-[#d9ddd3] bg-[#edf5ee] px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <Badge tone="green">Lộ trình cho người mới</Badge>
            <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight text-[#17201b] md:text-5xl">
              Trong 15 phút, hiểu cách JokingFinance giúp bạn học trước khi dùng tiền thật.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#43534a]">
              Không cần biết đọc bảng giá. Không cần chọn cổ phiếu ngay. Hãy đi qua ba bước
              nhỏ để thấy cách kiến thức, tình huống và mô phỏng nối với nhau.
            </p>
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-5 lg:grid-cols-3">
              {steps.map((step) => {
                const Icon = step.icon;

                return (
                  <article
                    key={step.number}
                    className="flex h-full flex-col rounded-md border border-[#d0ded3] bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-[#d65a31]">{step.number}</span>
                      <Icon className="h-5 w-5 text-[#0f766e]" aria-hidden="true" />
                    </div>
                    <h2 className="mt-4 text-xl font-bold text-[#17201b]">{step.title}</h2>
                    <p className="mt-3 flex-1 text-sm leading-6 text-[#5b6861]">
                      {step.description}
                    </p>
                    <Link
                      href={step.href}
                      data-analytics-event="onboarding_step_click"
                      data-analytics-label={step.title}
                      data-analytics-location={`start_step_${step.number}`}
                      className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-[#0f766e] px-4 text-sm font-bold text-white hover:bg-[#115e59]"
                    >
                      {step.action}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </article>
                );
              })}
            </div>

            <section className="mt-10 rounded-md border border-[#b9d9c5] bg-[#f2fbf4] p-6">
              <div className="flex gap-3">
                <ClipboardCheck className="mt-1 h-6 w-6 shrink-0 text-[#0f766e]" aria-hidden="true" />
                <div>
                  <h2 className="text-2xl font-bold text-[#17201b]">Sau 15 phút, bạn nên có gì?</h2>
                  <ul className="mt-4 grid gap-3 text-sm leading-6 text-[#43534a]">
                    {[
                      "Hiểu cổ phiếu là quyền sở hữu doanh nghiệp, không chỉ là mã tăng giảm.",
                      "Biết một quyết định tài chính tốt cần thứ tự ưu tiên và dữ kiện.",
                      "Có một nơi luyện luận điểm, tỷ trọng và cảm xúc mà không dùng tiền thật.",
                    ].map((item) => (
                      <li key={item} className="flex gap-2">
                        <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#0f766e]" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <section className="mt-10 rounded-md bg-[#17201b] p-7 text-white">
              <h2 className="text-2xl font-bold">Sẵn sàng giữ lại tiến độ học?</h2>
              <p className="mt-3 max-w-2xl leading-7 text-[#cdd9d1]">
                Tạo tài khoản miễn phí để dùng bảng học tập, nhật ký quyết định và danh mục
                mô phỏng 100 triệu điểm ảo.
              </p>
              <Link
                href="/signup?redirectTo=/app/dashboard"
                data-analytics-event="signup_cta_click"
                data-analytics-label="Tạo tài khoản miễn phí"
                data-analytics-location="start_completion"
                className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-md bg-[#d65a31] px-5 text-sm font-bold text-white hover:brightness-95"
              >
                Tạo tài khoản miễn phí
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </section>
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
