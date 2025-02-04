"use client"
import { IChat, ISidebarChildren } from "@/custom-types";
import { SideBarComponent } from "./sidebar-component";

import { BiStats } from "react-icons/bi";
import { CgKey } from "react-icons/cg";
import { GiBugNet } from "react-icons/gi";
import { RxExit } from "react-icons/rx";
import { RiGeminiFill } from "react-icons/ri";


import { deleteCookie } from "@/server-side/work-with-cookie";



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

    return (
        <div className="flex flex-col w-[15%] h-[100%] shadow-[0_3px_10px_rgb(0,0,0,0.2)] shadow-indigo-600/40 p-4">
            <nav className="flex flex-col gap-5">
                <SideBarComponent name="Gemini" description="место, где можно протестировать различные модели" Icon={RiGeminiFill} href="/main/gemini" children={userChats} />
                <SideBarComponent name="Мониторинг" description="посмотрите на работу ваших сервисов" Icon={BiStats} href="/main/monitor" />
                <SideBarComponent name="Ключи" description="ключи доступа к вашим api" Icon={CgKey} href="/main/keys" />
                <SideBarComponent name="Баги" description="возникла проблема? - сообщите" Icon={GiBugNet} href="/main/playground" />
            </nav>
            <nav className="absolute bottom-3 flex flex-row gap-1 items-center text-center">
                api-manager |
                <button className="flex flex-row gap-1 items-center text-center" onClick={deleteCookie}>
                    <RxExit />
                    Выход
                </button>
            </nav>
        </div>
    )
}

/*
<SideBarComponent name="Мониторинг" description="посмотрите на работу ваших сервисов" Icon={BiStats}/>
<SideBarComponent name="Ключи" description="ключи доступа к вашим api" Icon={CgKey}/>
<SideBarComponent name="Баги" description="возникла проблема? - сообщите" Icon={GiBugNet}/>
 */