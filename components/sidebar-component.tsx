import { ISidebarChildren } from "@/custom-types";
import { IconType } from "react-icons";
import Link from "next/link";
import { TbRobot } from "react-icons/tb";
import { FaRobot } from "react-icons/fa6";
import { RiChatAiLine } from "react-icons/ri";

export function SideBarComponent({
    href,
    name,
    description,
    Icon,
    children,
}: {
    href: string,
    name: string,
    description: string,
    Icon: IconType,
    children?: ISidebarChildren[]
}) {
    return (
        <div className="flex flex-col ">
            <div className="flex flex-row items-center gap-1 ">
                <Icon className="flex-shrink-0" size={20} />
                <div >
                    <Link href={href} className="text-xl font-semibold">{name}</Link>
                </div>
            </div>
            <div className="flex flex-col text-md ">
                {children?.map((element) => {
                    return (
                        <Link key={element.name} href={element.href} className="flex flex-row gap-1 items-center text-center pl-6 text-slate-600">
                            <RiChatAiLine />
                            {element.name}
                        </Link>)
                })}
            </div>
        </div >
    )
}
