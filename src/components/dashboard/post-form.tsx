"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Post, PostType, ItemCategory, CATEGORY_LABELS } from "@/types/database";

interface PostFormProps { post?: Post; defaultType?: PostType; }

export function PostForm({ post, defaultType = "lost" }: PostFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const isEditing = !!post;

  const [type, setType]           = useState<PostType>(post?.type || defaultType);
  const [title, setTitle]         = useState(post?.title || "");
  const [description, setDesc]    = useState(post?.description || "");
  const [category, setCategory]   = useState<ItemCategory>(post?.category || "other");
  const [location, setLocation]   = useState(post?.location || "");
  const [itemDate, setItemDate]   = useState(post?.item_date || new Date().toISOString().split("T")[0]);
  const [imageUrl, setImageUrl]   = useState(post?.image_url || "");
  const [contactInfo, setContact] = useState(post?.contact_info || "");
  const [error, setError]         = useState<string | null>(null);
  const [loading, setLoading]     = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setError("Bạn cần đăng nhập"); return; }

      const payload = {
        type, title: title.trim(), description: description.trim() || null,
        category, location: location.trim(), item_date: itemDate,
        image_url: imageUrl.trim() || null, contact_info: contactInfo.trim() || null,
        author_id: user.id, status: "active",
      };

      if (isEditing) {
        const { error } = await supabase.from("posts").update(payload).eq("id", post.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("posts").insert(payload);
        if (error) throw error;
      }
      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {error && <div className="alert alert-error">{error}</div>}

      {/* Type */}
      <div>
        <label className="clay-label">Loại bài đăng <span style={{ color: "var(--clr-coral)" }}>*</span></label>
        <div style={{ display: "flex", gap: "12px" }}>
          {([["lost", "😟 Tôi BỊ MẤT đồ", "var(--clr-coral)", "#e05555"], ["found", "🙌 Tôi NHẶT ĐƯỢC đồ", "var(--clr-sky)", "#3ab5ac"]] as const).map(([val, label, color, border]) => (
            <label key={val} style={{ flex: 1, cursor: "pointer", border: `3px solid ${type === val ? border : "var(--clr-border)"}`, borderRadius: "var(--radius-md)", padding: "14px 18px", background: type === val ? `${color}15` : "#fff", display: "flex", alignItems: "center", gap: "12px" }}>
              <input type="radio" value={val} checked={type === val} onChange={() => setType(val)} style={{ width: 18, height: 18 }} />
              <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="clay-label">Tiêu đề <span style={{ color: "var(--clr-coral)" }}>*</span></label>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="clay-input" placeholder={type === "lost" ? "Vd: Mất thẻ sinh viên - Nguyễn Văn A" : "Vd: Nhặt được ví da màu nâu tại thư viện"} />
      </div>

      {/* Category + Location */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div>
          <label className="clay-label">Danh mục <span style={{ color: "var(--clr-coral)" }}>*</span></label>
          <select value={category} onChange={e => setCategory(e.target.value as ItemCategory)} className="clay-input">
            {(Object.entries(CATEGORY_LABELS) as [ItemCategory, string][]).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="clay-label">Địa điểm <span style={{ color: "var(--clr-coral)" }}>*</span></label>
          <input type="text" value={location} onChange={e => setLocation(e.target.value)} required className="clay-input" placeholder="Vd: Căng tin tầng 1 nhà A" />
        </div>
      </div>

      {/* Date */}
      <div>
        <label className="clay-label">Ngày {type === "lost" ? "mất" : "nhặt"} <span style={{ color: "var(--clr-coral)" }}>*</span></label>
        <input type="date" value={itemDate} onChange={e => setItemDate(e.target.value)} required className="clay-input" max={new Date().toISOString().split("T")[0]} />
      </div>

      {/* Description */}
      <div>
        <label className="clay-label">Mô tả chi tiết</label>
        <textarea value={description} onChange={e => setDesc(e.target.value)} rows={4} className="clay-input" placeholder="Mô tả đặc điểm nhận dạng, màu sắc, thông tin đặc trưng..." style={{ resize: "vertical" }} />
      </div>

      {/* Image URL */}
      <div>
        <label className="clay-label">URL hình ảnh vật phẩm</label>
        <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="clay-input" placeholder="https://..." />
        {imageUrl && <img src={imageUrl} alt="preview" style={{ marginTop: 8, maxHeight: 160, borderRadius: 8, border: "2px solid var(--clr-border)" }} onError={e => (e.currentTarget.style.display = "none")} />}
      </div>

      {/* Contact */}
      <div>
        <label className="clay-label">Thông tin liên hệ thêm</label>
        <input type="text" value={contactInfo} onChange={e => setContact(e.target.value)} className="clay-input" placeholder="Vd: Số điện thoại, Zalo, Facebook..." />
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", paddingTop: "8px" }}>
        <button type="button" onClick={() => router.back()} className="btn btn-ghost">Hủy</button>
        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? "Đang lưu..." : isEditing ? "💾 Cập nhật" : "✦ Đăng bài"}
        </button>
      </div>
    </form>
  );
}
