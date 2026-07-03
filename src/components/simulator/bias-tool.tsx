"use client";

import { useState, useMemo } from "react";
import {
  BrainCircuit,
  HelpCircle,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Award
} from "lucide-react";
import Link from "next/link";

type BiasQuestion = {
  id: number;
  question: string;
  options: {
    label: string;
    biasType: "rational" | "loss_aversion" | "disposition_effect" | "confirmation_bias" | "fomo" | "revenge_trading";
    feedback: string;
  }[];
};

const BIAS_QUESTIONS: BiasQuestion[] = [
  {
    id: 1,
    question: "Cổ phiếu ảo bạn mua đang giảm 25%. Báo cáo tài chính cho thấy tình hình kinh doanh của công ty đã suy giảm nghiêm trọng. Bạn sẽ hành động thế nào?",
    options: [
      {
        label: "Tiếp tục giữ và không bán vì tin rằng 'chưa bán là chưa lỗ', hy vọng giá sẽ hồi về giá mua cũ để bán hòa vốn.",
        biasType: "loss_aversion",
        feedback: "⚠️ Bạn đang mắc tâm lý Sợ mất mát (Loss Aversion). Việc neo giữ một cổ phiếu đã suy thoái kinh doanh chỉ để chờ hòa vốn thường dẫn đến các khoản lỗ lớn hơn ngoài đời thực."
      },
      {
        label: "Rà soát lại luận điểm ban đầu. Do nội tại doanh nghiệp đã xấu đi thật sự, bạn chấp nhận cắt lỗ ngay lập tức để bảo vệ vốn.",
        biasType: "rational",
        feedback: "✅ Quyết định rất lý trí! Nhận diện sai lầm và cắt lỗ nhanh khi doanh nghiệp thay đổi nội tại là nguyên tắc sống còn của nhà đầu tư chuyên nghiệp."
      },
      {
        label: "Mua gấp đôi số lượng hiện tại (trung bình giá xuống) để giảm giá vốn trung bình, giúp tài khoản nhanh về bờ hơn.",
        biasType: "revenge_trading",
        feedback: "⚠️ Bạn có xu hướng Giao dịch gỡ gạc / Revenge Trading. Việc trung bình giá xuống một cổ phiếu đang suy thoái mà không có căn cứ cơ bản cực kỳ nguy hiểm, giống như cố bắt dao rơi."
      }
    ]
  },
  {
    id: 2,
    question: "Cổ phiếu bạn mua tăng 15% chỉ sau 3 ngày nhờ tin đồn thị trường. Luận điểm dài hạn của bạn chưa thay đổi và định giá hợp lý của cổ phiếu còn cách 30%. Bạn sẽ làm gì?",
    options: [
      {
        label: "Chốt lời ngay lập tức vì sợ giá giảm lại mất khoản lời ngắn hạn, cảm thấy 'bỏ túi tiền mặt cho chắc ăn'.",
        biasType: "disposition_effect",
        feedback: "⚠️ Đây là Hiệu ứng bán non (Disposition Effect). Chúng ta thường có xu hướng chốt lời non các lệnh thắng nhưng lại ôm chặt các lệnh lỗ, khiến tỷ lệ Lợi nhuận/Rủi ro dài hạn bị bóp méo."
      },
      {
        label: "Bám sát kế hoạch ban đầu, tiếp tục nắm giữ cổ phiếu vì luận điểm kinh doanh còn nguyên và định giá vẫn hấp dẫn.",
        biasType: "rational",
        feedback: "✅ Kỷ luật tuyệt vời! Giữ cái đầu lạnh để gồng lãi khi luận điểm đầu tư chưa đổi là cách duy nhất để có những thương vụ thắng lớn."
      },
      {
        label: "Khoe ngay ảnh chụp tài khoản lên các hội nhóm và dùng margin mua thêm thật nhiều vì nghĩ mình đã nắm được quy luật thị trường.",
        biasType: "fomo",
        feedback: "⚠️ Bạn đang bị Định kiến tự tin thái quá (Overconfidence Bias). Sự tăng giá ngắn hạn của thị trường dễ khiến bạn nhầm lẫn giữa may mắn và năng lực, dẫn đến việc đi lệnh quá tay."
      }
    ]
  },
  {
    id: 3,
    question: "Bạn vừa mua cổ phiếu MWG ảo. Bạn sẽ tìm kiếm và đọc các thông tin nào liên quan đến cổ phiếu này?",
    options: [
      {
        label: "Chủ động tìm kiếm các bài viết phân tích rủi ro, dự đoán xấu về MWG để kiểm chứng xem luận điểm mua của mình có lỗ hổng nào không.",
        biasType: "rational",
        feedback: "✅ Tư duy phản biện tuyệt vời! Việc chủ động tìm kiếm thông tin trái chiều giúp bạn tránh được bẫy tư duy một chiều và chuẩn bị cho các kịch bản xấu."
      },
      {
        label: "Chỉ đọc các bài viết khen ngợi MWG, triển vọng tăng trưởng và các tin tức tích cực trên hội nhóm để tăng cảm giác an tâm.",
        biasType: "confirmation_bias",
        feedback: "⚠️ Bạn đang gặp Định kiến xác nhận (Confirmation Bias). Bộ não của chúng ta có xu hướng lọc bỏ thông tin trái chiều và chỉ tiếp thu thông tin củng cố quyết định có sẵn, khiến ta mù quáng trước rủi ro."
      },
      {
        label: "Tắt bảng điện, không đọc tin tức gì nữa vì đã quyết định mua là không thay đổi, tin tưởng hoàn toàn vào số phận.",
        biasType: "loss_aversion",
        feedback: "⚠️ Đây là Hiệu ứng đà điểu (Ostrich Effect) - trốn tránh thực tế bằng cách lờ đi thông tin rủi ro. Việc không theo dõi nội tại doanh nghiệp khiến bạn thụ động khi có biến cố lớn xảy ra."
      }
    ]
  },
  {
    id: 4,
    question: "Tại sao bạn quyết định chọn mua cổ phiếu FPT ảo thay vì các mã cổ phiếu khác trong danh sách mô phỏng?",
    options: [
      {
        label: "Vì FPT đang tăng mạnh liên tục, báo chí đưa tin rầm rộ về làn sóng AI và các hội nhóm trên Facebook hô hào FPT sẽ tăng gấp đôi.",
        biasType: "fomo",
        feedback: "⚠️ Bạn đang bị chi phối bởi Tâm lý bầy đàn và FOMO (Herd Mentality). Mua đuổi theo truyền thông và hội nhóm là nguyên nhân số một dẫn đến việc đu đỉnh khi dòng tiền thông minh bắt đầu rút ra."
      },
      {
        label: "Vì bạn đã phân tích báo cáo tài chính của FPT, tính toán chỉ số P/E, EPS và định giá thấy mức giá hiện tại vẫn dưới giá trị hợp lý.",
        biasType: "rational",
        feedback: "✅ Chuẩn nhà đầu tư giá trị! Mua vì số liệu phân tích và hiểu rõ mô hình kinh doanh giúp bạn giữ vững tâm lý khi thị trường chung biến động mạnh."
      },
      {
        label: "Vì đây là doanh nghiệp quen thuộc nhất, bạn đang dùng internet của FPT và thấy văn phòng của họ ở gần nhà.",
        biasType: "fomo",
        feedback: "⚠️ Bạn đang bị Định kiến quen thuộc (Familiarity Bias). Một sản phẩm quen thuộc ở đời thực không đồng nghĩa với việc cổ phiếu của họ đang có định giá rẻ và thích hợp để đầu tư."
      }
    ]
  },
  {
    id: 5,
    question: "Bạn vừa bị thua lỗ liên tiếp 4 lệnh giao dịch mô phỏng gần nhất do thị trường điều chỉnh mạnh. Bạn cảm nhận thế nào và sẽ làm gì?",
    options: [
      {
        label: "Cảm thấy tức giận, muốn đặt ngay một lệnh mua ảo với khối lượng lớn gấp đôi và dùng đòn bẩy tối đa để gỡ lại toàn bộ số điểm ảo đã mất nhanh nhất.",
        biasType: "revenge_trading",
        feedback: "⚠️ Đây là lỗi Giao dịch trả thù (Revenge Trading) nguy hiểm. Hành vi này biến việc đầu tư thành đánh bạc, nơi cảm xúc cay cú lấn át hoàn toàn lý trí và dễ dẫn đến cháy tài khoản ảo lẫn thật."
      },
      {
        label: "Tạm ngưng đặt lệnh, ghi lại nhật ký giao dịch và bình tĩnh phân tích nguyên nhân thua lỗ (do chọn sai mã, sai thời điểm hay do thị trường chung).",
        biasType: "rational",
        feedback: "✅ Tinh thần phản tư tuyệt vời! Biết dừng lại để tự vấn và học hỏi từ sai lầm là phẩm chất cốt lõi của một nhà đầu tư kỷ luật dài hạn."
      },
      {
        label: "Cảm thấy chán nản, nghĩ rằng thị trường chứng khoán là cờ bạc bịp và hệ thống mô phỏng đang cố tình thao túng để bạn bị lỗ.",
        biasType: "loss_aversion",
        feedback: "⚠️ Bạn đang mắc Định kiến đổ lỗi hoàn cảnh (Self-Serving Bias). Việc từ chối thừa nhận sai sót cá nhân và đổ lỗi cho các yếu tố bên ngoài cản trở bạn rút ra bài học kinh nghiệm để cải thiện kỹ năng."
      }
    ]
  }
];

export function BiasTool() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleNext = () => {
    if (currentIndex < BIAS_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentIndex(0);
    setShowResult(false);
  };

  const results = useMemo(() => {
    if (!showResult) return null;

    let rationalCount = 0;
    const biasCounts: Record<string, number> = {
      loss_aversion: 0,
      disposition_effect: 0,
      confirmation_bias: 0,
      fomo: 0,
      revenge_trading: 0
    };

    BIAS_QUESTIONS.forEach((q) => {
      const selectedOptIdx = answers[q.id];
      if (selectedOptIdx !== undefined) {
        const option = q.options[selectedOptIdx];
        if (option.biasType === "rational") {
          rationalCount++;
        } else {
          biasCounts[option.biasType] = (biasCounts[option.biasType] || 0) + 1;
        }
      }
    });

    const totalQuestions = BIAS_QUESTIONS.length;
    const disciplineScore = Math.round((rationalCount / totalQuestions) * 100);

    // Find primary bias
    let primaryBias: string = "Không có định kiến nổi trội";
    let maxCount = 0;
    Object.entries(biasCounts).forEach(([bias, count]) => {
      if (count > maxCount) {
        maxCount = count;
        primaryBias = bias;
      }
    });

    return {
      disciplineScore,
      rationalCount,
      biasCounts,
      primaryBias
    };
  }, [answers, showResult]);

  const primaryBiasDetails = useMemo(() => {
    if (!results) return null;

    const details: Record<string, { title: string; desc: string; solution: string; articleLink: string; articleTitle: string }> = {
      loss_aversion: {
        title: "Tâm lý sợ mất mát (Loss Aversion Bias) 📉",
        desc: "Bạn có xu hướng sợ hãi các khoản lỗ quá mức, dẫn đến việc ôm chặt các cổ phiếu đang giảm giá nghiêm trọng vì hy vọng ảo rằng chúng sẽ hồi phục về bờ để bán hòa vốn. Điều này ngăn cản bạn cắt lỗ sớm và bảo vệ nguồn vốn.",
        solution: "Hãy đặt ra quy tắc cắt lỗ tự động (ví dụ: tối đa 7-8% là bắt buộc cắt nửa hoặc cắt hết). Hãy coi chi phí cắt lỗ giống như chi phí bảo hiểm để bảo vệ tài khoản của bạn.",
        articleLink: "/knowledge/quan-tri-rui-ro/cac-loai-rui-ro",
        articleTitle: "Đọc bài viết: Quản trị rủi ro & Kế hoạch cắt lỗ"
      },
      disposition_effect: {
        title: "Hiệu ứng bán non (Disposition Effect) 🏃‍♂️",
        desc: "Bạn có xu hướng chốt lời quá nhanh ở các lệnh thắng nhỏ để tìm kiếm cảm giác an toàn ngắn hạn, nhưng lại giữ quá lâu các thương vụ lỗ nặng. Điều này làm hỏng tỷ suất lợi nhuận kỳ vọng dài hạn của bạn.",
        solution: "Bám sát định giá trị hợp lý. Khi cổ phiếu tăng giá, chỉ bán khi giá trị nội tại thay đổi hoặc đã đạt mục tiêu định giá của bạn, tránh bán chỉ vì cảm giác sợ hãi nhất thời.",
        articleLink: "/knowledge/tam-ly-dau-tu/fomo-va-tin-nong",
        articleTitle: "Đọc bài viết: Tâm lý gồng lời & Kỷ luật mục tiêu"
      },
      confirmation_bias: {
        title: "Định kiến xác nhận (Confirmation Bias) 👁️",
        desc: "Bạn có xu hướng chỉ tìm kiếm các thông tin tích cực, các bài viết khen ngợi cổ phiếu bạn đang nắm giữ để củng cố niềm tin, đồng thời bỏ qua hoặc bác bỏ các phân tích rủi ro hay ý kiến phản biện trái chiều.",
        solution: "Trước khi mua một cổ phiếu, hãy tự đặt câu hỏi: 'Điều gì có thể chứng minh luận điểm của tôi bị sai?'. Hãy tìm đọc các phân tích của phe Bán (Bear case) để có góc nhìn đa chiều nhất.",
        articleLink: "/articles/quy-du-phong-bao-nhieu-la-du-truoc-khi-dau-tu",
        articleTitle: "Đọc bài viết: Tư duy phản biện trong phân tích đầu tư"
      },
      fomo: {
        title: "Hội chứng sợ bỏ lỡ & Tâm lý bầy đàn (FOMO & Herd Mentality) 🐑",
        desc: "Quyết định giao dịch của bạn dễ bị tác động bởi bảng điện xanh đỏ, sự hô hào của đám đông, tin đồn trên mạng xã hội và truyền thông. Bạn mua vì sợ người khác giàu lên mà mình bị bỏ lại phía sau.",
        solution: "Tập viết luận điểm giao dịch trước khi bấm nút mua ảo. Nếu không thể giải thích mô hình kinh doanh của công ty trong 3 câu đơn giản cho một đứa trẻ, tuyệt đối không mua mã đó.",
        articleLink: "/knowledge/tam-ly-dau-tu/fomo-va-tin-nong",
        articleTitle: "Đọc bài viết: Chế ngự FOMO trước bảng điện"
      },
      revenge_trading: {
        title: "Giao dịch trả thù & Tâm lý gỡ gạc (Revenge Trading) 🎰",
        desc: "Sau khi thua lỗ, bạn dễ rơi vào trạng thái kích động cảm xúc, muốn giao dịch ngay lập tức với khối lượng lớn hơn để gỡ gạc nhanh chóng. Điều này biến hoạt động đầu tư lý trí thành trò chơi may rủi.",
        solution: "Hãy thực thi quy tắc 'Thời gian hạ nhiệt' (Cool-down period): Sau khi thua lỗ 2 lệnh liên tiếp, hãy dừng giao dịch hoàn toàn trong ít nhất 48 giờ để lấy lại sự bình tĩnh.",
        articleLink: "/knowledge/tai-chinh-ca-nhan/buc-tranh-dong-tien-ca-nhan",
        articleTitle: "Đọc bài viết: Nhật ký phản tư & Cách vượt qua cú sốc thua lỗ"
      }
    };

    return details[results.primaryBias] || {
      title: "Nhà đầu tư kỷ luật & lý trí tốt! 🏆",
      desc: "Bạn có nhận thức tâm lý xuất sắc và kiểm soát cảm xúc rất tốt trước các biến động của thị trường ảo. Định kiến của bạn nằm ở mức thấp và bạn tôn trọng các kỷ luật đầu tư khoa học.",
      solution: "Hãy tiếp tục duy trì nhật ký giao dịch ảo, rà soát lại các lệnh định kỳ để phát hiện các lỗ hổng cảm xúc ẩn giấu khác khi thị trường trải qua các giai đoạn khó khăn hơn.",
      articleLink: "/knowledge/tai-chinh-ca-nhan/lai-kep-va-chi-phi-co-hoi",
      articleTitle: "Đọc bài viết: Lãi kép, kỷ luật & Tầm nhìn dài hạn"
    };
  }, [results]);

  const currentQuestion = BIAS_QUESTIONS[currentIndex];
  const isOptionSelected = answers[currentQuestion.id] !== undefined;

  return (
    <div className="grid gap-6">
      {!showResult ? (
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          {/* Quiz Card */}
          <section className="rounded-md border border-[#e0e5dc] bg-white p-6 shadow-sm flex flex-col justify-between min-h-[450px]">
            <div>
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#edf0eb]">
                <h2 className="text-lg font-bold text-[#17201b] flex items-center gap-2">
                  <BrainCircuit className="h-5 w-5 text-[#0f766e]" />
                  Câu hỏi {currentIndex + 1} / {BIAS_QUESTIONS.length}
                </h2>
                <span className="text-xs font-semibold text-[#5b6861] bg-[#f8fbf7] px-2.5 py-1 rounded-full border border-[#e0e5dc]">
                  Khảo sát tâm lý đầu tư
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 bg-[#edf0eb] rounded-full overflow-hidden mb-6">
                <div
                  className="h-full bg-[#0f766e] transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / BIAS_QUESTIONS.length) * 100}%` }}
                />
              </div>

              <p className="text-base font-bold text-[#17201b] leading-6 mb-5">
                {currentQuestion.question}
              </p>

              <div className="grid gap-3">
                {currentQuestion.options.map((opt, optIdx) => {
                  const isSelected = answers[currentQuestion.id] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(currentQuestion.id, optIdx)}
                      className={`p-4 rounded-md border text-left text-sm transition-all flex items-start gap-3 ${
                        isSelected
                          ? "border-[#0f766e] bg-[#edf4ef] text-[#17201b]"
                          : "border-[#d9ddd3] bg-white hover:bg-[#f8fbf7] text-[#4a5a52]"
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full border mt-0.5 shrink-0 flex items-center justify-center font-bold text-xs ${
                        isSelected ? "bg-[#0f766e] text-white border-transparent" : "border-[#d9ddd3] text-[#5b6861]"
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="leading-5">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="mt-8 pt-4 border-t border-[#edf0eb] flex justify-between items-center">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="btn btn-outline btn-sm px-4 disabled:opacity-40 disabled:pointer-events-none"
              >
                Quay lại
              </button>
              
              <button
                type="button"
                onClick={handleNext}
                disabled={!isOptionSelected}
                className="btn btn-primary btn-sm px-5 disabled:opacity-40 disabled:pointer-events-none"
              >
                {currentIndex === BIAS_QUESTIONS.length - 1 ? "Xem kết quả" : "Câu tiếp theo"}
              </button>
            </div>
          </section>

          {/* Right Column: Educational info */}
          <section className="rounded-md border border-[#e0e5dc] bg-[#fdfbf7] p-5 self-start text-sm leading-6 text-[#4a5a52]">
            <h3 className="font-bold text-[#17201b] flex items-center gap-1.5 mb-3 text-base">
              <HelpCircle className="h-5 w-5 text-[#0f766e]" />
              Tại sao cần trắc nghiệm định kiến?
            </h3>
            <p className="mb-3">
              Kẻ thù lớn nhất của nhà đầu tư không phải là thị trường, mà chính là những <b>điểm mù tâm lý</b> của bản thân. Bộ não con người được lập trình qua hàng triệu năm để sống sót trước thú dữ, nhưng cơ chế sinh tồn đó lại hoàn toàn trái ngược với các nguyên lý giao dịch tài chính kỷ luật.
            </p>
            <p className="mb-3">
              Trắc nghiệm này mô phỏng các tình huống thực tế của sàn giao dịch ảo giúp bạn tự phát hiện xem mình có xu hướng hành xử cảm xúc ở đâu. Từ đó có biện pháp phòng ngừa trước khi tham gia thị trường thật.
            </p>
            <div className="mt-4 p-3 bg-white border border-[#e0e5dc] rounded-md flex items-start gap-2.5">
              <AlertTriangle className="h-4.5 w-4.5 text-[#d65a31] shrink-0 mt-0.5" />
              <span className="text-xs text-[#5b6861]">
                <b>Lưu ý:</b> Hãy trả lời thành thật theo thói quen tự nhiên của bạn để nhận diện chính xác nhất điểm yếu tâm lý của mình.
              </span>
            </div>
          </section>
        </div>
      ) : (
        /* Results Screen */
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-md border border-[#e0e5dc] bg-white p-6 shadow-sm text-center">
            <div className="mx-auto w-16 h-16 bg-[#edf6ed] rounded-full flex items-center justify-center text-[#166534] mb-4">
              <Award className="h-10 w-10" />
            </div>
            
            <h2 className="text-2xl font-black text-[#17201b]">Kết quả phân tích tâm lý</h2>
            <p className="text-sm text-[#5b6861] mt-1">Hộp công cụ chẩn đoán JokingFinance</p>

            {/* Score Ring / Bar */}
            <div className="my-6">
              <p className="text-xs font-bold text-[#5b6861] uppercase tracking-wider">Chỉ số Kỷ luật Lý trí</p>
              <div className="text-5xl font-black text-[#0f766e] mt-2 font-mono">{results?.disciplineScore}%</div>
              
              <div className="mt-4 max-w-md mx-auto h-3 bg-[#edf0eb] rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    (results?.disciplineScore || 0) >= 80
                      ? "bg-[#166534]"
                      : (results?.disciplineScore || 0) >= 50
                        ? "bg-[#d97706]"
                        : "bg-[#b91c1c]"
                  }`}
                  style={{ width: `${results?.disciplineScore}%` }}
                />
              </div>
              <p className="text-xs text-[#5b6861] mt-2">
                Bạn đã đưa ra quyết định lý trí trong <b>{results?.rationalCount} / 5</b> tình huống giả định.
              </p>
            </div>

            {/* Primary Bias Diagnosis */}
            <div className="text-left mt-6 border-t border-[#edf0eb] pt-5">
              <p className="text-sm font-bold text-[#5b6861] uppercase tracking-wider mb-2">Định kiến tâm lý nổi trội nhất:</p>
              <div className="p-4 rounded-md border bg-[#f8fbf7] border-[#d9ddd3] text-sm">
                <p className="font-bold text-[#0f766e] text-lg flex items-center gap-1.5">
                  <Sparkles className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  {primaryBiasDetails?.title}
                </p>
                <p className="mt-2 text-[#4a5a52] leading-6 text-sm">{primaryBiasDetails?.desc}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-center gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="btn btn-outline btn-md flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Làm lại trắc nghiệm
              </button>
              
              <Link
                href="/app/simulator"
                className="btn btn-primary btn-md flex items-center gap-2"
              >
                Thực hành ở Simulator
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>

          {/* Right Column: Detailed suggestions & Lessons */}
          <div className="flex flex-col gap-5">
            <section className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
              <h3 className="font-bold text-[#17201b] text-base mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="h-5 w-5 text-[#0f766e]" />
                Lời khuyên để vượt qua định kiến này
              </h3>
              <p className="text-sm text-[#4a5a52] leading-6 mb-4">
                {primaryBiasDetails?.solution}
              </p>

              <div className="p-3.5 bg-[#edf5ee] border border-[#d2dfd5] rounded-md text-xs leading-5 text-[#166534]">
                <p className="font-bold">💡 Nguyên tắc thực hành ảo JokingFinance:</p>
                <p className="mt-1">
                  Hãy ghi nhận lại định kiến này vào phần <b>Nhật ký (Journal)</b> của các lệnh mua/bán ảo tiếp theo. Khi rà soát lại lệnh sau 7 hoặc 14 ngày, bạn sẽ thấy rõ sự khác biệt của kết quả khi hành động dựa trên Định kiến so với Kỷ luật.
                </p>
              </div>
            </section>

            <section className="rounded-md border border-[#e2d3a7] bg-[#fff8df] p-5 text-sm">
              <h3 className="font-bold text-[#5b420b] flex items-center gap-1.5">
                <BookOpen className="h-4.5 w-4.5 text-[#0f766e]" />
                Bài học được đề xuất cho riêng bạn
              </h3>
              <p className="mt-2 text-[#5b420b] leading-6">
                Hệ thống khuyên bạn nên dành 10 phút đọc bài học này để hiểu rõ cơ chế khoa học hành vi đằng sau định kiến của mình:
              </p>
              <div className="mt-4">
                {primaryBiasDetails && (
                  <Link
                    href={primaryBiasDetails.articleLink}
                    className="inline-flex items-center gap-1 font-bold text-[#0f766e] hover:underline"
                  >
                    {primaryBiasDetails.articleTitle}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
