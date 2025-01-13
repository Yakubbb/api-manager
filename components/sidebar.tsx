import { IMessage } from "@/custom-types";
import { ChatMessage } from "./chat-message";
import { BiBong } from "react-icons/bi";
import { SideBarComponent } from "./sidebar-component";

export function SideBar({

}: {

    }) {
    return (
        <nav className="flex flex-col w-1/6 h-5/6 gap-5 ">
            <SideBarComponent name="aboba" description="описание абобы"/>
            <SideBarComponent name="aboba" description="описание абобы"/>
            <SideBarComponent name="aboba" description="описание абобы"/>
            <SideBarComponent name="aboba" description="описание абобы"/>
            <SideBarComponent name="aboba" description="описание абобы"/>
            <SideBarComponent name="aboba" description="описание абобы"/>
            <SideBarComponent name="aboba" description="описание абобы"/>
            <SideBarComponent name="aboba" description="описание абобы"/>
            <SideBarComponent name="aboba" description="описание абобы"/>
            <SideBarComponent name="aboba" description="описание абобы"/>
            <SideBarComponent name="aboba" description="описание абобы"/>
            <SideBarComponent name="aboba" description="описание абобы"/>
        </nav>
    )
}
