import type { Metadata } from "next";
import { InformationPage } from "@/components/marketing/information-page";

export const metadata: Metadata = {
  title: "Điều khoản sử dụng - JokingFinance",
  description: "Điều khoản sử dụng nội dung giáo dục và công cụ mô phỏng JokingFinance.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <InformationPage
      eyebrow="Điều khoản sử dụng"
      title="JokingFinance là sản phẩm giáo dục và mô phỏng, không phải dịch vụ đầu tư."
      introduction="Khi sử dụng trang web, bạn đồng ý tự chịu trách nhiệm cho quyết định tài chính thực tế và không xem điểm ảo hoặc nội dung học tập là cam kết lợi nhuận."
      sections={[
        {
          title: "Phạm vi dịch vụ",
          items: [
            "Điểm ảo không có giá trị quy đổi, không thể nạp, rút hoặc chuyển nhượng.",
            "Giá và chỉ số có thể chậm, thiếu hoặc khác dữ liệu giao dịch chính thức.",
            "Nội dung không thay thế tư vấn cá nhân từ chuyên gia có giấy phép phù hợp.",
          ],
        },
        {
          title: "Sử dụng hợp lý",
          paragraphs: [
            "Bạn không được dùng hệ thống để phá hoại dịch vụ, truy cập trái phép hoặc sao chép hàng loạt nội dung nhằm tái xuất bản thương mại khi chưa được đồng ý.",
          ],
        },
        {
          title: "Sản phẩm trả phí trong tương lai",
          paragraphs: [
            "Điều kiện giá, hoàn tiền, quyền truy cập và phạm vi giấy phép của ebook hoặc sản phẩm số sẽ được công bố tại trang bán hàng trước khi thanh toán.",
          ],
        },
      ]}
    />
  );
}
