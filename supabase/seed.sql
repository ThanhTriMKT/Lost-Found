-- ============================================================
-- LOST & FOUND — DỮ LIỆU MẪU
-- Chạy sau khi đã tạo tài khoản qua /register
-- ============================================================
-- 1. Đăng ký tại http://localhost:3000/register
-- 2. Lấy UUID tại: Supabase Dashboard → Authentication → Users
-- 3. Thay YOUR_USER_ID_HERE bằng UUID thực
-- ============================================================
/*
INSERT INTO public.posts (author_id, type, title, description, category, location, item_date, status)
VALUES
  ('YOUR_USER_ID_HERE','lost','Mất thẻ sinh viên - MSSV 2212477','Thẻ SV có ảnh, mất tại căng tin buổi sáng. Rất cần để thi cuối kỳ!','documents','Căng tin tầng 1 nhà A',CURRENT_DATE - 1,'active'),
  ('YOUR_USER_ID_HERE','found','Nhặt được ví da màu nâu','Ví có CCCD và tiền mặt. Đang giữ tại phòng Bảo vệ.','documents','Thư viện tầng 2',CURRENT_DATE,'active'),
  ('YOUR_USER_ID_HERE','lost','Mất tai nghe AirPods Pro','Hộp trắng, khắc tên. Mất ở phòng máy tính.','electronics','Phòng máy tính tầng 3 nhà B',CURRENT_DATE - 2,'active'),
  ('YOUR_USER_ID_HERE','found','Nhặt được chùm chìa khóa 3 chiếc','Có móc khóa hình gấu vàng.','keys','Sân trường gần nhà C',CURRENT_DATE,'active');
*/
SELECT id, type, title, status FROM public.posts ORDER BY created_at DESC;
