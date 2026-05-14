// src/types/database.ts
// TypeScript types cho Lost & Found database schema

export type PostType = "lost" | "found";
export type PostStatus = "active" | "resolved" | "closed";
export type ItemCategory =
  | "electronics"
  | "documents"
  | "clothing"
  | "keys"
  | "bags"
  | "books"
  | "other";

export const CATEGORY_LABELS: Record<ItemCategory, string> = {
  electronics: "💻 Thiết bị điện tử",
  documents:   "📄 Giấy tờ / Ví",
  clothing:    "👕 Quần áo / Phụ kiện",
  keys:        "🔑 Chìa khóa",
  bags:        "🎒 Túi xách / Balo",
  books:       "📚 Sách vở / Tài liệu",
  other:       "📦 Khác",
};

export const STATUS_LABELS: Record<PostStatus, string> = {
  active:   "Đang tìm",
  resolved: "Đã tìm được",
  closed:   "Đã đóng",
};

export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  student_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  author_id: string;
  type: PostType;
  title: string;
  description: string | null;
  category: ItemCategory;
  location: string;
  item_date: string;
  image_url: string | null;
  status: PostStatus;
  contact_info: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  profiles?: Profile;
}

export interface Message {
  id: string;
  post_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  // Joined
  sender?: Profile;
  receiver?: Profile;
}
