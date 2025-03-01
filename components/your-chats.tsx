'use client'

import { IChat, IChatForFront } from "@/custom-types"
import Link from "next/link"
import { BiExpandHorizontal } from "react-icons/bi"
import { TbMoodLookDown } from "react-icons/tb"
import Markdown from "react-markdown"
import { MdDeleteOutline } from "react-icons/md";
import { useEffect, useState } from "react"
import { deleteChat, getChatLinks } from "@/server-side/chat-handler"
import { redirect } from "next/navigation"

export default function () {

    const [chats, setChats] = useState<IChatForFront[]>([])


    const updateChats = async () => {
        setChats(await getChatLinks())
    }

    const removeChat = async (chatId: string) => {
        await deleteChat(chatId)
        await updateChats()
        redirect(`/main/gemini?deleted=${chatId}`)
    }

    useEffect(() => {

        updateChats()

    }, [])

    return (
        <div className="flex flex-col h-full w-[30%] gap-2 rounded-3xl p-3 bg-lightCoolBaseBg bg-mono-cool-radial-bg shadow-[0_3px_10px_rgb(0,0,0,0.2)]  overflow-y-scroll">
            <div className="flex flex-row gap-3 text-xl mb-3">
                <div className="flex font-semibold">Ваши чаты с Gemini</div>
                <div className="flex text-md">{chats?.length}</div>
            </div>
            {chats?.length == 0 && <div className="mt-[50%] flex flex-col self-center items-center text-center text-3xl"><TbMoodLookDown className="text-4xl" /> Здесь пока ничего нет</div>}
            {chats?.reverse().map((chat, index) => {
                return (
                    <div className="flex flex-col bg-[#ffffff] rounded-2xl text-[#7242f5] p-2 " key={index}>
                        <div className="flex justify-between gap-1 text-xl font-semibold items-center text-center">
                            <Link href={`/main/gemini/chat?id=${chat._id}`} className=" rounded-xl p-2">
                                {chat.name}
                            </Link>
                            <div className="hover:text-[#ff3333] text-[#363636] hover:cursor-pointer" onClick={async () => await removeChat(chat._id)}>
                                <MdDeleteOutline size={30} />
                            </div>
                        </div>
                        <div className="text-md">
                            <Markdown>{chat.desription}</Markdown>
                        </div>
                        <div className="flex flex-row gap-1 text-xs text-center items-center text-[#5b5966]">
                            <div>{`<${chat.model}>`}</div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}