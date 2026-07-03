import type { Metadata } from "next";
import { InformationPage } from "@/components/marketing/information-page";

export const metadata: Metadata = {
  title: "Liên hệ - JokingFinance",
  description: "Kênh liên hệ về nội dung, dữ liệu, quyền riêng tư và hỗ trợ JokingFinance.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <InformationPage
      eyebrow="Liên hệ"
      title="Báo lỗi nội dung, dữ liệu hoặc yêu cầu hỗ trợ."
      introduction="Trong giai đoạn thử nghiệm, vui lòng dùng form đăng ký sớm và ghi rõ loại yêu cầu. Không gửi mật khẩu, mã xác thực, thông tin tài khoản chứng khoán hoặc dữ liệu tài chính nhạy cảm."
      sections={[
        {
          title: "Các vấn đề nên báo",
          items: [
            "Ngày, số liệu hoặc nguồn dữ liệu hiển thị không chính xác.",
            "Nội dung có thể bị hiểu nhầm là khuyến nghị đầu tư.",
            "Lỗi đăng nhập, lưu tiến độ, danh mục ảo hoặc quyền riêng tư.",
          ],
        },
        {
          title: "Kênh hỗ trợ hiện tại",
          paragraphs: [
            "Sử dụng trang Đăng ký thử nghiệm và mô tả ngắn vấn đề trong ô góp ý. Kênh hỗ trợ trực tiếp sẽ được công bố trước khi mở bán sản phẩm trả phí.",
          ],
        },
      ]}
    />
  );
}
