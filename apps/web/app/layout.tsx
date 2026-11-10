import type { Metadata } from "next";
import { LanguageProvider } from "@/providers/language-provider";
import { QueryProvider } from "@/providers/query-provider";
import "./globals.css";
export const metadata: Metadata = { title: "商品展示頁面", description: "精品商店商品展示與購物車" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="zh-TW"><body><QueryProvider><LanguageProvider>{children}</LanguageProvider></QueryProvider></body></html>; }
