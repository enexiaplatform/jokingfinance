# Sự kiện đo lường JokingFinance

Các sự kiện dưới đây chỉ gửi nhãn giao diện, vị trí CTA, đường dẫn và trạng thái tổng hợp. Không gửi họ tên, email, mật khẩu, nội dung phản hồi hoặc luận điểm đầu tư.

## Funnel onboarding

| Sự kiện | Ý nghĩa |
| --- | --- |
| `onboarding_start_click` | Người dùng mở lộ trình `/start` từ trang chủ hoặc navigation. |
| `onboarding_step_click` | Người dùng chọn một trong ba bước học, case hoặc mô phỏng. |
| `signup_cta_click` | Người dùng bấm CTA tạo tài khoản. |
| `signup_success` | Tạo tài khoản Supabase thành công. |
| `signup_demo_success` | Đi vào app ở chế độ demo khi chưa cấu hình Supabase. |
| `signup_error` | Tạo tài khoản thất bại; chỉ gửi mã lỗi kỹ thuật. |

## Funnel nội dung

| Sự kiện | Ý nghĩa |
| --- | --- |
| `content_hub_click` | Người dùng mở thư viện bài học từ CTA chính. |
| `related_article_click` | Người dùng tiếp tục sang một bài liên quan. |
| `article_mission_click` | Người dùng chuyển từ bài học sang nhiệm vụ thực hành. |
| `article_open_click` | Người dùng mở bài từ một thẻ nội dung. |
| `content_saved` | Người dùng lưu bài, case, tin hoặc module để học lại. |
| `content_unsaved` | Người dùng bỏ lưu nội dung. |
| `mission_start_click` | Người dùng bắt đầu nhiệm vụ trong khu vực app. |

## Funnel ebook và lead

| Sự kiện | Ý nghĩa |
| --- | --- |
| `ebook_interest_click` | Người dùng mở form quan tâm ebook. |
| `ebook_sample_click` | Người dùng mở checklist đọc thử từ landing hoặc bài viết. |
| `lead_form_success` | Form early access hoặc ebook được gửi thành công. |
| `lead_form_error` | Form lỗi; chỉ gửi loại interest và mã lỗi kỹ thuật. |

## Báo cáo nên tạo trong GA

1. `/` → `onboarding_start_click` → `/start`.
2. `/start` → `onboarding_step_click`.
3. `/start` → `signup_cta_click` → `signup_success`.
4. Bài viết → `article_mission_click`.
5. `/ebook` → `ebook_interest_click` → `lead_form_success`.

Theo dõi tỷ lệ chuyển bước theo tuần. Không tối ưu chỉ dựa trên số click; đọc thêm phản hồi định tính từ người dùng thử.

## Safety và simulator

| Sự kiện | Ý nghĩa |
| --- | --- |
| `risk_disclaimer_accepted` | Người dùng xác nhận cảnh báo tại signup hoặc lần đầu dùng simulator. |
| `missing_thesis_warning_shown` | Giao dịch bị chặn vì chưa có lý do đủ rõ. |
| `trade_blocked_missing_risk` | Lệnh mua bị chặn vì chưa ghi rủi ro chính. |
| `trade_blocked_insufficient_cash` | Lệnh mua vượt tiền ảo còn lại. |
| `trade_blocked_no_holding` | Người dùng thử bán mã chưa nắm giữ. |
| `trade_blocked_excess_quantity` | Người dùng thử bán quá số lượng đang giữ. |
| `concentration_warning_shown` | Một mã vượt ngưỡng 30% danh mục sau giao dịch. |
| `first_virtual_buy` | Lệnh mua ảo hợp lệ đã được tạo cùng luận điểm và ghi chú rủi ro. |
| `virtual_buy_completed` | Một lệnh mua ảo hợp lệ được hoàn tất. |
