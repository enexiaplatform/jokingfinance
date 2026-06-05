import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./redesign.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JokingFinance - Học tài chính bằng dữ liệu thật, luyện danh mục bằng điểm ảo",
  description:
    "JokingFinance giúp người mới theo dõi dữ liệu thị trường Việt Nam, luyện đầu tư bằng điểm ảo, ghi lại luận điểm và xem lại quyết định trước khi dùng tiền thật.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
