"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw } from "lucide-react";

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center bg-[#fffdf8] px-4 py-20 sm:px-6">
      <section className="mx-auto w-full max-w-2xl rounded-md border border-[#efc1af] bg-white p-8 text-center shadow-sm sm:p-12">
        <p className="text-sm font-black uppercase text-[#9a3412]">Có lỗi tạm thời</p>
        <h1 className="mt-4 text-4xl font-black text-[#17201b]">
          Nội dung chưa tải được.
        </h1>
        <p className="mt-4 leading-7 text-[#5b6861]">
          Dữ liệu hoặc kết nối có thể vừa gián đoạn. Thử tải lại phần này; tiến độ
          được lưu trên thiết bị sẽ không bị xóa.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => unstable_retry()}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#0f766e] px-4 text-sm font-bold text-white hover:bg-[#115e59]"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Thử tải lại
          </button>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#b7c4ba] bg-white px-4 text-sm font-bold text-[#17201b] hover:border-[#0f766e]"
          >
            Về trang chủ
          </Link>
        </div>
        {error.digest ? (
          <p className="mt-6 font-mono text-xs text-[#87938c]">
            Mã đối chiếu: {error.digest}
          </p>
        ) : null}
      </section>
    </main>
  );
}
