export type Difficulty = "beginner" | "intermediate" | "advanced";

export type Article = {
  title: string;
  slug: string;
  summary: string;
  category: string;
  categorySlug: string;
  tags: string[];
  author: string;
  publishedAt: string;
  difficulty: Difficulty;
  readingTime: number;
  coverImageUrl?: string;
  relatedStocks: string[];
  relatedMissionSlug: string;
  seoTitle: string;
  seoDescription: string;
  body: Array<string | Record<string, unknown>>;
};

export type Mission = {
  id?: string;
  title: string;
  slug: string;
  description: string;
  difficulty: Difficulty;
  category: string;
  estimatedMinutes: number;
  objective: string;
  instructions: string[];
  successCriteria: string[];
  relatedArticleSlug?: string;
  isActive: boolean;
};

export const categories = [
  {
    title: "Chứng khoán nhập môn",
    slug: "chung-khoan-nhap-mon",
    description: "Các khái niệm nền tảng cho người mới bắt đầu.",
  },
  {
    title: "Tài chính cá nhân",
    slug: "tai-chinh-ca-nhan",
    description: "Quản lý tiền, tiết kiệm, ngân sách và thói quen tài chính.",
  },
  {
    title: "Đọc báo cáo tài chính",
    slug: "doc-bao-cao-tai-chinh",
    description: "Hiểu doanh thu, lợi nhuận, dòng tiền và bảng cân đối.",
  },
  {
    title: "Phân tích ngành",
    slug: "phan-tich-nganh",
    description: "Cách nhìn doanh nghiệp trong bối cảnh ngành.",
  },
  {
    title: "Tình huống thị trường",
    slug: "case-study-thi-truong",
    description: "Bài viết từ tình huống thị trường giả lập hoặc lịch sử.",
  },
  {
    title: "Phòng luyện tập",
    slug: "practice-lab",
    description: "Bài viết có nhiệm vụ thực hành đi kèm.",
  },
  {
    title: "Kinh doanh dễ hiểu",
    slug: "kinh-doanh-de-hieu",
    description: "Khái niệm kinh doanh được giải thích nhẹ nhàng.",
  },
  {
    title: "Sai lầm tài chính",
    slug: "sai-lam-tai-chinh",
    description: "Nhận diện hành vi dễ làm người mới mất kỷ luật.",
  },
];

export const sampleArticles: Article[] = [
  {
    title: "Cổ phiếu là gì? Giải thích cho người mới trong 5 phút",
    slug: "co-phieu-la-gi",
    summary:
      "Một bài mở đầu ngắn gọn về quyền sở hữu doanh nghiệp, giá cổ phiếu và lý do người mới nên học trước khi xuống tiền.",
    category: "Chứng khoán nhập môn",
    categorySlug: "chung-khoan-nhap-mon",
    tags: ["cổ phiếu", "người mới", "nền tảng"],
    author: "Nhóm JokingFinance",
    publishedAt: "2026-06-01",
    difficulty: "beginner",
    readingTime: 5,
    relatedStocks: ["FPT", "VNM", "VCB"],
    relatedMissionSlug: "tao-danh-muc-ao-dau-tien",
    seoTitle: "Cổ phiếu là gì? Bài viết nhập môn cho người mới",
    seoDescription:
      "Hiểu cổ phiếu theo cách đơn giản trước khi luyện tập với danh mục ảo.",
    body: [
      "Cổ phiếu là một phần quyền sở hữu trong doanh nghiệp. Khi bạn mua cổ phiếu, bạn không mua một mã nhấp nháy trên màn hình, mà đang sở hữu một phần rất nhỏ của một công ty.",
      "Giá cổ phiếu thay đổi vì kỳ vọng của thị trường về tương lai doanh nghiệp thay đổi. Do đó, học cổ phiếu không chỉ là nhìn giá tăng hay giảm, mà là học cách đặt câu hỏi: doanh nghiệp kiếm tiền như thế nào, rủi ro nằm ở đâu, và mình đang trả giá bao nhiêu cho kỳ vọng đó.",
      "Người mới thường vội vàng vì cảm giác sợ bỏ lỡ. JokingFinance khuyến khích bạn luyện bằng điểm ảo trước: đọc bài, làm nhiệm vụ, viết luận điểm, rồi mới xem quyết định của mình diễn ra thế nào.",
    ],
  },
  {
    title: "Vì sao người mới dễ sợ bỏ lỡ khi thị trường tăng?",
    slug: "vi-sao-nguoi-moi-de-fomo",
    summary:
      "Cảm giác sợ bỏ lỡ không chỉ là cảm xúc. Nó là một mẫu hành vi có thể nhận diện và luyện tập để kiểm soát.",
    category: "Sai lầm tài chính",
    categorySlug: "sai-lam-tai-chinh",
    tags: ["sợ bỏ lỡ", "kỷ luật", "cảm xúc"],
    author: "Nhóm JokingFinance",
    publishedAt: "2026-06-02",
    difficulty: "beginner",
    readingTime: 6,
    relatedStocks: ["SSI", "VND", "MWG"],
    relatedMissionSlug: "nhan-dien-giao-dich-fomo",
    seoTitle: "Vì sao người mới dễ sợ bỏ lỡ khi thị trường tăng?",
    seoDescription:
      "Học cách nhận diện cảm giác sợ bỏ lỡ và luyện ghi nhật ký quyết định trước khi mua.",
    body: [
      "Cảm giác sợ bỏ lỡ xuất hiện khi bạn thấy người khác có vẻ đang kiếm được tiền còn mình thì đứng ngoài. Cảm giác đó rất thật, nhưng nó không phải là một luận điểm đầu tư.",
      "Một dấu hiệu đơn giản: bạn muốn mua ngay nhưng chưa trả lời được vì sao doanh nghiệp này đáng mua, rủi ro chính là gì, và bạn sẽ làm gì nếu giá giảm.",
      "Trong phần mô phỏng, hãy đánh dấu cảm xúc là sợ bỏ lỡ nếu bạn thấy mình bị kéo bởi tin nóng. Việc gọi đúng tên cảm xúc là bước đầu để không bị nó điều khiển.",
    ],
  },
  {
    title: "Tỷ số giá trên lợi nhuận là gì và vì sao không nên dùng máy móc?",
    slug: "pe-la-gi",
    summary:
      "Tỷ số giá trên lợi nhuận là chỉ số phổ biến, nhưng một con số thấp không tự động biến cổ phiếu thành món hời.",
    category: "Đọc báo cáo tài chính",
    categorySlug: "doc-bao-cao-tai-chinh",
    tags: ["định giá", "báo cáo tài chính"],
    author: "Nhóm JokingFinance",
    publishedAt: "2026-06-03",
    difficulty: "beginner",
    readingTime: 7,
    relatedStocks: ["FPT", "MWG", "PNJ"],
    relatedMissionSlug: "so-sanh-3-co-phieu-cung-nganh-bang-pe",
    seoTitle: "Tỷ số giá trên lợi nhuận là gì? Bài viết định giá cho người mới",
    seoDescription:
      "Tìm hiểu tỷ số giá trên lợi nhuận và luyện so sánh ba cổ phiếu cùng ngành bằng dữ liệu mô phỏng.",
    body: [
      "Tỷ số giá trên lợi nhuận là tỷ lệ giữa giá cổ phiếu và lợi nhuận trên mỗi cổ phiếu. Nói đơn giản, nó cho biết thị trường đang trả bao nhiêu đồng cho một đồng lợi nhuận hiện tại.",
      "Tỷ số thấp có thể là cơ hội, nhưng cũng có thể là tín hiệu thị trường lo ngại lợi nhuận giảm. Tỷ số cao có thể đắt, nhưng cũng có thể phản ánh kỳ vọng tăng trưởng tốt.",
      "Điểm quan trọng: đừng dùng một chỉ số duy nhất. Hãy so sánh trong cùng ngành, hiểu chất lượng lợi nhuận và ghi rõ giả định trước khi mua.",
    ],
  },
  {
    title: "Danh mục đầu tư là gì? Đừng dồn hết vào một mã",
    slug: "danh-muc-dau-tu-la-gi",
    summary:
      "Một danh mục tốt không bắt đầu bằng mã thắng lớn, mà bắt đầu bằng cách phân bổ rủi ro.",
    category: "Phòng luyện tập",
    categorySlug: "practice-lab",
    tags: ["danh mục", "rủi ro", "phân bổ"],
    author: "Nhóm JokingFinance",
    publishedAt: "2026-06-04",
    difficulty: "beginner",
    readingTime: 6,
    relatedStocks: ["VCB", "FPT", "GAS", "PNJ", "GMD"],
    relatedMissionSlug: "khong-phan-bo-qua-20-phan-tram-vao-mot-ma",
    seoTitle: "Danh mục đầu tư là gì? Bài viết phân bổ cho người mới",
    seoDescription:
      "Luyện xây danh mục ảo và tránh tập trung quá mức vào một mã cổ phiếu.",
    body: [
      "Danh mục đầu tư là tập hợp các tài sản bạn nắm giữ. Với người mới, câu hỏi đầu tiên không nên là mã nào tăng nhanh nhất, mà là nếu mình sai thì thiệt hại có kiểm soát được không.",
      "Dồn hết vào một mã có thể tạo cảm giác mạnh, nhưng nó biến một quyết định sai thành bài học rất đắt. Trong môi trường học tập, hãy thử giới hạn mỗi mã ở mức hợp lý để hiểu sức mạnh của phân bổ.",
      "JokingFinance cảnh báo khi một mã vượt 30% giá trị danh mục ảo. Cảnh báo này không nói bạn phải bán; nó nhắc bạn dừng lại và xem lại rủi ro.",
    ],
  },
  {
    title: "Trước khi mua cổ phiếu, hãy viết 3 dòng lý do",
    slug: "viet-3-dong-ly-do-truoc-khi-mua",
    summary:
      "Luận điểm mua ngắn gọn giúp bạn phân biệt quyết định có kỷ luật với quyết định bị kéo bởi cảm xúc.",
    category: "Phòng luyện tập",
    categorySlug: "practice-lab",
    tags: ["luận điểm", "nhật ký giao dịch", "kỷ luật"],
    author: "Nhóm JokingFinance",
    publishedAt: "2026-06-05",
    difficulty: "beginner",
    readingTime: 5,
    relatedStocks: ["REE", "DGC", "FPT"],
    relatedMissionSlug: "viet-ly-do-truoc-khi-mua",
    seoTitle: "Viết luận điểm trước khi mua cổ phiếu",
    seoDescription:
      "Học cách viết ba dòng lý do trước khi mua trong công cụ mô phỏng JokingFinance.",
    body: [
      "Một luận điểm không cần dài. Với người mới, ba dòng là đủ: vì sao mua, giữ trong bao lâu, và rủi ro lớn nhất là gì.",
      "Viết ra trước khi mua buộc bạn chậm lại vài phút. Vài phút đó có thể giúp bạn tránh một giao dịch chỉ dựa trên cảm xúc.",
      "Sau giao dịch, hãy quay lại nhật ký để xem điều gì đúng, điều gì sai và mình có tuân thủ kế hoạch ban đầu không.",
    ],
  },
];

export const sampleMissions: Mission[] = [
  {
    title: "Tạo danh mục ảo đầu tiên với 100 triệu điểm ảo",
    slug: "tao-danh-muc-ao-dau-tien",
    description:
      "Chọn vài cổ phiếu mô phỏng, phân bổ số điểm ảo ban đầu và viết lý do ngắn.",
    difficulty: "beginner",
    category: "Phòng luyện tập",
    estimatedMinutes: 15,
    objective: "Tạo một danh mục ảo đầu tiên thay vì mua ngẫu hứng một mã.",
    instructions: [
      "Mở phần mô phỏng và xem danh sách cổ phiếu mô phỏng.",
      "Chọn 3 đến 5 mã thuộc các ngành khác nhau.",
      "Không dùng quá 40% tiền ảo trong lần luyện tập đầu tiên.",
      "Viết một câu lý do cho từng lệnh mua.",
    ],
    successCriteria: [
      "Có ít nhất 3 mã trong danh mục.",
      "Vẫn còn tiền ảo sau khi mua.",
      "Mỗi giao dịch có luận điểm ngắn.",
    ],
    relatedArticleSlug: "co-phieu-la-gi",
    isActive: true,
  },
  {
    title: "So sánh 3 cổ phiếu cùng ngành bằng tỷ số giá trên lợi nhuận",
    slug: "so-sanh-3-co-phieu-cung-nganh-bang-pe",
    description:
      "Chọn ba cổ phiếu trong cùng một ngành và ghi lại nhận xét về tỷ số giá trên lợi nhuận.",
    difficulty: "beginner",
    category: "Đọc báo cáo tài chính",
    estimatedMinutes: 20,
    objective: "Hiểu rằng tỷ số giá trên lợi nhuận cần được so sánh trong bối cảnh ngành.",
    instructions: [
      "Chọn một ngành có ít nhất 3 mã trong danh sách mô phỏng.",
      "Ghi tỷ số giá trên lợi nhuận của từng mã.",
      "Viết một đoạn ngắn về câu hỏi cần tìm hiểu thêm.",
    ],
    successCriteria: [
      "Có 3 mã được so sánh.",
      "Có nhận xét về vì sao tỷ số này khác nhau.",
      "Không kết luận mua/bán chỉ từ một chỉ số.",
    ],
    relatedArticleSlug: "pe-la-gi",
    isActive: true,
  },
  {
    title: "Không phân bổ quá 20% danh mục vào một mã",
    slug: "khong-phan-bo-qua-20-phan-tram-vao-mot-ma",
    description:
      "Luyện giới hạn tỷ trọng để hiểu rủi ro tập trung trong danh mục.",
    difficulty: "beginner",
    category: "Quản trị rủi ro",
    estimatedMinutes: 15,
    objective: "Tập phân bổ thay vì dồn hết vào cổ phiếu đang được chú ý.",
    instructions: [
      "Tính tổng giá trị danh mục ảo.",
      "Kiểm tra tỷ trọng từng mã.",
      "Điều chỉnh kế hoạch sao cho một mã không vượt 20%.",
    ],
    successCriteria: [
      "Không có mã nào vượt 20% trong kế hoạch mua mới.",
      "Có ghi chú vì sao cần giới hạn tỷ trọng.",
    ],
    relatedArticleSlug: "danh-muc-dau-tu-la-gi",
    isActive: true,
  },
  {
    title: "Viết lý do trước khi mua một cổ phiếu",
    slug: "viet-ly-do-truoc-khi-mua",
    description:
      "Trước khi xác nhận lệnh mua mô phỏng, viết luận điểm, thời gian nắm giữ và rủi ro.",
    difficulty: "beginner",
    category: "Nhật ký giao dịch",
    estimatedMinutes: 10,
    objective: "Biến giao dịch mô phỏng thành một bài học có thể xem lại.",
    instructions: [
      "Chọn một mã bạn muốn luyện mua.",
      "Viết lý do mua trong 1 đến 3 câu.",
      "Ghi thời gian nắm giữ kỳ vọng.",
      "Ghi một rủi ro có thể làm luận điểm sai.",
    ],
    successCriteria: [
      "Lệnh mua có luận điểm.",
      "Có rủi ro được ghi lại.",
      "Có cảm xúc trước khi mua.",
    ],
    relatedArticleSlug: "viet-3-dong-ly-do-truoc-khi-mua",
    isActive: true,
  },
  {
    title: "Xem lại danh mục sau 7 ngày",
    slug: "review-danh-muc-sau-7-ngay",
    description:
      "Xem lại danh mục, tỷ trọng, lãi/lỗ và ghi một bài học sau thời gian quan sát.",
    difficulty: "beginner",
    category: "Xem lại danh mục",
    estimatedMinutes: 25,
    objective: "Luyện thói quen xem lại thay vì chỉ nhìn lời/lỗ.",
    instructions: [
      "Mở trang danh mục.",
      "Xem mã tăng, mã giảm và tỷ trọng lớn nhất.",
      "Ghi điều bạn học được từ quyết định ban đầu.",
    ],
    successCriteria: [
      "Có phần tự xem lại cho ít nhất một giao dịch.",
      "Có nhận xét về tỷ trọng danh mục.",
    ],
    isActive: true,
  },
  {
    title: "Nhận diện một giao dịch do sợ bỏ lỡ",
    slug: "nhan-dien-giao-dich-fomo",
    description:
      "Gắn nhãn cảm xúc sợ bỏ lỡ cho một lệnh mô phỏng và viết cách xử lý lần sau.",
    difficulty: "beginner",
    category: "Sai lầm tài chính",
    estimatedMinutes: 12,
    objective: "Nhận diện cảm xúc trước khi nó dẫn bạn đi quá xa.",
    instructions: [
      "Tìm một mã đang tăng trong dữ liệu mô phỏng.",
      "Nếu muốn mua vì sợ lỡ cơ hội, chọn cảm xúc là sợ bỏ lỡ.",
      "Ghi lại điều bạn sẽ kiểm tra trước khi mua thật.",
    ],
    successCriteria: [
      "Có ít nhất một giao dịch đánh dấu sợ bỏ lỡ hoặc ghi chú vì sao không bị cảm xúc này chi phối.",
      "Có một bài học trong nhật ký.",
    ],
    relatedArticleSlug: "vi-sao-nguoi-moi-de-fomo",
    isActive: true,
  },
  {
    title: "Xây danh mục gồm 5 ngành khác nhau",
    slug: "xay-danh-muc-5-nganh",
    description:
      "Chọn các mã từ 5 ngành để thấy danh mục đa dạng khác gì danh mục tập trung.",
    difficulty: "intermediate",
    category: "Phân bổ danh mục",
    estimatedMinutes: 20,
    objective: "Luyện đa dạng hóa theo ngành bằng dữ liệu mô phỏng.",
    instructions: [
      "Chọn 5 ngành khác nhau trong danh sách cổ phiếu.",
      "Mua mô phỏng với tỷ trọng cân bằng tương đối.",
      "Ghi ngành nào bạn hiểu ít nhất để học thêm.",
    ],
    successCriteria: [
      "Danh mục có ít nhất 5 ngành.",
      "Có ghi chú về ngành cần tìm hiểu thêm.",
    ],
    isActive: true,
  },
  {
    title: "Ghi lại 3 rủi ro trước khi mua",
    slug: "ghi-3-rui-ro-truoc-khi-mua",
    description:
      "Không chỉ ghi lý do tốt. Hãy ghi điều có thể khiến quyết định sai.",
    difficulty: "beginner",
    category: "Quản trị rủi ro",
    estimatedMinutes: 12,
    objective: "Tập nhìn rủi ro trước khi nhìn lợi nhuận kỳ vọng.",
    instructions: [
      "Chọn một mã trong phần mô phỏng.",
      "Ghi ba rủi ro có thể xảy ra.",
      "Chỉ xác nhận mua khi đã viết xong.",
    ],
    successCriteria: [
      "Có ghi chú rủi ro trước khi mua.",
      "Ghi chú rủi ro không chỉ viết chung chung.",
    ],
    isActive: true,
  },
  {
    title: "So sánh cổ phiếu tăng trưởng và cổ phiếu phòng thủ",
    slug: "so-sanh-tang-truong-phong-thu",
    description:
      "Chọn hai cổ phiếu có đặc điểm khác nhau và ghi lại kỳ vọng/rủi ro.",
    difficulty: "intermediate",
    category: "Kinh doanh dễ hiểu",
    estimatedMinutes: 20,
    objective: "Nhận ra mỗi kiểu doanh nghiệp có câu chuyện và rủi ro riêng.",
    instructions: [
      "Chọn một mã tăng trưởng và một mã phòng thủ trong dữ liệu mô phỏng.",
      "So sánh tỷ số giá trên lợi nhuận, ngành và biến động ngày.",
      "Ghi lý do vì sao không nên áp cùng một kỳ vọng cho cả hai.",
    ],
    successCriteria: [
      "Có hai mã được so sánh.",
      "Có nhận xét về khác biệt rủi ro.",
    ],
    isActive: true,
  },
  {
    title: "Kiểm tra mức độ tập trung danh mục",
    slug: "kiem-tra-tap-trung-danh-muc",
    description:
      "Tìm mã có tỷ trọng cao nhất và quyết định có cần điều chỉnh kế hoạch không.",
    difficulty: "beginner",
    category: "Xem lại danh mục",
    estimatedMinutes: 15,
    objective: "Hiểu khi nào danh mục bắt đầu phụ thuộc quá nhiều vào một mã.",
    instructions: [
      "Mở trang danh mục.",
      "Tìm mã có tỷ trọng cao nhất.",
      "Nếu vượt 30%, viết phần tự xem lại về rủi ro tập trung.",
    ],
    successCriteria: [
      "Xác định được mã có tỷ trọng lớn nhất.",
      "Có phần tự xem lại nếu tỷ trọng vượt 30%.",
    ],
    isActive: true,
  },
];

export function findArticle(slug: string) {
  return sampleArticles.find((article) => article.slug === slug) ?? null;
}

export function findMission(slug: string) {
  return sampleMissions.find((mission) => mission.slug === slug) ?? null;
}
