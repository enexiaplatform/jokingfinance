import {
  BookOpen,
  CheckCircle2,
  ClipboardList,
  LineChart,
  NotebookPen,
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
import { ALT_TAGLINE, PRICING_PLANS } from "@/lib/constants";

const problems = [
  "Đọc tin tài chính nhưng không biết áp dụng.",
  "Muốn đầu tư nhưng sợ mất tiền thật.",
  "Dễ bị cảm giác sợ bỏ lỡ khi thị trường tăng.",
  "Dễ dồn hết tiền theo cảm xúc.",
  "Không biết cách viết lý do trước khi mua.",
  "Không có nơi an toàn để luyện tập.",
];

const loopSteps = [
  "Đọc bài học dễ hiểu.",
  "Làm nhiệm vụ thực hành.",
  "Mua/bán bằng điểm ảo.",
  "Viết luận điểm đầu tư.",
  "Theo dõi danh mục ảo.",
  "Xem lại sai lầm và cải thiện.",
];

const howItWorks = [
  {
    title: "Học",
    text: "Đọc bài học tài chính ngắn gọn, dễ hiểu.",
    icon: BookOpen,
  },
  {
    title: "Luyện",
    text: "Dùng điểm ảo để xây danh mục.",
    icon: WalletCards,
  },
  {
    title: "Ghi lại",
    text: "Ghi lý do mua/bán và cảm xúc khi quyết định.",
    icon: NotebookPen,
  },
  {
    title: "Cải thiện",
    text: "Xem lại kết quả, học từ từng quyết định.",
    icon: LineChart,
  },
];

const features = [
  {
    title: "Bài học tài chính hằng ngày",
    text: "Bài học ngắn, dễ đọc, có ngữ cảnh Việt Nam cho người mới.",
    icon: BookOpen,
  },
  {
    title: "Danh mục ảo",
    text: "Danh mục ảo với 100 triệu điểm ảo để luyện trước khi dùng tiền thật.",
    icon: WalletCards,
  },
  {
    title: "Nhiệm vụ thực hành",
    text: "Nhiệm vụ nhỏ gắn với bài học để biến kiến thức thành hành động.",
    icon: ClipboardList,
  },
  {
    title: "Nhật ký giao dịch",
    text: "Ghi luận điểm, cảm xúc và phần tự nhìn lại sau từng giao dịch mô phỏng.",
    icon: NotebookPen,
  },
  {
    title: "Xem lại danh mục",
    text: "Xem tỷ trọng, lãi/lỗ, mã có tỷ trọng cao nhất và cảnh báo tập trung.",
    icon: LineChart,
  },
  {
    title: "Lộ trình cho người mới",
    text: "Một lộ trình nhẹ nhàng: học, luyện, ghi lại, xem lại, rồi cải thiện.",
    icon: CheckCircle2,
  },
];

const safetyPoints = [
  "Chỉ phục vụ giáo dục",
  "Không giao dịch tiền thật",
  "Không khuyến nghị đầu tư",
  "Chỉ dùng điểm ảo",
  "Thiết kế để luyện tập và xây kỷ luật",
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
              <Badge tone="coral">Nỗi đau của người mới</Badge>
              <h2 className="mt-4 text-3xl font-bold tracking-normal text-[#17201b] md:text-4xl">
                Tài chính khó hơn khi bạn phải học bằng tiền thật.
              </h2>
              <p className="mt-4 text-lg leading-8 text-[#5b6861]">
                {ALT_TAGLINE} JokingFinance tạo một môi trường để bạn thử,
                sai, ghi lại và hiểu mình đang làm gì trước khi ra quyết định thật.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {problems.map((problem) => (
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
              eyebrow="Vòng học cốt lõi"
              title="Không chỉ đọc bài. Đọc xong phải luyện."
            >
              JokingFinance được xây quanh một vòng học tập: đọc, hiểu, thực
              hành bằng danh mục ảo, ghi luận điểm, xem lại kết quả và cải thiện kỷ luật.
            </SectionHeading>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {loopSteps.map((step, index) => (
                <div
                  key={step}
                  className="rounded-md border border-[#cad9cf] bg-white p-5 shadow-sm"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#0f766e] font-mono text-sm font-bold text-white">
                    {index + 1}
                  </div>
                  <p className="mt-4 font-semibold text-[#17201b]">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#fffdf8] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Cách hoạt động"
              title="Bốn bước gọn, lặp lại mỗi ngày"
            />

            <div className="mt-10 grid gap-5 md:grid-cols-4">
              {howItWorks.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm"
                  >
                    <Icon className="h-7 w-7 text-[#0f766e]" aria-hidden="true" />
                    <h3 className="mt-4 text-lg font-bold text-[#17201b]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[#5b6861]">
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#f6f2e8] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Tính năng bản thử nghiệm"
              title="Một sân tập tài chính có kỷ luật"
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
                Vui hơn một chút, nhưng không đùa với tiền của bạn.
              </h2>
              <p className="mt-4 text-lg leading-8 text-[#c9d6ce]">
                JokingFinance không phải website phím hàng, không phải ứng dụng
                môi giới, không phải tín hiệu giao dịch. Đây là môi trường giáo dục
                và mô phỏng.
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
            <SectionHeading eyebrow="Xem trước gói học" title="Chưa thu phí trong bản thử nghiệm" />

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
