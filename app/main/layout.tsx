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
    <section className="flex flex-row w-full h-full gap-4">
      <SideBar userChats={[]} />
      <Suspense fallback={<Loading />}>
        {children}
      </Suspense>
    </section>
  );
}
