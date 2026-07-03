import type { Metadata } from "next";
import { InformationPage } from "@/components/marketing/information-page";

export const metadata: Metadata = {
  title: "Nguyên tắc biên tập - JokingFinance",
  description: "Cách JokingFinance nghiên cứu, viết, cập nhật và sửa nội dung tài chính.",
  alternates: { canonical: "/editorial-policy" },
};

export default function EditorialPolicyPage() {
  return (
    <InformationPage
      eyebrow="Nguyên tắc biên tập"
      title="Nội dung phải giúp người đọc hiểu và tự kiểm tra, không kích thích hành động vội."
      introduction="Tài chính là chủ đề có ảnh hưởng trực tiếp tới tiền bạc. Vì vậy, mỗi bài viết cần tách rõ dữ kiện, diễn giải, giả định và giới hạn."
      sections={[
        {
          title: "Tiêu chuẩn nội dung",
          items: [
            "Ưu tiên nguồn gốc dữ liệu và ghi ngày cụ thể đối với thông tin có thể thay đổi.",
            "Không biến một chỉ số, tin tức hoặc biến động giá thành khuyến nghị mua bán.",
            "Nêu điều kiện có thể làm kết luận sai và gợi ý dữ liệu cần theo dõi tiếp.",
            "Dùng ví dụ mô phỏng khi không cần thiết phải gắn với một chứng khoán thật.",
          ],
        },
        {
          title: "Cập nhật và sửa lỗi",
          paragraphs: [
            "Nội dung thời sự cần được xem lại khi dữ kiện chính thay đổi. Khi phát hiện lỗi có ảnh hưởng tới cách hiểu, chúng tôi ưu tiên sửa nội dung thay vì giữ nguyên để bảo toàn lượt xem.",
          ],
        },
        {
          title: "Độc lập thương mại",
          paragraphs: [
            "Ebook, tài trợ hoặc liên kết affiliate không được mua quyền thay đổi kết luận biên tập. Nội dung có lợi ích thương mại phải được công bố ở vị trí người đọc có thể nhận biết trước khi nhấp liên kết.",
          ],
        },
      ]}
    />
  );
}
