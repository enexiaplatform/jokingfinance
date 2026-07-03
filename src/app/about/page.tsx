import type { Metadata } from "next";
import { InformationPage } from "@/components/marketing/information-page";

export const metadata: Metadata = {
  title: "Giới thiệu JokingFinance",
  description:
    "JokingFinance giúp người mới học tài chính qua bài học, tình huống và mô phỏng bằng điểm ảo.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <InformationPage
      eyebrow="Về JokingFinance"
      title="Học cách ra quyết định trước khi học cách đặt lệnh."
      introduction="JokingFinance là sản phẩm giáo dục tài chính dành cho người mới tại Việt Nam. Mục tiêu không phải dự đoán mã tăng giá, mà là giúp người học hình thành quy trình đọc dữ kiện, viết luận điểm và xem lại quyết định."
      sections={[
        {
          title: "Sản phẩm giải quyết vấn đề gì?",
          items: [
            "Biến khái niệm tài chính thành bài học ngắn, câu hỏi kiểm tra và nhiệm vụ có thể thực hiện.",
            "Cho phép luyện phân bổ, giao dịch và ghi nhật ký bằng điểm ảo, không kết nối tài khoản chứng khoán.",
            "Dùng tình huống giả lập để người học ra quyết định trước khi xem phần phân tích.",
          ],
        },
        {
          title: "JokingFinance không làm gì?",
          paragraphs: [
            "Chúng tôi không môi giới, không nhận tiền đầu tư, không cung cấp tín hiệu mua bán và không cam kết lợi nhuận. Dữ liệu thị trường chỉ phục vụ ngữ cảnh học tập và có thể chậm, thiếu hoặc dùng nguồn dự phòng.",
          ],
        },
        {
          title: "Cách chúng tôi tạo giá trị",
          paragraphs: [
            "Nội dung ưu tiên khả năng kiểm chứng, tính thực hành và ngôn ngữ dễ hiểu. Mọi sản phẩm trả phí hoặc liên kết thương mại trong tương lai phải tuân theo nguyên tắc biên tập và công bố lợi ích rõ ràng.",
          ],
        },
      ]}
    />
  );
}
