import { IMessage } from "@/custom-types";
import { ChatMessage } from "./chat-message";
import { IoMdSend } from "react-icons/io";

export function ChatBlock({
    id,
    history,
    isReadonly,
}: {
    id: string;
    history: Array<IMessage>;
    isReadonly: boolean;
}) {
    return (
        <div className=" flex flex-col  w-[80%] max-h-5/6 shrink-0 ">
            <div className="flex flex-col gap-4 mx-auto p-4 rounded-3xl w-full h-5/6 rounded-3xl shadow-2xl shadow-indigo-600/20 overflow-auto ">
                {history.map((message, index) => (
                    <ChatMessage key={index} messageData={message} />
                ))}
            </div>
            <div className="pt-8 gap-10 w-full">
                <div className="flex justify-between shadow-2xl shadow-indigo-600/40 rounded-3xl p-4 ">
                    <input className="  text-xl focus:outline-none select-none flex bg-transparent w-11/12 items-center   " placeholder="привет мир!" type="text" />
                    <button className="flex flex-row select-none bg-transparent text-center items-center">
                        <IoMdSend className="flex" size={20} />
                    </button>
                </div>
            </div>
        </div>
    )
}
