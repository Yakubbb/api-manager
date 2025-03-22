'use client'
import { LuCookie } from "react-icons/lu";
import { useEffect, useState } from "react";
import { getHistories } from "@/server-side/database-handler";
import { FiFileText } from "react-icons/fi";

const keys = [
    {
        name: 'aboba',
        key: '123213'
    },
    {
        name: 'hoba',
        key: '1232421421413'
    },
    {
        name: 'bobboba',
        key: '55555'
    },
    {
        name: 'adsdsad',
        key: '123213'
    }
]
export default function Home() {

    const [publicHistories, setPublicHistories] = useState<any[]>()
    useEffect(() => {
        const fetchHistories = async () => {
            setPublicHistories(await getHistories())
        }
        fetchHistories()
    }, [])

    return (
        <section className="flex flex-row h-[100%] w-[100%] gap-5 p-4 overflow-y-scroll">
            <div>
                <div className="flex flex-row gap-2 text-3xl font-bold items-center">
                    <LuCookie />
                    истории чатов
                </div>
                <div className="flex flex-wrap gap-3 w-full h-full p-4">
                    {publicHistories?.map((chat, index) => {
                        return (
                            <div className="flex flex-col gap-1 rounded-xl p-4 w-max h-max border bg-[#f3f4f6]" key={index}>
                                <div className="flex flex-row gap-1 font-semibold items-center">
                                    <FiFileText className="text-[#7242f5] "/>
                                    {chat.historyName}
                                </div>
                                {chat.historyDescription && <div className="bg-[#7242f5] text-white rounded-md p-2 w-full font-main2 ">
                                    <div className="font-semibold">
                                        описание:
                                    </div>
                                    {chat.historyDescription}
                                </div>}
                                <div className="text-xs font-bold">
                                    {chat.author}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>

    );
}
