import type { Metadata } from "next";
import { Ma_Shan_Zheng, Noto_Serif_SC } from "next/font/google";
import { Navbar } from "@/components/ui/Navbar";
import "./globals.css";

const maShanZheng = Ma_Shan_Zheng({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-title"
});

const notoSerifSC = Noto_Serif_SC({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  title: "知命 | 新中式禅意算命 Web 应用",
  description: "基于先进AI生成式大模型构建的新中式风格玄学平台，涵盖生辰八字、AI掌纹解析、星座运势、每日运势、姓名测算、合婚配对、塔罗牌占卜。",
  keywords: ["算命", "八字", "测算", "星座运势", "手相", "塔罗牌", "姓名测算", "合婚配对", "每日运势", "新中式", "AI算命"],
  openGraph: {
    title: "知命 | 东方传统命理与现代人工智能的共鸣",
    description: "全方位的玄学运势体验模块，为您指点迷津。",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    siteName: "知命玄学平台",
    locale: "zh_CN",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${maShanZheng.variable} ${notoSerifSC.variable} font-body bg-white text-gray-800 antialiased relative min-h-screen`}>
        <div className="pattern-bg" />
        <Navbar />
        <main className="relative z-0 pt-14">
          {children}
        </main>
      </body>
    </html>
  );
}
