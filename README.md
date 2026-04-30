# Hệ Thống Web Game Tài Xỉu Multiplayer Realtime

Hệ thống web game Tài Xỉu chuyên nghiệp được xây dựng với React, Node.js, Socket.io và MongoDB.

## Tính năng
- **Realtime**: Đồng bộ thời gian và kết quả cho tất cả người chơi.
- **Server Authoritative**: Kết quả được tính toán duy nhất tại server, chống gian lận.
- **Giao diện Casino**: Dark theme, hiệu ứng Gold, Glassmorphism, responsive mượt mà.
- **Hệ thống cược**: Đặt Tài/Xỉu, hiển thị tổng cược realtime.
- **Admin Dashboard**: Quản lý người chơi, cộng/trừ tiền ảo.
- **Lịch sử**: Xem lại kết quả các ván gần nhất.

## Tech Stack
- **Frontend**: React, Vite, TailwindCSS, Framer Motion, Socket.io-client.
- **Backend**: Node.js, Express, Socket.io, MongoDB, JWT, Bcrypt.

## Cài đặt và Chạy

### 1. Backend
```bash
cd backend
npm install
npm run dev
```
*Lưu ý: Đảm bảo bạn đã cài đặt MongoDB và đang chạy ở localhost:27017 hoặc cấu hình lại trong file .env*

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

## Tài khoản Admin mặc định
Để tạo tài khoản Admin, hãy đăng ký một tài khoản bất kỳ, sau đó vào MongoDB update trường `role: "admin"` cho user đó để truy cập vào `/admin`.

## Lưu ý quan trọng
- Hệ thống sử dụng **COIN ẢO**, không sử dụng tiền thật.
- Không tích hợp bất kỳ cổng thanh toán nào.
- Chỉ sử dụng cho mục đích giải trí và học tập.
