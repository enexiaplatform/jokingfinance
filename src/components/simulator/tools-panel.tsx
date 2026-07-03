"use client";

import { useState, useMemo } from "react";
import { useVirtualPortfolio } from "./use-virtual-portfolio";
import { Disclaimer } from "@/components/ui/disclaimer";
import { formatPoints, formatCurrency } from "@/lib/format";
import {
  Calculator,
  FileCheck2,
  Sparkles,
  Copy,
  Check,
  AlertCircle,
  TrendingUp,
  Info,
  ArrowRight,
  BookOpen,
  ChevronRight,
  ShieldCheck,
  Zap
} from "lucide-react";
import Link from "next/link";
import { ValuationTool } from "./valuation-tool";
import { BiasTool } from "./bias-tool";
import { FireTool } from "./fire-tool";
import { DcaTool } from "./dca-tool";

type Tab = "checklist" | "calculator" | "allocation" | "valuation" | "bias" | "fire" | "dca";

type ChecklistQuestion = {
  id: number;
  text: string;
  options: {
    label: string;
    isCorrect: boolean;
    feedback: string;
  }[];
};

const CHECKLIST_QUESTIONS: ChecklistQuestion[] = [
  {
    id: 1,
    text: "Khoản tiền đầu tư này tôi có chắc không cần dùng đến trong ít nhất 12 tháng tới?",
    options: [
      {
        label: "Đúng, đây là tiền nhàn rỗi dài hạn.",
        isCorrect: true,
        feedback: "Tuyệt vời. Đầu tư bằng tiền nhàn rỗi dài hạn giúp bạn không bị áp lực bán tháo khi thị trường rung lắc ngắn hạn."
      },
      {
        label: "Không, đây là tiền sinh hoạt hoặc quỹ khẩn cấp có thể cần sớm.",
        isCorrect: false,
        feedback: "⚠️ Cảnh báo nguy hiểm! Nếu thị trường giảm 20% đúng lúc bạn cần tiền gấp, bạn sẽ bị buộc phải cắt lỗ ngay đáy để chi tiêu."
      }
    ]
  },
  {
    id: 2,
    text: "Tôi đã trả hết nợ lãi cao (như thẻ tín dụng) và lập quỹ dự phòng tối thiểu 3 tháng chi phí chưa?",
    options: [
      {
        label: "Đúng, nợ thẻ đã sạch, quỹ dự phòng đã sẵn sàng.",
        isCorrect: true,
        feedback: "Rất chuẩn. Đây là cái khiên bảo vệ tâm lý cực tốt giúp bạn vững tay chèo trên thị trường."
      },
      {
        label: "Chưa, tôi vẫn còn nợ thẻ chưa trả hoặc chưa có quỹ dự phòng.",
        isCorrect: false,
        feedback: "⚠️ Chi phí vốn quá cao! Lãi thẻ tín dụng khoảng 30-40%/năm. Hãy trả sạch nợ lãi cao trước khi mơ hồ về lợi nhuận 15-20% từ cổ phiếu."
      }
    ]
  },
  {
    id: 3,
    text: "Tôi có giải thích được mô hình kinh doanh của công ty trong 3 câu đơn giản cho trẻ 10 tuổi không?",
    options: [
      {
        label: "Có, tôi hiểu họ bán sản phẩm gì, cho ai, và thu tiền thế nào.",
        isCorrect: true,
        feedback: "Tốt. Hiểu mô hình kinh doanh giúp bạn biết doanh nghiệp kiếm tiền thật hay chỉ là tin đồn thổi."
      },
      {
        label: "Không rõ, chỉ thấy hội nhóm hô hào mã này sắp có sóng lớn.",
        isCorrect: false,
        feedback: "⚠️ Bẫy mua mù quáng! Giao dịch theo tin đồn là cách nhanh nhất để làm giàu cho admin hội nhóm và người xả hàng."
      }
    ]
  },
  {
    id: 4,
    text: "Tôi đã viết luận điểm mua rõ ràng (ví dụ: sản lượng tăng, biên lợi nhuận cải thiện, định giá rẻ) chưa?",
    options: [
      {
        label: "Đã viết cụ thể, dựa trên số liệu kinh doanh.",
        isCorrect: true,
        feedback: "Hợp lý. Luận điểm rõ ràng là điểm tựa duy nhất để bạn tự tin giữ cổ phiếu khi thị trường chung đỏ lửa."
      },
      {
        label: "Chưa viết, chỉ mua vì đồ thị kỹ thuật đẹp hoặc thích tên mã.",
        isCorrect: false,
        feedback: "⚠️ Thiếu luận điểm! Biểu đồ kỹ thuật chỉ là quá khứ. Không có luận điểm cơ bản, bạn sẽ hoang mang bán tháo ngay khi giá rung lắc nhẹ."
      }
    ]
  },
  {
    id: 5,
    text: "Tôi có xác định được ít nhất 2 rủi ro cụ thể có thể chứng minh luận điểm của tôi sai chưa?",
    options: [
      {
        label: "Đã xác định rõ (ví dụ: giá nguyên liệu tăng, dự án chậm tiến độ).",
        isCorrect: true,
        feedback: "Tư duy phản biện xuất sắc! Biết điểm sai giúp bạn chủ động cắt lỗ hoặc cơ cấu danh mục trước khi quá muộn."
      },
      {
        label: "Chưa nghĩ tới rủi ro, tôi tin chắc mã này chỉ có tăng.",
        isCorrect: false,
        feedback: "⚠️ Bẫy tự tin thái quá! Thị trường chứng khoán luôn có biến số bất ngờ. Không tính rủi ro nghĩa là bạn đang chấp nhận rủi ro vô tận."
      }
    ]
  },
  {
    id: 6,
    text: "Tôi có tuân thủ quy tắc phân bổ tỷ trọng (không vượt quá 20% tổng giá trị danh mục ảo cho mã này) không?",
    options: [
      {
        label: "Đúng, tôi đi lệnh với tỷ trọng vừa phải để kiểm soát rủi ro.",
        isCorrect: true,
        feedback: "Đúng chuẩn quản trị vốn. Một sai số nhỏ ở mã này không thể làm sụp đổ toàn bộ thành quả danh mục của bạn."
      },
      {
        label: "Không, tôi muốn All-in để nhanh x2, x3 tài khoản ảo.",
        isCorrect: false,
        feedback: "⚠️ Cơn ác mộng All-in! Chỉ cần một tin đồn hoặc thiên nga đen, tài khoản của bạn sẽ bay màu. Đa dạng hóa danh mục để sống sót dài lâu."
      }
    ]
  },
  {
    id: 7,
    text: "Tôi có cam kết lịch rà soát lại giao dịch này (sau 7, 14 hoặc 30 ngày) để kiểm chứng lại luận điểm?",
    options: [
      {
        label: "Có, tôi đã chọn lịch nhắc nhở rà soát nhật ký.",
        isCorrect: true,
        feedback: "Hành vi tuyệt vời! Việc tự xem lại định kỳ quan trọng hơn nhiều việc nhìn bảng điện xanh đỏ mỗi ngày."
      },
      {
        label: "Không, tôi định mua xong sẽ theo dõi bảng giá hàng giờ.",
        isCorrect: false,
        feedback: "⚠️ Nghiện bảng điện! Việc nhìn bảng giá liên tục chỉ kích hoạt cảm xúc FOMO hoặc sợ hãi, dẫn đến các lệnh mua bán vô kỷ luật."
      }
    ]
  }
];

const FOMO_PRESETS = [
  {
    label: "Ly trà sữa/cà phê thương hiệu sang chảnh (mỗi ngày)",
    amount: 60000,
    period: "daily",
    description: "Tiền cà phê chém gió hoặc trà sữa trân châu hoàng kim."
  },
  {
    label: "Bữa ăn nhậu/tụ tập bạn bè ngẫu hứng (mỗi tuần)",
    amount: 400000,
    period: "weekly",
    description: "Tiêu xài cuối tuần do cả nể hoặc sợ bỏ lỡ cuộc vui."
  },
  {
    label: "Mua sắm quần áo theo trend chỉ mặc 1 lần (mỗi tháng)",
    amount: 1200000,
    period: "monthly",
    description: "Săn sale quần áo, phụ kiện đẹp mắt nhưng cất tủ là chính."
  },
  {
    label: "Đăng ký thẻ gym/khóa học mua cho oai rồi bỏ xó (mỗi tháng)",
    amount: 800000,
    period: "monthly",
    description: "Đóng tiền phí hội viên để lấy động lực ảo rồi lười không đi."
  },
  {
    label: "Lần mua đuổi coin rác / cổ phiếu penny bị úp bô (một lần)",
    amount: 5000000,
    period: "once",
    description: "Đu đỉnh theo hội nhóm phím hàng rồi phải cắt lỗ đau đớn."
  }
];

export function ToolsPanel() {
  const { state, summary, loading } = useVirtualPortfolio();
  const [activeTab, setActiveTab] = useState<Tab>("checklist");

  // Checklist state
  const [selectedTicker, setSelectedTicker] = useState("FPT");
  const [quantity, setQuantity] = useState(10);
  const [customThesis, setCustomThesis] = useState("");
  const [customRisk, setCustomRisk] = useState("");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [copied, setCopied] = useState(false);

  // Calculator state
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [calcAmount, setCalcAmount] = useState(60000);
  const [calcPeriod, setCalcPeriod] = useState("daily");
  const [interestRate, setInterestRate] = useState(9); // 9% average return
  const [years, setYears] = useState(10);

  // Allocation state
  const [monthlyExpense, setMonthlyExpense] = useState(15000000);
  const [currentSavings, setCurrentSavings] = useState(20000000);
  const [incomeStability, setIncomeStability] = useState<"steady" | "variable" | "high-risk">("steady");
  const [monthlySurplus, setMonthlySurplus] = useState(5000000);

  const selectedStock = useMemo(() => {
    return state?.stocks?.find((s) => s.ticker === selectedTicker) || state?.stocks?.[0];
  }, [state, selectedTicker]);

  const tradeValue = useMemo(() => {
    if (!selectedStock) return 0;
    return selectedStock.currentPrice * quantity;
  }, [selectedStock, quantity]);

  const portfolioValue = useMemo(() => {
    return summary?.portfolioValue || 100000000;
  }, [summary]);

  const tradeWeightPercent = useMemo(() => {
    return (tradeValue / portfolioValue) * 100;
  }, [tradeValue, portfolioValue]);

  const disciplineScore = useMemo(() => {
    let score = 0;
    CHECKLIST_QUESTIONS.forEach((q) => {
      const ansIndex = answers[q.id];
      if (ansIndex !== undefined && q.options[ansIndex]?.isCorrect) {
        score++;
      }
    });
    return score;
  }, [answers]);

  const allQuestionsAnswered = useMemo(() => {
    return CHECKLIST_QUESTIONS.every((q) => answers[q.id] !== undefined);
  }, [answers]);

  const generatedThesis = useMemo(() => {
    if (!selectedStock) return "";
    const scoreText = `${disciplineScore}/${CHECKLIST_QUESTIONS.length}`;
    const statusText =
      disciplineScore === 7
        ? "Đạt chuẩn Kỷ luật Lý trí 🏆"
        : disciplineScore >= 5
          ? "Kỷ luật khá - Cần lưu ý 📈"
          : "⚠️ Đang giao dịch FOMO / Rủi ro cao";

    return `LUẬN ĐIỂM GIAO DỊCH [${selectedStock.ticker}]
- Chiều giao dịch: Mua ảo ở mức giá ${selectedStock.currentPrice.toLocaleString("vi-VN")} điểm
- Luận điểm cốt lõi: ${customThesis || "Chưa ghi nhận chi tiết."}
- Rủi ro dự kiến: ${customRisk || "Chưa phân tích kỹ."}
- Kiểm định JokingFinance: Điểm kỷ luật ${scoreText} (${statusText})`;
  }, [selectedStock, disciplineScore, customThesis, customRisk]);

  const generatedRiskNote = useMemo(() => {
    const listWarning = CHECKLIST_QUESTIONS.filter((q) => {
      const idx = answers[q.id];
      return idx !== undefined && !q.options[idx]?.isCorrect;
    })
      .map((q) => `- ${q.text.replace(/\?$/, "")}`)
      .join("\n");

    return `Rủi ro cốt lõi: ${customRisk || "Chưa ghi nhận chi tiết."}
${listWarning ? `Cảnh báo kỷ luật chưa đạt:\n${listWarning}` : "Tất cả các bước kỷ luật đạt chuẩn."}`;
  }, [customRisk, answers]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedThesis);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculator logic
  const calculatorResults = useMemo(() => {
    let monthlySavings = 0;
    if (calcPeriod === "daily") {
      monthlySavings = calcAmount * 30;
    } else if (calcPeriod === "weekly") {
      monthlySavings = calcAmount * 4.33;
    } else if (calcPeriod === "monthly") {
      monthlySavings = calcAmount;
    } else {
      // once
      monthlySavings = 0;
    }

    const monthlyRate = interestRate / 100 / 12;
    const totalMonths = years * 12;
    let totalPrincipal = 0;
    let futureValue = 0;

    if (calcPeriod === "once") {
      totalPrincipal = calcAmount;
      futureValue = calcAmount * Math.pow(1 + interestRate / 100, years);
    } else {
      totalPrincipal = monthlySavings * totalMonths;
      if (monthlyRate === 0) {
        futureValue = totalPrincipal;
      } else {
        futureValue = monthlySavings * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
      }
    }

    const interestEarned = futureValue - totalPrincipal;

    // Joking finance conversions
    const fptPrice = state?.stocks?.find((s) => s.ticker === "FPT")?.currentPrice || 130000;
    const fptCount = Math.round(futureValue / fptPrice);
    const monthsOfSurvival = Math.round(futureValue / 8000000); // 8 million per month basic survival

    return {
      totalPrincipal,
      futureValue,
      interestEarned,
      fptCount,
      monthsOfSurvival
    };
  }, [calcAmount, calcPeriod, interestRate, years, state]);

  const handleSelectPreset = (index: number) => {
    setSelectedPresetIndex(index);
    const preset = FOMO_PRESETS[index];
    if (preset) {
      setCalcAmount(preset.amount);
      setCalcPeriod(preset.period);
    }
  };

  const allocationResults = useMemo(() => {
    let recommendedMonths = 6;
    if (incomeStability === "variable") recommendedMonths = 9;
    if (incomeStability === "high-risk") recommendedMonths = 12;

    const recommendedEmergencyFund = monthlyExpense * recommendedMonths;
    const progressPercent = Math.min(100, Math.round((currentSavings / recommendedEmergencyFund) * 100));
    const gapAmount = Math.max(0, recommendedEmergencyFund - currentSavings);
    const isFunded = currentSavings >= recommendedEmergencyFund;

    // Allocation percentages
    let emergencyFundAlloc = 0;
    let safeAssetAlloc = 0;
    let equityAlloc = 0;
    let practiceAlloc = 0;

    if (!isFunded) {
      // Emergency fund is not fully funded yet
      emergencyFundAlloc = 70; // 70% goes to building emergency fund
      safeAssetAlloc = 10;      // 10% to normal savings
      equityAlloc = 0;         // 0% to real stock investment (too risky!)
      practiceAlloc = 20;      // 20% to practice (simulation/education)
    } else {
      // Emergency fund is fully funded
      emergencyFundAlloc = 0;
      safeAssetAlloc = 40;     // 40% to safe/fixed income (saving, CD)
      equityAlloc = 40;        // 40% to real stock investment (long-term)
      practiceAlloc = 20;      // 20% to tactical practice or short-term trade
    }

    const emergencyFundValue = (monthlySurplus * emergencyFundAlloc) / 100;
    const safeAssetValue = (monthlySurplus * safeAssetAlloc) / 100;
    const equityValue = (monthlySurplus * equityAlloc) / 100;
    const practiceValue = (monthlySurplus * practiceAlloc) / 100;

    return {
      recommendedMonths,
      recommendedEmergencyFund,
      progressPercent,
      gapAmount,
      isFunded,
      emergencyFundAlloc,
      safeAssetAlloc,
      equityAlloc,
      practiceAlloc,
      emergencyFundValue,
      safeAssetValue,
      equityValue,
      practiceValue,
    };
  }, [monthlyExpense, currentSavings, incomeStability, monthlySurplus]);

  if (loading) {
    return <div className="rounded-md border border-[#d9ddd3] bg-white p-6">Đang tải công cụ...</div>;
  }

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-bold text-[#17201b]">Hộp công cụ JokingFinance</h1>
        <p className="mt-2 text-[#5b6861]">
          Công cụ hỗ trợ chẩn đoán tâm lý và mô phỏng tác động chi phí cơ hội trước khi đặt lệnh thật.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#e0e5dc] gap-2 font-sans overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("checklist")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === "checklist"
              ? "border-[#0f766e] text-[#0f766e]"
              : "border-transparent text-[#5b6861] hover:text-[#17201b]"
          }`}
        >
          📋 Checklist Kỷ Luật & Lệnh Mẫu
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("calculator")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === "calculator"
              ? "border-[#0f766e] text-[#0f766e]"
              : "border-transparent text-[#5b6861] hover:text-[#17201b]"
          }`}
        >
          🧮 Lãi Kép & Lạm Phát Cảm Xúc
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("allocation")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === "allocation"
              ? "border-[#0f766e] text-[#0f766e]"
              : "border-transparent text-[#5b6861] hover:text-[#17201b]"
          }`}
        >
          🛡️ Quỹ Dự Phòng & Phân Bổ Vốn
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("valuation")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === "valuation"
              ? "border-[#0f766e] text-[#0f766e]"
              : "border-transparent text-[#5b6861] hover:text-[#17201b]"
          }`}
        >
          💎 Định Giá Trị Nội Tại
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("bias")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === "bias"
              ? "border-[#0f766e] text-[#0f766e]"
              : "border-transparent text-[#5b6861] hover:text-[#17201b]"
          }`}
        >
          🧠 Trắc Nghiệm Tâm Lý Giao Dịch
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("fire")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === "fire"
              ? "border-[#0f766e] text-[#0f766e]"
              : "border-transparent text-[#5b6861] hover:text-[#17201b]"
          }`}
        >
          🔥 Hoạch định FIRE (Tự Do Tài Chính)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("dca")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === "dca"
              ? "border-[#0f766e] text-[#0f766e]"
              : "border-transparent text-[#5b6861] hover:text-[#17201b]"
          }`}
        >
          🪙 Tích lũy định kỳ DCA
        </button>
      </div>

      {activeTab === "checklist" ? (
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          {/* Main Checklist Questions */}
          <div className="flex flex-col gap-5">
            <section className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-[#17201b] mb-4 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[#0f766e]" />
                Bước 1: Chọn mã cổ phiếu dự kiến giao dịch
              </h2>
              <div className="grid gap-4 sm:grid-cols-3">
                <label className="grid gap-1.5 text-xs font-bold uppercase text-[#5b6861]">
                  Mã cổ phiếu
                  <select
                    value={selectedTicker}
                    onChange={(e) => setSelectedTicker(e.target.value)}
                    className="h-10 mt-1 rounded-md border border-[#d9ddd3] bg-white px-3 font-semibold text-sm"
                  >
                    {state?.stocks?.map((stock) => (
                      <option key={stock.ticker} value={stock.ticker}>
                        {stock.ticker} ({stock.companyName})
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-1.5 text-xs font-bold uppercase text-[#5b6861]">
                  Giá hiện tại
                  <div className="h-10 mt-1 flex items-center px-3 border border-[#d9ddd3] bg-[#f8fbf7] rounded-md font-mono font-semibold text-sm">
                    {selectedStock ? formatPoints(selectedStock.currentPrice) : "0"}
                  </div>
                </label>
                <label className="grid gap-1.5 text-xs font-bold uppercase text-[#5b6861]">
                  Số lượng mua ảo
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="h-10 mt-1 rounded-md border border-[#d9ddd3] px-3 font-semibold text-sm"
                  />
                </label>
              </div>

              {/* Transaction value warning */}
              <div className="mt-4 flex items-center justify-between p-3 rounded-md bg-[#edf5ee] border border-[#d2dfd5] text-sm">
                <span className="text-[#43534a]">Giá trị giao dịch ảo:</span>
                <span className="font-mono font-bold text-[#166534]">{formatPoints(tradeValue)}</span>
              </div>
              {tradeWeightPercent > 20 && (
                <div className="mt-2.5 flex items-start gap-2 text-xs text-[#9a3412] bg-[#fff0e8] border border-[#f1bea8] p-2.5 rounded-md">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>
                    Giao dịch này chiếm <b>{tradeWeightPercent.toFixed(1)}%</b> tổng tài sản ảo của bạn. 
                    Quy tắc kỷ luật khuyên bạn <b>không dồn quá 20%</b> vốn vào một mã để hạn chế rủi ro tập trung.
                  </span>
                </div>
              )}
            </section>

            <section className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-[#17201b] mb-4 flex items-center gap-2">
                <FileCheck2 className="h-5 w-5 text-[#0f766e]" />
                Bước 2: Trả lời 7 câu hỏi kỷ luật trước khi giao dịch
              </h2>

              <div className="grid gap-5">
                {CHECKLIST_QUESTIONS.map((q, qIdx) => {
                  const selectedOptIdx = answers[q.id];
                  return (
                    <div key={q.id} className="border-t border-[#e0e5dc] pt-4 first:border-0 first:pt-0">
                      <p className="text-sm font-bold text-[#17201b] mb-2.5">
                        {qIdx + 1}. {q.text}
                      </p>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {q.options.map((opt, optIdx) => (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: optIdx }))}
                            className={`p-3 rounded-md border text-left text-sm transition-all flex items-start gap-2 ${
                              selectedOptIdx === optIdx
                                ? opt.isCorrect
                                  ? "border-[#b9d9c5] bg-[#edf6ed] text-[#166534]"
                                  : "border-[#f1bea8] bg-[#fff0e8] text-[#9a3412]"
                                : "border-[#d9ddd3] bg-white hover:bg-[#f8fbf7] text-[#4a5a52]"
                            }`}
                          >
                            <span className={`w-4 h-4 rounded-full border mt-0.5 shrink-0 flex items-center justify-center ${
                              selectedOptIdx === optIdx ? "bg-current" : ""
                            }`} />
                            <span>{opt.label}</span>
                          </button>
                        ))}
                      </div>
                      {selectedOptIdx !== undefined && (
                        <p className={`mt-2 text-xs p-2.5 rounded-md ${
                          q.options[selectedOptIdx].isCorrect
                            ? "bg-[#edf6ed] text-[#166534]"
                            : "bg-[#fff0e8] text-[#9a3412]"
                        }`}>
                          {q.options[selectedOptIdx].feedback}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-[#17201b] mb-4">Bước 3: Viết luận điểm ngắn gọn của riêng bạn</h2>
              <div className="grid gap-4">
                <label className="grid gap-2 text-sm font-semibold text-[#314039]">
                  Luận điểm cốt lõi (Vì sao bạn muốn mua mã này?)
                  <textarea
                    value={customThesis}
                    onChange={(e) => setCustomThesis(e.target.value)}
                    rows={2}
                    className="rounded-md border border-[#d9ddd3] px-3 py-2 text-sm"
                    placeholder="Ví dụ: Công ty FPT mới ký được hợp đồng AI lớn tại Nhật Bản, doanh số dự kiến tăng 20% trong năm nay."
                  />
                </label>

                <label className="grid gap-2 text-sm font-semibold text-[#314039]">
                  Dữ kiện khiến luận điểm của bạn sai (Khi nào bạn sẽ cắt lỗ/bán?)
                  <textarea
                    value={customRisk}
                    onChange={(e) => setCustomRisk(e.target.value)}
                    rows={2}
                    className="rounded-md border border-[#d9ddd3] px-3 py-2 text-sm"
                    placeholder="Ví dụ: Biên lợi nhuận mảng công nghệ giảm xuống dưới 12% hoặc tốc độ tăng trưởng doanh thu quý tới thấp hơn 10%."
                  />
                </label>
              </div>
            </section>
          </div>

          {/* Right Checklist Diagnostics & Thesis Output */}
          <div className="flex flex-col gap-5 xl:sticky xl:top-6 self-start">
            <section className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
              <h2 className="text-xl font-bold text-[#17201b] mb-3">Kết quả chẩn đoán kỷ luật</h2>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm font-semibold text-[#4a5a52] mb-1">
                  <span>Mức độ hoàn thành:</span>
                  <span>{Object.keys(answers).length}/7 câu hỏi</span>
                </div>
                <div className="h-2 bg-[#edf0eb] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#0f766e] transition-all duration-300"
                    style={{ width: `${(Object.keys(answers).length / 7) * 100}%` }}
                  />
                </div>
              </div>

              {/* Score Display */}
              {allQuestionsAnswered ? (
                <div className="mt-6 text-center border-t border-[#edf0eb] pt-5">
                  <p className="text-sm font-bold text-[#4a5a52] uppercase">Điểm kỷ luật của bạn</p>
                  <p className="text-5xl font-black text-[#0f766e] mt-2">{disciplineScore}/7</p>
                  
                  <div className="mt-4">
                    {disciplineScore === 7 ? (
                      <div className="p-3.5 bg-[#edf6ed] border border-[#b9d9c5] text-[#166534] rounded-md text-sm">
                        <p className="font-bold flex items-center justify-center gap-1.5">
                          <Sparkles className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                          Nhà đầu tư lý trí (Balanced Investor)
                        </p>
                        <p className="mt-1 text-xs leading-5">
                          Tuyệt vời! Bạn có quy trình lý trí, tôn trọng rủi ro và quản lý dòng tiền an toàn. Hãy mở mô phỏng để thực hiện lệnh mua ảo.
                        </p>
                      </div>
                    ) : disciplineScore >= 5 ? (
                      <div className="p-3.5 bg-[#fff7d6] border border-[#e8d59b] text-[#7a4d00] rounded-md text-sm">
                        <p className="font-bold">Nhà đầu tư kỷ luật khá (Rule Follower)</p>
                        <p className="mt-1 text-xs leading-5">
                          Bạn có nhận thức tốt, nhưng vẫn còn một vài kẽ hở cảm xúc. Hãy khắc phục những câu trả lời màu đỏ trước khi quyết định.
                        </p>
                      </div>
                    ) : (
                      <div className="p-3.5 bg-[#fff0e8] border border-[#f1bea8] text-[#9a3412] rounded-md text-sm">
                        <p className="font-bold">Cảnh báo: FOMO / Liều lĩnh (FOMO Hunter)</p>
                        <p className="mt-1 text-xs leading-5">
                          Báo động đỏ! Bạn đang đi lệnh bằng cảm xúc hưng phấn hoặc bỏ qua quản trị rủi ro cơ bản. Hãy dừng lại đọc bài học trước khi mất tiền ảo lẫn tiền thật.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mt-5 p-4 bg-[#f8fbf7] border border-[#edf0eb] text-sm text-[#5b6861] text-center rounded-md">
                  Vui lòng trả lời đầy đủ 7 câu hỏi ở cột bên trái để nhận chẩn đoán và sinh luận điểm giao dịch tự động.
                </div>
              )}
            </section>

            {allQuestionsAnswered && (
              <section className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-[#17201b]">Luận điểm đã tạo</h3>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-xs font-bold text-[#0f766e] hover:text-[#115e59]"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5" /> Đã sao chép
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" /> Sao chép
                      </>
                    )}
                  </button>
                </div>
                <div className="p-3 bg-[#f8fbf7] border border-[#d9ddd3] rounded-md font-mono text-xs text-[#314039] whitespace-pre-wrap leading-5 max-h-60 overflow-y-auto">
                  {generatedThesis}
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  <Link
                    href={`/app/simulator?side=buy&ticker=${selectedTicker}&quantity=${quantity}&thesis=${encodeURIComponent(generatedThesis)}&riskNote=${encodeURIComponent(generatedRiskNote)}`}
                    className="min-h-11 rounded-md bg-[#0f766e] text-white flex items-center justify-center gap-2 text-sm font-bold hover:bg-[#115e59]"
                  >
                    <Zap className="h-4 w-4 fill-current text-yellow-400" />
                    Đặt lệnh mô phỏng ngay
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                  <p className="text-[11px] text-[#66736c] text-center">
                    Bấm nút trên sẽ chuyển hướng bạn sang bảng mô phỏng với các thông số checklist đã được điền sẵn vào luận điểm của lệnh.
                  </p>
                </div>
              </section>
            )}

            <section className="rounded-md border border-[#e0e5dc] bg-[#fdfbf7] p-5">
              <h3 className="font-bold text-[#17201b] flex items-center gap-1">
                <BookOpen className="h-4 w-4 text-[#0f766e]" />
                Bài học đề xuất dựa trên checklist:
              </h3>
              <ul className="mt-3 grid gap-2 text-sm">
                <li>
                  <Link
                    href="/knowledge/tai-chinh-ca-nhan/buc-tranh-dong-tien-ca-nhan"
                    className="text-[#0f766e] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                    Bức tranh dòng tiền cá nhân (Chặng 1)
                  </Link>
                </li>
                <li>
                  <Link
                    href="/knowledge/tam-ly-dau-tu/fomo-va-tin-nong"
                    className="text-[#0f766e] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                    Tâm lý đầu tư & Hội chứng sợ bỏ lỡ (Chặng 4)
                  </Link>
                </li>
                <li>
                  <Link
                    href="/knowledge/quan-tri-rui-ro/cac-loai-rui-ro"
                    className="text-[#0f766e] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                    Quản trị rủi ro tập trung & Quy mô lệnh (Chặng 4)
                  </Link>
                </li>
              </ul>
            </section>
          </div>
        </div>
      ) : activeTab === "calculator" ? (
        /* Calculator Tab */
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          {/* Calculator inputs */}
          <section className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-[#17201b] mb-4 flex items-center gap-2">
              <Calculator className="h-5 w-5 text-[#0f766e]" />
              Thiết lập khoản chi tiêu lạm phát (FOMO)
            </h2>

            {/* Presets Grid */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-[#4a5a52] mb-3">Chọn nhanh một loại chi tiêu FOMO phổ biến:</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {FOMO_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(idx)}
                    className={`p-3 rounded-md border text-left transition-all ${
                      selectedPresetIndex === idx
                        ? "border-[#0f766e] bg-[#edf4ef] text-[#17201b]"
                        : "border-[#d9ddd3] bg-white hover:bg-[#f8fbf7] text-[#4a5a52]"
                    }`}
                  >
                    <p className="text-xs font-bold uppercase text-[#0f766e] mb-1">
                      {preset.period === "daily"
                        ? "Hàng ngày"
                        : preset.period === "weekly"
                          ? "Hàng tuần"
                          : preset.period === "monthly"
                            ? "Hàng tháng"
                            : "Chi phí một lần"}
                    </p>
                    <p className="text-sm font-bold leading-5">{preset.label.split(" (")[0]}</p>
                    <p className="text-xs text-[#5b6861] mt-1">{preset.description}</p>
                    <p className="text-xs font-mono font-semibold mt-2 text-[#0f766e]">
                      {preset.amount.toLocaleString("vi-VN")} đ
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Inputs */}
            <div className="border-t border-[#edf0eb] pt-5 grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5 text-sm font-semibold text-[#314039]">
                Số tiền chi tiêu cảm xúc (VND)
                <input
                  type="number"
                  min={1000}
                  step={5000}
                  value={calcAmount}
                  onChange={(e) => {
                    setCalcAmount(Number(e.target.value));
                    setSelectedPresetIndex(-1); // reset preset highlight
                  }}
                  className="h-11 mt-1 rounded-md border border-[#d9ddd3] px-3 font-semibold text-sm"
                />
              </label>

              <label className="grid gap-1.5 text-sm font-semibold text-[#314039]">
                Chu kỳ tiêu xài
                <select
                  value={calcPeriod}
                  onChange={(e) => {
                    setCalcPeriod(e.target.value);
                    setSelectedPresetIndex(-1);
                  }}
                  className="h-11 mt-1 rounded-md border border-[#d9ddd3] bg-white px-3 text-sm font-semibold"
                >
                  <option value="daily">Hàng ngày</option>
                  <option value="weekly">Hàng tuần</option>
                  <option value="monthly">Hàng tháng</option>
                  <option value="once">Chi phí một lần</option>
                </select>
              </label>

              <label className="grid gap-1.5 text-sm font-semibold text-[#314039] sm:col-span-2">
                <div className="flex justify-between">
                  <span>Lãi suất đầu tư kỳ vọng hàng năm</span>
                  <span className="font-mono text-[#0f766e]">{interestRate}%/năm</span>
                </div>
                <input
                  type="range"
                  min={4}
                  max={15}
                  step={0.5}
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full mt-2 accent-[#0f766e]"
                />
                <span className="text-xs text-[#5b6861] font-normal leading-5">
                  (9% là hiệu suất trung bình lịch sử dài hạn của VN-Index và các quỹ mở cổ phiếu uy tín tại Việt Nam)
                </span>
              </label>

              <label className="grid gap-1.5 text-sm font-semibold text-[#314039] sm:col-span-2">
                Thời gian tích lũy cơ hội (Năm)
                <div className="grid grid-cols-5 gap-2 mt-1">
                  {[1, 3, 5, 10, 20].map((num) => (
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
                      {num} năm
                    </button>
                  ))}
                </div>
              </label>
            </div>
          </section>

          {/* Calculator Results */}
          <div className="flex flex-col gap-5">
            <section className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
              <h2 className="text-xl font-bold text-[#17201b] mb-4">Chi phí cơ hội bị bỏ phí</h2>
              
              <div className="grid gap-4">
                <div className="p-4 bg-[#f8fbf7] border border-[#edf0eb] rounded-md">
                  <p className="text-xs font-bold text-[#66736c] uppercase">Tổng tiền tiêu xài tích lũy (Tiền gốc)</p>
                  <p className="text-2xl font-black text-[#314039] mt-1">
                    {formatCurrency(calculatorResults.totalPrincipal)}
                  </p>
                </div>

                <div className="p-4 bg-[#e8f6ed] border border-[#b9d9c5] rounded-md">
                  <p className="text-xs font-bold text-[#166534] uppercase">Giá trị tương lai sau {years} năm (Có Lãi kép)</p>
                  <p className="text-3xl font-black text-[#166534] mt-1 font-mono">
                    {formatCurrency(calculatorResults.futureValue)}
                  </p>
                  <p className="text-xs text-[#15803d] font-semibold mt-1">
                    Trong đó có {formatCurrency(calculatorResults.interestEarned)} tiền lãi sinh thêm.
                  </p>
                </div>
              </div>

              {/* Joking Finance style Comparison */}
              <div className="mt-5 border-t border-[#edf0eb] pt-5">
                <h3 className="text-sm font-bold text-[#17201b] mb-3 flex items-center gap-1.5">
                  <Sparkles className="h-4.5 w-4.5 text-yellow-500 fill-yellow-500" />
                  Bạn có biết? Số tiền này tương đương với:
                </h3>
                
                <div className="grid gap-3 text-sm leading-6 text-[#4a5a52]">
                  <div className="flex items-start gap-2.5">
                    <TrendingUp className="h-4 w-4 text-[#0f766e] mt-1 shrink-0" />
                    <span>
                      <b>{Math.round(calculatorResults.futureValue).toLocaleString("vi-VN")} điểm ảo</b> trong game JokingFinance. 
                      Đủ để bạn mua được khoảng <b>{calculatorResults.fptCount.toLocaleString("vi-VN")} cổ phiếu FPT ảo</b> ở mức giá hiện tại.
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Info className="h-4 w-4 text-[#0f766e] mt-1 shrink-0" />
                    <span>
                      Gần <b>{calculatorResults.monthsOfSurvival} tháng sinh hoạt phí cơ bản</b> ở đời thực (ước tính tối giản 8.000.000đ/tháng). 
                      Đây chính là <b>quỹ tự do</b> giúp bạn thoải mái nghỉ việc, từ chối một sếp toxic hoặc đi du lịch mà không chịu áp lực tài chính ngắn hạn.
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-md border border-[#e2d3a7] bg-[#fff8df] p-5 text-sm">
              <h3 className="font-bold text-[#5b420b] flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4 text-[#7a4d00]" />
                Bài học về Lạm Phát Cảm Xúc
              </h3>
              <p className="mt-2 text-[#7a4d00] leading-6">
                Khi lùi việc tiêu xài cảm xúc lại 15 phút hoặc hoãn lại 1 tuần, bạn có cơ hội tích lũy nguồn vốn lớn hơn nhiều. 
                Hãy rèn luyện thói quen tự vấn trước khi nướng tiền vào các trào lưu ngắn hạn.
              </p>
              <div className="mt-4">
                <Link
                  href="/knowledge/tai-chinh-ca-nhan/lai-kep-va-chi-phi-co-hoi"
                  className="inline-flex items-center gap-1 font-bold text-[#0f766e] hover:underline"
                >
                  Đọc bài học Lãi kép & Chi phí cơ hội
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </section>
          </div>
        </div>
      ) : activeTab === "allocation" ? (
        /* Allocation Tab */
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          {/* Inputs Panel */}
          <div className="flex flex-col gap-5">
            <section className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
              <h2 className="text-xl font-bold text-[#17201b] mb-4 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[#0f766e]" />
                1. Chi phí sống & Độ ổn định thu nhập
              </h2>

              <div className="grid gap-5">
                <label className="grid gap-1.5 text-sm font-semibold text-[#314039]">
                  <div className="flex justify-between">
                    <span>Chi phí sinh hoạt thiết yếu hàng tháng</span>
                    <span className="font-mono text-[#0f766e] font-bold">
                      {monthlyExpense.toLocaleString("vi-VN")} đ/tháng
                    </span>
                  </div>
                  <input
                    type="range"
                    min={3000000}
                    max={50000000}
                    step={500000}
                    value={monthlyExpense}
                    onChange={(e) => setMonthlyExpense(Number(e.target.value))}
                    className="w-full mt-2 accent-[#0f766e]"
                  />
                  <span className="text-xs text-[#5b6861] font-normal">
                    (Gồm tiền nhà, ăn uống cơ bản, điện nước, đi lại, bảo hiểm, học phí, khoản trả nợ bắt buộc...)
                  </span>
                </label>

                <label className="grid gap-1.5 text-sm font-semibold text-[#314039] border-t border-[#edf0eb] pt-4">
                  Đặc điểm và mức độ ổn định của thu nhập
                  <select
                    value={incomeStability}
                    onChange={(e) => setIncomeStability(e.target.value as "steady" | "variable" | "high-risk")}
                    className="h-11 mt-1 rounded-md border border-[#d9ddd3] bg-white px-3 text-sm font-semibold"
                  >
                    <option value="steady">Lương cố định / Ngành ổn định (Đề xuất quỹ 6 tháng)</option>
                    <option value="variable">Lương doanh số / Freelancer tự do (Đề xuất quỹ 9 tháng)</option>
                    <option value="high-risk">Chủ doanh nghiệp / Thu nhập biến động mạnh (Đề xuất quỹ 12 tháng)</option>
                  </select>
                  <span className="text-xs text-[#5b6861] font-normal mt-1">
                    Thu nhập càng không ổn định hoặc nhiều người phụ thuộc thì bạn càng cần một quỹ dự phòng lớn hơn.
                  </span>
                </label>
              </div>
            </section>

            <section className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
              <h2 className="text-xl font-bold text-[#17201b] mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[#0f766e]" />
                2. Khả năng tích lũy hiện có
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1.5 text-sm font-semibold text-[#314039]">
                  Quỹ dự phòng hiện tại (đời thực)
                  <input
                    type="number"
                    min={0}
                    step={1000000}
                    value={currentSavings}
                    onChange={(e) => setCurrentSavings(Math.max(0, Number(e.target.value)))}
                    className="h-11 mt-1 rounded-md border border-[#d9ddd3] px-3 font-semibold text-sm"
                  />
                  <span className="text-xs text-[#5b6861] font-normal">
                    (Tiền mặt hoặc tiền gửi ngân hàng thanh khoản cao rút được ngay)
                  </span>
                </label>

                <label className="grid gap-1.5 text-sm font-semibold text-[#314039]">
                  Tiền nhàn rỗi tích lũy thêm hàng tháng
                  <input
                    type="number"
                    min={0}
                    step={500000}
                    value={monthlySurplus}
                    onChange={(e) => setMonthlySurplus(Math.max(0, Number(e.target.value)))}
                    className="h-11 mt-1 rounded-md border border-[#d9ddd3] px-3 font-semibold text-sm"
                  />
                  <span className="text-xs text-[#5b6861] font-normal">
                    (Phần thu nhập dư ra mỗi tháng sau khi trừ toàn bộ chi phí)
                  </span>
                </label>
              </div>
            </section>
          </div>

          {/* Results Panel */}
          <div className="flex flex-col gap-5">
            {/* Financial Shield Card */}
            <section className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-[#17201b] mb-3">Lá chắn tài chính của bạn</h2>

              <div className="mt-4">
                <div className="flex justify-between text-sm font-semibold text-[#4a5a52] mb-1">
                  <span>Mức độ an toàn của quỹ dự phòng:</span>
                  <span>{allocationResults.progressPercent}%</span>
                </div>
                <div className="h-2.5 bg-[#edf0eb] rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      allocationResults.isFunded
                        ? "bg-[#166534]"
                        : allocationResults.progressPercent >= 70
                          ? "bg-[#d97706]"
                          : "bg-[#b91c1c]"
                    }`}
                    style={{ width: `${allocationResults.progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 grid gap-3 text-sm">
                <div className="flex justify-between border-b border-[#edf0eb] pb-2">
                  <span className="text-[#5b6861]">Đề xuất an toàn ({allocationResults.recommendedMonths} tháng):</span>
                  <span className="font-mono font-bold text-[#17201b]">
                    {allocationResults.recommendedEmergencyFund.toLocaleString("vi-VN")} đ
                  </span>
                </div>
                <div className="flex justify-between border-b border-[#edf0eb] pb-2">
                  <span className="text-[#5b6861]">Hiện có ngoài đời thực:</span>
                  <span className="font-mono font-bold text-[#17201b]">
                    {currentSavings.toLocaleString("vi-VN")} đ
                  </span>
                </div>
                {!allocationResults.isFunded && (
                  <div className="flex justify-between border-b border-[#edf0eb] pb-2 text-[#b91c1c]">
                    <span className="font-semibold">Còn thiếu để an toàn:</span>
                    <span className="font-mono font-bold">
                      {allocationResults.gapAmount.toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-5">
                {allocationResults.isFunded ? (
                  <div className="p-4 bg-[#edf6ed] border border-[#b9d9c5] text-[#166534] rounded-md text-sm">
                    <p className="font-bold flex items-center gap-1.5 text-base">
                      <Sparkles className="h-5 w-5 text-yellow-500 fill-yellow-500 shrink-0" />
                      Lá chắn tài chính vững chãi! 🛡️
                    </p>
                    <p className="mt-1.5 text-xs leading-5">
                      Chúc mừng! Bạn đã tích lũy đủ quỹ dự phòng khẩn cấp theo khuyến nghị. Bạn có vị thế vững chắc để bắt đầu đầu tư tiền thật vào các tài sản có biến động mà không lo sợ phải bán tháo khi gặp biến cố đời thực.
                    </p>
                  </div>
                ) : allocationResults.progressPercent >= 70 ? (
                  <div className="p-4 bg-[#fffbeb] border border-[#fef3c7] text-[#b45309] rounded-md text-sm">
                    <p className="font-bold flex items-center gap-1.5 text-base">
                      <Info className="h-5 w-5 text-[#b45309] shrink-0" />
                      Cần gia cố thêm lá chắn 🚧
                    </p>
                    <p className="mt-1.5 text-xs leading-5">
                      Quỹ dự phòng của bạn đã đạt {allocationResults.progressPercent}%. Bạn đang đi đúng hướng nhưng chưa hoàn toàn an toàn. Hãy dành phần lớn tích lũy hàng tháng để lấp đầy phần còn thiếu trước khi giải ngân lớn vào tiền thật.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-[#fef2f2] border border-[#fee2e2] text-[#991b1b] rounded-md text-sm">
                    <p className="font-bold flex items-center gap-1.5 text-base">
                      <AlertCircle className="h-5 w-5 text-[#b91c1c] shrink-0" />
                      Cảnh báo: Vùng tài chính nguy hiểm! ⚠️
                    </p>
                    <p className="mt-1.5 text-xs leading-5">
                      Quỹ dự phòng của bạn còn quá mỏng. JokingFinance khuyên bạn <b>CHƯA NÊN đầu tư tiền thật</b> vào cổ phiếu lúc này. Nếu thị trường giảm mạnh hoặc bạn mất thu nhập đột ngột, bạn sẽ lâm vào thế kẹt. Hãy luyện tập bằng điểm ảo và ưu tiên tích lũy tiền mặt trước!
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Money Allocation Card */}
            <section className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-[#17201b] mb-4">
                Kế hoạch phân bổ {monthlySurplus.toLocaleString("vi-VN")} đ nhàn rỗi hàng tháng
              </h2>

              <div className="grid gap-3">
                {/* Alloc Item 1: Emergency Fund */}
                {allocationResults.emergencyFundAlloc > 0 && (
                  <div className="p-3 bg-[#f8fbf7] border border-[#d9ddd3] rounded-md flex justify-between items-start gap-4 text-sm">
                    <div>
                      <p className="font-bold text-[#17201b]">Bồi đắp Quỹ dự phòng</p>
                      <p className="text-xs text-[#5b6861] mt-0.5 leading-4">
                        Gửi tiết kiệm không kỳ hạn hoặc kỳ hạn ngắn (1 tháng) để lấp đầy lá chắn.
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-mono font-bold text-[#0f766e]">{allocationResults.emergencyFundValue.toLocaleString("vi-VN")} đ</p>
                      <p className="text-[11px] font-bold text-[#0f766e] bg-[#edf4ef] px-1.5 py-0.5 rounded-full inline-block mt-1">
                        {allocationResults.emergencyFundAlloc}%
                      </p>
                    </div>
                  </div>
                )}

                {/* Alloc Item 2: Safe Fixed Income */}
                {allocationResults.safeAssetAlloc > 0 && (
                  <div className="p-3 bg-[#f8fbf7] border border-[#d9ddd3] rounded-md flex justify-between items-start gap-4 text-sm">
                    <div>
                      <p className="font-bold text-[#17201b]">Tích lũy an toàn (Fixed Income)</p>
                      <p className="text-xs text-[#5b6861] mt-0.5 leading-4">
                        Tiết kiệm kỳ hạn 6-12 tháng hoặc mua chứng chỉ tiền gửi để hưởng lãi suất cố định.
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-mono font-bold text-[#314039]">{allocationResults.safeAssetValue.toLocaleString("vi-VN")} đ</p>
                      <p className="text-[11px] font-bold text-[#4a5a52] bg-[#edf0eb] px-1.5 py-0.5 rounded-full inline-block mt-1">
                        {allocationResults.safeAssetAlloc}%
                      </p>
                    </div>
                  </div>
                )}

                {/* Alloc Item 3: Equity */}
                <div className={`p-3 border rounded-md flex justify-between items-start gap-4 text-sm ${
                  allocationResults.equityAlloc === 0 
                    ? "bg-[#fafafa] border-[#e5e5e5] opacity-50" 
                    : "bg-[#f8fbf7] border-[#d9ddd3]"
                }`}>
                  <div>
                    <p className="font-bold text-[#17201b]">Đầu tư Cổ phiếu thật (Dài hạn)</p>
                    <p className="text-xs text-[#5b6861] mt-0.5 leading-4">
                      {allocationResults.equityAlloc === 0 
                        ? "Chưa khuyến nghị giải ngân tiền thật khi chưa có lá chắn vững."
                        : "Giải ngân định kỳ vào cổ phiếu cơ bản, đầu ngành có lợi nhuận bền vững."}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-mono font-bold text-[#314039]">{allocationResults.equityValue.toLocaleString("vi-VN")} đ</p>
                    <p className="text-[11px] font-bold text-[#4a5a52] bg-[#edf0eb] px-1.5 py-0.5 rounded-full inline-block mt-1">
                      {allocationResults.equityAlloc}%
                    </p>
                  </div>
                </div>

                {/* Alloc Item 4: Learning / Practice */}
                <div className="p-3 bg-[#edf5ee] border border-[#d2dfd5] rounded-md flex justify-between items-start gap-4 text-sm">
                  <div>
                    <p className="font-bold text-[#166534]">Thực hành & Trải nghiệm ảo</p>
                    <p className="text-xs text-[#5b6861] mt-0.5 leading-4">
                      Dùng điểm ảo trong JokingFinance để thử nghiệm lệnh, mua sách tài chính hoặc học khóa học.
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-mono font-bold text-[#166534]">{allocationResults.practiceValue.toLocaleString("vi-VN")} đ</p>
                    <p className="text-[11px] font-bold text-[#166534] bg-[#dcfce7] px-1.5 py-0.5 rounded-full inline-block mt-1">
                      {allocationResults.practiceAlloc}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-[#fdfbf7] rounded-md text-xs leading-5 text-[#5b5b5b] border border-[#f5f1e5]">
                {allocationResults.isFunded ? (
                  <p>
                    📌 <b>Mẹo quản trị:</b> Với quỹ dự phòng đã đầy đủ, 80% thu nhập nhàn rỗi được chia đều cho tích lũy lãi suất cố định và chứng khoán dài hạn. 20% còn lại giữ cho các lệnh thử nghiệm, mua sách hoặc nâng cao kiến thức.
                  </p>
                ) : (
                  <p>
                    📌 <b>Mẹo quản trị:</b> Do quỹ dự phòng chưa đầy, 70% tiền nhàn rỗi bắt buộc phải dồn để bồi đắp quỹ này. Tuyệt đối chưa giải ngân tiền thật vào cổ phiếu. Hãy dùng 20% tích lũy để thực hành ảo tại JokingFinance nhằm rèn luyện cảm xúc trước.
                  </p>
                )}
              </div>
            </section>

            {/* Related content */}
            <section className="rounded-md border border-[#e0e5dc] bg-[#fdfbf7] p-5">
              <h3 className="font-bold text-[#17201b] flex items-center gap-1">
                <BookOpen className="h-4 w-4 text-[#0f766e]" />
                Bài học được đề xuất:
              </h3>
              <ul className="mt-3 grid gap-2 text-sm">
                <li>
                  <Link
                    href="/articles/quy-du-phong-bao-nhieu-la-du-truoc-khi-dau-tu"
                    className="text-[#0f766e] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                    Quỹ dự phòng bao nhiêu là đủ trước khi đầu tư?
                  </Link>
                </li>
                <li>
                  <Link
                    href="/articles/buc-tranh-dong-tien-ca-nhan"
                    className="text-[#0f766e] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                    Bức tranh dòng tiền cá nhân (Chặng 1)
                  </Link>
                </li>
              </ul>
            </section>
          </div>
        </div>
      ) : activeTab === "valuation" ? (
        <ValuationTool stocks={state?.stocks || []} />
      ) : activeTab === "bias" ? (
        <BiasTool />
      ) : activeTab === "fire" ? (
        <FireTool />
      ) : (
        <DcaTool />
      )}

      <Disclaimer />
    </div>
  );
}
