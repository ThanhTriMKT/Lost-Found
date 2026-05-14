# 2212477 – Phan Thanh Trí
# TÀI LIỆU TỔNG QUAN DỰ ÁN

## ỨNG DỤNG TÌM VÀ GỬI ĐỒ BỊ MẤT (LOST & FOUND) CHO SINH VIÊN

---

## 1. Giới thiệu dự án

### 1.1 Tên đề tài
Xây dựng ứng dụng Lost & Found hỗ trợ sinh viên tìm kiếm và trả lại đồ thất lạc sử dụng React và Supabase.

### 1.2 Mô tả đề tài
Hệ thống Lost & Found là một nền tảng web hỗ trợ sinh viên đăng tải thông tin về các vật dụng bị mất hoặc nhặt được trong khuôn viên trường học.

Người dùng có thể:
- Đăng bài mất đồ
- Đăng bài nhặt được đồ
- Tìm kiếm bài đăng liên quan
- Nhắn tin trao đổi với nhau
- Nhận thông báo realtime khi có cập nhật mới

Hệ thống xây dựng bằng React cho frontend và Supabase cho backend, database, authentication và realtime.

### 1.3 Lý do chọn đề tài
Trong môi trường đại học, sinh viên thường xuyên:
- Làm mất thẻ sinh viên
- Mất ví
- Mất chìa khóa
- Bỏ quên laptop, tai nghe, áo khoác,...

Hiện nay việc tìm kiếm chủ yếu:
- Đăng Facebook
- Hỏi trực tiếp
- Đăng trong group trường

Các phương pháp này:
- Khó quản lý
- Dễ trôi bài
- Không tập trung
- Thiếu tính xác thực

Vì vậy cần xây dựng một hệ thống tập trung giúp:
- Tăng khả năng tìm lại đồ
- Kết nối người mất và người nhặt
- Giảm thất lạc tài sản trong trường học

---

## 2. Mục tiêu dự án

### 2.1 Mục tiêu chính
Xây dựng website Lost & Found giúp sinh viên:
- Nhanh chóng tìm lại tài sản thất lạc thông qua nền tảng tập trung.
- Tạo ra môi trường chia sẻ thông tin mất/nhặt đồ tin cậy, dễ sử dụng.

---

## 3. Cài đặt và sử dụng

### 3.1 Công nghệ
- **Frontend:** React + Next.js 15
- **Styling:** Tailwind CSS
- **Backend / Database / Auth / Realtime:** Supabase (PostgreSQL)

### 3.2 Hướng dẫn cài đặt

**Bước 1:** Clone và cài dependencies:
```bash
npm install
```

**Bước 2:** Cấu hình biến môi trường:
Tạo file `.env.local`:
```bash
cp .env.local.example .env.local
```
Và điền thông tin Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Bước 3:** Khởi tạo cơ sở dữ liệu:
Vào **Supabase Dashboard → SQL Editor**, chạy file `supabase/schema.sql`.

**Bước 4:** Chạy ứng dụng:
```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:3000`.

---
*Xem file `SUPABASE_GUIDE.md` để biết thêm chi tiết về cấu hình backend.*
