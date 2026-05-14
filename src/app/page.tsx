// src/app/page.tsx
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CATEGORY_LABELS, ItemCategory, PostType } from "@/types/database";

export const revalidate = 30;

interface HomePageProps {
  searchParams: Promise<{
    query?: string;
    type?: string;
    category?: string;
    page?: string;
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { query = "", type = "", category = "", page = "1" } = await searchParams;
  const supabase = await createClient();

  const pageSize = 9;
  const currentPage = parseInt(page);
  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize - 1;

  let postsQuery = supabase
    .from("posts")
    .select(`*, profiles(display_name, avatar_url)`, { count: "exact" })
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (query) postsQuery = postsQuery.ilike("title", `%${query}%`);
  if (type && (type === "lost" || type === "found")) postsQuery = postsQuery.eq("type", type as PostType);
  if (category) postsQuery = postsQuery.eq("category", category as ItemCategory);
  postsQuery = postsQuery.range(from, to);

  const { data: posts, count } = await postsQuery;
  const totalPages = count ? Math.ceil(count / pageSize) : 0;

  // Stats
  const { count: lostCount } = await supabase.from("posts").select("*", { count: "exact", head: true }).eq("type", "lost").eq("status", "active");
  const { count: foundCount } = await supabase.from("posts").select("*", { count: "exact", head: true }).eq("type", "found").eq("status", "active");
  const { count: resolvedCount } = await supabase.from("posts").select("*", { count: "exact", head: true }).eq("status", "resolved");

  const typeFilters = [
    { value: "", label: "🔍 Tất cả" },
    { value: "lost", label: "😟 Đồ bị mất" },
    { value: "found", label: "🙌 Nhặt được" },
  ];

  return (
    <main style={{ position: "relative", zIndex: 1 }}>
      {/* Hero */}
      <section style={{ padding: "64px 0 40px", background: "linear-gradient(135deg, #fff9f0 0%, #f0f8ff 100%)" }}>
        <div className="container">
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "24px", maxWidth: "760px", margin: "0 auto" }}>
            <span className="badge badge-coral" style={{ fontSize: "0.85rem", padding: "6px 20px" }}>
              🎓 Hệ thống Lost & Found dành cho sinh viên
            </span>
            <h1 style={{ fontSize: "var(--fs-display)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.03em", color: "var(--clr-text)", margin: 0 }}>
              Tìm lại{" "}
              <span style={{ color: "var(--clr-coral)", position: "relative", display: "inline-block" }}>
                đồ thất lạc
                <svg viewBox="0 0 200 14" style={{ position: "absolute", bottom: "-4px", left: 0, width: "100%", height: "14px" }} aria-hidden="true">
                  <path d="M2 9 Q50 2 100 9 Q150 16 198 9" stroke="#FFE66D" strokeWidth="4" fill="none" strokeLinecap="round" />
                </svg>
              </span>
              {" "}trong trường
            </h1>
            <p style={{ color: "var(--clr-text-muted)", fontSize: "1.05rem", fontWeight: 500, margin: 0 }}>
              Đăng bài tìm kiếm hoặc thông báo nhặt được đồ — kết nối sinh viên, giảm mất mát tài sản.
            </p>

            {/* Stats */}
            <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", justifyContent: "center" }}>
              {[
                { label: "Đang mất", value: lostCount ?? 0, color: "var(--clr-coral)", emoji: "😟" },
                { label: "Nhặt được", value: foundCount ?? 0, color: "var(--clr-sky)", emoji: "🙌" },
                { label: "Đã tìm lại", value: resolvedCount ?? 0, color: "#4CAF50", emoji: "✅" },
              ].map((s) => (
                <div key={s.label} style={{ background: "#fff", borderRadius: "16px", border: `3px solid ${s.color}`, padding: "16px 24px", boxShadow: "4px 6px 0 rgba(0,0,0,0.08)", textAlign: "center", minWidth: "120px" }}>
                  <div style={{ fontSize: "1.5rem" }}>{s.emoji}</div>
                  <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--clr-text)", lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--clr-text-muted)" }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Search */}
            <form action="/" method="GET" style={{ width: "100%", maxWidth: "540px" }}>
              {type && <input type="hidden" name="type" value={type} />}
              {category && <input type="hidden" name="category" value={category} />}
              <div style={{ position: "relative" }}>
                <input type="text" name="query" defaultValue={query} placeholder="Tìm theo tên đồ vật, địa điểm..." className="clay-input" style={{ paddingRight: "110px" }} />
                <button type="submit" className="btn btn-primary" style={{ position: "absolute", right: "6px", top: "6px", padding: "6px 16px", minHeight: "auto", height: "calc(100% - 12px)", fontSize: "0.8rem" }}>
                  🔍 Tìm
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section style={{ background: "#fff", borderBottom: "3px solid var(--clr-border)", padding: "20px 0" }}>
        <div className="container">
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", alignItems: "center" }}>
            <Link href="/dashboard/new?type=lost" className="btn btn-primary" style={{ gap: "6px" }}>
              😟 Đăng bài MẤT ĐỒ
            </Link>
            <Link href="/dashboard/new?type=found" className="btn" style={{ background: "var(--clr-sky)", color: "#fff", border: "3px solid #3ab5ac", boxShadow: "var(--shadow-sky)", gap: "6px" }}>
              🙌 Đăng bài NHẶT ĐƯỢC
            </Link>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section style={{ padding: "24px 0 0" }}>
        <div className="container">
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center", marginBottom: "16px" }}>
            <span style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--clr-text-muted)" }}>Lọc theo:</span>
            {typeFilters.map((f) => (
              <Link
                key={f.value}
                href={`/?query=${query}&type=${f.value}&category=${category}`}
                className={`btn ${type === f.value ? "btn-primary" : "btn-ghost"}`}
                style={{ padding: "6px 16px", minHeight: "36px", fontSize: "0.85rem" }}
              >
                {f.label}
              </Link>
            ))}
            <span style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--clr-text-muted)", marginLeft: "8px" }}>Danh mục:</span>
            <Link href={`/?query=${query}&type=${type}&category=`} className={`btn ${!category ? "btn-primary" : "btn-ghost"}`} style={{ padding: "6px 16px", minHeight: "36px", fontSize: "0.85rem" }}>Tất cả</Link>
            {(Object.entries(CATEGORY_LABELS) as [ItemCategory, string][]).map(([val, label]) => (
              <Link key={val} href={`/?query=${query}&type=${type}&category=${val}`} className={`btn ${category === val ? "btn-primary" : "btn-ghost"}`} style={{ padding: "6px 16px", minHeight: "36px", fontSize: "0.85rem" }}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section style={{ padding: "16px 0 96px" }}>
        <div className="container">
          {posts && posts.length > 0 ? (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))", gap: "24px", marginBottom: "48px" }}>
                {posts.map((post) => (
                  <article key={post.id} className="clay-card" style={{ borderColor: post.type === "lost" ? "var(--clr-coral)" : "var(--clr-sky)", display: "flex", flexDirection: "column" }}>
                    {/* Image */}
                    {post.image_url && (
                      <div style={{ marginBottom: "14px", borderRadius: "12px", overflow: "hidden", border: "2px solid var(--clr-border)", height: "180px" }}>
                        <img src={post.image_url} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    )}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", marginBottom: "10px" }}>
                      <span className={`badge ${post.type === "lost" ? "badge-coral" : "badge-sky"}`}>
                        {post.type === "lost" ? "😟 Mất đồ" : "🙌 Nhặt được"}
                      </span>
                      <span style={{ fontSize: "0.78rem", color: "var(--clr-text-muted)", fontWeight: 600 }}>
                        {new Date(post.created_at).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                    <h2 style={{ fontSize: "1rem", fontWeight: 800, color: "var(--clr-text)", margin: "0 0 8px", lineHeight: 1.4 }}>
                      {post.title}
                    </h2>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "8px" }}>
                      <span style={{ fontSize: "0.78rem", background: "var(--clr-surface)", border: "2px solid var(--clr-border)", borderRadius: "8px", padding: "2px 8px", fontWeight: 600 }}>
                        {CATEGORY_LABELS[post.category as ItemCategory]}
                      </span>
                      <span style={{ fontSize: "0.78rem", background: "var(--clr-surface)", border: "2px solid var(--clr-border)", borderRadius: "8px", padding: "2px 8px", fontWeight: 600 }}>
                        📍 {post.location}
                      </span>
                    </div>
                    {post.description && (
                      <p style={{ color: "var(--clr-text-muted)", fontSize: "0.875rem", lineHeight: 1.5, marginBottom: "14px", flex: 1, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" } as React.CSSProperties}>
                        {post.description}
                      </p>
                    )}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "12px", borderTop: "2px solid rgba(0,0,0,0.06)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span className="clay-avatar-placeholder" style={{ width: 26, height: 26, fontSize: "0.7rem" }}>
                          {(post.profiles?.display_name || "?").charAt(0).toUpperCase()}
                        </span>
                        <span style={{ fontWeight: 700, fontSize: "0.8rem", color: "var(--clr-text)" }}>
                          {post.profiles?.display_name || "Ẩn danh"}
                        </span>
                      </div>
                      <Link href={`/posts/${post.id}`} className="btn btn-ghost" style={{ padding: "5px 12px", minHeight: "30px", fontSize: "0.78rem" }}>
                        Xem chi tiết →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                  {currentPage > 1 && (
                    <Link href={`/?query=${query}&type=${type}&category=${category}&page=${currentPage - 1}`} className="btn btn-ghost" style={{ padding: "8px 16px" }}>← Trước</Link>
                  )}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link key={p} href={`/?query=${query}&type=${type}&category=${category}&page=${p}`} className={`btn ${p === currentPage ? "btn-primary" : "btn-ghost"}`} style={{ minWidth: "44px", padding: "8px" }}>{p}</Link>
                  ))}
                  {currentPage < totalPages && (
                    <Link href={`/?query=${query}&type=${type}&category=${category}&page=${currentPage + 1}`} className="btn btn-ghost" style={{ padding: "8px 16px" }}>Sau →</Link>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="empty-state" style={{ maxWidth: "500px", margin: "0 auto" }}>
              <span className="empty-state-icon">🔍</span>
              <p style={{ fontWeight: 800, fontSize: "var(--fs-h2)", color: "var(--clr-text)", margin: "0 0 8px" }}>
                {query ? "Không tìm thấy bài đăng!" : "Chưa có bài đăng nào!"}
              </p>
              <p style={{ color: "var(--clr-text-muted)", margin: "0 0 28px" }}>
                {query ? "Thử lại với từ khóa khác 🌟" : "Hãy đăng bài đầu tiên 🚀"}
              </p>
              <Link href="/dashboard/new" className="btn btn-primary">
                {query ? "Xem tất cả bài đăng" : "+ Đăng bài ngay"}
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
