import type { Metadata } from "next";
import "./globals.css";
import localFont from 'next/font/local'

// Font files can be colocated inside of `pages`
const myFont = localFont({ src: './InterTight-VariableFont_wght.ttf', variable: '--mainFont' })
const myFont2 = localFont({ src: './JetBrainsMono-VariableFont_wght.ttf', variable: '--mainFont2' })

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
      <body className={`${myFont.variable} ${myFont2.variable} overflow-hidden`}>
        <main className=" h-screen font-main text-[#363636] bg-[#ffffff]">
          {children}
        </main>
      </body>
    </html>
  );
}