import { CheckCircle2 } from "lucide-react";
import { PublicFooter } from "@/components/marketing/public-footer";
import { PublicNav } from "@/components/marketing/public-nav";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { Disclaimer } from "@/components/ui/disclaimer";
import { PRICING_PLANS } from "@/lib/constants";

export const metadata = {
  title: "Gói học - JokingFinance",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <>
      <PublicNav />
      <main className="bg-[#fffdf8]">
        <section className="border-b border-[#d9ddd3] bg-[#edf5ee] px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Badge tone="green">Xem trước gói học</Badge>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-normal text-[#17201b]">
              Bản thử nghiệm chưa triển khai thanh toán.
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-[#5b6861]">
              Các gói dưới đây chỉ là bản xem trước để kiểm tra nhu cầu. Nút đăng ký sẽ dẫn về danh sách thử nghiệm sớm.
            </p>
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-3">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.name}
                className="flex flex-col rounded-md border border-[#e0e5dc] bg-white p-6 shadow-sm"
              >
                <h2 className="text-xl font-bold text-[#17201b]">{plan.name}</h2>
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
                  Tham gia danh sách thử nghiệm
                </ButtonLink>
              </div>
            ))}
          </div>
          <div className="mx-auto mt-8 max-w-7xl">
            <Disclaimer />
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
