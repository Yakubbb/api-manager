import { IMessage } from "@/custom-types";
import { ChatMessage } from "./chat-message";
import { BiBong } from "react-icons/bi";
import { SideBarComponent } from "./sidebar-component";


export function ModelOptionsBar({
    avalibleModels
}: {
    avalibleModels: { name: string, description: string, value: string }[]
}) {
    return (
        <nav className="flex flex-col shadow-[0_3px_10px_rgb(0,0,0,0.2)] shadow-indigo-600/40">
            <div>
                <select name="model" id="model">
                    {avalibleModels.map((model) => {

                        return (<option key={model.value} value={model.value}>{model.name}</option>)
                    })}
                </select>
            </div>
        </nav>
    )
}
