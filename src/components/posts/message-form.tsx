"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function MessageForm({ postId, receiverId }: { postId: string; receiverId: string }) {
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSending(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Bạn cần đăng nhập");
      const { error } = await supabase.from("messages").insert({
        post_id: postId, sender_id: user.id, receiver_id: receiverId, content: content.trim(),
      });
      if (error) throw error;
      setSent(true);
      setContent("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra.");
    } finally {
      setSending(false);
    }
  };

  if (sent) return (
    <div className="alert alert-success">✅ Tin nhắn đã gửi thành công! Người đăng sẽ liên hệ lại với bạn.</div>
  );

  return (
    <form onSubmit={handleSend} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {error && <div className="alert alert-error">{error}</div>}
      <textarea value={content} onChange={e => setContent(e.target.value)} rows={4} className="clay-input" placeholder="Nhập tin nhắn của bạn... (Vd: Tôi nghĩ tôi đã nhặt được đồ của bạn, liên hệ với tôi qua SĐT...)" required style={{ resize: "vertical" }} />
      <button type="submit" disabled={sending || !content.trim()} className="btn btn-primary">
        {sending ? "Đang gửi..." : "📨 Gửi tin nhắn"}
      </button>
    </form>
  );
}
