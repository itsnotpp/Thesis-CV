import type { Metadata } from "next";
import { Sarabun } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const sarabun = Sarabun({ 
  subsets: ["latin", "thai"], 
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-sarabun" 
});

export const metadata: Metadata = {
  title: "Educational Expert Network Platform (EENP)",
  description: "เครือข่ายผู้เชี่ยวชาญทางการศึกษาแห่งชาติ แพลตฟอร์มสำหรับบุคลากรทางการศึกษา",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${sarabun.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
