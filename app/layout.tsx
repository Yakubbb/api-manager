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
  return (
    <html lang="en">
      
      <body>
        <main className="flex flex-col bg-[#e9ecef] dark:bg-black text-[#363636] dark:text-white h-screen font-inter">
          {children}
        </main>
      </body>
    </html>
  );
}
