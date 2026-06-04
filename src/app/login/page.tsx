import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";
import { PublicFooter } from "@/components/marketing/public-footer";
import { PublicNav } from "@/components/marketing/public-nav";
import { Badge } from "@/components/ui/badge";
import { Disclaimer } from "@/components/ui/disclaimer";

export const metadata = {
  title: "Đăng nhập - JokingFinance",
};

export default function LoginPage() {
  return (
    <>
      <PublicNav />
      <main className="flex-1 bg-[#edf5ee] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Badge tone="green">Chào mừng trở lại</Badge>
            <h1 className="mt-4 text-4xl font-bold text-[#17201b]">
              Đăng nhập để tiếp tục luyện tập.
            </h1>
            <p className="mt-4 text-lg leading-8 text-[#5b6861]">
              Vào tổng quan để mở tòa soạn, xem danh mục ảo, nhiệm vụ đang làm và nhật ký giao dịch.
            </p>
            <Disclaimer className="mt-6" />
          </div>
          <div className="rounded-md border border-[#e0e5dc] bg-[#fffdf8] p-6 shadow-sm">
            <Suspense fallback={<div className="text-sm text-[#5b6861]">Đang tải form...</div>}>
              <AuthForm mode="login" />
            </Suspense>
            <p className="mt-5 text-sm text-[#5b6861]">
              Chưa có tài khoản?{" "}
              <Link href="/signup" className="font-semibold text-[#0f766e]">
                Tạo tài khoản
              </Link>
            </p>
          </div>
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
