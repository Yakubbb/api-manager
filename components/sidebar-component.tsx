import { IMessage } from "@/custom-types";
import { ChatMessage } from "./chat-message";
import { IconType } from "react-icons";
import Link from "next/link";


export function SideBarComponent({
    href,
    name,
    description,
    Icon,
}: {
    href:string,
    name: string,
    description: string,
    Icon: IconType
}) {
    return (
        <Link  className="flex flex-row items-center max-h-max  hover:bg-sky-700 hover:rounded-2xl hover:cursor-pointer" href={href}>
            <Icon className="flex-shrink-0" size={40} />
            <div className=" pl-4">
                <p className="text-md font-bold">{name}</p>
                <p className="text-xs">{description}</p>
            </div>
        </Link >
    )
}
