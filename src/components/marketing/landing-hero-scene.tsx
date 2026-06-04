import { BookOpen, NotebookPen, ShieldCheck, TrendingUp } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { Badge } from "@/components/ui/badge";
import { MOCK_DATA_DISCLAIMER, TAGLINE } from "@/lib/constants";

export function LandingHeroScene() {
  return (
    <section className="relative isolate overflow-hidden border-b border-[#d9ddd3] bg-[#eaf3ec]">
      <div className="jf-grid absolute inset-0 -z-20" aria-hidden="true" />
      <div className="absolute inset-y-0 right-0 -z-10 hidden w-[58%] bg-[#dff0e5] lg:block" aria-hidden="true" />

      <div className="mx-auto grid min-h-[82vh] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div className="relative z-10 max-w-3xl py-10">
          <Badge tone="green">Nền tảng học tài chính và mô phỏng danh mục ảo</Badge>
          <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight tracking-normal text-[#13201b] sm:text-5xl lg:text-6xl">
            {TAGLINE}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#43534a]">
            JokingFinance giúp bạn học tài chính, đọc thị trường dễ hiểu hơn
            và luyện đầu tư bằng danh mục ảo trước khi dùng tiền thật.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/signup" className="min-w-48">
              <TrendingUp className="h-4 w-4" aria-hidden="true" />
              Bắt đầu luyện tập
            </ButtonLink>
            <ButtonLink href="/articles" variant="secondary" className="min-w-48">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              Đọc bài học mới nhất
            </ButtonLink>
          </div>
          <p className="mt-5 max-w-xl text-sm leading-6 text-[#5b6861]">
            {MOCK_DATA_DISCLAIMER}
          </p>
        </div>

        <div className="relative z-0">
          <div className="rounded-md border border-[#c9d9ce] bg-[#fffdf8] p-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#e0e5dc] pb-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[#66736c]">Danh mục ảo</p>
                <p className="text-2xl font-bold text-[#17201b]">103.420.000 điểm ảo</p>
              </div>
              <Badge tone="gold">Chế độ luyện tập</Badge>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                ["Tiền ảo còn lại", "42.800.000"],
                ["Mã đang giữ", "5 mã"],
                ["Lãi/lỗ", "+3,42%"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-md border border-[#e0e5dc] bg-[#f8fbf7] p-3">
                  <p className="text-xs text-[#66736c]">{label}</p>
                  <p className="mt-1 font-mono text-lg font-bold text-[#17201b]">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-md border border-[#e0e5dc] bg-white p-3">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-[#17201b]">Nhiệm vụ thực hành</p>
                  <NotebookPen className="h-5 w-5 text-[#0f766e]" aria-hidden="true" />
                </div>
                <p className="mt-3 text-sm leading-6 text-[#5b6861]">
                  Viết luận điểm trước khi mua một cổ phiếu. Ghi lý do, thời gian
                  nắm giữ và rủi ro bạn nhận thấy.
                </p>
                <div className="mt-4 h-2 rounded-full bg-[#e3eadf]">
                  <div className="h-2 w-2/3 rounded-full bg-[#0f766e]" />
                </div>
              </div>

              <div className="rounded-md border border-[#e0e5dc] bg-white p-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-[#d65a31]" aria-hidden="true" />
                  <p className="font-semibold text-[#17201b]">Lớp bảo vệ an toàn</p>
                </div>
                <p className="mt-3 text-sm leading-6 text-[#5b6861]">
                  Không giao dịch tiền thật. Không khuyến nghị mua/bán. Chỉ dùng điểm ảo.
                </p>
              </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-md border border-[#e0e5dc]">
              <div className="grid grid-cols-4 bg-[#f3f7f0] px-3 py-2 text-xs font-semibold text-[#66736c]">
                <span>Mã</span>
                <span>Tỷ trọng</span>
                <span>Luận điểm</span>
                <span>Cảm xúc</span>
              </div>
              {[
                ["FPT", "18%", "Rõ", "Bình tĩnh"],
                ["VCB", "16%", "Đủ", "Tò mò"],
                ["PNJ", "12%", "Cần xem lại", "Chưa chắc"],
              ].map((row) => (
                <div key={row[0]} className="grid grid-cols-4 border-t border-[#e0e5dc] px-3 py-2 text-sm">
                  {row.map((cell) => (
                    <span key={cell} className="truncate text-[#314039]">
                      {cell}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
