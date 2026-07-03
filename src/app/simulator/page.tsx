import { ShieldCheck, WalletCards } from "lucide-react";
import { PublicFooter } from "@/components/marketing/public-footer";
import { PublicNav } from "@/components/marketing/public-nav";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { Disclaimer } from "@/components/ui/disclaimer";
import { MOCK_DATA_DISCLAIMER } from "@/lib/constants";

export const metadata = {
  title: "Mô phỏng - JokingFinance",
  alternates: {
    canonical: "/simulator",
  },
};

export default function SimulatorPreviewPage() {
  return (
    <>
      <PublicNav />
      <main className="bg-[#fffdf8]">
        <section className="border-b border-[#d9ddd3] bg-[#edf5ee] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <Badge tone="green">Mô phỏng danh mục ảo</Badge>
              <h1 className="mt-4 text-4xl font-black leading-tight text-[#17201b] md:text-5xl">
                Luyện danh mục ảo trước khi dùng tiền thật.
              </h1>
              <p className="mt-5 text-lg leading-8 text-[#5b6861]">
                Công cụ mô phỏng cho phép bạn mua/bán cổ phiếu bằng điểm ảo,
                ghi luận điểm và xem lại quyết định. Không có giao dịch tiền thật.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/signup">Bắt đầu luyện tập</ButtonLink>
                <ButtonLink href="/articles" variant="secondary">
                  Đọc bài trước
                </ButtonLink>
              </div>
            </div>
            <div className="rounded-md border border-[#d9ddd3] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <WalletCards className="h-6 w-6 text-[#0f766e]" aria-hidden="true" />
                <h2 className="text-xl font-bold text-[#17201b]">Quy tắc mô phỏng bản thử nghiệm</h2>
              </div>
              <ul className="mt-5 grid gap-3 text-sm leading-6 text-[#4c5d54]">
                <li>Không mua được nếu tiền ảo không đủ.</li>
                <li>Không bán được nhiều hơn số lượng đang nắm giữ.</li>
                <li>Có phí giao dịch mô phỏng 0.15%.</li>
                <li>Cảnh báo nếu một mã vượt 30% danh mục.</li>
                <li>Luận điểm và phần tự xem lại giúp bạn rèn kỷ luật.</li>
              </ul>
              <p className="mt-5 flex gap-2 rounded-md bg-[#fff8df] p-3 text-sm leading-6 text-[#5b420b]">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                {MOCK_DATA_DISCLAIMER}
              </p>
            </div>
          </div>
        </section>
        <section className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Disclaimer />
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
