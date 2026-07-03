import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-top">
          <div>
            <span className="brand">
              Joking<span className="fin">Finance</span>
            </span>
            <p className="desc">
              JokingFinance không đùa với tiền của bạn. Nền tảng giúp bạn học tài chính
              nhẹ nhàng, an toàn và thực tế hơn trước khi dùng tiền thật.
            </p>
          </div>
          <div>
            <h5>Sản phẩm</h5>
            <ul>
              <li><Link href="/start">Bắt đầu trong 15 phút</Link></li>
              <li><Link href="/knowledge">Thư viện kiến thức</Link></li>
              <li><Link href="/news">Tin tức phân tích</Link></li>
              <li><Link href="/cases">Tình huống thực hành</Link></li>
              <li><Link href="/articles">Bài học</Link></li>
              <li><Link href="/missions">Nhiệm vụ</Link></li>
              <li><Link href="/simulator">Mô phỏng</Link></li>
              <li><Link href="/app/dashboard">Bảng học tập</Link></li>
            </ul>
          </div>
          <div>
            <h5>Gói học</h5>
            <ul>
              <li><Link href="/pricing">Miễn phí</Link></li>
              <li><Link href="/pricing">Cá nhân</Link></li>
              <li><Link href="/ebook">Ebook sắp phát hành</Link></li>
              <li><Link href="/request-access">Đăng ký thử</Link></li>
            </ul>
          </div>
          <div>
            <h5>Tài khoản</h5>
            <ul>
              <li><Link href="/login">Đăng nhập</Link></li>
              <li><Link href="/signup">Tạo tài khoản</Link></li>
              <li><Link href="/request-access">Trợ giúp</Link></li>
              <li><Link href="/about">Giới thiệu</Link></li>
              <li><Link href="/editorial-policy">Nguyên tắc biên tập</Link></li>
              <li><Link href="/affiliate-disclosure">Công bố affiliate</Link></li>
              <li><Link href="/risk-disclaimer">Cảnh báo rủi ro & dữ liệu</Link></li>
              <li><Link href="/privacy">Quyền riêng tư</Link></li>
              <li><Link href="/terms">Điều khoản</Link></li>
              <li><Link href="/contact">Liên hệ</Link></li>
            </ul>
          </div>
        </div>
        <div className="foot-bot">
          © 2026 JokingFinance · Sản phẩm giáo dục & mô phỏng. Dữ liệu thị trường demo lấy từ
          Vnstock khi khả dụng và có thể có độ trễ, không phải lời khuyên đầu tư. Điểm ảo không có giá trị quy đổi thành tiền thật.
        </div>
      </div>
    </footer>
  );
}
