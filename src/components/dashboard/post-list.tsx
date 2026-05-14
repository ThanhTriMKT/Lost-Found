"use client";
import Link from "next/link";
import { Post, CATEGORY_LABELS, ItemCategory } from "@/types/database";
import { DeletePostButton } from "./delete-post-button";

export function PostList({ posts }: { posts: Post[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {posts.map(post => (
        <div key={post.id} className="clay-card" style={{ borderColor: post.type === "lost" ? "var(--clr-coral)" : "var(--clr-sky)", display: "flex", gap: "16px", alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "200px" }}>
            <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "6px", flexWrap: "wrap" }}>
              <span className={`badge ${post.type === "lost" ? "badge-coral" : "badge-sky"}`}>{post.type === "lost" ? "😟 Mất đồ" : "🙌 Nhặt được"}</span>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, background: post.status === "resolved" ? "#e8f5e9" : post.status === "closed" ? "#f5f5f5" : "var(--clr-surface)", color: post.status === "resolved" ? "#388e3c" : "var(--clr-text-muted)", border: "2px solid", borderColor: post.status === "resolved" ? "#a5d6a7" : "var(--clr-border)", borderRadius: "8px", padding: "2px 8px" }}>
                {post.status === "active" ? "🟢 Đang tìm" : post.status === "resolved" ? "✅ Đã giải quyết" : "⚫ Đã đóng"}
              </span>
              <span style={{ fontSize: "0.75rem", color: "var(--clr-text-muted)", fontWeight: 600 }}>{CATEGORY_LABELS[post.category as ItemCategory]}</span>
            </div>
            <h3 style={{ fontWeight: 800, fontSize: "1rem", color: "var(--clr-text)", margin: "0 0 4px" }}>{post.title}</h3>
            <p style={{ fontSize: "0.8rem", color: "var(--clr-text-muted)", margin: 0 }}>📍 {post.location} · 📅 {new Date(post.item_date).toLocaleDateString("vi-VN")}</p>
          </div>
          <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
            <Link href={`/posts/${post.id}`} className="btn btn-ghost" style={{ padding: "6px 12px", minHeight: "34px", fontSize: "0.8rem" }}>Xem</Link>
            <Link href={`/dashboard/edit/${post.id}`} className="btn btn-ghost" style={{ padding: "6px 12px", minHeight: "34px", fontSize: "0.8rem" }}>Sửa</Link>
            <DeletePostButton postId={post.id} />
          </div>
        </div>
      ))}
    </div>
  );
}
