import Link from "next/link";
import { EDUCATION_DISCLAIMER, PUBLIC_NAV_ITEMS } from "@/lib/constants";

const footerLinks = [
  ...PUBLIC_NAV_ITEMS,
  { label: "Đăng nhập", href: "/login" },
];

export function PublicFooter() {
  return (
    <footer className="border-t border-[#d9ddd3] bg-[#17201b] text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.3fr_1fr] lg:px-8">
        <div>
          <p className="text-lg font-bold">JokingFinance</p>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#c9d6ce]">
            JokingFinance không đùa với tiền của bạn. Nền tảng này giúp bạn
            học tài chính nhẹ nhàng, an toàn và thực tế hơn trước khi dùng tiền thật.
          </p>
          <p className="mt-4 max-w-3xl text-xs leading-6 text-[#aebcb4]">
            {EDUCATION_DISCLAIMER}
          </p>
        </div>

        <nav className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3" aria-label="Chân trang">
          {footerLinks.map((link) => (
            <Link
              key={`${link.href}-${link.label}`}
              href={link.href}
              className="rounded-md px-2 py-1 text-[#e7efe9] hover:bg-white/10"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
