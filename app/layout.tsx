import type { Metadata } from "next";
import "./globals.css";
import { MainHeader } from "@/components/header-main";
import GetAllUsers from "@/server-side/database-handler";


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
        <main className="flex flex-col bg-slate-950 h-dvh overflow-hidden p-3">
          <MainHeader />
          {children}
        </main>
      </body>
    </html>
  );
}
