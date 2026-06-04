import {
  CalendarDays,
  FilePenLine,
  Newspaper,
  SearchCheck,
  ShieldCheck,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { Badge } from "@/components/ui/badge";
import { ALT_TAGLINE, MOCK_DATA_DISCLAIMER, TAGLINE } from "@/lib/constants";

export function LandingHeroScene() {
  return (
    <section className="relative isolate overflow-hidden border-b border-[#d9ddd3] bg-[#eaf3ec]">
      <div className="jf-grid absolute inset-0 -z-20" aria-hidden="true" />
      <div className="absolute inset-y-0 right-0 -z-10 hidden w-[58%] bg-[#dff0e5] lg:block" aria-hidden="true" />

      <div className="mx-auto grid min-h-[82vh] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div className="relative z-10 max-w-3xl py-10">
          <Badge tone="green">Website nội dung tài chính + tòa soạn + mô phỏng</Badge>
          <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight tracking-normal text-[#13201b] sm:text-5xl lg:text-6xl">
            {TAGLINE}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#43534a]">
            {ALT_TAGLINE} JokingFinance tách rõ phần website cho người đọc, tòa soạn cho người viết bài
            và bộ mô phỏng cho trải nghiệm thực hành.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/app/content" className="min-w-48">
              <FilePenLine className="h-4 w-4" aria-hidden="true" />
              Vào tòa soạn
            </ButtonLink>
            <ButtonLink href="/articles" variant="secondary" className="min-w-48">
              <Newspaper className="h-4 w-4" aria-hidden="true" />
              Đọc bài viết mới nhất
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
                <p className="text-xs font-semibold uppercase text-[#66736c]">Tòa soạn hôm nay</p>
                <p className="text-2xl font-bold text-[#17201b]">12 bài trong hàng chờ</p>
              </div>
              <Badge tone="gold">Hệ quản trị nội dung</Badge>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                ["Bản nháp", "7"],
                ["Sẵn sàng đăng", "3"],
                ["Tìm kiếm đủ trường", "9"],
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
                  <p className="font-semibold text-[#17201b]">Bài đang soạn</p>
                  <FilePenLine className="h-5 w-5 text-[#0f766e]" aria-hidden="true" />
                </div>
                <p className="mt-3 text-sm leading-6 text-[#5b6861]">
                  Vì sao người mới dễ bị cuốn theo tin nóng thị trường?
                </p>
                <div className="mt-4 h-2 rounded-full bg-[#e3eadf]">
                  <div className="h-2 w-4/5 rounded-full bg-[#0f766e]" />
                </div>
              </div>

              <div className="rounded-md border border-[#e0e5dc] bg-white p-3">
                <div className="flex items-center gap-2">
                  <SearchCheck className="h-5 w-5 text-[#d65a31]" aria-hidden="true" />
                  <p className="font-semibold text-[#17201b]">Checklist đăng bài</p>
                </div>
                <p className="mt-3 text-sm leading-6 text-[#5b6861]">
                  Tiêu đề, tóm tắt, ảnh bìa, thẻ, chuyên mục, mô tả tìm kiếm và trạng thái xuất bản.
                </p>
              </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-md border border-[#e0e5dc]">
              <div className="grid grid-cols-4 bg-[#f3f7f0] px-3 py-2 text-xs font-semibold text-[#66736c]">
                <span>Tiêu đề</span>
                <span>Chuyên mục</span>
                <span>Trạng thái</span>
                <span>Lịch</span>
              </div>
              {[
                ["Đọc tin thị trường", "Nhập môn", "Sẵn sàng", "Hôm nay"],
                ["P/E cho người mới", "Báo cáo", "Nháp", "Ngày mai"],
                ["Ghi luận điểm", "Thực hành", "Đã đăng", "Tuần này"],
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

            <div className="mt-4 flex items-center gap-2 rounded-md border border-[#e2d3a7] bg-[#fff8df] p-3 text-sm leading-6 text-[#5b420b]">
              <CalendarDays className="h-4 w-4 shrink-0" aria-hidden="true" />
              Đăng bài mỗi ngày qua hệ quản trị nội dung; Codex chỉ cần xây hệ thống một lần.
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm text-[#5b6861]">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Nội dung vẫn giữ lớp an toàn: giáo dục, mô phỏng, không khuyến nghị đầu tư.
          </div>
        </div>
      </div>
    </section>
  );
}
