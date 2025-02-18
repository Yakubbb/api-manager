"use client"
import { ISidebarChildren } from "@/custom-types";
import { SideBarComponent } from "./sidebar-component";

import { IoIosStats } from "react-icons/io";
import { CgKey } from "react-icons/cg";
import { GiBugNet } from "react-icons/gi";
import { RxExit } from "react-icons/rx";
import { RiChatAiLine, RiGeminiFill } from "react-icons/ri";
import { FaHome } from "react-icons/fa";
import { FaProjectDiagram } from "react-icons/fa";
import { VscLibrary } from "react-icons/vsc";
import { IoIosAddCircleOutline } from "react-icons/io";

import { deleteCookie } from "@/server-side/work-with-cookie";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getChatLinks } from "@/server-side/chat-handler";
import { useSearchParams } from "next/navigation";




const options = [
    {
        name: 'Gemini',
        href: '/main/playground?ai=Gemini'
    },
    {
        name: 'ChatGpt',
        href: '/main/playground?ai=ChatGpt'
    },
    {
        name: 'Other',
        href: '/main/playground?ai=Other'
    },
] as ISidebarChildren[]


export function SideBar({
    userChats
}: {
    userChats: any[]
}) {

    const [sidebarChats, setSidebarChats] = useState<ISidebarChildren[]>([])
    const searchParams = useSearchParams()

    const updateChats = async () => {
        const chats = await getChatLinks()
        const newSideBarChats = [] as ISidebarChildren[]
        chats.reverse().forEach((chat, index) => {
            if (index < 5) {
                newSideBarChats.push({
                    name: chat.name,
                    href: `/main/gemini/chat?id=${chat._id}`,
                    Icon: RiChatAiLine
                })
            }
        })
        setSidebarChats(newSideBarChats)
        return
    }

    useEffect(() => {
        updateChats()
    }, [searchParams]);

    return (
        <div className="flex flex-col w-[15%] h-[100%] shadow-[0_3px_10px_rgb(0,0,0,0.2)] p-4">
            <nav className="flex flex-col gap-2">
                <SideBarComponent name="Gemini" description="место, где можно протестировать различные модели" Icon={RiGeminiFill} href="/main/gemini" children={sidebarChats} />
                <SideBarComponent name="Модули" description="библиотека модулей" Icon={VscLibrary} href="/main/modules" children={[
                    {
                        name: 'добавить',
                        href: '/main/modules/create',
                        Icon: IoIosAddCircleOutline
                    }
                ]} />
                <SideBarComponent name="Мониторинг" description="посмотрите на работу ваших сервисов" Icon={IoIosStats} href="/main/monitor" />
                <SideBarComponent name="Ключи" description="ключи доступа к вашим api" Icon={CgKey} href="/main/keys" />
                <SideBarComponent name="Маршруты" description="ваши api маршруты" Icon={FaProjectDiagram} href="/main/paths" />
                <SideBarComponent name="Баги" description="возникла проблема? - сообщите" Icon={GiBugNet} href="/main/playground" />
            </nav>
            <nav className="absolute bottom-3">
                <div className="flex flex-col gap-1">
                    <Link className="text-2xl" href={'/main'}>
                        <FaHome />
                    </Link>

                    <div className="flex flex-row gap-1 items-center text-center ">
                        api-manager |
                        <button className="flex flex-row gap-1 items-center text-center" onClick={deleteCookie}>
                            <RxExit />
                            Выход
                        </button>
                    </div>
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