# Hướng dẫn cấu hình Supabase cho Lost & Found

## Bước 1 — Tạo project Supabase

1. Vào https://supabase.com → **New project**
2. Đặt tên project, chọn region **Southeast Asia (Singapore)**
3. Đặt mật khẩu database → **Create new project**

## Bước 2 — Lấy API Keys

1. Vào **Project Settings** (icon bánh răng góc trái dưới)
2. Chọn **API**
3. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Dán vào file `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Bước 3 — Chạy Schema SQL

1. Vào **SQL Editor** (icon database góc trái)
2. Click **New query**
3. Copy toàn bộ nội dung file `supabase/schema.sql`
4. Dán vào editor → Click **Run** (hoặc Ctrl+Enter)
5. Kiểm tra kết quả: phải thấy bảng `profiles`, `posts`, `messages`

> ⚠️ Nếu báo lỗi `already exists` → schema đã chạy rồi, không cần chạy lại.

## Bước 4 — Tạo Storage Bucket (cho ảnh)

Schema đã tự tạo bucket `item-images`. Kiểm tra tại:
1. Vào **Storage** (icon thư mục góc trái)
2. Phải thấy bucket `item-images` với visibility **Public**

Nếu chưa có, tạo thủ công:
1. Click **New bucket**
2. Tên: `item-images`
3. Bật **Public bucket** → Save

## Bước 5 — Cấu hình Authentication

1. Vào **Authentication → Providers**
2. **Email** đã bật mặc định ✅
3. Có thể bật thêm **Google OAuth** nếu muốn

### Cấu hình Email Redirect URL

1. Vào **Authentication → URL Configuration**
2. **Site URL**: `http://localhost:3000` (dev) hoặc URL thật khi deploy
3. **Redirect URLs**: thêm `http://localhost:3000/auth/callback`

## Bước 6 — Bật Realtime (cho tin nhắn)

1. Vào **Database → Replication**
2. Tìm bảng `messages` → bật toggle ON
3. (Schema đã chạy lệnh này tự động qua `supabase_realtime`)

## Kiểm tra hoạt động

### Xem dữ liệu
- **Table Editor** → chọn bảng → xem/sửa dữ liệu trực tiếp

### Xem người dùng đăng ký
- **Authentication → Users** → danh sách user

### Xem logs lỗi
- **Logs → API** → theo dõi requests và lỗi realtime

### Chạy SQL tùy ý
- **SQL Editor** → viết và chạy SQL để kiểm tra

## Lỗi thường gặp

| Lỗi | Nguyên nhân | Cách sửa |
|-----|-------------|----------|
| `new row violates RLS policy` | RLS chặn request | Kiểm tra policies tại **Authentication → Policies** |
| `relation does not exist` | Chưa chạy schema | Chạy lại `schema.sql` |
| `JWT expired` | Token hết hạn | Đăng xuất và đăng nhập lại |
| Storage 403 | Bucket chưa public | Vào Storage → bucket → Settings → bật Public |
