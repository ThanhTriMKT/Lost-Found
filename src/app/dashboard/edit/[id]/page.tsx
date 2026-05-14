import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { PostForm } from "@/components/dashboard/post-form";

interface Props { params: Promise<{ id: string }> }

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: post } = await supabase.from("posts").select("*").eq("id", id).eq("author_id", user.id).single();
  if (!post) notFound();

  return (
    <main style={{ padding: "48px 0 96px", position: "relative", zIndex: 1 }}>
      <div className="container" style={{ maxWidth: "720px" }}>
        <h1 style={{ fontSize: "var(--fs-h1)", fontWeight: 800, color: "var(--clr-text)", margin: "0 0 8px" }}>✏️ Chỉnh sửa bài đăng</h1>
        <p style={{ color: "var(--clr-text-muted)", fontWeight: 600, margin: "0 0 40px" }}>Cập nhật thông tin bài đăng của bạn</p>
        <div style={{ background: "#fff", borderRadius: "var(--radius-xl)", border: "3px solid var(--clr-lavender)", padding: "40px", boxShadow: "var(--shadow-lavender)" }}>
          <PostForm post={post} />
        </div>
      </div>
    </main>
  );
}
