import type { Metadata } from "next";
import { SideBar } from "@/components/sidebar";


export const metadata: Metadata = {
  title: "api-manager",
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="flex flex-row h-[95%] w-full gap-5 shrink-0 grow-0 pb-4">
      <SideBar />
      {children}
    </section>
  );
}
