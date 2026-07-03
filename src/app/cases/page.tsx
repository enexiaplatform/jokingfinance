import { Brain, CheckCircle2, Scale, ShieldCheck } from "lucide-react";
import { PracticeCaseCatalog } from "@/components/practice-cases/practice-case-catalog";
import { PublicFooter } from "@/components/marketing/public-footer";
import { PublicNav } from "@/components/marketing/public-nav";
import { Badge } from "@/components/ui/badge";
import { practiceCases } from "@/data/practice-cases";

export const metadata = {
  title: "Tình huống thực hành - JokingFinance",
  description:
    "Luyện ra quyết định tài chính qua các case giả lập về dòng tiền, lãi suất, báo cáo tài chính, danh mục và tâm lý đầu tư.",
  alternates: { canonical: "/cases" },
};

export default function PracticeCasesPage() {
  return (
    <>
      <PublicNav />
      <main className="bg-[#fffdf8]">
        <section className="border-b border-[#d9ddd3] bg-[#edf5ee] px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-end">
            <div>
              <Badge tone="green">Tình huống thực hành</Badge>
              <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight tracking-normal text-[#17201b] md:text-5xl">
                Đặt bạn vào quyết định trước khi đưa ra lời giải.
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-[#43534a]">
                Mỗi case là một tình huống giả lập có dữ kiện, áp lực và nhiều lựa chọn
                hợp lý ở mức độ khác nhau. Mục tiêu không phải đoán đáp án, mà là xây
                quy trình đủ vững để giải thích quyết định của mình.
              </p>
            </div>

            <div className="grid gap-3">
              {[
                {
                  icon: Brain,
                  title: "Chọn trước, đọc phản hồi sau",
                  text: "Bạn phải ra quyết định trước khi thấy phần phân tích.",
                },
                {
                  icon: Scale,
                  title: "Chấm chất lượng quy trình",
                  text: "Điểm phản ánh cách cân bằng dữ kiện, mục tiêu và rủi ro.",
                },
                {
                  icon: ShieldCheck,
                  title: "Không dùng tiền thật",
                  text: "Tất cả case đều phục vụ giáo dục và mô phỏng quyết định.",
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-md border border-[#d0ded3] bg-white p-4 shadow-sm"
                  >
                    <div className="flex gap-3">
                      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[#0f766e]" aria-hidden="true" />
                      <div>
                        <h2 className="font-bold text-[#17201b]">{item.title}</h2>
                        <p className="mt-1 text-sm leading-6 text-[#5b6861]">{item.text}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-b border-[#e0e5dc] bg-white px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-3">
            {[
              { value: practiceCases.length, label: "tình huống hoàn chỉnh" },
              {
                value: practiceCases.reduce(
                  (total, item) => total + item.checkpoints.length,
                  0,
                ),
                label: "quyết định cần xử lý",
              },
              {
                value: practiceCases.reduce(
                  (total, item) => total + item.duration,
                  0,
                ),
                label: "phút luyện tập",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-md border border-[#e0e5dc] bg-[#fffdf8] p-4"
              >
                <p className="text-3xl font-black text-[#0f766e]">{item.value}</p>
                <p className="mt-1 text-sm font-semibold text-[#5b6861]">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Badge tone="gold">Case library</Badge>
                <h2 className="mt-3 text-3xl font-bold tracking-normal text-[#17201b]">
                  Bắt đầu từ tình huống gần với bạn nhất.
                </h2>
              </div>
              <p className="max-w-2xl text-sm leading-6 text-[#5b6861]">
                Kết quả được lưu trên thiết bị. Bạn có thể làm lại sau khi học module
                liên quan để xem cách ra quyết định có thay đổi hay không.
              </p>
            </div>

            <div className="mt-8">
              <PracticeCaseCatalog />
            </div>

            <div className="mt-8 rounded-md border border-[#b9d9c5] bg-[#f2fbf4] p-5">
              <div className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#0f766e]" aria-hidden="true" />
                <p className="text-sm leading-7 text-[#314039]">
                  Các tình huống sử dụng doanh nghiệp, mã cổ phiếu và dữ kiện giả lập.
                  Chúng giúp luyện quy trình tư duy, không mô tả cơ hội đầu tư đang tồn tại
                  và không phải khuyến nghị mua bán.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
