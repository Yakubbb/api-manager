import { IMessage } from "@/custom-types";


export function ChatMessage({
    messageData
}: {
    messageData: IMessage
}) {
    var element
    switch (messageData.role) {
        case 'user':
            return (<UserMessage messageData={messageData} />)
        case 'bot':
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
        <div className="flex items-start gap-2.5 self-end">
            <div className="flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-s-xl rounded-se-xl dark:bg-gray-700">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{messageData.role}</span>
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{messageData.time}</span>
                </div>
                <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">{messageData.data}</p>
            </div>
            <img className="size-9 self-end flex-none object-cover rounded-full" src="https://i.pinimg.com/736x/de/a2/da/dea2dacfaddd5c6333977d95bb8b5cd5.jpg" alt="profile pic" />
        </div>
    )
}

function BotMessage({
    messageData
}: {
    messageData: IMessage
}) {
    return (
        <div className="flex items-start gap-2.5 self-start">
            <img className="size-9 self-start flex-none object-cover rounded-full" src="https://i.pinimg.com/736x/de/a2/da/dea2dacfaddd5c6333977d95bb8b5cd5.jpg" alt="profile pic" />
            <div className="flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{messageData.role}</span>
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{messageData.time}</span>
                </div>
                <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">{messageData.data}</p>
            </div>
        </div>
    )
}

