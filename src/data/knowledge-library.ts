export type KnowledgeLevel = "foundation" | "practice" | "analysis" | "advanced";

export type KnowledgeModule = {
  title: string;
  goal: string;
  topics: string[];
  practice: string;
  relatedArticleSlugs?: string[];
  relatedMissionSlugs?: string[];
};

export type KnowledgePillar = {
  title: string;
  slug: string;
  summary: string;
  level: KnowledgeLevel;
  estimatedHours: number;
  learnerOutcome: string;
  modules: KnowledgeModule[];
};

export type KnowledgeRoadmapStep = {
  title: string;
  description: string;
  pillarSlugs: string[];
};

export type GlossaryTerm = {
  term: string;
  meaning: string;
  group: string;
};

export function createKnowledgeSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getKnowledgeModuleUrl(pillar: KnowledgePillar, knowledgeModule: KnowledgeModule) {
  return `/knowledge/${pillar.slug}/${createKnowledgeSlug(knowledgeModule.title)}`;
}

export function getKnowledgeModule(pillarSlug: string, moduleSlug: string) {
  const pillar = knowledgePillars.find((item) => item.slug === pillarSlug);
  const knowledgeModule = pillar?.modules.find((item) => createKnowledgeSlug(item.title) === moduleSlug);

  return pillar && knowledgeModule ? { pillar, knowledgeModule } : null;
}

export function getKnowledgeModuleParams() {
  return knowledgePillars.flatMap((pillar) =>
    pillar.modules.map((knowledgeModule) => ({
      pillarSlug: pillar.slug,
      moduleSlug: createKnowledgeSlug(knowledgeModule.title),
    })),
  );
}

export const knowledgeLevelLabels: Record<KnowledgeLevel, string> = {
  foundation: "Nền tảng",
  practice: "Thực hành",
  analysis: "Phân tích",
  advanced: "Nâng cao",
};

export const knowledgeRoadmap: KnowledgeRoadmapStep[] = [
  {
    title: "Giai đoạn 1: hiểu tiền trước khi hiểu cổ phiếu",
    description:
      "Người mới cần biết dòng tiền cá nhân, quỹ dự phòng, lãi suất và rủi ro trước khi nhìn bảng giá.",
    pillarSlugs: ["tai-chinh-ca-nhan", "lai-suat-va-ngan-hang"],
  },
  {
    title: "Giai đoạn 2: hiểu thị trường và công cụ",
    description:
      "Nắm cổ phiếu, trái phiếu, quỹ, chỉ số, lệnh giao dịch, thanh khoản và các quy tắc vận hành cơ bản.",
    pillarSlugs: ["chung-khoan-nhap-mon", "du-lieu-thi-truong"],
  },
  {
    title: "Giai đoạn 3: đọc doanh nghiệp",
    description:
      "Đi từ báo cáo tài chính, mô hình kinh doanh, ngành, lợi thế cạnh tranh tới câu hỏi doanh nghiệp có kiếm tiền bền không.",
    pillarSlugs: ["bao-cao-tai-chinh", "phan-tich-nganh", "dinh-gia-co-ban"],
  },
  {
    title: "Giai đoạn 4: xây danh mục và kỷ luật",
    description:
      "Biến kiến thức thành quy trình: phân bổ vốn, kiểm soát rủi ro, ghi nhật ký, xem lại quyết định.",
    pillarSlugs: ["xay-dung-danh-muc", "quan-tri-rui-ro", "tam-ly-dau-tu"],
  },
  {
    title: "Giai đoạn 5: nối vĩ mô với chiến lược",
    description:
      "Hiểu chu kỳ kinh tế, chính sách tiền tệ, lạm phát, tỷ giá và cách chúng ảnh hưởng tới ngành và danh mục.",
    pillarSlugs: ["vi-mo-va-chu-ky", "chien-luoc-va-nhat-ky"],
  },
];

export const knowledgePillars: KnowledgePillar[] = [
  {
    title: "Tài chính cá nhân",
    slug: "tai-chinh-ca-nhan",
    summary:
      "Nền móng để không đưa tiền nhàn rỗi, tiền khẩn cấp và tiền đầu tư vào cùng một rổ.",
    level: "foundation",
    estimatedHours: 8,
    learnerOutcome:
      "Biết lập quỹ dự phòng, chia mục tiêu tiền, đọc lãi kép và tránh vay tiêu dùng sai cách.",
    modules: [
      {
        title: "Bức tranh dòng tiền cá nhân",
        goal: "Biết tiền đến từ đâu, đi về đâu và phần nào thật sự có thể đầu tư.",
        topics: ["Thu nhập chủ động và thụ động", "Chi phí cố định", "Chi phí biến đổi", "Tỷ lệ tiết kiệm", "Dòng tiền ròng"],
        practice: "Ghi 30 ngày chi tiêu và chia thành nhu cầu, mong muốn, đầu tư.",
      },
      {
        title: "Quỹ dự phòng và mục tiêu tiền",
        goal: "Không dùng tiền cần trong ngắn hạn để chịu rủi ro dài hạn.",
        topics: ["Quỹ dự phòng 3-6 tháng", "Mục tiêu ngắn hạn", "Mục tiêu dài hạn", "Tính thanh khoản", "Khẩu vị rủi ro cá nhân"],
        practice: "Tách 3 khoản: tiền sống, tiền dự phòng, tiền học đầu tư.",
      },
      {
        title: "Lãi kép và chi phí cơ hội",
        goal: "Hiểu vì sao thời gian, tỷ suất và kỷ luật quan trọng hơn một lần thắng lớn.",
        topics: ["Lãi kép", "Lạm phát", "Chi phí cơ hội", "Tỷ suất thực", "Tái đầu tư"],
        practice: "So sánh 3 kịch bản tiết kiệm đều đặn trong 5 năm.",
        relatedArticleSlugs: ["lai-kep-va-chi-phi-co-hoi"],
        relatedMissionSlugs: ["review-danh-muc-sau-7-ngay"],
      },
      {
        title: "Nợ cá nhân và đòn bẩy",
        goal: "Phân biệt nợ phục vụ tài sản với nợ làm yếu dòng tiền.",
        topics: ["Nợ tốt và nợ xấu", "Lãi suất vay", "Tỷ lệ trả nợ", "Thẻ tín dụng", "Rủi ro đòn bẩy"],
        practice: "Tính tỷ lệ trả nợ hàng tháng và viết ngưỡng cảnh báo cá nhân.",
      },
      {
        title: "Hoạch định tự do tài chính (FIRE)",
        goal: "Xác định con số độc lập tài chính dài hạn dựa trên thực tế lạm phát và lãi suất Việt Nam.",
        topics: ["Tự do tài chính", "Quy tắc 33.3", "Tỷ lệ rút an toàn (SWR)", "Điều chỉnh lạm phát", "Kỷ luật tích lũy"],
        practice: "Sử dụng FIRE Tool để tính toán lộ trình cá nhân hóa và viết bài đánh giá khả thi.",
        relatedArticleSlugs: ["tu-do-tai-chinh-fire-tai-viet-nam-lo-trinh-thuc-te", "lai-kep-va-chi-phi-co-hoi"],
        relatedMissionSlugs: ["xac-dinh-con-so-tu-do-tai-chinh"],
      },
    ],
  },
  {
    title: "Lãi suất và ngân hàng",
    slug: "lai-suat-va-ngan-hang",
    summary:
      "Cách đọc lãi suất gửi tiết kiệm, hiểu chi phí vốn ngân hàng và liên hệ với cổ phiếu ngân hàng.",
    level: "foundation",
    estimatedHours: 10,
    learnerOutcome:
      "Biết so sánh lãi suất theo kỳ hạn, điều kiện gửi và hiểu vì sao lãi suất ảnh hưởng tới ngành ngân hàng.",
    modules: [
      {
        title: "Đọc bảng lãi suất tiết kiệm",
        goal: "Không chạy theo con số cao nhất nếu chưa đọc điều kiện.",
        topics: ["Kỳ hạn", "Lãi suất online", "Lãi suất tại quầy", "Rút trước hạn", "Số tiền gửi tối thiểu"],
        practice: "So sánh 3 ngân hàng theo kỳ hạn 3, 6, 12 tháng.",
        relatedArticleSlugs: ["lai-suat-ngan-hang-thang-6-2026-dung-chi-nhin-con-so-cao-nhat"],
      },
      {
        title: "Vì sao ngân hàng tăng hoặc giảm lãi suất",
        goal: "Đọc tin điều chỉnh lãi suất như tín hiệu về vốn, thanh khoản và cạnh tranh.",
        topics: ["Huy động vốn", "Nhu cầu tín dụng", "Thanh khoản hệ thống", "Chính sách tiền tệ", "Cạnh tranh tiền gửi"],
        practice: "Ghi 3 giả thuyết khi một ngân hàng giảm lãi suất.",
        relatedArticleSlugs: ["lpbank-sacombank-giam-lai-suat-nguoi-gui-tien-nen-hieu-dieu-gi"],
      },
      {
        title: "Lãi suất và cổ phiếu ngân hàng",
        goal: "Nối lãi suất huy động với chi phí vốn và lợi nhuận ngân hàng.",
        topics: ["Chi phí vốn", "Biên lãi ròng", "Tăng trưởng tín dụng", "Nợ xấu", "Dự phòng"],
        practice: "Chọn 3 mã ngân hàng và viết giả thuyết tác động của lãi suất.",
        relatedArticleSlugs: ["lai-suat-tien-gui-va-co-phieu-ngan-hang-lien-quan-voi-nhau-ra-sao"],
        relatedMissionSlugs: ["ghi-3-rui-ro-truoc-khi-mua"],
      },
      {
        title: "Sản phẩm ngân hàng cá nhân",
        goal: "Hiểu tiền gửi, thẻ, khoản vay, bảo hiểm liên kết và phí dịch vụ.",
        topics: ["Tiền gửi có kỳ hạn", "Tiền gửi không kỳ hạn", "Thẻ tín dụng", "Vay tiêu dùng", "Bảo hiểm liên kết đầu tư"],
        practice: "Liệt kê sản phẩm ngân hàng mình đang dùng và chi phí ẩn có thể có.",
      },
    ],
  },
  {
    title: "Chứng khoán nhập môn",
    slug: "chung-khoan-nhap-mon",
    summary:
      "Các khái niệm phải hiểu trước khi mua bán: cổ phiếu, trái phiếu, quỹ, chỉ số, thanh khoản và lệnh.",
    level: "foundation",
    estimatedHours: 12,
    learnerOutcome:
      "Biết thị trường vận hành ra sao và có thể tạo danh mục ảo đầu tiên mà không mua ngẫu hứng.",
    modules: [
      {
        title: "Cổ phiếu là gì",
        goal: "Hiểu cổ phiếu là quyền sở hữu một phần doanh nghiệp, không chỉ là mã nhảy giá.",
        topics: ["Cổ phần", "Cổ đông", "Giá thị trường", "Vốn hóa", "Cổ tức"],
        practice: "Chọn một công ty quen thuộc và mô tả cách công ty kiếm tiền.",
        relatedArticleSlugs: ["co-phieu-la-gi"],
        relatedMissionSlugs: ["tao-danh-muc-ao-dau-tien"],
      },
      {
        title: "Trái phiếu, quỹ và chỉ số",
        goal: "Phân biệt công cụ sở hữu, công cụ nợ và sản phẩm đầu tư tập hợp.",
        topics: ["Trái phiếu", "Quỹ mở", "ETF", "Chỉ số VN-Index", "Rủi ro tổ chức phát hành"],
        practice: "Viết sự khác nhau giữa mua một cổ phiếu và mua một ETF.",
      },
      {
        title: "Cách đặt lệnh và thanh khoản",
        goal: "Biết vì sao giá khớp không phải lúc nào cũng như mình mong muốn.",
        topics: ["Lệnh mua", "Lệnh bán", "Giá trần", "Giá sàn", "Thanh khoản", "Chênh lệch mua bán"],
        practice: "Quan sát một mã thanh khoản cao và một mã thanh khoản thấp trong mô phỏng.",
      },
      {
        title: "Tin tức và nhiễu thị trường",
        goal: "Biết tin nóng không đồng nghĩa với luận điểm đầu tư.",
        topics: ["Tin doanh nghiệp", "Tin ngành", "Tin vĩ mô", "Tin đồn", "Phản ứng quá mức"],
        practice: "Chọn một tin nóng và viết điều cần kiểm chứng trước khi hành động.",
      },
    ],
  },
  {
    title: "Đọc báo cáo tài chính",
    slug: "bao-cao-tai-chinh",
    summary:
      "Từ doanh thu, lợi nhuận, tài sản, nợ vay tới dòng tiền, giúp người học đọc doanh nghiệp bằng số liệu.",
    level: "analysis",
    estimatedHours: 18,
    learnerOutcome:
      "Biết đọc ba báo cáo chính và đặt câu hỏi đúng về chất lượng lợi nhuận, nợ và dòng tiền.",
    modules: [
      {
        title: "Báo cáo kết quả kinh doanh",
        goal: "Biết doanh nghiệp bán được gì, lời bao nhiêu và biên lợi nhuận thay đổi ra sao.",
        topics: ["Doanh thu", "Giá vốn", "Lợi nhuận gộp", "Chi phí bán hàng", "Lợi nhuận sau thuế"],
        practice: "Tính biên lợi nhuận gộp của 2 doanh nghiệp cùng ngành.",
      },
      {
        title: "Bảng cân đối kế toán",
        goal: "Hiểu tài sản, nợ phải trả và vốn chủ sở hữu đang nói gì về sức khỏe doanh nghiệp.",
        topics: ["Tài sản ngắn hạn", "Hàng tồn kho", "Nợ vay", "Vốn chủ sở hữu", "Đòn bẩy tài chính"],
        practice: "Tìm khoản mục tăng nhanh nhất và viết câu hỏi vì sao.",
      },
      {
        title: "Báo cáo lưu chuyển tiền tệ",
        goal: "Phân biệt lợi nhuận kế toán và tiền thật đi vào doanh nghiệp.",
        topics: ["Dòng tiền kinh doanh", "Dòng tiền đầu tư", "Dòng tiền tài chính", "Capex", "Dòng tiền tự do"],
        practice: "So sánh lợi nhuận sau thuế với dòng tiền kinh doanh.",
      },
      {
        title: "Chất lượng lợi nhuận",
        goal: "Nhận diện lợi nhuận có thể không bền hoặc đến từ yếu tố một lần.",
        topics: ["Lợi nhuận bất thường", "Phải thu tăng nhanh", "Tồn kho tăng nhanh", "Chi phí vốn hóa", "Dự phòng"],
        practice: "Viết 3 dấu hiệu cần kiểm tra trước khi tin vào lợi nhuận tăng.",
      },
    ],
  },
  {
    title: "Định giá cơ bản",
    slug: "dinh-gia-co-ban",
    summary:
      "Giúp người học hiểu giá không chỉ cao hay thấp, mà phải so với lợi nhuận, tài sản, tăng trưởng và rủi ro.",
    level: "analysis",
    estimatedHours: 16,
    learnerOutcome:
      "Biết dùng P/E, P/B, EV/EBITDA và biên an toàn ở mức nhập môn mà không máy móc.",
    modules: [
      {
        title: "P/E và kỳ vọng lợi nhuận",
        goal: "Hiểu một cổ phiếu rẻ hay đắt phải nhìn cùng chất lượng và tăng trưởng.",
        topics: ["EPS", "P/E trailing", "P/E forward", "Tăng trưởng lợi nhuận", "Rủi ro suy giảm"],
        practice: "So sánh 3 cổ phiếu cùng ngành bằng P/E.",
        relatedArticleSlugs: ["pe-la-gi"],
        relatedMissionSlugs: ["so-sanh-3-co-phieu-cung-nganh-bang-pe"],
      },
      {
        title: "P/B và doanh nghiệp tài chính",
        goal: "Biết vì sao ngân hàng, bảo hiểm, chứng khoán thường được nhìn qua vốn chủ sở hữu.",
        topics: ["Giá trị sổ sách", "ROE", "P/B", "Tài sản sinh lời", "Chất lượng tài sản"],
        practice: "So sánh P/B và ROE của 2 ngân hàng.",
      },
      {
        title: "EV/EBITDA và cấu trúc vốn",
        goal: "Nhìn doanh nghiệp ở góc độ giá trị toàn bộ, không chỉ vốn hóa cổ phiếu.",
        topics: ["Enterprise value", "EBITDA", "Nợ ròng", "Capex", "Khấu hao"],
        practice: "Viết khi nào EV/EBITDA hữu ích hơn P/E.",
      },
      {
        title: "Biên an toàn",
        goal: "Chấp nhận mình có thể sai và không trả giá quá lạc quan.",
        topics: ["Sai số ước tính", "Kịch bản tốt", "Kịch bản xấu", "Giá mua hợp lý", "Tỷ lệ kỳ vọng/rủi ro"],
        practice: "Viết 3 kịch bản cho một cổ phiếu: xấu, cơ sở, tốt.",
        relatedArticleSlugs: ["khi-niem-dinh-gia-pe-va-bien-an-toan"],
        relatedMissionSlugs: ["so-sanh-3-co-phieu-cung-nganh-bang-pe"],
      },
    ],
  },
  {
    title: "Phân tích ngành và lợi thế cạnh tranh",
    slug: "phan-tich-nganh",
    summary:
      "Đặt doanh nghiệp vào bối cảnh ngành để hiểu ai có quyền lực giá, ai chịu chu kỳ và ai có lợi thế dài hạn.",
    level: "analysis",
    estimatedHours: 18,
    learnerOutcome:
      "Biết phân tích chuỗi giá trị, cạnh tranh, chu kỳ ngành và lợi thế cạnh tranh của doanh nghiệp.",
    modules: [
      {
        title: "Chuỗi giá trị ngành",
        goal: "Biết doanh nghiệp nằm ở đâu trong chuỗi và phần lợi nhuận về tay ai.",
        topics: ["Nhà cung cấp", "Nhà sản xuất", "Kênh phân phối", "Khách hàng cuối", "Biên lợi nhuận theo mắt xích"],
        practice: "Vẽ chuỗi giá trị của ngành bán lẻ hoặc thép.",
      },
      {
        title: "Năm lực cạnh tranh",
        goal: "Đánh giá áp lực cạnh tranh từ đối thủ, khách hàng, nhà cung cấp và sản phẩm thay thế.",
        topics: ["Đối thủ hiện hữu", "Đối thủ mới", "Nhà cung cấp", "Khách hàng", "Sản phẩm thay thế"],
        practice: "Chấm điểm cạnh tranh của một ngành theo thang 1-5.",
      },
      {
        title: "Chu kỳ ngành",
        goal: "Không nhầm tăng trưởng ngắn hạn do chu kỳ với lợi thế bền vững.",
        topics: ["Chu kỳ hàng hóa", "Chu kỳ bất động sản", "Chu kỳ tín dụng", "Công suất ngành", "Hàng tồn kho ngành"],
        practice: "Viết ngành nào nhạy với lãi suất và vì sao.",
      },
      {
        title: "Lợi thế cạnh tranh",
        goal: "Nhận diện doanh nghiệp có khả năng giữ lợi nhuận tốt hơn đối thủ.",
        topics: ["Thương hiệu", "Quy mô", "Chi phí thấp", "Mạng lưới", "Chi phí chuyển đổi"],
        practice: "Tìm một lợi thế và một điểm yếu của doanh nghiệp bạn theo dõi.",
      },
    ],
  },
  {
    title: "Xây dựng danh mục",
    slug: "xay-dung-danh-muc",
    summary:
      "Biến các ý tưởng riêng lẻ thành một danh mục có mục tiêu, tỷ trọng, giới hạn rủi ro và cách xem lại.",
    level: "practice",
    estimatedHours: 14,
    learnerOutcome:
      "Biết phân bổ vốn, giới hạn tỷ trọng, đa dạng hóa hợp lý và theo dõi danh mục ảo.",
    modules: [
      {
        title: "Mục tiêu danh mục",
        goal: "Danh mục phục vụ mục tiêu nào thì cách phân bổ phải theo mục tiêu đó.",
        topics: ["Tăng trưởng vốn", "Bảo toàn vốn", "Dòng tiền", "Thời gian nắm giữ", "Mức chịu lỗ"],
        practice: "Viết mục tiêu danh mục ảo trong một câu.",
        relatedArticleSlugs: ["danh-muc-dau-tu-la-gi"],
      },
      {
        title: "Phân bổ tỷ trọng",
        goal: "Không để một quyết định sai phá hỏng toàn bộ quá trình học.",
        topics: ["Tỷ trọng mỗi mã", "Tỷ trọng ngành", "Tiền mặt", "Tái cân bằng", "Tập trung có kiểm soát"],
        practice: "Không phân bổ quá 20% vào một mã trong danh mục ảo.",
        relatedMissionSlugs: ["khong-phan-bo-qua-20-phan-tram-vao-mot-ma"],
      },
      {
        title: "Đa dạng hóa",
        goal: "Hiểu đa dạng hóa là giảm rủi ro phụ thuộc, không phải mua thật nhiều mã.",
        topics: ["Tương quan", "Đa dạng hóa ngành", "Đa dạng hóa phong cách", "Rủi ro hệ thống", "Rủi ro riêng lẻ"],
        practice: "Xây danh mục 5 ngành và ghi ngành mình hiểu ít nhất.",
        relatedMissionSlugs: ["xay-danh-muc-5-nganh"],
      },
      {
        title: "Theo dõi và tái cân bằng",
        goal: "Biết khi nào cần xem lại giả thuyết thay vì chỉ nhìn lãi lỗ.",
        topics: ["Tái cân bằng định kỳ", "Thay đổi luận điểm", "Tỷ trọng vượt ngưỡng", "Cắt giảm rủi ro", "Tăng tỷ trọng có điều kiện"],
        practice: "Xem lại danh mục sau 7 ngày và ghi một điều học được.",
        relatedMissionSlugs: ["review-danh-muc-sau-7-ngay"],
      },
    ],
  },
  {
    title: "Quản trị rủi ro",
    slug: "quan-tri-rui-ro",
    summary:
      "Học cách sống sót trước khi nghĩ tới tối đa hóa lợi nhuận: giới hạn lỗ, kiểm soát vị thế và chuẩn bị kịch bản xấu.",
    level: "practice",
    estimatedHours: 12,
    learnerOutcome:
      "Biết viết rủi ro trước khi mua, đặt ngưỡng cảnh báo và tránh tập trung quá mức.",
    modules: [
      {
        title: "Các loại rủi ro",
        goal: "Gọi đúng tên rủi ro để không xử lý nhầm.",
        topics: ["Rủi ro thị trường", "Rủi ro doanh nghiệp", "Rủi ro thanh khoản", "Rủi ro định giá", "Rủi ro hành vi"],
        practice: "Ghi 3 rủi ro trước khi mua một mã.",
        relatedMissionSlugs: ["ghi-3-rui-ro-truoc-khi-mua"],
      },
      {
        title: "Kịch bản xấu",
        goal: "Chuẩn bị câu trả lời trước khi thị trường ép mình trả lời trong hoảng loạn.",
        topics: ["Giá giảm 10%", "Tin xấu bất ngờ", "Lợi nhuận hụt kỳ vọng", "Thanh khoản giảm", "Sai luận điểm"],
        practice: "Viết nếu giá giảm 15% thì mình kiểm tra điều gì trước.",
      },
      {
        title: "Rủi ro tập trung",
        goal: "Không để một mã, một ngành hoặc một câu chuyện chi phối toàn bộ danh mục.",
        topics: ["Tập trung theo mã", "Tập trung theo ngành", "Tập trung theo phong cách", "Tập trung theo tin tức", "Tập trung theo cảm xúc"],
        practice: "Kiểm tra mã có tỷ trọng lớn nhất trong danh mục.",
        relatedMissionSlugs: ["kiem-tra-tap-trung-danh-muc"],
      },
      {
        title: "Ngưỡng dừng và quy tắc cá nhân",
        goal: "Tạo quy tắc trước khi cảm xúc lên tiếng.",
        topics: ["Ngưỡng cắt lỗ", "Ngưỡng giảm tỷ trọng", "Điều kiện mua thêm", "Điều kiện bán", "Quy tắc nghỉ giao dịch"],
        practice: "Viết 5 quy tắc cá nhân cho danh mục ảo.",
      },
    ],
  },
  {
    title: "Tâm lý đầu tư",
    slug: "tam-ly-dau-tu",
    summary:
      "Nhận diện FOMO, quá tự tin, sợ lỗ, neo giá và các thiên kiến khiến người mới ra quyết định kém.",
    level: "practice",
    estimatedHours: 12,
    learnerOutcome:
      "Biết gọi tên cảm xúc trước khi giao dịch và dùng nhật ký để giảm quyết định bốc đồng.",
    modules: [
      {
        title: "FOMO và tin nóng",
        goal: "Không biến cảm giác sợ bỏ lỡ thành lý do mua.",
        topics: ["FOMO", "Tin nóng", "Đám đông", "Giá tăng nhanh", "Mua không luận điểm"],
        practice: "Đánh dấu một giao dịch mô phỏng là FOMO nếu có.",
        relatedArticleSlugs: ["vi-sao-nguoi-moi-de-fomo"],
        relatedMissionSlugs: ["nhan-dien-giao-dich-fomo"],
      },
      {
        title: "Neo giá và sợ lỗ",
        goal: "Không giữ một quyết định sai chỉ vì giá vốn của mình.",
        topics: ["Neo giá mua", "Lỗ chưa thực hiện", "Gồng lỗ", "Hy vọng", "Luận điểm thay đổi"],
        practice: "Viết lại luận điểm hiện tại mà không nhìn giá vốn.",
      },
      {
        title: "Quá tự tin sau khi thắng",
        goal: "Nhận diện khi một lần đúng khiến mình nâng rủi ro quá nhanh.",
        topics: ["Ảo tưởng kiểm soát", "May mắn", "Tăng vị thế quá nhanh", "Bỏ qua rủi ro", "Kỷ luật sau chuỗi thắng"],
        practice: "Sau một giao dịch lời, ghi điều nào là kỹ năng và điều nào có thể là may mắn.",
      },
      {
        title: "Nhật ký cảm xúc",
        goal: "Biến cảm xúc thành dữ liệu để học, không phủ nhận nó.",
        topics: ["Cảm xúc trước khi mua", "Cảm xúc sau khi lỗ", "Tự tin quá mức", "Lo âu", "Phản tư"],
        practice: "Ghi cảm xúc cho 5 giao dịch mô phỏng liên tiếp.",
      },
    ],
  },
  {
    title: "Dữ liệu thị trường",
    slug: "du-lieu-thi-truong",
    summary:
      "Học cách đọc bảng giá, chỉ số, thanh khoản, biến động và dữ liệu Vnstock ở mức phù hợp cho người học.",
    level: "practice",
    estimatedHours: 10,
    learnerOutcome:
      "Biết dùng dữ liệu thị trường để đặt câu hỏi, không dùng dữ liệu như mệnh lệnh mua bán.",
    modules: [
      {
        title: "Bảng giá và biến động",
        goal: "Hiểu giá, phần trăm thay đổi và khối lượng giao dịch đang nói gì.",
        topics: ["Giá tham chiếu", "Giá trần", "Giá sàn", "Khối lượng", "Biến động ngày"],
        practice: "Chọn 5 mã tăng/giảm mạnh và tìm điểm chung.",
      },
      {
        title: "Chỉ số thị trường",
        goal: "Đọc VN-Index, VN30, HNX, UPCOM như bức tranh chung, không như kết luận riêng.",
        topics: ["VN-Index", "VN30", "Độ rộng thị trường", "Nhóm dẫn dắt", "Tác động vốn hóa lớn"],
        practice: "So sánh chỉ số tăng nhưng danh mục mình giảm và viết lý do có thể.",
      },
      {
        title: "Thanh khoản và dòng tiền",
        goal: "Biết khi nào biến động giá có dòng tiền xác nhận và khi nào chỉ là nhiễu.",
        topics: ["Giá trị giao dịch", "Khối lượng đột biến", "Dòng tiền ngành", "Thanh khoản thấp", "Khớp lệnh"],
        practice: "Ghi lại một mã tăng giá nhưng thanh khoản thấp.",
      },
      {
        title: "Dữ liệu thật và giới hạn dữ liệu",
        goal: "Hiểu dữ liệu có độ trễ, sai số, điều khoản sử dụng và không thay thế phân tích.",
        topics: ["Nguồn dữ liệu", "Độ trễ", "Điều khoản sử dụng", "Dữ liệu thiếu", "Kiểm chứng chéo"],
        practice: "Viết quy tắc khi nào cần kiểm tra lại dữ liệu ở nguồn khác.",
      },
    ],
  },
  {
    title: "Vĩ mô và chu kỳ",
    slug: "vi-mo-va-chu-ky",
    summary:
      "Nối lạm phát, lãi suất, tỷ giá, tín dụng, chính sách và chu kỳ kinh tế với ngành và danh mục.",
    level: "advanced",
    estimatedHours: 20,
    learnerOutcome:
      "Biết đọc tín hiệu vĩ mô ở mức thực dụng và tránh suy diễn một biến số thành mọi quyết định.",
    modules: [
      {
        title: "Lạm phát và sức mua",
        goal: "Hiểu lạm phát ảnh hưởng tới tiêu dùng, biên lợi nhuận và tỷ suất thực.",
        topics: ["CPI", "Lạm phát lõi", "Sức mua", "Giá đầu vào", "Tỷ suất thực"],
        practice: "Viết ngành nào hưởng lợi hoặc chịu áp lực khi chi phí đầu vào tăng.",
      },
      {
        title: "Chính sách tiền tệ",
        goal: "Nối lãi suất điều hành, tín dụng và thanh khoản với thị trường tài sản.",
        topics: ["Lãi suất điều hành", "Tăng trưởng tín dụng", "Thanh khoản", "Nới lỏng", "Thắt chặt"],
        practice: "Viết vì sao lãi suất giảm không tự động làm mọi cổ phiếu tăng.",
      },
      {
        title: "Tỷ giá và thương mại",
        goal: "Hiểu doanh nghiệp xuất khẩu, nhập khẩu và vay ngoại tệ chịu tác động khác nhau.",
        topics: ["USD/VND", "Xuất khẩu", "Nhập khẩu", "Nợ ngoại tệ", "Biên lợi nhuận"],
        practice: "Chọn một doanh nghiệp xuất khẩu và một doanh nghiệp nhập khẩu để so sánh.",
      },
      {
        title: "Chu kỳ kinh tế",
        goal: "Biết ngành nào nhạy chu kỳ, ngành nào phòng thủ và vì sao thời điểm quan trọng.",
        topics: ["Mở rộng", "Đỉnh chu kỳ", "Suy giảm", "Phục hồi", "Ngành phòng thủ"],
        practice: "Phân loại 10 mã trong danh mục theo nhạy chu kỳ hoặc phòng thủ.",
      },
    ],
  },
  {
    title: "Chiến lược và nhật ký học tập",
    slug: "chien-luoc-va-nhat-ky",
    summary:
      "Đóng vòng học tập: viết luận điểm, hành động, theo dõi, phản tư và cải thiện quy trình.",
    level: "practice",
    estimatedHours: 10,
    learnerOutcome:
      "Có quy trình học và đầu tư mô phỏng rõ ràng: trước khi mua, khi đang giữ, sau khi bán.",
    modules: [
      {
        title: "Luận điểm trước khi mua",
        goal: "Mỗi giao dịch phải có lý do có thể kiểm chứng.",
        topics: ["Lý do mua", "Thời gian nắm giữ", "Rủi ro chính", "Điều kiện sai", "Điều kiện xem lại"],
        practice: "Viết 3 dòng trước khi mua một cổ phiếu.",
        relatedArticleSlugs: ["viet-3-dong-ly-do-truoc-khi-mua"],
        relatedMissionSlugs: ["viet-ly-do-truoc-khi-mua"],
      },
      {
        title: "Theo dõi khi đang nắm giữ",
        goal: "Không nhìn giá mỗi ngày mà quên điều mình cần kiểm chứng.",
        topics: ["Tin mới", "Kết quả kinh doanh", "Tỷ trọng", "Rủi ro mới", "Tâm lý khi biến động"],
        practice: "Tạo checklist xem lại hằng tuần cho danh mục ảo.",
      },
      {
        title: "Phản tư sau quyết định",
        goal: "Tách kết quả tốt do quyết định tốt với kết quả tốt do may mắn.",
        topics: ["Đúng vì lý do đúng", "Đúng vì may mắn", "Sai nhưng quy trình tốt", "Sai do bỏ qua rủi ro", "Bài học lặp lại"],
        practice: "Chọn một giao dịch đã đóng và viết 5 dòng tự xem lại.",
      },
      {
        title: "Thiết kế hệ thống học cá nhân",
        goal: "Biến JokingFinance thành lịch luyện đều thay vì đọc ngẫu hứng.",
        topics: ["Lịch học tuần", "Mục tiêu tháng", "Danh sách câu hỏi", "Kho lỗi cá nhân", "Theo dõi tiến độ"],
        practice: "Chọn một lộ trình và đặt mục tiêu hoàn thành trong 7 ngày.",
      },
    ],
  },
];

export const glossaryTerms: GlossaryTerm[] = [
  { term: "Cổ phiếu", meaning: "Phần quyền sở hữu trong một doanh nghiệp.", group: "Công cụ" },
  { term: "Trái phiếu", meaning: "Khoản vay do doanh nghiệp hoặc chính phủ phát hành cho nhà đầu tư.", group: "Công cụ" },
  { term: "ETF", meaning: "Quỹ mô phỏng một chỉ số hoặc rổ tài sản và được giao dịch như cổ phiếu.", group: "Công cụ" },
  { term: "VN-Index", meaning: "Chỉ số phản ánh biến động giá của nhóm cổ phiếu niêm yết trên HOSE.", group: "Thị trường" },
  { term: "Thanh khoản", meaning: "Mức độ dễ mua bán tài sản mà không làm giá thay đổi quá mạnh.", group: "Thị trường" },
  { term: "Vốn hóa", meaning: "Giá trị thị trường của toàn bộ cổ phiếu đang lưu hành.", group: "Thị trường" },
  { term: "EPS", meaning: "Lợi nhuận sau thuế tính trên mỗi cổ phiếu.", group: "Định giá" },
  { term: "P/E", meaning: "Tỷ lệ giá cổ phiếu so với lợi nhuận trên mỗi cổ phiếu.", group: "Định giá" },
  { term: "P/B", meaning: "Tỷ lệ giá thị trường so với giá trị sổ sách.", group: "Định giá" },
  { term: "ROE", meaning: "Tỷ suất lợi nhuận trên vốn chủ sở hữu.", group: "Hiệu quả" },
  { term: "Biên lợi nhuận gộp", meaning: "Phần doanh thu còn lại sau khi trừ giá vốn.", group: "Báo cáo" },
  { term: "Dòng tiền tự do", meaning: "Dòng tiền còn lại sau hoạt động kinh doanh và đầu tư cần thiết.", group: "Báo cáo" },
  { term: "Nợ vay", meaning: "Khoản doanh nghiệp phải trả cho chủ nợ, thường có chi phí lãi.", group: "Báo cáo" },
  { term: "Hàng tồn kho", meaning: "Hàng hóa, nguyên vật liệu hoặc sản phẩm đang chờ bán/sản xuất.", group: "Báo cáo" },
  { term: "Biên an toàn", meaning: "Khoảng đệm giữa giá mua và giá trị ước tính để giảm sai số.", group: "Rủi ro" },
  { term: "Đa dạng hóa", meaning: "Phân bổ vào nhiều tài sản hoặc ngành để giảm phụ thuộc vào một nguồn rủi ro.", group: "Danh mục" },
  { term: "Tái cân bằng", meaning: "Điều chỉnh tỷ trọng danh mục về gần kế hoạch ban đầu hoặc kế hoạch mới.", group: "Danh mục" },
  { term: "FOMO", meaning: "Cảm giác sợ bỏ lỡ khiến người đầu tư hành động vội.", group: "Tâm lý" },
  { term: "Neo giá", meaning: "Bị ảnh hưởng quá mức bởi một mức giá tham chiếu như giá vốn.", group: "Tâm lý" },
  { term: "Lãi kép", meaning: "Lợi nhuận tạo ra lợi nhuận mới khi được tái đầu tư qua thời gian.", group: "Tài chính cá nhân" },
  { term: "Lạm phát", meaning: "Mức tăng chung của giá hàng hóa, làm giảm sức mua của tiền.", group: "Vĩ mô" },
  { term: "Tỷ giá", meaning: "Giá của một đồng tiền so với đồng tiền khác.", group: "Vĩ mô" },
  { term: "Tăng trưởng tín dụng", meaning: "Mức tăng dư nợ cho vay trong nền kinh tế hoặc hệ thống ngân hàng.", group: "Vĩ mô" },
  { term: "Biên lãi ròng", meaning: "Chênh lệch giữa thu nhập lãi và chi phí lãi so với tài sản sinh lãi.", group: "Ngân hàng" },
];
