import type { Metadata } from "next";
import { QueryProvider } from "@/providers/query-provider";
import "./globals.css";
export const metadata: Metadata = { title: "商品展示頁面", description: "精品商店商品展示與購物車" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="zh-TW"><body><QueryProvider>{children}</QueryProvider></body></html>; }
