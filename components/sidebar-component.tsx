'use client'
import { ISidebarChildren } from "@/custom-types";
import { IconType } from "react-icons";
import Link from "next/link";
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
            <div className={`flex flex-row items-center gap-1 ${(pathname == href || pathname == `${href}/chat`) && 'bg-[#7242f5] text-[#e9ecef]'} rounded-2xl w-[100%] p-1 hover:bg-[#7242f5] hover:text-[#e9ecef]`}>
                <Icon className="flex-shrink-0" size={20} />
                <div className="flex justify-between pr-2 items-center w-[100%]">
                    <Link href={href} className="text-xl">{name}</Link>
                    {children && displayChildren && children.length > 0 && <IoIosArrowUp onClick={() => setDisplayChildren(false)} />}
                    {children && !displayChildren && children.length > 0 && <IoIosArrowDown onClick={() => setDisplayChildren(true)} />}
                </div>
            </div>
            <div className="flex flex-col text-justify text-md mt-2 mb-2">
                {displayChildren && children?.map((element, index) => {
                    let classN = 'flex flex-row gap-1 items-center text-center pl-6 rounded-[6px] hover:font-semibold  hover:text-xl hover:text-[#7242f5]'

                    if (`${pathname}?id=${id}` == element.href || `${pathname}` == element.href) {
                        classN = `${classN} text-[#7242f5] font-semibold text-xl`
                        console.log(element.name)
                    }
                    return (
                        <Link key={index} href={element.href} className={classN}>
                            <element.Icon />
                            {element.name}
                        </Link>)
                })}
            </div>
        </div >
    )
}
