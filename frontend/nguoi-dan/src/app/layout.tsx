import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/portal/Header";
import Footer from "@/components/portal/Footer";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Cong Thong Tin Dien Tu Dia Phuong",
  description:
    "Trang thong tin dien tu cung cap dich vu cong, tin tuc va kenh ket noi nguoi dan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${publicSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
        <Header />
        <main className="flex-grow flex flex-col items-stretch">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
