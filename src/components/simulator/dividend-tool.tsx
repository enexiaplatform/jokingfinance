"use client";

import { useState, useMemo } from "react";
import { formatCurrency, formatPercent, formatNumber } from "@/lib/format";
import {
  Coins,
  TrendingUp,
  ArrowRight,
  BookOpen,
  Sparkles,
  Percent,
  RefreshCw,
  HelpCircle,
  CheckCircle,
  Calendar,
  DollarSign
} from "lucide-react";
import Link from "next/link";
import { mockStocks } from "@/lib/market-data/mockProvider";

type DgiPreset = {
  ticker: string;
  name: string;
  price: number;
  initialYield: number; // % starting dividend yield
  divGrowth: number;    // % annual dividend growth rate
  priceGrowth: number;  // % annual stock price growth rate
  description: string;
};

const DGI_PRESETS: DgiPreset[] = [
  {
    ticker: "VNM",
    name: "Vinamilk - Cổ tức cao & ổn định",
    price: 68500,
    initialYield: 5.5,
    divGrowth: 3.5,
    priceGrowth: 5.0,
    description: "Doanh nghiệp hàng tiêu dùng đầu ngành, dòng tiền dồi dào, chuyên chi trả cổ tức bằng tiền mặt cao, ít biến động tăng giá sốc."
  },
  {
    ticker: "FPT",
    name: "Tập đoàn FPT - Tăng trưởng kép vượt trội",
    price: 112000,
    initialYield: 2.2,
    divGrowth: 12.0,
    priceGrowth: 15.0,
    description: "Doanh nghiệp công nghệ hàng đầu, kết hợp tăng trưởng kinh doanh mạnh mẽ và chính sách cổ tức bằng tiền + cổ phiếu tăng đều hàng năm."
  },
  {
    ticker: "ACB",
    name: "Ngân hàng Á Châu - Cổ tức đều đặn lành mạnh",
    price: 27600,
    initialYield: 4.5,
    divGrowth: 8.0,
    priceGrowth: 10.0,
    description: "Ngân hàng bán lẻ hiệu quả cao, duy trì chi trả cổ tức hỗn hợp (tiền mặt và cổ phiếu) đều đặn cho cổ đông qua nhiều chu kỳ kinh doanh."
  },
  {
    ticker: "REE",
    name: "Cơ Điện Lạnh REE - Phòng vệ & hạ tầng bền vững",
    price: 64200,
    initialYield: 3.8,
    divGrowth: 6.0,
    priceGrowth: 8.0,
    description: "Doanh nghiệp đa ngành hạ tầng (điện, nước, bất động sản văn phòng), doanh thu ổn định và tăng trưởng cổ tức bền bỉ."
  }
];

export function DividendTool() {
  const [selectedPreset, setSelectedPreset] = useState<string>("VNM");
  const [customPrice, setCustomPrice] = useState<number>(50000);
  const [customYield, setCustomYield] = useState<number>(5.0);
  const [customDivGrowth, setCustomDivGrowth] = useState<number>(6.0);
  const [customPriceGrowth, setCustomPriceGrowth] = useState<number>(8.0);

  // Investment settings
  const [initialInvestment, setInitialInvestment] = useState<number>(50000000); // 50 million VND
  const [monthlyContribution, setMonthlyContribution] = useState<number>(3000000); // 3 million VND
  const [years, setYears] = useState<number>(10);
  const [dripEnabled, setDripEnabled] = useState<boolean>(true); // Dividend Reinvestment Plan

  // Resolve active parameters
  const stockParams = useMemo(() => {
    if (selectedPreset === "CUSTOM") {
      return {
        ticker: "CUSTOM",
        name: "Cổ phiếu tùy chỉnh",
        price: customPrice,
        initialYield: customYield,
        divGrowth: customDivGrowth,
        priceGrowth: customPriceGrowth
      };
    }
    const preset = DGI_PRESETS.find(p => p.ticker === selectedPreset);
    return preset || DGI_PRESETS[0];
  }, [selectedPreset, customPrice, customYield, customDivGrowth, customPriceGrowth]);

  // Run year-by-year simulations
  const simulationData = useMemo(() => {
    const { price: startPrice, initialYield, divGrowth, priceGrowth } = stockParams;
    
    const divGrowthRate = divGrowth / 100;
    const stockGrowthRate = priceGrowth / 100;
    const initialDivPerShare = startPrice * (initialYield / 100);
    const taxRate = 0.05; // 5% dividend tax in Vietnam

    // Runs a simulation under a strategy (drip or payout)
    const runSim = (useDrip: boolean) => {
      let shares = initialInvestment / startPrice;
      let price = startPrice;
      let totalContributed = initialInvestment;
      let accumulatedCash = 0;
      let totalDividendsReceived = 0;
      let divPerShare = initialDivPerShare;

      const yearlyHistory = [];

      for (let year = 1; year <= years; year++) {
        // 1. Contributions made during the year
        const annualContribution = monthlyContribution * 12;
        totalContributed += annualContribution;

        // Shares bought from annual contributions (average buying price assumed mid-year)
        const avgPriceOfYear = price * (1 + stockGrowthRate / 2);
        const sharesFromContrib = annualContribution / avgPriceOfYear;
        shares += sharesFromContrib;

        // 2. Dividend paid at the end of the year
        const dividendPaid = shares * divPerShare;
        totalDividendsReceived += dividendPaid;
        const netDividend = dividendPaid * (1 - taxRate); // after 5% tax

        if (useDrip) {
          // Reinvest immediately into shares at year-end price
          const sharesFromDrip = netDividend / price;
          shares += sharesFromDrip;
        } else {
          // Cash payouts accumulated
          accumulatedCash += netDividend;
        }

        // Calculate Yield on Cost (YoC) for this year
        const annualPayout = shares * divPerShare;
        const yoc = (annualPayout / totalContributed) * 100;

        yearlyHistory.push({
          year,
          price,
          shares,
          totalContributed,
          dividendsReceived: dividendPaid,
          netDividendsReceived: netDividend,
          portfolioValue: (shares * price) + (useDrip ? 0 : accumulatedCash),
          yoc,
          annualPayout
        });

        // Evolve stock price and dividend per share for next year
        price *= (1 + stockGrowthRate);
        divPerShare *= (1 + divGrowthRate);
      }

      return {
        yearlyHistory,
        finalShares: shares,
        finalPrice: price / (1 + stockGrowthRate), // value at the end of the last year
        totalContributed,
        totalDividendsReceived,
        finalPortfolioValue: yearlyHistory[yearlyHistory.length - 1]?.portfolioValue || 0,
        finalYoc: yearlyHistory[yearlyHistory.length - 1]?.yoc || 0,
        finalPassiveIncome: yearlyHistory[yearlyHistory.length - 1]?.annualPayout * (1 - taxRate) || 0,
        accumulatedCash
      };
    };

    const dripResults = runSim(true);
    const payoutResults = runSim(false);

    return {
      drip: dripResults,
      payout: payoutResults
    };
  }, [stockParams, initialInvestment, monthlyContribution, years]);

  // Selected strategy for detail list and key cards
  const activeResults = dripEnabled ? simulationData.drip : simulationData.payout;
  const comparisonRatio = simulationData.drip.finalPortfolioValue / simulationData.payout.finalPortfolioValue;

  return (
    <div className="grid gap-6">
      {/* Header */}
      <div className="rounded-md border border-[#d9ddd3] bg-gradient-to-r from-[#f5f7f2] to-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-[#0f766e] p-2 text-white">
            <Coins className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#17201b] flex items-center gap-2">
              Giả lập Tích lũy Cổ tức Tăng trưởng (DGI)
              <span className="rounded bg-[#0f766e]/10 px-2 py-0.5 text-xs font-semibold text-[#0f766e]">Mới</span>
            </h2>
            <p className="text-sm text-[#5b6861] mt-0.5">
              Mô phỏng sức mạnh kép từ việc tăng giá cổ phiếu, tăng trưởng cổ tức và sức bật của cơ chế tái đầu tư (DRIP) theo chuẩn đầu tư lý trí dài hạn.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Side: Inputs */}
        <div className="space-y-6 lg:col-span-5">
          <div className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-[#17201b] flex items-center gap-1.5 border-b border-[#f0f4ee] pb-3">
              <Sparkles className="h-4.5 w-4.5 text-[#0f766e]" />
              Thiết lập Giả lập
            </h3>

            {/* Stock Presets */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#5b6861]">Chọn Cổ Phiếu Mục Tiêu</label>
              <select
                value={selectedPreset}
                onChange={(e) => setSelectedPreset(e.target.value)}
                className="w-full rounded-md border border-[#d9ddd3] bg-white px-3 py-2 text-sm text-[#17201b] shadow-sm outline-none focus:border-[#0f766e] focus:ring-1 focus:ring-[#0f766e]"
              >
                {DGI_PRESETS.map((p) => (
                  <option key={p.ticker} value={p.ticker}>
                    {p.name} ({p.ticker})
                  </option>
                ))}
                <option value="CUSTOM">-- Cấu hình tùy chỉnh --</option>
              </select>
              {selectedPreset !== "CUSTOM" && (
                <p className="text-xs text-[#5b6861] italic mt-1 leading-relaxed">
                  {DGI_PRESETS.find(p => p.ticker === selectedPreset)?.description}
                </p>
              )}
            </div>

            {/* Custom parameters (Only shown if Custom is selected) */}
            {selectedPreset === "CUSTOM" && (
              <div className="rounded border border-[#f0f4ee] bg-[#fdfbf7] p-3 space-y-3">
                <h4 className="text-xs font-bold text-[#0f766e] uppercase tracking-wider">Thông số cổ phiếu tùy chỉnh</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#5b6861]">Giá khởi điểm (VND)</label>
                    <input
                      type="number"
                      value={customPrice}
                      onChange={(e) => setCustomPrice(Math.max(1000, Number(e.target.value)))}
                      className="w-full rounded-md border border-[#d9ddd3] bg-white px-2 py-1 text-sm outline-none focus:border-[#0f766e]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#5b6861]">Tỷ suất cổ tức (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={customYield}
                      onChange={(e) => setCustomYield(Math.max(0, Number(e.target.value)))}
                      className="w-full rounded-md border border-[#d9ddd3] bg-white px-2 py-1 text-sm outline-none focus:border-[#0f766e]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#5b6861]">Tăng trưởng cổ tức/năm (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={customDivGrowth}
                      onChange={(e) => setCustomDivGrowth(Math.max(0, Number(e.target.value)))}
                      className="w-full rounded-md border border-[#d9ddd3] bg-white px-2 py-1 text-sm outline-none focus:border-[#0f766e]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#5b6861]">Tăng giá cổ phiếu/năm (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={customPriceGrowth}
                      onChange={(e) => setCustomPriceGrowth(Math.max(0, Number(e.target.value)))}
                      className="w-full rounded-md border border-[#d9ddd3] bg-white px-2 py-1 text-sm outline-none focus:border-[#0f766e]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Investment Values */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#5b6861]">Vốn ban đầu (VND)</label>
                  <span className="text-xs font-semibold text-[#0f766e]">{formatCurrency(initialInvestment)}</span>
                </div>
                <input
                  type="range"
                  min={10000000}
                  max={500000000}
                  step={10000000}
                  value={initialInvestment}
                  onChange={(e) => setInitialInvestment(Number(e.target.value))}
                  className="w-full accent-[#0f766e] h-1.5 rounded-lg bg-[#e0e5dc] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#5b6861]">Góp hàng tháng (VND)</label>
                  <span className="text-xs font-semibold text-[#0f766e]">{formatCurrency(monthlyContribution)}</span>
                </div>
                <input
                  type="range"
                  min={1000000}
                  max={20000000}
                  step={500000}
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                  className="w-full accent-[#0f766e] h-1.5 rounded-lg bg-[#e0e5dc] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#5b6861]">Thời gian đầu tư (Năm)</label>
                  <span className="text-xs font-semibold text-[#0f766e]">{years} Năm</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={30}
                  step={1}
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full accent-[#0f766e] h-1.5 rounded-lg bg-[#e0e5dc] cursor-pointer"
                />
              </div>
            </div>

            {/* Toggle DRIP */}
            <div className="rounded-md border border-[#f0f4ee] bg-[#f9faf8] p-4 flex items-center justify-between">
              <div className="pr-4">
                <h4 className="text-sm font-bold text-[#17201b] flex items-center gap-1">
                  <RefreshCw className="h-4 w-4 text-[#0f766e] animate-spin-slow" />
                  Tái đầu tư cổ tức (DRIP)
                </h4>
                <p className="text-xs text-[#5b6861] mt-1 leading-relaxed">
                  Tự động dùng cổ tức nhận được (sau khi khấu trừ 5% thuế cổ tức tại Việt Nam) để mua thêm cổ phiếu tích lũy.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDripEnabled(!dripEnabled)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                  dripEnabled ? "bg-[#0f766e]" : "bg-gray-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    dripEnabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Quick Metrics display of preset */}
          <div className="rounded-md border border-[#e0e5dc] bg-[#fdfbf7] p-5 space-y-3">
            <h4 className="text-sm font-bold text-[#17201b] flex items-center gap-1">
              <Percent className="h-4 w-4 text-[#0f766e]" />
              Tham số Cổ phiếu đang giả lập
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm border-t border-[#f0f4ee] pt-3">
              <div>
                <span className="text-[#5b6861] block text-xs">Mã cổ phiếu:</span>
                <span className="font-bold text-[#17201b]">{stockParams.ticker}</span>
              </div>
              <div>
                <span className="text-[#5b6861] block text-xs">Giá bắt đầu:</span>
                <span className="font-bold text-[#17201b]">{formatCurrency(stockParams.price)}</span>
              </div>
              <div>
                <span className="text-[#5b6861] block text-xs">Tỷ suất cổ tức khởi điểm:</span>
                <span className="font-bold text-[#17201b]">{stockParams.initialYield}% / năm</span>
              </div>
              <div>
                <span className="text-[#5b6861] block text-xs">Cổ tức tăng trưởng:</span>
                <span className="font-bold text-[#17201b] text-emerald-600">+{stockParams.divGrowth}% / năm</span>
              </div>
              <div className="col-span-2 border-t border-[#f0f4ee] pt-2">
                <span className="text-[#5b6861] block text-xs">Ước lượng tăng giá cổ phiếu dài hạn:</span>
                <span className="font-bold text-[#17201b] text-[#0f766e]">+{stockParams.priceGrowth}% / năm</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Results & Comparison */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Results Cards Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-md border border-[#e0e5dc] bg-white p-4 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-5">
                <TrendingUp className="h-16 w-16 text-[#0f766e]" />
              </div>
              <span className="text-xs font-bold text-[#5b6861] uppercase tracking-wider block">Giá trị tài sản cuối kỳ</span>
              <span className="text-2xl font-extrabold text-[#17201b] mt-1.5 block">
                {formatCurrency(activeResults.finalPortfolioValue)}
              </span>
              <span className="text-xs text-emerald-600 font-medium mt-1 block">
                Lợi nhuận: {formatPercent(((activeResults.finalPortfolioValue - activeResults.totalContributed) / activeResults.totalContributed) * 100)}
              </span>
            </div>

            <div className="rounded-md border border-[#e0e5dc] bg-white p-4 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-5">
                <Coins className="h-16 w-16 text-amber-600" />
              </div>
              <span className="text-xs font-bold text-[#5b6861] uppercase tracking-wider block">Thu nhập thụ động năm cuối</span>
              <span className="text-2xl font-extrabold text-emerald-700 mt-1.5 block">
                {formatCurrency(activeResults.finalPassiveIncome)}
              </span>
              <span className="text-xs text-[#5b6861] mt-1 block">
                Sau thuế 5% cổ tức mặt
              </span>
            </div>

            <div className="rounded-md border border-[#e0e5dc] bg-white p-4 shadow-sm">
              <span className="text-xs font-bold text-[#5b6861] uppercase tracking-wider block">Yield on Cost (YoC) cuối kỳ</span>
              <span className="text-xl font-bold text-[#17201b] mt-1 block">
                {formatNumber(activeResults.finalYoc)}%
              </span>
              <p className="text-xs text-[#5b6861] mt-1 leading-tight">
                Cổ tức năm cuối chia trên tổng số vốn tự đóng góp.
              </p>
            </div>

            <div className="rounded-md border border-[#e0e5dc] bg-white p-4 shadow-sm">
              <span className="text-xs font-bold text-[#5b6861] uppercase tracking-wider block">Tổng vốn tự có đã góp</span>
              <span className="text-xl font-bold text-[#5b6861] mt-1 block">
                {formatCurrency(activeResults.totalContributed)}
              </span>
              <p className="text-xs text-[#5b6861] mt-1">
                Gồm {formatCurrency(initialInvestment)} ban đầu + {formatCurrency(monthlyContribution)}/tháng.
              </p>
            </div>
          </div>

          {/* DRIP vs Payout Comparison Showcase */}
          <div className="rounded-md border border-[#0f766e]/20 bg-gradient-to-br from-[#0f766e]/5 via-white to-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-[#17201b] flex items-center gap-1.5 text-sm uppercase tracking-wider">
                <RefreshCw className="h-4.5 w-4.5 text-[#0f766e] shrink-0" />
                Sự Khác Biệt Của Cơ Chế Tái Đầu Tư Cổ Tức (DRIP)
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className={`rounded-md border p-4 transition-all ${dripEnabled ? "border-[#0f766e] bg-[#0f766e]/5 ring-1 ring-[#0f766e]" : "border-[#e0e5dc] bg-white"}`}>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#0f766e]">Có Tái Đầu Tư (DRIP)</span>
                  <CheckCircle className={`h-4 w-4 text-[#0f766e] ${dripEnabled ? "opacity-100" : "opacity-0"}`} />
                </div>
                <div className="mt-3">
                  <span className="text-xs text-[#5b6861] block">Tài sản:</span>
                  <span className="text-lg font-bold text-[#17201b]">{formatCurrency(simulationData.drip.finalPortfolioValue)}</span>
                </div>
                <div className="mt-2">
                  <span className="text-xs text-[#5b6861] block">Thu nhập thụ động:</span>
                  <span className="text-sm font-bold text-emerald-700">{formatCurrency(simulationData.drip.finalPassiveIncome)}/năm</span>
                </div>
                <div className="mt-2">
                  <span className="text-xs text-[#5b6861] block">Yield on Cost (YoC):</span>
                  <span className="text-sm font-bold text-[#17201b]">{formatNumber(simulationData.drip.finalYoc)}%</span>
                </div>
              </div>

              <div className={`rounded-md border p-4 transition-all ${!dripEnabled ? "border-[#0f766e] bg-[#0f766e]/5 ring-1 ring-[#0f766e]" : "border-[#e0e5dc] bg-white"}`}>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#5b6861]">Không Tái Đầu Tư (Lấy tiền mặt)</span>
                  <CheckCircle className={`h-4 w-4 text-[#0f766e] ${!dripEnabled ? "opacity-100" : "opacity-0"}`} />
                </div>
                <div className="mt-3">
                  <span className="text-xs text-[#5b6861] block">Tài sản (gồm tiền mặt rút ra):</span>
                  <span className="text-lg font-bold text-[#17201b]">{formatCurrency(simulationData.payout.finalPortfolioValue)}</span>
                </div>
                <div className="mt-2">
                  <span className="text-xs text-[#5b6861] block">Thu nhập thụ động:</span>
                  <span className="text-sm font-bold text-[#17201b]">{formatCurrency(simulationData.payout.finalPassiveIncome)}/năm</span>
                </div>
                <div className="mt-2">
                  <span className="text-xs text-[#5b6861] block">Yield on Cost (YoC):</span>
                  <span className="text-sm font-bold text-[#17201b]">{formatNumber(simulationData.payout.finalYoc)}%</span>
                </div>
              </div>
            </div>

            {comparisonRatio > 1.05 && (
              <div className="rounded bg-emerald-50 border border-emerald-100 p-3 text-xs text-emerald-800 leading-relaxed">
                🚀 Bằng cách bật <strong>Tái đầu tư cổ tức (DRIP)</strong>, tổng tài sản cuối kỳ của bạn lớn gấp{" "}
                <strong>{formatNumber(comparisonRatio)} lần</strong> so với việc rút cổ tức mặt ra chi tiêu. Việc liên tục lấy cổ tức để gom thêm cổ phiếu tạo nên sức bật lãi kép kinh điển - số lượng cổ phần của bạn tăng dần mà không cần đóng thêm vốn mới.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail year-by-year simulated table */}
      <div className="rounded-md border border-[#e0e5dc] bg-white shadow-sm overflow-hidden">
        <div className="border-b border-[#f0f4ee] bg-[#f9faf8] px-5 py-4 flex justify-between items-center">
          <h3 className="font-bold text-[#17201b] text-sm uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="h-4.5 w-4.5 text-[#0f766e]" />
            Bảng Giả Lập Chi Tiết Từng Năm ({dripEnabled ? "Đang Bật DRIP" : "Nhận Tiền Mặt"})
          </h3>
          <span className="text-xs text-[#5b6861] font-medium">Đơn vị: VND</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-[#f0f4ee] bg-[#fdfbf7] text-[#5b6861] text-xs font-bold uppercase">
                <th className="px-4 py-3">Năm</th>
                <th className="px-4 py-3">Giá Cổ Phiếu</th>
                <th className="px-4 py-3">Số Cổ Phần</th>
                <th className="px-4 py-3">Cổ Tức Trong Năm (Trước thuế)</th>
                <th className="px-4 py-3">Tổng Vốn Đã Góp</th>
                <th className="px-4 py-3">Giá Trị Tài Sản</th>
                <th className="px-4 py-3">Yield-on-Cost</th>
              </tr>
            </thead>
            <tbody>
              {activeResults.yearlyHistory.map((row) => (
                <tr key={row.year} className="border-b border-[#f0f4ee] hover:bg-[#f9faf8]/50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-[#17201b]">Năm {row.year}</td>
                  <td className="px-4 py-3 text-[#17201b]">{formatCurrency(row.price)}</td>
                  <td className="px-4 py-3 text-[#17201b]">{formatNumber(row.shares)} CP</td>
                  <td className="px-4 py-3 font-medium text-emerald-700">
                    {formatCurrency(row.dividendsReceived)}
                    <span className="text-[10px] text-[#8c9a91] block">Nét sau thuế: {formatCurrency(row.netDividendsReceived)}</span>
                  </td>
                  <td className="px-4 py-3 text-[#5b6861]">{formatCurrency(row.totalContributed)}</td>
                  <td className="px-4 py-3 font-extrabold text-[#17201b]">{formatCurrency(row.portfolioValue)}</td>
                  <td className="px-4 py-3 font-bold text-emerald-800">{formatNumber(row.yoc)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Educational Article Section / Deep Insights */}
      <div className="rounded-md border border-[#e0e5dc] bg-[#fdfbf7] p-6 space-y-4">
        <h4 className="font-bold text-[#17201b] flex items-center gap-1.5">
          <BookOpen className="h-5 w-5 text-[#0f766e]" />
          Kiến thức cốt lõi: Sức mạnh tăng trưởng kép của cổ tức (Dividend Growth)
        </h4>
        <div className="text-sm text-[#5b6861] space-y-3 leading-relaxed">
          <p>
            <strong>Đầu tư tăng trưởng cổ tức (Dividend Growth Investing - DGI)</strong> không đơn thuần là tìm những mã có tỷ suất cổ tức hiện tại cao nhất. Thực tế, nhiều doanh nghiệp có tỷ suất cổ tức ban đầu rất thấp (chỉ 2% - 3%) nhưng lại có mức tăng trưởng chi trả cổ tức vượt trội hàng năm (10% - 15% nhờ hoạt động cốt lõi phình to). Sau 10 - 20 năm tích lũy, số cổ tức nhận về sẽ vượt xa dòng tiền của nhóm cổ tức cao nhưng dậm chân tại chỗ.
          </p>
          <p>
            <strong>Yield-on-Cost (YoC)</strong> là chỉ số quan trọng phản ánh hiệu quả dài hạn. Ví dụ, bạn mua cổ phiếu FPT với giá 112.000đ khi tỷ suất cổ tức là 2.2% (2.500đ/cổ phiếu). Nhờ FPT tăng trưởng lợi nhuận 15% đều đặn, sau 10 năm, cổ tức thực nhận tăng lên mức 8.000đ/cổ phiếu. Lúc này, tỷ suất cổ tức so với giá vốn mua ban đầu của bạn (Yield-on-Cost) đạt <strong>7.14%</strong>, trong khi người mua mới ở năm thứ 10 vẫn chỉ nhận được tỷ suất ~2% trên thị giá cao ngất ngưởng.
          </p>
          <div className="grid md:grid-cols-2 gap-4 border-t border-[#e0e5dc] pt-4 mt-2">
            <div className="space-y-1">
              <h5 className="font-bold text-[#17201b] text-xs uppercase text-[#0f766e]">Ưu điểm của chiến lược DGI:</h5>
              <ul className="list-disc pl-4 space-y-1 text-xs">
                <li>Dòng tiền thụ động thật từ cổ tức tiền mặt tạo tấm đệm an toàn tâm lý.</li>
                <li>Hạn chế trading vô kỷ luật vì nhà đầu tư chỉ mong thu gom thêm số lượng cổ phiếu.</li>
                <li>Doanh nghiệp trả cổ tức tăng đều thường có nền tảng tài chính cực mạnh và lợi thế cạnh tranh lớn.</li>
              </ul>
            </div>
            <div className="space-y-1">
              <h5 className="font-bold text-[#17201b] text-xs uppercase text-amber-700">Rủi ro & Thuế tại Việt Nam:</h5>
              <ul className="list-disc pl-4 space-y-1 text-xs">
                <li>Thuế cổ tức: Thu nhập từ cổ tức tiền mặt bị tính thuế TNCN 5% ngay tại nguồn khi chi trả.</li>
                <li>Bị chia nhỏ do phát hành: Nhiều doanh nghiệp Việt Nam tăng vốn liên tục bằng cổ phiếu thưởng, làm loãng EPS và có thể tạm ngưng cổ tức mặt khi cần đầu tư lớn.</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="pt-3 border-t border-[#e0e5dc] flex justify-end">
          <Link
            href="/articles/tich-luy-co-tuc-va-suc-bat-compound-dividend"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#0f766e] hover:underline"
          >
            Đọc bài học chi tiết về Tích lũy cổ tức tăng trưởng
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
