import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  FilePenLine,
  LineChart,
  Newspaper,
  NotebookPen,
  SearchCheck,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import { PublicFooter } from "@/components/marketing/public-footer";
import { LandingHeroScene } from "@/components/marketing/landing-hero-scene";
import { PublicNav } from "@/components/marketing/public-nav";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { Disclaimer } from "@/components/ui/disclaimer";
import { SectionHeading } from "@/components/ui/section-heading";
import { PRICING_PLANS } from "@/lib/constants";

const platformGaps = [
  "Muốn đăng bài mỗi ngày nhưng không nên sửa mã nguồn mỗi lần.",
  "Cần nơi viết tiêu đề, nội dung, ảnh, thẻ, chuyên mục và trường tìm kiếm.",
  "Bài viết cần trạng thái bản nháp, sẵn sàng đăng và đã xuất bản.",
  "Website công khai cần tìm kiếm, chuyên mục và trang bài viết rõ ràng.",
  "Bộ mô phỏng nên là lớp thực hành, không nuốt hết trọng tâm sản phẩm.",
  "Người vận hành cần tự đăng bài hằng ngày sau khi hệ thống đã được xây.",
];

const platformLayers = [
  {
    title: "Website công khai",
    text: "Trang chủ, bài viết, chuyên mục, thẻ, tìm kiếm, mô phỏng, gói học và đăng ký thử nghiệm.",
    icon: Newspaper,
  },
  {
    title: "Tòa soạn quản trị",
    text: "Nơi viết bài như một hệ quản trị nội dung: tiêu đề, nội dung, ảnh, thẻ, chuyên mục, trường tìm kiếm, bản nháp và xuất bản.",
    icon: FilePenLine,
  },
  {
    title: "Bộ mô phỏng",
    text: "Danh mục ảo, điểm ảo, giao dịch mô phỏng, nhiệm vụ, nhật ký và phần xem lại quyết định.",
    icon: WalletCards,
  },
];

const publishingFlow = [
  "Viết bài trong tòa soạn hoặc Sanity Studio.",
  "Gắn chuyên mục, thẻ, ảnh bìa và trường tìm kiếm.",
  "Chuyển từ bản nháp sang sẵn sàng đăng.",
  "Bài xuất hiện trên website công khai để người đọc tìm và đọc.",
];

const features = [
  {
    title: "Bài viết tài chính hằng ngày",
    text: "Website ưu tiên luồng đọc bài, tìm kiếm nội dung và xem theo chuyên mục.",
    icon: BookOpen,
  },
  {
    title: "Tòa soạn nội dung",
    text: "Màn hình quản trị để soạn bài, xem trước, lưu nháp và đưa vào hàng chờ đăng.",
    icon: FilePenLine,
  },
  {
    title: "Trường tìm kiếm",
    text: "Quản lý tiêu đề tìm kiếm, mô tả tìm kiếm, thẻ và chuyên mục cho từng bài.",
    icon: SearchCheck,
  },
  {
    title: "Lịch nội dung",
    text: "Theo dõi bài đang viết, bài sẵn sàng đăng và bài đã xuất bản.",
    icon: CalendarDays,
  },
  {
    title: "Bộ mô phỏng danh mục",
    text: "Phần thực hành vẫn có danh mục ảo, điểm ảo, lệnh mua/bán và cảnh báo rủi ro.",
    icon: LineChart,
  },
  {
    title: "Nhật ký và nhiệm vụ",
    text: "Bài viết có thể dẫn sang nhiệm vụ, còn người đọc ghi lại luận điểm và cảm xúc khi mô phỏng.",
    icon: NotebookPen,
  },
];

const safetyPoints = [
  "Chỉ phục vụ giáo dục",
  "Không giao dịch tiền thật",
  "Không khuyến nghị đầu tư",
  "Chỉ dùng điểm ảo",
  "Nội dung và mô phỏng tách thành hai lớp rõ ràng",
];

export default function Home() {
  return (
    <>
      <PublicNav />
      <main>
        <LandingHeroScene />

        <section className="bg-[#fffdf8] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <Badge tone="coral">Vấn đề vận hành nội dung</Badge>
              <h2 className="mt-4 text-3xl font-bold tracking-normal text-[#17201b] md:text-4xl">
                Codex nên xây hệ thống một lần, không phải sửa mã nguồn mỗi ngày để đăng bài.
              </h2>
              <p className="mt-4 text-lg leading-8 text-[#5b6861]">
                JokingFinance cần hoạt động như một website nội dung tài chính: người vận hành tự viết,
                tự lưu nháp, tự xuất bản, còn phần mô phỏng chỉ là lớp trải nghiệm đi kèm.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {platformGaps.map((problem) => (
                <div
                  key={problem}
                  className="rounded-md border border-[#e0e5dc] bg-[#f8fbf7] p-4"
                >
                  <p className="text-sm font-medium leading-6 text-[#314039]">
                    {problem}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-[#d9ddd3] bg-[#edf5ee] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Ba lớp hệ thống"
              title="Website đọc bài, tòa soạn đăng bài, bộ mô phỏng thực hành"
            >
              Hướng đúng là tách hệ thống thành các lớp độc lập. Khi đã có tòa soạn, anh có thể đăng bài mới hằng ngày
              mà không cần mở Codex để sửa mã nguồn.
            </SectionHeading>

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {platformLayers.map((layer) => {
                const Icon = layer.icon;

                return (
                  <div
                    key={layer.title}
                    className="rounded-md border border-[#cad9cf] bg-white p-6 shadow-sm"
                  >
                    <Icon className="h-7 w-7 text-[#0f766e]" aria-hidden="true" />
                    <h3 className="mt-4 text-xl font-bold text-[#17201b]">{layer.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-[#5b6861]">{layer.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#fffdf8] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Luồng xuất bản"
              title="Đăng bài hằng ngày theo quy trình tòa soạn"
            />

            <div className="mt-10 grid gap-4 md:grid-cols-4">
              {publishingFlow.map((step, index) => (
                <div
                  key={step}
                  className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#0f766e] font-mono text-sm font-bold text-white">
                    {index + 1}
                  </div>
                  <p className="mt-4 text-sm font-semibold leading-6 text-[#17201b]">{step}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/app/content">
                <FilePenLine className="h-4 w-4" aria-hidden="true" />
                Mở tòa soạn
              </ButtonLink>
              <ButtonLink href="/studio" variant="secondary">
                <ClipboardList className="h-4 w-4" aria-hidden="true" />
                Mở Sanity Studio
              </ButtonLink>
            </div>
          </div>
        </section>

        <section className="bg-[#f6f2e8] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Tính năng bản thử nghiệm"
              title="Nền tảng nội dung trước, mô phỏng đi kèm"
            />

            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className="rounded-md border border-[#ded6c4] bg-[#fffdf8] p-5 shadow-sm"
                  >
                    <Icon className="h-6 w-6 text-[#d65a31]" aria-hidden="true" />
                    <h3 className="mt-4 font-bold text-[#17201b]">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#5b6861]">
                      {feature.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#17201b] px-4 py-16 text-white sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <Badge tone="gold">An toàn là trước hết</Badge>
              <h2 className="mt-4 text-3xl font-bold tracking-normal md:text-4xl">
                Website nội dung có thể vui, nhưng không được biến thành phím hàng.
              </h2>
              <p className="mt-4 text-lg leading-8 text-[#c9d6ce]">
                JokingFinance vẫn giữ ranh giới rõ ràng: bài viết để giáo dục, bộ mô phỏng để thực hành,
                không giao dịch tiền thật và không khuyến nghị mua/bán.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {safetyPoints.map((point) => (
                <div key={point} className="flex items-center gap-3 rounded-md border border-white/15 bg-white/5 p-4">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-[#a7e1b8]" aria-hidden="true" />
                  <span className="text-sm font-semibold text-[#eef7f0]">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#fffdf8] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading eyebrow="Xem trước gói vận hành" title="Chưa thu phí trong bản thử nghiệm" />

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {PRICING_PLANS.map((plan) => (
                <div
                  key={plan.name}
                  className="flex flex-col rounded-md border border-[#e0e5dc] bg-white p-6 shadow-sm"
                >
                  <h3 className="text-xl font-bold text-[#17201b]">{plan.name}</h3>
                  <p className="mt-2 font-mono text-2xl font-bold text-[#0f766e]">
                    {plan.price}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-[#5b6861]">
                    {plan.description}
                  </p>
                  <ul className="mt-5 space-y-3 text-sm text-[#314039]">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0f766e]" aria-hidden="true" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <ButtonLink href="/request-access" className="mt-6">
                    Đăng ký thử nghiệm
                  </ButtonLink>
                </div>
              ))}
            </div>

            <Disclaimer className="mt-8" />
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
