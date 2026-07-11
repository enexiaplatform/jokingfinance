"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import {
  Brain,
  Sparkles,
  RefreshCw,
  ArrowRight,
  ShieldAlert,
  Coins,
} from "lucide-react";
import type { Trade, JournalEntry, MistakeType, TradeEmotion } from "@/lib/simulator/types";
import { formatEmotion, formatMistakeType, formatPercent, formatPoints } from "@/lib/format";
import { MetricCard } from "@/components/ui/metric-card";
import { Badge } from "@/components/ui/badge";
import { knowledgePillars, createKnowledgeSlug } from "@/data/knowledge-library";
import { INITIAL_VIRTUAL_POINTS } from "@/lib/constants";

type BehavioralDiagnosticsProps = {
  trades: Trade[];
  journal: JournalEntry[];
};

type RecommendationItem = {
  pillarSlug: string;
  moduleTitle: string;
  reason: string;
};

type Question = {
  text: string;
  category: "fomo" | "lossAversion" | "overconfidence" | "confirmation" | "anchoring" | "riskNeglect";
  options: {
    text: string;
    score: number;
  }[];
};

const BASELINE_QUESTIONS: Question[] = [
  {
    text: "Bạn thấy một cổ phiếu (ví dụ FPT) tăng trần 3 phiên liên tiếp, các hội nhóm đều hô hào 'phải lên tàu gấp kẻo lỡ sóng nhân đôi'. Bạn sẽ làm gì?",
    category: "fomo",
    options: [
      { text: "Tắt bảng điện, bình tĩnh tìm báo cáo phân tích xem có tin tức cốt lõi nào hỗ trợ không.", score: 0 },
      { text: "Băn khoăn theo dõi thêm 1-2 ngày, nếu tiếp tục tăng thì mua một lượng nhỏ cho đỡ tiếc.", score: 1 },
      { text: "Đặt lệnh mua ngay lập tức bằng điểm ảo, luận điểm phân tích tính sau.", score: 2 },
    ],
  },
  {
    text: "Một cổ phiếu bạn nắm giữ giảm 20% do tình hình kinh doanh của doanh nghiệp sụt giảm nghiêm trọng. Bạn xử lý thế nào?",
    category: "lossAversion",
    options: [
      { text: "Thừa nhận luận điểm ban đầu đã sai và dứt khoát cắt lỗ để bảo vệ vốn.", score: 0 },
      { text: "Tự nhủ 'chưa bán là chưa lỗ', tiếp tục gồng giữ và hy vọng giá sẽ hồi về điểm hòa vốn.", score: 1 },
      { text: "Mua trung bình giá xuống gấp đôi số lượng để nhanh chóng hòa vốn hơn.", score: 2 },
    ],
  },
  {
    text: "Sau khi thực hiện liên tiếp 3 giao dịch mô phỏng đều thắng lớn (lãi > 15%), bạn cảm thấy thế nào?",
    category: "overconfidence",
    options: [
      { text: "Mừng nhưng hiểu rằng do thị trường thuận lợi (uptrend), cần giữ nguyên kỷ luật phân bổ vốn.", score: 0 },
      { text: "Cảm thấy tự tin hơn nhiều, bắt đầu tìm các cổ phiếu đầu cơ biến động mạnh để tối ưu lãi.", score: 1 },
      { text: "Nghĩ mình đã hiểu hết luật chơi, tăng quy mô giao dịch tiếp theo lên gấp đôi và bỏ qua bước ghi rủi ro.", score: 2 },
    ],
  },
  {
    text: "Bạn rất tin tưởng vào cổ phiếu HPG. Một bài phân tích chi tiết xuất hiện chỉ ra rủi ro HPG sắp sụt giảm biên lợi nhuận do chi phí đầu vào tăng. Bạn phản ứng ra sao?",
    category: "confirmation",
    options: [
      { text: "Nghiên cứu kỹ các rủi ro bài phân tích nêu ra để tự kiểm chứng lại luận điểm của mình.", score: 0 },
      { text: "Khó chịu lướt qua, đi tìm các bài viết ca ngợi để củng cố niềm tin.", score: 1 },
      { text: "Gạt phắt đi, cho rằng người viết phân tích nông cạn hoặc đang cố tình đè giá cổ phiếu.", score: 2 },
    ],
  },
  {
    text: "Cổ phiếu từng bỏ lỡ ở giá 30.000đ tăng lên 100.000đ, sau đó điều chỉnh về 80.000đ. Nhận định của bạn là gì?",
    category: "anchoring",
    options: [
      { text: "Định giá lại doanh nghiệp dựa trên số liệu hiện tại để xem mức 80.000đ có thực sự hấp dẫn.", score: 0 },
      { text: "Tiếc nuối vì giá vốn 30.000đ trước đây và quyết định bỏ qua không theo dõi nữa.", score: 1 },
      { text: "Cho rằng 80.000đ là quá hời so với đỉnh 100.000đ mới lập và giải ngân mua ngay.", score: 2 },
    ],
  },
  {
    text: "Khi chuẩn bị mua một cổ phiếu mới trong mô phỏng, bạn thường dành bao nhiêu thời gian phân tích rủi ro?",
    category: "riskNeglect",
    options: [
      { text: "Xác định rõ ít nhất 3 rủi ro cốt lõi có thể làm luận điểm sai và lập sẵn ngưỡng cắt lỗ.", score: 0 },
      { text: "Xem qua biểu đồ kỹ thuật và nghĩ rủi ro chỉ xảy ra khi thị trường chung sụp đổ.", score: 1 },
      { text: "Không phân tích rủi ro, chỉ tập trung tính toán xem giá tăng lên mục tiêu thì mình lãi bao nhiêu.", score: 2 },
    ],
  },
];

type ProfileKey = "fomo" | "lossAversion" | "overconfidence" | "confirmation" | "anchoring" | "riskNeglect" | "rational";

type BiasProfile = {
  title: string;
  key: ProfileKey;
  description: string;
  rules: string[];
  recommendedModules: {
    pillarSlug: string;
    moduleTitle: string;
    reason: string;
  }[];
};

const BIAS_PROFILES: Record<ProfileKey, BiasProfile> = {
  fomo: {
    title: "Thợ săn FOMO (FOMO Hunter)",
    key: "fomo",
    description: "Bạn rất dễ bị lôi cuốn bởi màu xanh tím của bảng điện và những tin đồn hưng phấn trên thị trường. Bạn thường mua đuổi giá cao vì sợ bỏ lỡ cơ hội, nhưng lại dễ rơi vào bẫy điều chỉnh ngắn hạn.",
    rules: [
      "Quy tắc Đợi 15 phút: Khi có tin nóng hoặc cổ phiếu tăng trần, tuyệt đối không đặt lệnh ngay. Đợi 15 phút, uống một ngụm nước và tự viết 3 dòng luận điểm.",
      "Giới hạn quy mô: Không phân bổ quá 10% vốn ảo cho các mã đang tăng nóng trên 5% trong ngày."
    ],
    recommendedModules: [
      {
        pillarSlug: "tam-ly-dau-tu",
        moduleTitle: "FOMO và tin nóng",
        reason: "Để hiểu rõ cơ chế tâm lý thúc đẩy hành vi mua đuổi và cách xây dựng kỷ luật kiên nhẫn."
      },
      {
        pillarSlug: "chung-khoan-nhap-mon",
        moduleTitle: "Tin tức và nhiễu thị trường",
        reason: "Giúp bạn lọc bỏ các thông tin nhiễu từ diễn đàn và tập trung vào các dữ kiện thực tế."
      }
    ]
  },
  lossAversion: {
    title: "Người gồng lỗ vĩ đại (Loss-Averse Holder)",
    key: "lossAversion",
    description: "Bạn có nỗi sợ tổn thất cực kỳ lớn, dẫn đến việc không dám chấp nhận cắt lỗ khi sai luận điểm. Bạn thường gồng lỗ với suy nghĩ 'chưa bán là chưa lỗ', hoặc tệ hơn là mua trung bình giá xuống vô tội vạ.",
    rules: [
      "Quy tắc Ngưỡng cắt lỗ: Đặt sẵn ngưỡng dừng lỗ tối đa 8% từ giá vốn và kiên quyết bán khi chạm ngưỡng mà không tự biện minh.",
      "Không trung bình giá xuống: Tuyệt đối không mua thêm cổ phiếu đang giảm giá trừ khi có phân tích định giá chi tiết chứng minh doanh nghiệp vẫn tăng trưởng dài hạn."
    ],
    recommendedModules: [
      {
        pillarSlug: "tam-ly-dau-tu",
        moduleTitle: "Neo giá và sợ lỗ",
        reason: "Giải mã tâm lý sợ tổn thất và học cách chấp nhận các khoản lỗ nhỏ để bảo vệ nguồn vốn ảo lớn."
      },
      {
        pillarSlug: "quan-tri-rui-ro",
        moduleTitle: "Kịch bản xấu",
        reason: "Lập kế hoạch ứng phó trước khi thị trường lao dốc để không bị hoảng loạn đưa ra quyết định sai lầm."
      }
    ]
  },
  overconfidence: {
    title: "Bò tót quá tự tin (Overconfident Bull)",
    key: "overconfidence",
    description: "Bạn dễ nhầm lẫn giữa sự may mắn khi thị trường đi lên với năng lực phân tích cá nhân. Sau vài lần giao dịch có lãi, bạn xu hướng chủ quan, tăng quy mô đặt lệnh quá nhanh và bỏ qua việc kiểm soát rủi ro.",
    rules: [
      "Giới hạn tỷ trọng mã đơn lẻ: Tổng giá trị một mã cổ phiếu không được vượt quá 20% giá trị danh mục ảo.",
      "Nhật ký rủi ro bắt buộc: Bắt buộc phải ghi nhận ít nhất 3 rủi ro cốt lõi của doanh nghiệp trước khi đặt lệnh mua."
    ],
    recommendedModules: [
      {
        pillarSlug: "xay-dung-danh-muc",
        moduleTitle: "Phân bổ tỷ trọng",
        reason: "Hiểu cách quản lý quy mô lệnh để một sai số nhỏ không phá hỏng toàn bộ thành quả danh mục."
      },
      {
        pillarSlug: "quan-tri-rui-ro",
        moduleTitle: "Rủi ro tập trung",
        reason: "Học cách thiết kế danh mục cân bằng để phòng ngừa các cú sụp đổ bất ngờ từ một ngành đơn lẻ."
      }
    ]
  },
  confirmation: {
    title: "Người đi tìm sự xác nhận (Confirmation Seeker)",
    key: "confirmation",
    description: "Bạn chỉ có xu hướng tìm đọc và tin tưởng các thông tin ủng hộ quyết định mua của mình, đồng thời tự động gạt bỏ hoặc đánh giá thấp các phân tích phản biện rủi ro.",
    rules: [
      "Quy tắc Ý kiến trái chiều: Trước khi mua, phải tìm đọc ít nhất 1 bài viết hoặc đưa ra 1 lý do phản biện tại sao quyết định này có thể sai.",
      "Đọc báo cáo độc lập: Tập trung đọc phần rủi ro trong báo cáo thường niên của doanh nghiệp thay vì chỉ đọc mục tiêu doanh thu."
    ],
    recommendedModules: [
      {
        pillarSlug: "chung-khoan-nhap-mon",
        moduleTitle: "Tin tức và nhiễu thị trường",
        reason: "Xây dựng tư duy phản biện trước các bài viết PR và tin tức truyền thông một chiều."
      },
      {
        pillarSlug: "tam-ly-dau-tu",
        moduleTitle: "Nhật ký cảm xúc",
        reason: "Ghi chép cảm xúc khách quan giúp bạn nhận ra mình có đang bỏ qua các dữ kiện bất lợi hay không."
      }
    ]
  },
  anchoring: {
    title: "Người neo giá (Price Anchorer)",
    key: "anchoring",
    description: "Bạn bị ám ảnh bởi các cột mốc giá trong quá khứ (như đỉnh cũ, đáy cũ, giá mua cũ) và lấy đó làm thước đo đắt/rẻ, bất kể các yếu tố nội tại của doanh nghiệp đã thay đổi thế nào.",
    rules: [
      "Định giá độc lập: Định giá lại cổ phiếu dựa trên lợi nhuận và doanh thu hiện tại thay vì so sánh với giá đỉnh lịch sử.",
      "Quy tắc Quên giá vốn: Khi đánh giá có nên bán hay giữ, hãy tự hỏi: 'Nếu hôm nay có tiền mặt, tôi có mua cổ phiếu này ở mức giá hiện tại không?'"
    ],
    recommendedModules: [
      {
        pillarSlug: "tam-ly-dau-tu",
        moduleTitle: "Neo giá và sợ lỗ",
        reason: "Hiểu rõ bẫy tâm lý neo giá khiến nhà đầu tư mua phải doanh nghiệp đang trên đà suy thoái chỉ vì giá nó đã giảm sâu từ đỉnh."
      },
      {
        pillarSlug: "dinh-gia-co-ban",
        moduleTitle: "Biên an toàn",
        reason: "Học cách xác định giá trị thực của doanh nghiệp thay vì dựa vào cảm giác đắt rẻ cảm tính."
      }
    ]
  },
  riskNeglect: {
    title: "Chiến binh liều lĩnh (Risk Ignorer)",
    key: "riskNeglect",
    description: "Bạn là người cực kỳ lạc quan, chỉ tập trung vào viễn cảnh sinh lời tươi sáng mà bỏ qua các yếu tố rủi ro và biên an toàn bảo vệ tài khoản khi thị trường đảo chiều.",
    rules: [
      "Biên an toàn tối thiểu: Chỉ mua cổ phiếu khi giá thị trường thấp hơn giá trị thực ước tính ít nhất 15%.",
      "Kịch bản ứng phó: Lập sẵn kịch bản hành động chi tiết nếu doanh số doanh nghiệp sụt giảm 20% trong quý tới."
    ],
    recommendedModules: [
      {
        pillarSlug: "quan-tri-rui-ro",
        moduleTitle: "Các loại rủi ro",
        reason: "Nhận diện các loại rủi ro hệ thống và phi hệ thống có thể tàn phá danh mục của bạn bất kỳ lúc nào."
      },
      {
        pillarSlug: "quan-tri-rui-ro",
        moduleTitle: "Ngưỡng dừng và quy tắc cá nhân",
        reason: "Học cách thiết lập hệ thống phòng vệ chủ động để bảo toàn điểm ảo trước khi nghĩ đến việc gia tăng lợi nhuận."
      }
    ]
  },
  rational: {
    title: "Nhà đầu tư lý trí (Balanced Investor)",
    key: "rational",
    description: "Chúc mừng! Bạn có mức độ kỷ luật nền tảng rất tốt. Bạn biết phân biệt dữ kiện với cảm xúc, tôn trọng các nguyên tắc quản trị rủi ro và luôn tìm kiếm sự khách quan.",
    rules: [
      "Duy trì quy trình: Tiếp tục áp dụng checklist 7 bước trước khi đặt lệnh và duy trì thói quen viết nhật ký giao dịch.",
      "Quan sát liên tục: Tránh chủ quan khi thị trường thuận lợi, luôn định kỳ rà soát các rủi ro tiềm ẩn của danh mục."
    ],
    recommendedModules: [
      {
        pillarSlug: "xay-dung-danh-muc",
        moduleTitle: "Mục tiêu danh mục",
        reason: "Để tối ưu hóa danh mục theo mục tiêu dài hạn thay vì chỉ tập trung vào các giao dịch ngắn hạn."
      },
      {
        pillarSlug: "tam-ly-dau-tu",
        moduleTitle: "Nhật ký cảm xúc",
        reason: "Để duy trì sự thấu hiểu bản thân và theo dõi các thay đổi tâm lý qua các chu kỳ thị trường."
      }
    ]
  }
};

export function BehavioralDiagnostics({ trades, journal }: BehavioralDiagnosticsProps) {
  const [savedProfile, setSavedProfile] = useState<{
    key: string;
    title: string;
    description: string;
    rules: string[];
    takenAt: string;
  } | null>(null);
  const [quizStep, setQuizStep] = useState<number | null | "result">(null);
  const [answers, setAnswers] = useState<number[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("jokingfinance-baseline-profile");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setTimeout(() => {
          setSavedProfile(parsed);
        }, 0);
      } catch {
        // Ignore
      }
    }
  }, []);

  // 1. Calculate General Health Metrics
  const stats = useMemo(() => {
    if (trades.length === 0) return null;

    const journalMap = new Map(journal.map((j) => [j.tradeId, j]));
    const journaledTrades = trades.filter((t) => journalMap.has(t.id));
    const coveragePercent = Math.round((journaledTrades.length / trades.length) * 100);

    // Count mistakes (exclude Good discipline)
    const mistakeCounts: Record<MistakeType, number> = {
      FOMO: 0,
      "Over-concentration": 0,
      "No thesis": 0,
      "Panic selling": 0,
      "Chasing news": 0,
      "Ignoring risk": 0,
      "Good discipline": 0,
      Other: 0,
    };

    let totalMistakes = 0;
    let goodDisciplineCount = 0;

    journaledTrades.forEach((t) => {
      const entry = journalMap.get(t.id);
      if (entry) {
        if (entry.mistakeType === "Good discipline") {
          goodDisciplineCount++;
        } else {
          mistakeCounts[entry.mistakeType]++;
          totalMistakes++;
        }
      }
    });

    const sortedMistakes = (Object.keys(mistakeCounts) as MistakeType[])
      .filter((type) => type !== "Good discipline")
      .map((type) => ({
        type,
        count: mistakeCounts[type],
        percentage: totalMistakes > 0 ? Math.round((mistakeCounts[type] / totalMistakes) * 100) : 0,
      }))
      .filter((m) => m.count > 0)
      .sort((a, b) => b.count - a.count);

    // Emotion statistics
    const emotionCounts: Record<TradeEmotion, number> = {
      calm: 0,
      curious: 0,
      FOMO: 0,
      confident: 0,
      uncertain: 0,
    };

    trades.forEach((t) => {
      if (t.emotion in emotionCounts) {
        emotionCounts[t.emotion]++;
      }
    });

    const dominantEmotion = (Object.keys(emotionCounts) as TradeEmotion[]).reduce((a, b) =>
      emotionCounts[a] > emotionCounts[b] ? a : b
    );

    // Regret rates by emotion: out of trades with specific emotion that have been journaled, how many are wouldRepeat === "no"
    const emotionRegretRates = (Object.keys(emotionCounts) as TradeEmotion[])
      .map((emotion) => {
        const tradesWithEmotion = journaledTrades.filter((t) => t.emotion === emotion);
        const regretTrades = tradesWithEmotion.filter((t) => {
          const entry = journalMap.get(t.id);
          return entry?.wouldRepeat === "no";
        });

        return {
          emotion,
          total: tradesWithEmotion.length,
          regret: regretTrades.length,
          rate: tradesWithEmotion.length > 0 ? Math.round((regretTrades.length / tradesWithEmotion.length) * 100) : 0,
        };
      })
      .filter((item) => item.total > 0)
      .sort((a, b) => b.rate - a.rate);

    const totalFees = trades.reduce((sum, t) => sum + (t.fee || 0), 0);
    const dragPercentage = (totalFees / INITIAL_VIRTUAL_POINTS) * 100;

    return {
      totalTrades: trades.length,
      journaledCount: journaledTrades.length,
      coveragePercent,
      goodDisciplineCount,
      totalMistakes,
      sortedMistakes,
      dominantEmotion,
      emotionCounts,
      emotionRegretRates,
      totalFees,
      dragPercentage,
    };
  }, [trades, journal]);

  // 2. Map Mistakes to Educational Content
  const recommendations = useMemo((): RecommendationItem[] => {
    if (!stats || stats.sortedMistakes.length === 0) {
      // Default recommendation when there are no mistakes recorded
      return [
        {
          pillarSlug: "tam-ly-dau-tu",
          moduleTitle: "Nhật ký cảm xúc",
          reason: "Để bắt đầu hành trình cải thiện kỷ luật đầu tư, ghi nhận cảm xúc trước và sau khi đặt lệnh là bước quan trọng nhất.",
        },
        {
          pillarSlug: "xay-dung-danh-muc",
          moduleTitle: "Theo dõi và tái cân bằng",
          reason: "Học cách theo dõi danh mục ảo định kỳ giúp bạn luôn giữ sự khách quan trước biến động giá.",
        },
      ];
    }

    const primaryMistake = stats.sortedMistakes[0].type;

    switch (primaryMistake) {
      case "FOMO":
        return [
          {
            pillarSlug: "tam-ly-dau-tu",
            moduleTitle: "FOMO và tin nóng",
            reason: "Bạn có xu hướng giao dịch khi sợ bỏ lỡ cơ hội. Hãy đọc module này để nhận diện và tránh các quyết định hưng phấn tức thời.",
          },
          {
            pillarSlug: "chung-khoan-nhap-mon",
            moduleTitle: "Tin tức và nhiễu thị trường",
            reason: "Giúp bạn phân biệt giữa tin nóng gây nhiễu và những thông tin thật sự phản ánh giá trị doanh nghiệp.",
          },
        ];
      case "Over-concentration":
        return [
          {
            pillarSlug: "xay-dung-danh-muc",
            moduleTitle: "Phân bổ tỷ trọng",
            reason: "Sai lầm tập trung quá nhiều vốn vào một mã làm tăng rủi ro danh mục. Đọc bài học này để hiểu cách giới hạn tỷ trọng hợp lý.",
          },
          {
            pillarSlug: "quan-tri-rui-ro",
            moduleTitle: "Rủi ro tập trung",
            reason: "Phân tích các tác động tiêu cực của việc 'bỏ trứng vào một giỏ' và cách đa dạng hóa thông minh.",
          },
        ];
      case "No thesis":
        return [
          {
            pillarSlug: "bao-cao-tai-chinh",
            moduleTitle: "Báo cáo kết quả kinh doanh",
            reason: "Bạn thường mua mà không có luận điểm. Hãy bắt đầu học cách phân tích hoạt động cốt lõi của doanh nghiệp qua kết quả kinh doanh.",
          },
          {
            pillarSlug: "dinh-gia-co-ban",
            moduleTitle: "Biên an toàn",
            reason: "Học cách thiết lập biên an toàn để bảo vệ danh mục ngay cả khi phán đoán ban đầu chưa hoàn thiện.",
          },
        ];
      case "Panic selling":
        return [
          {
            pillarSlug: "quan-tri-rui-ro",
            moduleTitle: "Kịch bản xấu",
            reason: "Bạn dễ bị bán tháo khi giá giảm. Thiết lập sẵn các kịch bản hành động khi giá giảm 10-15% sẽ giúp bạn hành động lý trí.",
          },
          {
            pillarSlug: "tam-ly-dau-tu",
            moduleTitle: "Neo giá và sợ lỗ",
            reason: "Hiểu sâu sắc về tâm lý sợ lỗ để không đưa ra quyết định cắt lỗ muộn màng hoặc bán tháo trong hoảng loạn.",
          },
        ];
      case "Chasing news":
        return [
          {
            pillarSlug: "chung-khoan-nhap-mon",
            moduleTitle: "Tin tức và nhiễu thị trường",
            reason: "Hãy học cách sàng lọc tin tức để tránh mua bán theo tin đồn hay tin đã được phản ánh vào giá.",
          },
          {
            pillarSlug: "tam-ly-dau-tu",
            moduleTitle: "FOMO và tin nóng",
            reason: "Giải mã hành vi tâm lý thôi thúc bạn giao dịch mỗi khi có tin tức mới xuất hiện trên thị trường.",
          },
        ];
      case "Ignoring risk":
        return [
          {
            pillarSlug: "quan-tri-rui-ro",
            moduleTitle: "Các loại rủi ro",
            reason: "Bạn thường tập trung vào tiềm năng lời mà bỏ qua rủi ro. Hãy tập thói quen gọi tên ít nhất 3 rủi ro trước khi đặt lệnh.",
          },
          {
            pillarSlug: "quan-tri-rui-ro",
            moduleTitle: "Ngưỡng dừng và quy tắc cá nhân",
            reason: "Học cách lập quy tắc cắt lỗ và quy tắc giảm tỷ trọng tự động trước khi cảm xúc lên tiếng.",
          },
        ];
      default:
        return [
          {
            pillarSlug: "xay-dung-danh-muc",
            moduleTitle: "Mục tiêu danh mục",
            reason: "Mọi quyết định giao dịch xuất phát từ mục tiêu rõ ràng sẽ giúp bạn giữ được sự nhất quán.",
          },
          {
            pillarSlug: "tam-ly-dau-tu",
            moduleTitle: "Nhật ký cảm xúc",
            reason: "Tiếp tục sử dụng nhật ký để quan sát các thiên kiến ẩn sâu trong quá trình thực hành của bạn.",
          },
        ];
    }
  }, [stats]);

  // 3. Find recommended module links from data
  const recommendedModules = useMemo(() => {
    return recommendations.map((rec) => {
      const pillar = knowledgePillars.find((p) => p.slug === rec.pillarSlug);
      const mod = pillar?.modules.find((m) => m.title === rec.moduleTitle);
      return {
        rec,
        pillar,
        module: mod,
        url: pillar && mod ? `/knowledge/${pillar.slug}/${createKnowledgeSlug(mod.title)}` : "#",
      };
    });
  }, [recommendations]);

  // Find baseline recommended modules
  const baselineRecommendedModules = useMemo(() => {
    if (!savedProfile) return [];
    const profile = BIAS_PROFILES[savedProfile.key as ProfileKey];
    if (!profile) return [];

    return profile.recommendedModules.map((rec) => {
      const pillar = knowledgePillars.find((p) => p.slug === rec.pillarSlug);
      const mod = pillar?.modules.find((m) => m.title === rec.moduleTitle);
      return {
        rec,
        pillar,
        module: mod,
        url: pillar && mod ? `/knowledge/${pillar.slug}/${createKnowledgeSlug(mod.title)}` : "#",
      };
    });
  }, [savedProfile]);

  const handleStartQuiz = () => {
    setAnswers([]);
    setQuizStep(0);
  };

  const handleAnswer = (optionIndex: number) => {
    const nextAnswers = [...answers, optionIndex];
    setAnswers(nextAnswers);

    if (quizStep !== null && typeof quizStep === "number") {
      if (quizStep < BASELINE_QUESTIONS.length - 1) {
        setQuizStep(quizStep + 1);
      } else {
        // Calculate results
        const scores = {
          fomo: 0,
          lossAversion: 0,
          overconfidence: 0,
          confirmation: 0,
          anchoring: 0,
          riskNeglect: 0,
        };

        BASELINE_QUESTIONS.forEach((q, idx) => {
          const ansIdx = nextAnswers[idx];
          const score = q.options[ansIdx]?.score ?? 0;
          scores[q.category] += score;
        });

        // Determine profile key
        let profileKey: ProfileKey = "rational";
        const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

        if (totalScore > 2) {
          const sortedCategories = (Object.keys(scores) as (keyof typeof scores)[]).sort(
            (a, b) => scores[b] - scores[a]
          );
          const topCategory = sortedCategories[0];
          if (scores[topCategory] > 0) {
            profileKey = topCategory as ProfileKey;
          }
        }

        const profileData = {
          key: profileKey,
          title: BIAS_PROFILES[profileKey].title,
          description: BIAS_PROFILES[profileKey].description,
          rules: BIAS_PROFILES[profileKey].rules,
          scores,
          answers: nextAnswers,
          takenAt: new Date().toISOString(),
        };

        localStorage.setItem("jokingfinance-baseline-profile", JSON.stringify(profileData));
        setSavedProfile(profileData);
        setQuizStep("result");
      }
    }
  };

  const handleResetQuiz = () => {
    localStorage.removeItem("jokingfinance-baseline-profile");
    setSavedProfile(null);
    setQuizStep(null);
  };

  // Render Quiz step
  if (quizStep !== null && typeof quizStep === "number") {
    const q = BASELINE_QUESTIONS[quizStep];
    return (
      <div className="rounded-md border border-[#e0e5dc] bg-white p-6 shadow-sm max-w-2xl mx-auto my-4">
        <div className="flex justify-between items-center text-xs font-semibold text-[#66736c] uppercase tracking-wider">
          <span className="flex items-center gap-1"><Brain className="h-4 w-4 text-[#0f766e]" /> Trắc nghiệm Thiên kiến</span>
          <span>Câu hỏi {quizStep + 1} / {BASELINE_QUESTIONS.length}</span>
        </div>
        
        <div className="mt-2 h-1.5 w-full rounded-full bg-[#f0f2ee] overflow-hidden">
          <div
            className="h-full rounded-full bg-[#0f766e] transition-all duration-300"
            style={{ width: `${((quizStep + 1) / BASELINE_QUESTIONS.length) * 100}%` }}
          />
        </div>

        <h3 className="mt-6 text-lg font-bold text-[#17201b] leading-snug">
          {q.text}
        </h3>

        <div className="mt-6 grid gap-3">
          {q.options.map((o, oIdx) => (
            <button
              key={oIdx}
              onClick={() => handleAnswer(oIdx)}
              className="w-full text-left p-4 rounded-md border border-[#e0e5dc] hover:border-[#0f766e] hover:bg-[#f8fbf7] transition-all text-[#314039] font-medium text-sm leading-relaxed"
            >
              {o.text}
            </button>
          ))}
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={() => {
              if (quizStep > 0) {
                setQuizStep(quizStep - 1);
                setAnswers(answers.slice(0, -1));
              } else {
                setQuizStep(null);
              }
            }}
            className="text-sm font-semibold text-[#5b6861] hover:text-[#17201b]"
          >
            Quay lại
          </button>
          <button
            onClick={() => setQuizStep(null)}
            className="text-sm font-semibold text-[#d65a31] hover:text-[#c44f28]"
          >
            Hủy bỏ
          </button>
        </div>
      </div>
    );
  }

  // Render Quiz completed results view
  if (quizStep === "result" && savedProfile) {
    return (
      <div className="rounded-md border border-[#e0e5dc] bg-white p-6 shadow-sm max-w-2xl mx-auto my-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center rounded-full bg-[#f0fdf4] text-[#0f766e] justify-center">
          <Sparkles className="h-8 w-8 text-[#0f766e]" />
        </div>
        <h2 className="mt-4 text-2xl font-black text-[#17201b]">Đã chẩn đoán xong thiên kiến!</h2>
        <p className="mt-2 text-sm text-[#5b6861]">Hồ sơ tâm lý đầu tư của bạn là:</p>
        
        <div className="mt-4 p-5 rounded-lg border border-[#b9d9c5] bg-[#f2fbf4] text-center">
          <Badge tone="green" className="mb-2">BASELINE PROFILE</Badge>
          <h3 className="text-xl font-bold text-[#17201b]">{savedProfile.title}</h3>
          <p className="mt-3 text-sm leading-6 text-[#4c5d54] text-left">{savedProfile.description}</p>
        </div>

        <div className="mt-6 text-left">
          <h4 className="font-bold text-[#17201b] mb-2 flex items-center gap-1"><ShieldAlert className="h-4 w-4 text-[#d65a31]" /> Đơn thuốc hành vi đề xuất:</h4>
          <div className="grid gap-2">
            {savedProfile.rules.map((rule: string, idx: number) => (
              <div key={idx} className="rounded-md border border-[#f1bea8] bg-[#fff0e8] p-3 text-sm text-[#9a3412] leading-5">
                📌 {rule}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => setQuizStep(null)}
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#0f766e] px-6 text-sm font-semibold text-white hover:bg-[#115e59]"
          >
            Xem bảng chẩn đoán chi tiết <ArrowRight className="ml-2 h-4 w-4" />
          </button>
          <button
            onClick={handleStartQuiz}
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#e0e5dc] px-6 text-sm font-semibold text-[#5b6861] hover:text-[#17201b]"
          >
            Làm lại
          </button>
        </div>
      </div>
    );
  }

  // If there are no trades and no profile, show the prompt to take the quiz
  if (trades.length === 0 && !savedProfile) {
    return (
      <div className="rounded-md border border-[#e0e5dc] bg-white p-8 text-center shadow-sm max-w-2xl mx-auto my-6">
        <div className="mx-auto flex h-16 w-16 items-center rounded-full bg-[#f0fdf4] text-[#0f766e] justify-center">
          <Brain className="h-8 w-8 text-[#0f766e]" />
        </div>
        <h3 className="mt-4 text-xl font-bold text-[#17201b]">Chẩn đoán Thiên kiến & Tâm lý Đầu tư</h3>
        <p className="mt-3 text-sm text-[#5b6861] leading-relaxed max-w-md mx-auto">
          Nhận diện thiên kiến nhận thức của bản thân thông qua bài trắc nghiệm nhanh 6 tình huống thực tế, trước khi những quyết định bốc đồng làm hao hụt tài khoản ảo của bạn!
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleStartQuiz}
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#0f766e] px-6 py-2 text-sm font-semibold text-white hover:bg-[#115e59]"
          >
            Làm trắc nghiệm tâm lý (6 câu)
          </button>
          <Link
            href="/app/simulator"
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#e0e5dc] px-6 py-2 text-sm font-semibold text-[#5b6861] hover:text-[#17201b]"
          >
            Đến Bộ mô phỏng ảo
          </Link>
        </div>
      </div>
    );
  }

  // If there are no trades but they have a saved profile, show the profile card as the primary view
  if (trades.length === 0 && savedProfile) {
    return (
      <div className="grid gap-6">
        {/* Baseline Profile Dashboard for new user */}
        <section className="rounded-md border border-[#e0e5dc] bg-white p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#e0e5dc] pb-4">
            <div>
              <Badge tone="green" className="mb-1">BASELINE PROFILE</Badge>
              <h2 className="text-2xl font-black text-[#17201b]">{savedProfile.title}</h2>
              <p className="mt-1 text-xs text-[#5b6861]">
                Khảo sát thực hiện ngày {new Date(savedProfile.takenAt).toLocaleDateString("vi-VN")}
              </p>
            </div>
            <button
              onClick={handleStartQuiz}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#5b6861] hover:text-[#0f766e]"
            >
              <RefreshCw className="h-3 w-3" /> Làm lại khảo sát
            </button>
          </div>

          <p className="mt-4 text-sm leading-6 text-[#4c5d54]">{savedProfile.description}</p>

          <div className="mt-6 grid gap-4">
            <h3 className="font-bold text-sm text-[#17201b] flex items-center gap-1">
              <ShieldAlert className="h-4 w-4 text-[#d65a31]" /> Đơn thuốc hành vi đề xuất cho bạn:
            </h3>
            <div className="grid gap-3">
              {savedProfile.rules.map((rule: string, idx: number) => (
                <div key={idx} className="rounded-md border border-[#f1bea8] bg-[#fff0e8] p-3 text-sm text-[#9a3412] leading-5">
                  📌 {rule}
                </div>
              ))}
            </div>
          </div>

          {/* Alert comparing to no trades */}
          <div className="mt-6 rounded-md border border-[#b9d9c5] bg-[#f2fbf4] p-4 text-sm text-[#314039]">
            💡 <strong>Bước tiếp theo:</strong> Bạn chưa thực hiện giao dịch ảo nào. Hãy mở Bộ mô phỏng để đặt lệnh mua/bán đầu tiên và áp dụng các Quy tắc hành vi này xem có cải thiện được tính kỷ luật không!
          </div>
          
          <div className="mt-4 text-right">
            <Link
              href="/app/simulator"
              className="inline-flex min-h-10 items-center justify-center rounded-md bg-[#0f766e] px-5 text-sm font-semibold text-white hover:bg-[#115e59]"
            >
              Đặt giao dịch đầu tiên <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* 4. Action Plan / Learning Recommendations */}
        {baselineRecommendedModules.length > 0 && (
          <section className="rounded-md border border-[#e0e5dc] bg-white p-6 shadow-sm">
            <h3 className="text-xl font-bold text-[#17201b]">Lộ trình sửa sai & Bài học đề xuất</h3>
            <p className="mt-1 text-sm text-[#5b6861]">
              Dựa trên thiên kiến nhận thức cao nhất của bạn, chúng tôi đề xuất các bài học thực tế từ thư viện để giúp bạn khắc phục triệt để.
            </p>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {baselineRecommendedModules.map(({ rec, pillar, module: mod, url }) => {
                if (!pillar || !mod) return null;
                return (
                  <div
                    key={mod.title}
                    className="flex flex-col justify-between rounded-lg border border-[#e8ece6] bg-[#fcfdfe] p-5 hover:border-[#b9d9c5]"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <Badge tone="blue">{pillar.title}</Badge>
                        <span className="text-xs text-[#8c9c91]">
                          Ước tính: {pillar.estimatedHours}h học
                        </span>
                      </div>
                      <h4 className="mt-3 text-base font-bold text-[#17201b]">{mod.title}</h4>
                      <p className="mt-2 text-sm text-[#4c5d54] italic leading-relaxed">
                        &ldquo;{mod.goal}&rdquo;
                      </p>
                      <p className="mt-3 text-sm text-[#5b6861] leading-relaxed">
                        💡 <strong>Lý do đề xuất:</strong> {rec.reason}
                      </p>
                      <div className="mt-3 rounded bg-[#f0f2ee] p-3 text-xs text-[#314039]">
                        🛠️ <strong>Thực hành:</strong> {mod.practice}
                      </div>
                    </div>

                    <div className="mt-5 pt-2 border-t border-[#f0f2ee]">
                      <Link
                        href={url}
                        className="inline-flex min-h-10 w-full items-center justify-center rounded-md bg-[#0f766e] px-4 text-sm font-semibold text-white hover:bg-[#115e59]"
                      >
                        Học Bài Này Ngay
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    );
  }

  // Get some text advice based on coverage
  const getCoverageAdvice = (percent: number) => {
    if (percent === 0) return "Bạn chưa ghi nhật ký cho bất kỳ giao dịch nào. Hãy bắt đầu ngay để tự chẩn đoán bản thân.";
    if (percent < 40) return "Tỷ lệ ghi nhật ký còn thấp. Để sửa lỗi hành vi, bạn cần tự xem lại ít nhất 50% quyết định của mình.";
    if (percent < 75) return "Rất tốt! Bạn đang hình thành kỷ luật ghi nhật ký định kỳ. Hãy tiếp tục duy trì.";
    return "Tuyệt vời! Kỷ luật ghi nhật ký của bạn cực kỳ xuất sắc. Bạn đang học hỏi đúng phương pháp.";
  };

  const coverageTone = stats!.coveragePercent >= 75 ? "positive" : stats!.coveragePercent >= 40 ? "neutral" : "warning";

  const dragTone = stats!.dragPercentage >= 2.0 ? "danger" : stats!.dragPercentage >= 0.5 ? "warning" : "positive";

  return (
    <div className="grid gap-6">
      {/* 1. Overview Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Độ phủ nhật ký"
          value={`${stats!.coveragePercent}%`}
          tone={coverageTone}
          helper={getCoverageAdvice(stats!.coveragePercent)}
        />
        <MetricCard
          label="Cảm xúc chủ đạo"
          value={formatEmotion(stats!.dominantEmotion)}
          tone="neutral"
          helper={
            stats!.emotionCounts[stats!.dominantEmotion] > 0
              ? `Xuất hiện trong ${stats!.emotionCounts[stats!.dominantEmotion]}/${stats!.totalTrades} giao dịch gần nhất.`
              : "Chưa ghi nhận cảm xúc rõ rệt."
          }
        />
        <MetricCard
          label="Phí & Thuế bào mòn"
          value={formatPercent(stats!.dragPercentage)}
          tone={dragTone}
          helper={
            stats!.totalFees > 0
              ? `Đã mất ${formatPoints(stats!.totalFees)} cho thuế & phí. Tần suất trading cao sẽ bào mòn lãi kép dài hạn.`
              : "Chưa mất điểm ảo phí giao dịch nào."
          }
        />
        <MetricCard
          label="Số lỗi hành vi"
          value={`${stats!.totalMistakes} lỗi`}
          tone={stats!.totalMistakes > 0 ? "danger" : "positive"}
          helper={
            stats!.totalMistakes > 0
              ? `Phát hiện ${stats!.sortedMistakes.length} nhóm thiên kiến cần khắc phục.`
              : "Tuyệt vời! Bạn đang duy trì kỷ luật rất tốt, chưa mắc lỗi nghiêm trọng nào."
          }
        />
      </div>

      {stats!.dragPercentage >= 0.5 && (
        <div className="rounded-md border border-[#ead99e] bg-[#fff9e6] p-4 text-sm text-[#7a4d00] flex items-start gap-3">
          <Coins className="h-5 w-5 text-[#ea580c] shrink-0 mt-0.5" />
          <div>
            <strong>Cảnh báo Hao hụt (Drag Alert):</strong> Tỷ lệ phí & thuế đã bào mòn của bạn đạt mức{" "}
            <strong>{formatPercent(stats!.dragPercentage)}</strong>. Hãy chạy thử công cụ{" "}
            <Link href="/app/tools" className="font-bold text-[#0f766e] underline">
              Hao hụt do Giao dịch ngắn hạn (Overtrading)
            </Link>{" "}
            để mô phỏng trực quan lượng tiền khổng lồ bạn sẽ cống hiến cho các bên trung gian nếu tiếp tục quay vòng vốn ở tần suất này!
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 2. Top Cognitive Biases / Mistakes */}
        <section className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
          <h3 className="text-lg font-bold text-[#17201b]">Tần suất lỗi hành vi</h3>
          <p className="mt-1 text-xs text-[#5b6861]">
            Tỷ lệ các loại sai lầm tâm lý bạn đã tự đánh dấu trong các phần tự phản tư.
          </p>

          <div className="mt-6 grid gap-4">
            {stats!.sortedMistakes.map((item) => (
              <div key={item.type} className="grid gap-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-[#314039]">
                    {formatMistakeType(item.type)}
                  </span>
                  <span className="text-[#5b6861]">
                    {item.count} lần ({item.percentage}%)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#f0f2ee] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#9a3412]"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}

            {stats!.totalMistakes === 0 && (
              <div className="py-6 text-center text-sm text-[#5b6861]">
                {stats!.goodDisciplineCount > 0
                  ? "Tất cả các giao dịch đã ghi nhận đều đạt trạng thái 'Kỷ luật tốt'. Hãy tiếp tục duy trì!"
                  : "Hãy ghi nhật ký và đánh giá lỗi để hệ thống thống kê biểu đồ này."}
              </div>
            )}
          </div>
        </section>

        {/* 3. Emotion vs. Would Repeat Correlation */}
        <section className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
          <h3 className="text-lg font-bold text-[#17201b]">Phân tích cảm xúc & Nuối tiếc</h3>
          <p className="mt-1 text-xs text-[#5b6861]">
            Tỷ lệ quyết định hối hận (ước gì không làm lại) tương ứng với từng trạng thái cảm xúc khi đặt lệnh.
          </p>

          <div className="mt-6 grid gap-4">
            {stats!.emotionRegretRates.map((item) => {
              const rateColor = item.rate >= 60 ? "text-[#9a3412]" : item.rate >= 30 ? "text-[#7a4d00]" : "text-[#166534]";
              return (
                <div key={item.emotion} className="flex items-center justify-between border-b border-[#f0f2ee] pb-3 last:border-0 last:pb-0">
                  <div>
                    <span className="font-semibold text-[#17201b]">
                      Khi cảm thấy: {formatEmotion(item.emotion)}
                    </span>
                    <p className="text-xs text-[#5b6861] mt-0.5">
                      Có {item.total} giao dịch đã xem lại, hối hận {item.regret} lần.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-lg font-bold ${rateColor}`}>
                      {item.rate}%
                    </span>
                    <p className="text-[10px] text-[#8c9c91]">Tỷ lệ hối hận</p>
                  </div>
                </div>
              );
            })}

            {stats!.emotionRegretRates.length === 0 && (
              <div className="py-6 text-center text-sm text-[#5b6861]">
                Chưa có đủ dữ liệu phản tư về quyết định làm lại (Would Repeat) để tính toán.
              </div>
            )}

            {stats!.emotionRegretRates.length > 0 && stats!.emotionRegretRates[0].rate >= 50 && (
              <div className="mt-2 rounded-md border border-[#f1bea8] bg-[#fff0e8] p-3 text-xs text-[#9a3412] leading-5">
                ⚠️ <strong>Cảnh báo hành vi:</strong> Trạng thái hưng phấn hoặc tiêu cực cực đoan (như{" "}
                <strong>{formatEmotion(stats!.emotionRegretRates[0].emotion)}</strong>) đang có tỷ suất nuối tiếc cao nhất. Bạn nên đặt ra quy tắc <em>&quot;Đợi 15 phút&quot;</em> trước khi nhấn nút giao dịch ở các trạng thái này.
              </div>
            )}
          </div>
        </section>
      </div>

      {/* 4. Baseline Psychological Profile & Actual Trade Correlation */}
      {savedProfile ? (
        <section className="rounded-md border border-[#e0e5dc] bg-white p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#e0e5dc] pb-4">
            <div>
              <Badge tone="green" className="mb-1">BASELINE PROFILE</Badge>
              <h3 className="text-xl font-bold text-[#17201b]">{savedProfile.title}</h3>
              <p className="mt-1 text-xs text-[#5b6861]">
                Tự đánh giá ngày {new Date(savedProfile.takenAt).toLocaleDateString("vi-VN")}
              </p>
            </div>
            <button
              onClick={handleResetQuiz}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#5b6861] hover:text-[#0f766e]"
            >
              <RefreshCw className="h-3 w-3" /> Làm lại khảo sát tâm lý
            </button>
          </div>

          <p className="mt-4 text-sm leading-6 text-[#4c5d54]">{savedProfile.description}</p>

          <div className="mt-4 grid gap-2">
            <h4 className="text-sm font-bold text-[#17201b]">Quy tắc kỷ luật khuyên dùng:</h4>
            {savedProfile.rules.map((rule: string, idx: number) => (
              <div key={idx} className="rounded-md border border-[#f1bea8] bg-[#fff0e8] p-3 text-sm text-[#9a3412] leading-5 font-mono">
                📌 {rule}
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-[#e0e5dc] pt-6">
            <h4 className="text-sm font-bold text-[#17201b] flex items-center gap-1">
              🔍 Đối chiếu thực tế giao dịch:
            </h4>
            <div className="mt-3 p-4 rounded-md border border-[#b9d9c5] bg-[#f2fbf4] text-sm text-[#314039] leading-6 font-medium">
              {(() => {
                if (!stats) {
                  return "Tất cả các giao dịch đã ghi nhận đều đạt trạng thái kỷ luật tốt. Bạn đang giữ thăng bằng rất xuất sắc giữa tư duy lý thuyết và thực tiễn đặt lệnh!";
                }

                const primaryMistake = stats.sortedMistakes?.[0]?.type;
                if (!primaryMistake) {
                  return "Tất cả các giao dịch đã ghi nhận đều đạt trạng thái kỷ luật tốt. Bạn đang giữ thăng bằng rất xuất sắc giữa tư duy lý thuyết và thực tiễn đặt lệnh!";
                }

                if (primaryMistake === "FOMO" && savedProfile.key === "fomo") {
                  return "⚠️ Đồng nhất hành vi: Hồ sơ tự trắc nghiệm và lịch sử giao dịch thực tế của bạn đều khẳng định bạn dễ bị FOMO kéo đi. Đây là điểm yếu chí tử nhất cần triệt để kiểm soát bằng Quy tắc Đợi 15 phút.";
                }
                
                if ((primaryMistake === "Panic selling" || primaryMistake === "Ignoring risk") && savedProfile.key === "riskNeglect") {
                  return "⚠️ Đồng nhất hành vi: Bạn tự nhận định mình liều lĩnh và lịch sử đặt lệnh thực tế cũng phản ánh bạn thường ngó lơ các cảnh báo rủi ro. Hãy kiên quyết đặt ngưỡng dừng lỗ và kiểm định Biên an toàn.";
                }

                if (primaryMistake === "Over-concentration" && savedProfile.key === "overconfidence") {
                  return "⚠️ Đồng nhất hành vi: Bạn tự đánh giá mình dễ quá tự tin và các giao dịch thực tế chứng minh bạn bỏ trứng vào một giỏ khi thắng lớn. Hãy duy trì tỷ trọng tối đa 20% danh mục ảo cho mỗi mã.";
                }

                if (savedProfile.key === "rational") {
                  return `⚠️ Mâu thuẫn hành vi: Trắc nghiệm lý thuyết đánh giá bạn là Nhà đầu tư Lý trí, nhưng lịch sử đặt lệnh thực tế lại xuất hiện sai lầm ${formatMistakeType(primaryMistake)} (${stats.sortedMistakes[0].count} lần). Đây là ví dụ chân thực nhất chứng minh tâm lý khi tiền ảo chạy khó kiểm soát hơn nhiều so với suy nghĩ lý thuyết!`;
                }

                return `💡 Sai lệch hành vi: Khảo sát xếp bạn vào nhóm ${savedProfile.title}, nhưng sai lầm thực tế xuất hiện nhiều nhất của bạn lại là ${formatMistakeType(primaryMistake)}. Sự khác biệt này cho thấy các điểm mù tâm lý mới đang phát sinh khi bạn trực tiếp đặt lệnh mua/bán ảo.`;
              })()}
            </div>
          </div>
        </section>
      ) : (
        <section className="rounded-md border border-[#e0e5dc] bg-[#fffdf8] p-6 shadow-sm mt-2 text-center">
          <h3 className="text-lg font-bold text-[#17201b] flex items-center justify-center gap-1"><Brain className="h-5 w-5 text-[#0f766e]" /> Đối chiếu phong cách Lý thuyết vs. Thực tế</h3>
          <p className="mt-2 text-sm text-[#5b6861] max-w-md mx-auto leading-relaxed">
            Làm bài trắc nghiệm tâm lý nền tảng để xem phong cách lý thuyết của bạn khác biệt thế nào với lịch sử giao dịch thực tế của mình.
          </p>
          <div className="mt-4">
            <button
              onClick={handleStartQuiz}
              className="inline-flex min-h-10 items-center justify-center rounded-md bg-[#0f766e] px-5 text-sm font-semibold text-white hover:bg-[#115e59]"
            >
              Làm trắc nghiệm ngay (6 câu)
            </button>
          </div>
        </section>
      )}

      {/* 5. Action Plan / Learning Recommendations */}
      <section className="rounded-md border border-[#e0e5dc] bg-white p-6 shadow-sm">
        <h3 className="text-xl font-bold text-[#17201b]">Lộ trình sửa sai & Bài học đề xuất</h3>
        <p className="mt-1 text-sm text-[#5b6861]">
          Dựa trên lỗi hành vi thường gặp nhất trong thực tế giao dịch của bạn, chúng tôi đề xuất các bài học thực tế từ thư viện kiến thức để giúp bạn xây dựng nền tảng vững vàng hơn.
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {recommendedModules.map(({ rec, pillar, module: mod, url }) => {
            if (!pillar || !mod) return null;
            return (
              <div
                key={mod.title}
                className="flex flex-col justify-between rounded-lg border border-[#e8ece6] bg-[#fcfdfe] p-5 hover:border-[#b9d9c5]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <Badge tone="blue">{pillar.title}</Badge>
                    <span className="text-xs text-[#8c9c91]">
                      Ước tính: {pillar.estimatedHours}h học
                    </span>
                  </div>
                  <h4 className="mt-3 text-base font-bold text-[#17201b]">{mod.title}</h4>
                  <p className="mt-2 text-sm text-[#4c5d54] italic leading-relaxed">
                    &ldquo;{mod.goal}&rdquo;
                  </p>
                  <p className="mt-3 text-sm text-[#5b6861] leading-relaxed">
                    💡 <strong>Lý do đề xuất:</strong> {rec.reason}
                  </p>
                  <div className="mt-3 rounded bg-[#f0f2ee] p-3 text-xs text-[#314039]">
                    🛠️ <strong>Thực hành:</strong> {mod.practice}
                  </div>
                </div>

                <div className="mt-5 pt-2 border-t border-[#f0f2ee]">
                  <Link
                    href={url}
                    className="inline-flex min-h-10 w-full items-center justify-center rounded-md bg-[#0f766e] px-4 text-sm font-semibold text-white hover:bg-[#115e59]"
                  >
                    Học Bài Này Ngay
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

