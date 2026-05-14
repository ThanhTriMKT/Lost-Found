import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";

export const metadata: Metadata = {
  title: { default: "Lost & Found — Tìm và Gửi Đồ Bị Mất", template: "%s | Lost & Found" },
  description: "Hệ thống tìm và gửi đồ bị mất dành cho sinh viên — đăng bài mất/nhặt đồ, nhắn tin liên hệ.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <div className="bg-blobs" aria-hidden="true">
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="blob blob-3" />
        </div>
        <Header />
        {children}
        <footer style={{ borderTop: "3px solid var(--clr-border)", background: "rgba(255,255,255,0.8)", padding: "32px 0", marginTop: "auto" }}>
          <div className="container" style={{ textAlign: "center" }}>
            <p style={{ margin: 0, fontWeight: 700, color: "var(--clr-text-muted)", fontSize: "0.875rem" }}>
              🔍 Lost & Found — Hệ thống tìm đồ thất lạc cho sinh viên · Built with Next.js & Supabase
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
