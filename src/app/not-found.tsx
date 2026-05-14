import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "70vh" }}>
      <div className="empty-state">
        <span className="empty-state-icon">🔍</span>
        <p style={{ fontWeight: 800, fontSize: "var(--fs-h1)", color: "var(--clr-text)", margin: "0 0 8px" }}>404 — Không tìm thấy</p>
        <p style={{ color: "var(--clr-text-muted)", margin: "0 0 28px" }}>Trang này không tồn tại hoặc đã bị xóa.</p>
        <Link href="/" className="btn btn-primary">← Về trang chủ</Link>
      </div>
    </main>
  );
}
