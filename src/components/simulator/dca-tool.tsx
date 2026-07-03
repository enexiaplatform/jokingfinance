"use client";

import { useState, useMemo } from "react";
import { formatCurrency, formatPercent, formatNumber } from "@/lib/format";
import {
  Coins,
  TrendingUp,
  TrendingDown,
  Info,
  Calendar,
  ArrowRight,
  BookOpen,
  Sparkles,
  AlertTriangle,
  ChevronRight,
  HelpCircle,
  FileCheck2
} from "lucide-react";
import Link from "next/link";
import { mockStocks } from "@/lib/market-data/mockProvider";

type MarketScenario = "growth" | "cyclical" | "recovery" | "bubble" | "flat";

const SCENARIOS = [
  {
    value: "growth",
    label: "Tăng trưởng dài hạn",
    desc: "Giá đi lên vững chắc theo đà kinh doanh phát triển (như FPT, FRT). Phù hợp tích sản."
  },
  {
    value: "cyclical",
    label: "Biến động chu kỳ",
    desc: "Giá có các chu kỳ tăng vọt rồi rơi sâu theo giá cả hàng hóa (như HPG). Phù hợp kiểm định tâm lý."
  },
  {
    value: "recovery",
    label: "Suy thoái rồi phục hồi (U-Shape)",
    desc: "Giá giảm sâu 40-50% ở nửa đầu chu kỳ rồi phục hồi về đỉnh cũ ở cuối chu kỳ. Nơi DCA phát huy sức mạnh cao nhất."
  },
  {
    value: "bubble",
    label: "Bong bóng rồi vỡ (A-Shape)",
    desc: "Giá tăng nóng gấp đôi trong cơn sốt đầu cơ rồi rơi tự do về vạch xuất phát. Nơi Lump Sum chịu rủi ro cực lớn."
  },
  {
    value: "flat",
    label: "Đi ngang tích lũy (Sideways)",
    desc: "Giá biến động hẹp quanh mức giá trị hợp lý (như VNM). Nơi tích lũy cổ tức và số lượng cổ phiếu."
  }
];

export function DcaTool() {
  const [selectedTicker, setSelectedTicker] = useState("FPT");
  const [monthlyContribution, setMonthlyContribution] = useState(3000000); // 3 million VND default
  const [years, setYears] = useState(3); // 3 years default
  const [scenario, setScenario] = useState<MarketScenario>("recovery"); // Recovery default to highlight DCA strength

  const selectedStock = useMemo(() => {
    return mockStocks.find((s) => s.ticker === selectedTicker) || mockStocks[0];
  }, [selectedTicker]);

  const totalMonths = useMemo(() => {
    return years * 12;
  }, [years]);

  const totalInvested = useMemo(() => {
    return monthlyContribution * totalMonths;
  }, [monthlyContribution, totalMonths]);

  // Deterministic price path generator based on stock ticker, scenario, duration, and currentPrice
  const pricePath = useMemo(() => {
    const months = totalMonths;
    const finalPrice = selectedStock.currentPrice;
    const path: number[] = [];

    // Simple deterministic pseudo-random noise generator to keep charts consistent
    const getNoise = (t: number) => {
      const code = selectedStock.ticker.charCodeAt(0) + selectedStock.ticker.charCodeAt(1);
      return Math.sin(t * 1.5 + code) * 0.08 + Math.cos(t * 0.7 - code) * 0.04;
    };

    switch (scenario) {
      case "growth": {
        // Starts low, grows steadily at ~18% per year
        const monthlyGrowth = 0.014; // ~18% annual compound
        const startPrice = finalPrice / Math.pow(1 + monthlyGrowth, months);
        for (let t = 0; t < months; t++) {
          const trendPrice = startPrice * Math.pow(1 + monthlyGrowth, t);
          const noise = 1 + getNoise(t);
          // Force final month to equal finalPrice
          const price = t === months - 1 ? finalPrice : trendPrice * noise;
          path.push(Math.round(Math.max(1000, price)));
        }
        break;
      }
      case "cyclical": {
        // Has a big cycle (ups and downs)
        const period = months / 1.5; // 1.5 complete cycles
        for (let t = 0; t < months; t++) {
          const cycleMultiplier = 1 + 0.35 * Math.sin((t / period) * 2 * Math.PI);
          const noise = 1 + getNoise(t) * 0.5;
          const trendPrice = finalPrice * 0.9;
          const price = t === months - 1 ? finalPrice : trendPrice * cycleMultiplier * noise;
          path.push(Math.round(Math.max(1000, price)));
        }
        break;
      }
      case "recovery": {
        // Starts high, drops 45% by middle, then recovers to finalPrice
        const midPoint = months / 2;
        for (let t = 0; t < months; t++) {
          // U-shape factor: 1 - 0.45 * sin(t/months * PI)
          // At t=0, multiplier = 1
          // At t=mid, multiplier = 0.55
          // At t=months, multiplier = 1
          const uFactor = 1 - 0.45 * Math.sin((t / (months - 1)) * Math.PI);
          const noise = 1 + getNoise(t) * 0.4;
          const price = t === months - 1 ? finalPrice : finalPrice * uFactor * noise;
          path.push(Math.round(Math.max(1000, price)));
        }
        break;
      }
      case "bubble": {
        // Starts low, climbs 2x by month 60% of time, then crashes hard to finalPrice
        const peakPoint = Math.floor(months * 0.6);
        for (let t = 0; t < months; t++) {
          let multiplier = 1;
          if (t <= peakPoint) {
            // Closes in on a 2.1x peak
            multiplier = 1 + 1.1 * (t / peakPoint);
          } else {
            // Crashes back down
            const crashProgress = (t - peakPoint) / (months - 1 - peakPoint);
            multiplier = 2.1 - 1.1 * crashProgress;
          }
          const noise = 1 + getNoise(t) * 0.3;
          const price = t === months - 1 ? finalPrice : (finalPrice / 1.1) * multiplier * noise;
          path.push(Math.round(Math.max(1000, price)));
        }
        break;
      }
      case "flat": {
        // Fluctuates around finalPrice
        for (let t = 0; t < months; t++) {
          const noise = 1 + getNoise(t) * 1.5; // high noise, no trend
          const price = t === months - 1 ? finalPrice : finalPrice * 0.95 * noise;
          path.push(Math.round(Math.max(1000, price)));
        }
        break;
      }
    }

    return path;
  }, [selectedStock, scenario, totalMonths]);

  // Simulation calculations
  const simulationResults = useMemo(() => {
    const path = pricePath;
    const months = totalMonths;

    // 1. DCA Calculation
    let dcaShares = 0;
    const monthlyBreakdown: Array<{
      month: number;
      price: number;
      amountInvested: number;
      sharesBought: number;
      cumulativeShares: number;
      cumulativeInvested: number;
      portfolioValue: number;
    }> = [];

    let cumulativeInvested = 0;
    for (let t = 0; t < months; t++) {
      const price = path[t];
      const sharesBought = monthlyContribution / price;
      dcaShares += sharesBought;
      cumulativeInvested += monthlyContribution;

      monthlyBreakdown.push({
        month: t + 1,
        price,
        amountInvested: monthlyContribution,
        sharesBought,
        cumulativeShares: dcaShares,
        cumulativeInvested,
        portfolioValue: dcaShares * price
      });
    }

    const finalPrice = path[months - 1];
    const dcaFinalValue = dcaShares * finalPrice;
    const dcaProfit = dcaFinalValue - totalInvested;
    const dcaProfitPercent = (dcaProfit / totalInvested) * 100;
    const dcaAvgPrice = totalInvested / dcaShares;

    // 2. Lump Sum at Start Calculation (All capital invested on Month 1)
    const lumpStartPrice = path[0];
    const lumpStartShares = totalInvested / lumpStartPrice;
    const lumpStartFinalValue = lumpStartShares * finalPrice;
    const lumpStartProfit = lumpStartFinalValue - totalInvested;
    const lumpStartProfitPercent = (lumpStartProfit / totalInvested) * 100;

    // 3. Worst Timing Lump Sum (All capital invested at Peak price)
    const peakPrice = Math.max(...path);
    const worstShares = totalInvested / peakPrice;
    const worstFinalValue = worstShares * finalPrice;
    const worstProfit = worstFinalValue - totalInvested;
    const worstProfitPercent = (worstProfit / totalInvested) * 100;

    // 4. Best Timing Lump Sum (All capital invested at Bottom price)
    const bottomPrice = Math.min(...path);
    const bestShares = totalInvested / bottomPrice;
    const bestFinalValue = bestShares * finalPrice;
    const bestProfit = bestFinalValue - totalInvested;
    const bestProfitPercent = (bestProfit / totalInvested) * 100;

    return {
      dca: {
        shares: dcaShares,
        avgPrice: dcaAvgPrice,
        finalValue: dcaFinalValue,
        profit: dcaProfit,
        profitPercent: dcaProfitPercent
      },
      lumpStart: {
        shares: lumpStartShares,
        avgPrice: lumpStartPrice,
        finalValue: lumpStartFinalValue,
        profit: lumpStartProfit,
        profitPercent: lumpStartProfitPercent
      },
      worst: {
        shares: worstShares,
        avgPrice: peakPrice,
        finalValue: worstFinalValue,
        profit: worstProfit,
        profitPercent: worstProfitPercent
      },
      best: {
        shares: bestShares,
        avgPrice: bottomPrice,
        finalValue: bestFinalValue,
        profit: bestProfit,
        profitPercent: bestProfitPercent
      },
      monthlyBreakdown
    };
  }, [pricePath, totalMonths, monthlyContribution, totalInvested]);

  const bestPerformingStrategy = useMemo(() => {
    const results = [
      { name: "DCA", profit: simulationResults.dca.profit },
      { name: "LumpSumStart", profit: simulationResults.lumpStart.profit },
      { name: "WorstTiming", profit: simulationResults.worst.profit },
    ];
    results.sort((a, b) => b.profit - a.profit);
    return results[0].name;
  }, [simulationResults]);

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      {/* Left Column: Inputs & Parameters */}
      <div className="flex flex-col gap-5">
        <section className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-[#17201b] mb-4 flex items-center gap-2">
            <Coins className="h-5 w-5 text-[#0f766e]" />
            1. Thiết lập tích lũy định kỳ (DCA)
          </h2>

          <div className="grid gap-5">
            {/* Stock Selection */}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5 text-xs font-bold uppercase text-[#5b6861]">
                Chọn mã cổ phiếu ảo
                <select
                  value={selectedTicker}
                  onChange={(e) => setSelectedTicker(e.target.value)}
                  className="h-10 mt-1 rounded-md border border-[#d9ddd3] bg-white px-3 font-semibold text-sm text-[#17201b]"
                >
                  {mockStocks.map((stock) => (
                    <option key={stock.ticker} value={stock.ticker}>
                      {stock.ticker} - {stock.companyName} ({stock.sector})
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-1.5 text-xs font-bold uppercase text-[#5b6861]">
                Giá hiện tại của cổ phiếu
                <div className="h-10 mt-1 flex items-center px-3 border border-[#d9ddd3] bg-[#f8fbf7] rounded-md font-mono font-semibold text-sm text-[#17201b]">
                  {selectedStock.currentPrice.toLocaleString("vi-VN")} đ/cp
                </div>
              </label>
            </div>

            {/* Monthly Contribution */}
            <label className="grid gap-1.5 text-sm font-semibold text-[#314039] border-t border-[#edf0eb] pt-4">
              <div className="flex justify-between">
                <span>Số tiền tích lũy định kỳ hàng tháng</span>
                <span className="font-mono text-[#0f766e] font-bold">
                  {formatCurrency(monthlyContribution)}
                </span>
              </div>
              <input
                type="range"
                min={500000}
                max={20000000}
                step={500000}
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                className="w-full mt-2 accent-[#0f766e]"
              />
              <span className="text-xs text-[#5b6861] font-normal">
                (Là khoản trích đều đặn từ thu nhập nhàn rỗi hàng tháng của bạn sau khi đã trừ đi chi phí sinh hoạt)
              </span>
            </label>

            {/* Accumulation Duration */}
            <label className="grid gap-1.5 text-sm font-semibold text-[#314039] border-t border-[#edf0eb] pt-4">
              Thời gian đầu tư tích lũy
              <div className="grid grid-cols-4 gap-2 mt-1">
                {[1, 2, 3, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setYears(num)}
                    className={`h-10 rounded-md border text-sm font-bold transition-all ${
                      years === num
                        ? "bg-[#0f766e] text-white border-transparent"
                        : "border-[#d9ddd3] bg-white text-[#4a5a52] hover:bg-[#f8fbf7]"
                    }`}
                  >
                    {num} năm ({num * 12} tháng)
                  </button>
                ))}
              </div>
            </label>
          </div>
        </section>

        {/* Market Condition Selection */}
        <section className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-[#17201b] mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#0f766e]" />
            2. Chọn kịch bản diễn biến thị trường
          </h2>
          <div className="grid gap-3">
            {SCENARIOS.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setScenario(item.value as MarketScenario)}
                className={`p-3.5 rounded-md border text-left transition-all flex items-start gap-3 ${
                  scenario === item.value
                    ? "border-[#0f766e] bg-[#edf4ef] text-[#17201b]"
                    : "border-[#d9ddd3] bg-white hover:bg-[#f8fbf7] text-[#4a5a52]"
                }`}
              >
                <div className={`w-4 h-4 rounded-full border mt-1 shrink-0 flex items-center justify-center ${
                  scenario === item.value ? "border-[#0f766e]" : "border-[#d9ddd3]"
                }`}>
                  {scenario === item.value && <div className="w-2.5 h-2.5 rounded-full bg-[#0f766e]" />}
                </div>
                <div>
                  <p className="font-bold text-sm text-[#17201b]">{item.label}</p>
                  <p className="text-xs text-[#5b6861] mt-1 leading-5">{item.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Detailed accumulation table */}
        <section className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm overflow-hidden">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-base font-bold text-[#17201b]">Bảng thống kê mua cổ phiếu định kỳ</h2>
            <span className="text-xs text-[#66736c]">Xem 6 tháng đầu & cuối</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans border-collapse">
              <thead>
                <tr className="border-b border-[#e0e5dc] text-[#5b6861] font-bold">
                  <th className="py-2">Tháng</th>
                  <th className="py-2 text-right">Giá CP mua (đ)</th>
                  <th className="py-2 text-right">CP tích thêm</th>
                  <th className="py-2 text-right font-mono">Tổng vốn góp (đ)</th>
                  <th className="py-2 text-right">Tổng CP nắm giữ</th>
                  <th className="py-2 text-right font-mono">Giá trị danh mục (đ)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf0eb] text-[#314039] font-medium">
                {simulationResults.monthlyBreakdown
                  .filter((_, idx) => idx < 3 || idx >= totalMonths - 3)
                  .map((item, idx, arr) => {
                    const isGap = arr.length > 6 && idx === 3 && totalMonths > 6;
                    return (
                      <>
                        {isGap && (
                          <tr key="gap" className="bg-[#fcfdfc]">
                            <td colSpan={6} className="py-1.5 text-center text-gray-400 font-semibold italic">
                              ... Đang tiếp tục tích lũy kỷ luật từ tháng 4 đến tháng {totalMonths - 3} ...
                            </td>
                          </tr>
                        )}
                        <tr key={item.month} className="hover:bg-[#f8fbf7] transition-all">
                          <td className="py-2.5 font-bold text-[#0f766e]">M{item.month}</td>
                          <td className="py-2.5 text-right font-mono">{item.price.toLocaleString("vi-VN")}</td>
                          <td className="py-2.5 text-right font-mono">+{formatNumber(item.sharesBought)}</td>
                          <td className="py-2.5 text-right font-mono">{item.cumulativeInvested.toLocaleString("vi-VN")}</td>
                          <td className="py-2.5 text-right font-mono">{formatNumber(item.cumulativeShares)}</td>
                          <td className="py-2.5 text-right font-mono font-bold text-[#166534]">{Math.round(item.portfolioValue).toLocaleString("vi-VN")}</td>
                        </tr>
                      </>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Right Column: Diagnostic & Educational Results */}
      <div className="flex flex-col gap-5">
        {/* Results summary card */}
        <section className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-[#17201b] mb-4">Kết quả mô phỏng Tích lũy DCA</h2>

          <div className="grid gap-4">
            <div className="p-4 bg-[#f8fbf7] border border-[#edf0eb] rounded-md">
              <p className="text-xs font-bold text-[#66736c] uppercase">Tổng tiền đầu tư (Tích lũy gốc)</p>
              <p className="text-2xl font-black text-[#314039] mt-1">
                {formatCurrency(totalInvested)}
              </p>
              <p className="text-xs text-[#5b6861] mt-1">
                Góp {formatCurrency(monthlyContribution)}/tháng trong suốt {years} năm ({totalMonths} kỳ).
              </p>
            </div>

            <div className={`p-4 rounded-md border ${
              simulationResults.dca.profit >= 0
                ? "bg-[#e8f6ed] border-[#b9d9c5] text-[#166534]"
                : "bg-[#fef2f2] border-[#fecaca] text-[#991b1b]"
            }`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold uppercase">Giá trị danh mục cuối kỳ</p>
                  <p className="text-3xl font-black mt-1 font-mono">
                    {formatCurrency(simulationResults.dca.finalValue)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold uppercase">Hiệu suất</p>
                  <p className="text-2xl font-black mt-1 font-mono">
                    {formatPercent(simulationResults.dca.profitPercent)}
                  </p>
                </div>
              </div>
              <p className="text-xs font-semibold mt-2.5">
                {simulationResults.dca.profit >= 0
                  ? `Lợi nhuận ròng thặng dư: ${formatCurrency(simulationResults.dca.profit)}`
                  : `Thua lỗ tạm tính: ${formatCurrency(simulationResults.dca.profit)}`}
              </p>
            </div>
          </div>

          <div className="mt-5 border-t border-[#edf0eb] pt-4 grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[#5b6861] block">Tổng cổ phiếu tích lũy:</span>
              <span className="font-mono font-bold text-sm text-[#17201b]">
                {formatNumber(simulationResults.dca.shares)} CP
              </span>
            </div>
            <div>
              <span className="text-[#5b6861] block">Giá vốn trung bình (đ):</span>
              <span className="font-mono font-bold text-sm text-[#17201b]">
                {Math.round(simulationResults.dca.avgPrice).toLocaleString("vi-VN")} đ/cp
              </span>
            </div>
          </div>
        </section>

        {/* Strategy comparison table */}
        <section className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-[#17201b] mb-3">So sánh với các chiến lược khác</h2>
          <p className="text-xs text-[#5b6861] mb-4">
            So sánh DCA với việc dồn hết tiền mua một lần (Lump Sum) trong cùng kỳ kịch bản để thấy tác động của định thời điểm.
          </p>

          <div className="grid gap-3">
            {/* DCA Card */}
            <div className={`p-3.5 rounded-md border flex items-center justify-between transition-all ${
              bestPerformingStrategy === "DCA"
                ? "border-[#b9d9c5] bg-[#edf6ed] ring-1 ring-[#0f766e]"
                : "border-[#d9ddd3] bg-white"
            }`}>
              <div className="flex gap-2.5 items-start">
                <Coins className="h-4.5 w-4.5 text-[#0f766e] mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-[#17201b]">Tích lũy định kỳ DCA (Hàng tháng)</p>
                  <p className="text-[11px] text-[#5b6861] mt-0.5">
                    Giá vốn trung bình: <b>{Math.round(simulationResults.dca.avgPrice).toLocaleString("vi-VN")} đ</b>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono font-bold text-sm text-[#17201b]">
                  {formatCurrency(simulationResults.dca.finalValue)}
                </p>
                <p className={`text-xs font-bold font-mono ${
                  simulationResults.dca.profitPercent >= 0 ? "text-[#166534]" : "text-[#b91c1c]"
                }`}>
                  {formatPercent(simulationResults.dca.profitPercent)}
                </p>
              </div>
            </div>

            {/* Lump Sum Start Card */}
            <div className={`p-3.5 rounded-md border flex items-center justify-between transition-all ${
              bestPerformingStrategy === "LumpSumStart"
                ? "border-[#b9d9c5] bg-[#edf6ed] ring-1 ring-[#0f766e]"
                : "border-[#d9ddd3] bg-white"
            }`}>
              <div className="flex gap-2.5 items-start">
                <TrendingUp className="h-4.5 w-4.5 text-[#5b6861] mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-[#17201b]">Mua toàn bộ ban đầu (Month 1)</p>
                  <p className="text-[11px] text-[#5b6861] mt-0.5">
                    Giá vốn trung bình: <b>{Math.round(simulationResults.lumpStart.avgPrice).toLocaleString("vi-VN")} đ</b>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono font-bold text-sm text-[#17201b]">
                  {formatCurrency(simulationResults.lumpStart.finalValue)}
                </p>
                <p className={`text-xs font-bold font-mono ${
                  simulationResults.lumpStart.profitPercent >= 0 ? "text-[#166534]" : "text-[#b91c1c]"
                }`}>
                  {formatPercent(simulationResults.lumpStart.profitPercent)}
                </p>
              </div>
            </div>

            {/* Worst Timing Card */}
            <div className={`p-3.5 rounded-md border border-[#f1bea8] bg-[#fffbf9] flex items-center justify-between`}>
              <div className="flex gap-2.5 items-start">
                <AlertTriangle className="h-4.5 w-4.5 text-[#ea580c] mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-[#17201b]">Xấu nhất: Đu đúng đỉnh (Lump Sum Peak)</p>
                  <p className="text-[11px] text-[#5b6861] mt-0.5">
                    Giá vốn trung bình: <b>{Math.round(simulationResults.worst.avgPrice).toLocaleString("vi-VN")} đ</b>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono font-bold text-sm text-[#17201b]">
                  {formatCurrency(simulationResults.worst.finalValue)}
                </p>
                <p className={`text-xs font-bold font-mono ${
                  simulationResults.worst.profitPercent >= 0 ? "text-[#166534]" : "text-[#b91c1c]"
                }`}>
                  {formatPercent(simulationResults.worst.profitPercent)}
                </p>
              </div>
            </div>

            {/* Best Timing Card */}
            <div className="p-3.5 rounded-md border border-dashed border-[#d9ddd3] bg-white opacity-85 flex items-center justify-between">
              <div className="flex gap-2.5 items-start">
                <Sparkles className="h-4.5 w-4.5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-[#17201b]">Lý tưởng: Bắt đúng đáy (Lump Sum Bottom)</p>
                  <p className="text-[11px] text-[#5b6861] mt-0.5">
                    Giá vốn trung bình: <b>{Math.round(simulationResults.best.avgPrice).toLocaleString("vi-VN")} đ</b>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono font-bold text-sm text-[#17201b]">
                  {formatCurrency(simulationResults.best.finalValue)}
                </p>
                <p className={`text-xs font-bold font-mono ${
                  simulationResults.best.profitPercent >= 0 ? "text-[#166534]" : "text-[#b91c1c]"
                }`}>
                  {formatPercent(simulationResults.best.profitPercent)}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic educational feedback */}
        <section className="rounded-md border border-[#e2d3a7] bg-[#fff8df] p-5 text-sm">
          <h3 className="font-bold text-[#5b420b] flex items-center gap-1.5">
            <Info className="h-4 w-4 text-[#7a4d00] shrink-0" />
            Phân tích chuyên gia JokingFinance
          </h3>

          <div className="mt-2 text-[#7a4d00] leading-6 space-y-2.5 text-xs">
            {scenario === "recovery" && (
              <p>
                💡 Ở kịch bản <b>U-Shape</b> này, bạn có thể thấy <b>DCA hoàn toàn vượt trội hơn Mua một lần ban đầu và Đu đỉnh</b>. 
                Khi thị trường lao dốc ở nửa đầu kỳ, DCA tiếp tục đầu tư đều đặn và gom được số lượng cổ phiếu lớn ở vùng giá rẻ. 
                Nhờ vậy, khi giá phục hồi lại đỉnh cũ, danh mục DCA lãi rất lớn ({formatPercent(simulationResults.dca.profitPercent)}) 
                trong khi người mua một lần ban đầu chỉ vừa hòa vốn (0%).
              </p>
            )}
            {scenario === "growth" && (
              <p>
                💡 Ở kịch bản <b>Tăng trưởng dài hạn</b>, người Mua một lần ban đầu có lợi thế lớn nhất vì họ mua toàn bộ ở vạch xuất phát - mức giá thấp nhất. 
                Tuy nhiên, DCA vẫn đem lại lợi nhuận tốt ({formatPercent(simulationResults.dca.profitPercent)}) với <b>mức độ an toàn cao</b>. 
                Trong đời thực, hiếm ai có ngay lập tức 100% số tiền nhàn rỗi lớn của cả 3-5 năm để giải ngân một lần.
              </p>
            )}
            {scenario === "bubble" && (
              <p>
                💡 Ở kịch bản <b>A-Shape (Bong bóng vỡ)</b>, người Mua một lần ban đầu và đặc biệt là người Đu đỉnh chịu tổn thất rất nặng nề do mua đúng vùng định giá cao. 
                DCA giúp bạn rải đều lệnh mua, tránh được việc dồn toàn bộ tài sản vào ngay đỉnh bong bóng, từ đó kiểm soát tối đa thiệt hại tâm lý.
              </p>
            )}
            {scenario === "cyclical" && (
              <p>
                💡 Cổ phiếu <b>Chu kỳ</b> như HPG thường trồi sụt theo nhu cầu ngành. Tích sản DCA trong chu kỳ giảm giúp bạn hạ giá vốn xuống cực thấp. 
                Khi chu kỳ phục hồi trở lại, hiệu quả nhân đôi. Điểm mấu chốt là bạn phải tin tưởng vào khả năng sống sót của doanh nghiệp.
              </p>
            )}
            {scenario === "flat" && (
              <p>
                💡 Khi giá đi ngang dài hạn (Sideways), tích lũy DCA giữ cho bạn tâm thế bình thản. Lợi nhuận chính đến từ việc gia tăng số lượng cổ phiếu nắm giữ 
                và tích tụ lực mua để đón sóng tăng trưởng tiếp theo.
              </p>
            )}
            <p className="font-semibold border-t border-[#f2e6c1] pt-2 text-[#684c0a]">
              🛡️ Bài học cốt lõi: Đừng cố đoán đáy tìm đỉnh. Đoán sai đáy đỉnh là nguyên nhân lớn nhất khiến nhà đầu tư thua lỗ. 
              DCA giúp loại bỏ áp lực tâm lý ra khỏi quy trình đầu tư của bạn.
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-2.5">
            <Link
              href="/articles/suc-manh-cua-tich-luy-dinh-ky-dca"
              className="inline-flex items-center gap-1 font-bold text-[#0f766e] hover:underline"
            >
              Đọc bài học Sức mạnh của tích lũy định kỳ DCA
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Practice Mission Action */}
        <section className="rounded-md border border-[#e0e5dc] bg-[#fdfbf7] p-5">
          <h3 className="font-bold text-[#17201b] flex items-center gap-1.5">
            <FileCheck2 className="h-4.5 w-4.5 text-[#0f766e]" />
            Nhiệm vụ thực hành đi kèm:
          </h3>
          <p className="text-xs text-[#5b6861] mt-1.5 leading-5">
            Bạn có thể ghi nhận nhật ký tích lũy định kỳ hoặc mở mô phỏng để bắt đầu đi lệnh DCA bằng điểm ảo.
          </p>
          <div className="mt-3.5">
            <Link
              href="/app/missions/thuc-hanh-gia-lap-dca-va-phan-tich-gia-von"
              className="min-h-10 rounded-md bg-[#0f766e] text-white flex items-center justify-center gap-1.5 text-xs font-bold hover:bg-[#115e59]"
            >
              Làm nhiệm vụ thực hành
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
