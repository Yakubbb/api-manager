import { IMessage } from "@/custom-types";
import { ChatMessage } from "./chat-message";
import { GiShamblingZombie } from "react-icons/gi";
import { CiUser } from "react-icons/ci";

export function MainHeader({

}: {

    }) {
    return (
        <header>
            <div className="flex justify-between">
                <div className=" flex justify-start max-w-full pt-5 pb-5 text-center items-center text-xl ">
                    <GiShamblingZombie size={40} />
                    <div className="pr-2 ">/API-tester</div>
                    <div className="flex bg-slate-900  text-sm border rounded-3xl shadow-inner shadow-red-800 p-1 border-blue-800">version:0.0.0</div>
                </div>
                <nav className=" flex justify-start max-w-full pt-5 pb-5 text-center items-center text-xl ">
                    <button>
                        <CiUser size={40}/>
                    </button>
                </nav>
            </div>
        </header>
    )
}
