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
  lastReviewedAt?: string;
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
  relatedCaseSlug?: string;
  isActive: boolean;
};

export type LearningTrack = {
  title: string;
  slug: string;
  description: string;
  level: Difficulty;
  estimatedMinutes: number;
  outcome: string;
  articleSlugs: string[];
  missionSlugs: string[];
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
    description: "Bài học từ tình huống thị trường giả lập hoặc lịch sử.",
  },
  {
    title: "Phòng luyện tập",
    slug: "practice-lab",
    description: "Bài học có nhiệm vụ thực hành đi kèm.",
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

export const learningTracks: LearningTrack[] = [
  {
    title: "Bắt đầu với chứng khoán",
    slug: "bat-dau-voi-chung-khoan",
    description:
      "Nắm cổ phiếu là gì, vì sao giá thay đổi và cách viết luận điểm trước khi mua.",
    level: "beginner",
    estimatedMinutes: 22,
    outcome: "Tạo được danh mục ảo đầu tiên và biết ghi lý do mua.",
    articleSlugs: [
      "quy-trinh-dau-tu-cho-nguoi-moi",
      "quy-du-phong-bao-nhieu-la-du-truoc-khi-dau-tu",
      "co-phieu-la-gi",
      "viet-3-dong-ly-do-truoc-khi-mua",
    ],
    missionSlugs: ["tao-danh-muc-ao-dau-tien", "viet-ly-do-truoc-khi-mua"],
  },
  {
    title: "Đọc lãi suất như người quản lý tiền",
    slug: "doc-lai-suat-nhu-nguoi-quan-ly-tien",
    description:
      "Hiểu bảng lãi suất ngân hàng, điều kiện gửi tiền và tác động lên cổ phiếu ngân hàng.",
    level: "beginner",
    estimatedMinutes: 21,
    outcome: "So sánh được lãi suất theo kỳ hạn mà không chỉ đuổi theo số cao nhất.",
    articleSlugs: [
      "lai-suat-thuc-la-gi",
      "lai-suat-ngan-hang-thang-6-2026-dung-chi-nhin-con-so-cao-nhat",
      "lpbank-sacombank-giam-lai-suat-nguoi-gui-tien-nen-hieu-dieu-gi",
      "lai-suat-tien-gui-va-co-phieu-ngan-hang-lien-quan-voi-nhau-ra-sao",
    ],
    missionSlugs: ["ghi-3-rui-ro-truoc-khi-mua", "review-danh-muc-sau-7-ngay"],
  },
  {
    title: "Luyện kỷ luật trong mô phỏng",
    slug: "luyen-ky-luat-trong-mo-phong",
    description:
      "Nhận diện FOMO, giới hạn tỷ trọng một mã và theo dõi quyết định sau vài ngày.",
    level: "intermediate",
    estimatedMinutes: 24,
    outcome: "Biết kiểm tra cảm xúc và rủi ro trước khi tăng tỷ trọng danh mục.",
    articleSlugs: ["vi-sao-nguoi-moi-de-fomo", "danh-muc-dau-tu-la-gi"],
    missionSlugs: ["nhan-dien-giao-dich-fomo", "khong-phan-bo-qua-20-phan-tram-vao-mot-ma"],
  },
];

export const sampleArticles: Article[] = [
  {
    title: "Quy trình đầu tư cho người mới: 7 bước trước khi chọn cổ phiếu",
    slug: "quy-trinh-dau-tu-cho-nguoi-moi",
    summary:
      "Một quy trình thực hành giúp người mới đi từ mục tiêu tài chính, quỹ dự phòng và luận điểm đến quản trị rủi ro, mô phỏng và nhật ký.",
    category: "Chứng khoán nhập môn",
    categorySlug: "chung-khoan-nhap-mon",
    tags: ["người mới", "quy trình đầu tư", "quản trị rủi ro"],
    author: "Nhóm JokingFinance",
    publishedAt: "2026-06-11",
    lastReviewedAt: "2026-06-11",
    difficulty: "beginner",
    readingTime: 9,
    relatedStocks: [],
    relatedMissionSlug: "tao-danh-muc-ao-dau-tien",
    seoTitle: "Quy trình đầu tư cho người mới: 7 bước trước khi chọn cổ phiếu",
    seoDescription:
      "Quy trình đầu tư 7 bước cho người mới, từ quỹ dự phòng và mục tiêu đến mô phỏng, quản trị rủi ro và nhật ký quyết định.",
    body: [
      "Người mới thường bắt đầu bằng câu hỏi nên mua cổ phiếu nào. Một điểm bắt đầu tốt hơn là xây quy trình giúp bạn biết khi nào mình chưa nên mua, cần tìm dữ kiện gì và sẽ làm gì nếu nhận định sai.",
      "Bước 1: xác định mục tiêu và thời gian. Khoản tiền cần dùng trong vài tháng không nên chịu cùng mức biến động với khoản tiền dành cho mục tiêu nhiều năm. Thời gian quyết định loại rủi ro bạn có thể chấp nhận.",
      "Bước 2: bảo vệ nền tài chính cá nhân. Hãy xử lý nợ lãi cao và xây quỹ dự phòng trước khi đưa tiền vào tài sản biến động. Đầu tư không nên khiến một sự cố nhỏ buộc bạn bán tài sản vào thời điểm bất lợi.",
      "Bước 3: hiểu thứ mình định sở hữu. Với cổ phiếu, hãy trả lời doanh nghiệp bán gì, kiếm tiền như thế nào, lợi thế và rủi ro chính nằm ở đâu. Nếu chưa giải thích được bằng ngôn ngữ đơn giản, bạn chưa cần vội định giá.",
      "Bước 4: viết luận điểm và điều kiện sai. Ghi ba dòng: vì sao doanh nghiệp có thể tốt lên, thị trường đang kỳ vọng điều gì, và dữ kiện nào sẽ chứng minh bạn sai. Điều kiện sai quan trọng không kém lý do mua.",
      "Bước 5: thiết kế tỷ trọng trước khi đặt lệnh. Một ý tưởng hấp dẫn vẫn có thể sai. Giới hạn tỷ trọng giúp một sai lầm không phá hỏng toàn bộ kế hoạch và buộc bạn cân nhắc rủi ro thay vì chỉ nghĩ đến lợi nhuận.",
      "Bước 6: mô phỏng trước. Dùng danh mục ảo để luyện cách đặt lệnh, ghi cảm xúc và theo dõi giả thuyết. Mục tiêu của mô phỏng không phải khoe lãi, mà là phát hiện thói quen ra quyết định thiếu kỷ luật.",
      "Bước 7: xem lại bằng nhật ký. Định kỳ so sánh quyết định ban đầu với dữ kiện mới. Tách kết quả do may mắn khỏi một quy trình tốt, và đừng đánh giá chất lượng quyết định chỉ bằng việc giá đang tăng hay giảm.",
      "Quy trình không loại bỏ thua lỗ. Nó giúp bạn ra quyết định có thể giải thích, kiểm soát mức thiệt hại và học được điều gì đó sau mỗi lần đúng hoặc sai.",
    ],
  },
  {
    title: "Quỹ dự phòng bao nhiêu là đủ trước khi đầu tư?",
    slug: "quy-du-phong-bao-nhieu-la-du-truoc-khi-dau-tu",
    summary:
      "Cách ước tính quỹ dự phòng theo chi phí thiết yếu, độ ổn định thu nhập và trách nhiệm tài chính thay vì áp dụng một con số cho tất cả.",
    category: "Tài chính cá nhân",
    categorySlug: "tai-chinh-ca-nhan",
    tags: ["quỹ dự phòng", "người mới", "tài chính cá nhân"],
    author: "Nhóm JokingFinance",
    publishedAt: "2026-06-11",
    lastReviewedAt: "2026-06-11",
    difficulty: "beginner",
    readingTime: 7,
    relatedStocks: [],
    relatedMissionSlug: "ghi-3-rui-ro-truoc-khi-mua",
    seoTitle: "Quỹ dự phòng bao nhiêu là đủ trước khi đầu tư?",
    seoDescription:
      "Cách tính quỹ dự phòng dựa trên chi phí thiết yếu, thu nhập và trách nhiệm tài chính trước khi bắt đầu đầu tư.",
    body: [
      "Quỹ dự phòng là khoản tiền dành cho sự cố như mất thu nhập, chi phí y tế hoặc sửa chữa cần thiết. Nó không được tạo ra để tối đa hóa lợi nhuận, mà để bạn không phải vay đắt hoặc bán khoản đầu tư trong lúc bất lợi.",
      "Mốc ba đến sáu tháng chi phí thiết yếu là điểm tham khảo phổ biến, không phải công thức bắt buộc. Người có thu nhập ổn định, ít người phụ thuộc và bảo hiểm phù hợp có thể cần vùng đệm khác người làm nghề tự do hoặc đang gánh nhiều trách nhiệm gia đình.",
      "Hãy bắt đầu bằng chi phí thiết yếu mỗi tháng: nhà ở, ăn uống cơ bản, điện nước, đi lại, bảo hiểm, học phí bắt buộc và khoản trả nợ tối thiểu. Không dùng tổng chi tiêu có cả du lịch, mua sắm và giải trí để tính một cách máy móc.",
      "Sau đó đánh giá độ ổn định thu nhập. Nếu thu nhập biến động mạnh, ngành nghề có chu kỳ hoặc chỉ có một nguồn thu, bạn nên cân nhắc vùng đệm dài hơn. Nếu gia đình có hai nguồn thu độc lập, rủi ro gián đoạn đồng thời có thể thấp hơn.",
      "Quỹ dự phòng cần thanh khoản cao và ít biến động. Một tài sản có thể bán được không có nghĩa là nó phù hợp làm quỹ dự phòng, vì giá có thể giảm đúng lúc bạn cần tiền. Tài khoản thanh toán hoặc tiền gửi kỳ hạn ngắn thường dễ lập kế hoạch hơn.",
      "Bạn không nhất thiết phải chờ quỹ đạt mức hoàn hảo mới học đầu tư. Có thể học, đọc và dùng mô phỏng ngay; còn tiền thật nên đi sau một nền tài chính đủ vững. Đây là cách tách việc học khỏi áp lực phải kiếm lợi nhuận sớm.",
      "Rà soát quỹ khi chi phí sống, công việc hoặc trách nhiệm gia đình thay đổi. Con số phù hợp hôm nay có thể không còn đủ sau khi chuyển nhà, có con hoặc chuyển sang nguồn thu ít ổn định hơn.",
    ],
  },
  {
    title: "Bức tranh dòng tiền cá nhân (Chặng 1)",
    slug: "buc-tranh-dong-tien-ca-nhan",
    summary:
      "Hiểu rõ cấu trúc dòng tiền đi vào, đi ra và cách tối ưu hóa tích lũy trước khi nghĩ đến việc dùng tiền thật để đầu tư cổ phiếu.",
    category: "Tài chính cá nhân",
    categorySlug: "tai-chinh-ca-nhan",
    tags: ["dòng tiền", "tài chính cá nhân", "quản lý tài sản"],
    author: "Nhóm JokingFinance",
    publishedAt: "2026-07-03",
    difficulty: "beginner",
    readingTime: 6,
    relatedStocks: [],
    relatedMissionSlug: "tao-danh-muc-ao-tien",
    seoTitle: "Bức tranh dòng tiền cá nhân và phân bổ vốn JokingFinance",
    seoDescription:
      "Từng bước xây dựng dòng tiền cá nhân lành mạnh, thiết lập quỹ khẩn cấp và phân bổ tích lũy thông minh.",
    body: [
      "Kiến thức về đầu tư cổ phiếu sẽ vô nghĩa nếu bạn không kiểm soát được dòng tiền cá nhân của mình. Một dòng tiền âm hoặc không ổn định sẽ liên tục đặt bạn vào tình thế phải rút tiền đầu tư vào những thời điểm tệ nhất.",
      "Dòng tiền cá nhân gồm ba phần chính: Dòng tiền vào (Thu nhập chủ động & thụ động), Dòng tiền ra (Chi phí thiết yếu & không thiết yếu) và Phần thặng dư tích lũy. Mục tiêu đầu tiên không phải là làm giàu nhanh, mà là tối ưu hóa phần thặng dư tích lũy này.",
      "Rất nhiều người mới mắc sai lầm khi dồn toàn bộ thặng dư tháng đầu tiên vào tài khoản chứng khoán tiền thật. Khi xe hỏng, đau ốm hoặc mất việc, họ buộc phải bán cổ phiếu lỗ để lấy tiền mặt trang trải. Họ gọi đó là 'xui xẻo', nhưng thực chất đó là lỗi thiết kế dòng tiền.",
      "Quy trình phân bổ vốn chuẩn mực bắt đầu bằng việc xây dựng một lá chắn vững chắc - Quỹ dự phòng khẩn cấp từ 6 đến 12 tháng chi phí thiết yếu. Khi lá chắn này chưa đầy, 70-80% thặng dư nên được phân bổ vào các tài sản thanh khoản cao, an toàn như gửi tiết kiệm ngắn hạn.",
      "Trong giai đoạn xây lá chắn này, bạn hoàn toàn có thể tích lũy kinh nghiệm chiến trường bằng cách sử dụng các công cụ mô phỏng điểm ảo như JokingFinance. Trải nghiệm cảm giác thị trường lên xuống bằng điểm ảo giúp bạn làm quen với nhịp đập của bảng điện mà không phải đánh cược bằng tiền sinh hoạt.",
      "Khi quỹ dự phòng đã đầy, bạn mới nên bắt đầu giải ngân tiền thật vào cổ phiếu dài hạn với tỷ lệ 30-50% thặng dư mỗi tháng. Nguồn vốn này là nguồn vốn nhàn rỗi thực sự, cho phép bạn nắm giữ cổ phiếu qua các chu kỳ biến động lớn mà không bị áp lực buộc phải bán.",
    ],
  },
  {
    title: "Lãi suất thực là gì? Cách nhìn lợi nhuận sau lạm phát",
    slug: "lai-suat-thuc-la-gi",
    summary:
      "Lãi suất danh nghĩa cho biết tiền tăng bao nhiêu; lãi suất thực giúp ước tính sức mua tăng hay giảm sau khi tính đến lạm phát.",
    category: "Tài chính cá nhân",
    categorySlug: "tai-chinh-ca-nhan",
    tags: ["lãi suất thực", "lạm phát", "tiết kiệm"],
    author: "Nhóm JokingFinance",
    publishedAt: "2026-06-11",
    lastReviewedAt: "2026-06-11",
    difficulty: "beginner",
    readingTime: 6,
    relatedStocks: [],
    relatedMissionSlug: "review-danh-muc-sau-7-ngay",
    seoTitle: "Lãi suất thực là gì? Cách tính lợi nhuận sau lạm phát",
    seoDescription:
      "Hiểu lãi suất thực, công thức ước tính sau lạm phát và cách dùng khi so sánh tiết kiệm với các mục tiêu tài chính.",
    body: [
      "Lãi suất danh nghĩa là con số ngân hàng hoặc sản phẩm tài chính công bố. Lãi suất thực cố gắng trả lời một câu hỏi khác: sau khi giá cả tăng lên, sức mua của khoản tiền tăng được bao nhiêu.",
      "Cách ước tính nhanh là lấy lãi suất danh nghĩa trừ tỷ lệ lạm phát. Ví dụ, lãi suất 6% và lạm phát 4% cho lãi suất thực xấp xỉ 2%. Đây là phép tính gần đúng, phù hợp để hình dung chứ không thay thế tính toán chi tiết.",
      "Công thức chính xác hơn là lấy một cộng lãi suất danh nghĩa, chia cho một cộng tỷ lệ lạm phát, rồi trừ một. Khi các tỷ lệ không quá lớn, kết quả thường gần với phép trừ đơn giản.",
      "Lãi suất thực dương nghĩa là sức mua có khả năng tăng; lãi suất thực âm nghĩa là tiền vẫn tăng về số lượng nhưng có thể mua được ít hơn. Tuy vậy, lạm phát cá nhân của bạn có thể khác chỉ số chung vì mỗi gia đình có cơ cấu chi tiêu khác nhau.",
      "Khi so sánh các kỳ hạn tiết kiệm, đừng chỉ nhìn lãi suất. Hãy xem thuế nếu có, khả năng rút trước hạn, nhu cầu dùng tiền và mức lạm phát kỳ vọng. Một mức lãi cao hơn nhưng khóa tiền quá lâu có thể không phù hợp với mục tiêu.",
      "Lãi suất thực cũng không tự động cho biết nên mua cổ phiếu hay gửi tiết kiệm. Hai lựa chọn có mức biến động, thời gian và mục đích khác nhau. Hãy dùng nó như một dữ kiện trong kế hoạch, không phải tín hiệu mua bán.",
    ],
  },
  {
    title: "Lãi suất ngân hàng tháng 6/2026: đừng chỉ nhìn con số cao nhất",
    slug: "lai-suat-ngan-hang-thang-6-2026-dung-chi-nhin-con-so-cao-nhat",
    summary:
      "Bảng lãi suất đầu tháng 6/2026 cho thấy cùng là tiền gửi tiết kiệm nhưng mức lãi khác nhau rất lớn theo ngân hàng, kỳ hạn và hình thức gửi.",
    category: "Tài chính cá nhân",
    categorySlug: "tai-chinh-ca-nhan",
    tags: ["lãi suất ngân hàng", "tiết kiệm", "tài chính cá nhân"],
    author: "Nhóm JokingFinance",
    publishedAt: "2026-06-05",
    difficulty: "beginner",
    readingTime: 6,
    relatedStocks: ["VCB", "BID", "CTG", "ACB"],
    relatedMissionSlug: "ghi-3-rui-ro-truoc-khi-mua",
    seoTitle: "Lãi suất ngân hàng tháng 6/2026: cách đọc bảng lãi suất tiết kiệm",
    seoDescription:
      "Học cách đọc bảng lãi suất tiết kiệm ngân hàng tháng 6/2026 và tránh chạy theo con số cao nhất.",
    body: [
      "Đầu tháng 6/2026, các bảng tổng hợp lãi suất tiết kiệm cho thấy chênh lệch giữa các ngân hàng và các kỳ hạn vẫn rất rõ. Một số ngân hàng niêm yết mức cao hơn ở kỳ hạn dài, trong khi nhóm ngân hàng lớn có thể thấp hơn ở một số kỳ hạn ngắn.",
      "Người mới thường bị hút vào dòng chữ 'lãi suất cao nhất'. Nhưng con số cao nhất thường đi kèm điều kiện: kỳ hạn dài, số tiền gửi lớn, hình thức online, khách hàng ưu tiên hoặc sản phẩm riêng. Nếu không đọc điều kiện, bạn có thể đang so sánh hai thứ không giống nhau.",
      "Cách đọc an toàn hơn là chọn trước mục tiêu của mình: cần tiền trong 3 tháng, 6 tháng hay 12 tháng; có chấp nhận khóa tiền đến ngày đáo hạn không; và ngân hàng đó có phù hợp với mức độ an toàn, tiện lợi của bạn không.",
      "Bài học cho JokingFinance: lãi suất không chỉ là con số. Nó là cái giá của thời gian, tính thanh khoản và niềm tin vào nơi giữ tiền.",
    ],
  },
  {
    title: "LPBank và Sacombank giảm lãi suất: người gửi tiền nên hiểu điều gì?",
    slug: "lpbank-sacombank-giam-lai-suat-nguoi-gui-tien-nen-hieu-dieu-gi",
    summary:
      "Tin điều chỉnh lãi suất không chỉ nói về một ngân hàng. Nó giúp bạn hiểu vì sao lãi suất huy động thay đổi theo nhu cầu vốn và chiến lược từng nhà băng.",
    category: "Tài chính cá nhân",
    categorySlug: "tai-chinh-ca-nhan",
    tags: ["lãi suất huy động", "ngân hàng", "tiết kiệm"],
    author: "Nhóm JokingFinance",
    publishedAt: "2026-06-05",
    difficulty: "beginner",
    readingTime: 7,
    relatedStocks: ["LPB", "STB", "VCB"],
    relatedMissionSlug: "review-danh-muc-sau-7-ngay",
    seoTitle: "LPBank, Sacombank giảm lãi suất: bài học cho người gửi tiết kiệm",
    seoDescription:
      "Giải thích vì sao ngân hàng điều chỉnh lãi suất và người gửi tiền nên đọc tin lãi suất như thế nào.",
    body: [
      "Ngày 04/06/2026, tin thị trường ghi nhận LPBank điều chỉnh giảm một số kỳ hạn ngắn, trong khi Sacombank cũng giảm ở nhiều kỳ hạn và mức tiền gửi. Đây là ví dụ tốt để học cách đọc tin lãi suất.",
      "Khi một ngân hàng giảm lãi suất, điều đó không tự động có nghĩa là ngân hàng 'kém hấp dẫn' trong mọi trường hợp. Có thể ngân hàng đã đủ vốn ở một số kỳ hạn, muốn điều chỉnh cơ cấu tiền gửi, hoặc đơn giản là thay đổi chính sách huy động theo mặt bằng thị trường.",
      "Người gửi tiền nên tách ba câu hỏi: kỳ hạn nào bị điều chỉnh, mức giảm bao nhiêu điểm phần trăm, và mình có đang gửi đúng kỳ hạn đó không. Tin lãi suất chỉ có ý nghĩa khi gắn với kế hoạch tiền mặt của bạn.",
      "Nếu bạn cần dùng tiền trong ngắn hạn, lãi suất cao hơn một chút có thể không đáng để hy sinh khả năng rút tiền. Nếu bạn chắc chắn không dùng tiền trong 12-24 tháng, lúc đó mới nên so sánh kỳ hạn dài kỹ hơn.",
    ],
  },
  {
    title: "Lãi suất tiền gửi và cổ phiếu ngân hàng: liên quan với nhau ra sao?",
    slug: "lai-suat-tien-gui-va-co-phieu-ngan-hang-lien-quan-voi-nhau-ra-sao",
    summary:
      "Lãi suất huy động ảnh hưởng đến chi phí vốn của ngân hàng, nhưng không nên biến một tin lãi suất thành quyết định mua bán cổ phiếu ngay lập tức.",
    category: "Phân tích ngành",
    categorySlug: "phan-tich-nganh",
    tags: ["ngân hàng", "lãi suất", "cổ phiếu ngân hàng"],
    author: "Nhóm JokingFinance",
    publishedAt: "2026-06-05",
    difficulty: "intermediate",
    readingTime: 8,
    relatedStocks: ["VCB", "BID", "CTG", "ACB", "STB"],
    relatedMissionSlug: "so-sanh-tang-truong-phong-thu",
    seoTitle: "Lãi suất tiền gửi ảnh hưởng thế nào đến cổ phiếu ngân hàng?",
    seoDescription:
      "Bài học giải thích mối liên hệ giữa lãi suất huy động, chi phí vốn và cổ phiếu ngân hàng cho người mới.",
    body: [
      "Lãi suất tiền gửi là chi phí mà ngân hàng trả để huy động tiền từ người dân và doanh nghiệp. Khi lãi suất huy động tăng, chi phí vốn có thể tăng. Khi lãi suất huy động giảm, áp lực chi phí vốn có thể bớt lại, tùy từng ngân hàng.",
      "Nhưng lợi nhuận ngân hàng không chỉ phụ thuộc vào lãi suất đầu vào. Bạn còn cần xem tăng trưởng tín dụng, biên lãi ròng, chất lượng tài sản, nợ xấu, dự phòng và khả năng thu phí dịch vụ.",
      "Vì vậy, tin lãi suất là đầu mối để đặt câu hỏi, không phải nút mua bán. Nếu một ngân hàng giảm lãi suất huy động, hãy hỏi: ngân hàng đó có mất thị phần tiền gửi không, có cho vay được với biên lãi tốt không, và rủi ro nợ xấu đang ra sao.",
      "Trong phần mô phỏng, bạn có thể chọn 2-3 cổ phiếu ngân hàng, ghi lại giả thuyết về lãi suất và theo dõi trong nhật ký. Mục tiêu không phải đoán đúng ngày mai, mà là học cách nối tin vĩ mô với kết quả kinh doanh.",
    ],
  },
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
    seoTitle: "Cổ phiếu là gì? Bài học nhập môn cho người mới",
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
    seoTitle: "Tỷ số giá trên lợi nhuận là gì? Bài học định giá cho người mới",
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
    seoTitle: "Danh mục đầu tư là gì? Bài học phân bổ cho người mới",
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
  {
    title: "Khái niệm Định giá P/E và Biên an toàn",
    slug: "khi-niem-dinh-gia-pe-va-bien-an-toan",
    summary:
      "Tập trung vào định giá cơ bản giúp nhà đầu tư tránh bẫy tâm lý FOMO và chọn điểm mua có tỷ lệ rủi ro thấp.",
    category: "Định giá cơ bản",
    categorySlug: "dinh-gia-co-ban",
    tags: ["định giá", "P/E", "biên an toàn", "giá trị nội tại"],
    author: "Nhóm JokingFinance",
    publishedAt: "2026-07-03",
    difficulty: "intermediate",
    readingTime: 8,
    relatedStocks: ["FPT", "VNM", "MWG"],
    relatedMissionSlug: "so-sanh-3-co-phieu-cung-nganh-bang-pe",
    seoTitle: "Định giá P/E và Biên an toàn trong đầu tư giá trị",
    seoDescription:
      "Hiểu rõ khái niệm định giá P/E, phương pháp Benjamin Graham, chiết khấu dòng tiền DCF và cách áp dụng Biên an toàn để bảo vệ vốn.",
    body: [
      "Đầu tư giá trị không có nghĩa là mua cổ phiếu giá rẻ nhất về mặt số tuyệt đối, mà là mua doanh nghiệp với mức giá thấp hơn đáng kể so với giá trị thực tế của nó. Phần chênh lệch đó được gọi là Biên an toàn (Margin of Safety).",
      "Có nhiều phương pháp ước lượng giá trị nội tại của một cổ phiếu ảo hay thật. Phương pháp P/E mục tiêu nhân EPS dự phóng là cách tiếp cận phổ biến nhất vì tính trực quan. Bên cạnh đó, công thức của Benjamin Graham (với EPS và tốc độ tăng trưởng dự kiến g) mang lại góc nhìn bảo thủ hơn, nhấn mạnh việc không trả giá quá cao cho sự tăng trưởng.",
      "Với các doanh nghiệp có dòng tiền ổn định và dễ dự báo, mô hình Chiết khấu dòng tiền (Discounted Cash Flow - DCF) là chuẩn mực vàng. DCF giả định giá trị của doanh nghiệp hôm nay bằng tổng toàn bộ dòng tiền tự do doanh nghiệp tạo ra trong tương lai, được chiết khấu về hiện tại theo một tỷ suất sinh lời kỳ vọng.",
      "Tuy nhiên, mọi công thức định giá đều dựa trên giả định về tương lai - thứ không ai biết trước một cách chắc chắn. Nếu bạn dự báo doanh nghiệp tăng trưởng 20% mỗi năm nhưng thực tế chỉ đạt 10%, định giá của bạn sẽ bị sai lệch lớn. Đó là lý do bạn cần Biên an toàn.",
      "Biên an toàn (thường từ 20% đến 30%) hoạt động như một bộ đệm giảm chấn. Nếu giá trị nội tại ước tính của FPT là 130.000 đồng/cổ phiếu, một biên an toàn 20% có nghĩa là bạn chỉ sẵn sàng mua nếu giá thị trường dưới 104.000 đồng. Biên an toàn bảo vệ bạn khỏi các sai số dự báo và các biến động bất ngờ của thị trường vĩ mô.",
      "Trước khi đặt lệnh mua ảo hay thật, hãy tập sử dụng JokingFinance Valuation Tool để tính toán cả 3 kịch bản. Nếu giá thị trường hiện tại đang cao hơn nhiều so với giá trị nội tại hợp lý của cả kịch bản cơ sở, hãy kiên nhẫn đứng ngoài và chế ngự lòng tham của mình."
    ]
  },
  {
    title: "Lãi kép, kỷ luật & Tầm nhìn dài hạn",
    slug: "lai-kep-va-chi-phi-co-hoi",
    summary:
      "Hiểu rõ sức mạnh của thời gian kết hợp với việc kiểm soát lạm phát lối sống và chi phí cơ hội.",
    category: "Tài chính cá nhân",
    categorySlug: "tai-chinh-ca-nhan",
    tags: ["lãi kép", "chi phí cơ hội", "kỷ luật", "tài chính cá nhân"],
    author: "Nhóm JokingFinance",
    publishedAt: "2026-07-03",
    difficulty: "beginner",
    readingTime: 6,
    relatedStocks: [],
    relatedMissionSlug: "review-danh-muc-sau-7-ngay",
    seoTitle: "Lãi kép, kỷ luật & Tầm nhìn dài hạn trong đầu tư",
    seoDescription:
      "Tối ưu hóa lãi kép bằng cách duy trì kỷ luật tích lũy, quản trị chi phí cơ hội và bảo vệ danh mục đầu tư dài hạn.",
    body: [
      "Kỳ quan thứ tám của thế giới - Lãi kép - không hoạt động dựa trên những cú thắng đột biến hay lợi nhuận khổng lồ chỉ trong một đêm. Lãi kép đòi hỏi hai yếu tố cốt lõi: Tỷ suất sinh lời ổn định và Thời gian đủ dài.",
      "Nhiều người mới tham gia thị trường với kỳ vọng nhân đôi tài khoản nhanh chóng, dẫn đến việc chấp nhận rủi ro quá lớn (như dùng margin tối đa hoặc đuổi theo các cổ phiếu đầu cơ nóng). Khi thị trường đảo chiều, họ thua lỗ lớn, cắt lỗ muộn, và làm gián đoạn hoàn toàn chu kỳ tích lũy lãi kép.",
      "Một khía cạnh thường bị bỏ qua của lãi kép là chi phí cơ hội của việc tiêu dùng bốc đồng. Khi bạn chi tiêu 10 triệu đồng cho một món đồ không thiết yếu, chi phí thực tế không chỉ là 10 triệu đồng hôm nay, mà là giá trị tương lai của 10 triệu đồng đó nếu được đầu tư với lãi suất 8% hoặc 10% mỗi năm trong 15 năm tiếp theo.",
      "Để lãi kép hoạt động hiệu quả, bạn cần duy trì kỷ luật tích lũy định kỳ và kiên quyết bảo vệ nguồn vốn của mình. Sử dụng JokingFinance Simulator giúp bạn làm quen với tư duy dài hạn, thử nghiệm các mô hình phân bổ tài sản khác nhau và quan sát kết quả tích lũy mà không chịu áp lực cảm xúc của tiền thật.",
      "Hãy nhớ rằng: bảo vệ vốn quan trọng hơn kiếm lợi nhuận. Chỉ khi bạn giữ được kỷ luật cắt lỗ sớm và tránh được các cú sập sâu, sức mạnh của lãi kép mới có thể phát huy tối đa tác dụng qua nhiều năm."
    ]
  }
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
  {
    title: "Bình thường hóa lợi nhuận trước khi dùng P/E",
    slug: "binh-thuong-hoa-loi-nhuan-truoc-khi-dung-pe",
    description:
      "Viết ba kịch bản EPS để kiểm tra một cổ phiếu P/E thấp có thực sự rẻ hay chỉ đang ở đỉnh lợi nhuận.",
    difficulty: "advanced",
    category: "Định giá và chu kỳ",
    estimatedMinutes: 25,
    objective:
      "Không dùng P/E trailing máy móc khi lợi nhuận doanh nghiệp biến động theo chu kỳ.",
    instructions: [
      "Chọn một doanh nghiệp có lợi nhuận hoặc biên lợi nhuận biến động mạnh qua các năm.",
      "Viết ba kịch bản EPS: xấu, cơ sở và tốt; ghi rõ giả định chính của từng kịch bản.",
      "Tính lại P/E hiện tại trên từng mức EPS thay vì chỉ dùng lợi nhuận 12 tháng gần nhất.",
      "Viết mức giá hoặc dữ kiện mới khiến bạn sẵn sàng xem xét lại quyết định.",
    ],
    successCriteria: [
      "Có đủ ba kịch bản EPS và giả định đi kèm.",
      "Có P/E tính lại cho ít nhất kịch bản cơ sở và xấu.",
      "Kết luận có nhắc tới chu kỳ, biên an toàn và điều kiện kiểm chứng.",
    ],
    relatedArticleSlug: "pe-la-gi",
    relatedCaseSlug: "pe-thap-o-dinh-chu-ky",
    isActive: true,
  },
];

export function findArticle(slug: string) {
  return sampleArticles.find((article) => article.slug === slug) ?? null;
}

export function findLearningTrack(slug: string) {
  return learningTracks.find((track) => track.slug === slug) ?? null;
}

export function findMission(slug: string) {
  return sampleMissions.find((mission) => mission.slug === slug) ?? null;
}
