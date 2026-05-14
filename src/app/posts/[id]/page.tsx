import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { CATEGORY_LABELS, ItemCategory } from "@/types/database";
import Link from "next/link";
import { MessageForm } from "@/components/posts/message-form";

interface Props { params: Promise<{ id: string }> }

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: post } = await supabase
    .from("posts")
    .select("*, profiles(id, display_name, avatar_url, phone, student_id)")
    .eq("id", id)
    .single();
  if (!post) notFound();

  const isOwner = user?.id === post.author_id;

  // Load messages for owner
  let messages: any[] = [];
  if (isOwner) {
    const { data } = await supabase
      .from("messages")
      .select("*, sender:profiles!messages_sender_id_fkey(display_name)")
      .eq("post_id", id)
      .order("created_at", { ascending: true });
    messages = data || [];
  }

  return (
    <main style={{ padding: "48px 0 96px", position: "relative", zIndex: 1 }}>
      <div className="container" style={{ maxWidth: "800px" }}>
        <div style={{ marginBottom: "24px" }}>
          <Link href="/" className="btn btn-ghost" style={{ padding: "8px 16px", fontSize: "0.9rem" }}>Quay lại trang chủ</Link>
        </div>

        <div style={{ background: "#fff", borderRadius: "var(--radius-xl)", border: `3px solid ${post.type === "lost" ? "var(--clr-coral)" : "var(--clr-sky)"}`, padding: "40px", boxShadow: post.type === "lost" ? "var(--shadow-coral)" : "var(--shadow-sky)", marginBottom: "32px" }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "20px", flexWrap: "wrap" }}>
            <span className={`badge ${post.type === "lost" ? "badge-coral" : "badge-sky"}`} style={{ fontSize: "0.9rem", padding: "6px 16px" }}>
              {post.type === "lost" ? "Đồ bị mất" : "Nhặt được đồ"}
            </span>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, background: post.status === "resolved" ? "#e8f5e9" : "var(--clr-surface)", color: post.status === "resolved" ? "#388e3c" : "var(--clr-text-muted)", border: "2px solid", borderColor: post.status === "resolved" ? "#a5d6a7" : "var(--clr-border)", borderRadius: "8px", padding: "4px 12px" }}>
              {post.status === "active" ? "Đang tìm" : post.status === "resolved" ? "Đã giải quyết" : "Đã đóng"}
            </span>
          </div>

          <h1 style={{ fontSize: "var(--fs-h1)", fontWeight: 800, color: "var(--clr-text)", margin: "0 0 20px", lineHeight: 1.3 }}>{post.title}</h1>

          {post.image_url && (
            <div style={{ marginBottom: "24px", borderRadius: "16px", overflow: "hidden", border: "3px solid var(--clr-border)", maxHeight: "400px" }}>
              <img src={post.image_url} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "24px" }}>
            {[
              { label: "Danh mục", value: CATEGORY_LABELS[post.category as ItemCategory], icon: "📂" },
              { label: "Địa điểm", value: post.location, icon: "📍" },
              { label: post.type === "lost" ? "Ngày mất" : "Ngày nhặt", value: new Date(post.item_date).toLocaleDateString("vi-VN"), icon: "📅" },
            ].map(item => (
              <div key={item.label} style={{ background: "var(--clr-surface)", borderRadius: "12px", border: "2px solid var(--clr-border)", padding: "14px 16px" }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--clr-text-muted)", marginBottom: "4px" }}>{item.label}</div>
                <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--clr-text)" }}>{item.value}</div>
              </div>
            ))}
          </div>

          {post.description && (
            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--clr-text-muted)", marginBottom: "8px" }}>Mô tả chi tiết</h3>
              <p style={{ lineHeight: 1.7, color: "var(--clr-text)", whiteSpace: "pre-wrap" }}>{post.description}</p>
            </div>
          )}

          <div style={{ borderTop: "2px solid var(--clr-border)", paddingTop: "20px", display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span className="clay-avatar-placeholder" style={{ width: 40, height: 40 }}>{(post.profiles?.display_name || "?").charAt(0).toUpperCase()}</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: "0.9rem" }}>{post.profiles?.display_name || "Ẩn danh"}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--clr-text-muted)" }}>Đăng lúc {new Date(post.created_at).toLocaleString("vi-VN")}</div>
              </div>
            </div>
            {post.contact_info && (
              <div style={{ background: "var(--clr-surface)", border: "2px solid var(--clr-border)", borderRadius: "10px", padding: "8px 14px", fontSize: "0.85rem" }}>
                <strong>Liên hệ:</strong> {post.contact_info}
              </div>
            )}
          </div>

          {isOwner && (
            <div style={{ marginTop: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <Link href={`/dashboard/edit/${post.id}`} className="btn btn-ghost" style={{ fontSize: "0.875rem" }}>Chỉnh sửa</Link>
              {post.status === "active" && (
                <MarkResolvedButton postId={post.id} />
              )}
            </div>
          )}
        </div>

        {/* Messages / Contact Section */}
        {!isOwner && user && post.status === "active" && (
          <div style={{ background: "#fff", borderRadius: "var(--radius-xl)", border: "3px solid var(--clr-lavender)", padding: "32px", boxShadow: "var(--shadow-lavender)" }}>
            <h2 style={{ fontWeight: 800, fontSize: "1.1rem", marginBottom: "16px" }}>Nhắn tin cho người đăng</h2>
            <MessageForm postId={post.id} receiverId={post.author_id} />
          </div>
        )}

        {isOwner && messages.length > 0 && (
          <div style={{ background: "#fff", borderRadius: "var(--radius-xl)", border: "3px solid var(--clr-lavender)", padding: "32px", boxShadow: "var(--shadow-lavender)" }}>
            <h2 style={{ fontWeight: 800, fontSize: "1.1rem", marginBottom: "20px" }}>Tin nhắn nhận được ({messages.length})</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {messages.map((msg: any) => (
                <div key={msg.id} style={{ background: "var(--clr-surface)", borderRadius: "12px", border: "2px solid var(--clr-border)", padding: "14px 16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ fontWeight: 700, fontSize: "0.85rem" }}>{msg.sender?.display_name || "Ẩn danh"}</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--clr-text-muted)" }}>{new Date(msg.created_at).toLocaleString("vi-VN")}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.9rem", lineHeight: 1.6 }}>{msg.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {!user && post.status === "active" && (
          <div className="empty-state" style={{ padding: "32px" }}>

            <p style={{ fontWeight: 700, margin: "0 0 16px" }}>Đăng nhập để liên hệ với người đăng</p>
            <Link href="/login" className="btn btn-primary">Đăng nhập</Link>
          </div>
        )}
      </div>
    </main>
  );
}

function MarkResolvedButton({ postId }: { postId: string }) {
  return (
    <form action={async () => {
      "use server";
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = await createClient();
      await supabase.from("posts").update({ status: "resolved" }).eq("id", postId);
    }}>
      <button type="submit" className="btn" style={{ background: "#e8f5e9", border: "2px solid #a5d6a7", color: "#2e7d32", borderRadius: "var(--radius-md)", padding: "8px 16px", fontWeight: 700, fontSize: "0.875rem", cursor: "pointer" }}>
        Đánh dấu đã tìm được
      </button>
    </form>
  );
}
