'use client'
import { IChatForFront, IMessage, IModel } from "@/custom-types";
import { ClientChatMessage } from "./chat-message";
import { IoMdSend } from "react-icons/io";
import React, { useEffect, useRef, useState } from "react";
import { MdOutlineEdit } from "react-icons/md";
import { addMessageToChat } from "@/server-side/chat-handler";
import { generate2 } from "@/server-side/gemini";
import { readStreamableValue } from "ai/rsc";
import { ModelOptionsBar } from "./model-options-bar";

export function ChatBlock({
    chat,
    avalibleModels,
}: {
    chat: IChatForFront,
    avalibleModels?: IModel[]
}) {

    const [messages, setMessages] = useState<IMessage[]>([])

    const [currentBotMessage, setCurrentBotMessage] = useState<IMessage>()
    const [currentBotMessageText, setCurrentBotMessageText] = useState<string>()

    const [chatName, setChatName] = useState<string>('')

    const container = useRef<HTMLDivElement>(null)

    const generateResponse = async (lastQuestion: IMessage, botMessage: IMessage) => {

        console.log(messages)

        const { output } = await generate2(messages.concat([lastQuestion]));

        let newMSg = botMessage
        let currentText = ''

        for await (const delta of readStreamableValue(output)) {


            currentText = `${currentText}${delta}`;

            newMSg = {
                role: 'model',
                parts: [
                    {
                        text: currentText
                    }
                ]
            } as IMessage

            setCurrentBotMessage(newMSg)
            console.log(currentText)
        }
        setCurrentBotMessage(undefined)

        const newMessages = [...messages.concat([lastQuestion]), newMSg]

        setMessages(newMessages)
        addMessageToChat(chat._id, [lastQuestion, newMSg])
    }


    useEffect(() => {
        setMessages(chat.messages)
        setChatName(chat.name)
    }, [chat]);


    useEffect(() => {

        const { scrollHeight } = container.current as HTMLDivElement
        container.current?.scrollTo(0, scrollHeight)

    }, [messages])

    const logeega = async (event: FormData) => {
        const msg = event.get('msg')?.toString()
        if (msg) {

            const newUserMessage: IMessage = {
                role: 'user',
                parts: [
                    {
                        text: msg
                    }
                ],
            }

            const futureBotMessage: IMessage = {
                role: 'model',
                parts: [
                    {
                        text: ''
                    }
                ],
            }


            setMessages([
                ...messages,
                newUserMessage,
            ])

            generateResponse(newUserMessage, futureBotMessage)
            //await addMessageToChat(chat?._id, newUserMessage)
        }
    }

    const updateChatName = async (event: any) => {
        setChatName(event.target.value)
    }


    return (
        <div className="flex flex-row w-[100%] gap-4">
            <div className=" flex flex-col grow w-[85%] gap-3 pt-1 pb-1">
                <div className="flex justify-between">
                    <div className="flex flex-row gap-1 items-center ">
                        <MdOutlineEdit />
                        <input className="font-semibold text-slate-600 focus:outline-none bg-transparent" onInput={updateChatName} defaultValue={chat?.name} />
                    </div>
                    <div className=" text-slate-600">{chat?.model}</div>
                </div>
                <div className="flex flex-col gap-4 mx-auto p-4 rounded-xl w-full  grow rounded-3xl overflow-auto shadow-[0_3px_10px_rgb(0,0,0,0.2)] " ref={container}  >
                    {messages.map((message, index) => {
                        return (
                            <ClientChatMessage key={index} message={message} />
                        )
                    })}
                    {
                        currentBotMessage && <ClientChatMessage message={currentBotMessage} />
                    }
                </div>
                <div className="pt-3 gap-10 w-full">
                    <form className="flex justify-between shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-3xl p-4 mb-2 " action={logeega}>
                        <input name="msg" className="  text-xl focus:outline-none select-none flex bg-transparent w-11/12 items-center   " placeholder="привет мир!" type="text" />
                        <button type="submit" className="flex flex-row select-none bg-transparent text-center items-center">
                            <IoMdSend className="flex text-[#7242f5]" size={30} />
                        </button>
                    </form>
                </div>
            </div>
            <ModelOptionsBar avalibleModels={avalibleModels} />
        </div>
    )
}
