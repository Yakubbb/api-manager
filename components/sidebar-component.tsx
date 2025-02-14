'use client'
import { ISidebarChildren } from "@/custom-types";
import { IconType } from "react-icons";
import Link from "next/link";
import { TbRobot } from "react-icons/tb";
import { FaRobot } from "react-icons/fa6";
import { RiChatAiLine } from "react-icons/ri";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";

import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

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

    const [displayChildren, setDisplayChildren] = useState<boolean>(true)

    const pathname = usePathname()
    const params = useSearchParams()
    const id = params.get('id') || 'none'

    return (
        <div className={`flex flex-col`}>
            <div className={`flex flex-row items-center gap-1 ${(pathname == href || pathname == `${href}/chat`) && 'bg-[#cccccc]'} rounded-2xl w-[100%] p-1 hover:bg-[#cccccc]`}>
                <Icon className="flex-shrink-0" size={20} />
                <div className="flex justify-between gap-1 items-center">
                    <Link href={href} className="text-xl">{name}</Link>
                    {children && displayChildren && <IoIosArrowUp onClick={() => setDisplayChildren(false)} />}
                    {children && !displayChildren && <IoIosArrowDown onClick={() => setDisplayChildren(true)} />}
                </div>
            </div>
            <div className="flex flex-col text-justify text-md mt-2 mb-2">
                {displayChildren && children?.map((element, index) => {
                    return (
                        <Link key={index} href={element.href} className={`${`${pathname}?id=${id}` == element.href || `${pathname}` == element.href && 'bg-[#7242f5]'} flex flex-row gap-1 items-center text-center pl-6 text-slate-700 rounded-[6px] hover:bg-[#7242f5]`}>
                            <element.Icon />
                            {element.name}
                        </Link>)
                })}
            </div>
        </div >
    )
}
