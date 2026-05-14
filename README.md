# Lost & Found — Ứng dụng Tìm và Gửi Đồ Bị Mất

Hệ thống web hỗ trợ sinh viên đăng tải thông tin về các vật dụng bị mất hoặc nhặt được trong khuôn viên trường học.

## Công nghệ

| Thành phần | Công nghệ |
|---|---|
| Frontend | React + Next.js 15 |
| Styling | Tailwind CSS |
| Backend | Supabase |
| Database | PostgreSQL (Supabase) |
| Auth | Supabase Auth |
| Realtime | Supabase Realtime |
| Storage | Supabase Storage |

## Tính năng

- ✅ Đăng ký / Đăng nhập
- ✅ Đăng bài MẤT ĐỒ hoặc NHẶT ĐƯỢC
- ✅ Tìm kiếm & lọc theo loại, danh mục
- ✅ Nhắn tin liên hệ với người đăng
- ✅ Quản lý bài đăng cá nhân
- ✅ Đánh dấu đã tìm được
- ✅ Upload ảnh qua URL

## Cài đặt

### 1. Clone và cài dependencies

```bash
npm install
```

### 2. Tạo file `.env.local`

```bash
cp .env.local.example .env.local
```

Điền thông tin Supabase vào `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Tạo database trên Supabase

Vào **Supabase Dashboard → SQL Editor**, chạy file `supabase/schema.sql`.

### 4. Chạy ứng dụng

```bash
npm run dev
```

## Hướng dẫn Supabase

Xem file `SUPABASE_GUIDE.md` để biết chi tiết cách cấu hình Supabase.
