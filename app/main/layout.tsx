import type { Metadata } from "next";
import { SideBar } from "@/components/sidebar";
import { Suspense } from "react";
import Loading from "./loading";

export const metadata: Metadata = {
  title: "api-manager",
};

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <section className="flex flex-row w-[100%] h-full">
      <div className="h-[100%] w-[15%]">
        <SideBar userChats={[]} />
      </div>
      <div className="h-[100%] w-[85%]">
        <Suspense fallback={<Loading />}>
          {children}
        </Suspense>
      </div>
    </section>
  );
}
