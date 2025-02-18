'use client'
import { IMessage } from "@/custom-types";
import { FiCopy } from "react-icons/fi";
import Markdown from 'react-markdown'
import { useEffect, useState } from "react";
import { generate2 } from "@/server-side/gemini";
import { readStreamableValue } from "ai/rsc";


export function ClientChatMessage({ message, history, setHistory, thisMessageIndex }:
    { message: IMessage, history?: IMessage[], setHistory?: (history: IMessage[]) => void, thisMessageIndex: number }) {

    const [messageText, setMessageText] = useState<string>(message.parts[0].text)

    const createMessage = async () => {

        if (!history || !setHistory) {
            return
        }

        const { output } = await generate2(history.filter((message, index) => index != thisMessageIndex));

        for await (const delta of readStreamableValue(output)) {
            console.log(delta)
            setMessageText(messageText => `${messageText}${delta}`);
        }

        setHistory([
            ...history.filter((aboba, index) => index != thisMessageIndex),
            {
                role: message.role,
                parts: [
                    {
                        text: messageText
                    }
                ],
                isCreating: false
            }
        ])
    }


    const msgType: { [key: string]: string } = {
        'model': 'self-start bg-[#cccccc] rounded-e-xl rounded-es-xl',
        'user': 'self-end bg-indigo-400 rounded-s-xl rounded-se-xl',
        'system': ''
    }


    useEffect(() => {
        setMessageText(message.parts[0].text)

        if (message.isCreating) {
            message.isCreating = false
            if (setHistory && history) {
                setHistory([
                    ...history.filter((aboba, index) => index != thisMessageIndex),
                    {
                        role: message.role,
                        parts: [
                            {
                                text: messageText
                            }
                        ],
                        isCreating: false
                    }
                ])
                createMessage()
            }
        }
    }, [message])


    return (
        <div className={`flex flex-col min-w-20 max-w-xl p-2 ${msgType[message.role]}`}>

            <div className="flex flex-wrap text-justify">
                {message.parts.map((m, index) => {
                    return (
                        <div className="w-100% h-100% p-2" key={index}>
                            {messageText}
                        </div>
                    )
                })}
            </div>

            <div className="flex justify-end w-[100%] p-2 text-xl ">
                <FiCopy className="flex self-end" />
            </div>
        </div>
    )
}