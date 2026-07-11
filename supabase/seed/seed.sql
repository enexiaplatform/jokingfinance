insert into public.stocks (
  ticker, company_name, sector, current_price, previous_close,
  daily_change_percent, pe_ratio, market_cap, description, is_active
) values
  ('FPT', 'Tập đoàn FPT', 'Công nghệ', 112000, 110500, 1.36, 21.4, 145000000000000, 'Doanh nghiệp công nghệ và dịch vụ số, dùng trong dữ liệu mô phỏng.', true),
  ('VNM', 'Vinamilk', 'Hàng tiêu dùng', 68500, 69000, -0.72, 16.8, 143000000000000, 'Doanh nghiệp sữa và hàng tiêu dùng, dữ liệu chỉ để học tập.', true),
  ('MWG', 'Thế Giới Di Động', 'Bán lẻ', 61400, 60200, 1.99, 24.1, 89900000000000, 'Chuỗi bán lẻ công nghệ và tiêu dùng, mô phỏng cho phòng luyện tập.', true),
  ('HPG', 'Tập đoàn Hòa Phát', 'Thép', 28900, 29200, -1.03, 14.2, 169000000000000, 'Doanh nghiệp thép chu kỳ, phù hợp luyện phân tích ngành.', true),
  ('VCB', 'Vietcombank', 'Ngân hàng', 91200, 90500, 0.77, 18.5, 510000000000000, 'Ngân hàng thương mại lớn, dữ liệu mô phỏng cho bài học tài chính.', true),
  ('BID', 'BIDV', 'Ngân hàng', 42600, 43100, -1.16, 12.6, 243000000000000, 'Ngân hàng thương mại, dùng để so sánh ngành trong phần mô phỏng.', true),
  ('CTG', 'VietinBank', 'Ngân hàng', 35800, 35000, 2.29, 10.9, 193000000000000, 'Cổ phiếu ngân hàng trong bộ dữ liệu mẫu.', true),
  ('ACB', 'Ngân hàng Á Châu', 'Ngân hàng', 27600, 27400, 0.73, 8.7, 128000000000000, 'Ngân hàng tư nhân, phục vụ bài tập so sánh định giá.', true),
  ('GAS', 'PV GAS', 'Năng lượng', 78200, 79000, -1.01, 17.3, 181000000000000, 'Doanh nghiệp khí, dữ liệu mô phỏng cho phân bổ ngành.', true),
  ('VHM', 'Vinhomes', 'Bất động sản', 43200, 42800, 0.93, 9.8, 188000000000000, 'Bất động sản nhà ở, dữ liệu chỉ để mô phỏng.', true),
  ('VIC', 'Tập đoàn Vingroup', 'Tập đoàn đa ngành', 46800, 47400, -1.27, 28.2, 182000000000000, 'Tập đoàn đa ngành, dùng trong bài tập rủi ro và luận điểm.', true),
  ('MSN', 'Tập đoàn Masan', 'Hàng tiêu dùng', 72400, 71000, 1.97, 31.5, 103000000000000, 'Doanh nghiệp tiêu dùng, bán lẻ và tài nguyên, dữ liệu mẫu.', true),
  ('VRE', 'Vincom Retail', 'Bất động sản bán lẻ', 21800, 22100, -1.36, 13.7, 49500000000000, 'Bất động sản bán lẻ, phục vụ luyện tập phân tích ngành.', true),
  ('SSI', 'Chứng khoán SSI', 'Chứng khoán', 34900, 34200, 2.05, 19.9, 52300000000000, 'Công ty chứng khoán, dùng để học về ngành tài chính.', true),
  ('VND', 'Chứng khoán VNDirect', 'Chứng khoán', 19600, 19900, -1.51, 15.4, 23900000000000, 'Công ty chứng khoán trong bộ dữ liệu mô phỏng.', true),
  ('PNJ', 'Vàng bạc Đá quý Phú Nhuận', 'Bán lẻ', 98200, 97000, 1.24, 20.2, 32200000000000, 'Doanh nghiệp bán lẻ trang sức, dữ liệu học tập.', true),
  ('REE', 'Cơ điện lạnh REE', 'Cơ điện lạnh', 68400, 68100, 0.44, 10.1, 28100000000000, 'Doanh nghiệp hạ tầng và cơ điện, mô phỏng phân bổ danh mục.', true),
  ('GMD', 'Gemadept', 'Hậu cần', 74800, 73500, 1.77, 18.8, 25600000000000, 'Doanh nghiệp cảng và hậu cần, dữ liệu mẫu.', true),
  ('FRT', 'Bán lẻ FPT', 'Bán lẻ', 159000, 157500, 0.95, 33.6, 21700000000000, 'Chuỗi bán lẻ công nghệ và dược phẩm, dùng trong phòng luyện tập.', true),
  ('DGC', 'Hóa chất Đức Giang', 'Hóa chất', 112500, 111200, 1.17, 12.4, 42700000000000, 'Doanh nghiệp hóa chất, phục vụ luyện tập rủi ro ngành.', true)
on conflict (ticker) do update set
  company_name = excluded.company_name,
  sector = excluded.sector,
  current_price = excluded.current_price,
  previous_close = excluded.previous_close,
  daily_change_percent = excluded.daily_change_percent,
  pe_ratio = excluded.pe_ratio,
  market_cap = excluded.market_cap,
  description = excluded.description,
  is_active = excluded.is_active,
  updated_at = now();

insert into public.missions (
  title, slug, description, difficulty, category, estimated_minutes,
  objective, instructions, success_criteria, related_article_slug, is_active
) values
  ('Tạo danh mục ảo đầu tiên với 100 triệu điểm ảo', 'tao-danh-muc-ao-dau-tien', 'Chọn vài cổ phiếu mô phỏng, phân bổ số điểm ảo ban đầu và viết lý do ngắn.', 'beginner', 'Phòng luyện tập', 15, 'Tạo một danh mục ảo đầu tiên thay vì mua ngẫu hứng một mã.', 'Mở phần mô phỏng và xem danh sách cổ phiếu mô phỏng.
Chọn 3 đến 5 mã thuộc các ngành khác nhau.
Không dùng quá 40% tiền ảo trong lần luyện tập đầu tiên.
Viết một câu lý do cho từng lệnh mua.', 'Có ít nhất 3 mã trong danh mục.
Vẫn còn tiền ảo sau khi mua.
Mỗi giao dịch có luận điểm ngắn.', 'co-phieu-la-gi', true),
  ('So sánh 3 cổ phiếu cùng ngành bằng tỷ số giá trên lợi nhuận', 'so-sanh-3-co-phieu-cung-nganh-bang-pe', 'Chọn ba cổ phiếu trong cùng một ngành và ghi lại nhận xét về tỷ số giá trên lợi nhuận.', 'beginner', 'Đọc báo cáo tài chính', 20, 'Hiểu rằng tỷ số giá trên lợi nhuận cần được so sánh trong bối cảnh ngành.', 'Chọn một ngành có ít nhất 3 mã trong danh sách mô phỏng.
Ghi tỷ số giá trên lợi nhuận của từng mã.
Viết một đoạn ngắn về câu hỏi cần tìm hiểu thêm.', 'Có 3 mã được so sánh.
Có nhận xét về vì sao tỷ số này khác nhau.
Không kết luận mua/bán chỉ từ một chỉ số.', 'pe-la-gi', true),
  ('Không phân bổ quá 20% danh mục vào một mã', 'khong-phan-bo-qua-20-phan-tram-vao-mot-ma', 'Luyện giới hạn tỷ trọng để hiểu rủi ro tập trung trong danh mục.', 'beginner', 'Quản trị rủi ro', 15, 'Tập phân bổ thay vì dồn hết vào cổ phiếu đang được chú ý.', 'Tính tổng giá trị danh mục ảo.
Kiểm tra tỷ trọng từng mã.
Điều chỉnh kế hoạch sao cho một mã không vượt 20%.', 'Không có mã nào vượt 20% trong kế hoạch mua mới.
Có ghi chú vì sao cần giới hạn tỷ trọng.', 'danh-muc-dau-tu-la-gi', true),
  ('Viết lý do trước khi mua một cổ phiếu', 'viet-ly-do-truoc-khi-mua', 'Trước khi xác nhận lệnh mua mô phỏng, viết luận điểm, thời gian nắm giữ và rủi ro.', 'beginner', 'Nhật ký giao dịch', 10, 'Biến giao dịch mô phỏng thành một bài học có thể xem lại.', 'Chọn một mã bạn muốn luyện mua.
Viết lý do mua trong 1 đến 3 câu.
Ghi thời gian nắm giữ kỳ vọng.
Ghi một rủi ro có thể làm luận điểm sai.', 'Lệnh mua có luận điểm.
Có rủi ro được ghi lại.
Có cảm xúc trước khi mua.', 'viet-3-dong-ly-do-truoc-khi-mua', true),
  ('Xem lại danh mục sau 7 ngày', 'review-danh-muc-sau-7-ngay', 'Xem lại danh mục, tỷ trọng, lãi/lỗ và ghi một bài học sau thời gian quan sát.', 'beginner', 'Xem lại danh mục', 25, 'Luyện thói quen xem lại thay vì chỉ nhìn lời/lỗ.', 'Mở trang danh mục.
Xem mã tăng, mã giảm và tỷ trọng lớn nhất.
Ghi điều bạn học được từ quyết định ban đầu.', 'Có phần tự xem lại cho ít nhất một giao dịch.
Có nhận xét về tỷ trọng danh mục.', null, true),
  ('Nhận diện một giao dịch do sợ bỏ lỡ', 'nhan-dien-giao-dich-fomo', 'Gắn nhãn cảm xúc sợ bỏ lỡ cho một lệnh mô phỏng và viết cách xử lý lần sau.', 'beginner', 'Sai lầm tài chính', 12, 'Nhận diện cảm xúc trước khi nó dẫn bạn đi quá xa.', 'Tìm một mã đang tăng trong dữ liệu mô phỏng.
Nếu muốn mua vì sợ lỡ cơ hội, chọn cảm xúc là sợ bỏ lỡ.
Ghi lại điều bạn sẽ kiểm tra trước khi mua thật.', 'Có ít nhất một giao dịch đánh dấu sợ bỏ lỡ hoặc ghi chú vì sao không bị cảm xúc này chi phối.
Có một bài học trong nhật ký.', 'vi-sao-nguoi-moi-de-fomo', true),
  ('Xây danh mục gồm 5 ngành khác nhau', 'xay-danh-muc-5-nganh', 'Chọn các mã từ 5 ngành để thấy danh mục đa dạng khác gì danh mục tập trung.', 'intermediate', 'Phân bổ danh mục', 20, 'Luyện đa dạng hóa theo ngành bằng dữ liệu mô phỏng.', 'Chọn 5 ngành khác nhau trong danh sách cổ phiếu.
Mua mô phỏng với tỷ trọng cân bằng tương đối.
Ghi ngành nào bạn hiểu ít nhất để học thêm.', 'Danh mục có ít nhất 5 ngành.
Có ghi chú về ngành cần tìm hiểu thêm.', null, true),
  ('Ghi lại 3 rủi ro trước khi mua', 'ghi-3-rui-ro-truoc-khi-mua', 'Không chỉ ghi lý do tốt. Hãy ghi điều có thể khiến quyết định sai.', 'beginner', 'Quản trị rủi ro', 12, 'Tập nhìn rủi ro trước khi nhìn lợi nhuận kỳ vọng.', 'Chọn một mã trong phần mô phỏng.
Ghi ba rủi ro có thể xảy ra.
Chỉ xác nhận mua khi đã viết xong.', 'Có ghi chú rủi ro trước khi mua.
Ghi chú rủi ro không chỉ viết chung chung.', null, true),
  ('So sánh cổ phiếu tăng trưởng và cổ phiếu phòng thủ', 'so-sanh-tang-truong-phong-thu', 'Chọn hai cổ phiếu có đặc điểm khác nhau và ghi lại kỳ vọng/rủi ro.', 'intermediate', 'Kinh doanh dễ hiểu', 20, 'Nhận ra mỗi kiểu doanh nghiệp có câu chuyện và rủi ro riêng.', 'Chọn một mã tăng trưởng và một mã phòng thủ trong dữ liệu mô phỏng.
So sánh tỷ số giá trên lợi nhuận, ngành và biến động ngày.
Ghi lý do vì sao không nên áp cùng một kỳ vọng cho cả hai.', 'Có hai mã được so sánh.
Có nhận xét về khác biệt rủi ro.', null, true),
  ('Kiểm tra mức độ tập trung danh mục', 'kiem-tra-tap-trung-danh-muc', 'Tìm mã có tỷ trọng cao nhất và quyết định có cần điều chỉnh kế hoạch không.', 'beginner', 'Xem lại danh mục', 15, 'Hiểu khi nào danh mục bắt đầu phụ thuộc quá nhiều vào một mã.', 'Mở trang danh mục.
Tìm mã có tỷ trọng cao nhất.
Nếu vượt 30%, viết phần tự xem lại về rủi ro tập trung.', 'Xác định được mã có tỷ trọng lớn nhất.
Có phần tự xem lại nếu tỷ trọng vượt 30%.', null, true)
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  difficulty = excluded.difficulty,
  category = excluded.category,
  estimated_minutes = excluded.estimated_minutes,
  objective = excluded.objective,
  instructions = excluded.instructions,
  success_criteria = excluded.success_criteria,
  related_article_slug = excluded.related_article_slug,
  is_active = excluded.is_active,
  updated_at = now();

insert into public.missions (
  title, slug, description, difficulty, category, estimated_minutes,
  objective, instructions, success_criteria, related_article_slug,
  related_case_slug, is_active
) values (
  'Bình thường hóa lợi nhuận trước khi dùng P/E',
  'binh-thuong-hoa-loi-nhuan-truoc-khi-dung-pe',
  'Viết ba kịch bản EPS để kiểm tra một cổ phiếu P/E thấp có thực sự rẻ hay chỉ đang ở đỉnh lợi nhuận.',
  'advanced',
  'Định giá và chu kỳ',
  25,
  'Không dùng P/E trailing máy móc khi lợi nhuận doanh nghiệp biến động theo chu kỳ.',
  'Chọn một doanh nghiệp có lợi nhuận hoặc biên lợi nhuận biến động mạnh qua các năm.
Viết ba kịch bản EPS: xấu, cơ sở và tốt; ghi rõ giả định chính của từng kịch bản.
Tính lại P/E hiện tại trên từng mức EPS thay vì chỉ dùng lợi nhuận 12 tháng gần nhất.
Viết mức giá hoặc dữ kiện mới khiến bạn sẵn sàng xem xét lại quyết định.',
  'Có đủ ba kịch bản EPS và giả định đi kèm.
Có P/E tính lại cho ít nhất kịch bản cơ sở và xấu.
Kết luận có nhắc tới chu kỳ, biên an toàn và điều kiện kiểm chứng.',
  'pe-la-gi',
  'pe-thap-o-dinh-chu-ky',
  true
)
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  difficulty = excluded.difficulty,
  category = excluded.category,
  estimated_minutes = excluded.estimated_minutes,
  objective = excluded.objective,
  instructions = excluded.instructions,
  success_criteria = excluded.success_criteria,
  related_article_slug = excluded.related_article_slug,
  related_case_slug = excluded.related_case_slug,
  is_active = excluded.is_active,
  updated_at = now();

insert into public.missions (
  title, slug, description, difficulty, category, estimated_minutes,
  objective, instructions, success_criteria, related_article_slug, is_active
) values
  ('Thực hành giả lập cổ tức tăng trưởng và cơ chế DRIP',
   'thuc-hanh-tich-luy-co-tuc-dgi-drip',
   'Sử dụng công cụ giả lập cổ tức tăng trưởng để so sánh hiệu quả của việc tái đầu tư cổ tức (DRIP) so với nhận tiền mặt đối với các mã cổ phiếu đầu ngành.',
   'intermediate',
   'Phòng luyện tập',
   15,
   'Hiểu sâu về khái niệm Yield-on-Cost và sức bật lãi kép từ việc sở hữu thêm cổ phần qua tái đầu tư cổ tức.',
   'Mở tab Tích lũy cổ tức DGI trong hộp công cụ tài chính JokingFinance.
Chọn mã cổ phiếu Vinamilk (VNM) với thiết lập vốn ban đầu 50 triệu và tích lũy 3 triệu/tháng trong thời gian 15 năm.
Chạy giả lập lần 1 với tính năng Tái đầu tư cổ tức (DRIP) đang Bật. Ghi chép lại Giá trị tài sản cuối kỳ, Yield on Cost (YoC) cuối kỳ và lượng Thu nhập thụ động hàng năm.
Chạy giả lập lần 2 với tính năng Tái đầu tư cổ tức (DRIP) đang Tắt (nhận tiền mặt tiêu dùng). So sánh sự sụt giảm về tài sản và dòng tiền thụ động năm cuối.
Chuyển sang mã FPT và quan sát sự khác biệt khi một cổ phiếu có mức tăng trưởng cổ tức cao (12%/năm) tạo ra Yield on Cost vượt trội sau 20 năm tích lũy.',
   'Đã thực hiện so sánh trực quan giữa hai chế độ Có DRIP và Không DRIP trên cùng một mã cổ phiếu.
Xác định được sự ảnh hưởng của tốc độ tăng trưởng cổ tức (Dividend Growth) đối với chỉ số Yield on Cost cuối kỳ.
Ghi chép lại suy ngẫm cá nhân về tầm quan trọng của việc coi cổ tức là công cụ tích lũy cổ phần thay vì tiền tiêu xài ngắn hạn.',
   'tich-luy-co-tuc-va-suc-bat-compound-dividend',
   true),
  ('Thực hành đo lường hao hụt do giao dịch ngắn hạn',
   'thuc-hanh-do-luong-drag-giao-dich-ngan-han',
   'Sử dụng công cụ giả lập Overtrading để đo lường tác động của thuế và phí lên tài sản ròng khi quay vòng vốn quá nhanh.',
   'intermediate',
   'Phòng luyện tập',
   15,
   'Hiểu sâu về bẫy phí thuế khứ hồi và cách tần suất giao dịch cao bào mòn lãi kép dài hạn.',
   'Mở tab Hao hụt do Giao dịch ngắn hạn (Overtrading) trong hộp công cụ tài chính.
Nhập vốn ban đầu 100 triệu và góp hàng tháng 3 triệu trong vòng 10 năm.
Thiết lập Tần suất Giao dịch thành ''Đầu cơ T+3 hàng ngày (Cực kỳ nguy hiểm)'' và quan sát số tiền Thuế & Phí Đã Nộp Lũy Kế.
Chuyển sang tần suất ''Mua & Nắm giữ dài hạn'' và so sánh sự chênh lệch về Tài sản ròng thực nhận và Tỷ lệ bào mòn (Drag Ratio).
Thử điều chỉnh tỷ lệ hiệu quả trading (Alpha) của bạn lên +3% xem có bù đắp nổi chi phí giao dịch ở tần suất cao hay không.
Viết nhận xét vào phần tự xem lại của bạn về kết quả so sánh này.',
   'Đã chạy giả lập Overtrading với tần suất T+3 hàng ngày và Mua & Nắm giữ dài hạn.
Xác định được số tiền chênh lệch tài sản ròng giữa hai chiến lược.
Có ghi chép bài học về tác hại của việc giao dịch quá mức lên hiệu quả đầu tư thực tế.',
   'overtrading-va-drag-thue-phi',
   true)
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  difficulty = excluded.difficulty,
  category = excluded.category,
  estimated_minutes = excluded.estimated_minutes,
  objective = excluded.objective,
  instructions = excluded.instructions,
  success_criteria = excluded.success_criteria,
  related_article_slug = excluded.related_article_slug,
  is_active = excluded.is_active,
  updated_at = now();
