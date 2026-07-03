"use client";

import { useState, useMemo } from "react";
import { formatCurrency, formatPercent } from "@/lib/format";
import {
  Flame,
  Info,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  BookOpen,
  ChevronRight,
  HelpCircle,
  Coins,
  Wallet,
  Clock
} from "lucide-react";
import Link from "next/link";

export function FireTool() {
  // Inputs
  const [currentAge, setCurrentAge] = useState(25);
  const [targetAge, setTargetAge] = useState(45);
  const [monthlyExpenseToday, setMonthlyExpenseToday] = useState(15000000); // 15 million VND
  const [fireExpenseRatio, setFireExpenseRatio] = useState(100); // 100% of current expense
  const [inflationRate, setInflationRate] = useState(4); // 4% average inflation in VN
  const [accumReturnRate, setAccumReturnRate] = useState(10); // 10% average return during accumulation
  const [retireReturnRate, setRetireReturnRate] = useState(7); // 7% average return during retirement
  const [currentNetWorth, setCurrentNetWorth] = useState(50000000); // 50 million VND current investment/savings
  const [monthlySurplus, setMonthlySurplus] = useState(5000000); // 5 million VND monthly investment capacity

  // Calculations
  const yearsToRetire = useMemo(() => {
    return Math.max(1, targetAge - currentAge);
  }, [currentAge, targetAge]);

  // Safe Withdrawal Rate (SWR) for Vietnam
  // Standard US rule is 4% (which assumes 7-8% return and 3-4% inflation).
  // In Vietnam, SWR is safer at RetireReturnRate - InflationRate.
  const safeWithdrawalRate = useMemo(() => {
    const swr = retireReturnRate - inflationRate;
    return Math.max(2, swr); // minimum 2% SWR
  }, [retireReturnRate, inflationRate]);

  const fireExpenseMonthlyToday = useMemo(() => {
    return (monthlyExpenseToday * fireExpenseRatio) / 100;
  }, [monthlyExpenseToday, fireExpenseRatio]);

  const fireExpenseAnnualToday = useMemo(() => {
    return fireExpenseMonthlyToday * 12;
  }, [fireExpenseMonthlyToday]);

  // Today's Money FIRE Number
  const fireNumberToday = useMemo(() => {
    return fireExpenseAnnualToday / (safeWithdrawalRate / 100);
  }, [fireExpenseAnnualToday, safeWithdrawalRate]);

  // Future FIRE Number adjusted for inflation
  const fireNumberFuture = useMemo(() => {
    return fireNumberToday * Math.pow(1 + inflationRate / 100, yearsToRetire);
  }, [fireNumberToday, inflationRate, yearsToRetire]);

  // Future value of current net worth at the end of accumulation period
  const fvCurrentNetWorth = useMemo(() => {
    return currentNetWorth * Math.pow(1 + accumReturnRate / 100, yearsToRetire);
  }, [currentNetWorth, accumReturnRate, yearsToRetire]);

  // Required monthly investment to bridge the gap
  const gapToBridge = useMemo(() => {
    return Math.max(0, fireNumberFuture - fvCurrentNetWorth);
  }, [fireNumberFuture, fvCurrentNetWorth]);

  const requiredMonthlyInvestment = useMemo(() => {
    if (gapToBridge <= 0) return 0;
    
    const r = accumReturnRate / 100 / 12;
    const n = yearsToRetire * 12;
    
    if (r === 0) return gapToBridge / n;
    
    // FV = Pmt * [((1 + r)^n - 1) / r]
    // => Pmt = FV / [((1 + r)^n - 1) / r]
    return gapToBridge / (((Math.pow(1 + r, n) - 1)) / r);
  }, [gapToBridge, accumReturnRate, yearsToRetire]);

  // Projected age of FIRE based on current monthly surplus
  const projectedYearsToFire = useMemo(() => {
    const monthlyRate = accumReturnRate / 100 / 12;
    const target = fireNumberFuture; // Let's simplify and use target future FIRE (approximate)
    
    // Let's solve: CurrentNetWorth * (1+r)^n + MonthlySurplus * [((1+r)^n - 1) / r] = FIRE_Future_n
    // Since FIRE_Future also grows with inflation: FIRE_n = FIRE_0 * (1+inf)^n
    // This requires numerical solving. Let's run a projection year by year (up to 60 years) to find when Net Worth exceeds Future FIRE.
    let netWorth = currentNetWorth;
    const monthlyInflation = inflationRate / 100 / 12;
    
    for (let month = 1; month <= 720; month++) { // max 60 years
      netWorth = netWorth * (1 + monthlyRate) + monthlySurplus;
      
      const fireTargetAtMonth = fireNumberToday * Math.pow(1 + inflationRate / 100, month / 12);
      if (netWorth >= fireTargetAtMonth) {
        return month / 12;
      }
    }
    
    return 60; // capped at 60 years
  }, [currentNetWorth, monthlySurplus, accumReturnRate, inflationRate, fireNumberToday]);

  const projectedAge = useMemo(() => {
    return Math.round(currentAge + projectedYearsToFire);
  }, [currentAge, projectedYearsToFire]);

  const fireStatus = useMemo(() => {
    const ratio = monthlySurplus / (requiredMonthlyInvestment || 1);
    
    if (gapToBridge === 0) {
      return {
        label: "Đã đạt tự do tài chính! 🎉",
        style: "border-[#b9d9c5] bg-[#edf6ed] text-[#166534]",
        desc: "Tài sản hiện tại của bạn đã đủ để trang trải cuộc sống độc lập tài chính dài hạn. Chúc mừng bạn!"
      };
    }

    if (monthlySurplus >= requiredMonthlyInvestment) {
      return {
        label: "Lộ trình Rất Khả Thi 👍",
        style: "border-[#b9d9c5] bg-[#edf6ed] text-[#166534]",
        desc: `Với khoản đầu tư hàng tháng là ${formatCurrency(monthlySurplus)}, bạn hoàn toàn có thể cán đích FIRE ở tuổi ${targetAge} (sớm hơn dự kiến, khoảng tuổi ${projectedAge}). Hãy duy trì kỷ luật!`
      };
    } else if (ratio >= 0.6) {
      return {
        label: "Lộ trình Tiệm Cận ⚖️",
        style: "border-[#e8d59b] bg-[#fff7d6] text-[#7a4d00]",
        desc: `Bạn đang tích lũy tốt nhưng còn thiếu khoảng ${formatCurrency(requiredMonthlyInvestment - monthlySurplus)} mỗi tháng để đạt mục tiêu tuổi ${targetAge}. Bạn sẽ đạt FIRE muộn hơn một chút (ở tuổi ${projectedAge}).`
      };
    } else {
      return {
        label: "Lộ trình Cần Điều Chỉnh ⚠️",
        style: "border-[#f1bea8] bg-[#fff0e8] text-[#9a3412]",
        desc: `Khoản tích lũy hiện tại khó đạt mục tiêu tuổi ${targetAge} (dự kiến phải tới tuổi ${projectedAge} mới đạt). Hãy cân nhắc tăng thu nhập/tiết kiệm, kéo dài tuổi mục tiêu hoặc tối ưu hóa hiệu suất đầu tư.`
      };
    }
  }, [monthlySurplus, requiredMonthlyInvestment, gapToBridge, targetAge, projectedAge]);

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      {/* Left Column: Inputs */}
      <div className="flex flex-col gap-5">
        <section className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-[#17201b] mb-4 flex items-center gap-2">
            <Flame className="h-5 w-5 text-[#0f766e]" />
            1. Mục tiêu Thời gian & Chi tiêu Tự do
          </h2>

          <div className="grid gap-5">
            {/* Age Inputs */}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5 text-xs font-bold uppercase text-[#5b6861]">
                Tuổi hiện tại
                <input
                  type="number"
                  min={18}
                  max={80}
                  value={currentAge}
                  onChange={(e) => setCurrentAge(Math.max(18, Number(e.target.value)))}
                  className="h-10 mt-1 rounded-md border border-[#d9ddd3] px-3 font-semibold text-sm text-[#17201b]"
                />
              </label>

              <label className="grid gap-1.5 text-xs font-bold uppercase text-[#5b6861]">
                Tuổi mục tiêu tự do (FIRE)
                <input
                  type="number"
                  min={currentAge + 1}
                  max={90}
                  value={targetAge}
                  onChange={(e) => setTargetAge(Math.max(currentAge + 1, Number(e.target.value)))}
                  className="h-10 mt-1 rounded-md border border-[#d9ddd3] px-3 font-semibold text-sm text-[#17201b]"
                />
              </label>
            </div>

            <div className="text-xs text-[#5b6861] -mt-2">
              Bạn có <b>{yearsToRetire} năm</b> tích lũy từ nay tới thời điểm đạt Tự do Tài chính.
            </div>

            {/* Expense Inputs */}
            <label className="grid gap-1.5 text-sm font-semibold text-[#314039] border-t border-[#edf0eb] pt-4">
              <div className="flex justify-between">
                <span>Chi phí sinh hoạt hàng tháng hiện tại</span>
                <span className="font-mono text-[#0f766e] font-bold">
                  {monthlyExpenseToday.toLocaleString("vi-VN")} đ
                </span>
              </div>
              <input
                type="range"
                min={5000000}
                max={100000000}
                step={1000000}
                value={monthlyExpenseToday}
                onChange={(e) => setMonthlyExpenseToday(Number(e.target.value))}
                className="w-full mt-2 accent-[#0f766e]"
              />
            </label>

            <label className="grid gap-1.5 text-sm font-semibold text-[#314039] border-t border-[#edf0eb] pt-4">
              <div className="flex justify-between">
                <span>Tỷ lệ chi tiêu khi tự do tài chính (so với hiện tại)</span>
                <span className="font-mono text-[#0f766e] font-bold">
                  {fireExpenseRatio}% ({formatCurrency(fireExpenseMonthlyToday)}/tháng)
                </span>
              </div>
              <input
                type="range"
                min={50}
                max={150}
                step={5}
                value={fireExpenseRatio}
                onChange={(e) => setFireExpenseRatio(Number(e.target.value))}
                className="w-full mt-2 accent-[#0f766e]"
              />
              <span className="text-[11px] text-[#5b6861] font-normal leading-4 mt-1">
                💡 <b>80% (Lean FIRE):</b> Lối sống tối giản, bớt chi tiêu xã giao, đi lại công sở. <br />
                💡 <b>100% (Standard FIRE):</b> Giữ nguyên mức sống thoải mái như hiện tại. <br />
                💡 <b>120% - 150% (Fat FIRE):</b> Muốn đi du lịch nhiều hơn, nâng cấp trải nghiệm sống.
              </span>
            </label>
          </div>
        </section>

        <section className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-[#17201b] mb-4 flex items-center gap-2">
            <Coins className="h-5 w-5 text-[#0f766e]" />
            2. Tài sản hiện có & Khả năng đầu tư
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5 text-xs font-bold uppercase text-[#5b6861]">
              Tài sản đầu tư hiện tại (VND)
              <input
                type="number"
                min={0}
                step={10000000}
                value={currentNetWorth}
                onChange={(e) => setCurrentNetWorth(Math.max(0, Number(e.target.value)))}
                className="h-10 mt-1 rounded-md border border-[#d9ddd3] px-3 font-semibold text-sm text-[#17201b]"
              />
              <span className="text-[10px] text-[#5b6861] font-normal mt-1 normal-case">
                (Gồm tiền gửi tiết kiệm, cổ phiếu, chứng chỉ quỹ hiện có)
              </span>
            </label>

            <label className="grid gap-1.5 text-xs font-bold uppercase text-[#5b6861]">
              Tiền nhàn rỗi đầu tư thêm hàng tháng (VND)
              <input
                type="number"
                min={0}
                step={1000000}
                value={monthlySurplus}
                onChange={(e) => setMonthlySurplus(Math.max(0, Number(e.target.value)))}
                className="h-10 mt-1 rounded-md border border-[#d9ddd3] px-3 font-semibold text-sm text-[#17201b]"
              />
              <span className="text-[10px] text-[#5b6861] font-normal mt-1 normal-case">
                (Số tiền bạn kỷ luật trích ra đầu tư mỗi tháng từ thu nhập)
              </span>
            </label>
          </div>
        </section>

        <section className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-[#17201b] mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#0f766e]" />
            3. Giả định Thị trường & Lạm phát Việt Nam
          </h2>

          <div className="grid gap-5">
            <label className="grid gap-1.5 text-sm font-semibold text-[#314039]">
              <div className="flex justify-between">
                <span>Tỷ lệ lạm phát bình quân năm</span>
                <span className="font-mono text-[#0f766e] font-bold">{inflationRate}%/năm</span>
              </div>
              <input
                type="range"
                min={2}
                max={7}
                step={0.5}
                value={inflationRate}
                onChange={(e) => setInflationRate(Number(e.target.value))}
                className="w-full mt-2 accent-[#0f766e]"
              />
              <span className="text-xs text-[#5b6861] font-normal">
                (Mức lạm phát mục tiêu dài hạn của Ngân hàng Nhà nước thường là 4%)
              </span>
            </label>

            <div className="grid gap-4 sm:grid-cols-2 border-t border-[#edf0eb] pt-4">
              <label className="grid gap-1.5 text-xs font-bold uppercase text-[#5b6861]">
                Tỷ suất sinh lời kỳ vọng tích lũy
                <select
                  value={accumReturnRate}
                  onChange={(e) => setAccumReturnRate(Number(e.target.value))}
                  className="h-10 mt-1 rounded-md border border-[#d9ddd3] bg-white px-3 font-semibold text-sm text-[#17201b]"
                >
                  <option value={6}>6% - Gửi tiết kiệm / Trái phiếu an toàn</option>
                  <option value={8}>8% - Danh mục hỗn hợp (tiết kiệm + cổ phiếu)</option>
                  <option value={10}>10% - Cổ phiếu cơ bản / Quỹ mở cổ phiếu</option>
                  <option value={12}>12% - VNstock tối ưu / Cổ phiếu tăng trưởng tốt</option>
                  <option value={14}>14% - Kỳ vọng tối đa (Rủi ro cao)</option>
                </select>
              </label>

              <label className="grid gap-1.5 text-xs font-bold uppercase text-[#5b6861]">
                Tỷ suất sinh lời kỳ vọng khi nghỉ hưu
                <select
                  value={retireReturnRate}
                  onChange={(e) => setRetireReturnRate(Number(e.target.value))}
                  className="h-10 mt-1 rounded-md border border-[#d9ddd3] bg-white px-3 font-semibold text-sm text-[#17201b]"
                >
                  <option value={5}>5% - An toàn tuyệt đối (Rút tiết kiệm)</option>
                  <option value={7}>7% - Bảo thủ ưu tiên bảo toàn vốn</option>
                  <option value={9}>9% - Hỗn hợp an toàn</option>
                  <option value={11}>11% - Vẫn giữ phần lớn cổ phiếu</option>
                </select>
              </label>
            </div>
            <span className="text-[11px] text-[#5b6861] leading-4 -mt-2">
              💡 Khi nghỉ hưu, bạn nên dịch chuyển tài sản sang các kênh an toàn hơn (Fixed Income, tiết kiệm) để tránh biến động lớn, do đó tỷ suất sinh lời kỳ vọng khi nghỉ hưu thường thấp hơn giai đoạn tích lũy.
            </span>
          </div>
        </section>
      </div>

      {/* Right Column: Diagnostics & Results */}
      <div className="flex flex-col gap-5 xl:sticky xl:top-6 self-start">
        {/* FIRE Numbers card */}
        <section className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-[#17201b] mb-4">Mục tiêu FIRE của bạn</h2>

          <div className="grid gap-4">
            <div className="p-4 bg-[#f8fbf7] border border-[#edf0eb] rounded-md">
              <div className="flex justify-between items-start">
                <p className="text-xs font-bold text-[#66736c] uppercase">Con số FIRE (Theo giá trị hôm nay)</p>
                <div className="group relative">
                  <HelpCircle className="h-4 w-4 text-[#5b6861] cursor-pointer" />
                  <div className="pointer-events-none absolute right-0 bottom-full mb-2 w-64 rounded bg-[#17201b] p-2 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 leading-4 z-10">
                    Bằng chi phí năm chia cho Tỷ lệ rút an toàn (SWR = {safeWithdrawalRate}%).
                  </div>
                </div>
              </div>
              <p className="text-2xl font-black text-[#314039] mt-1">
                {formatCurrency(fireNumberToday)}
              </p>
              <p className="text-[11px] text-[#5b6861] mt-1">
                Tương ứng với mức chi tiêu <b>{formatCurrency(fireExpenseMonthlyToday)}/tháng</b>.
              </p>
            </div>

            <div className="p-4 bg-[#e8f6ed] border border-[#b9d9c5] rounded-md">
              <div className="flex justify-between items-start">
                <p className="text-xs font-bold text-[#166534] uppercase">Con số FIRE (Sau điều chỉnh lạm phát sau {yearsToRetire} năm)</p>
                <div className="group relative">
                  <HelpCircle className="h-4 w-4 text-[#166534] cursor-pointer" />
                  <div className="pointer-events-none absolute right-0 bottom-full mb-2 w-64 rounded bg-[#17201b] p-2 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 leading-4 z-10">
                    Số tiền thực tế bạn cần có ở tuổi {targetAge} để có sức mua tương đương {formatCurrency(fireNumberToday)} hôm nay, giả định lạm phát {inflationRate}%/năm.
                  </div>
                </div>
              </div>
              <p className="text-3xl font-black text-[#166534] mt-1 font-mono">
                {formatCurrency(fireNumberFuture)}
              </p>
              <p className="text-xs text-[#15803d] font-semibold mt-1">
                Lạm phát khiến giá trị danh nghĩa tăng lên {Math.round(fireNumberFuture / fireNumberToday)} lần.
              </p>
            </div>
          </div>

          {/* Joking Finance conversions */}
          <div className="mt-5 border-t border-[#edf0eb] pt-5">
            <h3 className="text-sm font-bold text-[#17201b] mb-3 flex items-center gap-1.5">
              <Sparkles className="h-4.5 w-4.5 text-yellow-500 fill-yellow-500" />
              Quy đổi trong JokingFinance:
            </h3>

            <div className="grid gap-3 text-sm leading-6 text-[#4a5a52]">
              <div className="flex items-start gap-2.5">
                <TrendingUp className="h-4 w-4 text-[#0f766e] mt-1 shrink-0" />
                <span>
                  Con số tự do tài chính tương lai tương đương với khoảng <b>{(fireNumberFuture / 1).toLocaleString("vi-VN", { maximumFractionDigits: 0 })} điểm ảo</b>.
                  Bằng <b>{Math.round(fireNumberFuture / 100000000)} lần</b> tài sản ảo mặc định ban đầu của bạn (100 triệu điểm).
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="h-4 w-4 text-[#0f766e] mt-1 shrink-0" />
                <span>
                  Tỷ lệ rút an toàn đề xuất cho Việt Nam là <b>{safeWithdrawalRate}%/năm</b> (đã trừ lạm phát bình quân). Thấp hơn quy tắc 4% của Mỹ để đảm bảo tài sản không bị cạn kiệt trong các chu kỳ lạm phát cao tại thị trường mới nổi.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Roadmap Plan status card */}
        <section className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-[#17201b] mb-3">Lộ trình thực hiện</h2>

          <div className="mt-4">
            <p className="text-xs font-bold text-[#66736c] uppercase">Khoản tích lũy định kỳ đề xuất</p>
            <p className="text-2xl font-black text-[#0f766e] mt-1 font-mono">
              {formatCurrency(requiredMonthlyInvestment)} <span className="text-sm font-normal text-[#5b6861]">/ tháng</span>
            </p>
            <p className="text-xs text-[#5b6861] mt-1">
              Bạn cần kỷ luật đầu tư số tiền này liên tục trong {yearsToRetire} năm tới.
            </p>
          </div>

          <div className="mt-4 border-t border-[#edf0eb] pt-4">
            <div className="flex justify-between text-sm font-semibold text-[#4a5a52] mb-2">
              <span>Đánh giá lộ trình tích lũy:</span>
            </div>
            <div className={`p-4 border rounded-md text-sm ${fireStatus.style}`}>
              <p className="font-bold flex items-center gap-1.5 text-base">
                {fireStatus.label}
              </p>
              <p className="mt-1.5 text-xs leading-5">
                {fireStatus.desc}
              </p>
            </div>
          </div>

          {projectedAge < 60 && gapToBridge > 0 && (
            <div className="mt-4 p-3.5 bg-[#edf5ee] border border-[#d2dfd5] text-[#166534] rounded-md text-xs leading-5">
              📌 Với mức đầu tư hiện tại là <b>{formatCurrency(monthlySurplus)}/tháng</b>, bạn ước tính sẽ tích lũy đủ con số tự do tài chính đã điều chỉnh lạm phát vào khoảng <b>tuổi {projectedAge}</b>.
            </div>
          )}
        </section>

        {/* Related lessons */}
        <section className="rounded-md border border-[#e0e5dc] bg-[#fdfbf7] p-5">
          <h3 className="font-bold text-[#17201b] flex items-center gap-1">
            <BookOpen className="h-4 w-4 text-[#0f766e]" />
            Bài học đề xuất về FIRE:
          </h3>
          <ul className="mt-3 grid gap-2 text-sm">
            <li>
              <Link
                href="/articles/tu-do-tai-chinh-fire-tai-viet-nam-lo-trinh-thuc-te"
                className="text-[#0f766e] hover:underline flex items-center gap-1 font-semibold"
              >
                <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                Tự do tài chính (FIRE) tại Việt Nam: Con số và thực tế
              </Link>
            </li>
            <li>
              <Link
                href="/articles/quy-du-phong-bao-nhieu-la-du-truoc-khi-dau-tu"
                className="text-[#0f766e] hover:underline flex items-center gap-1 font-semibold"
              >
                <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                Quỹ dự phòng bao nhiêu là đủ trước khi đầu tư?
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
