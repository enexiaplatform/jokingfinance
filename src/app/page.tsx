import {
  AlertTriangle,
  ArrowRight,
  Coins,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { PublicFooter } from "@/components/marketing/public-footer";
import { LandingHeroScene } from "@/components/marketing/landing-hero-scene";
import { MarketRailCards } from "@/components/marketing/market-rail-cards";
import { PublicNav } from "@/components/marketing/public-nav";

const leadArticles = [
  {
    kicker: "Chỉ số · VN-Index",
    title: "Đọc bảng chỉ số: VN-Index, HNX, UPCOM thực ra đang nói gì với bạn?",
    level: "Người mới",
    time: "6 phút đọc",
  },
  {
    kicker: "Tâm lý · Hành vi",
    title: "FOMO và sợ mất tiền thật: luyện cách kiểm soát cảm xúc bằng danh mục ảo",
    level: "Trung cấp",
    time: "9 phút đọc",
  },
  {
    kicker: "Định giá · Cơ bản",
    title: "P/E, P/B trong 5 phút: hiểu nhanh trước khi mở lệnh mô phỏng đầu tiên",
    level: "Người mới",
    time: "5 phút đọc",
  },
  {
    kicker: "Danh mục · Phân bổ",
    title: "Bao nhiêu mã là đủ? Cách phân bổ tỷ trọng cho người mới bắt đầu",
    level: "Trung cấp",
    time: "7 phút đọc",
  },
];

const loopSteps = [
  ["01", "Học", "Đọc bài học ngắn, ngôn ngữ đời thường, bám sát thị trường thật."],
  ["02", "Luyện", "Đặt lệnh mua/bán bằng danh mục ảo 100.000.000 điểm, không rủi ro."],
  ["03", "Ghi lại", "Viết luận điểm và cảm xúc trước mỗi giao dịch mô phỏng."],
  ["04", "Xem lại", "Đọc lại nhật ký giao dịch để thấy điều gì hiệu quả, điều gì không."],
  ["05", "Cải thiện", "Điều chỉnh chiến lược, lặp lại, khôn hơn trước khi dùng tiền thật."],
];

export default function Home() {
  return (
    <>
      <PublicNav />
      <main>
        <LandingHeroScene />

        <section className="sec">
          <div className="wrap">
            <div className="feed">
              <div>
                <div className="sec-head">
                  <div>
                    <span className="eyebrow">Học từ thị trường hôm nay</span>
                    <h2>Bài học & phân tích mới nhất</h2>
                  </div>
                  <Link className="more" href="/articles">
                    Xem tất cả <ArrowRight className="h-[15px] w-[15px]" aria-hidden="true" />
                  </Link>
                </div>

                <article className="lead-art">
                  <div className="art-img">
                    <div className="ph">Ảnh minh hoạ bài học</div>
                  </div>
                  <div>
                    <span className="kicker">Cơ bản · Quản trị rủi ro</span>
                    <h3>
                      Vì sao viết luận điểm trước khi mua lại quan trọng hơn việc chọn đúng cổ phiếu?
                    </h3>
                    <p>
                      Một danh mục tốt bắt đầu từ kỷ luật, không phải từ may mắn. Bài học
                      hướng dẫn bạn ghi lại lý do, thời gian nắm giữ và mức rủi ro chấp
                      nhận được, bằng điểm ảo, trước khi quen tay với tiền thật.
                    </p>
                    <div className="meta">
                      <span className="mlvl">Người mới</span>
                      <span>8 phút đọc</span>
                      <span>·</span>
                      <span>Cập nhật hôm nay</span>
                    </div>
                  </div>
                </article>

                {leadArticles.map((item) => (
                  <article className="art-row" key={item.title}>
                    <div className="thumb" />
                    <div>
                      <span className="kicker">{item.kicker}</span>
                      <h4>{item.title}</h4>
                      <div className="meta">
                        <span className="mlvl">{item.level}</span>
                        <span>{item.time}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <aside className="rail">
                <MarketRailCards />

                <div className="card">
                  <div className="card-head">
                    <span className="t">Nhiệm vụ thực hành hôm nay</span>
                    <span className="lab">2/3</span>
                  </div>
                  <div className="mission-li">
                    <span className="n">1</span>
                    <span className="x"><b>Viết luận điểm</b> trước khi mua một mã cổ phiếu mô phỏng.</span>
                  </div>
                  <div className="mission-li">
                    <span className="n">2</span>
                    <span className="x"><b>Ghi cảm xúc</b> khi đặt lệnh: bình tĩnh, tò mò hay FOMO?</span>
                  </div>
                  <div className="mission-li">
                    <span className="n">3</span>
                    <span className="x"><b>Xem lại</b> một giao dịch cũ trong nhật ký.</span>
                  </div>
                  <div className="p-[12px_15px_15px]">
                    <div className="prog"><i className="w-[66%]" /></div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="loop">
          <div className="wrap sec">
            <div className="sec-head">
              <div>
                <span className="eyebrow">Vòng lặp học tập</span>
                <h2>Học → Luyện → Ghi lại → Xem lại → Cải thiện</h2>
              </div>
            </div>
            <div className="loop-grid">
              {loopSteps.map(([num, title, text]) => (
                <div className="loop-step" key={num}>
                  <div className="n">{num}</div>
                  <h4>{title}</h4>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="safety">
          <div className="wrap">
            <div>
              <span className="eyebrow">An toàn là một tính năng</span>
              <h2>
                Vui hơn một chút,
                <br />
                nhưng không đùa với tiền của bạn.
              </h2>
              <p>
                JokingFinance là nơi an toàn để sai. Bạn luyện tập bằng điểm ảo,
                mắc lỗi bằng điểm ảo, và rút ra bài học trước khi những quyết định đó
                dính tới tiền thật.
              </p>
              <div className="hero-cta">
                <Link className="btn btn-coral" href="/signup">Tạo danh mục ảo miễn phí</Link>
                <Link className="btn btn-ghost border border-[#2d4036] text-[#cdd9d1]" href="/simulator">
                  Xem cách hoạt động
                </Link>
              </div>
            </div>
            <div className="safe-list">
              <div className="safe-row">
                <GraduationCap className="h-5 w-5" aria-hidden="true" />
                <div><b>Chỉ phục vụ giáo dục</b><span>Mọi nội dung nhằm giúp bạn hiểu, không phải để ra quyết định đầu tư.</span></div>
              </div>
              <div className="safe-row">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                <div><b>Không giao dịch tiền thật</b><span>Không kết nối tài khoản chứng khoán, không chuyển tiền, không môi giới.</span></div>
              </div>
              <div className="safe-row">
                <Coins className="h-5 w-5" aria-hidden="true" />
                <div><b>Chỉ dùng điểm ảo</b><span>Điểm ảo không có giá trị quy đổi thành tiền thật.</span></div>
              </div>
            </div>
          </div>
        </section>

        <div className="wrap py-6">
          <div className="note">
            <AlertTriangle className="h-[18px] w-[18px]" aria-hidden="true" />
            <span>
              Nội dung này chỉ phục vụ mục đích giáo dục và mô phỏng. Đây không phải là khuyến nghị đầu tư.
              Giá và chỉ số demo được lấy từ Vnstock khi khả dụng; điểm ảo không có giá trị quy đổi thành tiền thật.
            </span>
          </div>
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
