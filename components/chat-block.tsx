import { IChat, IMessage, IUserContext } from "@/custom-types";
import { ChatMessage } from "./chat-message";
import { IoMdSend } from "react-icons/io";

export function ChatBlock({
    id,
    chat,
    isReadonly,
}: {
    id: string;
    chat: IChat;
    isReadonly: boolean;
}) {
    return (
        <div className=" flex flex-col max-h-5/6 w-full gap-3 pt-3 pb-2">
            <div className="flex justify-between">
                <div className="font-semibold text-slate-600">{chat.name}</div>
                <div className=" text-slate-600">{chat.model}</div>
            </div>
            <div className="flex flex-col gap-4 mx-auto p-4 rounded-3xl w-full h-5/6 rounded-3xl overflow-auto shadow-[0_3px_10px_rgb(0,0,0,0.2)] shadow-indigo-600/20" >
                {chat.messages.map((message, index) => (
                    <ChatMessage key={index} messageData={message} />
                ))}
            </div>
            <div className="pt-8 gap-10 w-full">
                <div className="flex justify-between shadow-[0_3px_10px_rgb(0,0,0,0.2)] shadow-indigo-600/20 rounded-3xl p-4 ">
                    <input className="  text-xl focus:outline-none select-none flex bg-transparent w-11/12 items-center   " placeholder="привет мир!" type="text" />
                    <button className="flex flex-row select-none bg-transparent text-center items-center">
                        <IoMdSend className="flex" size={20} />
                    </button>
                </div>
            </div>
        </div>
    )
}
