'use client'
import { IChatForFront, IMessage, IModel } from "@/custom-types";
import { ClientChatMessage } from "./chat-message";
import { IoMdSend } from "react-icons/io";
import React, { useEffect, useRef, useState } from "react";
import { CiTrash } from "react-icons/ci";
import { addMessageToChat, updateChatHistory } from "@/server-side/chat-handler";
import { generate2 } from "@/server-side/gemini";
import { readStreamableValue } from "ai/rsc";
import { IModelOptions, ModelOptionsBar } from "./model-options-bar";

interface ChatBlockProps {
    chat: IChatForFront;
    avalibleModels?: IModel[];
}




export function ChatBlock({
    chat,
    avalibleModels,
}: ChatBlockProps) {

    const defaultOptions: IModelOptions = {
        selectedModel: avalibleModels?.[0],
        person: undefined,
        systemPrompt: '',
        temperature: 0.4,
        apiKey: '',
        chatHistoryEnabled: true
    }

    const [messages, setMessages] = useState<IMessage[]>([]);
    const [currentBotMessage, setCurrentBotMessage] = useState<IMessage>();
    const [chatName, setChatName] = useState<string>('');
    const messagesContainer = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const [modelOptions, setModelOptions] = useState<IModelOptions>(defaultOptions)


    const updateMessageHistory = async (messages: IMessage[]) => {
        setMessages(messages)
        await updateChatHistory(chat._id, messages)
    }

    const generateResponse = async (lastQuestion: IMessage, botMessage: IMessage) => {
        const history = messages
            .concat([lastQuestion])
            .filter(msg => msg.error == undefined && msg.parts[0].text != '');

        const { output } = await generate2(
            history,
            modelOptions.selectedModel?.modelName || 'gemini-2.0-flash',
            modelOptions.temperature,
            modelOptions.systemPrompt || ''
            , [] as IMessage[]);

        let newBotMessage = botMessage;
        let currentText = '';

        for await (const delta of readStreamableValue(output)) {
            if (delta?.type !== 'error') {
                currentText += delta?.msg;
            }

            newBotMessage = {
                role: 'model',
                parts: [{ text: currentText }],
                isCreating: true,
                model: delta?.model,
                person: delta?.person,
                error: delta?.type === 'error' ? delta.msg : undefined,
                temp: delta?.temp
            } as IMessage;

            setCurrentBotMessage(newBotMessage);
        }

        setCurrentBotMessage(undefined);
        newBotMessage.isCreating = false;
        const updatedMessages = [...messages, lastQuestion, newBotMessage];
        updateMessageHistory(updatedMessages);
    };

    useEffect(() => {
        setMessages(chat.messages);
        setChatName(chat.name);
    }, [chat]);

    useEffect(() => {
        if (messagesContainer.current) {
            messagesContainer.current.scrollTop = messagesContainer.current.scrollHeight;
        }
    }, [messages, currentBotMessage]);

    useEffect(() => {
        if (messages.length == 2) {
            
        }
    }, [messages]);


    const createMessage = async (event: FormData) => {
        const msg = event.get('msg')?.toString();
        if (msg) {
            const newUserMessage: IMessage = {
                role: 'user',
                parts: [{ text: msg }],
            };
            const botMessageTemplate: IMessage = {
                role: 'model',
                parts: [{ text: '' }],
            };

            setMessages(prevMessages => [...prevMessages, newUserMessage]);
            generateResponse(newUserMessage, botMessageTemplate);
        }
    };

    const handleChatNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChatName(event.target.value);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.ctrlKey && event.key === 'Enter') {
            event.preventDefault();
            formRef.current?.requestSubmit();
        }
    };

    const handleEditMsg = async (msgNumber: number, msgText: string) => {

    }

    const handleRegenerateMsg = (msgNumber: number) => {

    }


    return (
        <div className="flex flex-row w-full ">
            <div className="flex flex-col w-full gap-3 border">
                <div
                    className="flex flex-col  grow  overflow-hidden ">
                    <div className="flex p-4 pb-2 bg-[#f3f3f6] p-2 m-2 rounded-xl border">
                        <h2 className="text-xl font-semibold">{chatName}</h2>
                    </div>
                    <div
                        ref={messagesContainer}
                        className="flex flex-col gap-4 mx-auto pt-2  w-[90%]  h-[calc(100%-120px)] overflow-y-auto overflow-x-hidden   p-3" >
                        {
                            modelOptions.systemPrompt &&
                            <ClientChatMessage message={{
                                role: 'system',
                                parts: [
                                    {
                                        text: modelOptions.systemPrompt
                                    }
                                ]
                            }} />
                        }
                        {messages.length > 0 && messages.map((message, index) => (
                            <ClientChatMessage key={index} message={message} regenerateHook={() => handleRegenerateMsg(index)} />
                        ))}
                        {currentBotMessage && <ClientChatMessage message={currentBotMessage} />}
                    </div>
                    <div className="sticky bottom-0 w-[90%] self-center pb-2 ">
                        <form
                            className="flex justify-between border-2 border-[#cccccc]  rounded-3xl p-2"
                            action={createMessage}
                            ref={formRef}
                        >
                            <textarea
                                name="msg"
                                className="focus:outline-none select-none flex bg-transparent w-11/12 items-center placeholder:text-slate-500 p-3 "
                                placeholder="Ваше сообщение"
                                autoComplete="off"
                                style={{ resize: 'none' }}
                                onKeyDown={handleKeyDown}
                            />
                            <div className="flex flex-row gap-2 items-center h-full self-center">
                                <button type="submit" className="select-none bg-transparent items-center p-2 hover:bg-gray-100 focus:bg-gray-100 rounded-md">
                                    <IoMdSend className="text-mainTextColor" size={24} />
                                </button>
                                <button onClick={() => updateMessageHistory([])} className="p-2 h-max w-max select-none bg-transparent items-center hover:bg-gray-100 focus:bg-gray-100 rounded-md">
                                    <CiTrash className="text-mainTextColor" size={24} />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
            <ModelOptionsBar avalibleModels={avalibleModels} modelOptions={modelOptions} setModelOptions={setModelOptions} />
        </div>
    );
}