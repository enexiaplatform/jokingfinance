"use client";

import { useState, useMemo } from "react";
import { formatPoints, formatPercent, formatNumber } from "@/lib/format";
import {
  AlertTriangle,
  RefreshCw,
  ShieldAlert,
  Info,
  ArrowRight,
  BookOpen
} from "lucide-react";
import Link from "next/link";
import { useVirtualPortfolio } from "./use-virtual-portfolio";

const PRESETS = [
  {
    name: "Quản trị chuẩn (Kỷ luật 1%)",
    winRate: 50,
    rrr: 2.0,
    riskPercent: 1.0,
    drawdownLimit: 30,
    tradesCount: 50,
    description: "Quy chuẩn của quỹ chuyên nghiệp. Rủi ro 1% mỗi lệnh giúp sống sót qua mọi chuỗi thua tự nhiên."
  },
  {
    name: "Tự tin quá đà (Risk 5%)",
    winRate: 50,
    rrr: 1.8,
    riskPercent: 5.0,
    drawdownLimit: 30,
    tradesCount: 50,
    description: "Nhà đầu tư cá nhân tự tin All-in hoặc đi lệnh lớn. Rủi ro chạm ngưỡng sụt giảm tăng vọt."
  },
  {
    name: "Con bạc khát nước (Risk 15%)",
    winRate: 45,
    rrr: 1.5,
    riskPercent: 15.0,
    drawdownLimit: 50,
    tradesCount: 50,
    description: "Mạo hiểm cực lớn để gỡ gạc hoặc muốn x2 nhanh. Hầu như chắc chắn cháy tài khoản."
  },
  {
    name: "Săn xu hướng (Low Win, High RRR)",
    winRate: 35,
    rrr: 3.0,
    riskPercent: 2.0,
    drawdownLimit: 30,
    tradesCount: 50,
    description: "Tỷ lệ thắng thấp nhưng khi thắng được rất nhiều. Vẫn an toàn nhờ quản trị vốn chặt."
  }
];

export function RuinTool() {
  const { summary } = useVirtualPortfolio();
  
  // Starting capital from virtual portfolio or default 100M
  const portfolioValue = useMemo(() => {
    return summary?.portfolioValue || 100000000;
  }, [summary]);

  // Inputs
  const [winRate, setWinRate] = useState<number>(50);
  const [rrr, setRrr] = useState<number>(2.0);
  const [riskPercent, setRiskPercent] = useState<number>(2.0);
  const [drawdownLimit, setDrawdownLimit] = useState<number>(30);
  const [tradesCount, setTradesCount] = useState<number>(50);
  const [startingCapital, setStartingCapital] = useState<number>(portfolioValue);
  
  // Simulation seed/trigger
  const [simSeed, setSimSeed] = useState<number>(0);

  // Sync starting capital with portfolio
  const [prevPortfolioValue, setPrevPortfolioValue] = useState(portfolioValue);
  if (portfolioValue !== prevPortfolioValue) {
    setPrevPortfolioValue(portfolioValue);
    setStartingCapital(portfolioValue);
  }

  // Pre-calculated stats and Monte Carlo simulation paths
  const simResults = useMemo(() => {
    const runCount = 100; // Run 100 simulation paths
    const paths: number[][] = [];
    let ruinCount = 0;
    let sumMaxDrawdown = 0;
    const finalBalances: number[] = [];
    
    // Pure deterministic hash function for generating random values without mutating state
    const getRandVal = (path: number, step: number) => {
      let h = (simSeed + 1) ^ (path * 1000 + step);
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
    };
    
    for (let pathIdx = 0; pathIdx < runCount; pathIdx++) {
      let balance = startingCapital;
      const pathPoints = [balance];
      let maxDrawdownInPath = 0;
      let peak = balance;
      let pathRuined = false;

      for (let t = 0; t < tradesCount; t++) {
        const randVal = getRandVal(pathIdx, t);
        const isWin = randVal < winRate / 100;
        const riskAmount = balance * (riskPercent / 100);
        
        if (isWin) {
          balance += riskAmount * rrr;
        } else {
          balance -= riskAmount;
        }
        
        if (balance < 0) balance = 0;
        pathPoints.push(balance);

        // Update peak & drawdown
        if (balance > peak) {
          peak = balance;
        }
        const drawdown = peak > 0 ? ((peak - balance) / peak) * 100 : 100;
        if (drawdown > maxDrawdownInPath) {
          maxDrawdownInPath = drawdown;
        }

        // Drawdown relative to STARTING capital
        const dropFromStart = ((startingCapital - balance) / startingCapital) * 100;
        if (dropFromStart >= drawdownLimit) {
          pathRuined = true;
        }
      }

      if (pathRuined) {
        ruinCount++;
      }
      sumMaxDrawdown += maxDrawdownInPath;
      finalBalances.push(balance);
      paths.push(pathPoints);
    }

    // Sort final balances to get median and percentiles
    finalBalances.sort((a, b) => a - b);
    const medianFinal = finalBalances[Math.floor(runCount / 2)];
    const worstFinal = finalBalances[0];
    const bestFinal = finalBalances[runCount - 1];
    
    const riskOfRuinPercent = (ruinCount / runCount) * 100;
    const avgMaxDrawdown = sumMaxDrawdown / runCount;

    return {
      paths,
      riskOfRuinPercent,
      avgMaxDrawdown,
      medianFinal,
      worstFinal,
      bestFinal,
      ruinCount
    };
  }, [winRate, rrr, riskPercent, drawdownLimit, tradesCount, startingCapital, simSeed]);

  // Apply Preset
  const handleApplyPreset = (preset: typeof PRESETS[0]) => {
    setWinRate(preset.winRate);
    setRrr(preset.rrr);
    setRiskPercent(preset.riskPercent);
    setDrawdownLimit(preset.drawdownLimit);
    setTradesCount(preset.tradesCount);
  };

  // Generate recommendation notes
  const diagnostics = useMemo(() => {
    const { riskOfRuinPercent } = simResults;
    if (riskOfRuinPercent > 70) {
      return {
        title: "🔥 RẤT NGUY HIỂM (Cháy tài khoản gần như tuyệt đối)",
        color: "text-[#b91c1c] bg-[#fef2f2] border-[#fee2e2]",
        desc: "Xác suất bạn chạm ngưỡng sụt giảm tài sản mong muốn là cực kỳ cao. Nguyên nhân chính là rủi ro mỗi lệnh (Risk Per Trade) quá lớn. Trong đầu tư, chuỗi thua lỗ 5-7 lệnh liên tục là hoàn toàn tự nhiên và chắc chắn xảy ra. Với tỷ lệ rủi ro này, bạn sẽ cháy tài khoản trước khi kịp có lệnh thắng để bù đắp.",
        action: "Hãy giảm ngay phần trăm rủi ro mỗi lệnh xuống dưới 2% và cố gắng tăng RRR lên trên 1.5."
      };
    } else if (riskOfRuinPercent > 30) {
      return {
        title: "⚠️ RỦI RO CAO (Tâm lý sẽ bị bẻ gãy)",
        color: "text-[#b45309] bg-[#fffbeb] border-[#fef3c7]",
        desc: "Xác suất sụt giảm tài sản ở mức đáng kể. Dù có thể bạn không cháy túi hoàn toàn, nhưng mức drawdown trung bình cao sẽ khiến bạn hoảng loạn, dẫn đến việc bán tháo đúng đáy hoặc từ bỏ hệ thống giao dịch của mình.",
        action: "Hãy giảm quy mô vị thế (Risk Per Trade) xuống còn 1.5% - 2% để giữ drawdown tối đa dưới 20%."
      };
    } else if (riskOfRuinPercent > 5) {
      return {
        title: "⚖️ RỦI RO TRUNG BÌNH (Chấp nhận được)",
        color: "text-[#1e3a8a] bg-[#eff6ff] border-[#dbeafe]",
        desc: "Quy trình phân bổ tương đối ổn. Rủi ro phá sản được kiểm soát tốt nhưng vẫn có xác suất nhỏ gặp chuỗi thiên nga đen liên tiếp làm sụt giảm sâu tài sản.",
        action: "Hãy kiểm tra xem bạn có thể nâng nhẹ tỷ lệ RRR hoặc tăng nhẹ tỷ lệ thắng bằng cách chắt lọc điểm vào lệnh không."
      };
    } else {
      return {
        title: "🛡️ AN TOÀN TOÁN HỌC (Chuẩn Kỷ Luật JokingFinance)",
        color: "text-[#166534] bg-[#edf6ed] border-[#b9d9c5]",
        desc: "Tuyệt vời! Lợi thế toán học của bạn (Win Rate & RRR) kết hợp với quản trị vốn chặt chẽ (Risk 1-2%) tạo ra một hệ thống gần như miễn nhiễm với rủi ro cháy tài khoản. Dù gặp chuỗi 10 lệnh thua liên tục, tài sản của bạn vẫn sụt giảm rất nhẹ và dễ dàng hồi phục khi thị trường thuận lợi trở lại.",
        action: "Hãy tiếp tục duy trì kỷ luật này ở tài khoản ảo lẫn tài khoản thật!"
      };
    }
  }, [simResults]);

  // SVG Chart Dimensions & Processing
  const chartSvg = useMemo(() => {
    const { paths } = simResults;
    // We only render 15 paths to keep the SVG clean and readable
    const pathsToRender = paths.slice(0, 15);
    
    const width = 600;
    const height = 280;
    const padding = { top: 20, right: 80, bottom: 30, left: 60 };

    // Find min/max capital across all paths to scale Y
    let minVal = startingCapital;
    let maxVal = startingCapital;
    
    pathsToRender.forEach(p => {
      p.forEach(v => {
        if (v < minVal) minVal = v;
        if (v > maxVal) maxVal = v;
      });
    });

    // Make sure drawdown limit line is visible in scale
    const ruinThreshold = startingCapital * (1 - drawdownLimit / 100);
    if (ruinThreshold < minVal) minVal = ruinThreshold;
    
    // Add 10% buffer
    const range = maxVal - minVal;
    minVal = Math.max(0, minVal - range * 0.05);
    maxVal = maxVal + range * 0.05;

    // Helper functions for coordinates
    const getX = (index: number) => {
      return padding.left + (index / tradesCount) * (width - padding.left - padding.right);
    };

    const getY = (val: number) => {
      const scale = (height - padding.top - padding.bottom) / (maxVal - minVal || 1);
      return height - padding.bottom - (val - minVal) * scale;
    };

    // Draw grid lines
    const gridLines = [];
    const stepCount = 4;
    for (let i = 0; i <= stepCount; i++) {
      const val = minVal + (i / stepCount) * (maxVal - minVal);
      const y = getY(val);
      gridLines.push({
        y,
        label: formatNumber(val / 1000000) + "M"
      });
    }

    // Parse path string
    const renderedPaths = pathsToRender.map((path) => {
      const pointsStr = path.map((val, stepIdx) => `${getX(stepIdx)},${getY(val)}`).join(" L ");
      const d = `M ${pointsStr}`;
      
      // Determine if this path touched the ruin threshold
      const hasTouchedRuin = path.some(val => val <= ruinThreshold);
      
      return {
        d,
        color: hasTouchedRuin ? "rgba(239, 68, 68, 0.4)" : "rgba(16, 185, 129, 0.5)",
        strokeWidth: hasTouchedRuin ? 1.5 : 2,
        isRuined: hasTouchedRuin
      };
    });

    const thresholdY = getY(ruinThreshold);

    return {
      width,
      height,
      padding,
      gridLines,
      renderedPaths,
      thresholdY,
      ruinThreshold,
      getX,
      getY
    };
  }, [simResults, startingCapital, drawdownLimit, tradesCount]);

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      {/* Left Column: Inputs & Controls */}
      <div className="flex flex-col gap-5">
        <section className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert className="h-5 w-5 text-[#0f766e]" />
            <h2 className="text-lg font-bold text-[#17201b]">Thiết lập giả lập Monte Carlo</h2>
          </div>

          {/* Preset buttons */}
          <div className="mb-5">
            <p className="text-xs font-bold uppercase text-[#5b6861] mb-2">Chọn nhanh kịch bản:</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {PRESETS.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="p-2.5 text-left text-xs border border-[#d9ddd3] hover:border-[#0f766e] bg-white hover:bg-[#f8fbf7] rounded-md transition-all group"
                >
                  <p className="font-bold text-[#17201b] group-hover:text-[#0f766e]">{p.name}</p>
                  <p className="text-[11px] text-[#5b6861] mt-0.5 leading-4 line-clamp-2">{p.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="grid gap-1.5 text-xs font-bold uppercase text-[#5b6861]">
                Vốn ban đầu mô phỏng (Điểm ảo hoặc VND)
                <input
                  type="number"
                  value={startingCapital}
                  onChange={(e) => setStartingCapital(Math.max(1000000, Number(e.target.value)))}
                  className="h-10 mt-1 rounded-md border border-[#d9ddd3] px-3 font-mono font-semibold text-sm text-[#17201b]"
                />
              </label>
            </div>

            <label className="grid gap-1.5 text-xs font-bold uppercase text-[#5b6861]">
              Tỷ lệ thắng mong muốn (Win Rate: {winRate}%)
              <input
                type="range"
                min={10}
                max={90}
                step={1}
                value={winRate}
                onChange={(e) => setWinRate(Number(e.target.value))}
                className="mt-2 accent-[#0f766e]"
              />
              <span className="text-[10px] text-[#5b6861] normal-case">Tần suất thắng dự kiến của phương pháp giao dịch.</span>
            </label>

            <label className="grid gap-1.5 text-xs font-bold uppercase text-[#5b6861]">
              Tỷ lệ Lợi nhuận/Rủi ro (RRR: {rrr.toFixed(1)}:1)
              <input
                type="range"
                min={0.5}
                max={5.0}
                step={0.1}
                value={rrr}
                onChange={(e) => setRrr(Number(e.target.value))}
                className="mt-2 accent-[#0f766e]"
              />
              <span className="text-[10px] text-[#5b6861] normal-case">Tỷ lệ: Trung bình một lệnh thắng ăn gấp bao nhiêu lần lệnh thua.</span>
            </label>

            <label className="grid gap-1.5 text-xs font-bold uppercase text-[#5b6861]">
              Rủi ro mỗi lệnh (% Vốn: {riskPercent}%)
              <input
                type="range"
                min={0.5}
                max={25.0}
                step={0.5}
                value={riskPercent}
                onChange={(e) => setRiskPercent(Number(e.target.value))}
                className="mt-2 accent-[#0f766e]"
              />
              {riskPercent > 5 && (
                <span className="text-[10px] text-[#b91c1c] font-bold mt-1">
                  ⚠️ Báo động: Rủi ro &gt; 5% mỗi lệnh cực kỳ nguy hiểm cho vốn!
                </span>
              )}
            </label>

            <label className="grid gap-1.5 text-xs font-bold uppercase text-[#5b6861]">
              Giới hạn sụt giảm (Drawdown Limit: {drawdownLimit}%)
              <input
                type="range"
                min={10}
                max={100}
                step={5}
                value={drawdownLimit}
                onChange={(e) => setDrawdownLimit(Number(e.target.value))}
                className="mt-2 accent-[#0f766e]"
              />
              <span className="text-[10px] text-[#5b6861] normal-case">Mức sụt giảm từ đỉnh tài sản coi như đầu tư thất bại.</span>
            </label>

            <div className="sm:col-span-2">
              <label className="grid gap-1.5 text-xs font-bold uppercase text-[#5b6861]">
                Số lệnh mô phỏng liên tiếp (Chu kỳ kiểm nghiệm: {tradesCount} lệnh)
                <input
                  type="range"
                  min={10}
                  max={100}
                  step={5}
                  value={tradesCount}
                  onChange={(e) => setTradesCount(Number(e.target.value))}
                  className="mt-2 accent-[#0f766e]"
                />
              </label>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between pt-4 border-t border-[#edf0eb]">
            <span className="text-xs text-[#5b6861] flex items-center gap-1.5">
              <Info className="h-4 w-4 text-[#0f766e]" />
              Monte Carlo chạy 100 kịch bản ngẫu nhiên.
            </span>
            <button
              onClick={() => setSimSeed(prev => prev + 1)}
              className="px-4 py-2 bg-[#f0fbf4] hover:bg-[#dcfce7] border border-[#b9d9c5] hover:border-[#0f766e] text-[#0f766e] text-xs font-bold rounded-md flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Tái mô phỏng
            </button>
          </div>
        </section>

        {/* Diagnostic Explanation */}
        <section className={`rounded-md border p-5 shadow-sm transition-all ${diagnostics.color}`}>
          <h3 className="font-bold text-sm uppercase flex items-center gap-1.5">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            {diagnostics.title}
          </h3>
          <p className="mt-3 text-sm leading-6">{diagnostics.desc}</p>
          <div className="mt-4 pt-3.5 border-t border-current/10 text-xs">
            <span className="font-bold">Đề xuất hành động:</span> {diagnostics.action}
          </div>
        </section>
      </div>

      {/* Right Column: Visualization & Results */}
      <div className="flex flex-col gap-5">
        <section className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-[#17201b] mb-4">Kết quả mô phỏng Monte Carlo</h2>

          {/* Results KPIs */}
          <div className="grid gap-3 sm:grid-cols-3 mb-6">
            <div className="p-3.5 bg-[#f8fbf7] border border-[#edf0eb] rounded-md text-center">
              <p className="text-[11px] font-bold text-[#5b6861] uppercase">Xác suất phá sản</p>
              <p className={`text-2xl font-black mt-1 ${
                simResults.riskOfRuinPercent > 50 ? "text-[#b91c1c]" : 
                simResults.riskOfRuinPercent > 20 ? "text-[#b45309]" : "text-[#166534]"
              }`}>
                {simResults.riskOfRuinPercent}%
              </p>
              <p className="text-[10px] text-[#5b6861] mt-0.5">({simResults.ruinCount}/100 lần chạm ngưỡng)</p>
            </div>

            <div className="p-3.5 bg-[#f8fbf7] border border-[#edf0eb] rounded-md text-center">
              <p className="text-[11px] font-bold text-[#5b6861] uppercase">Sụt giảm lớn nhất TB</p>
              <p className="text-2xl font-black text-[#17201b] mt-1">
                {simResults.avgMaxDrawdown.toFixed(1)}%
              </p>
              <p className="text-[10px] text-[#5b6861] mt-0.5">Average Max DD</p>
            </div>

            <div className="p-3.5 bg-[#f8fbf7] border border-[#edf0eb] rounded-md text-center">
              <p className="text-[11px] font-bold text-[#5b6861] uppercase">Tài sản trung vị</p>
              <p className="text-xl font-bold text-[#0f766e] mt-1.5 font-mono">
                {Math.round(simResults.medianFinal / 1000000)}M
              </p>
              <p className={`text-[10px] font-semibold mt-0.5 ${
                simResults.medianFinal >= startingCapital ? "text-[#166534]" : "text-[#b91c1c]"
              }`}>
                {formatPercent(((simResults.medianFinal - startingCapital) / startingCapital) * 100)}
              </p>
            </div>
          </div>

          {/* SVG Chart */}
          <div className="relative border border-[#e0e5dc] rounded-md bg-[#fafbfa] p-2 overflow-x-auto">
            <p className="text-[11px] font-semibold text-[#5b6861] text-center mb-1">
              Đường đi của 15 tài khoản ảo giả định (Xanh: Sống sót | Đỏ: Chạm giới hạn)
            </p>
            
            <svg
              width="100%"
              height={chartSvg.height}
              viewBox={`0 0 ${chartSvg.width} ${chartSvg.height}`}
              className="min-w-[500px]"
            >
              {/* Y Axis grid lines & labels */}
              {chartSvg.gridLines.map((line, idx) => (
                <g key={idx}>
                  <line
                    x1={chartSvg.padding.left}
                    y1={line.y}
                    x2={chartSvg.width - chartSvg.padding.right}
                    y2={line.y}
                    stroke="#e2e8f0"
                    strokeWidth="1"
                    strokeDasharray="4,4"
                  />
                  <text
                    x={chartSvg.padding.left - 8}
                    y={line.y + 4}
                    textAnchor="end"
                    className="text-[10px] font-mono fill-[#64748b]"
                  >
                    {line.label}
                  </text>
                </g>
              ))}

              {/* Drawdown limit line */}
              <line
                x1={chartSvg.padding.left}
                y1={chartSvg.thresholdY}
                x2={chartSvg.width - chartSvg.padding.right}
                y2={chartSvg.thresholdY}
                stroke="#ef4444"
                strokeWidth="2"
                strokeDasharray="6,4"
              />
              <text
                x={chartSvg.width - chartSvg.padding.right + 6}
                y={chartSvg.thresholdY + 3}
                className="text-[10px] font-bold fill-[#ef4444]"
              >
                Giới hạn (-{drawdownLimit}%)
              </text>

              {/* Simulation paths */}
              {chartSvg.renderedPaths.map((path, idx) => (
                <path
                  key={idx}
                  d={path.d}
                  fill="none"
                  stroke={path.color}
                  strokeWidth={path.strokeWidth}
                />
              ))}

              {/* X Axis line */}
              <line
                x1={chartSvg.padding.left}
                y1={chartSvg.height - chartSvg.padding.bottom}
                x2={chartSvg.width - chartSvg.padding.right}
                y2={chartSvg.height - chartSvg.padding.bottom}
                stroke="#94a3b8"
                strokeWidth="1.5"
              />
              {/* X Axis Labels (first, middle, last) */}
              <text
                x={chartSvg.getX(0)}
                y={chartSvg.height - chartSvg.padding.bottom + 16}
                textAnchor="middle"
                className="text-[10px] font-semibold fill-[#64748b]"
              >
                Lệnh 0
              </text>
              <text
                x={chartSvg.getX(Math.floor(tradesCount / 2))}
                y={chartSvg.height - chartSvg.padding.bottom + 16}
                textAnchor="middle"
                className="text-[10px] font-semibold fill-[#64748b]"
              >
                Lệnh {Math.floor(tradesCount / 2)}
              </text>
              <text
                x={chartSvg.getX(tradesCount)}
                y={chartSvg.height - chartSvg.padding.bottom + 16}
                textAnchor="middle"
                className="text-[10px] font-semibold fill-[#64748b]"
              >
                Lệnh {tradesCount}
              </text>
            </svg>
          </div>

          <div className="mt-4 grid gap-2.5 text-xs text-[#5b6861]">
            <div className="flex justify-between border-b border-[#edf0eb] pb-2">
              <span>Trường hợp tệ nhất (Thua liên tục):</span>
              <span className="font-mono font-bold text-[#b91c1c]">{formatPoints(simResults.worstFinal)}</span>
            </div>
            <div className="flex justify-between border-b border-[#edf0eb] pb-2">
              <span>Trường hợp tốt nhất (Gặp may mắn):</span>
              <span className="font-mono font-bold text-[#166534]">{formatPoints(simResults.bestFinal)}</span>
            </div>
            <p className="leading-5 text-[11px] text-[#66736c] italic mt-1">
              * Lưu ý: Mô phỏng này chứng minh sức mạnh của quản trị vị thế. Tỷ lệ thắng 50% nhưng đi lệnh 15% vốn sẽ biến tài khoản thành con số không sau chuỗi thua tự nhiên. Kỷ luật chính là chìa khóa duy nhất để tồn tại.
            </p>
          </div>
        </section>

        <section className="rounded-md border border-[#e0e5dc] bg-[#fdfbf7] p-5 shadow-sm">
          <h3 className="font-bold text-[#17201b] flex items-center gap-1.5">
            <BookOpen className="h-4.5 w-4.5 text-[#0f766e]" />
            Bài học đề xuất về quản trị vốn & vị thế:
          </h3>
          <ul className="mt-3 grid gap-2 text-sm">
            <li>
              <Link
                href="/knowledge/quan-tri-rui-ro/cac-loai-rui-ro"
                className="text-[#0f766e] hover:underline flex items-center gap-1 font-semibold"
              >
                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[#0f766e]" />
                Bài học: Quản trị rủi ro tập trung & Tỷ lệ thua lỗ tự nhiên
              </Link>
            </li>
            <li>
              <Link
                href="/knowledge/tam-ly-dau-tu/fomo-va-tin-nong"
                className="text-[#0f766e] hover:underline flex items-center gap-1 font-semibold"
              >
                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[#0f766e]" />
                Bài học: Tâm lý đầu tư & Kiểm soát lòng tham khi All-in
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
