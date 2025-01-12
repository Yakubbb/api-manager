import { IMessage } from "@/custom-types";
import { ChatMessage } from "./chat-message";

export function Chat({
    id,
    history,
    isReadonly,
}: {
    id: string;
    history: Array<IMessage>;
    isReadonly: boolean;
}) {
    return (
        <div className="flex flex-col gap-4 max-w-3xl mx-auto p-4 bg-gray-800 rounded-lg shadow-lg">
            {history.map((message, index) => (
                <ChatMessage key={index} messageData={message} />
            ))}
        </div>
    )
}
