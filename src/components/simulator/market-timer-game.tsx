"use client";

import { useState, useMemo, useEffect } from "react";
import { formatCurrency, formatPercent } from "@/lib/format";
import {
  Coins,
  TrendingUp,
  ArrowRight,
  BookOpen,
  Sparkles,
  Percent,
  Calendar,
  ShieldAlert,
  CheckCircle,
  Scale,
  Play,
  Pause,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  Flame,
  Info,
  DollarSign,
  TrendingDown,
  ChevronRight,
  Zap,
  Activity,
  Award
} from "lucide-react";
import Link from "next/link";

type Scenario = {
  id: string;
  name: string;
  description: string;
  prices: number[];
  headlines: string[];
};

const SCENARIOS: Scenario[] = [
  {
    id: "bubble-crash",
    name: "Bong bóng & Sụp đổ (Tech Hype)",
    description: "Mô phỏng một siêu chu kỳ tăng trưởng nóng do làn sóng công nghệ mới (AI), sau đó là cú sập 80% bong bóng xì hơi và sự hồi sinh chậm rãi.",
    prices: [
      100, 115, 135, 170, 220, 290, 360, 420, 450, // Peak at index 8 (450)
      350, 260, 180, 120, 90, 75, 70, // Bottom at index 15 (70)
      85, 105, 120, 140, 160, 185, 210, 230, 250, 275, 295, 315, 335, 350
    ],
    headlines: [
      "Thị trường đi ngang ổn định. Triển vọng vĩ mô trung hòa, nhà đầu tư chờ đợi tín hiệu mới.",
      "Cổ phiếu JOKE công bố báo cáo kiểm toán triển vọng. Lợi nhuận mảng phần mềm tăng nhẹ.",
      "Nhiều hội nhóm bắt đầu xôn xao về làn sóng AI mới. Khối lượng khớp lệnh JOKE tăng vọt.",
      "Quỹ ngoại đăng ký mua ròng 5 triệu cổ phiếu. Các phòng tư vấn hô hào giải ngân quyết liệt.",
      "JOKE công bố dự án trung tâm dữ liệu AI lớn. Giá cổ phiếu tăng trần 3 phiên liên tiếp!",
      "Hưng phấn tột độ! Báo chí đưa tin: 'Bí quyết kiếm tiền tỷ từ chứng khoán của cậu sinh viên'.",
      "Dòng tiền F0 đổ xô mở tài khoản mới kỷ lục. Định giá P/E của JOKE vượt ngưỡng 70 lần.",
      "Đỉnh cao FOMO! Các công ty chứng khoán đồng loạt nâng giá mục tiêu JOKE lên mức không tưởng.",
      "Cực kỳ nóng! Mọi người bàn tán về JOKE ở quán cà phê. 'Mua là thắng, không thể giảm!'",
      "Cảnh báo: Đối tác Mỹ bất ngờ trì hoãn tiến độ dự án AI. Lực bán chốt lời gia tăng nhanh chóng.",
      "Tháo chạy! Hiện tượng giải chấp margin (margin call) diện rộng xuất hiện trên toàn thị trường.",
      "Hoảng loạn bán sàn! Diễn đàn ngập tràn tin nhắn than khóc cắt lỗ. JOKE mất mốc 200.",
      "Khủng hoảng niềm tin. Ban lãnh đạo lên tiếng trấn an nhưng đà bán tháo không có dấu hiệu dừng.",
      "Tin đồn phá sản lan truyền trên mạng. Nhà đầu tư hoang mang tột độ, bán bằng mọi giá.",
      "Tận cùng nỗi sợ. Lệnh bán sàn chất đống không ai mua. Nhiều tài khoản cháy 80% vốn.",
      "Tuyệt vọng cùng cực. Đa số nhà đầu tư nhỏ lẻ đã dứt khoát cắt lỗ ngay đáy để rút tiền mặt.",
      "Thị trường bắt đầu cân bằng trở lại sau tin tức vĩ mô phục hồi. JOKE âm thầm tăng nhẹ.",
      "Báo cáo tài chính tự cứu vãn của JOKE: Biên lợi nhuận cốt lõi cải thiện nhờ cắt giảm chi phí.",
      "Dòng tiền thông minh bắt đầu gom hàng lặng lẽ. Diễn đàn vẫn còn ám ảnh nỗi sợ và nghi ngờ.",
      "JOKE công bố hợp đồng gia công phần mềm mới ổn định. Hoạt động kinh doanh dần đi vào quỹ đạo.",
      "Cổ đông lớn đăng ký mua vào số lượng lớn. Thị trường xác nhận xu hướng tạo đáy thành công.",
      "Ngành công nghệ phục hồi mạnh mẽ. JOKE lấy lại vị thế doanh nghiệp đầu ngành.",
      "Khối ngoại quay lại mua ròng liên tiếp 10 phiên. Triển vọng doanh thu 3 năm tới khả quan.",
      "Giá tăng đều đặn đi kèm thanh khoản lành mạnh. Kỷ nguyên tăng trưởng bền vững bắt đầu.",
      "JOKE vượt mốc giá trị thực tế định giá thận trọng. Các báo cáo phân tích bắt đầu khách quan hơn.",
      "Kết quả kinh doanh quý tăng trưởng 25% cùng kỳ. Nhà đầu tư dài hạn gặt hái quả ngọt.",
      "Thị trường chung vào sóng uptrend mới. Tâm lý nhà đầu tư cân bằng, tôn trọng dữ liệu hơn.",
      "Cổ phiếu tích lũy nền giá chặt chẽ. Kết hợp chia cổ tức tiền mặt đều đặn 15%.",
      "JOKE được thêm vào danh mục khuyến nghị cốt lõi của các quỹ đầu tư uy tín nhất.",
      "Sau 10 năm ảo, JOKE đã hồi phục ngoạn mục về sát đỉnh cũ nhờ giá trị thật của doanh nghiệp."
    ]
  },
  {
    id: "lost-decade",
    name: "Thập kỷ đi ngang & Phí bào mòn (Sideways)",
    description: "Thị trường biến động trồi sụt không xu hướng rõ ràng trong biên độ 75 - 135. Thử thách cực hạn cho những ai lướt sóng ngắn hạn liên tục.",
    prices: [
      100, 115, 95, 80, 110, 125, 90, 85, 115, 130, // Loop 1
      100, 85, 75, 105, 120, 95, 90, 115, 135, 110, // Loop 2
      90, 80, 105, 120, 100, 85, 110, 125, 95, 110
    ],
    headlines: [
      "Thị trường đi ngang biên độ hẹp. Khuyến nghị chung: Mua ở hỗ trợ, bán ở kháng cự.",
      "Hưng phấn ngắn hạn: Giá vượt 110, các room chat hô hào break-out (vượt đỉnh) thành công.",
      "Quay xe! Lực bán ép mạnh khi chạm kháng cự cũ. Phe mua đuổi bị kẹt hàng.",
      "Tâm lý chán nản bao trùm. Thanh khoản sụt giảm mạnh, dòng tiền lớn rút ra đứng ngoài.",
      "Sóng hồi phục kỹ thuật bắt đầu khi giá chạm hỗ trợ cứng. Tin tức kết quả kinh doanh trung bình.",
      "Giá tăng mạnh kích hoạt tâm lý hưng phấn. 'Liệu lần này có thực sự vượt đỉnh?'",
      "Lại sập! Tin tức vĩ mô thế giới xấu khiến dòng tiền rút chạy nhanh chóng.",
      "Nhà đầu tư cá nhân cắt lỗ hàng loạt vì sợ thị trường rơi sâu hơn.",
      "Dòng tiền bất ngờ quay lại bắt đáy mỏ neo giá thấp. Giá hồi phục nhanh chóng.",
      "Chạm vùng đỉnh cũ 130. Tin tốt dồn dập được tung ra trên các mặt báo.",
      "Áp lực chốt lời mạnh mẽ khiến giá tụt sâu nhanh chóng ngay sau khi ra tin tốt.",
      "Cổ phiếu giảm sâu về sát hỗ trợ. Nhà đầu tư ngắn hạn lo sợ kịch bản thủng đáy.",
      "Tận cùng chán nản. Diễn đàn đìu hiu, không ai muốn bàn luận về cổ phiếu này nữa.",
      "Cổ đông nội bộ đăng ký gom mua. Giá bắt đầu nhích nhẹ từ đáy.",
      "Bật tăng mạnh mẽ trở lại. Nhóm phân tích kỹ thuật ca ngợi mô hình 2 đáy.",
      "Đột ngột điều chỉnh mạnh 20% chỉ sau một tuần. Bẫy tăng giá (bull-trap) điển hình.",
      "Nhà đầu tư cá nhân hoang mang cắt lỗ vì nghĩ mình đã phân tích sai mô hình.",
      "Giá lại lầm lũi đi lên trong sự ngỡ ngàng của những người vừa bán.",
      "Chạm đỉnh ngắn hạn mới 135. Hào hứng quay lại, tin tức vĩ mô có dấu hiệu ấm lên.",
      "Áp lực xả hàng tại đỉnh cũ. Giá tụt dốc nhanh chóng khiến người mua đỉnh kẹt vốn.",
      "Dòng tiền đầu cơ dịch chuyển sang nhóm ngành khác. JOKE bị bỏ quên.",
      "Rơi sâu về mốc 80. Các bài viết cắt lỗ lại xuất hiện tràn ngập.",
      "Hồi phục nhanh từ đáy hỗ trợ. Doanh nghiệp công bố chia cổ tức nhỏ.",
      "Sóng tăng ngắn hạn thu hút dòng tiền lướt sóng quay lại.",
      "Giá đi ngang tích lũy quanh mốc 100. Thị trường chung không rõ xu hướng.",
      "Lại một lần nữa rơi về vùng giá thấp do áp lực tỷ giá ngắn hạn.",
      "Mua ròng từ các quỹ ETF kéo giá cổ phiếu hồi phục nhanh.",
      "Hưng phấn ngắn hạn theo đồ thị kỹ thuật vượt đường trung bình MA20.",
      "Lực bán tại kháng cự xuất hiện như thường lệ. Giá điều chỉnh nhẹ.",
      "Kết thúc 10 năm, giá cổ phiếu quay lại mốc 110. Thị trường đi ngang hoàn toàn."
    ]
  },
  {
    id: "growth-crash",
    name: "Tăng trưởng & Cú sập bất ngờ (Growth & Dip)",
    description: "Một kịch bản doanh nghiệp tăng trưởng dài hạn vượt trội, nhưng xen giữa là một cú sập kinh hoàng 45% (Flash Crash) thử thách ý chí nắm giữ.",
    prices: [
      100, 110, 120, 115, 130, 145, 160, 180, 175, 195,
      215, 235, 260, 290, 275, 305, 330, 360, 390, 420,
      280, 230, 300, 340, 370, 400, 430, 460, 480, 500 // Flash crash at index 20 (420 -> 280 -> 230)
    ],
    headlines: [
      "Khởi đầu chu kỳ mới. JOKE công bố chiến lược tăng trưởng doanh thu 20%/năm.",
      "Kết quả kinh doanh quý 1 đạt kỳ vọng. Biên lợi nhuận cải thiện rõ rệt.",
      "Xu hướng tăng giá được thiết lập chặt chẽ. Khối ngoại liên tục mua gom tích trữ.",
      "Điều chỉnh kỹ thuật nhẹ nhàng. Nhà đầu tư dài hạn tranh thủ gia tăng tỷ trọng.",
      "JOKE xuất khẩu thành công lô hàng đầu tiên sang thị trường châu Âu khó tính.",
      "Lợi nhuận sau thuế lập kỷ lục mới. Các bài viết phân tích ca ngợi cơ bản doanh nghiệp.",
      "Định giá cổ phiếu lọt vào mắt xanh của các quỹ đầu tư tăng trưởng lớn.",
      "Hưng phấn lan tỏa rộng. Giá cổ phiếu liên tiếp chinh phục các mốc cao mới.",
      "Nhịp chốt lời ngắn hạn bình thường. Lực cầu hấp thụ tại các mức giá thấp rất tốt.",
      "Doanh nghiệp công bố kế hoạch tăng vốn mở rộng nhà máy giai đoạn 2.",
      "Tiến độ xây dựng nhà máy vượt kế hoạch. Cổ đông hồ hởi trước tương lai x2 công suất.",
      "Doanh thu quý tiếp tục bùng nổ. JOKE trở thành cánh chim đầu đàn của ngành.",
      "Sự đồng thuận cao độ từ giới phân tích. 100% công ty chứng khoán khuyến nghị Mua.",
      "Dòng tiền Margin đổ vào JOKE đạt mức cao nhất lịch sử. Cơn sốt sở hữu cổ phiếu.",
      "Nhịp rung lắc nhẹ khi giá chạm vùng 290. Nhà đầu tư cá nhân tự tin gia tăng thêm vốn.",
      "Nhà máy mới chính thức đi vào hoạt động thử nghiệm thành công.",
      "JOKE công bố biên bản ghi nhớ hợp tác chiến lược quốc tế giá trị lớn.",
      "Làn sóng mua ròng đẩy giá cổ phiếu vượt mốc 360 trong sự hân hoan.",
      "Định giá P/E bắt đầu đắt đỏ nhưng triển vọng tăng trưởng mạnh mẽ làm lu mờ rủi ro.",
      "JOKE chạm mốc 420 điểm. Sự tự tin của người nắm giữ đạt mức cực đại.",
      "SỤP ĐỔ CHÓP NHOÁNG! Tin tức bất ngờ về việc một đối thủ cạnh tranh ra mắt sản phẩm mới thay thế.",
      "HOẢNG LOẠN TỘT ĐỘ! JOKE sập sàn 5 phiên liên tiếp. Lệnh Margin Call chéo quét sạch các tài khoản dùng đòn bẩy.",
      "BẮT ĐẦU PHỤC HỒI! Ban lãnh đạo đưa ra số liệu chứng minh sản phẩm mới của đối thủ không ảnh hưởng tới phân khúc của JOKE.",
      "Thị trường thừa nhận việc bán tháo tháo chạy là quá đà. Giá phục hồi cực nhanh.",
      "Kết quả kinh doanh quý tiếp theo đập tan mọi nghi ngờ: Doanh thu vẫn tăng trưởng 22%!",
      "Nhà đầu tư cắt lỗ ngay đáy tiếc nuối nhìn cổ phiếu tăng trần phục hồi hình chữ V.",
      "JOKE quay lại quỹ đạo tăng trưởng cũ. Nhà máy mới hoạt động hết công suất.",
      "Giá cổ phiếu vượt đỉnh cũ lịch sử 420 trong sự ngỡ ngàng của đám đông.",
      "Thị trường chung đồng thuận đi lên. Dòng tiền vững vàng ủng hộ doanh nghiệp giá trị thật.",
      "Kết thúc 10 năm mô phỏng, JOKE tăng gấp 5 lần (đạt 500 điểm). Chiến thắng rực rỡ cho người nắm giữ kiên trì!"
    ]
  }
];

export function MarketTimerGame() {
  const [gameState, setGameState] = useState<"welcome" | "playing" | "gameover">("welcome");
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>("bubble-crash");
  const [currentStep, setCurrentStep] = useState<number>(0);
  
  // Game variables
  const [cash, setCash] = useState<number>(100000000); // 100M VND/points
  const [shares, setShares] = useState<number>(0);
  const [feeRate] = useState<number>(0.0015); // 0.15% fee per trade
  const [totalTrades, setTotalTrades] = useState<number>(0);
  const [totalFeesPaid, setTotalFeesPaid] = useState<number>(0);
  
  // Trade Log for this session
  const [tradeHistory, setTradeHistory] = useState<{
    step: number;
    type: "BUY" | "SELL";
    price: number;
    amount: number;
    sharesCount: number;
    fee: number;
  }[]>([]);

  // Simulation speed and control
  const [isPlayingAuto, setIsPlayingAuto] = useState<boolean>(false);
  const [autoSpeed] = useState<number>(1500); // 1.5s per step

  const currentScenario = useMemo(() => {
    return SCENARIOS.find(s => s.id === selectedScenarioId) || SCENARIOS[0];
  }, [selectedScenarioId]);

  const currentPrice = useMemo(() => {
    return currentScenario.prices[currentStep] || 100;
  }, [currentScenario, currentStep]);

  const currentPortfolioValue = useMemo(() => {
    return cash + shares * currentPrice;
  }, [cash, shares, currentPrice]);

  // Buy & Hold Benchmark
  // Day 1: buy all shares possible with 100M at initial price (price[0])
  const buyAndHoldShares = useMemo(() => {
    const initialPrice = currentScenario.prices[0];
    const initialFee = 100000000 * feeRate;
    const netCash = 100000000 - initialFee;
    return netCash / initialPrice;
  }, [currentScenario, feeRate]);

  const buyAndHoldValue = useMemo(() => {
    return buyAndHoldShares * currentPrice;
  }, [buyAndHoldShares, currentPrice]);

  // Autoplay effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === "playing" && isPlayingAuto) {
      timer = setInterval(() => {
        handleNextStep();
      }, autoSpeed);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameState, isPlayingAuto, currentStep]);

  // Handle advancing step
  const handleNextStep = () => {
    if (currentStep < currentScenario.prices.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsPlayingAuto(false);
      setGameState("gameover");
    }
  };

  const handleStartGame = (scenarioId: string) => {
    setSelectedScenarioId(scenarioId);
    setGameState("playing");
    setCurrentStep(0);
    setCash(100000000);
    setShares(0);
    setTotalTrades(0);
    setTotalFeesPaid(0);
    setTradeHistory([]);
    setIsPlayingAuto(false);
  };

  const handleBuy = (percent: number) => {
    if (cash <= 0) return;
    const investAmount = cash * (percent / 100);
    const fee = investAmount * feeRate;
    const netInvest = investAmount - fee;
    const sharesBought = netInvest / currentPrice;

    setCash(prev => prev - investAmount);
    setShares(prev => prev + sharesBought);
    setTotalTrades(prev => prev + 1);
    setTotalFeesPaid(prev => prev + fee);
    
    setTradeHistory(prev => [
      ...prev,
      {
        step: currentStep,
        type: "BUY",
        price: currentPrice,
        amount: investAmount,
        sharesCount: sharesBought,
        fee
      }
    ]);
  };

  const handleSell = (percent: number) => {
    if (shares <= 0) return;
    const sharesToSell = shares * (percent / 100);
    const grossRevenue = sharesToSell * currentPrice;
    const fee = grossRevenue * feeRate;
    const netRevenue = grossRevenue - fee;

    setShares(prev => prev - sharesToSell);
    setCash(prev => prev + netRevenue);
    setTotalTrades(prev => prev + 1);
    setTotalFeesPaid(prev => prev + fee);

    setTradeHistory(prev => [
      ...prev,
      {
        step: currentStep,
        type: "SELL",
        price: currentPrice,
        amount: grossRevenue,
        sharesCount: sharesToSell,
        fee
      }
    ]);
  };

  // SVG Chart path calculation
  const chartWidth = 500;
  const chartHeight = 240;
  const chartPadding = { top: 20, right: 20, bottom: 30, left: 40 };

  const minPrice = useMemo(() => {
    return Math.min(...currentScenario.prices) * 0.85;
  }, [currentScenario]);

  const maxPrice = useMemo(() => {
    return Math.max(...currentScenario.prices) * 1.05;
  }, [currentScenario]);

  const points = useMemo(() => {
    const totalPoints = currentScenario.prices.length;
    const xStep = (chartWidth - chartPadding.left - chartPadding.right) / (totalPoints - 1);
    
    return currentScenario.prices.map((price, idx) => {
      const x = chartPadding.left + idx * xStep;
      // Invert Y because SVG coordinates start from top-left
      const yPercent = (price - minPrice) / (maxPrice - minPrice);
      const y = chartHeight - chartPadding.bottom - yPercent * (chartHeight - chartPadding.top - chartPadding.bottom);
      return { x, y, price, isRevealed: idx <= currentStep };
    });
  }, [currentScenario, currentStep, minPrice, maxPrice]);

  const linePath = useMemo(() => {
    const revealedPoints = points.filter(p => p.isRevealed);
    if (revealedPoints.length === 0) return "";
    return revealedPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  }, [points]);

  const benchmarkPath = useMemo(() => {
    // Light dotted baseline of the future path (so user sees history and progress)
    return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  }, [points]);

  // Diagnosis calculation
  const diagnosis = useMemo(() => {
    if (gameState !== "gameover") return null;

    let fomoCount = 0;
    let panicCount = 0;
    let lossAversionTriggered = false;

    // Check Scenario 1: Bubble Top FOMO (Indices 6, 7, 8 are near peak)
    // Check Scenario 3: Flash Crash Panic (Indices 20, 21, 22 are near bottom)
    tradeHistory.forEach(trade => {
      if (selectedScenarioId === "bubble-crash") {
        // Peak is at index 8. Buying at index 6, 7, 8 indicates FOMO.
        if (trade.type === "BUY" && [6, 7, 8].includes(trade.step)) {
          fomoCount++;
        }
        // Bottom is at index 15. Selling at index 13, 14, 15, 16 indicates Panic.
        if (trade.type === "SELL" && [13, 14, 15, 16].includes(trade.step)) {
          panicCount++;
        }
      }

      if (selectedScenarioId === "growth-crash") {
        // Flash crash bottom is at index 21. Selling at index 20, 21 indicates Panic.
        if (trade.type === "SELL" && [20, 21].includes(trade.step)) {
          panicCount++;
        }
      }
    });

    // General Overtrading check
    const isOvertrading = totalTrades > 8;

    // Determine type
    let title = "Nhà đầu tư Thận trọng";
    let desc = "Bạn giao dịch ít, hạn chế được chi phí giao dịch ảo. Tuy nhiên, hiệu quả thời điểm vẫn có thể cải thiện bằng cách tích lũy đều đặn.";
    let icon = <CheckCircle className="h-10 w-10 text-green-500" />;
    let badgeColor = "bg-green-100 text-green-800";
    let linkPillar = "tai-chinh-ca-nhan";
    let linkModule = "Bức tranh dòng tiền cá nhân";

    if (fomoCount > 0 && panicCount > 0) {
      title = "Chu kỳ Cảm xúc Cực đoan (FOMO & Panic Rider)";
      desc = "Bạn mắc cả hai lỗi kinh điển: Hưng phấn mua đuổi ở đỉnh sóng và hoảng sợ cắt lỗ ngay đáy. Đây là cách nhanh nhất để thiêu rụi tài sản.";
      icon = <Flame className="h-10 w-10 text-red-500 animate-pulse" />;
      badgeColor = "bg-red-100 text-red-800";
      linkPillar = "tam-ly-dau-tu";
      linkModule = "FOMO và tin nóng";
    } else if (fomoCount > 0) {
      title = "Người mua đuổi đỉnh (FOMO Buyer)";
      desc = "Bạn dễ bị kích hoạt bởi màu xanh của nến tăng và các tin tức hào nhoáng. Bạn mua khi đám đông phấn khích nhất mà thiếu phân tích định giá cơ bản.";
      icon = <Zap className="h-10 w-10 text-yellow-500" />;
      badgeColor = "bg-yellow-100 text-yellow-800";
      linkPillar = "tam-ly-dau-tu";
      linkModule = "Neo giá và sợ lỗ";
    } else if (panicCount > 0) {
      title = "Người tháo chạy đáy (Panic Seller)";
      desc = "Bạn không chịu nổi áp lực khi giá cổ phiếu sụt giảm mạnh, dẫn đến quyết định bán đúng đáy ngay trước khi thị trường đảo chiều hồi phục.";
      icon = <ShieldAlert className="h-10 w-10 text-[#9a3412]" />;
      badgeColor = "bg-[#fff0e8] text-[#9a3412]";
      linkPillar = "quan-tri-rui-ro";
      linkModule = "Kịch bản xấu";
    } else if (isOvertrading) {
      title = "Nghiện lướt sóng (Overtrader)";
      desc = "Bạn giao dịch quá nhiều lần. Phí giao dịch ảo và thuế đã âm thầm bào mòn một lượng lớn lợi nhuận của bạn, ngay cả khi bạn dự đoán đúng hướng đi.";
      icon = <Activity className="h-10 w-10 text-blue-500" />;
      badgeColor = "bg-blue-100 text-blue-800";
      linkPillar = "chien-luoc-va-nhat-ky";
      linkModule = "Tin tức và nhiễu thị trường";
    } else if (currentPortfolioValue > buyAndHoldValue * 1.05) {
      title = "Huyền thoại Timing (Market Wizard)";
      desc = "Xuất sắc! Bạn đã tối ưu hóa thời điểm mua thấp bán cao và đánh bại chiến lược Buy & Hold. Lưu ý: Ở đời thực, tỷ lệ lặp lại kết quả này dài hạn là dưới 2%.";
      icon = <Award className="h-10 w-10 text-yellow-500 fill-yellow-200" />;
      badgeColor = "bg-yellow-100 text-yellow-800";
    } else if (shares === 0 && cash === 100000000) {
      title = "Quan sát viên Bên lề (Spectator)";
      desc = "Bạn không thực hiện bất kỳ giao dịch nào. Bạn bảo toàn được vốn gốc nhưng bỏ lỡ toàn bộ cơ hội tăng trưởng dài hạn của doanh nghiệp.";
      icon = <Info className="h-10 w-10 text-gray-500" />;
      badgeColor = "bg-gray-100 text-gray-800";
    } else if (Math.abs(currentPortfolioValue - buyAndHoldValue) < buyAndHoldValue * 0.05) {
      title = "Người đồng hành Thị trường (Market Follower)";
      desc = "Kết quả của bạn bám sát chiến lược Buy & Hold. Đây là minh chứng cho thấy nỗ lực canh thời điểm của bạn không mang lại nhiều khác biệt so với việc nắm giữ kiên nhẫn.";
      icon = <Scale className="h-10 w-10 text-teal-500" />;
      badgeColor = "bg-teal-100 text-teal-800";
    }

    return { title, desc, icon, badgeColor, linkPillar, linkModule };
  }, [gameState, tradeHistory, currentPortfolioValue, buyAndHoldValue, selectedScenarioId, totalTrades]);

  // Current status metrics
  const cashPercent = useMemo(() => {
    return (cash / currentPortfolioValue) * 100;
  }, [cash, currentPortfolioValue]);

  const sharesPercent = useMemo(() => {
    return 100 - cashPercent;
  }, [cashPercent]);

  return (
    <div className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm font-sans text-left">
      {gameState === "welcome" && (
        <div className="max-w-2xl mx-auto py-8">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#edf4ef] text-[#0f766e] mb-3">
              <Activity className="h-3.5 w-3.5" /> TRÒ CHƠI TƯƠNG TÁC TÂM LÝ
            </span>
            <h1 className="text-3xl font-extrabold text-[#17201b]">Thử Thách Canh Thời Điểm Thị Trường</h1>
            <p className="mt-2 text-[#5b6861] leading-6">
              Liệu bạn có đủ tỉnh táo trước các tin đồn hưng phấn và hoảng loạn sập sàn để đánh bại chiến lược nắm giữ đơn giản? 
              Hãy thử sức timing thị trường ảo trong 30 bước quyết định!
            </p>
          </div>

          <div className="grid gap-4 mb-8">
            <h3 className="font-bold text-[#17201b]">Bước 1: Chọn kịch bản thị trường để bắt đầu</h3>
            <div className="grid gap-3.5">
              {SCENARIOS.map((scen) => (
                <button
                  key={scen.id}
                  onClick={() => handleStartGame(scen.id)}
                  className="p-4 rounded-lg border border-[#d9ddd3] bg-white hover:border-[#0f766e] hover:bg-[#f8fbf7] text-left transition-all group flex gap-4 items-start"
                >
                  <div className="h-10 w-10 rounded-full bg-[#edf4ef] flex items-center justify-center shrink-0 text-[#0f766e] font-bold">
                    {scen.id === "bubble-crash" ? "📈" : scen.id === "lost-decade" ? "⚖️" : "🚀"}
                  </div>
                  <div>
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-[#17201b] group-hover:text-[#0f766e]">{scen.name}</h4>
                      <span className="text-xs font-bold text-[#0f766e] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        Chơi ngay <ChevronRight className="h-3 w-3" />
                      </span>
                    </div>
                    <p className="text-xs text-[#5b6861] mt-1 leading-5">{scen.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-md bg-[#edf5ee] border border-[#d2dfd5] text-xs text-[#314039] leading-5">
            <p className="font-bold mb-1 flex items-center gap-1">
              <Info className="h-4 w-4 text-[#0f766e]" /> Luật chơi cơ bản:
            </p>
            <ul className="list-disc pl-4 grid gap-1 mt-1 text-[#4a5a52]">
              <li>Bạn bắt đầu với <b>100.000.000 điểm ảo</b> (VND giả định).</li>
              <li>Tại mỗi bước, bạn sẽ thấy biểu đồ giá cập nhật cùng với tin tức báo chí/hội nhóm tiêu biểu.</li>
              <li>Bạn có thể chọn <b>MUA 25%/50%/100%</b>, <b>BÁN 25%/50%/100%</b> hoặc đơn giản là <b>BỎ QUA (HOLD)</b> để tiến sang bước sau.</li>
              <li>Mỗi lệnh giao dịch ảo tốn <b>0,15% phí giao dịch</b> để phản ánh đúng thực tế.</li>
              <li>Mục tiêu: Đạt giá trị tài sản ròng cuối cùng cao hơn chiến lược <b>Mua & Nắm giữ (Buy & Hold)</b> từ bước đầu tiên.</li>
            </ul>
          </div>
        </div>
      )}

      {gameState === "playing" && (
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          {/* Main Simulation Panel */}
          <div className="flex flex-col gap-4">
            {/* Header / Info bar */}
            <div className="flex justify-between items-center bg-[#f8fbf7] p-3 rounded-md border border-[#edf0eb]">
              <div>
                <p className="text-xs font-semibold text-[#5b6861]">Kịch bản đang chơi</p>
                <p className="font-bold text-[#17201b]">{currentScenario.name}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-[#5b6861]">Tiến độ thời gian</p>
                <p className="font-mono font-bold text-[#0f766e]">
                  Bước {currentStep + 1} / {currentScenario.prices.length}
                </p>
              </div>
            </div>

            {/* Simulated Live News Ticker */}
            <div className={`p-4 rounded-md border transition-all duration-300 ${
              currentScenario.prices[currentStep] > (currentScenario.prices[currentStep - 1] || 100)
                ? "bg-[#edf6ed] border-[#b9d9c5] text-[#166534]"
                : "bg-[#fff0e8] border-[#f1bea8] text-[#9a3412]"
            }`}>
              <div className="flex gap-2 items-start">
                <span className="text-lg mt-0.5">
                  {currentScenario.prices[currentStep] > (currentScenario.prices[currentStep - 1] || 100) ? "🐂" : "🐻"}
                </span>
                <div>
                  <p className="text-xs uppercase font-bold tracking-wider opacity-75">
                    Tin tức nóng & Hội nhóm thảo luận:
                  </p>
                  <p className="font-bold text-sm mt-1 leading-5">
                    {currentScenario.headlines[currentStep]}
                  </p>
                </div>
              </div>
            </div>

            {/* SVG Chart */}
            <div className="relative border border-[#e0e5dc] rounded-md bg-[#fafbfa] p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-[#314039] flex items-center gap-1">
                  <Activity className="h-3.5 w-3.5 text-[#0f766e]" /> Biểu đồ giá JOKE
                </span>
                <span className="text-xs font-mono font-bold text-[#17201b]">
                  Giá hiện tại: <b className="text-base text-[#0f766e]">{currentPrice}</b> điểm
                </span>
              </div>
              
              <svg
                width="100%"
                height={chartHeight}
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="overflow-visible"
              >
                {/* Background Grid Lines */}
                {[0.25, 0.5, 0.75].map((ratio, idx) => {
                  const y = chartPadding.top + ratio * (chartHeight - chartPadding.top - chartPadding.bottom);
                  const priceLabel = Math.round(maxPrice - ratio * (maxPrice - minPrice));
                  return (
                    <g key={idx}>
                      <line
                        x1={chartPadding.left}
                        y1={y}
                        x2={chartWidth - chartPadding.right}
                        y2={y}
                        stroke="#e2e8f0"
                        strokeWidth="1"
                        strokeDasharray="4,4"
                      />
                      <text
                        x={chartPadding.left - 6}
                        y={y + 3}
                        textAnchor="end"
                        className="text-[9px] font-mono fill-[#64748b]"
                      >
                        {priceLabel}
                      </text>
                    </g>
                  );
                })}

                {/* Benchmark Dotted Path (Future shadow) */}
                <path
                  d={benchmarkPath}
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="1.5"
                  strokeDasharray="3,3"
                />

                {/* Active Price Path */}
                <path
                  d={linePath}
                  fill="none"
                  stroke="#0f766e"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Pulse at Current Price */}
                {points[currentStep] && (
                  <g>
                    <circle
                      cx={points[currentStep].x}
                      cy={points[currentStep].y}
                      r="6"
                      className="fill-[#0f766e] animate-ping opacity-75"
                    />
                    <circle
                      cx={points[currentStep].x}
                      cy={points[currentStep].y}
                      r="4"
                      className="fill-[#0f766e] stroke-white stroke-2"
                    />
                  </g>
                )}

                {/* X Axis line */}
                <line
                  x1={chartPadding.left}
                  y1={chartHeight - chartPadding.bottom}
                  x2={chartWidth - chartPadding.right}
                  y2={chartHeight - chartPadding.bottom}
                  stroke="#94a3b8"
                  strokeWidth="1"
                />
              </svg>
            </div>

            {/* Interaction Buttons */}
            <div className="grid gap-3.5 bg-[#f8fbf7] p-5 rounded-md border border-[#d9ddd3]">
              <div className="flex justify-between items-center text-xs font-bold text-[#4a5a52]">
                <span>MUA VÀO (bằng tiền mặt)</span>
                <span>BÁN RA (cổ phiếu đang giữ)</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {/* Buy Panel */}
                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleBuy(25)}
                    disabled={cash < 1000}
                    className="flex-1 h-10 rounded-md bg-[#0f766e] hover:bg-[#115e59] text-white font-bold text-xs disabled:opacity-50"
                  >
                    Mua 25%
                  </button>
                  <button
                    onClick={() => handleBuy(50)}
                    disabled={cash < 1000}
                    className="flex-1 h-10 rounded-md bg-[#0f766e] hover:bg-[#115e59] text-white font-bold text-xs disabled:opacity-50"
                  >
                    Mua 50%
                  </button>
                  <button
                    onClick={() => handleBuy(100)}
                    disabled={cash < 1000}
                    className="flex-1 h-10 rounded-md bg-[#0f766e] hover:bg-[#115e59] text-white font-bold text-xs disabled:opacity-50"
                  >
                    All-in Cash
                  </button>
                </div>

                {/* Sell Panel */}
                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleSell(25)}
                    disabled={shares <= 0}
                    className="flex-1 h-10 rounded-md bg-[#b91c1c] hover:bg-[#991b1b] text-white font-bold text-xs disabled:opacity-50"
                  >
                    Bán 25%
                  </button>
                  <button
                    onClick={() => handleSell(50)}
                    disabled={shares <= 0}
                    className="flex-1 h-10 rounded-md bg-[#b91c1c] hover:bg-[#991b1b] text-white font-bold text-xs disabled:opacity-50"
                  >
                    Bán 50%
                  </button>
                  <button
                    onClick={() => handleSell(100)}
                    disabled={shares <= 0}
                    className="flex-1 h-10 rounded-md bg-[#b91c1c] hover:bg-[#991b1b] text-white font-bold text-xs disabled:opacity-50"
                  >
                    Bán Hết
                  </button>
                </div>
              </div>

              {/* Progress and control buttons */}
              <div className="flex gap-3 border-t border-[#d9ddd3] pt-4 mt-1 items-center">
                <button
                  onClick={handleNextStep}
                  className="flex-1 h-11 rounded-md border border-[#0f766e] text-[#0f766e] font-bold text-sm hover:bg-[#edf4ef] flex items-center justify-center gap-1.5"
                >
                  Bỏ qua & Đợi (HOLD) <ArrowRight className="h-4 w-4" />
                </button>
                
                <button
                  onClick={() => setIsPlayingAuto(!isPlayingAuto)}
                  className={`h-11 px-4 rounded-md font-bold text-sm flex items-center justify-center gap-1.5 ${
                    isPlayingAuto 
                      ? "bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200" 
                      : "bg-[#edf4ef] text-[#0f766e] border border-[#0f766e] hover:bg-[#dcfce7]"
                  }`}
                >
                  {isPlayingAuto ? (
                    <>
                      <Pause className="h-4 w-4 shrink-0" /> Tạm dừng chạy
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 shrink-0" /> Tự động chạy
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Account Balance & Live Diagnostics */}
          <div className="flex flex-col gap-4">
            {/* Account Card */}
            <div className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
              <h3 className="font-bold text-[#17201b] mb-4 flex items-center gap-1.5 text-base">
                <Coins className="h-5 w-5 text-yellow-500" /> Tài sản ảo của bạn
              </h3>

              <div className="grid gap-3.5">
                <div className="p-3 bg-[#f8fbf7] border border-[#edf0eb] rounded-md flex justify-between items-center">
                  <span className="text-xs font-semibold text-[#5b6861]">Tổng giá trị tài sản ảo:</span>
                  <span className="font-mono font-black text-lg text-[#0f766e]">
                    {formatCurrency(currentPortfolioValue)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs leading-5">
                  <div className="p-3 border border-[#edf0eb] rounded-md">
                    <p className="font-semibold text-[#5b6861]">Tiền mặt ảo:</p>
                    <p className="font-mono font-bold text-[#17201b] mt-1">{formatCurrency(cash)}</p>
                    <div className="w-full bg-[#f1f5f9] h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-amber-500 h-full" style={{ width: `${cashPercent}%` }} />
                    </div>
                    <span className="text-[10px] text-[#8e9d94] mt-1 inline-block">{cashPercent.toFixed(0)}% danh mục</span>
                  </div>

                  <div className="p-3 border border-[#edf0eb] rounded-md">
                    <p className="font-semibold text-[#5b6861]">Giá trị cổ phiếu ảo:</p>
                    <p className="font-mono font-bold text-[#17201b] mt-1">{formatCurrency(shares * currentPrice)}</p>
                    <div className="w-full bg-[#f1f5f9] h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-emerald-600 h-full" style={{ width: `${sharesPercent}%` }} />
                    </div>
                    <span className="text-[10px] text-[#8e9d94] mt-1 inline-block">{sharesPercent.toFixed(0)}% danh mục</span>
                  </div>
                </div>

                <div className="border-t border-[#edf0eb] pt-3 text-xs flex justify-between">
                  <span className="text-[#5b6861]">Số lượng cổ phiếu ảo giữ:</span>
                  <span className="font-mono font-bold text-[#17201b]">{Math.round(shares).toLocaleString("vi-VN")} cổ phiếu</span>
                </div>
              </div>
            </div>

            {/* Benchmark Card */}
            <div className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
              <h3 className="font-bold text-[#17201b] mb-4 flex items-center gap-1.5 text-base">
                <Scale className="h-5 w-5 text-blue-500" /> So sánh với điểm chuẩn (Benchmark)
              </h3>

              <div className="grid gap-3">
                <div className="flex justify-between items-center text-sm border-b border-[#edf0eb] pb-2">
                  <span className="text-[#5b6861]">Mua & Nắm giữ dài hạn:</span>
                  <span className="font-mono font-bold text-blue-600">
                    {formatCurrency(buyAndHoldValue)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm border-b border-[#edf0eb] pb-2">
                  <span className="text-[#5b6861]">Chênh lệch hiệu quả:</span>
                  <span className={`font-mono font-bold ${
                    currentPortfolioValue >= buyAndHoldValue ? "text-green-600" : "text-red-600"
                  }`}>
                    {currentPortfolioValue >= buyAndHoldValue ? "+" : ""}
                    {formatPercent(((currentPortfolioValue - buyAndHoldValue) / buyAndHoldValue) * 100)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#5b6861]">Phí giao dịch ảo đã trả:</span>
                  <span className="font-mono font-bold text-amber-700">
                    -{formatCurrency(totalFeesPaid)} ({totalTrades} giao dịch)
                  </span>
                </div>
              </div>
            </div>

            {/* Trade Log */}
            <div className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm flex-1 flex flex-col min-h-60 max-h-80">
              <h3 className="font-bold text-[#17201b] mb-3 text-sm">Nhật ký lệnh ảo phiên này</h3>
              <div className="overflow-y-auto flex-1 text-xs">
                {tradeHistory.length === 0 ? (
                  <p className="text-[#8e9d94] italic text-center py-8">Chưa có giao dịch nào được thực hiện.</p>
                ) : (
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-[#edf0eb] text-[#8e9d94] pb-2">
                        <th className="pb-1.5">Bước</th>
                        <th className="pb-1.5">Lệnh</th>
                        <th className="pb-1.5 text-right">Giá</th>
                        <th className="pb-1.5 text-right">Giá trị</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tradeHistory.map((trade, idx) => (
                        <tr key={idx} className="border-b border-[#fafbfa] last:border-0">
                          <td className="py-2 text-[#5b6861]">#{trade.step + 1}</td>
                          <td className="py-2">
                            <span className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${
                              trade.type === "BUY" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}>
                              {trade.type === "BUY" ? "MUA" : "BÁN"}
                            </span>
                          </td>
                          <td className="py-2 text-right font-mono">{trade.price}</td>
                          <td className="py-2 text-right font-mono text-[#5b6861]">{formatCurrency(trade.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {gameState === "gameover" && (
        <div className="max-w-2xl mx-auto py-6">
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#edf6ed] text-green-700 mb-3">
              <CheckCircle className="h-3.5 w-3.5" /> HOÀN THÀNH THỬ THÁCH
            </span>
            <h1 className="text-3xl font-extrabold text-[#17201b]">Kết quả Timing Thị Trường</h1>
            <p className="text-sm text-[#5b6861] mt-1">
              Bạn đã kết thúc 10 năm ảo (30 bước). Dưới đây là hiệu quả ra quyết định của bạn.
            </p>
          </div>

          {/* Results Comparison Cards */}
          <div className="grid gap-4 sm:grid-cols-2 mb-6">
            <div className="p-4 rounded-md border border-[#e0e5dc] bg-[#f8fbf7] text-center">
              <p className="text-xs font-bold text-[#5b6861] uppercase">Tài sản của bạn (Canh thời điểm)</p>
              <p className="text-2xl font-black text-[#0f766e] mt-1 font-mono">
                {formatCurrency(currentPortfolioValue)}
              </p>
              <p className={`text-xs font-bold mt-1 ${
                currentPortfolioValue >= 100000000 ? "text-green-600" : "text-red-600"
              }`}>
                {currentPortfolioValue >= 100000000 ? "Lãi" : "Lỗ"} {formatPercent(((currentPortfolioValue - 100000000) / 100000000) * 100)}
              </p>
            </div>

            <div className="p-4 rounded-md border border-[#e0e5dc] bg-[#f0f4f8] text-center">
              <p className="text-xs font-bold text-[#5b6861] uppercase">Tài sản Benchmark (Buy & Hold)</p>
              <p className="text-2xl font-black text-blue-800 mt-1 font-mono">
                {formatCurrency(buyAndHoldValue)}
              </p>
              <p className="text-xs font-bold mt-1 text-blue-600">
                Lãi {formatPercent(((buyAndHoldValue - 100000000) / 100000000) * 100)}
              </p>
            </div>
          </div>

          {/* Summary / Performance text */}
          <div className="p-5 rounded-md border border-[#d9ddd3] bg-[#fdfbf7] mb-6">
            <div className="flex gap-4 items-start">
              <div className="shrink-0 mt-1">
                {diagnosis?.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-[#17201b] text-lg">{diagnosis?.title}</h3>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${diagnosis?.badgeColor}`}>
                    Chẩn đoán
                  </span>
                </div>
                <p className="text-sm text-[#4a5a52] mt-2 leading-6">
                  {diagnosis?.desc}
                </p>
              </div>
            </div>
            
            <div className="border-t border-[#edf0eb] pt-4 mt-4 grid gap-3 text-xs leading-5 text-[#5b6861]">
              <div className="flex justify-between">
                <span>Tổng số giao dịch thực hiện:</span>
                <span className="font-bold text-[#17201b]">{totalTrades} lệnh ảo</span>
              </div>
              <div className="flex justify-between">
                <span>Tổng phí giao dịch đã trả:</span>
                <span className="font-bold text-red-700 font-mono">-{formatCurrency(totalFeesPaid)}</span>
              </div>
              <div className="flex justify-between">
                <span>So với nắm giữ thụ động:</span>
                <span className={`font-bold ${
                  currentPortfolioValue >= buyAndHoldValue ? "text-green-700" : "text-red-700"
                }`}>
                  {currentPortfolioValue >= buyAndHoldValue ? "Vượt trội" : "Kém hiệu quả"} {formatPercent(Math.abs(((currentPortfolioValue - buyAndHoldValue) / buyAndHoldValue) * 100))}
                </span>
              </div>
            </div>
          </div>

          {/* Educational Action Plan */}
          <div className="p-5 rounded-md border border-[#e2d3a7] bg-[#fff8df] mb-6">
            <h3 className="font-bold text-[#5b420b] flex items-center gap-1.5">
              <BookOpen className="h-4.5 w-4.5 text-[#7a4d00]" />
              Bài học rút ra từ thử thách:
            </h3>
            <p className="mt-2 text-xs leading-5 text-[#7a4d00]">
              Thị trường luôn đầy rẫy thông tin nhiễu từ các hội nhóm và bài báo kích thích cảm xúc hưng phấn/sợ hãi. 
              Việc cố gắng canh thời điểm (timing) thường dẫn đến mua đỉnh, bán đáy và tốn phí giao dịch khổng lồ ngoài đời thực. 
              Giải pháp bền vững nhất cho người mới là tích lũy đều đặn (DCA) và thiết lập một quỹ dự phòng vững chắc trước khi giải ngân.
            </p>
            
            {diagnosis?.linkModule && (
              <div className="mt-4 border-t border-[#ebd8ab] pt-3.5">
                <p className="text-xs font-bold text-[#7a4d00]">Bài học đề xuất dựa trên hành vi giao dịch:</p>
                <Link
                  href={`/knowledge/${diagnosis.linkPillar}/${diagnosis.linkModule.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}`}
                  className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-[#0f766e] hover:underline"
                >
                  Học chuyên đề: {diagnosis.linkModule}
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => setGameState("welcome")}
              className="flex-1 h-11 rounded-md border border-[#d9ddd3] text-[#4a5a52] font-bold text-sm hover:bg-gray-50 flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="h-4 w-4" /> Chọn kịch bản khác
            </button>
            
            <button
              onClick={() => handleStartGame(selectedScenarioId)}
              className="flex-1 h-11 rounded-md bg-[#0f766e] text-white font-bold text-sm hover:bg-[#115e59] flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="h-4 w-4" /> Chơi lại kịch bản này
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
