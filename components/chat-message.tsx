'use client'
import { IMessage } from "@/custom-types";
import { FiCopy } from "react-icons/fi";
import Markdown from 'react-markdown'
import { useEffect, useState } from "react";
import { RiRobot2Line } from "react-icons/ri";
import { GiScreaming } from "react-icons/gi";
import { BiError } from "react-icons/bi";
import { FaTemperatureThreeQuarters } from "react-icons/fa6";
import { TbReload } from "react-icons/tb";



export function ClientChatMessage({ message, regenerateHook }: { message: IMessage, regenerateHook?: () => void }) {

    const [messageText, setMessageText] = useState<{ text: string }>(message.parts[0])


    const msgType: { [key: string]: string } = {
        'model': 'self-start border hover:border-[#818cf8] rounded-e-xl rounded-es-xl w-full',
        'user': 'self-end bg-[#f3f3f6] rounded-s-xl rounded-se-xl',
        'system': 'self-start border border-[#ecbf42] hover:border-[#ecbf42] self-center p-1 rounded-xl font-semibold'
    }

    useEffect(() => {
        setMessageText(message.parts[0])

    }, [message])




    return (
        <div className="flex flex-col gap-2 p-2 group/item font-main2  ">
            <div className="flex flex-row gap-1 self-end invisible group-hover/item:visible rounded-xl ">
                <FiCopy className="flex self-end hover:cursor-pointer active:scale-75 transition-transform" onClick={() => navigator.clipboard.writeText(message.parts[0].text)} size={15} />
                {regenerateHook && message.role == 'model' && <TbReload className="flex self-end hover:cursor-pointer active:scale-75 transition-transform" onClick={() => regenerateHook()} size={15} />}
            </div>
            <div className={`flex flex-col p-2 ${msgType[message.role]}`}>
                <div className="flex flex-col">
                    {message.parts.map((m, index) => {
                        return (
                            <Markdown className="" key={index} >
                                {messageText.text}
                            </Markdown>
                        )
                    })}
                    {message.isCreating == true &&
                        <div className="flex flex-row gap-1 size-1">
                            <span className="size-1 animate-bounce rounded-full bg-indigo-400 p-2"></span>
                        </div>
                    }
                    {message.error &&
                        <div className="flex flex-row gap-1 rounded-xl border-2 border-[#c71436] text-[#c71436] bg-[#fbd9df] items-center w-[100%] text-center mt-5 p-2">
                            <BiError />
                            {message.error}
                        </div>
                    }
                </div>

                <div className="flex justify-end flex-row gap-4 w-[100%] p-2 text-xl items-center font-semibold ">
                    {
                        message.role == 'model' &&

                        <div className="flex flex-row gap-1 text-xs items-center">
                            {message.model}
                        </div>
                    }
                    {
                        message.role == 'system' &&

                        <div className="flex flex-row gap-1 text-xs items-center font-bold">
                            системный промпт
                        </div>
                    }
                    {
                        message.role == 'model' && message.temp &&

                        <div className="flex flex-row gap-1 text-xs items-center">
                            <FaTemperatureThreeQuarters />
                            {message.temp}
                        </div>
                    }

                </div>
            </div>
        </div>
    )
}