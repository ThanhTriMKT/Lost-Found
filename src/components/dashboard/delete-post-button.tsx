"use client";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function DeletePostButton({ postId }: { postId: string }) {
  const router = useRouter();
  const handleDelete = async () => {
    if (!confirm("Bạn có chắc muốn xóa bài đăng này?")) return;
    const supabase = createClient();
    await supabase.from("posts").delete().eq("id", postId);
    router.refresh();
  };
  return (
    <button onClick={handleDelete} className="btn" style={{ padding: "6px 12px", minHeight: "34px", fontSize: "0.8rem", background: "#fff0f0", border: "2px solid #ffcdd2", color: "#c62828", borderRadius: "var(--radius-md)" }}>
      Xóa
    </button>
  );
}
