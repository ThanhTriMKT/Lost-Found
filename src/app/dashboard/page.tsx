import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PostList } from "@/components/dashboard/post-list";

export const metadata: Metadata = { title: "Bài đăng của tôi — Lost & Found" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: posts } = await supabase.from("posts").select("*").eq("author_id", user.id).order("created_at", { ascending: false });

  const lost     = posts?.filter(p => p.type === "lost").length ?? 0;
  const found    = posts?.filter(p => p.type === "found").length ?? 0;
  const resolved = posts?.filter(p => p.status === "resolved").length ?? 0;

  return (
    <main style={{ padding: "48px 0 96px", position: "relative", zIndex: 1 }}>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", marginBottom: "40px", flexWrap: "wrap" }}>
          <div>
            <h1 style={{ fontSize: "var(--fs-h1)", fontWeight: 800, color: "var(--clr-text)", margin: "0 0 8px", letterSpacing: "-0.02em" }}>📋 Bài đăng của tôi</h1>
            <p style={{ color: "var(--clr-text-muted)", fontWeight: 600, margin: 0 }}>Quản lý tất cả bài đăng mất/nhặt đồ của bạn</p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <Link href="/dashboard/new?type=lost" className="btn btn-primary">😟 Mất đồ</Link>
            <Link href="/dashboard/new?type=found" className="btn" style={{ background: "var(--clr-sky)", color: "#fff", border: "3px solid #3ab5ac", boxShadow: "var(--shadow-sky)" }}>🙌 Nhặt được</Link>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "20px", marginBottom: "40px" }}>
          {[
            { label: "Đồ bị mất", value: lost,     color: "var(--clr-coral)",   shadow: "var(--shadow-coral)",   border: "#e05555", emoji: "😟" },
            { label: "Nhặt được", value: found,    color: "var(--clr-sky)",     shadow: "var(--shadow-sky)",     border: "#3ab5ac", emoji: "🙌" },
            { label: "Đã giải quyết", value: resolved, color: "#4CAF50", shadow: "4px 6px 0 #a5d6a7", border: "#388e3c", emoji: "✅" },
          ].map(s => (
            <div key={s.label} style={{ background: "#fff", borderRadius: "var(--radius-lg)", border: `3px solid ${s.border}`, padding: "24px 20px", boxShadow: s.shadow, textAlign: "center", display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontSize: "2rem" }}>{s.emoji}</span>
              <span style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--clr-text)", lineHeight: 1 }}>{s.value}</span>
              <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--clr-text-muted)" }}>{s.label}</span>
            </div>
          ))}
        </div>

        {posts && posts.length > 0 ? (
          <PostList posts={posts} />
        ) : (
          <div className="empty-state">
            <span className="empty-state-icon">📋</span>
            <p style={{ fontWeight: 800, fontSize: "var(--fs-h2)", color: "var(--clr-text)", margin: "0 0 8px" }}>Chưa có bài đăng nào!</p>
            <p style={{ color: "var(--clr-text-muted)", margin: "0 0 28px" }}>Hãy đăng bài mất/nhặt đồ ngay bây giờ 🚀</p>
            <Link href="/dashboard/new" className="btn btn-primary">+ Đăng bài đầu tiên</Link>
          </div>
        )}
      </div>
    </main>
  );
}
