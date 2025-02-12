'use server'

import { IChat, IChatForFront } from "@/custom-types"
import Link from "next/link"
import { BiExpandHorizontal } from "react-icons/bi"
import { TbMoodLookDown } from "react-icons/tb"
import Markdown from "react-markdown"

export default async function ({ chats }: {
    chats?: IChatForFront[]
}) {
    return (
        <div className="flex flex-col h-full w-[30%] rounded-3xl p-3 bg-[#C8C8C8] overflow-y-scroll">
            <div className="flex flex-col text-xl mb-3">
                <div className="flex font-semibold">Ваши чаты с Gemini</div>
                <div className="flex text-md">{chats?.length}</div>
            </div>
            {chats?.length == 0 && <div className="mt-[50%] flex flex-col gap-1 self-center items-center text-center text-3xl"><TbMoodLookDown className="text-4xl" /> Здесь пока ничего нет</div>}
            {chats?.reverse().map((chat, index) => {
                return (
                    <Link className="flex flex-col border-l-[#303030] border-l-2 p-2 hover:bg-[#A0A0A0]" key={index} href={`/main/gemini/chat?id=${chat._id}`}>
                        <div className="flex flex-row gap-1 text-xl font-semibold">
                            {chat.name}
                        </div>
                        <div className="text-md">
                            <Markdown>{chat.desription}</Markdown>
                        </div>
                        <div className="flex flex-row gap-1 text-xs text-center items-center">
                            <div><BiExpandHorizontal /></div>
                            <div>{chat.model}</div>
                        </div>
                    </Link>
                )
            })}
        </div>
    )
}