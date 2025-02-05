'use server'

import { IChat } from "@/custom-types"
import Link from "next/link"
import { BiExpandHorizontal } from "react-icons/bi"
import { TbMoodLookDown } from "react-icons/tb"
import Markdown from "react-markdown"

export default async function ({ chats }: {
    chats: IChat[]
}) {
    return (
        <div className="flex flex-col h-full w-[30%] rounded-3xl p-3 bg-[#A9A9A9] right">
            <p className="flex flex-row text-xl font-semibold mb-3">Ваши чаты с Gemini</p>
            {chats.length == 0 && <div className="mt-[50%] flex flex-col gap-1 self-center items-center text-center text-3xl"><TbMoodLookDown className="text-4xl" /> Здесь пока ничего нет</div>}
            {chats.map((chat, index) => {
                return (
                    <Link className="flex flex-col border-l-[#303030] border-l-2 p-2 hover:bg-[#A0A0A0]" key={index} href={`/main/gemini/${index}`}>
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