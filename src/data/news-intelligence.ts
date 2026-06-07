export type NewsImpact = "low" | "medium" | "high";

export type NewsLens = {
  label: string;
  description: string;
};

export type NewsKnowledgeLink = {
  title: string;
  href: string;
  type: "module" | "article" | "mission" | "track";
};

export type NewsBrief = {
  title: string;
  slug: string;
  summary: string;
  status: "evergreen" | "watchlist" | "developing";
  impact: NewsImpact;
  theme: string;
  publishedAt: string;
  readingTime: number;
  sourceNote: string;
  keyQuestion: string;
  whyItMatters: string[];
  signalsToWatch: string[];
  commonMisreadings: string[];
  affectedAreas: string[];
  knowledgeLinks: NewsKnowledgeLink[];
};

export const newsLenses: NewsLens[] = [
  {
    label: "Tin nói gì?",
    description: "Tóm tắt sự kiện bằng một câu rõ ràng, bỏ tiếng ồn và lời phóng đại.",
  },
  {
    label: "Tác động vào đâu?",
    description: "Gắn tin với lãi suất, dòng tiền, ngành, doanh nghiệp, danh mục hoặc tâm lý.",
  },
  {
    label: "Cần kiểm chứng gì?",
    description: "Viết dữ liệu cần theo dõi trước khi biến tin thành luận điểm mô phỏng.",
  },
  {
    label: "Học module nào?",
    description: "Nối tin tức với kho kiến thức để người mới hiểu cơ chế, không chỉ đọc tiêu đề.",
  },
];

export const newsBriefs: NewsBrief[] = [
  {
    title: "Lãi suất tiết kiệm thay đổi: đừng chỉ nhìn ngân hàng nào trả cao nhất",
    slug: "lai-suat-tiet-kiem-thay-doi",
    summary:
      "Một thay đổi nhỏ trong bảng lãi suất có thể nói về nhu cầu vốn, thanh khoản và chiến lược huy động, nhưng người gửi tiền cần đọc theo kỳ hạn và điều kiện.",
    status: "watchlist",
    impact: "medium",
    theme: "Lãi suất và ngân hàng",
    publishedAt: "2026-06-05",
    readingTime: 7,
    sourceNote:
      "Bản demo dùng nội dung giáo dục nội bộ. Khi kết nối nguồn tin thật, mục này nên lưu đường dẫn nguồn, thời điểm cập nhật và trích yếu do biên tập viên kiểm chứng.",
    keyQuestion: "Lãi suất thay đổi vì ngân hàng cần vốn hơn, hay vì mặt bằng thị trường đang dịch chuyển?",
    whyItMatters: [
      "Người gửi tiền có thể chọn sai kỳ hạn nếu chỉ nhìn con số cao nhất.",
      "Nhà đầu tư cổ phiếu ngân hàng cần hiểu chi phí vốn chứ không chỉ xem giá cổ phiếu.",
      "Lãi suất là một tín hiệu về thanh khoản, nhưng không đủ để kết luận toàn bộ thị trường.",
    ],
    signalsToWatch: [
      "Kỳ hạn nào tăng hoặc giảm mạnh nhất.",
      "Chênh lệch giữa gửi online và gửi tại quầy.",
      "Nhóm ngân hàng nào điều chỉnh trước: quốc doanh, tư nhân lớn hay ngân hàng nhỏ.",
      "Tín dụng và huy động có đang lệch pha không.",
    ],
    commonMisreadings: [
      "Thấy lãi suất cao hơn là tự động tốt hơn.",
      "Thấy ngân hàng giảm lãi suất là kết luận ngân hàng yếu.",
      "Dùng một tin lãi suất để quyết định mua bán cổ phiếu ngay.",
    ],
    affectedAreas: ["Tiền gửi", "Cổ phiếu ngân hàng", "Chi phí vốn", "Tâm lý phòng thủ"],
    knowledgeLinks: [
      {
        title: "Đọc bảng lãi suất tiết kiệm",
        href: "/knowledge/lai-suat-va-ngan-hang/doc-bang-lai-suat-tiet-kiem",
        type: "module",
      },
      {
        title: "Đọc lãi suất như người quản lý tiền",
        href: "/tracks/doc-lai-suat-nhu-nguoi-quan-ly-tien",
        type: "track",
      },
      {
        title: "Lãi suất ngân hàng tháng 6/2026",
        href: "/articles/lai-suat-ngan-hang-thang-6-2026-dung-chi-nhin-con-so-cao-nhat",
        type: "article",
      },
    ],
  },
  {
    title: "Tin ngân hàng giảm lãi suất: tác động tới cổ phiếu không đi theo một đường thẳng",
    slug: "ngan-hang-giam-lai-suat-va-co-phieu",
    summary:
      "Lãi suất huy động thấp hơn có thể giảm áp lực chi phí vốn, nhưng lợi nhuận ngân hàng còn phụ thuộc tăng trưởng tín dụng, nợ xấu và dự phòng.",
    status: "evergreen",
    impact: "high",
    theme: "Ngành ngân hàng",
    publishedAt: "2026-06-05",
    readingTime: 8,
    sourceNote:
      "Khung phân tích này dùng cho học tập. Khi có feed tin thật, cần gắn mã nguồn, ngân hàng liên quan và dữ liệu lãi suất theo kỳ hạn.",
    keyQuestion: "Tin này ảnh hưởng tới chi phí vốn, biên lãi ròng hay chỉ là nhiễu ngắn hạn?",
    whyItMatters: [
      "Ngân hàng là nhóm vốn hóa lớn, có thể ảnh hưởng mạnh tới chỉ số.",
      "Người mới dễ nhầm lãi suất giảm với tín hiệu mua cổ phiếu ngân hàng ngay lập tức.",
      "Nợ xấu và dự phòng có thể làm câu chuyện lãi suất bớt quan trọng trong ngắn hạn.",
    ],
    signalsToWatch: [
      "Biên lãi ròng của từng ngân hàng.",
      "Tăng trưởng tín dụng so với cùng kỳ.",
      "Tỷ lệ nợ xấu và chi phí dự phòng.",
      "Tốc độ thay đổi tiền gửi không kỳ hạn.",
    ],
    commonMisreadings: [
      "Lãi suất huy động giảm thì cổ phiếu ngân hàng chắc chắn tăng.",
      "Mọi ngân hàng hưởng lợi giống nhau.",
      "Bỏ qua chất lượng tài sản vì chỉ nhìn chi phí vốn.",
    ],
    affectedAreas: ["Ngân hàng", "VN-Index", "Định giá P/B", "Rủi ro nợ xấu"],
    knowledgeLinks: [
      {
        title: "Lãi suất và cổ phiếu ngân hàng",
        href: "/knowledge/lai-suat-va-ngan-hang/lai-suat-va-co-phieu-ngan-hang",
        type: "module",
      },
      {
        title: "P/B và doanh nghiệp tài chính",
        href: "/knowledge/dinh-gia-co-ban/p-b-va-doanh-nghiep-tai-chinh",
        type: "module",
      },
      {
        title: "Lãi suất tiền gửi và cổ phiếu ngân hàng",
        href: "/articles/lai-suat-tien-gui-va-co-phieu-ngan-hang-lien-quan-voi-nhau-ra-sao",
        type: "article",
      },
    ],
  },
  {
    title: "Một phiên thị trường tăng mạnh: tin tốt hay bài kiểm tra FOMO?",
    slug: "thi-truong-tang-manh-va-fomo",
    summary:
      "Phiên tăng mạnh thường làm người mới thấy mình đang bỏ lỡ cơ hội. Đây là lúc cần tách tín hiệu thị trường khỏi cảm xúc hành động vội.",
    status: "watchlist",
    impact: "medium",
    theme: "Tâm lý thị trường",
    publishedAt: "2026-06-05",
    readingTime: 6,
    sourceNote:
      "Bản demo không khuyến nghị giao dịch theo phiên. Khi có dữ liệu thật, cần lưu độ rộng thị trường, thanh khoản, nhóm dẫn dắt và tin nền.",
    keyQuestion: "Đà tăng được xác nhận bởi dòng tiền rộng hay chỉ đến từ vài mã vốn hóa lớn?",
    whyItMatters: [
      "FOMO thường xuất hiện mạnh nhất sau khi giá đã chạy.",
      "Chỉ số tăng không có nghĩa mọi danh mục đều khỏe.",
      "Người học cần luyện cách quan sát trước khi hành động.",
    ],
    signalsToWatch: [
      "Số mã tăng so với số mã giảm.",
      "Thanh khoản so với trung bình 20 phiên.",
      "Nhóm ngành dẫn dắt là phòng thủ hay chu kỳ.",
      "Danh mục ảo của mình có tăng cùng chỉ số không.",
    ],
    commonMisreadings: [
      "Chỉ số tăng nghĩa là phải mua ngay.",
      "Một phiên mạnh đủ để xác nhận xu hướng dài hạn.",
      "Không cần luận điểm vì thị trường đang hưng phấn.",
    ],
    affectedAreas: ["Tâm lý đầu tư", "Dữ liệu thị trường", "Danh mục ảo", "Kỷ luật giao dịch"],
    knowledgeLinks: [
      {
        title: "FOMO và tin nóng",
        href: "/knowledge/tam-ly-dau-tu/fomo-va-tin-nong",
        type: "module",
      },
      {
        title: "Chỉ số thị trường",
        href: "/knowledge/du-lieu-thi-truong/chi-so-thi-truong",
        type: "module",
      },
      {
        title: "Nhận diện giao dịch FOMO",
        href: "/missions/nhan-dien-giao-dich-fomo",
        type: "mission",
      },
    ],
  },
  {
    title: "Tin lợi nhuận tăng: cần đọc chất lượng lợi nhuận trước khi mừng",
    slug: "loi-nhuan-tang-va-chat-luong-loi-nhuan",
    summary:
      "Lợi nhuận tăng là tín hiệu đáng chú ý, nhưng cần kiểm tra doanh thu, biên lợi nhuận, dòng tiền và yếu tố bất thường trước khi kết luận.",
    status: "evergreen",
    impact: "high",
    theme: "Báo cáo tài chính",
    publishedAt: "2026-06-05",
    readingTime: 9,
    sourceNote:
      "Khung này dùng cho việc đọc báo cáo. Khi nối dữ liệu doanh nghiệp thật, cần kèm kỳ báo cáo, nguồn công bố và số liệu gốc.",
    keyQuestion: "Lợi nhuận tăng nhờ hoạt động cốt lõi, hay nhờ yếu tố một lần?",
    whyItMatters: [
      "Giá cổ phiếu thường phản ứng mạnh với tin lợi nhuận.",
      "Lợi nhuận kế toán có thể khác xa dòng tiền thật.",
      "Một khoản bất thường có thể làm người mới đánh giá sai xu hướng.",
    ],
    signalsToWatch: [
      "Doanh thu và lợi nhuận gộp có cùng tăng không.",
      "Dòng tiền kinh doanh có đi cùng lợi nhuận sau thuế không.",
      "Phải thu, tồn kho hoặc chi phí vốn hóa có tăng bất thường không.",
      "Ban lãnh đạo giải thích nguyên nhân tăng trưởng thế nào.",
    ],
    commonMisreadings: [
      "Lợi nhuận tăng là doanh nghiệp chắc chắn tốt hơn.",
      "Chỉ nhìn một quý rồi suy ra nhiều năm.",
      "Không tách lợi nhuận bất thường khỏi hoạt động chính.",
    ],
    affectedAreas: ["Báo cáo tài chính", "Định giá", "Luận điểm mua", "Rủi ro sai số"],
    knowledgeLinks: [
      {
        title: "Chất lượng lợi nhuận",
        href: "/knowledge/bao-cao-tai-chinh/chat-luong-loi-nhuan",
        type: "module",
      },
      {
        title: "Báo cáo lưu chuyển tiền tệ",
        href: "/knowledge/bao-cao-tai-chinh/bao-cao-luu-chuyen-tien-te",
        type: "module",
      },
      {
        title: "P/E và kỳ vọng lợi nhuận",
        href: "/knowledge/dinh-gia-co-ban/p-e-va-ky-vong-loi-nhuan",
        type: "module",
      },
    ],
  },
  {
    title: "Một mã vượt tỷ trọng lớn trong danh mục: thắng lợi hay rủi ro tập trung?",
    slug: "ma-vuot-ty-trong-lon-trong-danh-muc",
    summary:
      "Một mã tăng mạnh có thể làm danh mục lời nhanh, nhưng cũng khiến rủi ro phụ thuộc tăng lên nếu người học không tái cân bằng hoặc viết lại luận điểm.",
    status: "evergreen",
    impact: "medium",
    theme: "Danh mục và rủi ro",
    publishedAt: "2026-06-05",
    readingTime: 6,
    sourceNote:
      "Tình huống này phục vụ mô phỏng danh mục ảo. Không phải lời khuyên bán hay mua bất kỳ mã nào.",
    keyQuestion: "Tỷ trọng tăng vì luận điểm tốt lên, hay chỉ vì giá đã chạy?",
    whyItMatters: [
      "Danh mục lời nhưng rủi ro có thể đang tăng.",
      "Người mới thường nhầm kết quả tốt ngắn hạn với quy trình tốt.",
      "Tái cân bằng là kỹ năng quan trọng trước khi dùng tiền thật.",
    ],
    signalsToWatch: [
      "Tỷ trọng mã lớn nhất so với toàn danh mục.",
      "Tỷ trọng theo ngành có bị lệch quá mạnh không.",
      "Luận điểm ban đầu còn đúng không.",
      "Nếu mã giảm 15%, danh mục chịu ảnh hưởng bao nhiêu.",
    ],
    commonMisreadings: [
      "Mã đang lời thì không còn rủi ro.",
      "Tăng tỷ trọng chỉ vì đang thắng.",
      "Đa dạng hóa nghĩa là mua thật nhiều mã bất kỳ.",
    ],
    affectedAreas: ["Danh mục", "Tái cân bằng", "Rủi ro tập trung", "Nhật ký giao dịch"],
    knowledgeLinks: [
      {
        title: "Phân bổ tỷ trọng",
        href: "/knowledge/xay-dung-danh-muc/phan-bo-ty-trong",
        type: "module",
      },
      {
        title: "Rủi ro tập trung",
        href: "/knowledge/quan-tri-rui-ro/rui-ro-tap-trung",
        type: "module",
      },
      {
        title: "Không phân bổ quá 20% vào một mã",
        href: "/missions/khong-phan-bo-qua-20-phan-tram-vao-mot-ma",
        type: "mission",
      },
    ],
  },
  {
    title: "Dữ liệu thị trường thật: có ích, nhưng luôn có độ trễ và điều kiện sử dụng",
    slug: "du-lieu-thi-truong-that-va-gioi-han",
    summary:
      "Dữ liệu từ nguồn miễn phí hoặc demo giúp học tốt hơn, nhưng cần hiểu độ trễ, lỗi thiếu dữ liệu và giới hạn điều khoản trước khi public thương mại.",
    status: "developing",
    impact: "medium",
    theme: "Dữ liệu thị trường",
    publishedAt: "2026-06-05",
    readingTime: 7,
    sourceNote:
      "App đang dùng dữ liệu demo qua lớp provider. Trước khi thương mại hóa cần kiểm tra điều khoản nguồn dữ liệu và cân nhắc nhà cung cấp có giấy phép.",
    keyQuestion: "Dữ liệu đang đủ tốt cho học tập, hay đã bị dùng như dữ liệu giao dịch thật?",
    whyItMatters: [
      "Người học cần dữ liệu thật để bớt xa rời thị trường.",
      "Dữ liệu không được kiểm chứng có thể tạo hiểu nhầm.",
      "Điều khoản nguồn dữ liệu quyết định khả năng public và thương mại hóa.",
    ],
    signalsToWatch: [
      "Nguồn dữ liệu, thời điểm cập nhật và độ trễ.",
      "Số mã bị thiếu hoặc trả về bất thường.",
      "Khác biệt giữa dữ liệu demo và dữ liệu trên nguồn chính thức.",
      "Nhu cầu cache để tránh gọi dữ liệu quá dày.",
    ],
    commonMisreadings: [
      "Có dữ liệu thật nghĩa là có thể dùng để giao dịch thật.",
      "Một nguồn miễn phí luôn được phép dùng thương mại.",
      "Không cần ghi rõ nguồn và giới hạn dữ liệu.",
    ],
    affectedAreas: ["Vnstock", "Dữ liệu demo", "Điều khoản sử dụng", "Niềm tin người dùng"],
    knowledgeLinks: [
      {
        title: "Dữ liệu thật và giới hạn dữ liệu",
        href: "/knowledge/du-lieu-thi-truong/du-lieu-that-va-gioi-han-du-lieu",
        type: "module",
      },
      {
        title: "Bảng giá và biến động",
        href: "/knowledge/du-lieu-thi-truong/bang-gia-va-bien-dong",
        type: "module",
      },
      {
        title: "Mở mô phỏng",
        href: "/app/simulator",
        type: "mission",
      },
    ],
  },
];

export function getNewsBriefBySlug(slug: string) {
  return newsBriefs.find((brief) => brief.slug === slug) ?? null;
}

export function getNewsThemes() {
  return Array.from(new Set(newsBriefs.map((brief) => brief.theme)));
}
