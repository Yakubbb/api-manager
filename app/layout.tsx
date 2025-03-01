import type { Metadata } from "next";
import "./globals.css";
import { MainHeader } from "@/components/header-main";

export const metadata: Metadata = {
  title: "api-manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  //bg-lightCoolBaseBg bg-mono-cool-radial-bg
  return (
    <html lang="en">
      <body>
        <main className="flex flex-col h-screen font-inter text-[#363636] dark:text-white dark:bg-black bg-lightCoolBaseBg bg-mono-cool-radial-bg">
          {children}
        </main>
      </body>
    </html>
  );
}