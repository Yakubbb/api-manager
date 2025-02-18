'use client'
import { IMessage } from "@/custom-types";
import { FiCopy } from "react-icons/fi";
import Markdown from 'react-markdown'
import { useEffect, useState } from "react";


export function ClientChatMessage({ message }: { message: IMessage }) {

    const [messageText, setMessageText] = useState<{ text: string }>(message.parts[0])


    const msgType: { [key: string]: string } = {
        'model': 'self-start bg-[#cccccc] rounded-e-xl rounded-es-xl',
        'user': 'self-end bg-indigo-400 rounded-s-xl rounded-se-xl',
        'system': ''
    }

    useEffect(() => {
        setMessageText(message.parts[0])

    }, [message])




    return (
        <div className={`flex flex-col min-w-20 max-w-xl p-2 ${msgType[message.role]}`}>

            <div className="flex flex-wrap text-justify">
                {message.parts.map((m, index) => {
                    return (
                        <Markdown className="w-100% h-100% p-2" key={index}>
                            {messageText.text}
                        </Markdown>
                    )
                })}
            </div>

            <div className="flex justify-end w-[100%] p-2 text-xl ">
                <FiCopy className="flex self-end" />
            </div>
        </div>
    )
}