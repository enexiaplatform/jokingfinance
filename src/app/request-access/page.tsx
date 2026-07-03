import type { Metadata } from "next";
import { RequestAccessForm } from "@/components/marketing/request-access-form";
import { PublicFooter } from "@/components/marketing/public-footer";
import { PublicNav } from "@/components/marketing/public-nav";
import { Badge } from "@/components/ui/badge";
import { Disclaimer } from "@/components/ui/disclaimer";

type RequestAccessPageProps = {
  searchParams?: Promise<{
    interest?: string;
  }>;
};

export async function generateMetadata({
  searchParams,
}: RequestAccessPageProps): Promise<Metadata> {
  const params = await searchParams;
  const isEbookInterest = params?.interest === "ebook";

  return {
    title: isEbookInterest
      ? "Danh sách chờ ebook - JokingFinance"
      : "Đăng ký thử nghiệm - JokingFinance",
    description: isEbookInterest
      ? "Nhận cập nhật khi phần đọc thử tiếp theo hoặc ebook quy trình đầu tư cho người mới sẵn sàng."
      : "Đăng ký tham gia danh sách thử nghiệm sớm của JokingFinance.",
    alternates: {
      canonical: "/request-access",
    },
    robots: isEbookInterest
      ? {
          index: false,
          follow: true,
        }
      : undefined,
  };
}

export default async function RequestAccessPage({ searchParams }: RequestAccessPageProps) {
  const params = await searchParams;
  const interest = params?.interest === "ebook" ? "ebook" : "early-access";
  const isEbookInterest = interest === "ebook";

  return (
    <>
      <PublicNav />
      <main className="bg-[#edf5ee] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <Badge tone="green">{isEbookInterest ? "Danh sách ebook" : "Thử nghiệm sớm"}</Badge>
            <h1 className="mt-4 text-4xl font-bold tracking-normal text-[#17201b]">
              {isEbookInterest
                ? "Nhận thông báo khi ebook JokingFinance phát hành."
                : "Tham gia danh sách thử nghiệm JokingFinance."}
            </h1>
            <p className="mt-4 text-lg leading-8 text-[#5b6861]">
              {isEbookInterest
                ? "Cho JokingFinance biết phần nào trong quy trình đầu tư bạn đang thấy khó nhất để bản ebook tập trung vào vấn đề thật."
                : "Cho JokingFinance biết mục tiêu học tài chính của bạn để bản thử nghiệm ưu tiên đúng những tính năng người mới thật sự cần."}
            </p>
            <Disclaimer className="mt-6" />
          </div>
          <RequestAccessForm interest={interest} />
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
