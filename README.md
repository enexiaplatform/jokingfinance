# JokingFinance

JokingFinance là website nội dung tài chính tiếng Việt có tòa soạn quản trị bài viết và bộ mô phỏng đầu tư cổ phiếu bằng điểm ảo.

JokingFinance không phải ứng dụng môi giới, không cung cấp tín hiệu giao dịch, không khuyến nghị cổ phiếu, không phải sản phẩm cờ bạc và không xử lý tiền thật. Đây là hệ thống nội dung ưu tiên giáo dục, nơi người vận hành có thể đăng bài hằng ngày qua tòa soạn, còn người đọc có thể đọc bài viết dễ hiểu, làm nhiệm vụ thực hành, xây danh mục ảo bằng điểm ảo và tự xem lại quyết định trong nhật ký giao dịch.

Lời hứa cốt lõi:

> Đăng bài mỗi ngày qua tòa soạn. Thực hành bằng điểm ảo trước khi dùng tiền thật.

## Công nghệ

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth và Postgres
- Sanity làm hệ quản trị nội dung
- Tòa soạn nội dung trong khu vực app
- Triển khai trên Vercel
- Lớp dữ liệu thị trường mô phỏng cho bản thử nghiệm

## Đường Dẫn

Công khai:

- `/`
- `/articles`
- `/articles/[slug]`
- `/categories/[slug]`
- `/tags/[slug]`
- `/missions`
- `/missions/[slug]`
- `/simulator`
- `/pricing`
- `/request-access`
- `/login`
- `/signup`
- `/studio`

Khu vực app:

- `/app/dashboard`
- `/app/content`
- `/app/simulator`
- `/app/portfolio`
- `/app/trades`
- `/app/journal`
- `/app/missions`
- `/app/settings`

## Cài Đặt

```bash
npm install
npm run dev
```

Mở `http://localhost:3000`.

Ứng dụng có thể chạy ở chế độ dùng thử khi chưa cấu hình Supabase hoặc Sanity. Chế độ này dùng nội dung mẫu, cổ phiếu mô phỏng và bộ nhớ cục bộ của trình duyệt.

## Môi Trường

Sao chép `.env.example` thành `.env.local` rồi điền giá trị.

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
SANITY_API_TOKEN=
NEXT_PUBLIC_APP_URL=
```

Supabase hiện khuyến nghị dùng khóa có thể công khai cho ứng dụng trình duyệt. Bản thử nghiệm này hỗ trợ cả `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` và khóa cũ `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## Cấu Hình Supabase

1. Tạo một dự án Supabase.
2. Thêm địa chỉ Supabase và khóa công khai vào `.env.local`.
3. Chạy migration trong `supabase/migrations/20260604130000_jokingfinance_mvp_schema.sql`.
4. Chạy dữ liệu mẫu trong `supabase/seed/seed.sql`.
5. Bật đăng nhập bằng thư điện tử và mật khẩu.
6. Để thử nghiệm nhanh, có thể tắt xác nhận thư điện tử trong Supabase Auth hoặc xác nhận thư của người dùng trước khi đăng nhập.

Các bảng được tạo:

- `profiles`
- `stocks`
- `portfolios`
- `holdings`
- `trades`
- `trade_journal`
- `missions`
- `user_mission_progress`
- `early_access_requests`

RLS được bật cho tất cả bảng công khai. Dữ liệu thuộc về người dùng được giới hạn bằng `auth.uid() = user_id`. Cổ phiếu và nhiệm vụ có thể đọc công khai. Yêu cầu đăng ký thử nghiệm có thể được gửi công khai nhưng không đọc công khai.

Khi đăng ký, trigger riêng sẽ tạo:

- Hồ sơ người dùng
- Danh mục ảo mặc định
- `100.000.000` điểm ảo

## Dữ Liệu Mẫu

File seed gồm:

- 20 mã cổ phiếu Việt Nam mô phỏng: `FPT`, `VNM`, `MWG`, `HPG`, `VCB`, `BID`, `CTG`, `ACB`, `GAS`, `VHM`, `VIC`, `MSN`, `VRE`, `SSI`, `VND`, `PNJ`, `REE`, `GMD`, `FRT`, `DGC`
- 10 nhiệm vụ thực hành gắn với vòng nội dung và mô phỏng

Dữ liệu thị trường là dữ liệu mẫu/mô phỏng. Không dùng dữ liệu này để ra quyết định đầu tư thật.

## Cấu Hình Sanity

1. Tạo dự án và bộ dữ liệu Sanity.
2. Thêm `NEXT_PUBLIC_SANITY_PROJECT_ID` và `NEXT_PUBLIC_SANITY_DATASET`.
3. Khởi động ứng dụng và mở `/studio`.
4. Xuất bản bài viết với trạng thái `published`.

Schema gồm:

- `article`
- `category`
- `tag`
- `author`

Trường bài viết gồm tiêu đề, đường dẫn, tóm tắt, ảnh bìa, chuyên mục, thẻ, tác giả, ngày xuất bản, độ khó, thời gian đọc, nội dung, mã cổ phiếu liên quan, đường dẫn nhiệm vụ liên quan, trạng thái, trường tìm kiếm và tuyên bố giới hạn.

Nếu Sanity chưa được cấu hình hoặc chưa có bài đã xuất bản, ứng dụng sẽ dùng 5 bài viết mẫu.

## Tòa Soạn Nội Dung

Khu vực `/app/content` là tòa soạn bản thử nghiệm để người vận hành soạn bài mà không cần sửa mã nguồn. Màn hình này hỗ trợ:

- Tiêu đề, tóm tắt, nội dung
- Ảnh bìa
- Chuyên mục và thẻ
- Tiêu đề tìm kiếm và mô tả tìm kiếm
- Trạng thái bản nháp, sẵn sàng đăng và đã xuất bản
- Bản xem trước và hàng chờ nội dung

Khi cấu hình Sanity, `/studio` là hệ quản trị nội dung gốc để lưu và xuất bản thật.

## Quy Tắc Mô Phỏng

- Tiền ảo ban đầu: `100.000.000` điểm ảo
- Không mua nếu tiền ảo không đủ
- Không bán quá số lượng đang giữ
- Phí mô phỏng: `0,15%`
- Giá vốn trung bình được cập nhật sau khi mua
- Số lượng đang giữ giảm sau khi bán
- Mã đang giữ được xóa khi số lượng về 0
- Giá trị danh mục = tiền ảo + giá trị thị trường của các mã đang giữ
- Lãi/lỗ và phần trăm lãi/lỗ được tính từ số tiền ảo ban đầu
- Có cảnh báo nếu một mã vượt 30% giá trị danh mục

## Triển Khai

Triển khai lên Vercel như một ứng dụng Next.js thông thường.

Biến môi trường cần có trên Vercel:

- Địa chỉ Supabase và khóa công khai
- Mã dự án và bộ dữ liệu Sanity
- `NEXT_PUBLIC_APP_URL`

Thanh toán chưa được triển khai trong bản thử nghiệm.

## Tuyên Bố Giới Hạn

Tuyên bố mặc định:

> Nội dung này chỉ phục vụ mục đích giáo dục và mô phỏng. Đây không phải là khuyến nghị đầu tư, khuyến nghị mua, bán hoặc nắm giữ bất kỳ chứng khoán nào. Điểm ảo không có giá trị quy đổi thành tiền thật.

Bản thử nghiệm không bao gồm:

- Giao dịch bằng tiền thật
- Nạp hoặc rút tiền
- Khớp lệnh môi giới
- Thanh toán
- Thu thập dữ liệu thị trường trực tiếp
- Tư vấn đầu tư
- Khuyến nghị mua/bán/nắm giữ
- Giá mục tiêu
- Cam kết lợi nhuận
- Bảng xếp hạng
- Ví tiền mã hóa

## Giới Hạn Hiện Tại

- Dữ liệu thị trường là dữ liệu tĩnh mô phỏng.
- Ghi dữ liệu mô phỏng ưu tiên trình duyệt trước và đồng bộ Supabase khi đã cấu hình.
- Tòa soạn trong app hiện lưu bản thử nghiệm bằng bộ nhớ cục bộ; Sanity Studio là nơi xuất bản thật.
- Chưa có luồng thanh toán.
- Chưa có nhà cung cấp dữ liệu thị trường trực tiếp.
- Chưa có hệ thống thông báo.
- Chưa bật đăng nhập Google mặc định.

## Giai Đoạn Tiếp Theo

- Thêm kiểu TypeScript sinh từ Supabase.
- Chuyển thực thi giao dịch sang hàm Postgres nguyên tử.
- Thêm phân tích hiệu quả nội dung và thực hành.
- Đồng bộ tòa soạn trong app với Sanity bằng quyền quản trị.
- Thêm nhà cung cấp dữ liệu thị trường có giấy phép qua lớp dữ liệu hiện có.
- Thêm bảng quản trị nội dung và công cụ kiểm duyệt chỉ dành cho quản trị viên.
