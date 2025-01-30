import { IMessage } from "@/custom-types";
import { ChatMessage } from "./chat-message";
import { BiBong } from "react-icons/bi";
import { SideBarComponent } from "./sidebar-component";

import { TbSandbox } from "react-icons/tb";
import { BiStats } from "react-icons/bi";
import { CgKey } from "react-icons/cg";
import { GiBugNet } from "react-icons/gi";


export function SideBar({

}: {

    }) {
    return (
        <nav className="flex flex-col w-[15%] h-[100%] shadow-xl shadow-indigo-600/40 gap-5 rounded-3xl p-3">
            <SideBarComponent name="Песочница" description="место, где можно протестировать различные модели" Icon={TbSandbox} href="/main/playground" />
            <SideBarComponent name="Мониторинг" description="посмотрите на работу ваших сервисов" Icon={BiStats} href="/main/monitor" />
            <SideBarComponent name="Ключи" description="ключи доступа к вашим api" Icon={CgKey} href="/main/keys"/>
            <SideBarComponent name="Баги" description="возникла проблема? - сообщите" Icon={GiBugNet} href="/main/playground"/>
        </nav>
    )
}

/*
<SideBarComponent name="Мониторинг" description="посмотрите на работу ваших сервисов" Icon={BiStats}/>
<SideBarComponent name="Ключи" description="ключи доступа к вашим api" Icon={CgKey}/>
<SideBarComponent name="Баги" description="возникла проблема? - сообщите" Icon={GiBugNet}/>
 */