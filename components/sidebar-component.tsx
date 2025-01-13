import { IMessage } from "@/custom-types";
import { ChatMessage } from "./chat-message";
import { BiBong } from "react-icons/bi";
import { IconType } from "react-icons";

export function SideBarComponent({
    name,
    description,
}: {
    name: string,
    description: string,
}) {
    return (
        <div className="flex flex-row items-center h-11  hover:bg-sky-700 ">
            <BiBong className="" size={40} />
            <div className=" pl-4">
                <p className="text-lg font-bold">{name}</p>
                <p className="italic">{description}</p>
            </div>
        </div>
    )
}
