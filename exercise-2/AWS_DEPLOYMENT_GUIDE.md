# HƯỚNG DẪN TRIỂN KHAI EXERCISE 2 LÊN AMAZON WEB SERVICES (AWS)

Tài liệu này hướng dẫn chi tiết từng bước đưa hệ thống **NihonGo App (Exercise 2)** lên máy chủ **AWS EC2 (Elastic Compute Cloud)** để giảng viên và người chấm có thể truy cập, kiểm tra và nghiệm thu đồ án DevOps.

---

## 1. Kiến Trúc Hệ Thống (Multi-Container Architecture)

Exercise 2 được xây dựng theo mô hình dịch vụ container hóa độc lập với **Docker Compose**:

```
                  Internet (Người dùng & Giảng viên)
                                 │
                                 ▼
                     [ Cổng 80: HTTP Chuẩn AWS ]
                                 │
                ┌────────────────┴────────────────┐
                │                                 │
                ▼                                 ▼
      http://<EC2_IP>/                  http://<EC2_IP>/admin
   (Giao diện Học tập Sinh viên)     (Trang Quản trị Admin Panel)
                │                                 │
                └──────────────┬──────────────────┘
                               │
               ┌───────────────▼───────────────┐
               │    Frontend Container         │
               │    (Nginx Alpine Reverse)     │
               └───────────────┬───────────────┘
                               │ proxy /api/
                               ▼ (Mạng nội bộ Docker :5000)
               ┌───────────────────────────────┐
               │    Backend Container          │
               │    (Node.js 18 Express API)   │
               └───────────────┬───────────────┘
                               │
                               ▼
               ┌───────────────────────────────┐
               │  Volume: backend-data         │
               │  (/app/data/users.json)       │
               │  Lưu trữ bền vững trên AWS   │
               └───────────────────────────────┘
```

1. **Frontend Container (`nihongo-frontend-full` - Nginx Alpine):**
   - Lắng nghe cổng **80 (HTTP)** chuẩn trên AWS.
   - Định tuyến `/` vào trang học tập (`index.html`).
   - Định tuyến `/admin` hoặc `/admin.html` vào **Admin Panel chuyên biệt** (`admin.html` + `admin.css` + `admin.js`).
   - Reverse Proxy tất cả request `/api/*` về Backend Container.
   - Bật nén Gzip giúp tải trang cực nhanh qua Internet.

2. **Backend API Container (`nihongo-backend` - Node.js 18 Express):**
   - Cung cấp toàn bộ RESTful API cho xác thực, tính điểm, lịch sử và quản trị viên.
   - Endpoint Health Check `/api/health` giám sát trạng thái thời gian thực.
   - Dữ liệu được lưu trữ tự động vào volume `backend-data`, đảm bảo không bị mất dữ liệu khi restart container hoặc reboot EC2.

---

## 2. Các Bước Triển Khai Lên AWS EC2

### Bước 1: Khởi tạo máy chủ EC2 trên AWS Console
1. Đăng nhập vào [AWS Management Console](https://aws.amazon.com/console/).
2. Vào dịch vụ **EC2** → Chọn **Launch Instance**.
3. **Cấu hình đề xuất:**
   - **Name:** `NihonGo-App-Server`
   - **OS Image (AMI):** `Ubuntu Server 24.04 LTS` hoặc `Ubuntu 22.04 LTS` (Free Tier eligible).
   - **Instance Type:** `t2.micro` (hoặc `t3.micro` - Free Tier).
   - **Key Pair:** Tạo mới hoặc chọn Key Pair của bạn (file `.pem`) để SSH.

### Bước 2: Cấu hình Mạng & Security Group (Bắt buộc)
Trong phần **Network Settings / Security Group**, cấu hình mở các cổng sau:
| Loại kết nối | Port Range | Nguồn (Source) | Mục đích |
| :--- | :--- | :--- | :--- |
| **HTTP** | **80** | `0.0.0.0/0` (Anywhere) | **Truy cập Web & Admin Panel từ trình duyệt** |
| **SSH** | **22** | `My IP` hoặc `0.0.0.0/0` | Quản trị máy chủ từ xa |
| **HTTPS** (tùy chọn) | **443** | `0.0.0.0/0` | Chứng chỉ SSL (nếu có domain) |

> ⚠️ **Lưu ý:** Không cần mở cổng 5000 ra Internet vì Nginx đã làm reverse proxy nội bộ bảo mật cho Backend API.

---

### Bước 3: Đăng nhập SSH vào máy chủ EC2
Mở terminal trên máy tính của bạn và chạy lệnh:
```bash
ssh -i "duong-dan-toi-file-key.pem" ubuntu@<EC2_PUBLIC_IP>
```

---

### Bước 4: Tải mã nguồn và triển khai bằng 1 lệnh

#### Cách 1: Sử dụng script tự động (Khuyên dùng)
```bash
# 1. Clone repository
git clone https://github.com/nahthan123/NIHONGO_APP.git
cd NIHONGO_APP/exercise-2

# 2. Cấp quyền và chạy script triển khai tự động
chmod +x deploy-aws.sh
./deploy-aws.sh
```

#### Cách 2: Triển khai thủ công bằng Docker Compose
```bash
# 1. Cài đặt Docker & Docker Compose (nếu máy mới tạo)
sudo apt-get update -y
sudo apt-get install -y docker.io docker-compose-v2
sudo usermod -aG docker $USER
newgrp docker

# 2. Chuyển vào thư mục exercise-2
cd NIHONGO_APP/exercise-2

# 3. Khởi chạy hệ thống ở chế độ nền
docker compose up -d --build
```

---

## 3. Kiểm Tra & Nghiệm Thu Hệ Thống (Dành Cho Giảng Viên)

Sau khi deploy xong, mở trình duyệt web và truy cập vào địa chỉ IP công khai của EC2 (`<EC2_PUBLIC_IP>`):

### 1. Truy cập Ứng dụng Học tập (Client View):
```
http://<EC2_PUBLIC_IP>/
```
- Đầy đủ tính năng: Học từ vựng Flashcard, Mẫu câu hội thoại, Game Trắc nghiệm tính điểm 10 câu, Bảng xếp hạng.

### 2. Truy cập Bảng Quản Trị Hệ Thống (Admin Panel):
```
http://<EC2_PUBLIC_IP>/admin
```
*(hoặc truy cập `http://<EC2_PUBLIC_IP>/admin.html`)*

#### Thông tin tài khoản Admin mặc định để kiểm tra:
- **Email:** `admin@nihongo.local`
- **Mật khẩu:** `admin123`
*(Trang Admin có sẵn nút bấm **"Điền nhanh thông tin Admin Demo"** để đăng nhập ngay chỉ với 1 cú click!)*

### Các chức năng nổi bật trên Admin Panel:
1. **Tổng quan hệ thống (Overview):**
   - KPI thống kê thời gian thực: Tổng người dùng, Số lượng Admin, Điểm thưởng toàn hệ thống, Tổng từ vựng đã ghi nhớ.
2. **Quản lý người dùng (User Management):**
   - Tìm kiếm nhanh theo tên hoặc email.
   - Lọc theo vai trò (Admin / Học viên) và sắp xếp điểm số.
   - Thêm người dùng mới trực tiếp từ Admin.
   - Sửa thông tin điểm số, cấp độ.
   - Đặt lại mật khẩu (Reset Password).
   - Xem chi tiết lịch sử học tập (History Timeline).
   - Đổi quyền (Lên Admin / Hạ quyền).
   - Xóa tài khoản an toàn (có xác nhận bảo vệ).
3. **Bảng xếp hạng (Leaderboard):**
   - Danh sách Top 10 học viên dẫn đầu hệ thống.
4. **Hạ tầng AWS & Server Status:**
   - Hiển thị Uptime máy chủ, RAM tiêu thụ, phiên bản Node.js.
   - Ping live server latency liên tục qua endpoint `/api/health`.
   - Nút **Xuất JSON** sao lưu toàn bộ cơ sở dữ liệu người dùng ra file.

---

## 4. Các Lệnh DevOps Hữu Ích Khi Vận Hành

| Tác vụ | Lệnh thực thi |
| :--- | :--- |
| **Xem trạng thái các container** | `docker compose ps` |
| **Xem log thời gian thực** | `docker compose logs -f` |
| **Xem log riêng Backend API** | `docker compose logs -f backend` |
| **Khởi động lại toàn bộ dịch vụ** | `docker compose restart` |
| **Dừng hệ thống** | `docker compose down` |
| **Kiểm tra Health Check trực tiếp** | `curl http://localhost/api/health` |
