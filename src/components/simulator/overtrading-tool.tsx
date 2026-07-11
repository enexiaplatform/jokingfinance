"use client";

import { useState, useMemo } from "react";
import { formatCurrency } from "@/lib/format";
import {
  Coins,
  TrendingDown,
  ArrowRight,
  BookOpen,
  Sparkles,
  Percent,
  Calendar,
  ShieldAlert,
  CheckCircle,
  Scale
} from "lucide-react";
import Link from "next/link";

type TradeFrequencyPreset = {
  value: string;
  label: string;
  turnoverRate: number; // annual turnover (e.g. 1.0 = 100% turnover per year)
  description: string;
};

const FREQUENCY_PRESETS: TradeFrequencyPreset[] = [
  {
    value: "hold",
    label: "Mua & Nắm giữ dài hạn",
    turnoverRate: 0.1, // 10% turnover per year
    description: "Hầu như không mua bán, chỉ cơ cấu khi doanh nghiệp thay đổi triển vọng cơ bản."
  },
  {
    value: "bi-annual",
    label: "Đầu tư bán niên (6 tháng/lần)",
    turnoverRate: 2.0, // 200% turnover per year
    description: "Cơ cấu và tái cân bằng danh mục định kỳ mỗi 6 tháng."
  },
  {
    value: "quarterly",
    label: "Giao dịch theo quý (3 tháng/lần)",
    turnoverRate: 4.0, // 400% turnover per year
    description: "Mua bán trung bình mỗi quý một lần theo báo cáo tài chính."
  },
  {
    value: "monthly",
    label: "Giao dịch hàng tháng",
    turnoverRate: 12.0, // 1200% turnover per year
    description: "Đảo danh mục trung bình mỗi tháng 1 lần. Khá năng động."
  },
  {
    value: "weekly",
    label: "Lướt sóng hàng tuần (Overtrading nhẹ)",
    turnoverRate: 50.0, // 5000% turnover per year
    description: "Thích mua bán ngắn hạn theo biểu đồ kỹ thuật hàng tuần."
  },
  {
    value: "daily",
    label: "Đầu cơ T+3 hàng ngày (Cực kỳ nguy hiểm)",
    turnoverRate: 150.0, // 15000% turnover per year
    description: "Giao dịch liên tục mỗi ngày, xoay vòng vốn tối đa để ăn chênh lệch cực ngắn."
  }
];

export function OvertradingTool() {
  const [selectedFrequency, setSelectedFrequency] = useState<string>("weekly");
  const [initialInvestment, setInitialInvestment] = useState<number>(100000000); // 100 million VND
  const [monthlyContribution, setMonthlyContribution] = useState<number>(3000000); // 3 million VND
  const [years, setYears] = useState<number>(10);
  
  // Fee and tax parameters
  const [buyFee, setBuyFee] = useState<number>(0.15); // 0.15%
  const [sellFee, setSellFee] = useState<number>(0.15); // 0.15%
  const [sellTax, setSellTax] = useState<number>(0.10); // 0.10% (standard VN tax)
  
  // Market performance parameters
  const [expectedGrossReturn, setExpectedGrossReturn] = useState<number>(12); // 12% per year
  const [activeAlpha, setActiveAlpha] = useState<number>(0); // 0% default (user thinks they can beat or lag)

  const activePreset = useMemo(() => {
    return FREQUENCY_PRESETS.find(f => f.value === selectedFrequency) || FREQUENCY_PRESETS[3];
  }, [selectedFrequency]);

  // Run simulation data comparing:
  // 1. Ideal Gross (0% fees, 0% tax, no trading cost)
  // 2. Buy & Hold (T = 10% per year)
  // 3. Active Trader (T = activePreset.turnoverRate, return = expected + alpha)
  const simulationResults = useMemo(() => {
    const cycleFee = (buyFee + sellFee + sellTax) / 100;
    
    // Strategy simulation function
    const simulate = (annualTurnover: number, annualGrossReturnRate: number) => {
      let value = initialInvestment;
      let totalContributed = initialInvestment;
      let totalFeesTaxes = 0;
      let grossValueNoFees = initialInvestment; // tracking 0 fee scenario

      const yearlyHistory = [];

      // Monthly simulation parameters
      const monthlyGrossReturn = Math.pow(1 + annualGrossReturnRate / 100, 1 / 12) - 1;
      const monthlyTurnover = annualTurnover / 12;
      const monthlyDrag = monthlyTurnover * cycleFee;
      const netMonthlyReturn = monthlyGrossReturn - monthlyDrag;

      // Passive comparison monthly rate
      const passiveAnnualReturn = expectedGrossReturn / 100;
      const passiveMonthlyGrossReturn = Math.pow(1 + passiveAnnualReturn, 1 / 12) - 1;

      for (let yr = 1; yr <= years; yr++) {
        let yrFeesPaid = 0;

        for (let m = 1; m <= 12; m++) {
          // Add monthly contribution
          totalContributed += monthlyContribution;

          // Apply initial buy fee for the contribution
          const contributionBuyFee = monthlyContribution * (buyFee / 100);
          totalFeesTaxes += contributionBuyFee;
          yrFeesPaid += contributionBuyFee;

          const netMonthlyContribution = monthlyContribution - contributionBuyFee;

          // Calculate start of month value
          const startVal = value + netMonthlyContribution;
          const endVal = startVal * (1 + netMonthlyReturn);
          
          // Calculate fee drag on existing capital for the month
          const averageCap = (startVal + endVal) / 2;
          const monthlyFeeTaxes = averageCap * monthlyDrag;
          totalFeesTaxes += monthlyFeeTaxes;
          yrFeesPaid += monthlyFeeTaxes;

          value = endVal;

          // Track Ideal Gross (0% fees, 0% tax, simple expectedGrossReturn)
          grossValueNoFees = (grossValueNoFees + monthlyContribution) * (1 + passiveMonthlyGrossReturn);
        }

        yearlyHistory.push({
          year: yr,
          totalContributed,
          grossValue: grossValueNoFees,
          netValue: value,
          yearlyFeesPaid: yrFeesPaid,
          cumulativeFeesPaid: totalFeesTaxes,
          dragPercent: ((grossValueNoFees - value) / grossValueNoFees) * 100
        });
      }

      return {
        yearlyHistory,
        finalNetValue: value,
        finalGrossValue: grossValueNoFees,
        totalContributed,
        totalFeesTaxes,
        netCagr: (Math.pow(value / totalContributed, 1 / years) - 1) * 100
      };
    };

    // Simulate Active strategy
    const active = simulate(activePreset.turnoverRate, expectedGrossReturn + activeAlpha);
    
    // Simulate Benchmark Buy & Hold strategy (10% turnover, market return)
    const benchmark = simulate(0.10, expectedGrossReturn);

    return {
      active,
      benchmark,
      ideal: active.finalGrossValue
    };
  }, [initialInvestment, monthlyContribution, years, buyFee, sellFee, sellTax, expectedGrossReturn, activeAlpha, activePreset]);

  const activeResults = simulationResults.active;
  const benchmarkResults = simulationResults.benchmark;

  const dragRatio = ((simulationResults.ideal - activeResults.finalNetValue) / simulationResults.ideal) * 100;
  const feeVsCapitalRatio = (activeResults.totalFeesTaxes / activeResults.totalContributed) * 100;
  const comparisonDiff = benchmarkResults.finalNetValue - activeResults.finalNetValue;

  return (
    <div className="grid gap-6">
      {/* Header */}
      <div className="rounded-md border border-[#d9ddd3] bg-gradient-to-r from-[#f5f7f2] to-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-red-700 p-2 text-white">
            <Scale className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#17201b] flex items-center gap-2">
              Giả lập Bào mòn Lợi nhuận do Giao dịch ngắn hạn (Overtrading)
              <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">Cảnh báo</span>
            </h2>
            <p className="text-sm text-[#5b6861] mt-0.5">
              Trực quan hóa sự tàn phá âm thầm của phí giao dịch và thuế đối với tài sản khi bạn quay vòng danh mục quá nhanh.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Inputs */}
        <div className="space-y-6 lg:col-span-5">
          <div className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-[#17201b] flex items-center gap-1.5 border-b border-[#f0f4ee] pb-3">
              <Sparkles className="h-4.5 w-4.5 text-red-700" />
              Thông số Giao dịch & Thị trường
            </h3>

            {/* Trading Frequency Dropdown */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#5b6861]">Tần suất Giao dịch (Quay vòng vốn)</label>
              <select
                value={selectedFrequency}
                onChange={(e) => setSelectedFrequency(e.target.value)}
                className="w-full rounded-md border border-[#d9ddd3] bg-white px-3 py-2 text-sm text-[#17201b] shadow-sm outline-none focus:border-red-700 focus:ring-1 focus:ring-red-700"
              >
                {FREQUENCY_PRESETS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label} ({f.turnoverRate * 100}%/năm)
                  </option>
                ))}
              </select>
              <p className="text-xs text-amber-700 font-medium mt-1 leading-relaxed">
                ℹ️ Churn Rate: {activePreset.turnoverRate * 100}%/năm (Tổng giá trị mua bán bằng {activePreset.turnoverRate} lần quy mô danh mục).
              </p>
            </div>

            {/* Investment Values sliders */}
            <div className="space-y-3 pt-2">
              <div>
                <div className="flex justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#5b6861]">Vốn ban đầu (VND)</label>
                  <span className="text-xs font-semibold text-red-700">{formatCurrency(initialInvestment)}</span>
                </div>
                <input
                  type="range"
                  min={10000000}
                  max={500000000}
                  step={10000000}
                  value={initialInvestment}
                  onChange={(e) => setInitialInvestment(Number(e.target.value))}
                  className="w-full accent-red-700 h-1.5 rounded-lg bg-[#e0e5dc] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#5b6861]">Góp hàng tháng (VND)</label>
                  <span className="text-xs font-semibold text-red-700">{formatCurrency(monthlyContribution)}</span>
                </div>
                <input
                  type="range"
                  min={1000000}
                  max={20000000}
                  step={500000}
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                  className="w-full accent-red-700 h-1.5 rounded-lg bg-[#e0e5dc] cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#5b6861] block mb-1">Thời gian (Năm)</label>
                  <select
                    value={years}
                    onChange={(e) => setYears(Number(e.target.value))}
                    className="w-full rounded-md border border-[#d9ddd3] bg-white px-2 py-1.5 text-sm text-[#17201b] outline-none"
                  >
                    {[3, 5, 10, 15, 20].map(y => (
                      <option key={y} value={y}>{y} Năm</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#5b6861] block mb-1">Lợi nhuận gộp (%/năm)</label>
                  <input
                    type="number"
                    min={0}
                    max={40}
                    value={expectedGrossReturn}
                    onChange={(e) => setExpectedGrossReturn(Math.max(0, Number(e.target.value)))}
                    className="w-full rounded-md border border-[#d9ddd3] bg-white px-2 py-1.5 text-sm text-[#17201b] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Active Alpha slider */}
            <div className="bg-[#fff8f8] border border-red-100 rounded-md p-3.5 space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-red-800 flex items-center gap-1">
                  Hiệu quả trading chủ động (Alpha)
                  <span className="text-[10px] text-gray-500 font-normal normal-case">(Tự tin đánh bại thị trường)</span>
                </label>
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${activeAlpha >= 0 ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
                  {activeAlpha >= 0 ? `+${activeAlpha}` : activeAlpha}% / năm
                </span>
              </div>
              <input
                type="range"
                min={-10}
                max={10}
                step={0.5}
                value={activeAlpha}
                onChange={(e) => setActiveAlpha(Number(e.target.value))}
                className="w-full accent-red-700 h-1.5 rounded-lg bg-[#e0e5dc] cursor-pointer"
              />
              <p className="text-[11px] text-[#5b6861] leading-relaxed">
                Tỷ suất sinh lời gộp khi trading = <strong>{expectedGrossReturn + activeAlpha}%/năm</strong> (trước phí thuế). Bạn tự tin mình giao dịch giỏi hơn thị trường bao nhiêu % mỗi năm?
              </p>
            </div>
          </div>

          {/* Brokerage Fees and Taxes configuration */}
          <div className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#17201b] flex items-center gap-1">
              <Percent className="h-4 w-4 text-red-700" />
              Thiết lập Thuế & Phí tại Việt Nam
            </h4>
            <div className="grid grid-cols-3 gap-2.5 text-xs pt-1">
              <div>
                <label className="text-[#5b6861] block mb-1">Phí mua (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={buyFee}
                  onChange={(e) => setBuyFee(Math.max(0, Number(e.target.value)))}
                  className="w-full rounded border border-[#d9ddd3] px-2 py-1"
                />
              </div>
              <div>
                <label className="text-[#5b6861] block mb-1">Phí bán (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={sellFee}
                  onChange={(e) => setSellFee(Math.max(0, Number(e.target.value)))}
                  className="w-full rounded border border-[#d9ddd3] px-2 py-1"
                />
              </div>
              <div>
                <label className="text-[#5b6861] block mb-1">Thuế bán (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={sellTax}
                  onChange={(e) => setSellTax(Math.max(0, Number(e.target.value)))}
                  className="w-full rounded border border-[#d9ddd3] px-2 py-1"
                />
              </div>
            </div>
            <div className="text-[11px] text-[#5b6861] border-t border-[#f0f4ee] pt-2 leading-relaxed">
              📌 Tổng chi phí thuế một vòng giao dịch (khứ hồi):{" "}
              <strong className="text-red-700">{(buyFee + sellFee + sellTax).toFixed(2)}%</strong> trên khối lượng tài sản luân chuyển.
            </div>
          </div>
        </div>

        {/* Right Column: Simulation Results */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main metric cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-md border border-[#e0e5dc] bg-white p-4 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-5">
                <TrendingDown className="h-16 w-16 text-red-700" />
              </div>
              <span className="text-xs font-bold text-[#5b6861] uppercase tracking-wider block">Tài sản ròng sau thuế phí</span>
              <span className="text-2xl font-extrabold text-[#17201b] mt-1.5 block">
                {formatCurrency(activeResults.finalNetValue)}
              </span>
              <span className={`text-xs font-semibold mt-1 block ${activeResults.netCagr >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                Lợi nhuận ròng thực tế (Net CAGR): {activeResults.netCagr.toFixed(2)}%/năm
              </span>
            </div>

            <div className="rounded-md border border-red-200 bg-[#fffdfd] p-4 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-5">
                <Coins className="h-16 w-16 text-red-700" />
              </div>
              <span className="text-xs font-bold text-red-800 uppercase tracking-wider block">Thuế & Phí Đã Nộp Lũy Kế</span>
              <span className="text-2xl font-extrabold text-red-700 mt-1.5 block">
                {formatCurrency(activeResults.totalFeesTaxes)}
              </span>
              <span className="text-xs text-red-700 font-semibold mt-1 block">
                Tương đương {feeVsCapitalRatio.toFixed(1)}% vốn gốc bạn bỏ ra!
              </span>
            </div>

            <div className="rounded-md border border-[#e0e5dc] bg-white p-4 shadow-sm">
              <span className="text-xs font-bold text-[#5b6861] uppercase tracking-wider block">Tổng số vốn tự có đã góp</span>
              <span className="text-xl font-bold text-[#17201b] mt-1 block">
                {formatCurrency(activeResults.totalContributed)}
              </span>
              <p className="text-xs text-[#5b6861] mt-1 leading-tight">
                Vốn tự có tích lũy từ đóng góp hàng tháng.
              </p>
            </div>

            <div className="rounded-md border border-[#e0e5dc] bg-white p-4 shadow-sm">
              <span className="text-xs font-bold text-[#5b6861] uppercase tracking-wider block">Hao hụt do thuế phí (Drag Ratio)</span>
              <span className="text-xl font-bold text-red-700 mt-1 block">
                {dragRatio.toFixed(1)}%
              </span>
              <p className="text-xs text-[#5b6861] mt-1 leading-tight">
                Tỷ lệ tài sản bị mất đi so với kịch bản không mất phí thuế.
              </p>
            </div>
          </div>

          {/* Active Trading vs Buy & Hold Comparison Card */}
          <div className="rounded-md border border-amber-200 bg-gradient-to-br from-amber-50/30 via-white to-white p-5 shadow-sm space-y-4">
            <h4 className="font-bold text-[#17201b] flex items-center gap-1.5 text-sm uppercase tracking-wider">
              <Scale className="h-4.5 w-4.5 text-amber-700" />
              So Sánh Đầu Cơ Chủ Động vs. Mua & Nắm Giữ Dài Hạn
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-md border border-red-200 bg-[#fffaf9] p-4">
                <span className="text-xs font-bold text-red-800 block">Đầu cơ chủ động ({activePreset.label})</span>
                <div className="mt-2.5">
                  <span className="text-xs text-[#5b6861] block">Tài sản ròng:</span>
                  <span className="text-lg font-bold text-[#17201b]">{formatCurrency(activeResults.finalNetValue)}</span>
                </div>
                <div className="mt-1">
                  <span className="text-xs text-[#5b6861] block">Lợi nhuận ròng:</span>
                  <span className="text-sm font-semibold text-red-700">{activeResults.netCagr.toFixed(2)}%/năm</span>
                </div>
                <div className="mt-1">
                  <span className="text-xs text-[#5b6861] block">Chi phí đã nộp:</span>
                  <span className="text-sm font-medium text-red-700">{formatCurrency(activeResults.totalFeesTaxes)}</span>
                </div>
              </div>

              <div className="rounded-md border border-emerald-200 bg-[#f9fdfa] p-4">
                <span className="text-xs font-bold text-emerald-800 block">Mua & Nắm giữ dài hạn (B&H)</span>
                <div className="mt-2.5">
                  <span className="text-xs text-[#5b6861] block">Tài sản ròng:</span>
                  <span className="text-lg font-bold text-[#17201b]">{formatCurrency(benchmarkResults.finalNetValue)}</span>
                </div>
                <div className="mt-1">
                  <span className="text-xs text-[#5b6861] block">Lợi nhuận ròng:</span>
                  <span className="text-sm font-semibold text-emerald-700">{benchmarkResults.netCagr.toFixed(2)}%/năm</span>
                </div>
                <div className="mt-1">
                  <span className="text-xs text-[#5b6861] block">Chi phí đã nộp:</span>
                  <span className="text-sm font-medium text-[#5b6861]">{formatCurrency(benchmarkResults.totalFeesTaxes)}</span>
                </div>
              </div>
            </div>

            {/* Analysis message */}
            {comparisonDiff > 0 ? (
              <div className="rounded bg-red-50 border border-red-100 p-3 text-xs text-red-800 space-y-1">
                <p className="font-bold flex items-center gap-1">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  Bạn đã làm giàu cho Công ty chứng khoán & Thuế cục bộ!
                </p>
                <p className="leading-relaxed">
                  Bằng cách giao dịch quá mức, tài khoản của bạn đã bị hụt mất <strong>{formatCurrency(comparisonDiff)}</strong> so với việc chỉ đơn giản là mua rồi nắm giữ thụ động. Ngay cả khi bạn trading giỏi hơn và tạo ra lợi thế gộp +{activeAlpha}%/năm (Alpha), lực cản từ thuế phí khứ hồi {((buyFee + sellFee + sellTax)).toFixed(2)}% cộng dồn tần suất đảo danh mục quá cao vẫn nuốt chửng toàn bộ lợi nhuận của bạn!
                </p>
              </div>
            ) : (
              <div className="rounded bg-emerald-50 border border-emerald-100 p-3 text-xs text-emerald-800 space-y-1">
                <p className="font-bold flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  Đầu tư thông minh, chi phí tối thiểu!
                </p>
                <p className="leading-relaxed">
                  Tần suất giao dịch của bạn đủ thấp hoặc lợi thế giao dịch chủ động (Alpha) của bạn quá xuất sắc giúp bạn chiến thắng lực cản chi phí. Tuy nhiên, hãy cực kỳ cẩn thận: để liên tục đánh bại thị trường {activeAlpha}%/năm trong {years} năm qua hàng ngàn giao dịch là điều cực kỳ hiếm hoi đối với 99% nhà đầu tư cá nhân trên thực tế.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Year-by-year details table */}
      <div className="rounded-md border border-[#e0e5dc] bg-white shadow-sm overflow-hidden">
        <div className="border-b border-[#f0f4ee] bg-[#f9faf8] px-5 py-4 flex justify-between items-center">
          <h3 className="font-bold text-[#17201b] text-sm uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="h-4.5 w-4.5 text-red-700" />
            Bảng Số Liệu Chi Tiết Từng Năm (Giao Dịch Chủ Động)
          </h3>
          <span className="text-xs text-[#5b6861] font-medium">Đơn vị: VND</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-[#f0f4ee] bg-[#fdfbf7] text-[#5b6861] text-xs font-bold uppercase">
                <th className="px-4 py-3">Năm</th>
                <th className="px-4 py-3">Tổng Vốn Đã Góp</th>
                <th className="px-4 py-3">Tài Sản Gộp (0% Phí Thuế)</th>
                <th className="px-4 py-3">Tài Sản Ròng Thực Nhận</th>
                <th className="px-4 py-3 text-red-700">Phí Thuế Lũy Kế Đã Trả</th>
                <th className="px-4 py-3 text-red-700">Tỷ Lệ Bào Mòn %</th>
              </tr>
            </thead>
            <tbody>
              {activeResults.yearlyHistory.map((row) => (
                <tr key={row.year} className="border-b border-[#f0f4ee] hover:bg-[#f9faf8]/50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-[#17201b]">Năm {row.year}</td>
                  <td className="px-4 py-3 text-[#17201b]">{formatCurrency(row.totalContributed)}</td>
                  <td className="px-4 py-3 text-gray-500 font-mono">{formatCurrency(row.grossValue)}</td>
                  <td className="px-4 py-3 font-bold text-[#17201b]">{formatCurrency(row.netValue)}</td>
                  <td className="px-4 py-3 font-medium text-red-700">{formatCurrency(row.cumulativeFeesPaid)}</td>
                  <td className="px-4 py-3 font-bold text-red-600">{row.dragPercent.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Educational Article / Knowledge Base Section */}
      <div className="rounded-md border border-red-100 bg-[#fffdfd] p-6 space-y-4">
        <h4 className="font-bold text-red-800 flex items-center gap-1.5">
          <BookOpen className="h-5 w-5 text-red-700" />
          Bài học cốt lõi: Overtrading là gì và tại sao phí thuế lại tàn phá lãi kép?
        </h4>
        <div className="text-sm text-[#5b6861] space-y-3 leading-relaxed">
          <p>
            <strong>Overtrading (Giao dịch quá mức)</strong> là hành vi mua bán cổ phiếu liên tục với tần suất quá cao của nhà đầu tư cá nhân, bị thúc đẩy bởi tâm lý nôn nóng, say máu khi thị trường xanh đỏ, hoặc ảo tưởng về khả năng dự đoán xu hướng cực ngắn của thị trường.
          </p>
          <p>
            Khi đầu tư tại Việt Nam, mỗi giao dịch thành công (mua và bán) sẽ chịu tối thiểu ba loại chi phí:
            <ul className="list-disc pl-5 mt-1.5 space-y-1 text-xs">
              <li><strong>Phí giao dịch mua:</strong> Thông thường từ 0.1% đến 0.2% trên giá trị khớp lệnh.</li>
              <li><strong>Phí giao dịch bán:</strong> Thông thường từ 0.1% đến 0.2% trên giá trị khớp lệnh.</li>
              <li><strong>Thuế chuyển nhượng cổ phiếu:</strong> Bắt buộc 0.1% trên giá trị bán (tính ngay khi bán, bất kể giao dịch đó bạn lãi hay lỗ).</li>
            </ul>
            Tổng chi phí một vòng (khứ hồi) rơi vào khoảng <strong>0.3% đến 0.5%</strong>.
          </p>
          <p>
            <strong>Lực cản chi phí (Cost Drag)</strong> tích lũy âm thầm theo luật nhân quả. Nếu bạn quay vòng danh mục (turnover) 100 lần một năm, bạn đã tự nguyện khấu trừ khoảng 40% giá trị tài sản của mình cho thuế và các công ty môi giới chứng khoán. Điều này đồng nghĩa với việc để giữ tài khoản hòa vốn, các giao dịch của bạn phải thắng thị trường ít nhất 40%/năm - một tỷ suất sinh lời phi thực tế mà ngay cả Warren Buffett hay các siêu quỹ phòng hộ lớn nhất thế giới cũng không thể làm được bền vững.
          </p>
          <div className="grid md:grid-cols-2 gap-4 border-t border-red-100 pt-4 mt-2">
            <div className="space-y-1">
              <h5 className="font-bold text-emerald-800 text-xs uppercase">Giải pháp tối ưu hóa chi phí:</h5>
              <ul className="list-disc pl-4 space-y-1 text-xs text-gray-700">
                <li><b>Hạ thấp tần suất:</b> Chỉ giao dịch khi luận điểm đầu tư cơ bản thay đổi lớn hoặc định giá lệch pha nghiêm trọng.</li>
                <li><b>Giao dịch lô lớn, định kỳ:</b> Hạn chế đi những lệnh lắt nhắt liên tục gây tích tụ phí cố định.</li>
                <li><b>Tập trung vào doanh nghiệp:</b> Coi cổ phiếu là quyền sở hữu một phần doanh nghiệp thật thay vì các con số xanh đỏ nhảy múa.</li>
              </ul>
            </div>
            <div className="space-y-1">
              <h5 className="font-bold text-red-800 text-xs uppercase">Lời khuyên tâm lý từ JokingFinance:</h5>
              <p className="text-xs text-gray-700">
                <i>&ldquo;Phi thương bất phú&rdquo; - hoạt động giao dịch là cần thiết để định giá lại tài sản. Nhưng giao dịch quá nhanh và vô kỷ luật chỉ béo các bên trung gian môi giới và thu thuế. Hãy sử dụng hệ thống danh mục ảo JokingFinance để thử nghiệm cảm xúc, nhận diện hành vi nôn nóng kích hoạt giao dịch liên tục của bạn trước khi đưa tiền thật vào thị trường.</i>
              </p>
            </div>
          </div>
        </div>
        <div className="pt-3 border-t border-red-100 flex justify-end">
          <Link
            href="/articles/overtrading-va-drag-thue-phi"
            className="inline-flex items-center gap-1 text-xs font-bold text-red-800 hover:underline"
          >
            Đọc bài học chi tiết về Sức tàn phá của Phí Giao Dịch
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
