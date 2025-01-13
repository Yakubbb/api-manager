import { IMessage } from "@/custom-types";
import { ChatMessage } from "./chat-message";

export function MainHeader({

}: {

    }) {
    return (
        <header>
            <nav className=" flex max-w-full  justify-between pt-5 pb-5 pl-10">
                <div className="flex lg:flex-1">
                    <a href="#" className="-m-1.5 p-1.5">
                        <img
                            src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                            className="h-11 w-auto"
                        />
                    </a>
                </div>
            </nav>
        </header>
    )
}
