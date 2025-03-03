'use client'
import { IMessage } from "@/custom-types";
import { FiCopy } from "react-icons/fi";
import Markdown from 'react-markdown'
import { useEffect, useState } from "react";
import { RiRobot2Line } from "react-icons/ri";
import { GiScreaming } from "react-icons/gi";
import { BiError } from "react-icons/bi";



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

            <div className="flex flex-wrap text-justify p-2 ">
                {message.parts.map((m, index) => {
                    return (
                        <Markdown className="min-w-20 max-w-xl" key={index} >
                            {messageText.text}
                        </Markdown>
                    )
                })}
                {message.isCreating == true &&
                    <div className="flex flex-row gap-1 size-1 p-4">
                        <span className="size-1 animate-bounce rounded-full bg-indigo-400 p-2"></span>
                    </div>
                }
                {message.error &&
                    <div className="flex flex-row gap-1 rounded-xl border-2 border-[#c71436] text-[#c71436] bg-[#fbd9df] p-3 items-center w-[100%] text-center mt-5">
                        <BiError />
                        {message.error}
                    </div>
                }
            </div>

            <div className="flex justify-end flex-row gap-4 w-[100%] p-2 text-xl items-center ">
                {
                    message.role == 'model' &&

                    <div className="flex flex-row gap-1 text-xs font-semibold items-center">
                        <RiRobot2Line />
                        {message.model}
                    </div>
                }
                {
                    message.role == 'model' &&

                    <div className="flex flex-row gap-1 text-xs font-semibold items-center">
                        <GiScreaming />
                        {message.person}
                    </div>
                }


                <FiCopy className="flex self-end hover:cursor-pointer " onClick={() => navigator.clipboard.writeText(message.parts[0].text)} />
            </div>
        </div>
    )
}