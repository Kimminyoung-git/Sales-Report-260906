import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { PostsProvider } from "./posts-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "매출 정보",
  description: "매출 정보를 공유하는 게시판",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <PostsProvider>{children}</PostsProvider>
      </body>
    </html>
  );
}
