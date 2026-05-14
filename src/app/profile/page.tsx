"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/database";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [studentId, setStudentId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (data) { setProfile(data); setDisplayName(data.display_name || ""); setPhone(data.phone || ""); setStudentId(data.student_id || ""); }
      setLoading(false);
    };
    load();
  }, [supabase, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError(null); setMessage(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { error } = await supabase.from("profiles").update({ display_name: displayName.trim() || null, phone: phone.trim() || null, student_id: studentId.trim() || null }).eq("id", user.id);
      if (error) throw error;
      setMessage("Cập nhật hồ sơ thành công! 🎉");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra.");
    } finally { setSaving(false); }
  };

  if (loading) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}><div style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--clr-text-muted)" }}>Đang tải... ⏳</div></div>;

  return (
    <main style={{ padding: "48px 0 96px", position: "relative", zIndex: 1 }}>
      <div className="container" style={{ maxWidth: "640px" }}>
        <div style={{ marginBottom: "32px" }}>
          <Link href="/dashboard" className="btn btn-ghost" style={{ padding: "8px 16px", fontSize: "0.9rem" }}>← Quay lại Dashboard</Link>
        </div>
        <h1 style={{ fontSize: "var(--fs-h1)", fontWeight: 800, color: "var(--clr-text)", margin: "0 0 32px", letterSpacing: "-0.02em" }}>👤 Hồ sơ cá nhân</h1>
        <div style={{ background: "#fff", borderRadius: "var(--radius-xl)", border: "3px solid var(--clr-lavender)", padding: "40px", boxShadow: "var(--shadow-lavender)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "32px", padding: "16px 20px", background: "var(--clr-surface)", borderRadius: "var(--radius-lg)", border: "3px dashed var(--clr-border)" }}>
            <span className="clay-avatar-placeholder" style={{ width: 60, height: 60, fontSize: "1.5rem", flexShrink: 0 }}>{(displayName || "?").charAt(0).toUpperCase()}</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: "1.1rem" }}>{displayName || "Chưa đặt tên"}</div>
              {studentId && <div style={{ fontSize: "0.85rem", color: "var(--clr-text-muted)" }}>MSSV: {studentId}</div>}
            </div>
          </div>
          {message && <div className="alert alert-success" style={{ marginBottom: "20px" }}>{message}</div>}
          {error && <div className="alert alert-error" style={{ marginBottom: "20px" }}>{error}</div>}
          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label className="clay-label">Tên hiển thị</label>
              <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} className="clay-input" placeholder="Nguyễn Văn A" />
            </div>
            <div>
              <label className="clay-label">Mã số sinh viên</label>
              <input type="text" value={studentId} onChange={e => setStudentId(e.target.value)} className="clay-input" placeholder="Vd: 2212477" />
            </div>
            <div>
              <label className="clay-label">Số điện thoại / Zalo</label>
              <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="clay-input" placeholder="Vd: 0901234567" />
            </div>
            <button type="submit" disabled={saving} className="btn btn-primary btn-full" style={{ padding: "14px" }}>
              {saving ? "⏳ Đang lưu..." : "💾 Lưu thay đổi"}
            </button>
          </form>
          <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "2px dashed var(--clr-border)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--clr-text-muted)", fontWeight: 600 }}>🗓️ Tham gia: {profile ? new Date(profile.created_at).toLocaleDateString("vi-VN") : "—"}</span>
          </div>
        </div>
      </div>
    </main>
  );
}
