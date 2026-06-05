import { RequestAccessForm } from "@/components/marketing/request-access-form";
import { PublicFooter } from "@/components/marketing/public-footer";
import { PublicNav } from "@/components/marketing/public-nav";
import { Badge } from "@/components/ui/badge";
import { Disclaimer } from "@/components/ui/disclaimer";

export const metadata = {
  title: "Đăng ký thử nghiệm - JokingFinance",
};

export default function RequestAccessPage() {
  return (
    <>
      <PublicNav />
      <main className="bg-[#edf5ee] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <Badge tone="green">Thử nghiệm sớm</Badge>
            <h1 className="mt-4 text-4xl font-bold tracking-normal text-[#17201b]">
              Tham gia danh sách thử nghiệm JokingFinance.
            </h1>
            <p className="mt-4 text-lg leading-8 text-[#5b6861]">
              Cho JokingFinance biết mục tiêu học tài chính của bạn để bản thử nghiệm ưu tiên
              đúng những tính năng người mới thật sự cần.
            </p>
            <Disclaimer className="mt-6" />
          </div>
          <RequestAccessForm />
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
