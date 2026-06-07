import type { KnowledgeModule, KnowledgePillar } from "@/data/knowledge-library";

export type KnowledgeLessonSection = {
  title: string;
  body: string;
  bullets: string[];
};

export type KnowledgeQuickCheckQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type KnowledgeLesson = {
  bigIdea: string;
  mentalModel: string;
  sections: KnowledgeLessonSection[];
  checklist: string[];
  quickChecks: KnowledgeQuickCheckQuestion[];
};

const pillarContext: Record<string, string> = {
  "tai-chinh-ca-nhan":
    "mọi quyết định đầu tư đều bắt đầu từ dòng tiền cá nhân, quỹ dự phòng và khả năng chịu rủi ro thật",
  "lai-suat-va-ngan-hang":
    "lãi suất là tín hiệu về chi phí vốn, thanh khoản và hành vi của người gửi tiền lẫn ngân hàng",
  "chung-khoan-nhap-mon":
    "thị trường không chỉ là bảng giá, mà là nơi quyền sở hữu, kỳ vọng và thanh khoản gặp nhau",
  "bao-cao-tai-chinh":
    "báo cáo tài chính giúp chuyển câu chuyện doanh nghiệp thành số liệu có thể kiểm chứng",
  "dinh-gia-co-ban":
    "định giá là so sánh giữa giá phải trả, chất lượng tài sản, lợi nhuận kỳ vọng và rủi ro sai",
  "phan-tich-nganh":
    "doanh nghiệp hiếm khi mạnh một mình; ngành, chu kỳ và lợi thế cạnh tranh quyết định độ bền lợi nhuận",
  "xay-dung-danh-muc":
    "danh mục tốt biến nhiều ý tưởng riêng lẻ thành một hệ thống có tỷ trọng và giới hạn rủi ro",
  "quan-tri-rui-ro":
    "rủi ro cần được viết ra trước khi hành động, vì sau khi giá biến động cảm xúc thường nói quá to",
  "tam-ly-dau-tu":
    "kỷ luật đầu tư bắt đầu từ việc nhìn thấy cảm xúc của mình trước khi biến nó thành lệnh mua bán",
  "du-lieu-thi-truong":
    "dữ liệu thị trường là nguyên liệu để đặt câu hỏi, không phải mệnh lệnh để mua bán",
  "vi-mo-va-chu-ky":
    "vĩ mô hữu ích khi giúp hiểu bối cảnh, nhưng nguy hiểm nếu bị dùng như lời giải thích cho mọi thứ",
  "chien-luoc-va-nhat-ky":
    "học đầu tư là một vòng lặp: viết luận điểm, hành động nhỏ, theo dõi, phản tư rồi sửa quy trình",
};

function getContext(pillar: KnowledgePillar) {
  return pillarContext[pillar.slug] ?? "kiến thức chỉ hữu ích khi biến thành câu hỏi và hành động có thể kiểm chứng";
}

function getPrimaryTopic(knowledgeModule: KnowledgeModule) {
  return knowledgeModule.topics[0] ?? knowledgeModule.title;
}

function getSecondaryTopic(knowledgeModule: KnowledgeModule) {
  return knowledgeModule.topics[1] ?? knowledgeModule.topics[0] ?? knowledgeModule.title;
}

function getLastTopic(knowledgeModule: KnowledgeModule) {
  return knowledgeModule.topics.at(-1) ?? knowledgeModule.title;
}

export function buildKnowledgeLesson(
  pillar: KnowledgePillar,
  knowledgeModule: KnowledgeModule,
): KnowledgeLesson {
  const context = getContext(pillar);
  const primaryTopic = getPrimaryTopic(knowledgeModule);
  const secondaryTopic = getSecondaryTopic(knowledgeModule);
  const lastTopic = getLastTopic(knowledgeModule);

  return {
    bigIdea: `${knowledgeModule.title} không phải là một thuật ngữ để nhớ, mà là một công cụ để ra quyết định rõ hơn. Trong trụ cột ${pillar.title}, module này giúp bạn hiểu vì sao ${context}.`,
    mentalModel: `Luôn đi theo 3 bước: định nghĩa ${primaryTopic} bằng lời của mình, nối nó với một dấu hiệu quan sát được, rồi viết điều kiện khiến kết luận ban đầu sai.`,
    sections: [
      {
        title: "1. Hiểu đúng trước khi dùng",
        body: `Mục tiêu của module là: ${knowledgeModule.goal} Nếu chưa thể giải thích lại trong một câu ngắn, bạn chưa nên dùng nó làm lý do mua, bán hoặc tăng tỷ trọng.`,
        bullets: [
          `Viết lại ${primaryTopic} bằng ngôn ngữ đời thường.`,
          `Tách khái niệm khỏi cảm xúc: điều gì là dữ liệu, điều gì chỉ là cảm giác?`,
          `Tìm một ví dụ trong tiền cá nhân, doanh nghiệp hoặc danh mục ảo của bạn.`,
        ],
      },
      {
        title: "2. Nối với dữ liệu",
        body: `Một khái niệm chỉ có giá trị khi nó giúp bạn đọc dữ liệu tốt hơn. Với module này, hãy xem ${secondaryTopic} như một tín hiệu cần kiểm chứng, không phải câu trả lời cuối cùng.`,
        bullets: [
          "Tìm con số, sự kiện hoặc hành vi có thể quan sát được.",
          "So sánh ít nhất hai trường hợp thay vì nhìn một ví dụ đơn lẻ.",
          "Ghi lại nguồn dữ liệu và giới hạn của nguồn đó.",
        ],
      },
      {
        title: "3. Biến thành quy tắc hành động",
        body: `Sau khi hiểu khái niệm, việc quan trọng là chuyển nó thành một quy tắc nhỏ. Quy tắc tốt phải đủ cụ thể để bạn biết khi nào làm, khi nào dừng và khi nào xem lại.`,
        bullets: [
          `Nếu ${lastTopic} thay đổi, mình cần kiểm tra điều gì trước?`,
          "Nếu kết luận sai, dấu hiệu nào sẽ xuất hiện?",
          "Hành động nhỏ nhất trong mô phỏng để kiểm tra hiểu biết này là gì?",
        ],
      },
    ],
    checklist: [
      `Tôi giải thích được ${primaryTopic} mà không cần nhìn ghi chú.`,
      `Tôi biết ${secondaryTopic} liên quan thế nào tới quyết định mô phỏng.`,
      "Tôi có ít nhất một dữ liệu hoặc dấu hiệu để kiểm chứng.",
      "Tôi đã viết điều kiện khiến kết luận của mình sai.",
      `Tôi hoàn thành bài thực hành: ${knowledgeModule.practice}`,
    ],
    quickChecks: [
      {
        question: `Khi học "${knowledgeModule.title}", điều nên làm đầu tiên là gì?`,
        options: [
          `Định nghĩa ${primaryTopic} bằng lời của mình`,
          "Vội mua mã đang tăng mạnh nhất",
          "Chỉ nhớ tên thuật ngữ",
        ],
        correctIndex: 0,
        explanation: "Nếu chưa định nghĩa rõ, mọi dữ liệu sau đó rất dễ bị diễn giải theo cảm xúc.",
      },
      {
        question: `Vì sao cần nối "${knowledgeModule.title}" với dữ liệu hoặc hành vi quan sát được?`,
        options: [
          "Để biến bài học thành tín hiệu có thể kiểm chứng",
          "Để chắc chắn mọi kết luận đều đúng",
          "Để bỏ qua rủi ro vì đã có số liệu",
        ],
        correctIndex: 0,
        explanation: "Dữ liệu giúp kiểm chứng, nhưng không thay thế việc đặt câu hỏi và nhìn rủi ro.",
      },
      {
        question: "Một kết luận học tập tốt nên có thêm phần nào?",
        options: [
          "Điều kiện làm kết luận đó sai",
          "Một câu khẳng định chắc chắn tuyệt đối",
          "Một cảm xúc đủ mạnh để hành động ngay",
        ],
        correctIndex: 0,
        explanation: "Điều kiện sai giúp bạn tránh cố chấp khi dữ liệu mới đi ngược giả thuyết ban đầu.",
      },
    ],
  };
}
