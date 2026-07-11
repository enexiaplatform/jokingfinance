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
  Percent,
  RefreshCw,
  TrendingUp,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { useVirtualPortfolio } from "./use-virtual-portfolio";
import type { Stock } from "@/lib/market-data/types";

type KellyToolProps = {
  stocks: Stock[];
};

export function KellyTool({ stocks }: KellyToolProps) {
  const { summary } = useVirtualPortfolio();

  // Get active capital (default to virtual portfolio value or 100M)
  const portfolioValue = useMemo(() => {
    return summary?.portfolioValue || 100000000;
  }, [summary]);

  // Inputs
  const [selectedTicker, setSelectedTicker] = useState("FPT");
  const [capital, setCapital] = useState<number>(portfolioValue);
  const [winRate, setWinRate] = useState<number>(50); // Win Rate % (10 - 90)
  const [targetProfitPct, setTargetProfitPct] = useState<number>(15); // Chốt lời %
  const [stopLossPct, setStopLossPct] = useState<number>(7); // Cắt lỗ %
  const [kellyFraction, setKellyFraction] = useState<number>(0.5); // Default Half Kelly
  const [simulationSeed, setSimulationSeed] = useState<number>(1); // Seed to trigger re-simulation

  const selectedStock = useMemo(() => {
    return stocks.find((s) => s.ticker === selectedTicker) || stocks[0];
  }, [stocks, selectedTicker]);

  // Reset entry parameters when ticker changes to match stock reality
  const [prevSelectedTicker, setPrevSelectedTicker] = useState(selectedTicker);
  if (selectedTicker !== prevSelectedTicker) {
    setPrevSelectedTicker(selectedTicker);
    // Presets based on stock types (simple heuristics for user convenience)
    if (selectedTicker === "FPT") {
      setTargetProfitPct(15);
      setStopLossPct(7);
      setWinRate(55);
    } else if (selectedTicker === "VNM" || selectedTicker === "VCB") {
      setTargetProfitPct(10);
      setStopLossPct(5);
      setWinRate(60);
    } else if (selectedTicker === "HPG" || selectedTicker === "MWG") {
      setTargetProfitPct(20);
      setStopLossPct(8);
      setWinRate(50);
    } else {
      // Small cap / volatile
      setTargetProfitPct(25);
      setStopLossPct(10);
      setWinRate(45);
    }
  }

  const [prevPortfolioValue, setPrevPortfolioValue] = useState(portfolioValue);
  if (portfolioValue !== prevPortfolioValue) {
    setPrevPortfolioValue(portfolioValue);
    if (portfolioValue && portfolioValue > 0) {
      setCapital(portfolioValue);
    }
  }

  // Calculations
  // b = Net Odds = targetProfitPct / stopLossPct
  const winLossRatio = useMemo(() => {
    if (stopLossPct <= 0) return 0;
    return targetProfitPct / stopLossPct;
  }, [targetProfitPct, stopLossPct]);

  // p = winRate / 100
  // q = 1 - p
  // Kelly % = (p * b - q) / b
  const kellyResults = useMemo(() => {
    const p = winRate / 100;
    const q = 1 - p;
    const b = winLossRatio;

    if (b <= 0) {
      return {
        expectedValue: 0,
        rawKellyPct: 0,
        adjustedKellyPct: 0,
        recommendedCapital: 0,
        recommendedQty: 0,
        isValid: false,
      };
    }

    const expectedValue = p * b - q; // Expected Value per unit of risk
    const rawKellyPct = expectedValue > 0 ? (expectedValue / b) * 100 : 0;
    const adjustedKellyPct = rawKellyPct * kellyFraction;

    const recommendedCapital = capital * (adjustedKellyPct / 100);
    const currentPrice = selectedStock?.currentPrice || 130000;
    const recommendedQty = Math.floor(recommendedCapital / currentPrice);

    return {
      expectedValue,
      rawKellyPct,
      adjustedKellyPct,
      recommendedCapital,
      recommendedQty,
      isValid: expectedValue > 0 && rawKellyPct > 0,
    };
  }, [winRate, winLossRatio, kellyFraction, capital, selectedStock]);

  // 50 trades simulation
  const simResults = useMemo(() => {
    const tradesCount = 50;
    const p = winRate / 100;
    
    // Deterministic random generator using seed to prevent infinite loops
    let seed = simulationSeed;
    const random = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    // Pre-generate win/loss outcomes
    const outcomes = Array.from({ length: tradesCount }, () => random() < p);

    // Run 4 strategies compounding
    const runStrategy = (fraction: number) => {
      const f = (kellyResults.rawKellyPct / 100) * fraction;
      let currentCap = capital;
      const history = [currentCap];
      let maxDrawdown = 0;
      let peak = currentCap;
      let fellBelow50 = false;

      for (let i = 0; i < tradesCount; i++) {
        if (currentCap <= 0) {
          history.push(0);
          continue;
        }
        
        const isWin = outcomes[i];
        const wager = currentCap * f;
        
        if (isWin) {
          currentCap += wager * (targetProfitPct / 100);
        } else {
          currentCap -= wager * (stopLossPct / 100);
        }

        if (currentCap < 0) currentCap = 0;
        history.push(currentCap);

        if (currentCap > peak) peak = currentCap;
        const dd = peak > 0 ? ((peak - currentCap) / peak) * 100 : 0;
        if (dd > maxDrawdown) maxDrawdown = dd;
        if (currentCap < capital * 0.5) fellBelow50 = true;
      }

      return {
        history,
        finalCapital: currentCap,
        maxDrawdown,
        fellBelow50,
      };
    };

    const fullKelly = runStrategy(1.0);
    const halfKelly = runStrategy(0.5);
    const quarterKelly = runStrategy(0.25);
    
    // All-in / Over-betting strategy: wagers 40% (or double Kelly if Kelly is low)
    const overBetFraction = Math.max(0.4, (kellyResults.rawKellyPct / 100) * 2.0);
    let overBetCap = capital;
    const overBetHistory = [overBetCap];
    let overBetMaxDrawdown = 0;
    let overBetPeak = overBetCap;
    let overBetFellBelow50 = false;

    for (let i = 0; i < tradesCount; i++) {
      if (overBetCap <= 0) {
        overBetHistory.push(0);
        continue;
      }
      const isWin = outcomes[i];
      const wager = overBetCap * overBetFraction;
      if (isWin) {
        overBetCap += wager * (targetProfitPct / 100);
      } else {
        overBetCap -= wager * (stopLossPct / 100);
      }
      if (overBetCap < 0) overBetCap = 0;
      overBetHistory.push(overBetCap);

      if (overBetCap > overBetPeak) overBetPeak = overBetCap;
      const dd = overBetPeak > 0 ? ((overBetPeak - overBetCap) / overBetPeak) * 100 : 0;
      if (dd > overBetMaxDrawdown) overBetMaxDrawdown = dd;
      if (overBetCap < capital * 0.5) overBetFellBelow50 = true;
    }

    return {
      fullKelly,
      halfKelly,
      quarterKelly,
      overBet: {
        history: overBetHistory,
        finalCapital: overBetCap,
        maxDrawdown: overBetMaxDrawdown,
        fellBelow50: overBetFellBelow50,
        rate: overBetFraction * 100,
      },
      outcomes,
    };
  }, [winRate, targetProfitPct, stopLossPct, kellyResults.rawKellyPct, capital, simulationSeed]);

  // SVG Chart Calculation
  const chartSvg = useMemo(() => {
    const width = 600;
    const height = 280;
    const padding = { top: 20, right: 80, bottom: 35, left: 65 };

    // Combine all history arrays to scale Y axis
    const allHistories = [
      ...simResults.fullKelly.history,
      ...simResults.halfKelly.history,
      ...simResults.quarterKelly.history,
      ...simResults.overBet.history,
    ];

    let minVal = capital;
    let maxVal = capital;
    allHistories.forEach((v) => {
      if (v < minVal) minVal = v;
      if (v > maxVal) maxVal = v;
    });

    // Pad limits
    const range = maxVal - minVal;
    minVal = Math.max(0, minVal - range * 0.05);
    maxVal = maxVal + range * 0.05;

    const getX = (index: number) => {
      return padding.left + (index / 50) * (width - padding.left - padding.right);
    };

    const getY = (val: number) => {
      const scale = (height - padding.top - padding.bottom) / (maxVal - minVal || 1);
      return height - padding.bottom - (val - minVal) * scale;
    };

    // Grid lines Y
    const gridLines = [];
    const stepCount = 4;
    for (let i = 0; i <= stepCount; i++) {
      const val = minVal + (i / stepCount) * (maxVal - minVal);
      const y = getY(val);
      gridLines.push({
        y,
        label: val >= 1000000 ? `${(val / 1000000).toFixed(1)}M` : `${val.toLocaleString()}`
      });
    }

    const makePath = (history: number[]) => {
      return history.map((v, i) => `${getX(i)},${getY(v)}`).join(" L ");
    };

    return {
      width,
      height,
      padding,
      gridLines,
      getX,
      getY,
      paths: {
        fullKelly: `M ${makePath(simResults.fullKelly.history)}`,
        halfKelly: `M ${makePath(simResults.halfKelly.history)}`,
        quarterKelly: `M ${makePath(simResults.quarterKelly.history)}`,
        overBet: `M ${makePath(simResults.overBet.history)}`,
      },
    };
  }, [simResults, capital]);

  // Winrate preset logic description
  const winRateDescription = useMemo(() => {
    if (winRate < 45) return "Đoán mò / FOMO theo đám đông (Rủi ro rất cao)";
    if (winRate < 55) return "Phân tích cơ bản hoặc đồ thị kỹ thuật sơ bộ (Trung bình)";
    if (winRate < 65) return "Hệ thống có lợi thế rõ rệt / Xu hướng ủng hộ (Khá)";
    return "Hệ thống đã qua backtest dài hạn / Cơ hội xuất sắc (Cao)";
  }, [winRate]);

  return (
    <div className="grid gap-6">
      {/* Introduction Card */}
      <section className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex gap-3">
            <div className="p-2.5 bg-[#edf5ee] border border-[#d2dfd5] rounded-md h-fit">
              <Calculator className="h-6 w-6 text-[#0f766e]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#17201b]">Công thức Kelly & Phân bổ tỷ trọng</h2>
              <p className="mt-1 text-sm text-[#5b6861] leading-relaxed">
                Được phát triển bởi nhà vật lý học John Larry Kelly Jr. vào năm 1956, công thức này tính toán tỷ lệ đi tiền tối ưu để tối đa hóa sự tăng trưởng vốn tích lũy dài hạn. Nó trả lời câu hỏi: <b>&ldquo;Tôi nên phân bổ bao nhiêu phần trăm danh mục vào mã này để tối ưu hóa tài sản?&rdquo;</b>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid: Inputs vs Results */}
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        
        {/* Left Side: Inputs */}
        <div className="flex flex-col gap-5">
          <section className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
            <h3 className="text-lg font-bold text-[#17201b] mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-[#0f766e]" />
              Bước 1: Thiết lập lệnh & Xác suất giao dịch
            </h3>
            
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Ticker Selector */}
              <label className="grid gap-1.5 text-xs font-bold uppercase text-[#5b6861]">
                Cổ phiếu giao dịch
                <select
                  value={selectedTicker}
                  onChange={(e) => setSelectedTicker(e.target.value)}
                  className="h-10 mt-1 rounded-md border border-[#d9ddd3] bg-white px-3 font-semibold text-sm"
                >
                  {stocks.map((stock) => (
                    <option key={stock.ticker} value={stock.ticker}>
                      {stock.ticker} ({stock.companyName})
                    </option>
                  ))}
                </select>
              </label>

              {/* Capital input */}
              <label className="grid gap-1.5 text-xs font-bold uppercase text-[#5b6861]">
                Tổng vốn đầu tư ảo (Điểm)
                <input
                  type="number"
                  min={100000}
                  step={1000000}
                  value={capital}
                  onChange={(e) => setCapital(Math.max(100000, Number(e.target.value)))}
                  className="h-10 mt-1 rounded-md border border-[#d9ddd3] px-3 font-semibold text-sm"
                />
              </label>
            </div>

            {/* Winrate slider */}
            <div className="mt-5">
              <div className="flex justify-between items-center text-sm font-semibold mb-1">
                <span className="text-[#314039]">Xác suất thắng dự tính (Win Rate)</span>
                <span className="font-mono text-base font-bold text-[#0f766e]">{winRate}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={90}
                value={winRate}
                onChange={(e) => setWinRate(Number(e.target.value))}
                className="w-full h-2 bg-[#edf0eb] rounded-lg appearance-none cursor-pointer accent-[#0f766e]"
              />
              <span className="text-xs text-[#66736c] block mt-1.5 font-medium italic">
                💡 Định mức: {winRateDescription}
              </span>
            </div>

            {/* RRR Inputs */}
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5 text-xs font-bold uppercase text-[#5b6861]">
                Mức Chốt lời mong muốn (%)
                <div className="relative mt-1">
                  <input
                    type="number"
                    min={1}
                    max={200}
                    value={targetProfitPct}
                    onChange={(e) => setTargetProfitPct(Math.max(1, Number(e.target.value)))}
                    className="w-full h-10 rounded-md border border-[#d9ddd3] pl-3 pr-8 font-semibold text-sm"
                  />
                  <span className="absolute right-3 top-2.5 text-gray-400 font-semibold text-sm">%</span>
                </div>
              </label>

              <label className="grid gap-1.5 text-xs font-bold uppercase text-[#5b6861]">
                Mức Cắt lỗ dự kiến (%)
                <div className="relative mt-1">
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={stopLossPct}
                    onChange={(e) => setStopLossPct(Math.max(1, Number(e.target.value)))}
                    className="w-full h-10 rounded-md border border-[#d9ddd3] pl-3 pr-8 font-semibold text-sm"
                  />
                  <span className="absolute right-3 top-2.5 text-gray-400 font-semibold text-sm">%</span>
                </div>
              </label>
            </div>

            {/* Risk reward display */}
            <div className="mt-4 p-3.5 bg-[#edf5ee] border border-[#d2dfd5] rounded-md text-sm flex items-center justify-between">
              <span className="text-[#43534a] font-medium">Tỷ lệ Lợi nhuận/Thua lỗ (Net Odds):</span>
              <span className="font-mono font-bold text-[#0f766e]">1 : {winLossRatio.toFixed(2)}</span>
            </div>
          </section>

          {/* Step 2: Choose Kelly Fraction */}
          <section className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
            <h3 className="text-lg font-bold text-[#17201b] mb-4 flex items-center gap-2">
              <Percent className="h-5 w-5 text-[#0f766e]" />
              Bước 2: Chọn phân số Kelly (Kelly Fraction)
            </h3>
            <p className="text-xs text-[#66736c] mb-4">
              Trong thực tế, do khó đánh giá chính xác Win Rate, các nhà đầu tư thường sử dụng <b>&ldquo;Fractional Kelly&rdquo;</b> (Kelly một phần) để hạn chế rủi ro sụt giảm tài sản cực đoan mà vẫn bảo vệ phần lớn tăng trưởng.
            </p>

            <div className="grid gap-2.5 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => setKellyFraction(1.0)}
                className={`p-3.5 rounded-md border text-left transition-all ${
                  kellyFraction === 1.0
                    ? "border-[#ea580c] bg-[#fff6f0] text-[#7c2d12]"
                    : "border-[#d9ddd3] bg-white hover:bg-[#f8fbf7] text-[#4a5a52]"
                }`}
              >
                <p className="font-bold text-sm">Full Kelly (1.0)</p>
                <p className="text-[11px] mt-1 opacity-80">Rủi ro cao nhất. Biến động cực mạnh. Lợi nhuận lý thuyết cao nhất.</p>
              </button>

              <button
                type="button"
                onClick={() => setKellyFraction(0.5)}
                className={`p-3.5 rounded-md border text-left transition-all ${
                  kellyFraction === 0.5
                    ? "border-[#0f766e] bg-[#edf4ef] text-[#115e59]"
                    : "border-[#d9ddd3] bg-white hover:bg-[#f8fbf7] text-[#4a5a52]"
                }`}
              >
                <p className="font-bold text-sm">Half Kelly (0.5)</p>
                <p className="text-[11px] mt-1 opacity-80">Khuyên dùng. Giảm biến động sụt giảm tài sản xuống 50%, nhưng giữ 75% tiềm năng Full Kelly.</p>
              </button>

              <button
                type="button"
                onClick={() => setKellyFraction(0.25)}
                className={`p-3.5 rounded-md border text-left transition-all ${
                  kellyFraction === 0.25
                    ? "border-[#0d9488] bg-[#f0fdfa] text-[#115e59]"
                    : "border-[#d9ddd3] bg-white hover:bg-[#f8fbf7] text-[#4a5a52]"
                }`}
              >
                <p className="font-bold text-sm">Quarter Kelly (0.25)</p>
                <p className="text-[11px] mt-1 opacity-80">An toàn & kỷ luật. Sụt giảm vốn rất nhỏ. Đường tăng trưởng tài sản mượt mà hơn.</p>
              </button>
            </div>
          </section>
        </div>

        {/* Right Side: Results & Diagnostics */}
        <div className="flex flex-col gap-5">
          <section className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
            <h3 className="text-xl font-bold text-[#17201b] mb-4">Kết quả phân bổ Kelly</h3>

            {!kellyResults.isValid ? (
              <div className="p-4 bg-[#fef2f2] border border-[#fca5a5] text-[#991b1b] rounded-md text-sm">
                <p className="font-bold flex items-center gap-1.5">
                  <ShieldAlert className="h-5 w-5" />
                  CẢNH BÁO: Kỳ vọng toán học âm (EV = {kellyResults.expectedValue.toFixed(2)})
                </p>
                <p className="mt-1.5 text-xs leading-relaxed">
                  Lợi thế giao dịch đang thuộc về thị trường chứ không phải bạn. Với xác suất {winRate}% và tỷ lệ RRR là 1 : {winLossRatio.toFixed(2)}, về dài hạn bạn chắc chắn sẽ thua lỗ nếu liên tục thực hiện lệnh này. 
                  <br />
                  <b>Hệ số Kelly đề xuất phân bổ: 0% vốn.</b> Khuyên bạn không nên đặt lệnh này!
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {/* Kelly % card */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-[#edf7f6] border border-[#cbece8] rounded-md text-center">
                    <p className="text-[11px] font-bold text-[#0d9488] uppercase">Full Kelly gợi ý</p>
                    <p className="text-3xl font-black text-[#0f766e] mt-1">{kellyResults.rawKellyPct.toFixed(1)}%</p>
                  </div>
                  <div className="p-3 bg-[#edf5ee] border border-[#d2dfd5] rounded-md text-center">
                    <p className="text-[11px] font-bold text-[#15803d] uppercase">Đã điều chỉnh ({kellyFraction}x)</p>
                    <p className="text-3xl font-black text-[#166534] mt-1">{kellyResults.adjustedKellyPct.toFixed(1)}%</p>
                  </div>
                </div>

                {/* Capital Allocation & Quantity */}
                <div className="p-4 rounded-md border border-[#e0e5dc] bg-[#f8fbf7] grid gap-3.5 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-[#5b6861]">Tổng số tiền phân bổ:</span>
                    <span className="font-mono font-bold text-[#17201b]">{formatPoints(kellyResults.recommendedCapital)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#5b6861]">Giá cổ phiếu {selectedTicker} hiện tại:</span>
                    <span className="font-mono font-bold text-[#17201b]">{formatPoints(selectedStock?.currentPrice || 130000)}</span>
                  </div>
                  <div className="border-t border-[#e0e5dc] pt-3.5 flex justify-between items-center">
                    <span className="text-[#17201b] font-bold">Số lượng cổ phiếu khuyên mua:</span>
                    <span className="font-mono font-extrabold text-lg text-[#0f766e]">{kellyResults.recommendedQty.toLocaleString()} CP</span>
                  </div>
                </div>

                {/* Over-concentration Warning */}
                {kellyResults.adjustedKellyPct > 20 && (
                  <div className="p-3.5 bg-[#fff0e8] border border-[#f1bea8] text-[#9a3412] rounded-md text-xs leading-relaxed flex gap-2">
                    <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                    <span>
                      <b>Cảnh báo tập trung cao:</b> Tỷ lệ phân bổ <b>{kellyResults.adjustedKellyPct.toFixed(1)}%</b> vượt quá giới hạn an toàn danh mục của JokingFinance (20%). Mặc dù toán học cho phép bạn đi lệnh lớn vì cơ hội tốt, nhưng trong thực tế, các biến cố bất ngờ hoặc sai sót dữ liệu có thể làm bay màu tài khoản của bạn. Nên hạ tỷ trọng xuống <b>20% vốn tối đa</b>.
                    </span>
                  </div>
                )}

                {/* Action Link to Simulator */}
                <div className="mt-2 flex flex-col gap-2">
                  <Link
                    href={`/app/simulator?side=buy&ticker=${selectedTicker}&quantity=${kellyResults.recommendedQty}&thesis=${encodeURIComponent(`LUẬN ĐIỂM GIAO DỊCH [${selectedTicker}]\n- Phân bổ theo Công thức Kelly điều chỉnh (${kellyFraction}x): ${kellyResults.adjustedKellyPct.toFixed(1)}% vốn ảo.\n- Xác suất thắng giả định: ${winRate}%\n- Odds chốt lời/cắt lỗ: ${targetProfitPct}% / ${stopLossPct}%`)}`}
                    className="min-h-11 rounded-md bg-[#0f766e] text-white flex items-center justify-center gap-2 text-sm font-bold hover:bg-[#115e59]"
                  >
                    <Zap className="h-4 w-4 fill-current text-yellow-400" />
                    Áp dụng lệnh Kelly vào mô phỏng
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                  <p className="text-[10px] text-[#66736c] text-center">
                    *Chuyển hướng sang màn đặt lệnh ảo với số lượng và luận điểm tính toán tự động.
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* Educational Note */}
          <section className="rounded-md border border-[#e0e5dc] bg-[#fdfbf7] p-5">
            <h4 className="font-bold text-[#17201b] flex items-center gap-1.5 text-sm">
              <BookOpen className="h-4.5 w-4.5 text-[#0f766e]" />
              Bài học cốt lõi từ Công thức Kelly:
            </h4>
            <p className="mt-2 text-xs text-[#5b6861] leading-relaxed">
              Kelly cho thấy mối quan hệ giữa <b>Lợi thế (Expected Value)</b> và <b>Quy mô vốn</b>. Có 3 kịch bản:
            </p>
            <ul className="mt-2.5 grid gap-2 text-xs text-[#4a5a52]">
              <li className="flex gap-1.5">
                <span className="text-[#ea580c] font-bold">1. Under-betting:</span> Đi tiền nhỏ hơn tỷ lệ Kelly giúp tăng trưởng chậm nhưng an toàn hơn.
              </li>
              <li className="flex gap-1.5">
                <span className="text-[#166534] font-bold">2. Kelly Betting:</span> Mức phân bổ tối ưu để đạt tốc độ tăng trưởng vốn cực đại trên lý thuyết toán học.
              </li>
              <li className="flex gap-1.5">
                <span className="text-[#991b1b] font-bold">3. Over-betting:</span> Đi tiền lớn hơn tỷ lệ Kelly. Kịch bản này cực kỳ nguy hiểm. Kể cả khi hệ thống của bạn có lợi nhuận kỳ vọng dương lớn, việc đi tiền quá mức sẽ dẫn tới suy giảm vốn nghiêm trọng hoặc phá sản (Risk of Ruin).
              </li>
            </ul>
          </section>
        </div>
      </div>

      {/* Simulator Visual Block */}
      {kellyResults.isValid && (
        <section className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm grid gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#e0e5dc] pb-4">
            <div>
              <h3 className="text-lg font-bold text-[#17201b] flex items-center gap-1.5">
                <TrendingUp className="h-5 w-5 text-[#0f766e]" />
                Giả lập 50 lệnh ngẫu nhiên & So sánh sụt giảm vốn
              </h3>
              <p className="text-xs text-[#66736c] mt-1">
                Chạy mô phỏng 50 lệnh liên tiếp dựa trên xác suất thắng {winRate}%. Xem cách các chiến lược đi vốn sinh lời và đối phó với chuỗi thua tự nhiên.
              </p>
            </div>
            <button
              onClick={() => setSimulationSeed(prev => prev + 1)}
              className="flex items-center gap-1.5 text-xs font-bold text-[#0f766e] bg-[#edf4ef] hover:bg-[#dcefe0] px-3.5 py-2 rounded-md transition-all self-start"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Tái mô phỏng (Random mới)
            </button>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            {/* SVG Chart Render */}
            <div className="overflow-x-auto">
              <div className="min-w-[600px] relative">
                <svg
                  width="100%"
                  height={chartSvg.height}
                  viewBox={`0 0 ${chartSvg.width} ${chartSvg.height}`}
                  className="overflow-visible font-mono"
                >
                  {/* Grid Lines */}
                  {chartSvg.gridLines.map((line, idx) => (
                    <g key={idx}>
                      <line
                        x1={chartSvg.padding.left}
                        y1={line.y}
                        x2={chartSvg.width - chartSvg.padding.right}
                        y2={line.y}
                        stroke="#edf0eb"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                      />
                      <text
                        x={chartSvg.padding.left - 8}
                        y={line.y + 4}
                        textAnchor="end"
                        fontSize="10"
                        fill="#66736c"
                      >
                        {line.y === chartSvg.height - chartSvg.padding.bottom ? "0" : line.label}
                      </text>
                    </g>
                  ))}

                  {/* Axis */}
                  <line
                    x1={chartSvg.padding.left}
                    y1={chartSvg.height - chartSvg.padding.bottom}
                    x2={chartSvg.width - chartSvg.padding.right}
                    y2={chartSvg.height - chartSvg.padding.bottom}
                    stroke="#d9ddd3"
                    strokeWidth="1.5"
                  />

                  <text
                    x={chartSvg.getX(0)}
                    y={chartSvg.height - chartSvg.padding.bottom + 16}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#66736c"
                  >
                    Lệnh 0
                  </text>
                  <text
                    x={chartSvg.getX(25)}
                    y={chartSvg.height - chartSvg.padding.bottom + 16}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#66736c"
                  >
                    Lệnh 25
                  </text>
                  <text
                    x={chartSvg.getX(50)}
                    y={chartSvg.height - chartSvg.padding.bottom + 16}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#66736c"
                  >
                    Lệnh 50
                  </text>

                  {/* Drawdown limit line (50% ruin threshold) */}
                  <line
                    x1={chartSvg.padding.left}
                    y1={chartSvg.getY(capital * 0.5)}
                    x2={chartSvg.width - chartSvg.padding.right}
                    y2={chartSvg.getY(capital * 0.5)}
                    stroke="rgba(239, 68, 68, 0.4)"
                    strokeWidth="1.5"
                    strokeDasharray="6 3"
                  />
                  <text
                    x={chartSvg.width - chartSvg.padding.right + 6}
                    y={chartSvg.getY(capital * 0.5) + 3}
                    fontSize="9"
                    fill="#ef4444"
                    fontWeight="bold"
                  >
                    Giảm 50%
                  </text>

                  {/* Path: Over-betting (Red) */}
                  <path
                    d={chartSvg.paths.overBet}
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="1.5"
                    strokeOpacity="0.8"
                  />

                  {/* Path: Full Kelly (Orange) */}
                  <path
                    d={chartSvg.paths.fullKelly}
                    fill="none"
                    stroke="#ea580c"
                    strokeWidth="1.5"
                    strokeOpacity="0.85"
                  />

                  {/* Path: Quarter Kelly (Teal) */}
                  <path
                    d={chartSvg.paths.quarterKelly}
                    fill="none"
                    stroke="#0d9488"
                    strokeWidth="1.5"
                    strokeOpacity="0.8"
                  />

                  {/* Path: Half Kelly (Green/Emerald - Recommended) */}
                  <path
                    d={chartSvg.paths.halfKelly}
                    fill="none"
                    stroke="#166534"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* Statistics comparison table */}
            <div className="flex flex-col justify-between">
              <div>
                <p className="text-xs font-bold uppercase text-[#5b6861] mb-2.5">So sánh hiệu năng 4 chiến lược</p>
                <div className="grid gap-2 text-xs">
                  {/* Half Kelly (Emerald) */}
                  <div className="border border-[#b9d9c5] bg-[#f4faf6] rounded-md p-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 bg-[#166534] rounded-full shrink-0" />
                      <span className="font-bold text-[#166534]">Half Kelly ({kellyFraction}x): {kellyResults.adjustedKellyPct.toFixed(1)}% vốn</span>
                    </div>
                    <div className="mt-1.5 grid grid-cols-2 gap-1 text-[#4a5a52]">
                      <div>Tài sản cuối: <b className="font-mono text-[#17201b]">{formatPoints(simResults.halfKelly.finalCapital)}</b></div>
                      <div>Sụt giảm Max: <b className="font-mono text-[#991b1b]">{simResults.halfKelly.maxDrawdown.toFixed(1)}%</b></div>
                    </div>
                  </div>

                  {/* Quarter Kelly (Teal) */}
                  <div className="border border-teal-100 bg-[#f0fdfa] rounded-md p-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 bg-[#0d9488] rounded-full shrink-0" />
                      <span className="font-bold text-teal-800">Quarter Kelly (0.25x): {(kellyResults.rawKellyPct * 0.25).toFixed(1)}% vốn</span>
                    </div>
                    <div className="mt-1.5 grid grid-cols-2 gap-1 text-[#4a5a52]">
                      <div>Tài sản cuối: <b className="font-mono text-[#17201b]">{formatPoints(simResults.quarterKelly.finalCapital)}</b></div>
                      <div>Sụt giảm Max: <b className="font-mono text-[#991b1b]">{simResults.quarterKelly.maxDrawdown.toFixed(1)}%</b></div>
                    </div>
                  </div>

                  {/* Full Kelly (Orange) */}
                  <div className="border border-orange-100 bg-[#fffbf7] rounded-md p-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 bg-[#ea580c] rounded-full shrink-0" />
                      <span className="font-bold text-orange-800">Full Kelly (1.0x): {kellyResults.rawKellyPct.toFixed(1)}% vốn</span>
                    </div>
                    <div className="mt-1.5 grid grid-cols-2 gap-1 text-[#4a5a52]">
                      <div>Tài sản cuối: <b className="font-mono text-[#17201b]">{formatPoints(simResults.fullKelly.finalCapital)}</b></div>
                      <div>Sụt giảm Max: <b className="font-mono text-[#991b1b]">{simResults.fullKelly.maxDrawdown.toFixed(1)}%</b></div>
                    </div>
                  </div>

                  {/* Over-betting (Red) */}
                  <div className="border border-red-100 bg-[#fff5f5] rounded-md p-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 bg-[#ef4444] rounded-full shrink-0" />
                      <span className="font-bold text-red-800">Quá tay / All-in lớn: {simResults.overBet.rate.toFixed(1)}% vốn</span>
                    </div>
                    <div className="mt-1.5 grid grid-cols-2 gap-1 text-[#4a5a52]">
                      <div>Tài sản cuối: <b className="font-mono text-[#17201b]">{formatPoints(simResults.overBet.finalCapital)}</b></div>
                      <div>Sụt giảm Max: <b className="font-mono text-[#ef4444]">{simResults.overBet.maxDrawdown.toFixed(1)}%</b></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Conclusion */}
              <p className="text-[11px] text-[#66736c] leading-relaxed italic mt-4 border-t border-[#edf0eb] pt-2.5">
                *Đường đi màu xanh lá (Half Kelly) thường mang lại trạng thái cân bằng tốt nhất trong thực tế: nó tăng trưởng ổn định trong chuỗi thắng và giảm thiểu nguy cơ &ldquo;cháy&rdquo; hoặc sụt giảm nặng nề khi gặp chuỗi thua lỗ tự nhiên ngẫu nhiên.
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
