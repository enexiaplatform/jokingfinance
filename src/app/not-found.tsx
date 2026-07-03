import { ArrowLeft, BookOpen, Scale } from "lucide-react";
import { PublicFooter } from "@/components/marketing/public-footer";
import { PublicNav } from "@/components/marketing/public-nav";
import { ButtonLink } from "@/components/ui/button-link";

export default function NotFound() {
  return (
    <>
      <PublicNav />
      <main className="flex flex-1 items-center bg-[#fffdf8] px-4 py-20 sm:px-6">
        <section className="mx-auto w-full max-w-3xl rounded-md border border-[#d0ded3] bg-white p-8 text-center shadow-sm sm:p-12">
          <p className="font-mono text-sm font-black uppercase tracking-[0.2em] text-[#0f766e]">
            Lỗi 404
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight text-[#17201b]">
            Trang này không còn ở đây.
          </h1>
          <p className="mx-auto mt-4 max-w-xl leading-7 text-[#5b6861]">
            Đường dẫn có thể đã thay đổi hoặc nội dung chưa được xuất bản. Bạn có thể
            quay về thư viện để tiếp tục học mà không mất nhịp.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/" variant="secondary">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Về trang chủ
            </ButtonLink>
            <ButtonLink href="/knowledge">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              Mở thư viện
            </ButtonLink>
            <ButtonLink href="/cases" variant="secondary">
              <Scale className="h-4 w-4" aria-hidden="true" />
              Luyện tình huống
            </ButtonLink>
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
