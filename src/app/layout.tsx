import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteAnalytics } from "@/components/analytics/site-analytics";
import { JsonLd } from "@/components/seo/json-ld";
import { getSiteUrl } from "@/lib/site-url";
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
  metadataBase: getSiteUrl(),
  title: "JokingFinance - Học tài chính bằng dữ liệu thật",
  description:
    "JokingFinance giúp người mới theo dõi dữ liệu thị trường Việt Nam, luyện đầu tư bằng điểm ảo, ghi lại luận điểm và xem lại quyết định trước khi dùng tiền thật.",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "JokingFinance",
    title: "JokingFinance - Học trước khi dùng tiền thật",
    description:
      "Học tài chính, luyện quyết định bằng tình huống và danh mục điểm ảo.",
  },
  twitter: {
    card: "summary_large_image",
    title: "JokingFinance - Học trước khi dùng tiền thật",
    description:
      "Bài học, tình huống và danh mục mô phỏng bằng điểm ảo cho người mới.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteUrl = getSiteUrl().toString();
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "JokingFinance",
    url: siteUrl,
    description:
      "Nền tảng giáo dục tài chính và mô phỏng quyết định đầu tư bằng điểm ảo.",
  };
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "JokingFinance",
    url: siteUrl,
    inLanguage: "vi-VN",
    potentialAction: {
      "@type": "SearchAction",
      target: `${new URL("/articles", siteUrl)}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <JsonLd data={[organizationSchema, websiteSchema]} />
        {children}
        <SiteAnalytics />
      </body>
    </html>
  );
}
