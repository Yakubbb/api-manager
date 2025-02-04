import type { Metadata } from "next";
import { SideBar } from "@/components/sidebar";
import { cookies } from "next/headers";
import { getUserData, getUserIdFromSession } from "@/server-side/database-handler";


export const metadata: Metadata = {
  title: "api-manager",
};

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const sessionId = await(await cookies()).get('session')?.value
  const userId = await getUserIdFromSession(sessionId || '')
  const userData = await getUserData(userId)

  console.log(userData)

  return (
    <section className="flex flex-row grow-0 w-full h-full gap-4">
      <SideBar />
      {children}
    </section>
  );
}
