"use client";

import { useState, useMemo, useEffect } from "react";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import {
  Calculator,
  Info,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  ChevronRight,
  HelpCircle,
  TrendingDown
} from "lucide-react";
import Link from "next/link";
import type { Stock } from "@/lib/market-data/types";

type ValuationToolProps = {
  stocks: Stock[];
};

export function ValuationTool({ stocks }: ValuationToolProps) {
  const [selectedTicker, setSelectedTicker] = useState("FPT");
  const [customEps, setCustomEps] = useState<number | "">("");
  const [growthRate, setGrowthRate] = useState(12); // 12% growth rate
  const [targetPe, setTargetPe] = useState(15); // Target P/E
  const [discountRate, setDiscountRate] = useState(10); // Required rate of return 10%
  const [activeModel, setActiveModel] = useState<"pe" | "graham" | "dcf">("pe");

  const selectedStock = useMemo(() => {
    return stocks.find((s) => s.ticker === selectedTicker) || stocks[0];
  }, [stocks, selectedTicker]);

  // Set default parameters when stock changes
  useEffect(() => {
    if (selectedStock) {
      const pe = selectedStock.peRatio || 15;
      const currentPrice = selectedStock.currentPrice || 10000;
      const calculatedEps = Math.round(currentPrice / pe);
      setCustomEps(calculatedEps);
      setTargetPe(Math.round(pe));
      
      // Reasonable growth rate estimation based on sector
      if (selectedStock.sector === "Công nghệ") {
        setGrowthRate(15);
      } else if (selectedStock.sector === "Ngân hàng") {
        setGrowthRate(12);
      } else if (selectedStock.sector === "Bán lẻ") {
        setGrowthRate(14);
      } else {
        setGrowthRate(10);
      }
    }
  }, [selectedStock]);

  const eps = typeof customEps === "number" ? customEps : 0;
  const currentPrice = selectedStock ? selectedStock.currentPrice : 0;

  // 1. Target P/E Model
  const peValuation = useMemo(() => {
    // Year 5 Future EPS
    const futureEps = eps * Math.pow(1 + growthRate / 100, 5);
    // Year 5 Future Price
    const futurePrice = futureEps * targetPe;
    // Present value of future price
    const fairValue = futurePrice / Math.pow(1 + discountRate / 100, 5);

    return {
      futureEps,
      futurePrice,
      fairValue,
    };
  }, [eps, growthRate, targetPe, discountRate]);

  // 2. Graham Model (V = EPS * (8.5 + 1.5 * g))
  const grahamValuation = useMemo(() => {
    const fairValue = eps * (8.5 + 1.5 * growthRate);
    return {
      fairValue,
    };
  }, [eps, growthRate]);

  // 3. Simple EPS Discount Model (DCF-like)
  const dcfValuation = useMemo(() => {
    let sumDiscountedEps = 0;
    const discountedEpsList: number[] = [];

    // Discount EPS for years 1 to 5
    for (let year = 1; year <= 5; year++) {
      const futureEps = eps * Math.pow(1 + growthRate / 100, year);
      const discountedEps = futureEps / Math.pow(1 + discountRate / 100, year);
      sumDiscountedEps += discountedEps;
      discountedEpsList.push(discountedEps);
    }

    // Terminal Value at year 5 using target PE as terminal multiple
    const terminalValue = (eps * Math.pow(1 + growthRate / 100, 5)) * targetPe;
    const discountedTerminalValue = terminalValue / Math.pow(1 + discountRate / 100, 5);

    const fairValue = sumDiscountedEps + discountedTerminalValue;

    return {
      fairValue,
      discountedEpsList,
      discountedTerminalValue,
    };
  }, [eps, growthRate, targetPe, discountRate]);

  // Average or active model value
  const activeFairValue = useMemo(() => {
    if (activeModel === "pe") return peValuation.fairValue;
    if (activeModel === "graham") return grahamValuation.fairValue;
    return dcfValuation.fairValue;
  }, [activeModel, peValuation, grahamValuation, dcfValuation]);

  const valuationStatus = useMemo(() => {
    if (currentPrice === 0 || activeFairValue === 0) return { label: "N/A", style: "", pct: 0 };
    const diffPct = ((currentPrice - activeFairValue) / activeFairValue) * 100;
    
    if (diffPct > 15) {
      return {
        label: "Định giá Đắt (Overvalued) ⚠️",
        style: "border-[#f1bea8] bg-[#fff0e8] text-[#9a3412]",
        pct: diffPct,
        desc: `Giá thị trường cao hơn giá trị hợp lý ${formatPercent(diffPct)}. Bạn đang trả phí premium khá cao, hãy cẩn thận với rủi ro đu đỉnh FOMO.`
      };
    } else if (diffPct < -15) {
      return {
        label: "Định giá Hấp dẫn (Undervalued) 💎",
        style: "border-[#b9d9c5] bg-[#edf6ed] text-[#166534]",
        pct: diffPct,
        desc: `Giá thị trường thấp hơn giá trị hợp lý ${formatPercent(Math.abs(diffPct))}. Biên an toàn (Margin of Safety) của cổ phiếu đang rất tốt.`
      };
    } else {
      return {
        label: "Định giá Hợp lý (Fair Value) ⚖️",
        style: "border-[#e8d59b] bg-[#fff7d6] text-[#7a4d00]",
        pct: diffPct,
        desc: `Giá thị trường nằm sát giá trị hợp lý (lệch ${formatPercent(diffPct)}). Cổ phiếu được định giá phản ánh đúng giá trị nội tại.`
      };
    }
  }, [currentPrice, activeFairValue]);

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      {/* Left Column: Inputs */}
      <div className="flex flex-col gap-5">
        <section className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-[#17201b] mb-4 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-[#0f766e]" />
            1. Chọn cổ phiếu và nhập chỉ số cơ bản
          </h2>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5 text-xs font-bold uppercase text-[#5b6861] sm:col-span-2">
              Chọn doanh nghiệp mẫu
              <select
                value={selectedTicker}
                onChange={(e) => setSelectedTicker(e.target.value)}
                className="h-10 mt-1 rounded-md border border-[#d9ddd3] bg-white px-3 font-semibold text-sm text-[#17201b]"
              >
                {stocks.map((stock) => (
                  <option key={stock.ticker} value={stock.ticker}>
                    {stock.ticker} - {stock.companyName} ({stock.sector})
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-1.5 text-xs font-bold uppercase text-[#5b6861]">
              Giá thị trường hiện tại
              <div className="h-10 mt-1 flex items-center px-3 border border-[#d9ddd3] bg-[#f8fbf7] rounded-md font-mono font-semibold text-sm text-[#17201b]">
                {formatCurrency(currentPrice)}
              </div>
            </label>

            <label className="grid gap-1.5 text-xs font-bold uppercase text-[#5b6861]">
              P/E hiện tại của cổ phiếu
              <div className="h-10 mt-1 flex items-center px-3 border border-[#d9ddd3] bg-[#f8fbf7] rounded-md font-mono font-semibold text-sm text-[#17201b]">
                {selectedStock?.peRatio ? `${selectedStock.peRatio}x` : "N/A"}
              </div>
            </label>

            <label className="grid gap-1.5 text-xs font-bold uppercase text-[#5b6861] sm:col-span-2">
              Thu nhập trên mỗi cổ phiếu (EPS) hiện tại (VND)
              <input
                type="number"
                min={100}
                value={customEps}
                onChange={(e) => setCustomEps(e.target.value === "" ? "" : Number(e.target.value))}
                className="h-10 mt-1 rounded-md border border-[#d9ddd3] px-3 font-mono font-semibold text-sm text-[#17201b]"
              />
              <span className="text-[11px] text-[#5b6861] font-normal leading-4 mt-1 normal-case">
                💡 EPS = Lợi nhuận sau thuế / Số cổ phiếu lưu hành. EPS mặc định của {selectedTicker} là{" "}
                <b>{Math.round(currentPrice / (selectedStock?.peRatio || 15)).toLocaleString("vi-VN")}đ</b> dựa trên P/E hiện tại.
              </span>
            </label>
          </div>
        </section>

        <section className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-[#17201b] mb-4 flex items-center gap-2">
            <Calculator className="h-5 w-5 text-[#0f766e]" />
            2. Giả định tương lai (Định giá kỳ vọng)
          </h2>

          <div className="grid gap-5">
            <label className="grid gap-1.5 text-sm font-semibold text-[#314039]">
              <div className="flex justify-between">
                <span>Tốc độ tăng trưởng EPS kỳ vọng (5 năm tới)</span>
                <span className="font-mono text-[#0f766e] font-bold">{growthRate}%/năm</span>
              </div>
              <input
                type="range"
                min={0}
                max={30}
                step={0.5}
                value={growthRate}
                onChange={(e) => setGrowthRate(Number(e.target.value))}
                className="w-full mt-2 accent-[#0f766e]"
              />
              <span className="text-xs text-[#5b6861] font-normal">
                (Công nghệ thường tăng trưởng 15-20%, ngân hàng 10-15%, sản xuất chu kỳ 5-10%...)
              </span>
            </label>

            <label className="grid gap-1.5 text-sm font-semibold text-[#314039] border-t border-[#edf0eb] pt-4">
              <div className="flex justify-between">
                <span>Hệ số định giá P/E mục tiêu (Target P/E)</span>
                <span className="font-mono text-[#0f766e] font-bold">{targetPe}x</span>
              </div>
              <input
                type="range"
                min={5}
                max={40}
                step={1}
                value={targetPe}
                onChange={(e) => setTargetPe(Number(e.target.value))}
                className="w-full mt-2 accent-[#0f766e]"
              />
              <span className="text-xs text-[#5b6861] font-normal">
                (Hệ số P/E bạn sẵn sàng trả cho mỗi đồng lợi nhuận trong tương lai. P/E bình quân VN-Index là 13-15x)
              </span>
            </label>

            <label className="grid gap-1.5 text-sm font-semibold text-[#314039] border-t border-[#edf0eb] pt-4">
              <div className="flex justify-between">
                <span>Tỷ suất sinh lời yêu cầu (Discount Rate - r)</span>
                <span className="font-mono text-[#0f766e] font-bold">{discountRate}%/năm</span>
              </div>
              <input
                type="range"
                min={5}
                max={25}
                step={0.5}
                value={discountRate}
                onChange={(e) => setDiscountRate(Number(e.target.value))}
                className="w-full mt-2 accent-[#0f766e]"
              />
              <span className="text-xs text-[#5b6861] font-normal">
                (Lợi nhuận bạn mong muốn đạt được tối thiểu khi đầu tư vào cổ phiếu này thay vì gửi tiết kiệm ngân hàng 5-6%)
              </span>
            </label>
          </div>
        </section>
      </div>

      {/* Right Column: Results & Models */}
      <div className="flex flex-col gap-5">
        <section className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-[#17201b] mb-4">Kết quả định giá trị nội tại</h2>

          {/* Fair Value Display */}
          <div className="p-5 rounded-md bg-[#edf5ee] border border-[#d2dfd5] text-center mb-4">
            <p className="text-xs font-bold text-[#43534a] uppercase">Giá trị hợp lý ước tính ({selectedTicker})</p>
            <p className="text-4xl font-black text-[#166534] mt-2 font-mono">
              {formatCurrency(activeFairValue)}
            </p>
            <div className="mt-1 flex items-center justify-center gap-1.5 text-xs text-[#166534] font-semibold">
              <span>Mô hình đang xem:</span>
              <span className="bg-[#dcfce7] px-2 py-0.5 rounded-full font-bold uppercase text-[10px]">
                {activeModel === "pe" ? "P/E Mục tiêu" : activeModel === "graham" ? "Benjamin Graham" : "DCF tối giản"}
              </span>
            </div>
          </div>

          {/* Status Tag */}
          <div className={`p-4 rounded-md border text-sm ${valuationStatus.style} leading-6 mb-4`}>
            <p className="font-bold text-base">{valuationStatus.label}</p>
            <p className="mt-1.5 text-xs font-medium">{valuationStatus.desc}</p>
          </div>

          {/* Selector for active model detail */}
          <div className="border-t border-[#edf0eb] pt-4">
            <p className="text-sm font-bold text-[#4a5a52] mb-3">Chọn mô hình để xem diễn giải chi tiết:</p>
            
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setActiveModel("pe")}
                className={`py-2 px-1.5 rounded border text-center text-xs font-bold transition-all ${
                  activeModel === "pe"
                    ? "bg-[#0f766e] text-white border-transparent"
                    : "border-[#d9ddd3] bg-white text-[#4a5a52] hover:bg-[#f8fbf7]"
                }`}
              >
                P/E Mục tiêu
              </button>
              <button
                type="button"
                onClick={() => setActiveModel("graham")}
                className={`py-2 px-1.5 rounded border text-center text-xs font-bold transition-all ${
                  activeModel === "graham"
                    ? "bg-[#0f766e] text-white border-transparent"
                    : "border-[#d9ddd3] bg-white text-[#4a5a52] hover:bg-[#f8fbf7]"
                }`}
              >
                Graham
              </button>
              <button
                type="button"
                onClick={() => setActiveModel("dcf")}
                className={`py-2 px-1.5 rounded border text-center text-xs font-bold transition-all ${
                  activeModel === "dcf"
                    ? "bg-[#0f766e] text-white border-transparent"
                    : "border-[#d9ddd3] bg-white text-[#4a5a52] hover:bg-[#f8fbf7]"
                }`}
              >
                DCF Tối giản
              </button>
            </div>
          </div>
        </section>

        {/* Model Details Card */}
        <section className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
          {activeModel === "pe" && (
            <div className="grid gap-3">
              <h3 className="font-bold text-[#17201b] text-base flex items-center gap-1.5">
                <Sparkles className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                Mô hình định giá P/E Mục Tiêu
              </h3>
              <p className="text-xs text-[#5b6861] leading-5">
                Mô hình này dự phóng EPS của doanh nghiệp đến năm thứ 5 dựa trên tốc độ tăng trưởng giả định, sau đó nhân với chỉ số P/E mục tiêu để tìm giá cổ phiếu tương lai, rồi chiết khấu về hiện tại theo tỷ suất yêu cầu.
              </p>

              <div className="mt-2 bg-[#f8fbf7] border border-[#d9ddd3] p-3 rounded-md font-mono text-xs leading-6 text-[#314039]">
                <p><b>1. EPS năm 5:</b> {formatNumber(eps)} × (1 + {growthRate}%)⁵ = <b>{formatNumber(peValuation.futureEps)} VND</b></p>
                <p><b>2. Giá năm 5:</b> {formatNumber(peValuation.futureEps)} × {targetPe} (P/E) = <b>{formatCurrency(peValuation.futurePrice)}</b></p>
                <p><b>3. Giá trị nội tại:</b> {formatNumber(peValuation.futurePrice)} / (1 + {discountRate}%)⁵ = <b>{formatCurrency(peValuation.fairValue)}</b></p>
              </div>

              <div className="mt-2 p-3 bg-[#edf7ff] border border-[#b8d2e8] text-[#1d4f7a] text-xs rounded-md leading-5">
                <p className="font-bold">💡 Ý nghĩa giáo dục:</p>
                <p className="mt-1">
                  Nếu bạn tăng <b>tốc độ tăng trưởng kỳ vọng (g)</b> quá cao trong công cụ, giá trị hợp lý sẽ tăng vọt. Tuy nhiên, trong thực tế, rất ít doanh nghiệp duy trì được mức tăng trưởng trên 20%/năm liên tục trong 5 năm. Đừng tự lừa dối mình bằng các kịch bản tăng trưởng quá lạc quan (FOMO)!
                </p>
              </div>
            </div>
          )}

          {activeModel === "graham" && (
            <div className="grid gap-3">
              <h3 className="font-bold text-[#17201b] text-base flex items-center gap-1.5">
                <Sparkles className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                Công thức Benjamin Graham Sửa Đổi
              </h3>
              <p className="text-xs text-[#5b6861] leading-5">
                Benjamin Graham - người thầy của Warren Buffett - đã đề xuất công thức định giá trị nội tại cho cổ phiếu tăng trưởng. JokingFinance sử dụng công thức sửa đổi phù hợp với thị trường Việt Nam:
              </p>

              <div className="my-2 text-center p-3.5 bg-[#f6f2e8] border border-[#e2d3a7] text-[#5b420b] font-mono text-sm rounded-md font-bold">
                V = EPS × (8.5 + 1.5 × g)
              </div>

              <div className="bg-[#f8fbf7] border border-[#d9ddd3] p-3 rounded-md font-mono text-xs leading-6 text-[#314039]">
                <p><b>Công thức áp dụng:</b></p>
                <p>V = {eps.toLocaleString("vi-VN")} × (8.5 + 1.5 × {growthRate})</p>
                <p>V = {eps.toLocaleString("vi-VN")} × {8.5 + 1.5 * growthRate}</p>
                <p>V = <b>{formatCurrency(grahamValuation.fairValue)}</b></p>
              </div>

              <div className="mt-1 p-3 bg-[#fff7d6] border border-[#e8d59b] text-[#7a4d00] text-xs rounded-md leading-5">
                <p className="font-bold">⚠️ Lưu ý an toàn:</p>
                <p className="mt-1">
                  Công thức Graham không áp dụng tốt cho các công ty có tốc độ tăng trưởng âm hoặc không ổn định. Giá trị nội tại Graham mang tính chất tham khảo định lượng nhanh, không nên là điểm tựa duy nhất để giải ngân tiền thật.
                </p>
              </div>
            </div>
          )}

          {activeModel === "dcf" && (
            <div className="grid gap-3">
              <h3 className="font-bold text-[#17201b] text-base flex items-center gap-1.5">
                <Sparkles className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                Mô hình EPS Discount (DCF Tối giản)
              </h3>
              <p className="text-xs text-[#5b6861] leading-5">
                Đây là mô hình chiết khấu dòng thu nhập. Nó cộng tổng toàn bộ các dòng EPS trong 5 năm tới đã được chiết khấu về hiện tại, cộng thêm phần định giá thanh lý ở năm thứ 5 (Terminal Value) cũng được chiết khấu về hiện tại.
              </p>

              <div className="bg-[#f8fbf7] border border-[#d9ddd3] p-3 rounded-md font-mono text-xs leading-5 text-[#314039] max-h-52 overflow-y-auto">
                <p className="font-bold border-b border-[#edf0eb] pb-1 mb-1">Dòng tiền chiết khấu (VND):</p>
                {dcfValuation.discountedEpsList.map((discEps, idx) => (
                  <p key={idx}>Năm {idx + 1}: {formatNumber(discEps)} đ</p>
                ))}
                <p className="mt-1.5 pt-1.5 border-t border-[#edf0eb]">
                  <b>Giá trị cuối kỳ năm 5 chiết khấu:</b> {formatNumber(dcfValuation.discountedTerminalValue)} đ
                </p>
                <p className="font-bold mt-1.5 text-sm text-[#166534]">
                  Tổng giá trị = {formatCurrency(dcfValuation.fairValue)}
                </p>
              </div>

              <div className="mt-1 p-3 bg-[#edf7ff] border border-[#b8d2e8] text-[#1d4f7a] text-xs rounded-md leading-5">
                <p className="font-bold">⚖️ Biên an toàn (Margin of Safety):</p>
                <p className="mt-1">
                  Nhà đầu tư giá trị luôn muốn mua cổ phiếu với giá <b>thấp hơn ít nhất 20-30%</b> so với Giá trị hợp lý tính toán được. Khoảng chênh lệch này gọi là Biên an toàn, giúp bạn sống sót nếu ước lượng tăng trưởng của bạn bị sai lệch trong tương lai.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Educational Article Promotion */}
        <section className="rounded-md border border-[#e2d3a7] bg-[#fff8df] p-5 text-sm">
          <h3 className="font-bold text-[#5b420b] flex items-center gap-1.5">
            <BookOpen className="h-4.5 w-4.5 text-[#0f766e]" />
            Học tập về Định giá cổ phiếu
          </h3>
          <p className="mt-2 text-[#5b420b] leading-6">
            Định giá không phải là một bộ môn khoa học chính xác mà là một nghệ thuật quản trị giả định. Hãy đọc các bài viết trong thư viện để nắm vững bản chất trước khi ra quyết định đầu tư.
          </p>
          <div className="mt-3">
            <Link
              href="/articles/khi-niem-dinh-gia-pe-va-bien-an-toan"
              className="inline-flex items-center gap-1 font-bold text-[#0f766e] hover:underline"
            >
              Đọc bài học: P/E và Biên an toàn trong thực tế
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
