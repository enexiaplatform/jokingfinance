import type { Metadata } from "next";
import { InformationPage } from "@/components/marketing/information-page";

export const metadata: Metadata = {
  title: "Cảnh báo rủi ro và nguồn dữ liệu - JokingFinance",
  description:
    "Giới hạn của nội dung giáo dục, dữ liệu thị trường và công cụ mô phỏng JokingFinance.",
  alternates: { canonical: "/risk-disclaimer" },
};

export default function RiskDisclaimerPage() {
  return (
    <InformationPage
      eyebrow="Cảnh báo rủi ro"
      title="Học bằng dữ liệu và điểm ảo không loại bỏ rủi ro khi đầu tư thật."
      introduction="JokingFinance là nền tảng giáo dục và mô phỏng. Chúng tôi không phải công ty chứng khoán, không quản lý tiền, không thực hiện giao dịch và không cung cấp khuyến nghị đầu tư cá nhân."
      sections={[
        {
          title: "Không phải tư vấn hoặc khuyến nghị",
          items: [
            "Nội dung không phải lời mời hoặc khuyến nghị mua, bán hay nắm giữ chứng khoán.",
            "Ví dụ, mã cổ phiếu và kết quả mô phỏng chỉ dùng làm ngữ cảnh học tập.",
            "JokingFinance không cam kết lợi nhuận, độ chính xác của dự báo hoặc kết quả đầu tư.",
          ],
        },
        {
          title: "Giới hạn dữ liệu thị trường",
          items: [
            "Dữ liệu từ Vnstock có thể trễ, thiếu, bị giới hạn hoặc khác nguồn giao dịch chính thức.",
            "Khi nguồn dữ liệu lỗi, hệ thống có thể hiển thị dữ liệu minh họa gần nhất và đánh dấu rõ trạng thái.",
            "Không sử dụng bảng giá, chỉ số hoặc chỉ tiêu trên JokingFinance làm cơ sở đặt lệnh tiền thật.",
          ],
        },
        {
          title: "Mô phỏng và điểm ảo",
          items: [
            "Điểm ảo không có giá trị tiền thật, không thể nạp, rút, đổi thưởng hoặc chuyển nhượng.",
            "Kết quả danh mục ảo không phản ánh đầy đủ thanh khoản, trượt giá, thuế, tâm lý và rủi ro giao dịch thật.",
            "Lãi hoặc lỗ ảo là dữ liệu để xem lại quy trình quyết định, không phải thành tích đầu tư.",
          ],
        },
        {
          title: "Trách nhiệm của người dùng",
          paragraphs: [
            "Bạn tự chịu trách nhiệm khi áp dụng kiến thức vào quyết định tài chính thực tế. Khi cần tư vấn phù hợp với hoàn cảnh cá nhân, hãy tìm chuyên gia có giấy phép và kiểm tra dữ liệu từ nguồn chính thức.",
          ],
        },
      ]}
    />
  );
}
