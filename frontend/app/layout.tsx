import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arogya AI - AI-powered medicine for Indian doctors",
  description: "AI-powered medicine for Indian doctors",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
