export const APP_NAME = "JokingFinance";

export const TAGLINE =
  "Website tài chính có tòa soạn riêng và bộ mô phỏng thực hành.";

export const ALT_TAGLINE =
  "Đăng bài hằng ngày qua hệ quản trị nội dung. Để hệ thống làm phần lặp lại, không phải sửa mã nguồn mỗi lần đăng.";

export const INITIAL_VIRTUAL_POINTS = 100_000_000;

export const TRADE_FEE_RATE = 0.0015;

export const EDUCATION_DISCLAIMER =
  "Nội dung này chỉ phục vụ mục đích giáo dục và mô phỏng. Đây không phải là khuyến nghị đầu tư, khuyến nghị mua, bán hoặc nắm giữ bất kỳ chứng khoán nào. Điểm ảo không có giá trị quy đổi thành tiền thật.";

export const MOCK_DATA_DISCLAIMER =
  "Dữ liệu trong bản thử nghiệm là dữ liệu mô phỏng và dữ liệu mẫu để phục vụ trải nghiệm nội dung và mô phỏng. Không dùng để ra quyết định đầu tư thật.";

export const PUBLIC_NAV_ITEMS = [
  { label: "Trang chủ", href: "/" },
  { label: "Bài viết", href: "/articles" },
  { label: "Nhiệm vụ", href: "/missions" },
  { label: "Mô phỏng", href: "/simulator" },
  { label: "Gói học", href: "/pricing" },
  { label: "Đăng ký thử", href: "/request-access" },
];

export const APP_NAV_ITEMS = [
  { label: "Tổng quan", href: "/app/dashboard" },
  { label: "Tòa soạn", href: "/app/content" },
  { label: "Mô phỏng", href: "/app/simulator" },
  { label: "Danh mục", href: "/app/portfolio" },
  { label: "Giao dịch", href: "/app/trades" },
  { label: "Nhật ký", href: "/app/journal" },
  { label: "Nhiệm vụ", href: "/app/missions" },
  { label: "Bài viết", href: "/articles" },
  { label: "Cài đặt", href: "/app/settings" },
];

export const PRICING_PLANS = [
  {
    name: "Miễn phí",
    price: "0 đồng",
    description:
      "Bắt đầu đọc bài viết, thử mô phỏng cơ bản và làm vài nhiệm vụ nhỏ.",
    features: [
      "Đọc bài viết cho người mới",
      "Danh mục ảo cơ bản",
      "Một số nhiệm vụ giới hạn",
      "Nhật ký giao dịch cơ bản",
    ],
  },
  {
    name: "Cơ bản",
    price: "49.000 đồng/tháng",
    description:
      "Dành cho người muốn vận hành nội dung và mô phỏng đều đặn.",
    features: [
      "Tòa soạn nội dung cơ bản",
      "Danh mục ảo đầy đủ",
      "Toàn bộ nhiệm vụ nhập môn và trung cấp",
      "Nhật ký giao dịch",
      "Phân tích danh mục",
      "Theo dõi tiến độ học",
    ],
  },
  {
    name: "Chuyên sâu",
    price: "99.000 đồng/tháng",
    description:
      "Dành cho đội ngũ muốn xuất bản đều hơn, có nội dung chuyên sâu và phần xem lại rõ hơn.",
    features: [
      "Tình huống nội dung nâng cao",
      "Nhiệm vụ nâng cao",
      "Xem lại danh mục sâu hơn",
      "Lịch nội dung",
      "Công cụ phản tư giao dịch chi tiết hơn",
    ],
  },
];

export const DISCIPLINE_REMINDERS = [
  "Đừng dồn hết tiền vào một mã chỉ vì tin nóng.",
  "Viết luận điểm trước khi mua.",
  "Danh mục tốt bắt đầu từ quản trị rủi ro.",
  "Đây là môi trường luyện tập, không phải khuyến nghị đầu tư.",
  "Sai bằng điểm ảo còn rẻ hơn sai bằng tiền thật.",
];
