'use server'
import { IMessage } from "@/custom-types";
import { TbServer } from "react-icons/tb";
import { PiRobotBold } from "react-icons/pi";
import Markdown from 'react-markdown'

export async function ChatMessage({
    messageData
}: {
    messageData: IMessage
}) {
    var element
    switch (messageData.role) {
        case 'user':
            return (<UserMessage messageData={messageData} />)
        case 'model':
            return (<BotMessage messageData={messageData} />)
        default:
            return (<UserMessage messageData={messageData} />)
    }
}

function UserMessage({
    messageData
}: {
    messageData: IMessage
}) {
    return (
        <article className="flex items-start gap-2.5 self-end max-w-fit">
            <div className="flex flex-col w-full  leading-1.5 p-4 border-gray-200 rounded-s-xl rounded-se-xl bg-indigo-400">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="text-sm font-semibold">{messageData.name}</span>
                    <span className="text-sm font-normal">{messageData.time}</span>
                </div>
                <div className="text-md font-normal py-2.5 text-lg">{messageData.parts.map((part) => {
                    return (<Markdown key={part}>{part}</Markdown>)
                })}</div>
            </div>
            <img className="size-9 self-end flex-none object-cover rounded-full" src="https://i.pinimg.com/736x/81/05/56/810556c228c093f06deea98a4c2081a9.jpg" alt="profile pic" />
        </article>
    )
}

function BotMessage({
    messageData
}: {
    messageData: IMessage
}) {
    return (
        <div className="max-w-fit">
            <article className="flex items-start gap-2.5 self-start">
                <img className="size-9 self-start flex-none object-cover rounded-full" src="https://i.pinimg.com/736x/d6/dc/58/d6dc586bbc300a71b307fd980f0be89e.jpg" alt="profile pic" />
                <div className="flex flex-col w-full leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <span className="text-sm font-semibold">{messageData.name}</span>
                        <span className="text-sm font-normal ">{messageData.time}</span>
                    </div>
                    <div className="text-md font-normal py-2.5 text-lg">{messageData.parts.map((part) => {
                        return (<Markdown key={part}>{part}</Markdown>)
                    })}</div>
                </div>
            </article>
            <div className="flex flex-row pl-11 text-center items-center gap-1">
                <TbServer />{messageData.serverTime + " sec"}
                <PiRobotBold />{messageData.modelTime + " sec"}
            </div>
        </div>
    )
}
