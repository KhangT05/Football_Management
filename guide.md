# Hướng Dẫn Cài Đặt, Vận Hành & Sử Dụng Hệ Thống Quản Lý Giải Bóng Đá (Football Management)

## 1. Kiến Trúc & Tổng Quan Hệ Thống

Dự án Quản lý Giải Bóng Đá (Football Management) là một hệ thống web toàn diện, hỗ trợ quản lý các giải đấu, đội bóng, lịch thi đấu, và cập nhật kết quả trận đấu trực tiếp (live control).

**Công nghệ sử dụng (Tech Stack):**
- **Frontend (Web):** React 19, Vite, TailwindCSS, Zustand, React Query, Socket.io-client.
- **Backend (API):** Node.js, Express, TypeScript, Prisma ORM, MySQL/MariaDB, Zod, Swagger, JWT, Redis.

**Kiến trúc luồng dữ liệu:**
Traffic đi vào qua 1 entrypoint Nginx (port 80/443), sau đó được định tuyến (route) dựa theo path:
- `/` → `frontend:80` (Nginx-alpine phục vụ file tĩnh của Vite/React SPA).
- `/api/` → `api:3000` (Backend REST API).
- `/swagger` → `api:3000` (Swagger UI Documentation).
- Backend (api) giao tiếp nội bộ với `mysql:3306` (Primary Datastore) và `redis:6379` (Cache/Session).

**Cấu trúc thư mục chính:**
```text
FOOTBALL_MANAGEMENT/
├── api/                  # Express + TSOA + Prisma backend
│   ├── prisma/           # schema.prisma, migrations
│   ├── src/              # Source code logic
│   └── Dockerfile        # Backend container build
├── frontend/             # React 19 + Vite SPA
│   ├── src/              # Source code UI
│   ├── Dockerfile        # Frontend container build
│   └── nginx-fe.conf     # nginx config bên trong image frontend
├── nginx.conf            # Reverse proxy tầng ngoài (edge)
├── docker-compose.yml    # File orchestrate chạy toàn bộ hệ thống
└── import-template.xlsx  # Template file mẫu dùng để import dữ liệu giải đấu
```

---

## 2. Yêu Cầu Hệ Thống (Prerequisites)

Để vận hành hệ thống, môi trường của bạn cần có:
1. **Node.js**: Phiên bản `>= 20.x` (tương đương base image `node:20-alpine`).
2. **Docker & Docker Compose v2**: Khuyên dùng để chạy toàn bộ hệ thống đồng nhất theo Compose.
3. **Database**: MySQL 8.0 (hoặc MariaDB tương thích). Client driver sử dụng `@prisma/adapter-mariadb`.
4. **Redis**: Phiên bản `7.x` dùng cho caching, session, và rate-limit.

---

## 3. Cấu Hình Biến Môi Trường (.env)

Hệ thống yêu cầu một file `.env` đặt tại thư mục gốc của dự án. Dưới đây là các biến môi trường bắt buộc hoặc quan trọng:

| Key | Mô tả |
|---|---|
| `DATABASE_URL` | Bắt buộc. VD: `mysql://user:pass@mysql:3306/football_management` (dùng host `mysql` trong Docker, `localhost` khi chạy dev). |
| `MYSQL_DATABASE` / `MYSQL_ROOT_PASSWORD` | Tên DB và Mật khẩu root khi khởi tạo container MySQL. |
| `NODE_ENV` | `development` hoặc `production`. |
| `JWT_SECRET` | Khóa bí mật (secret string) dùng để ký JWT access và refresh token. |
| `APP_ORIGIN` | Origin của Backend, dùng cho CORS / redirect callback OAuth. |
| `FRONTEND_URL` | URL của Frontend (VD: `http://localhost:5173`), dùng trong email link và CORS. |
| `REDIS_URL` / `REDIS_PASSWORD` | Thông tin kết nối Redis Server. |
| `CLOUDINARY_*` | (Tùy chọn) API Key/Secret của Cloudinary để upload Logo/Avatar. |
| `VNPAY_*` | (Tùy chọn) `TMN_CODE`, `SECURE_SECRET`, `HOST` của VNPay cho chức năng thanh toán. |
| `SMTP_*` | Bắt buộc. Config tài khoản gửi email (Host, Port, User, Pass) phục vụ tính năng xác thực và thông báo. |

---

## 4. Hướng Dẫn Cài Đặt & Chạy Local (Không qua Docker)

### 4.1. Backend (`/api`)
Cần MySQL và Redis chạy sẵn ở Local:
```bash
cd api
cp .env.example .env      # Điều chỉnh lại DATABASE_URL và REDIS_URL trỏ về localhost
npm ci                    # Cài đặt thư viện
npx prisma generate       # Sinh Prisma Client vào src/generated/prisma
npx prisma migrate dev    # Apply schema vào Database
npm run dev               # Chạy server với hot-reload
```

### 4.2. Frontend (`/frontend`)
```bash
cd frontend
npm ci
npm run dev               # Vite dev server mặc định ở port cấu hình (ví dụ 3001/5173)
```
*(Lưu ý: Proxy của Vite trong `vite.config.js` hiện target cứng tới 1 IP cụ thể. Bạn cần sửa thành `target: process.env.VITE_DEV_API_URL || 'http://localhost:3000'` để API call chuẩn xác về backend local).*

---

## 5. Triển Khai Bằng Docker Compose (Production-like)

Đây là cách chuẩn xác nhất để giả lập/deploy production. Từ thư mục gốc, đảm bảo file `.env` đã điền đủ thông tin, chạy lệnh:

```bash
docker compose up -d --build
docker compose logs -f api  # Xem log để đảm bảo backend migrate thành công
```

**Thứ tự khởi động hệ thống:**
1. `mysql` và `redis` khởi động trước.
2. `api` khởi động (có thể fail ở bước `prisma migrate deploy` trong lần đầu nếu MySQL chưa sẵn sàng accept connection, nếu gặp lỗi `connection refused`, bạn hãy chạy lại: `docker compose up -d api`).
3. `nginx` khởi động cuối để nhận traffic.

**Truy cập hệ thống:**
- Frontend: `http://localhost/`
- API REST: `http://localhost/api/`
- Swagger UI Docs: `http://localhost/swagger`

---

## 6. Lưu Ý Kỹ Thuật Chuyên Sâu (Vận Hành & Bảo Mật)

### Database (Prisma)
- Dự án sử dụng `@prisma/adapter-mariadb` (Prisma 7). Client output custom ra thư mục `api/src/generated/prisma`. Hãy thận trọng khi code, import phải trỏ về thư mục generated này thay vì `@prisma/client`.
- Trường cấu hình linh hoạt (VD: `tiebreaker_order`, `custom_stages`) lưu định dạng `JSON` tự do. Việc validate data nằm hoàn toàn ở tầng Logic Code (Zod), không ở Schema DB.

### Nginx Routing & Sửa Lỗi Tồn Đọng
File `nginx.conf` gốc cần điều chỉnh những nội dung sau khi public thực tế:
- **Lỗi thiếu WebSocket Router**: Frontend dùng `socket.io-client`. Hiện tại `nginx.conf` chưa có block bắt `/socket.io/`, request realtime sẽ trôi nhầm sang frontend gây lỗi. *Cần bổ sung config `location /socket.io/ { proxy_pass http://api:3000; ... proxy_set_header Upgrade $http_upgrade; ... }`.*
- **Lỗi cấu hình SSL**: Port `443` được expose qua compose nhưng chưa có Block Server lắng nghe cổng 443 và cert trong `nginx.conf`. 
- **Security Port**: Gỡ bỏ block publish `ports: "3000:3000"` của container `api` khỏi docker-compose. Chỉ nội bộ Nginx gọi qua network nội bộ (port 3000 public trực tiếp là không cần thiết).
- Khuyên dùng User MySQL phân quyền riêng thay vì tài khoản `root`.

---

## 7. Hướng Dẫn Sử Dụng Nghiệp Vụ Chính

### 7.1. Nhập Luật Giải Đấu (Tournament Rules)
Hệ thống hỗ trợ import file luật giải đấu (PDF/DOCX) để tự động trích xuất cấu hình:
- Bạn tải lên file quy chế. Hệ thống Rule Engine sẽ phân tích, đưa ra chuẩn hóa điểm số (Thắng/Hòa/Thua) và tiêu chí xếp hạng (Tiebreaker).
- Hệ thống sẽ validate chặt chẽ *(VD: Điểm Thắng > Hòa >= Thua)* và chặn các dữ liệu trùng lặp trước khi lưu, đảm bảo công thức xếp hạng luôn chính xác.

### 7.2. Quản Lý Trận Đấu & Live Control
- **Luồng trạng thái:** Từ `scheduled` (Chưa đá) -> `ongoing` (Đang diễn ra) -> `pending_official` (Chờ duyệt) -> `finished` (Kết thúc).
- **Cập nhật Live:** Trong lúc trận đấu diễn ra, trọng tài ghi nhận các sự kiện (Bàn thắng, Thẻ vàng, Thẻ đỏ). Tỷ số sẽ được hệ thống cộng dồn và cập nhật realtime cho khán giả qua Socket.io.
- **Grace Period (Thời gian duyệt):** Khi hết giờ, hệ thống cho phép **15 phút** tạm chờ để Ban tổ chức/Trọng tài kiểm tra (hoặc có tranh chấp appeal) trước khi xác nhận thành Official Match Result.

### 7.3. Xếp Hạng & Vòng Loại (Standings & Knockout)
- **Vòng Bảng:** Bảng xếp hạng cập nhật tự động sau từng trận đấu (Tính Điểm -> Xét Hiệu Số -> Xét Đối Đầu trực tiếp dựa vào Rule đã import).
- **Vòng Knockout:** Hệ thống tự xác định đội thắng (sau các khoảng thời gian Extra Time, Penalty nếu có) và tự động ghi danh đội đi tiếp vào nhánh đấu tiếp theo.

### 7.4. Đồng Bộ & Xác Thực Phiên Làm Việc (Device Auth Sync)
- Mọi thiết bị (Web Browser/App Mobile) đều được gán `deviceId` giúp chống đánh cắp token.
- Hỗ trợ đầy đủ ba phương thức xác thực:
  - Mật khẩu truyền thống.
  - OAuth 2.0 (Google, Facebook...).
  - WebAuthn (Passkey - Đăng nhập FaceID/Vân tay không cần mật khẩu).
