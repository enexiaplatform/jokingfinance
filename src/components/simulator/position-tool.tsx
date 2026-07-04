"use client";

import { useState, useMemo } from "react";
import { formatPoints } from "@/lib/format";
import {
  Calculator,
  ShieldAlert,
  Sparkles,
  ChevronRight,
  AlertCircle,
  BookOpen,
  Zap,
  Target
} from "lucide-react";
import Link from "next/link";
import { useVirtualPortfolio } from "./use-virtual-portfolio";
import type { Stock } from "@/lib/market-data/types";

type PositionToolProps = {
  stocks: Stock[];
};

export function PositionTool({ stocks }: PositionToolProps) {
  const { summary } = useVirtualPortfolio();

  // Get active capital (default to virtual portfolio value or 100M)
  const portfolioValue = useMemo(() => {
    return summary?.portfolioValue || 100000000;
  }, [summary]);

  // Inputs
  const [selectedTicker, setSelectedTicker] = useState("FPT");
  const [capital, setCapital] = useState<number>(portfolioValue);
  const [riskPercent, setRiskPercent] = useState<number>(1); // Default risk 1% of portfolio
  const [entryPrice, setEntryPrice] = useState<number>(130000);
  const [stopLossPrice, setStopLossPrice] = useState<number>(120900); // Default -7%
  const [takeProfitPrice, setTakeProfitPrice] = useState<number>(149500); // Default +15%
  const [customThesis, setCustomThesis] = useState("");

  const selectedStock = useMemo(() => {
    return stocks.find((s) => s.ticker === selectedTicker) || stocks[0];
  }, [stocks, selectedTicker]);

  const [prevSelectedTicker, setPrevSelectedTicker] = useState(selectedTicker);
  const [prevStocksLength, setPrevStocksLength] = useState(stocks.length);
  const [prevPortfolioValue, setPrevPortfolioValue] = useState(portfolioValue);

  if (selectedTicker !== prevSelectedTicker || stocks.length !== prevStocksLength) {
    setPrevSelectedTicker(selectedTicker);
    setPrevStocksLength(stocks.length);
    if (selectedStock) {
      const price = selectedStock.currentPrice;
      setEntryPrice(price);
      setStopLossPrice(Math.round(price * 0.93)); // -7%
      setTakeProfitPrice(Math.round(price * 1.15)); // +15%
    }
  }

  if (portfolioValue !== prevPortfolioValue) {
    setPrevPortfolioValue(portfolioValue);
    if (portfolioValue && portfolioValue > 0) {
      setCapital(portfolioValue);
    }
  }

  // Calculations & Validation
  const validationError = useMemo(() => {
    if (capital <= 0) return "Tổng vốn đầu tư phải lớn hơn 0.";
    if (riskPercent <= 0 || riskPercent > 100) return "Tỷ lệ rủi ro phải từ 0.1% đến 100%.";
    if (entryPrice <= 0) return "Giá mua dự kiến phải lớn hơn 0.";
    if (stopLossPrice <= 0) return "Giá cắt lỗ phải lớn hơn 0.";
    if (takeProfitPrice <= 0) return "Giá chốt lời phải lớn hơn 0.";
    if (stopLossPrice >= entryPrice) return "⚠️ Giá cắt lỗ phải thấp hơn giá mua dự kiến (khi mua cổ phiếu).";
    if (takeProfitPrice <= entryPrice) return "⚠️ Giá chốt lời phải cao hơn giá mua dự kiến (khi mua cổ phiếu).";
    return null;
  }, [capital, riskPercent, entryPrice, stopLossPrice, takeProfitPrice]);

  const stats = useMemo(() => {
    if (validationError) return null;

    const stopLossDiff = entryPrice - stopLossPrice;
    const stopLossPct = (stopLossDiff / entryPrice) * 100;

    const takeProfitDiff = takeProfitPrice - entryPrice;
    const takeProfitPct = (takeProfitDiff / entryPrice) * 100;

    const rrr = stopLossDiff > 0 ? takeProfitDiff / stopLossDiff : 0;

    // Position sizing logic:
    // Max loss = Capital * (RiskPercent / 100)
    // Recommended Quantity = Max loss / (Entry - StopLoss)
    const maxLossAmount = capital * (riskPercent / 100);
    const recommendedQty = Math.floor(maxLossAmount / stopLossDiff);
    const totalTradeValue = recommendedQty * entryPrice;
    const weightPercent = (totalTradeValue / capital) * 100;

    return {
      stopLossDiff,
      stopLossPct,
      takeProfitDiff,
      takeProfitPct,
      rrr,
      maxLossAmount,
      recommendedQty,
      totalTradeValue,
      weightPercent,
    };
  }, [capital, riskPercent, entryPrice, stopLossPrice, takeProfitPrice, validationError]);

  // RRR diagnosis
  const rrrDiagnosis = useMemo(() => {
    if (!stats) return null;
    const { rrr } = stats;

    if (rrr >= 2.5) {
      return {
        label: "Lý tưởng (Tiêu chuẩn vàng) 🏆",
        color: "text-[#166534] bg-[#edf6ed] border-[#b9d9c5]",
        desc: "Kỳ vọng lợi nhuận lớn gấp 2.5 lần rủi ro. Đây là giao dịch có lợi thế toán học cao, cho phép bạn sai nhiều lần vẫn giữ được lợi nhuận dài hạn.",
      };
    } else if (rrr >= 1.8) {
      return {
        label: "Khá tốt (Đạt chuẩn) ✅",
        color: "text-[#15803d] bg-[#f0fdf4] border-[#dcfce7]",
        desc: "Tỷ lệ Lợi nhuận/Rủi ro tốt. Lợi thế giao dịch ở mức chấp nhận được và đáp ứng được các tiêu chuẩn quản trị rủi ro thông thường.",
      };
    } else if (rrr >= 1.2) {
      return {
        label: "Cần cân nhắc ⚖️",
        color: "text-[#b45309] bg-[#fffbeb] border-[#fef3c7]",
        desc: "Tỷ lệ Lợi nhuận/Rủi ro thấp. Lợi nhuận mang lại không tương xứng nhiều với rủi ro gánh chịu. Nên xem xét dời chốt lời rộng hơn hoặc siết cắt lỗ chặt hơn nếu có cơ sở kỹ thuật.",
      };
    } else {
      return {
        label: "Rất rủi ro (Tỷ lệ xấu) ⚠️",
        color: "text-[#b91c1c] bg-[#fef2f2] border-[#fee2e2]",
        desc: "Lợi nhuận kỳ vọng quá bé so với rủi ro. Bạn đang mạo hiểm nhiều tiền chỉ để đổi lấy một khoản lời nhỏ. Đây là bẫy giao dịch cảm xúc, khuyên bạn bỏ qua lệnh này.",
      };
    }
  }, [stats]);

  // Consecutive losses calculation
  const consecutiveLosses = useMemo(() => {
    if (validationError) return [];
    const list = [];
    let currentCapital = capital;
    const rate = riskPercent / 100;

    for (let i = 1; i <= 10; i++) {
      currentCapital = currentCapital * (1 - rate);
      list.push({
        num: i,
        val: currentCapital,
        lostPct: ((capital - currentCapital) / capital) * 100,
      });
    }
    return list;
  }, [capital, riskPercent, validationError]);

  const generatedThesis = useMemo(() => {
    if (!stats || !selectedStock) return "";
    const thesisText = `GIAO DỊCH QUẢN TRỊ RỦI RO [${selectedStock.ticker}]
- Điểm mua dự kiến: ${entryPrice.toLocaleString("vi-VN")} điểm
- Điểm cắt lỗ (Stop Loss): ${stopLossPrice.toLocaleString("vi-VN")} điểm (-${stats.stopLossPct.toFixed(1)}%)
- Điểm chốt lời (Take Profit): ${takeProfitPrice.toLocaleString("vi-VN")} điểm (+${stats.takeProfitPct.toFixed(1)}%)
- Tỷ lệ Lợi nhuận / Rủi ro (RRR): ${stats.rrr.toFixed(2)}
- Khối lượng đi lệnh đề xuất: ${stats.recommendedQty.toLocaleString("vi-VN")} cổ phiếu (Phân bổ ${stats.weightPercent.toFixed(1)}% vốn)
- Luận điểm: ${customThesis || "Mua dựa trên phân tích RRR và tỷ lệ phân bổ vốn kỷ luật."}`;

    return thesisText;
  }, [selectedStock, entryPrice, stopLossPrice, takeProfitPrice, stats, customThesis]);

  const generatedRiskNote = useMemo(() => {
    if (!stats) return "";
    return `Nếu giá chạm vùng ${stopLossPrice.toLocaleString("vi-VN")} điểm, tôi sẽ thực hiện cắt lỗ để bảo vệ vốn. Khoản lỗ tối đa ước tính là ${stats.maxLossAmount.toLocaleString("vi-VN")} điểm ảo (-${riskPercent}% tổng tài sản).`;
  }, [stopLossPrice, stats, riskPercent]);

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      {/* Left Column: Inputs */}
      <div className="flex flex-col gap-5">
        <section className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-[#17201b] mb-4 flex items-center gap-2">
            <Calculator className="h-5 w-5 text-[#0f766e]" />
            1. Thiết lập Vị thế & Thông số Giao dịch
          </h2>

          <div className="grid gap-4">
            {/* Select Stock */}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5 text-xs font-bold uppercase text-[#5b6861]">
                Chọn cổ phiếu dự kiến mua
                <select
                  value={selectedTicker}
                  onChange={(e) => setSelectedTicker(e.target.value)}
                  className="h-11 mt-1 rounded-md border border-[#d9ddd3] bg-white px-3 font-semibold text-sm text-[#17201b]"
                >
                  {stocks.map((stock) => (
                    <option key={stock.ticker} value={stock.ticker}>
                      {stock.ticker} - {stock.companyName} ({formatPoints(stock.currentPrice)})
                    </option>
                  ))}
                </select>
              </label>

              {/* Account Capital */}
              <label className="grid gap-1.5 text-xs font-bold uppercase text-[#5b6861]">
                Tổng vốn đầu tư ảo (VND / Điểm)
                <input
                  type="number"
                  min={1000000}
                  step={1000000}
                  value={capital}
                  onChange={(e) => setCapital(Math.max(1, Number(e.target.value)))}
                  className="h-11 mt-1 rounded-md border border-[#d9ddd3] px-3 font-semibold text-sm text-[#17201b]"
                />
              </label>
            </div>

            {/* Risk limit per trade */}
            <div className="border-t border-[#edf0eb] pt-4">
              <div className="flex justify-between items-center text-sm font-semibold text-[#314039]">
                <span>Mức rủi ro tối đa cho mỗi giao dịch (% vốn)</span>
                <span className="font-mono text-[#0f766e] font-bold">{riskPercent}% vốn</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={5}
                step={0.1}
                value={riskPercent}
                onChange={(e) => setRiskPercent(Number(e.target.value))}
                className="w-full mt-2 accent-[#0f766e]"
              />
              <p className="text-[11px] text-[#66736c] leading-4 mt-1.5">
                💡 <b>Mẹo quản trị:</b> Các nhà giao dịch chuyên nghiệp khuyên bạn chỉ nên rủi ro từ <b>1% - 2%</b> tổng vốn của mình cho mỗi lệnh mua đơn lẻ. Nếu lệnh sai, bạn vẫn còn 98% vốn để sửa sai ở các lệnh tiếp theo.
              </p>
            </div>

            {/* Entry, Stop Loss, Take Profit */}
            <div className="border-t border-[#edf0eb] pt-4 grid gap-4 sm:grid-cols-3">
              <label className="grid gap-1.5 text-xs font-bold uppercase text-[#5b6861]">
                Giá mua dự kiến (VND)
                <input
                  type="number"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(Math.max(0, Number(e.target.value)))}
                  className="h-11 mt-1 rounded-md border border-[#d9ddd3] px-3 font-mono font-semibold text-sm text-[#17201b]"
                />
              </label>

              <label className="grid gap-1.5 text-xs font-bold uppercase text-[#991b1b]">
                Giá cắt lỗ (Stop Loss)
                <input
                  type="number"
                  value={stopLossPrice}
                  onChange={(e) => setStopLossPrice(Math.max(0, Number(e.target.value)))}
                  className="h-11 mt-1 rounded-md border border-[#f1bea8] bg-[#fffbfb] px-3 font-mono font-semibold text-sm text-[#991b1b]"
                />
                {stats && (
                  <span className="text-[10px] text-[#991b1b] mt-1 font-bold">
                    Lỗ: -{stats.stopLossPct.toFixed(1)}%
                  </span>
                )}
              </label>

              <label className="grid gap-1.5 text-xs font-bold uppercase text-[#166534]">
                Giá chốt lời (Take Profit)
                <input
                  type="number"
                  value={takeProfitPrice}
                  onChange={(e) => setTakeProfitPrice(Math.max(0, Number(e.target.value)))}
                  className="h-11 mt-1 rounded-md border border-[#b9d9c5] bg-[#fbfdfb] px-3 font-mono font-semibold text-sm text-[#166534]"
                />
                {stats && (
                  <span className="text-[10px] text-[#166534] mt-1 font-bold">
                    Lời: +{stats.takeProfitPct.toFixed(1)}%
                  </span>
                )}
              </label>
            </div>
          </div>
        </section>

        {/* Written Thesis */}
        <section className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
          <h3 className="font-bold text-[#17201b] mb-4">Ghi chép Luận điểm giao dịch</h3>
          <label className="grid gap-2 text-sm font-semibold text-[#314039]">
            Luận điểm cốt lõi của lệnh (Ví dụ: Định giá rẻ, ngành đang hồi phục, tăng trưởng doanh thu...)
            <textarea
              value={customThesis}
              onChange={(e) => setCustomThesis(e.target.value)}
              rows={3}
              className="rounded-md border border-[#d9ddd3] px-3 py-2 text-sm"
              placeholder="Ví dụ: Cổ phiếu FPT tích lũy nền giá tốt, dự báo quý này lợi nhuận tăng trưởng 20% nhờ mảng xuất khẩu phần mềm phát triển mạnh."
            />
          </label>
        </section>

        {/* Worst case visualization */}
        {!validationError && (
          <section className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
            <h3 className="font-bold text-[#17201b] mb-2.5 flex items-center gap-1.5">
              <ShieldAlert className="h-5 w-5 text-[#991b1b]" />
              Kịch bản 10 Lệnh thua liên tiếp (Worst-case Scenario)
            </h3>
            <p className="text-xs text-[#5b6861] leading-5 mb-4">
              Nếu bạn liên tục gặp chuỗi xui xẻo mất 10 lệnh liên tiếp, với cơ chế quản trị rủi ro giới hạn <b>{riskPercent}%</b> vốn mỗi lệnh, số tiền của bạn sẽ suy giảm như thế nào?
            </p>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {consecutiveLosses.slice(0, 10).map((item) => (
                <div
                  key={item.num}
                  className={`p-2.5 border rounded-md text-center transition-all ${
                    item.num <= 3
                      ? "border-[#e0e5dc] bg-[#fcfcfc]"
                      : item.num <= 7
                        ? "border-[#f1bea8] bg-[#fffdfb]"
                        : "border-[#fecaca] bg-[#fff5f5]"
                  }`}
                >
                  <p className="text-[10px] font-bold text-[#66736c] uppercase">Lệnh sai #{item.num}</p>
                  <p className="text-xs font-mono font-bold mt-1 text-[#314039]">
                    {Math.round(item.val).toLocaleString("vi-VN")}
                  </p>
                  <p className="text-[9px] font-bold text-[#991b1b] mt-0.5">
                    -{item.lostPct.toFixed(1)}%
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-[#edf5ee] border border-[#d2dfd5] text-[#166534] rounded-md text-xs leading-5">
              💡 <b>Bài học quý giá:</b> Nhờ quản trị vị thế, dù sai tới 10 lệnh liên tiếp (điều hiếm khi xảy ra nếu bạn phân tích kỹ), tài khoản của bạn vẫn còn giữ lại được <b>{consecutiveLosses[9]?.val ? Math.round(consecutiveLosses[9].val).toLocaleString("vi-VN") : "0"} điểm</b> (chỉ hao hụt <b>{consecutiveLosses[9]?.lostPct.toFixed(1)}%</b> vốn). 
              Đây chính là lý do vì sao quản trị vị thế là cái khiên chắc chắn nhất giúp bạn sống sót dài lâu trên thị trường!
            </div>
          </section>
        )}
      </div>

      {/* Right Column: Results & Diagnostics */}
      <div className="flex flex-col gap-5 xl:sticky xl:top-6 self-start">
        {validationError ? (
          <section className="rounded-md border border-[#fecaca] bg-[#fff5f5] p-5 text-sm text-[#991b1b]">
            <h3 className="font-bold flex items-center gap-1.5 mb-2">
              <AlertCircle className="h-5 w-5 shrink-0" />
              Lỗi nhập liệu thông số
            </h3>
            <p className="leading-6">{validationError}</p>
          </section>
        ) : stats ? (
          <>
            {/* RRR Diagnostic Card */}
            <section className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
              <h2 className="text-xl font-bold text-[#17201b] mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-[#0f766e]" />
                Tỷ lệ Lợi nhuận / Rủi ro (RRR)
              </h2>

              <div className="flex justify-between items-end border-b border-[#edf0eb] pb-4 mb-4">
                <div>
                  <p className="text-xs font-bold text-[#66736c] uppercase">Tỷ lệ RRR đạt được</p>
                  <p className="text-4xl font-black text-[#17201b] mt-1 font-mono">
                    {stats.rrr.toFixed(2)}
                  </p>
                </div>
                <div className={`px-3 py-1.5 rounded-full border text-xs font-bold ${rrrDiagnosis?.color}`}>
                  {rrrDiagnosis?.label}
                </div>
              </div>

              {/* Visual representation of Risk vs Reward */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-bold text-[#b91c1c] mb-1">
                    <span>Mức cắt lỗ dự kiến (Khoảng lỗ):</span>
                    <span>-{stats.stopLossPct.toFixed(1)}% ({formatPoints(stats.stopLossDiff)} / cổ phiếu)</span>
                  </div>
                  <div className="h-2 bg-[#fee2e2] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#ef4444]"
                      style={{ width: `${Math.min(100, stats.stopLossPct * 4)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-[#166534] mb-1">
                    <span>Mục tiêu chốt lời (Khoảng lãi):</span>
                    <span>+{stats.takeProfitPct.toFixed(1)}% ({formatPoints(stats.takeProfitDiff)} / cổ phiếu)</span>
                  </div>
                  <div className="h-2 bg-[#dcfce7] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#22c55e]"
                      style={{ width: `${Math.min(100, stats.takeProfitPct * 2)}%` }}
                    />
                  </div>
                </div>
              </div>

              <p className="text-xs leading-5 text-[#4a5a52] mt-4 border-t border-[#edf0eb] pt-3">
                {rrrDiagnosis?.desc}
              </p>
            </section>

            {/* Position Size Results */}
            <section className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
              <h2 className="text-xl font-bold text-[#17201b] mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                Quy mô đi lệnh đề xuất
              </h2>

              <div className="grid gap-4">
                <div className="p-4 bg-[#f8fbf7] border border-[#edf0eb] rounded-md">
                  <p className="text-xs font-bold text-[#66736c] uppercase">Số lượng cổ phiếu khuyên mua</p>
                  <p className="text-3xl font-black text-[#0f766e] mt-1 font-mono">
                    {stats.recommendedQty.toLocaleString("vi-VN")} <span className="text-sm font-bold text-[#4a5a52]">cổ phiếu</span>
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 text-sm">
                  <div className="p-3 bg-[#fbfdfb] border border-[#e6f4ea] rounded-md">
                    <p className="text-[11px] font-bold text-[#66736c] uppercase">Tổng vốn giải ngân</p>
                    <p className="text-base font-bold text-[#17201b] mt-0.5 font-mono">
                      {stats.totalTradeValue.toLocaleString("vi-VN")} đ
                    </p>
                    <p className="text-[10px] font-bold text-[#166534] mt-0.5">
                      Chiếm {stats.weightPercent.toFixed(1)}% tài sản
                    </p>
                  </div>

                  <div className="p-3 bg-[#fffbfb] border border-[#fce8e6] rounded-md">
                    <p className="text-[11px] font-bold text-[#66736c] uppercase">Tiền mất tối đa (nếu cắt lỗ)</p>
                    <p className="text-base font-bold text-[#991b1b] mt-0.5 font-mono">
                      -{stats.maxLossAmount.toLocaleString("vi-VN")} đ
                    </p>
                    <p className="text-[10px] font-bold text-[#991b1b] mt-0.5">
                      Bằng đúng {riskPercent}% tổng tài sản
                    </p>
                  </div>
                </div>

                {/* Capital Warning Alert */}
                {stats.totalTradeValue > capital && (
                  <div className="p-3 bg-[#fff0e8] border border-[#f1bea8] text-[#9a3412] rounded-md text-xs flex items-start gap-2">
                    <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                    <span>
                      ⚠️ <b>Sức mua không đủ!</b> Số vốn giải ngân cần thiết ({stats.totalTradeValue.toLocaleString("vi-VN")} đ) lớn hơn tổng vốn của bạn. Hãy giảm tỷ lệ rủi ro của lệnh xuống hoặc siết lại khoảng cắt lỗ hẹp hơn.
                    </span>
                  </div>
                )}

                {stats.weightPercent > 30 && (
                  <div className="p-3 bg-[#fff7d6] border border-[#e8d59b] text-[#7a4d00] rounded-md text-xs flex items-start gap-2">
                    <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                    <span>
                      ⚠️ <b>Tập trung vốn cao!</b> Vị thế này chiếm <b>{stats.weightPercent.toFixed(1)}%</b> tổng tài sản của bạn. Luật chơi JokingFinance khuyên bạn không nên dồn quá 20-30% tài sản vào một cổ phiếu đơn lẻ để hạn chế rủi ro hệ thống.
                    </span>
                  </div>
                )}

                {stats.recommendedQty === 0 && (
                  <div className="p-3 bg-[#fef2f2] border border-[#fee2e2] text-[#991b1b] rounded-md text-xs flex items-start gap-2">
                    <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                    <span>
                      Vốn của bạn quá nhỏ so với chênh lệch cắt lỗ hoặc giá cổ phiếu này. Bạn không thể mua dù chỉ 1 cổ phiếu để đảm bảo mức rủi ro mong muốn.
                    </span>
                  </div>
                )}

                {stats.recommendedQty > 0 && stats.totalTradeValue <= capital && (
                  <div className="mt-2 flex flex-col gap-2">
                    <Link
                      href={`/app/simulator?side=buy&ticker=${selectedTicker}&quantity=${stats.recommendedQty}&thesis=${encodeURIComponent(generatedThesis)}&riskNote=${encodeURIComponent(generatedRiskNote)}`}
                      className="min-h-11 rounded-md bg-[#0f766e] text-white flex items-center justify-center gap-2 text-sm font-bold hover:bg-[#115e59]"
                    >
                      <Zap className="h-4 w-4 fill-current text-yellow-400" />
                      Đi lệnh mô phỏng với thông số này
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                    <p className="text-[10px] text-[#66736c] text-center">
                      Nút này sẽ tự động chuyển hướng bạn tới bảng đặt lệnh ảo, tự động điền sẵn mã, số lượng và các lưu ý cắt lỗ chốt lời kỷ luật.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </>
        ) : null}

        {/* Read more articles */}
        <section className="rounded-md border border-[#e0e5dc] bg-[#fdfbf7] p-5">
          <h3 className="font-bold text-[#17201b] flex items-center gap-1">
            <BookOpen className="h-4 w-4 text-[#0f766e]" />
            Bài viết kiến thức đề xuất:
          </h3>
          <ul className="mt-3 grid gap-2 text-sm">
            <li>
              <Link
                href="/articles/quan-tri-rui-ro-va-ty-le-rrr-trong-dau-tu"
                className="text-[#0f766e] hover:underline flex items-center gap-1 font-semibold"
              >
                <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                Quy tắc quy mô vị thế & Tỷ lệ RRR (Chặng 4)
              </Link>
            </li>
            <li>
              <Link
                href="/knowledge/quan-tri-rui-ro/cac-loai-rui-ro"
                className="text-[#0f766e] hover:underline flex items-center gap-1 font-semibold"
              >
                <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                Quản trị rủi ro & Cách xác định Stop Loss
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
