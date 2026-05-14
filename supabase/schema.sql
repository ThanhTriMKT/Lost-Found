-- ============================================================
-- LOST & FOUND — DATABASE SCHEMA
-- Ứng dụng Tìm và Gửi Đồ Bị Mất cho Sinh Viên
-- ============================================================
-- Chạy toàn bộ file này trong Supabase Dashboard → SQL Editor
-- ============================================================


-- ============================================================
-- PHẦN 1: BẢNG PROFILES
-- ============================================================

CREATE TABLE public.profiles (
  id           UUID        NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  display_name TEXT,
  avatar_url   TEXT,
  phone        TEXT,
  student_id   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  PRIMARY KEY (id)
);

COMMENT ON TABLE public.profiles IS 'User profiles — extends auth.users';

CREATE INDEX profiles_display_name_idx ON public.profiles (display_name);


-- ============================================================
-- PHẦN 2: TRIGGER TỰ ĐỘNG TẠO PROFILE KHI CÓ USER MỚI
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'display_name',
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ============================================================
-- PHẦN 3: ENUMS
-- ============================================================

-- Loại bài đăng: mất đồ hay nhặt được đồ
CREATE TYPE post_type AS ENUM ('lost', 'found');

-- Trạng thái bài đăng
CREATE TYPE post_status AS ENUM ('active', 'resolved', 'closed');

-- Danh mục vật phẩm
CREATE TYPE item_category AS ENUM (
  'electronics',    -- Thiết bị điện tử (laptop, điện thoại, tai nghe...)
  'documents',      -- Giấy tờ (thẻ SV, CCCD, ví...)
  'clothing',       -- Quần áo, phụ kiện
  'keys',           -- Chìa khóa
  'bags',           -- Túi xách, balo
  'books',          -- Sách vở, tài liệu
  'other'           -- Khác
);


-- ============================================================
-- PHẦN 4: BẢNG POSTS (Bài đăng mất/nhặt đồ)
-- ============================================================

CREATE TABLE public.posts (
  id            UUID          NOT NULL DEFAULT gen_random_uuid(),
  author_id     UUID          NOT NULL REFERENCES public.profiles ON DELETE CASCADE,
  type          post_type     NOT NULL,                    -- 'lost' hoặc 'found'
  title         TEXT          NOT NULL,
  description   TEXT,
  category      item_category NOT NULL DEFAULT 'other',
  location      TEXT          NOT NULL,                    -- Địa điểm mất/nhặt
  item_date     DATE          NOT NULL,                    -- Ngày mất/nhặt
  image_url     TEXT,                                      -- URL ảnh vật phẩm
  status        post_status   NOT NULL DEFAULT 'active',
  contact_info  TEXT,                                      -- Thông tin liên hệ thêm
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT timezone('utc'::text, now()),
  PRIMARY KEY (id)
);

COMMENT ON TABLE public.posts IS 'Bài đăng mất đồ hoặc nhặt được đồ';

CREATE INDEX posts_author_id_idx  ON public.posts (author_id);
CREATE INDEX posts_type_idx       ON public.posts (type);
CREATE INDEX posts_status_idx     ON public.posts (status);
CREATE INDEX posts_category_idx   ON public.posts (category);
CREATE INDEX posts_created_at_idx ON public.posts (created_at DESC);


-- ============================================================
-- PHẦN 5: BẢNG MESSAGES (Tin nhắn realtime)
-- ============================================================

CREATE TABLE public.messages (
  id          UUID        NOT NULL DEFAULT gen_random_uuid(),
  post_id     UUID        NOT NULL REFERENCES public.posts    ON DELETE CASCADE,
  sender_id   UUID        NOT NULL REFERENCES public.profiles ON DELETE CASCADE,
  receiver_id UUID        NOT NULL REFERENCES public.profiles ON DELETE CASCADE,
  content     TEXT        NOT NULL,
  is_read     BOOLEAN     NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  PRIMARY KEY (id)
);

COMMENT ON TABLE public.messages IS 'Tin nhắn trao đổi giữa người mất và người nhặt';

CREATE INDEX messages_post_id_idx    ON public.messages (post_id);
CREATE INDEX messages_sender_id_idx  ON public.messages (sender_id);
CREATE INDEX messages_receiver_id_idx ON public.messages (receiver_id);
CREATE INDEX messages_created_at_idx ON public.messages (created_at DESC);


-- ============================================================
-- PHẦN 6: FUNCTION CẬP NHẬT updated_at TỰ ĐỘNG
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at();

CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at();


-- ============================================================
-- PHẦN 7: BẬT ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- PHẦN 8: RLS POLICIES — PROFILES
-- ============================================================

CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING      ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);


-- ============================================================
-- PHẦN 9: RLS POLICIES — POSTS
-- ============================================================

-- Ai cũng có thể xem bài đang active
CREATE POLICY "Active posts are viewable by everyone"
  ON public.posts FOR SELECT
  TO anon, authenticated
  USING (status = 'active');

-- Author có thể xem tất cả bài của mình
CREATE POLICY "Authors can view all their own posts"
  ON public.posts FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = author_id);

-- Authenticated users có thể tạo bài đăng
CREATE POLICY "Authenticated users can create posts"
  ON public.posts FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = author_id);

-- Author có thể update bài của mình
CREATE POLICY "Authors can update their own posts"
  ON public.posts FOR UPDATE
  TO authenticated
  USING      ((SELECT auth.uid()) = author_id)
  WITH CHECK ((SELECT auth.uid()) = author_id);

-- Author có thể xóa bài của mình
CREATE POLICY "Authors can delete their own posts"
  ON public.posts FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) = author_id);


-- ============================================================
-- PHẦN 10: RLS POLICIES — MESSAGES
-- ============================================================

-- Chỉ người gửi hoặc nhận mới được xem tin nhắn
CREATE POLICY "Users can view their own messages"
  ON public.messages FOR SELECT
  TO authenticated
  USING (
    (SELECT auth.uid()) = sender_id OR
    (SELECT auth.uid()) = receiver_id
  );

-- Authenticated users có thể gửi tin nhắn
CREATE POLICY "Authenticated users can send messages"
  ON public.messages FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = sender_id);

-- Receiver có thể đánh dấu đã đọc
CREATE POLICY "Receivers can mark messages as read"
  ON public.messages FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = receiver_id);


-- ============================================================
-- PHẦN 11: ENABLE REALTIME cho bảng messages
-- ============================================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;


-- ============================================================
-- PHẦN 12: STORAGE BUCKET cho ảnh vật phẩm
-- ============================================================

-- Chạy trong SQL Editor để tạo bucket (hoặc tạo thủ công trên Dashboard)
INSERT INTO storage.buckets (id, name, public)
VALUES ('item-images', 'item-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Ai cũng xem được ảnh
CREATE POLICY "Item images are publicly accessible"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'item-images');

-- Policy: Authenticated user upload ảnh
CREATE POLICY "Authenticated users can upload item images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'item-images');

-- Policy: User xóa ảnh của mình
CREATE POLICY "Users can delete their own item images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'item-images' AND (storage.foldername(name))[1] = (SELECT auth.uid())::text);


-- ============================================================
-- KIỂM TRA
-- ============================================================
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('profiles', 'posts', 'messages')
ORDER BY table_name;
