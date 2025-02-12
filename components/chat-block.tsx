'use client'
import { IChatForFront } from "@/custom-types";
import { ChatMessage } from "./chat-message";
import { IoMdSend } from "react-icons/io";
import { useState } from "react";
import { MdOutlineEdit } from "react-icons/md";
import { getAnswer } from "@/gemini/chat-handler";



export function ChatBlock({
    id,
    chat,
    isReadonly,
}: {
    id: string;
    chat?: IChatForFront;
    isReadonly: boolean;
}) {
    const keyDown = async (event: any) => {

        if (event.key == 'Enter') {
            console.log(inputMsgState)
            const result = await getAnswer('привет')
        }
    };
    const updateChatName = async (event: any) => {
        console.log(event.target.value)
    }

    const [inputMsgState, setInputMsgState] = useState('')


    return (
        <div className=" flex flex-col max-h-5/6 w-[85%] gap-3 pt-3 pb-2">
            <div className="flex justify-between">
                <div className="flex flex-row gap-1 items-center ">
                    <MdOutlineEdit />
                    <input className="font-semibold text-slate-600 focus:outline-none bg-transparent" onChange={updateChatName} defaultValue={chat?.name} />
                </div>
                <div className=" text-slate-600">{chat?.model}</div>
            </div>
            <div className="flex flex-col gap-4 mx-auto p-4 rounded-3xl w-full h-5/6 rounded-3xl overflow-auto shadow-[0_3px_10px_rgb(0,0,0,0.2)] " >
                {chat?.messages.map((message, index) => (
                    <ChatMessage key={index} messageData={message} />
                ))}
            </div>
            <div className="pt-8 gap-10 w-full">
                <div className="flex justify-between shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-3xl p-4 ">
                    <input className="  text-xl focus:outline-none select-none flex bg-transparent w-11/12 items-center   " placeholder="привет мир!" type="text" onKeyDown={keyDown} onChange={(event) => setInputMsgState(event.target.value)} />
                    <button className="flex flex-row select-none bg-transparent text-center items-center">
                        <IoMdSend className="flex" size={20} />
                    </button>
                </div>
            </div>
        </div>
    )
}
