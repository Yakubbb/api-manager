import { IMessage } from "@/custom-types";
import { ChatMessage } from "./chat-message";
import { BiBong } from "react-icons/bi";
import { SideBarComponent } from "./sidebar-component";


export function ModelOptionsBar({

}: {

    }) {
    return (
        <nav className="flex flex-col grow-0 h-5/6 gap-5 w-[20%]  bg-slate-900 rounded-3xl shadow-2xl shadow-indigo-600/20 ">
            <input id="typeinp" type="range" min="0" max="100" defaultValue="3" step="0.5"/>
        </nav>
    ) 
}
