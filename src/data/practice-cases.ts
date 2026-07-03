export type PracticeCaseDifficulty = "foundation" | "intermediate" | "advanced";

export type PracticeCaseOption = {
  label: string;
  score: number;
  feedback: string;
};

export type PracticeCaseCheckpoint = {
  title: string;
  situation: string;
  question: string;
  options: PracticeCaseOption[];
};

export type PracticeCase = {
  slug: string;
  title: string;
  summary: string;
  theme: string;
  difficulty: PracticeCaseDifficulty;
  duration: number;
  learnerRole: string;
  objectives: string[];
  startingFacts: string[];
  checkpoints: PracticeCaseCheckpoint[];
  debrief: {
    strongApproach: string;
    warningSigns: string[];
    reflectionQuestions: string[];
  };
  knowledgeLinks: Array<{
    title: string;
    href: string;
  }>;
};

export const practiceCaseDifficultyLabels: Record<PracticeCaseDifficulty, string> = {
  foundation: "Nền tảng",
  intermediate: "Trung cấp",
  advanced: "Nâng cao",
};

export const practiceCases: PracticeCase[] = [
  {
    slug: "chia-tien-thuong-cuoi-nam",
    title: "Chia khoản thưởng cuối năm",
    summary:
      "Bạn nhận một khoản thưởng 60 triệu đồng trong khi quỹ dự phòng còn mỏng, có dư nợ thẻ và đang muốn bắt đầu đầu tư.",
    theme: "Tài chính cá nhân",
    difficulty: "foundation",
    duration: 12,
    learnerRole: "Người quản lý dòng tiền của chính mình",
    objectives: [
      "Phân biệt tiền cần an toàn với tiền có thể chịu biến động.",
      "Ưu tiên nghĩa vụ có chi phí cao trước cơ hội sinh lời chưa chắc chắn.",
      "Biến mục tiêu chung thành một kế hoạch phân bổ cụ thể.",
    ],
    startingFacts: [
      "Thu nhập ròng hàng tháng: 24 triệu đồng.",
      "Chi phí thiết yếu: 16 triệu đồng mỗi tháng.",
      "Quỹ dự phòng hiện có: 20 triệu đồng.",
      "Dư nợ thẻ tín dụng: 12 triệu đồng, đang chịu lãi nếu không thanh toán đủ.",
      "Khoản thưởng vừa nhận: 60 triệu đồng.",
    ],
    checkpoints: [
      {
        title: "Vòng 1: xác định thứ tự ưu tiên",
        situation:
          "Thị trường đang tăng và bạn bè liên tục chia sẻ các khoản lãi ngắn hạn. Bạn sợ bỏ lỡ cơ hội nếu không giải ngân ngay.",
        question: "Bạn nên làm gì trước tiên với khoản thưởng?",
        options: [
          {
            label: "Trả hết dư nợ thẻ, sau đó bổ sung quỹ dự phòng",
            score: 3,
            feedback:
              "Hợp lý. Lãi thẻ là chi phí chắc chắn và thường cao, trong khi lợi nhuận đầu tư chỉ là kỳ vọng. Xử lý nghĩa vụ này giúp dòng tiền khỏe hơn.",
          },
          {
            label: "Đầu tư toàn bộ vì thị trường đang có xu hướng tăng",
            score: 0,
            feedback:
              "Rủi ro cao. Bạn đang dùng tiền cần bảo vệ để chạy theo biến động ngắn hạn, trong khi vẫn còn một nghĩa vụ có chi phí chắc chắn.",
          },
          {
            label: "Giữ toàn bộ trong tài khoản thanh toán để chờ",
            score: 1,
            feedback:
              "An toàn hơn việc giải ngân vội, nhưng chưa xử lý dư nợ lãi cao và chưa đặt tiền vào các mục tiêu rõ ràng.",
          },
        ],
      },
      {
        title: "Vòng 2: đặt mức quỹ dự phòng",
        situation:
          "Sau khi trả 12 triệu đồng dư nợ thẻ, bạn còn 48 triệu đồng tiền thưởng. Công việc hiện ổn định nhưng ngành của bạn có tính chu kỳ.",
        question: "Mức quỹ dự phòng nào phù hợp hơn với dữ kiện hiện tại?",
        options: [
          {
            label: "Nâng quỹ lên khoảng 3-4 tháng chi phí thiết yếu",
            score: 3,
            feedback:
              "Cân bằng. Khoảng 48-64 triệu đồng tạo vùng đệm đủ hữu ích mà vẫn cho phép bạn bắt đầu đầu tư từng bước.",
          },
          {
            label: "Giữ nguyên 20 triệu vì tháng nào cũng có lương",
            score: 0,
            feedback:
              "Quá mỏng. Quỹ hiện tại chỉ hơn một tháng chi phí thiết yếu và không phản ánh rủi ro mất thu nhập trong ngành có tính chu kỳ.",
          },
          {
            label: "Tích đủ 12 tháng chi phí trước khi làm bất cứ điều gì",
            score: 1,
            feedback:
              "Rất thận trọng nhưng có thể quá mức với dữ kiện hiện tại. Mục tiêu nên phản ánh độ ổn định công việc, người phụ thuộc và khả năng phục hồi thu nhập.",
          },
        ],
      },
      {
        title: "Vòng 3: bắt đầu đầu tư",
        situation:
          "Sau khi củng cố quỹ dự phòng, bạn còn 20 triệu đồng có thể dùng cho mục tiêu dài hạn và chưa từng tự quản lý danh mục.",
        question: "Cách khởi đầu nào giúp bạn học mà vẫn kiểm soát rủi ro?",
        options: [
          {
            label: "Chia thành nhiều lần giải ngân, viết mục tiêu và giới hạn rủi ro",
            score: 3,
            feedback:
              "Tốt. Cách này giảm áp lực chọn đúng một thời điểm và buộc bạn hình thành quy trình trước khi tăng quy mô.",
          },
          {
            label: "Mua một mã đang được nhắc nhiều để có động lực theo dõi",
            score: 0,
            feedback:
              "Động lực không thay thế được luận điểm. Một mã nóng có thể khiến bài học đầu tiên của bạn bị chi phối bởi FOMO.",
          },
          {
            label: "Không đầu tư thật, luyện danh mục ảo trước rồi mới giải ngân nhỏ",
            score: 2,
            feedback:
              "Rất phù hợp với người mới. Điểm còn thiếu là một mốc thời gian và tiêu chí rõ ràng để chuyển từ luyện tập sang quy mô nhỏ.",
          },
        ],
      },
    ],
    debrief: {
      strongApproach:
        "Một kế hoạch tốt đi theo thứ tự: loại bỏ chi phí tài chính cao, tạo vùng đệm thanh khoản, sau đó mới dùng phần tiền dài hạn để học đầu tư theo từng bước nhỏ.",
      warningSigns: [
        "Dùng tiền dự phòng để mua tài sản biến động.",
        "So lợi nhuận kỳ vọng với chi phí nợ như thể cả hai đều chắc chắn.",
        "Không viết mục tiêu thời gian cho từng phần tiền.",
      ],
      reflectionQuestions: [
        "Nếu thu nhập dừng trong ba tháng, kế hoạch của bạn có còn đứng vững?",
        "Khoản tiền nào tuyệt đối không nên chịu biến động giá?",
        "Điều kiện nào cho phép bạn tăng quy mô đầu tư sau giai đoạn luyện tập?",
      ],
    },
    knowledgeLinks: [
      {
        title: "Quỹ dự phòng và mục tiêu tiền",
        href: "/knowledge/tai-chinh-ca-nhan/quy-du-phong-va-muc-tieu-tien",
      },
      {
        title: "Nợ cá nhân và đòn bẩy",
        href: "/knowledge/tai-chinh-ca-nhan/no-ca-nhan-va-don-bay",
      },
    ],
  },
  {
    slug: "lai-suat-cao-nhat-co-tot-nhat",
    title: "Lãi suất cao nhất có phải tốt nhất?",
    summary:
      "Bạn có 300 triệu đồng cần dùng sau 9 tháng và đang so sánh ba lựa chọn tiền gửi có mức lãi, kỳ hạn và điều kiện rất khác nhau.",
    theme: "Lãi suất và ngân hàng",
    difficulty: "foundation",
    duration: 10,
    learnerRole: "Người gửi tiền đang bảo vệ một mục tiêu ngắn hạn",
    objectives: [
      "Đọc lãi suất cùng kỳ hạn và điều kiện đi kèm.",
      "Đánh giá rủi ro rút trước hạn.",
      "Thiết kế thang kỳ hạn theo nhu cầu sử dụng tiền.",
    ],
    startingFacts: [
      "Bạn cần chắc chắn có đủ 300 triệu đồng sau 9 tháng để thanh toán học phí.",
      "Ngân hàng A: 5,2%/năm cho kỳ hạn 6 tháng.",
      "Ngân hàng B: 5,8%/năm cho kỳ hạn 12 tháng, rút trước hạn hưởng lãi rất thấp.",
      "Ngân hàng C: 5,5%/năm cho kỳ hạn 9 tháng, chỉ áp dụng gửi online.",
      "Bạn có thể cần 40 triệu đồng bất ngờ trong thời gian gửi.",
    ],
    checkpoints: [
      {
        title: "Vòng 1: so sánh đúng biến",
        situation:
          "Quảng cáo của ngân hàng B nhấn mạnh đây là mức lãi cao nhất trong ba lựa chọn.",
        question: "Thông tin nào quan trọng nhất trước khi chọn?",
        options: [
          {
            label: "Kỳ hạn có khớp ngày cần tiền và điều kiện rút trước hạn",
            score: 3,
            feedback:
              "Đúng. Lãi suất danh nghĩa chỉ hữu ích khi sản phẩm khớp thời gian và nhu cầu thanh khoản của bạn.",
          },
          {
            label: "Chỉ cần chọn mức 5,8% vì chênh lệch sẽ tạo lợi nhuận cao hơn",
            score: 0,
            feedback:
              "Chưa đủ. Kỳ hạn 12 tháng không khớp mục tiêu 9 tháng và rút sớm có thể làm mất phần lớn tiền lãi.",
          },
          {
            label: "Chọn ngân hàng có thương hiệu quen thuộc nhất",
            score: 1,
            feedback:
              "Uy tín là một yếu tố, nhưng quyết định vẫn cần so kỳ hạn, thanh khoản, điều kiện và mức bảo vệ phù hợp.",
          },
        ],
      },
      {
        title: "Vòng 2: quản lý nhu cầu bất ngờ",
        situation:
          "Bạn xác định có khả năng cần 40 triệu đồng trong vài tháng tới nhưng không biết chính xác thời điểm.",
        question: "Cách phân bổ nào hợp lý hơn?",
        options: [
          {
            label: "Tách 40 triệu ở kênh thanh khoản, phần còn lại gửi khớp kỳ hạn 9 tháng",
            score: 3,
            feedback:
              "Hợp lý. Bạn đang mua sự linh hoạt cho phần tiền có thể cần sớm và tối ưu kỳ hạn cho phần còn lại.",
          },
          {
            label: "Gửi toàn bộ 12 tháng rồi vay nếu cần tiền",
            score: 0,
            feedback:
              "Bạn có thể phải trả lãi vay cao hơn nhiều phần lãi tiền gửi tăng thêm. Đây là đánh đổi kém hiệu quả.",
          },
          {
            label: "Để toàn bộ tiền không kỳ hạn",
            score: 1,
            feedback:
              "Thanh khoản tốt nhưng hy sinh lãi cho cả phần tiền chắc chắn chưa cần dùng. Có thể tách tiền thành các vai trò khác nhau.",
          },
        ],
      },
      {
        title: "Vòng 3: xử lý lãi suất thay đổi",
        situation:
          "Một tuần sau, ngân hàng A tăng lãi kỳ hạn 6 tháng thêm 0,3 điểm phần trăm.",
        question: "Bạn có nên đổi toàn bộ kế hoạch?",
        options: [
          {
            label: "Tính lại số tiền lãi thực nhận và xem kế hoạch kỳ hạn còn khớp không",
            score: 3,
            feedback:
              "Đúng. Mức thay đổi cần được quy đổi thành tiền và đặt trong bối cảnh ngày đáo hạn, thay vì phản ứng với tiêu đề.",
          },
          {
            label: "Đổi ngay vì lãi suất vừa tăng",
            score: 0,
            feedback:
              "Quá nhanh. Kỳ hạn 6 tháng khiến tiền đáo hạn sớm hơn mục tiêu và bạn còn đối mặt rủi ro tái đầu tư ba tháng cuối.",
          },
          {
            label: "Bỏ qua mọi thay đổi vì đã có kế hoạch",
            score: 1,
            feedback:
              "Kỷ luật không có nghĩa là cứng nhắc. Nên xem lại khi dữ kiện thay đổi, nhưng chỉ đổi nếu lợi ích đủ lớn và mục tiêu vẫn được bảo vệ.",
          },
        ],
      },
    ],
    debrief: {
      strongApproach:
        "Lãi suất tốt nhất là mức lãi phù hợp nhất với ngày cần tiền, khả năng rút sớm và mức linh hoạt bạn thực sự cần. Con số cao nhất chưa chắc tạo kết quả tốt nhất.",
      warningSigns: [
        "So lãi suất mà không quy đổi thành tiền thực nhận.",
        "Bỏ qua điều kiện rút trước hạn.",
        "Khóa toàn bộ tiền dù đã biết có nhu cầu thanh khoản.",
      ],
      reflectionQuestions: [
        "Bạn đang tối ưu lãi suất hay đang bảo vệ một mục tiêu?",
        "Chi phí của việc thiếu tiền đúng thời điểm là bao nhiêu?",
        "Có thể chia tiền thành mấy kỳ hạn để giảm rủi ro tái đầu tư?",
      ],
    },
    knowledgeLinks: [
      {
        title: "Đọc bảng lãi suất tiết kiệm",
        href: "/knowledge/lai-suat-va-ngan-hang/doc-bang-lai-suat-tiet-kiem",
      },
      {
        title: "Sản phẩm ngân hàng cá nhân",
        href: "/knowledge/lai-suat-va-ngan-hang/san-pham-ngan-hang-ca-nhan",
      },
    ],
  },
  {
    slug: "loi-nhuan-tang-tien-mat-giam",
    title: "Lợi nhuận tăng nhưng tiền mặt giảm",
    summary:
      "Một doanh nghiệp báo lợi nhuận tăng 32%, nhưng phải thu và tồn kho cùng tăng mạnh trong khi dòng tiền kinh doanh chuyển âm.",
    theme: "Báo cáo tài chính",
    difficulty: "intermediate",
    duration: 16,
    learnerRole: "Nhà phân tích đang kiểm tra chất lượng lợi nhuận",
    objectives: [
      "Không dừng ở tốc độ tăng lợi nhuận.",
      "Nối kết quả kinh doanh với bảng cân đối và dòng tiền.",
      "Viết điều kiện cần theo dõi ở kỳ báo cáo tiếp theo.",
    ],
    startingFacts: [
      "Doanh thu tăng 24%, lợi nhuận sau thuế tăng 32%.",
      "Phải thu khách hàng tăng 58%.",
      "Hàng tồn kho tăng 41%.",
      "Dòng tiền kinh doanh từ dương 420 tỷ chuyển thành âm 180 tỷ đồng.",
      "Ban lãnh đạo giải thích doanh nghiệp đang chuẩn bị cho giai đoạn tăng trưởng mới.",
    ],
    checkpoints: [
      {
        title: "Vòng 1: đọc tiêu đề lợi nhuận",
        situation:
          "Giá cổ phiếu tăng mạnh sau khi kết quả kinh doanh được công bố. Nhiều bài viết chỉ nhấn vào mức tăng lợi nhuận 32%.",
        question: "Kết luận đầu tiên hợp lý nhất là gì?",
        options: [
          {
            label: "Kết quả tích cực nhưng cần kiểm tra chất lượng doanh thu và dòng tiền",
            score: 3,
            feedback:
              "Đúng. Lợi nhuận tăng là tín hiệu đáng chú ý, chưa phải bằng chứng đủ về sức khỏe tài chính.",
          },
          {
            label: "Doanh nghiệp chắc chắn bước vào chu kỳ tăng trưởng mạnh",
            score: 0,
            feedback:
              "Quá chắc chắn. Phải thu, tồn kho và dòng tiền đang tạo ra các câu hỏi chưa được giải đáp.",
          },
          {
            label: "Dòng tiền âm nghĩa là doanh nghiệp chắc chắn gian lận",
            score: 0,
            feedback:
              "Đây cũng là kết luận cực đoan. Dòng tiền âm có thể đến từ tăng trưởng, mùa vụ hoặc vấn đề chất lượng; cần phân tích tiếp.",
          },
        ],
      },
      {
        title: "Vòng 2: tìm nguyên nhân",
        situation:
          "Thuyết minh cho thấy doanh nghiệp mở rộng bán chịu để giành thị phần và tích trữ nguyên liệu trước mùa cao điểm.",
        question: "Dữ liệu nào cần ưu tiên theo dõi tiếp?",
        options: [
          {
            label: "Tuổi nợ phải thu, vòng quay tồn kho và dòng tiền kinh doanh",
            score: 3,
            feedback:
              "Chính xác. Ba dữ liệu này giúp phân biệt vốn lưu động phục vụ tăng trưởng với tiền bị mắc kẹt hoặc chất lượng doanh thu suy yếu.",
          },
          {
            label: "Chỉ theo dõi doanh thu quý sau",
            score: 1,
            feedback:
              "Doanh thu là cần thiết nhưng chưa đủ. Doanh thu tăng tiếp vẫn có thể đi cùng thu tiền kém và tồn kho cao.",
          },
          {
            label: "Theo dõi giá cổ phiếu để xem thị trường đánh giá thế nào",
            score: 0,
            feedback:
              "Giá cho biết kỳ vọng của thị trường, không trả lời trực tiếp tiền có được thu về hay hàng tồn có bán được hay không.",
          },
        ],
      },
      {
        title: "Vòng 3: đưa vào danh sách theo dõi",
        situation:
          "Bạn chưa đủ dữ kiện để kết luận xấu, nhưng mức định giá hiện tại đã phản ánh tăng trưởng cao.",
        question: "Quyết định mô phỏng nào có quy trình tốt hơn?",
        options: [
          {
            label: "Đưa vào watchlist, viết ba điều kiện xác nhận và chờ kỳ báo cáo sau",
            score: 3,
            feedback:
              "Tốt. Chưa hành động cũng là một quyết định khi bằng chứng chưa đủ và biên an toàn thấp.",
          },
          {
            label: "Mua ngay vì chờ thêm sẽ bỏ lỡ mức tăng",
            score: 0,
            feedback:
              "Đây là FOMO. Giá tăng không giải quyết được câu hỏi về chất lượng lợi nhuận.",
          },
          {
            label: "Loại vĩnh viễn khỏi danh sách vì dòng tiền âm một quý",
            score: 1,
            feedback:
              "Quá cứng nhắc. Một quý có thể bị ảnh hưởng bởi mùa vụ; điều quan trọng là đặt điều kiện xác nhận hoặc phủ định ở kỳ sau.",
          },
        ],
      },
    ],
    debrief: {
      strongApproach:
        "Phân tích tốt giữ đồng thời hai khả năng: doanh nghiệp có thể đang đầu tư vốn lưu động cho tăng trưởng, hoặc lợi nhuận đang đi trước tiền mặt quá xa. Kỳ sau phải giúp phân biệt hai kịch bản.",
      warningSigns: [
        "Phải thu tăng nhanh hơn doanh thu trong nhiều kỳ.",
        "Tồn kho tăng nhưng biên lợi nhuận và doanh số không cải thiện.",
        "Lợi nhuận tăng liên tục trong khi dòng tiền kinh doanh suy yếu kéo dài.",
      ],
      reflectionQuestions: [
        "Khoản tăng vốn lưu động nào có lý do kinh doanh thuyết phục nhất?",
        "Dữ kiện nào ở kỳ sau sẽ bác bỏ luận điểm tăng trưởng?",
        "Mức định giá hiện tại có cho phép bạn sai hay không?",
      ],
    },
    knowledgeLinks: [
      {
        title: "Chất lượng lợi nhuận",
        href: "/knowledge/bao-cao-tai-chinh/chat-luong-loi-nhuan",
      },
      {
        title: "Báo cáo lưu chuyển tiền tệ",
        href: "/knowledge/bao-cao-tai-chinh/bao-cao-luu-chuyen-tien-te",
      },
    ],
  },
  {
    slug: "co-phieu-thang-lon-vuot-ty-trong",
    title: "Cổ phiếu thắng lớn vượt tỷ trọng",
    summary:
      "Một khoản đầu tư tăng mạnh và chiếm 37% danh mục. Luận điểm vẫn đúng, nhưng rủi ro của cả danh mục đã thay đổi.",
    theme: "Danh mục và rủi ro",
    difficulty: "intermediate",
    duration: 14,
    learnerRole: "Người quản lý danh mục đang cân bằng niềm tin và khả năng chịu lỗ",
    objectives: [
      "Nhìn rủi ro ở cấp danh mục, không chỉ từng mã.",
      "Tách giá vốn khỏi quyết định hiện tại.",
      "Dùng kịch bản xấu để kiểm tra tỷ trọng.",
    ],
    startingFacts: [
      "Danh mục ban đầu có 7 mã, mỗi mã khoảng 10-18%.",
      "Mã ABC tăng 85% và hiện chiếm 37% danh mục.",
      "Không có thông tin cơ bản tiêu cực mới.",
      "Nếu ABC giảm 25%, toàn danh mục sẽ giảm khoảng 9,25% chỉ từ mã này.",
      "Mức giảm danh mục bạn chấp nhận trong một kịch bản xấu là 12%.",
    ],
    checkpoints: [
      {
        title: "Vòng 1: nhận diện vấn đề",
        situation:
          "Bạn rất tin doanh nghiệp và cảm thấy bán bớt một cổ phiếu đang thắng là đi ngược xu hướng.",
        question: "Vấn đề chính hiện tại là gì?",
        options: [
          {
            label: "Tỷ trọng đã làm thay đổi rủi ro tổng danh mục",
            score: 3,
            feedback:
              "Đúng. Luận điểm doanh nghiệp có thể chưa đổi nhưng mức thiệt hại tiềm năng đối với toàn danh mục đã tăng rõ rệt.",
          },
          {
            label: "Cổ phiếu tăng nhiều nên chắc chắn sắp giảm",
            score: 0,
            feedback:
              "Không có quy luật chắc chắn như vậy. Vấn đề là tỷ trọng và biên sai, không phải dự đoán đảo chiều chỉ từ mức tăng.",
          },
          {
            label: "Không có vấn đề vì đây là lợi nhuận chưa thực hiện",
            score: 0,
            feedback:
              "Giá vốn không bảo vệ danh mục khỏi mức giảm từ giá hiện tại. Rủi ro phải được đo trên giá trị đang nắm giữ hôm nay.",
          },
        ],
      },
      {
        title: "Vòng 2: kiểm tra bằng kịch bản",
        situation:
          "Bạn mô phỏng ba kịch bản: ABC giảm 15%, 25% và 40% trong khi các mã khác đi ngang.",
        question: "Cách dùng các kịch bản này tốt nhất là gì?",
        options: [
          {
            label: "So mức giảm danh mục với ngưỡng chịu đựng đã đặt trước",
            score: 3,
            feedback:
              "Chuẩn. Kịch bản giúp chuyển cảm giác lo ngại thành con số có thể so với giới hạn rủi ro.",
          },
          {
            label: "Chọn kịch bản mình tin có xác suất cao nhất rồi bỏ qua phần còn lại",
            score: 1,
            feedback:
              "Bạn có thể gán xác suất, nhưng vẫn cần biết danh mục chịu được kịch bản ít thuận lợi hơn tới đâu.",
          },
          {
            label: "Dùng giá mua ban đầu để tính vì đó là tiền thật đã bỏ ra",
            score: 0,
            feedback:
              "Sai điểm tham chiếu. Quyết định giữ hôm nay là quyết định tiếp tục phân bổ toàn bộ giá trị hiện tại vào mã đó.",
          },
        ],
      },
      {
        title: "Vòng 3: chọn hành động",
        situation:
          "Kịch bản giảm 40% khiến danh mục giảm gần 15%, vượt ngưỡng 12% mà bạn đã đặt.",
        question: "Hành động nào có kỷ luật hơn?",
        options: [
          {
            label: "Giảm một phần về tỷ trọng mục tiêu và ghi điều kiện mua lại",
            score: 3,
            feedback:
              "Hợp lý. Bạn không cần phủ định toàn bộ luận điểm để đưa rủi ro danh mục về vùng chấp nhận được.",
          },
          {
            label: "Giữ nguyên vì bán ra sẽ phải thừa nhận mình sợ hãi",
            score: 0,
            feedback:
              "Đây là cách đồng nhất quyết định quản trị rủi ro với cảm xúc. Tỷ trọng nên phục vụ mục tiêu danh mục, không phục vụ hình ảnh bản thân.",
          },
          {
            label: "Bán toàn bộ ngay để khóa lợi nhuận",
            score: 1,
            feedback:
              "Có thể quá cực đoan nếu luận điểm vẫn đúng. Tái cân bằng một phần thường phù hợp hơn khi vấn đề nằm ở tỷ trọng.",
          },
        ],
      },
    ],
    debrief: {
      strongApproach:
        "Một cổ phiếu tốt vẫn có thể trở thành vị thế quá lớn. Quản trị tỷ trọng không dự đoán giá ngày mai; nó giới hạn thiệt hại nếu điều bất ngờ xảy ra.",
      warningSigns: [
        "Dùng giá vốn để biện minh cho tỷ trọng hiện tại.",
        "Xem việc bán bớt như phủ định hoàn toàn luận điểm.",
        "Không biết một mã giảm mạnh sẽ kéo toàn danh mục xuống bao nhiêu.",
      ],
      reflectionQuestions: [
        "Nếu chưa sở hữu ABC, bạn có mua mới 37% danh mục ở giá hiện tại?",
        "Ngưỡng tỷ trọng tối đa nên phụ thuộc vào những yếu tố nào?",
        "Điều kiện nào khiến bạn tăng lại tỷ trọng sau khi tái cân bằng?",
      ],
    },
    knowledgeLinks: [
      {
        title: "Phân bổ tỷ trọng",
        href: "/knowledge/xay-dung-danh-muc/phan-bo-ty-trong",
      },
      {
        title: "Rủi ro tập trung",
        href: "/knowledge/quan-tri-rui-ro/rui-ro-tap-trung",
      },
    ],
  },
  {
    slug: "tin-don-va-phien-tang-tran",
    title: "Tin đồn và phiên tăng trần",
    summary:
      "Một cổ phiếu tăng trần sau tin đồn về hợp đồng lớn. Dữ liệu chính thức chưa xuất hiện, thanh khoản tăng vọt và mạng xã hội đầy dự báo.",
    theme: "Tâm lý và dữ liệu",
    difficulty: "advanced",
    duration: 15,
    learnerRole: "Nhà đầu tư đang xử lý thông tin chưa được xác nhận",
    objectives: [
      "Phân biệt sự kiện, diễn giải và kỳ vọng.",
      "Tránh biến biến động giá thành bằng chứng cho tin đồn.",
      "Xây quy tắc hành động khi thông tin còn bất đối xứng.",
    ],
    startingFacts: [
      "Cổ phiếu XYZ tăng trần với thanh khoản gấp 4 lần trung bình.",
      "Tin đồn nói doanh nghiệp sắp ký hợp đồng có giá trị bằng 70% doanh thu năm trước.",
      "Chưa có công bố chính thức từ doanh nghiệp hoặc sở giao dịch.",
      "Biên lợi nhuận của hợp đồng, thời gian ghi nhận và vốn lưu động cần thiết đều chưa rõ.",
      "Bạn không sở hữu XYZ nhưng đang có tiền mặt trong danh mục mô phỏng.",
    ],
    checkpoints: [
      {
        title: "Vòng 1: tách lớp thông tin",
        situation:
          "Nhiều người cho rằng thanh khoản lớn xác nhận nhà đầu tư tổ chức đã biết trước thông tin.",
        question: "Điều gì là dữ kiện chắc chắn nhất lúc này?",
        options: [
          {
            label: "Giá và khối lượng đã tăng; nội dung hợp đồng vẫn chưa được xác nhận",
            score: 3,
            feedback:
              "Đúng. Bạn đang tách dữ liệu quan sát được khỏi câu chuyện giải thích dữ liệu đó.",
          },
          {
            label: "Tổ chức đã mua vì họ biết hợp đồng chắc chắn thành công",
            score: 0,
            feedback:
              "Đây là suy diễn nhiều tầng. Khối lượng lớn không cho biết danh tính, động cơ hay độ chính xác của tin đồn.",
          },
          {
            label: "Tin đồn chắc chắn sai vì chưa có công bố",
            score: 1,
            feedback:
              "Chưa công bố không đồng nghĩa chắc chắn sai. Trạng thái đúng là chưa đủ bằng chứng để kết luận.",
          },
        ],
      },
      {
        title: "Vòng 2: định lượng tác động",
        situation:
          "Giả sử hợp đồng là thật, bạn vẫn chưa biết biên lợi nhuận, lịch giao hàng và nhu cầu vốn lưu động.",
        question: "Câu hỏi phân tích nào có giá trị nhất?",
        options: [
          {
            label: "Hợp đồng tạo thêm bao nhiêu lợi nhuận và dòng tiền, trong khoảng thời gian nào?",
            score: 3,
            feedback:
              "Chính xác. Giá trị hợp đồng không đồng nghĩa với lợi nhuận, càng không đồng nghĩa tiền sẽ về ngay.",
          },
          {
            label: "Cổ phiếu có thể tăng thêm bao nhiêu phiên trần?",
            score: 0,
            feedback:
              "Đây là dự đoán giá ngắn hạn, không giúp định lượng giá trị kinh tế của thông tin.",
          },
          {
            label: "Có bao nhiêu tài khoản mạng xã hội đang nhắc tới mã này?",
            score: 0,
            feedback:
              "Độ phổ biến có thể đo tâm lý, nhưng không trả lời hợp đồng tạo giá trị tài chính ra sao.",
          },
        ],
      },
      {
        title: "Vòng 3: quy tắc hành động",
        situation:
          "XYZ tiếp tục tăng trong phiên sau. Bạn cảm thấy nếu không mua ngay sẽ bỏ lỡ cơ hội hiếm có.",
        question: "Quy trình nào phù hợp nhất với môi trường luyện tập?",
        options: [
          {
            label: "Đưa vào watchlist, viết dữ kiện cần xác nhận và không mua chỉ vì giá tăng",
            score: 3,
            feedback:
              "Tốt. Bạn bảo toàn khả năng quan sát mà không biến sự thiếu thông tin thành một cược cảm xúc.",
          },
          {
            label: "Mua tỷ trọng lớn vì lợi nhuận tiềm năng bù cho rủi ro",
            score: 0,
            feedback:
              "Bạn chưa định lượng được lợi nhuận tiềm năng lẫn xác suất tin đúng. Tỷ trọng lớn làm sai số thông tin trở thành rủi ro danh mục.",
          },
          {
            label: "Mua một tỷ trọng rất nhỏ nhưng không cần viết luận điểm",
            score: 1,
            feedback:
              "Tỷ trọng nhỏ giới hạn thiệt hại nhưng vẫn tạo thói quen hành động không có quy trình. Trong mô phỏng, mục tiêu chính là luyện cách ra quyết định.",
          },
        ],
      },
    ],
    debrief: {
      strongApproach:
        "Khi thông tin chưa xác nhận, lợi thế lớn nhất không phải đoán đúng mà là giữ quyền chờ. Dữ kiện chính thức, tác động kinh tế và mức định giá phải được nối với nhau trước khi thành luận điểm.",
      warningSigns: [
        "Dùng giá tăng làm bằng chứng rằng tin đồn đúng.",
        "Đồng nhất giá trị hợp đồng với lợi nhuận.",
        "Hợp lý hóa quyết định sau khi đã sợ bỏ lỡ.",
      ],
      reflectionQuestions: [
        "Bạn cần tối thiểu những dữ kiện nào để định lượng tác động?",
        "Nếu giá không tăng, bạn có còn thấy tin đồn hấp dẫn như vậy?",
        "Quy tắc nào giúp bạn không biến watchlist thành danh sách mua vội?",
      ],
    },
    knowledgeLinks: [
      {
        title: "Tin tức và nhiễu thị trường",
        href: "/knowledge/chung-khoan-nhap-mon/tin-tuc-va-nhieu-thi-truong",
      },
      {
        title: "FOMO và tin nóng",
        href: "/knowledge/tam-ly-dau-tu/fomo-va-tin-nong",
      },
    ],
  },
  {
    slug: "pe-thap-o-dinh-chu-ky",
    title: "P/E thấp ở đỉnh chu kỳ",
    summary:
      "Một doanh nghiệp hàng hóa đang có P/E chỉ 5 lần sau năm lợi nhuận kỷ lục, nhưng giá bán đầu ra bắt đầu giảm và công suất toàn ngành sắp tăng.",
    theme: "Định giá và chu kỳ",
    difficulty: "advanced",
    duration: 17,
    learnerRole: "Nhà phân tích đang kiểm tra một cổ phiếu có vẻ rất rẻ",
    objectives: [
      "Nhận ra P/E thấp có thể đến từ lợi nhuận đang ở mức khó duy trì.",
      "Tách lợi nhuận hiện tại khỏi lợi nhuận bình thường hóa.",
      "Dùng nhiều kịch bản thay vì neo vào một hệ số định giá.",
    ],
    startingFacts: [
      "Giá cổ phiếu hiện tại: 50.000 đồng, EPS 12 tháng gần nhất: 10.000 đồng.",
      "P/E trailing hiện tại là 5 lần, thấp hơn trung bình 5 năm là 9 lần.",
      "Biên lợi nhuận gộp vừa đạt mức cao nhất trong 8 năm.",
      "Giá bán sản phẩm chính đã giảm 18% so với đỉnh.",
      "Công suất toàn ngành dự kiến tăng thêm 12% trong 18 tháng tới.",
    ],
    checkpoints: [
      {
        title: "Vòng 1: đọc con số P/E",
        situation:
          "Một báo cáo gọi cổ phiếu này là cơ hội hiếm vì chỉ cần P/E quay lại mức trung bình 9 lần thì giá có thể tăng mạnh.",
        question: "Điểm cần kiểm tra đầu tiên là gì?",
        options: [
          {
            label: "EPS hiện tại có phản ánh mức lợi nhuận bền vững hay đang ở đỉnh chu kỳ",
            score: 3,
            feedback:
              "Đúng. P/E thấp có thể do mẫu số lợi nhuận đang cao bất thường. Nếu EPS giảm, hệ số định giá sẽ tự tăng ngay cả khi giá không đổi.",
          },
          {
            label: "Giá đã giảm bao nhiêu phần trăm từ đỉnh gần nhất",
            score: 1,
            feedback:
              "Mức giảm giá cung cấp bối cảnh tâm lý nhưng không cho biết lợi nhuận bình thường của doanh nghiệp là bao nhiêu.",
          },
          {
            label: "Trung bình P/E 5 năm có chính xác là 9 lần hay không",
            score: 1,
            feedback:
              "Cần kiểm tra dữ liệu, nhưng áp lại mức trung bình cũ vẫn chưa đủ nếu cấu trúc ngành và triển vọng lợi nhuận đã thay đổi.",
          },
        ],
      },
      {
        title: "Vòng 2: bình thường hóa lợi nhuận",
        situation:
          "Bạn ước tính EPS trong kịch bản cơ sở có thể giảm còn 6.000 đồng khi biên lợi nhuận trở về mức trung bình.",
        question: "Cách diễn giải nào hợp lý nhất?",
        options: [
          {
            label: "Ở giá hiện tại, P/E trên EPS bình thường hóa là khoảng 8,3 lần",
            score: 3,
            feedback:
              "Chính xác. Cổ phiếu vẫn có thể hợp lý, nhưng không còn rẻ sâu như con số P/E trailing 5 lần gợi ý.",
          },
          {
            label: "P/E vẫn là 5 lần vì báo cáo tài chính đã công bố EPS 10.000 đồng",
            score: 0,
            feedback:
              "P/E trailing đúng về mặt lịch sử nhưng có thể gây hiểu nhầm cho quyết định hướng tới tương lai khi lợi nhuận biến động mạnh.",
          },
          {
            label: "Không thể dùng P/E cho bất kỳ doanh nghiệp chu kỳ nào",
            score: 1,
            feedback:
              "Quá tuyệt đối. P/E vẫn hữu ích nếu bạn đặt lợi nhuận trong chu kỳ, bình thường hóa EPS và đối chiếu với bảng cân đối cùng dòng tiền.",
          },
        ],
      },
      {
        title: "Vòng 3: thiết kế quyết định",
        situation:
          "Bạn xây ba kịch bản EPS là 4.000, 6.000 và 9.000 đồng. Giá hiện tại chỉ hấp dẫn rõ trong kịch bản tốt.",
        question: "Hành động nào có quy trình vững hơn?",
        options: [
          {
            label: "Chờ biên an toàn tốt hơn hoặc bằng chứng chu kỳ xấu ít hơn",
            score: 3,
            feedback:
              "Hợp lý. Khi kết quả phụ thuộc nhiều vào kịch bản thuận lợi, quyền chờ là một phần của quản trị rủi ro.",
          },
          {
            label: "Mua ngay vì P/E 5 lần hiếm khi xuất hiện",
            score: 0,
            feedback:
              "Bạn đang neo vào hệ số quá khứ và bỏ qua khả năng EPS giảm. Một con số thấp không tự tạo ra biên an toàn.",
          },
          {
            label: "Loại bỏ cổ phiếu vĩnh viễn vì ngành có tính chu kỳ",
            score: 1,
            feedback:
              "Chu kỳ tạo rủi ro nhưng cũng tạo cơ hội khi giá, bảng cân đối và cung cầu đủ thuận lợi. Điều cần có là điều kiện theo dõi rõ ràng.",
          },
        ],
      },
    ],
    debrief: {
      strongApproach:
        "Với doanh nghiệp chu kỳ, P/E thường thấp nhất khi lợi nhuận gần đỉnh và cao nhất khi lợi nhuận gần đáy. Quy trình tốt phải bình thường hóa EPS, kiểm tra cung cầu ngành và chỉ hành động khi giá còn biên an toàn trong kịch bản cơ sở hoặc xấu.",
      warningSigns: [
        "Áp P/E trung bình lịch sử lên lợi nhuận kỷ lục.",
        "Xem lợi nhuận 12 tháng gần nhất như năng lực kiếm tiền cố định.",
        "Gọi một cổ phiếu là rẻ mà chưa viết kịch bản EPS giảm.",
      ],
      reflectionQuestions: [
        "Biến số nào quyết định biên lợi nhuận của doanh nghiệp trong hai năm tới?",
        "EPS bình thường hóa nên dựa trên bao nhiêu năm và vì sao?",
        "Mức giá nào còn hấp dẫn nếu kịch bản xấu xảy ra?",
      ],
    },
    knowledgeLinks: [
      {
        title: "P/E và kỳ vọng lợi nhuận",
        href: "/knowledge/dinh-gia-co-ban/p-e-va-ky-vong-loi-nhuan",
      },
      {
        title: "Biên an toàn",
        href: "/knowledge/dinh-gia-co-ban/bien-an-toan",
      },
      {
        title: "Chu kỳ ngành",
        href: "/knowledge/phan-tich-nganh/chu-ky-nganh",
      },
    ],
  },
  {
    slug: "co-tuc-cao-nhung-tien-vay-tang",
    title: "Cổ tức cao nhưng tiền vay tăng",
    summary:
      "Một doanh nghiệp công bố cổ tức tiền mặt tương đương lợi suất 12%, trong khi dòng tiền tự do âm hai năm liên tiếp và nợ vay ngắn hạn tăng mạnh.",
    theme: "Dòng tiền và cổ tức",
    difficulty: "intermediate",
    duration: 15,
    learnerRole: "Nhà phân tích đang kiểm tra khả năng duy trì cổ tức",
    objectives: [
      "Phân biệt lợi suất cổ tức hiện tại với khả năng chi trả bền vững.",
      "Nối lợi nhuận, dòng tiền tự do và thay đổi nợ vay.",
      "Viết điều kiện cần theo dõi trước khi xem cổ tức là biên an toàn.",
    ],
    startingFacts: [
      "Giá cổ phiếu hiện tại là 25.000 đồng; cổ tức tiền mặt dự kiến là 3.000 đồng mỗi cổ phiếu.",
      "Lợi nhuận sau thuế năm gần nhất đạt 1.200 tỷ đồng, tăng 8%.",
      "Dòng tiền kinh doanh đạt 650 tỷ đồng nhưng chi đầu tư tài sản cố định là 1.050 tỷ đồng.",
      "Nợ vay ngắn hạn tăng từ 900 lên 1.500 tỷ đồng trong một năm.",
      "Ban lãnh đạo cho biết vẫn muốn duy trì chính sách cổ tức hấp dẫn.",
    ],
    checkpoints: [
      {
        title: "Vòng 1: đọc lợi suất cổ tức",
        situation:
          "Một bài phân tích gọi mức lợi suất 12% là vùng đệm an toàn, vì cao hơn nhiều so với lãi suất tiền gửi.",
        question: "Câu hỏi nào cần được trả lời trước tiên?",
        options: [
          {
            label: "Tiền dùng để trả cổ tức đến từ dòng tiền tự do hay từ vay nợ và tiền tích lũy",
            score: 3,
            feedback:
              "Đúng. Lợi suất chỉ có ý nghĩa khi doanh nghiệp tạo đủ tiền để duy trì khoản chi trả mà không làm yếu bảng cân đối.",
          },
          {
            label: "Giá cổ phiếu đã giảm bao nhiêu từ đỉnh",
            score: 1,
            feedback:
              "Giá giảm làm lợi suất tính toán tăng, nhưng không cải thiện khả năng tạo tiền của doanh nghiệp.",
          },
          {
            label: "Cổ tức năm nay có đúng là 3.000 đồng hay không",
            score: 1,
            feedback:
              "Cần xác nhận nghị quyết, nhưng một lần chi trả đã được duyệt vẫn chưa chứng minh chính sách đó bền vững.",
          },
        ],
      },
      {
        title: "Vòng 2: nối ba báo cáo",
        situation:
          "Dòng tiền kinh doanh 650 tỷ đồng thấp hơn chi đầu tư 1.050 tỷ đồng. Cùng lúc, doanh nghiệp cần khoảng 900 tỷ đồng để trả cổ tức.",
        question: "Diễn giải nào phù hợp nhất với dữ kiện hiện có?",
        options: [
          {
            label: "Doanh nghiệp chưa tự tài trợ được cả đầu tư lẫn cổ tức từ dòng tiền năm nay",
            score: 3,
            feedback:
              "Chính xác. Khoảng thiếu hụt phải được bù bằng tiền sẵn có, bán tài sản, phát hành hoặc tăng vay nợ.",
          },
          {
            label: "Lợi nhuận 1.200 tỷ đồng đủ lớn nên cổ tức chắc chắn an toàn",
            score: 0,
            feedback:
              "Lợi nhuận kế toán không đồng nghĩa với lượng tiền có thể phân phối sau nhu cầu vốn lưu động và đầu tư.",
          },
          {
            label: "Chi đầu tư càng lớn thì doanh nghiệp càng đáng mua",
            score: 1,
            feedback:
              "Đầu tư có thể tạo tăng trưởng, nhưng cần đánh giá hiệu quả dự án, thời gian thu hồi và cách tài trợ.",
          },
        ],
      },
      {
        title: "Vòng 3: thiết kế quyết định",
        situation:
          "Ban lãnh đạo dự kiến tiếp tục đầu tư lớn thêm hai năm. Lãi suất vay có khả năng tăng và chưa có hướng dẫn rõ về dòng tiền dự án mới.",
        question: "Cách tiếp cận nào có quy trình vững hơn?",
        options: [
          {
            label: "Xây kịch bản cổ tức giảm, theo dõi nợ ròng và chờ dòng tiền dự án cải thiện",
            score: 3,
            feedback:
              "Tốt. Cách này xem cổ tức là một biến số phụ thuộc vào sức khỏe tài chính, không phải cam kết bất biến.",
          },
          {
            label: "Mua vì chỉ cần nhận cổ tức hai năm là bù phần lớn rủi ro",
            score: 0,
            feedback:
              "Lập luận này bỏ qua khả năng cổ tức giảm và giá trị vốn chủ sở hữu suy yếu khi nợ tăng nhanh.",
          },
          {
            label: "Loại bỏ doanh nghiệp chỉ vì dòng tiền tự do đang âm",
            score: 1,
            feedback:
              "Quá tuyệt đối. Dòng tiền âm do đầu tư có thể hợp lý nếu dự án sinh lời tốt và cấu trúc tài trợ vẫn an toàn.",
          },
        ],
      },
    ],
    debrief: {
      strongApproach:
        "Cổ tức bền vững cần được kiểm tra bằng tiền thật sau đầu tư cần thiết. Khi doanh nghiệp vừa chi đầu tư lớn, vừa trả cổ tức cao và vừa tăng vay nợ, người học cần tách chính sách hấp dẫn trong ngắn hạn khỏi khả năng duy trì dài hạn.",
      warningSigns: [
        "So lợi suất cổ tức với lãi suất tiền gửi nhưng bỏ qua rủi ro vốn.",
        "Dùng lợi nhuận kế toán thay cho dòng tiền có thể phân phối.",
        "Xem cổ tức quá khứ như cam kết chắc chắn cho tương lai.",
      ],
      reflectionQuestions: [
        "Phần chi đầu tư nào là duy trì hoạt động và phần nào phục vụ tăng trưởng?",
        "Nếu cổ tức giảm một nửa, luận điểm đầu tư còn đứng vững không?",
        "Mức nợ nào khiến chính sách cổ tức trở thành rủi ro cho bảng cân đối?",
      ],
    },
    knowledgeLinks: [
      {
        title: "Báo cáo lưu chuyển tiền tệ",
        href: "/knowledge/bao-cao-tai-chinh/bao-cao-luu-chuyen-tien-te",
      },
      {
        title: "Bảng cân đối kế toán",
        href: "/knowledge/bao-cao-tai-chinh/bang-can-doi-ke-toan",
      },
    ],
  },
  {
    slug: "vuot-qua-bay-fomo",
    title: "Vượt qua bẫy FOMO khi thị trường hưng phấn",
    summary:
      "Nhóm cổ phiếu công nghệ đang tăng trần liên tiếp nhiều phiên. Mọi người xung quanh đều có lời lớn và thúc giục bạn mua ngay cổ phiếu FPT mà không cần phân tích.",
    theme: "Tâm lý đầu tư",
    difficulty: "foundation",
    duration: 10,
    learnerRole: "Nhà đầu tư cá nhân thực hành kiểm soát cảm xúc",
    objectives: [
      "Nhận diện phản ứng tâm lý sợ bỏ lỡ cơ hội (FOMO) khi giá tăng nhanh.",
      "Phân biệt giữa xu hướng giá ngắn hạn và luận điểm đầu tư vững vàng.",
      "Xây dựng quy tắc trì hoãn quyết định để đưa lý trí trở lại trước khi bấm nút giao dịch.",
    ],
    startingFacts: [
      "Vốn ảo hiện tại: 100.000.000 điểm ảo.",
      "Cổ phiếu công nghệ FPT tăng trần 3 phiên liên tiếp sau tin tức về hợp đồng AI mới.",
      "Diễn đàn chứng khoán ngập tràn các chủ đề hô hào mục tiêu giá tăng thêm 50%.",
      "Bạn chưa đọc báo cáo tài chính gần nhất của doanh nghiệp và chưa tự tính định giá.",
    ],
    checkpoints: [
      {
        title: "Vòng 1: kiểm soát cảm xúc trước bảng điện xanh trần",
        situation:
          "Sáng nay cổ phiếu FPT tiếp tục mở cửa tăng mạnh 5%. Người bạn thân nhắn tin: 'FPT sắp chạy tiếp rồi, không mua bây giờ là mất ăn cả sóng!'. Bạn cảm thấy nhịp tim đập nhanh và thôi thúc mở ứng dụng simulator.",
        question: "Hành động nào dưới đây thể hiện sự quản trị cảm xúc tốt nhất?",
        options: [
          {
            label: "Tự đặt câu hỏi: 'Mình hiểu gì về hợp đồng AI này và giá hiện tại đã phản ánh bao nhiêu?' đồng thời dừng giao dịch tối thiểu 15 phút.",
            score: 3,
            feedback:
              "Rất tốt. Trì hoãn quyết định giúp vỏ não tiền trán lấy lại quyền kiểm soát từ vùng não cảm xúc (hạch hạnh nhân) đang bị kích thích.",
          },
          {
            label: "Đặt lệnh mua ngay 50% tài sản để 'lấy vị thế' trước kẻo lỡ mất giá trần.",
            score: 0,
            feedback:
              "Đây chính là biểu hiện điển hình của bẫy FOMO. Mua đuổi không có luận điểm thường dẫn đến việc đu đỉnh khi dòng tiền nóng rút đi.",
          },
          {
            label: "Không mua và lập tức bán khống vì nghĩ chắc chắn giá sẽ giảm sau chuỗi tăng nóng.",
            score: 1,
            feedback:
              "Chống lại đám đông một cách cảm tính cũng là một loại lỗi hành vi (giận dữ/kiêu ngạo). Bạn cần số liệu phân tích trước khi đưa ra quyết định ngược chiều.",
          },
        ],
      },
      {
        title: "Vòng 2: chuyển từ cảm xúc sang số liệu",
        situation:
          "Bạn quyết định kiên nhẫn đợi. Chiều cùng ngày, giá cổ phiếu có nhịp điều chỉnh nhẹ giảm 2% so với đỉnh trong ngày. Các diễn đàn bắt đầu xuất hiện những ý kiến trái chiều về tính khả thi của dự án AI mới.",
        question: "Bạn sẽ làm gì để đưa ra quyết định dựa trên cơ sở khoa học?",
        options: [
          {
            label: "Mở báo cáo tài chính gần nhất để kiểm tra tỷ trọng doanh thu công nghệ và biên lợi nhuận của mảng này.",
            score: 3,
            feedback:
              "Tuyệt vời. Số liệu tài chính lịch sử là mỏ neo đáng tin cậy nhất để đưa định giá về thực tế thay vì kỳ vọng ảo.",
          },
          {
            label: "Lên các hội nhóm tài chính tìm xem chuyên gia nào dự báo chuẩn nhất để nghe theo.",
            score: 0,
            feedback:
              "Việc dựa dẫm vào ý kiến người khác chỉ là cách bạn chuyển giao trách nhiệm ra quyết định chứ không giúp xây dựng năng lực tự phản tư.",
          },
          {
            label: "Mua ngay vì giá đã chiết khấu 2% so với đỉnh buổi sáng, đây là cơ hội rẻ hiếm có.",
            score: 1,
            feedback:
              "2% không phải là biên an toàn. Đây là tâm lý 'neo giá đỉnh' khiến bạn cảm thấy cổ phiếu đang rẻ một cách ảo giác.",
          },
        ],
      },
      {
        title: "Vòng 3: quyết định cuối cùng",
        situation:
          "Sau khi xem báo cáo tài chính, bạn nhận thấy mảng AI rất tiềm năng nhưng cần ít nhất 2 năm để đóng góp đáng kể vào doanh thu. Định giá P/E hiện tại của cổ phiếu đã đạt mức kỷ lục lịch sử (vượt xa mức trung bình 5 năm).",
        question: "Quyết định giải ngân nào là phù hợp nhất với nguyên tắc quản trị rủi ro?",
        options: [
          {
            label: "Đưa cổ phiếu vào danh sách theo dõi, chờ đợi nhịp điều chỉnh sâu hơn hoặc khi doanh thu AI bắt đầu hiện thực hóa.",
            score: 3,
            feedback:
              "Xuất sắc. Kiên nhẫn là chìa khóa. Việc bỏ qua một cơ hội tăng giá không rõ ràng tốt hơn nhiều so với việc chấp nhận một rủi ro định giá quá cao.",
          },
          {
            label: "Vẫn mua vì cổ phiếu tốt thì giá nào cũng sẽ tăng trong dài hạn, không cần quan tâm định giá ngắn hạn.",
            score: 0,
            feedback:
              "Sai lầm phổ biến. Một doanh nghiệp tuyệt vời mua sai giá vẫn là một thương vụ tồi tệ. Định giá quá cao sẽ làm suy giảm tỷ suất sinh lời dài hạn của bạn.",
          },
          {
            label: "Mua một lượng rất nhỏ (khoảng 2% danh mục ảo) để trải nghiệm biến động cảm xúc thật mà không ảnh hưởng lớn đến vốn.",
            score: 2,
            feedback:
              "Đây là một cách tiếp cận thực tế. Dùng quy mô cực nhỏ như một chi phí học tập để hiểu phản ứng sinh lý của bản thân khi giữ cổ phiếu biến động mạnh.",
          },
        ],
      },
    ],
    debrief: {
      strongApproach:
        "Chiến thắng FOMO không phải là không bao giờ mua cổ phiếu tăng nóng, mà là luôn có quy trình phân tích độc lập, định giá dựa trên số liệu thực tế thay vì tin đồn, và biết cách trì hoãn quyết định khi cảm xúc dâng trào.",
      warningSigns: [
        "Cảm giác sốt ruột, sợ bỏ lỡ khi nhìn bảng điện tử nhảy giá.",
        "Coi ý kiến đám đông hoặc lời hô hào là luận điểm đầu tư.",
        "Mua trước phân tích sau.",
      ],
      reflectionQuestions: [
        "Lần gần nhất bạn mua vì FOMO, kết quả thực tế ra sao?",
        "Bạn có quy tắc cụ thể nào để ngăn bản thân đặt lệnh trong lúc hưng phấn không?",
        "Tại sao việc bỏ lỡ một cơ hội tăng giá lại khiến bạn khó chịu hơn việc chấp nhận rủi ro mất tiền?",
      ],
    },
    knowledgeLinks: [
      {
        title: "FOMO và tin nóng",
        href: "/knowledge/tam-ly-dau-tu/fomo-va-tin-nong",
      },
      {
        title: "Tin tức và nhiễu thị trường",
        href: "/knowledge/chung-khoan-nhap-mon/tin-tuc-va-nhieu-thi-truong",
      },
    ],
  },
];

export function getPracticeCaseBySlug(slug: string) {
  return practiceCases.find((item) => item.slug === slug);
}
