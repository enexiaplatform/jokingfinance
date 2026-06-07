export type KnowledgePlaybook = {
  title: string;
  slug: string;
  summary: string;
  useWhen: string;
  steps: string[];
  outputs: string[];
  links: Array<{
    title: string;
    href: string;
  }>;
};

export const knowledgePlaybooks: KnowledgePlaybook[] = [
  {
    title: "Đọc một tin lãi suất ngân hàng",
    slug: "doc-tin-lai-suat-ngan-hang",
    summary:
      "Tách tin lãi suất thành kỳ hạn, điều kiện, lý do huy động và tác động tới tiền gửi hoặc cổ phiếu ngân hàng.",
    useWhen: "Khi thấy tin ngân hàng tăng, giảm hoặc khuyến mại lãi suất tiết kiệm.",
    steps: [
      "Ghi rõ ngân hàng, kỳ hạn, hình thức gửi và mức thay đổi.",
      "So sánh với ít nhất 2 ngân hàng cùng nhóm.",
      "Viết giả thuyết: ngân hàng cần vốn, đổi cơ cấu kỳ hạn hay đi theo mặt bằng chung?",
      "Nếu liên hệ cổ phiếu ngân hàng, kiểm tra thêm chi phí vốn, tín dụng, nợ xấu và dự phòng.",
    ],
    outputs: [
      "Một bảng so sánh kỳ hạn 3, 6, 12 tháng.",
      "Ba câu hỏi cần kiểm chứng trước khi hành động.",
      "Một ghi chú trong nhật ký mô phỏng nếu tin ảnh hưởng tới danh mục.",
    ],
    links: [
      { title: "Đọc bảng lãi suất tiết kiệm", href: "/knowledge/lai-suat-va-ngan-hang/doc-bang-lai-suat-tiet-kiem" },
      { title: "Lãi suất và cổ phiếu ngân hàng", href: "/knowledge/lai-suat-va-ngan-hang/lai-suat-va-co-phieu-ngan-hang" },
      { title: "Tin lãi suất phân tích", href: "/news/lai-suat-tiet-kiem-thay-doi" },
    ],
  },
  {
    title: "Đọc nhanh một tin lợi nhuận doanh nghiệp",
    slug: "doc-tin-loi-nhuan-doanh-nghiep",
    summary:
      "Không dừng ở câu 'lợi nhuận tăng'. Playbook này ép người học kiểm tra doanh thu, biên lợi nhuận, dòng tiền và yếu tố bất thường.",
    useWhen: "Khi doanh nghiệp công bố kết quả kinh doanh quý hoặc năm.",
    steps: [
      "Xác định lợi nhuận tăng do doanh thu, biên lợi nhuận hay yếu tố một lần.",
      "So sánh lợi nhuận sau thuế với dòng tiền kinh doanh.",
      "Kiểm tra phải thu, tồn kho, nợ vay và chi phí dự phòng.",
      "Viết điều kiện khiến câu chuyện lợi nhuận không còn hấp dẫn.",
    ],
    outputs: [
      "Một nhận xét về chất lượng lợi nhuận.",
      "Một danh sách rủi ro cần theo dõi trong kỳ sau.",
      "Một quyết định mô phỏng có hoặc không hành động, kèm lý do.",
    ],
    links: [
      { title: "Chất lượng lợi nhuận", href: "/knowledge/bao-cao-tai-chinh/chat-luong-loi-nhuan" },
      { title: "Báo cáo lưu chuyển tiền tệ", href: "/knowledge/bao-cao-tai-chinh/bao-cao-luu-chuyen-tien-te" },
      { title: "Tin lợi nhuận tăng", href: "/news/loi-nhuan-tang-va-chat-luong-loi-nhuan" },
    ],
  },
  {
    title: "Chống FOMO khi thị trường tăng mạnh",
    slug: "chong-fomo-khi-thi-truong-tang",
    summary:
      "Biến cảm giác sợ bỏ lỡ thành dữ liệu để quan sát, thay vì biến nó thành lệnh mua ngay.",
    useWhen: "Khi chỉ số tăng mạnh, mạng xã hội ồn ào hoặc danh mục ảo của bạn đứng ngoài nhịp tăng.",
    steps: [
      "Gọi tên cảm xúc hiện tại trước khi nhìn mã cổ phiếu.",
      "Kiểm tra độ rộng thị trường và thanh khoản thay vì chỉ nhìn chỉ số.",
      "Viết lý do mua trong 3 dòng; nếu không viết được thì không vào lệnh.",
      "Đặt giới hạn tỷ trọng nhỏ nếu chỉ đang kiểm tra giả thuyết.",
    ],
    outputs: [
      "Một nhãn cảm xúc trong nhật ký.",
      "Một checklist thị trường gồm độ rộng, thanh khoản, nhóm dẫn dắt.",
      "Một quyết định mô phỏng có giới hạn rủi ro.",
    ],
    links: [
      { title: "FOMO và tin nóng", href: "/knowledge/tam-ly-dau-tu/fomo-va-tin-nong" },
      { title: "Chỉ số thị trường", href: "/knowledge/du-lieu-thi-truong/chi-so-thi-truong" },
      { title: "Tin thị trường tăng mạnh", href: "/news/thi-truong-tang-manh-va-fomo" },
    ],
  },
  {
    title: "Kiểm tra rủi ro tập trung danh mục",
    slug: "kiem-tra-rui-ro-tap-trung",
    summary:
      "Một mã tăng mạnh có thể làm bạn lời nhanh nhưng cũng khiến danh mục lệch khỏi kế hoạch ban đầu.",
    useWhen: "Khi một mã hoặc một ngành chiếm tỷ trọng lớn trong danh mục ảo.",
    steps: [
      "Tính tỷ trọng mã lớn nhất và tỷ trọng ngành lớn nhất.",
      "Viết lại luận điểm hiện tại mà không nhìn giá vốn.",
      "Giả lập kịch bản mã lớn nhất giảm 15%.",
      "Quyết định giữ, giảm hoặc tái cân bằng trong mô phỏng, kèm điều kiện xem lại.",
    ],
    outputs: [
      "Một bảng tỷ trọng danh mục.",
      "Một kịch bản xấu cho mã lớn nhất.",
      "Một quyết định tái cân bằng hoặc giữ nguyên có lý do.",
    ],
    links: [
      { title: "Phân bổ tỷ trọng", href: "/knowledge/xay-dung-danh-muc/phan-bo-ty-trong" },
      { title: "Rủi ro tập trung", href: "/knowledge/quan-tri-rui-ro/rui-ro-tap-trung" },
      { title: "Tin rủi ro tập trung", href: "/news/ma-vuot-ty-trong-lon-trong-danh-muc" },
    ],
  },
];
