import type { Metadata } from "next";
import { InformationPage } from "@/components/marketing/information-page";

export const metadata: Metadata = {
  title: "Quyền riêng tư - JokingFinance",
  description: "Thông tin về dữ liệu được lưu và sử dụng khi bạn truy cập JokingFinance.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <InformationPage
      eyebrow="Quyền riêng tư"
      title="Chỉ thu thập dữ liệu cần thiết để vận hành và cải thiện trải nghiệm."
      introduction="Phiên bản hiện tại có thể lưu tiến độ, danh mục mô phỏng và nội dung đã lưu trên trình duyệt hoặc tài khoản Supabase khi được cấu hình."
      sections={[
        {
          title: "Dữ liệu có thể được xử lý",
          items: [
            "Email, tên hiển thị và dữ liệu xác thực khi bạn tạo tài khoản.",
            "Tiến độ học, nhiệm vụ, giao dịch mô phỏng và ghi chú do bạn nhập.",
            "Dữ liệu kỹ thuật tổng hợp như lượt xem trang và tương tác với các nút chính khi analytics được bật.",
          ],
        },
        {
          title: "Mục đích sử dụng",
          paragraphs: [
            "Dữ liệu được dùng để duy trì phiên đăng nhập, lưu tiến độ, vận hành tính năng và hiểu khu vực nào cần cải thiện. JokingFinance không bán dữ liệu giao dịch mô phỏng của bạn cho nhà môi giới.",
          ],
        },
        {
          title: "Lưu trữ cục bộ",
          paragraphs: [
            "Một số tiến độ được giữ trong localStorage của trình duyệt. Xóa dữ liệu trình duyệt có thể làm mất các thông tin chưa đồng bộ với tài khoản.",
          ],
        },
      ]}
    />
  );
}
