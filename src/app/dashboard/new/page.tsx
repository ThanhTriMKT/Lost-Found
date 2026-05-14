import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PostForm } from "@/components/dashboard/post-form";
import { PostType } from "@/types/database";

export const metadata: Metadata = { title: "Đăng bài mới — Lost & Found" };

interface Props { searchParams: Promise<{ type?: string }> }

export default async function NewPostPage({ searchParams }: Props) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { type = "lost" } = await searchParams;
  const defaultType = (type === "found" ? "found" : "lost") as PostType;
  return (
    <main style={{ padding: "48px 0 96px", position: "relative", zIndex: 1 }}>
      <div className="container" style={{ maxWidth: "720px" }}>
        <h1 style={{ fontSize: "var(--fs-h1)", fontWeight: 800, color: "var(--clr-text)", margin: "0 0 8px", letterSpacing: "-0.02em" }}>
          {defaultType === "lost" ? "Đăng bài MẤT ĐỒ" : "Đăng bài NHẶT ĐƯỢC"}
        </h1>
        <p style={{ color: "var(--clr-text-muted)", fontWeight: 600, margin: "0 0 40px" }}>Điền thông tin chi tiết để tăng khả năng tìm lại đồ</p>
        <div style={{ background: "#fff", borderRadius: "var(--radius-xl)", border: "3px solid var(--clr-lavender)", padding: "40px", boxShadow: "var(--shadow-lavender)" }}>
          <PostForm defaultType={defaultType} />
        </div>
      </div>
    </main>
  );
}
