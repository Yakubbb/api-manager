"use client"
import { ISidebarChildren, IUserDisplayInfo } from "@/custom-types";
import { SideBarComponent } from "./sidebar-component";

import { IoIosStats } from "react-icons/io";
import { GiBugNet } from "react-icons/gi";
import { RxExit } from "react-icons/rx";
import { RiGeminiFill } from "react-icons/ri";
import { FaHome } from "react-icons/fa";
import { VscLibrary } from "react-icons/vsc";
import { FaCode } from "react-icons/fa";
import { deleteCookie } from "@/server-side/work-with-cookie";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getChatLinks } from "@/server-side/chat-handler";
import { useSearchParams } from "next/navigation";
import { RiMessage3Line } from "react-icons/ri";
import { CgRowFirst } from "react-icons/cg";
import { getUserDataForFront, getUserPhotoById } from "@/server-side/database-handler";
import { MdOutlineAdminPanelSettings } from "react-icons/md";



/*
              <SideBarComponent name="Тюнинг" description="место, где можно протестировать различные модели" Icon={RiGeminiFill} href="/main/customs" children={[
                    {
                        name: 'Библиотека',
                        href: '/main/configure/browse',
                        Icon: FaSearch
                    }
                ]} />
                 */


export function SideBar({
    userChats
}: {
    userChats: any[]
}) {

    const [sidebarChats, setSidebarChats] = useState<ISidebarChildren[]>([])
    const [userData, setUserData] = useState<{ name: string, avatar: string, role: string }>()
    const searchParams = useSearchParams()

    const mainChildren = [
        {
            name: 'примеры',
            href: `/main/preview`,
            Icon: FaCode
        },
    ] as ISidebarChildren[]

    const updateChats = async () => {
        const chats = await getChatLinks()
        const newSideBarChats = [] as ISidebarChildren[]
        chats.reverse().forEach((chat, index) => {
            if (index < 5) {
                newSideBarChats.push({
                    name: chat.name,
                    href: `/main/gemini/chat?id=${chat._id}`,
                    Icon: RiMessage3Line
                })
            }
        })
        setSidebarChats(newSideBarChats)
        return
    }

    useEffect(() => {
        updateChats()
    }, [searchParams]);

    useEffect(() => {
        const fetchAsync = async () => {
            const data = await getUserDataForFront()
            const name = data.name
            const role = data.role
            const avatar = await getUserPhotoById(data.id)
            setUserData({ name, avatar, role })
        }
        fetchAsync()
    }, [])


    return (
        <div className="flex flex-col rounded-tr-2xl rounded-br-2xl  h-[100%] p-4 bg-[#f3f3f6] ">
            <nav className="flex flex-col gap-1">
                {(userData?.role == 'admin' || userData?.role == 'system') &&
                    <SideBarComponent name="Админ" description="место, где можно протестировать различные модели" Icon={MdOutlineAdminPanelSettings} href="/main/admin" />
                }
                <SideBarComponent name="Главная" description="место, где можно протестировать различные модели" Icon={CgRowFirst} href="/main" children={mainChildren} />
                <SideBarComponent name="Gemini" description="место, где можно протестировать различные модели" Icon={RiGeminiFill} href="/main/gemini" children={sidebarChats} />
                <SideBarComponent name="Библиотека" description="место, где можно протестировать различные модели" Icon={VscLibrary} href="/main/customs" />
                <SideBarComponent name="Мониторинг" description="посмотрите на работу ваших сервисов" Icon={IoIosStats} href="/main/monitor" />
                <SideBarComponent name="Баги" description="возникла проблема? - сообщите" Icon={GiBugNet} href="/main/playground" />
            </nav>
            <nav className="absolute bottom-3 w-[100%]">
                <div className="flex flex-row gap-1 items-center text-center ">
                    <Link className="text-2xl" href={'/main'}>
                        <FaHome />
                    </Link>
                    <button className="flex flex-row gap-1 items-center text-center" onClick={deleteCookie}>
                        <RxExit />
                        Выход
                    </button>
                </div>
            </nav>
        </div>
    )
}

/*
<SideBarComponent name="Мониторинг" description="посмотрите на работу ваших сервисов" Icon={BiStats}/>
<SideBarComponent name="Ключи" description="ключи доступа к вашим api" Icon={CgKey}/>
<SideBarComponent name="Баги" description="возникла проблема? - сообщите" Icon={GiBugNet}/>
 */