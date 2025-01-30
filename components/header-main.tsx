import { IMessage } from "@/custom-types";
import { ChatMessage } from "./chat-message";
import { GiShamblingZombie } from "react-icons/gi";
import { CiUser } from "react-icons/ci";

export function MainHeader({

}: {

    }) {
    return (
        <header>
            <div className="flex justify-between ">
                <div className=" flex justify-start max-w-full pt-1 pb-5 text-center items-center text-xl p-6 pt-2">
                    <div className="pr-2 ">Aboba</div>
                    <div className="flex  text-sm   p-1  font-bold">version:0.0.0</div>
                </div>
            </div>
        </header>
    )
}
