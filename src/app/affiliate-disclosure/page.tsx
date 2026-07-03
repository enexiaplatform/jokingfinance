import type { Metadata } from "next";
import { InformationPage } from "@/components/marketing/information-page";

export const metadata: Metadata = {
  title: "Công bố affiliate - JokingFinance",
  description:
    "Nguyên tắc công bố hoa hồng và lựa chọn sản phẩm khi JokingFinance sử dụng liên kết affiliate.",
  alternates: { canonical: "/affiliate-disclosure" },
};

export default function AffiliateDisclosurePage() {
  return (
    <InformationPage
      eyebrow="Công bố thương mại"
      title="Một số liên kết có thể tạo hoa hồng, nhưng không làm tăng giá bạn phải trả."
      introduction="JokingFinance có thể sử dụng liên kết affiliate để duy trì hoạt động. Khi điều đó xảy ra, chúng tôi sẽ đánh dấu rõ và vẫn giữ quyền đánh giá độc lập."
      sections={[
        {
          title: "Nguyên tắc lựa chọn",
          items: [
            "Chỉ giới thiệu sản phẩm phù hợp với chủ đề và nhóm người đọc của bài viết.",
            "Không gọi một sản phẩm là tốt nhất nếu chưa có tiêu chí so sánh và bằng chứng phù hợp.",
            "Nêu rõ giới hạn, chi phí, đối tượng không phù hợp và lựa chọn thay thế khi cần.",
          ],
        },
        {
          title: "Hoa hồng không phải khuyến nghị tài chính",
          paragraphs: [
            "Việc JokingFinance nhận hoa hồng không biến nội dung thành lời khuyên đầu tư, tín dụng, bảo hiểm hay thuế. Người đọc cần tự kiểm tra điều khoản tại nhà cung cấp trước khi quyết định.",
          ],
        },
        {
          title: "Cách nhận biết",
          paragraphs: [
            "Bài hoặc khu vực có liên kết affiliate sẽ có thông báo gần liên kết. Các liên kết thương mại sẽ sử dụng thuộc tính phù hợp để công cụ tìm kiếm hiểu bản chất tài trợ.",
          ],
        },
      ]}
    />
  );
}
