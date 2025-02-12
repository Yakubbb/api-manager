import { IMessage, IModel } from "@/custom-types";
import { ChatMessage } from "./chat-message";
import { BiBong } from "react-icons/bi";
import { SideBarComponent } from "./sidebar-component";


export function ModelOptionsBar({
    avalibleModels
}: {
    avalibleModels?: IModel[]
}) {
    console.log(avalibleModels)
    return (
        <nav className="flex flex-col shadow-[0_3px_10px_rgb(0,0,0,0.2)] p-3 w-[20%]">
            <div>
                <select name="model" id="model">
                    {avalibleModels?.map((model) => {
                        return (<option key={model.modelName} value={model.modelName}>{model.name}</option>)
                    })}
                </select>
            </div>
        </nav>
    )
}
