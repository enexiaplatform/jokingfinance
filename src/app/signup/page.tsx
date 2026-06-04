import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";
import { PublicFooter } from "@/components/marketing/public-footer";
import { PublicNav } from "@/components/marketing/public-nav";
import { Badge } from "@/components/ui/badge";
import { Disclaimer } from "@/components/ui/disclaimer";
import { INITIAL_VIRTUAL_POINTS } from "@/lib/constants";
import { formatPoints } from "@/lib/format";

export const metadata = {
  title: "Đăng ký - JokingFinance",
};

export default function SignupPage() {
  return (
    <>
      <PublicNav />
      <main className="flex-1 bg-[#edf5ee] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Badge tone="green">Bắt đầu luyện tập</Badge>
            <h1 className="mt-4 text-4xl font-bold text-[#17201b]">
              Tạo tài khoản và nhận {formatPoints(INITIAL_VIRTUAL_POINTS)}.
            </h1>
            <p className="mt-4 text-lg leading-8 text-[#5b6861]">
              Điểm ảo chỉ dùng để học và mô phỏng. Không có nạp, rút, đổi thưởng
              hay giá trị tiền thật.
            </p>
            <Disclaimer className="mt-6" />
          </div>
          <div className="rounded-md border border-[#e0e5dc] bg-[#fffdf8] p-6 shadow-sm">
            <Suspense fallback={<div className="text-sm text-[#5b6861]">Đang tải form...</div>}>
              <AuthForm mode="signup" />
            </Suspense>
            <p className="mt-5 text-sm text-[#5b6861]">
              Đã có tài khoản?{" "}
              <Link href="/login" className="font-semibold text-[#0f766e]">
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
