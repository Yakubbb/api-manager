'use client'
import { IChatForFront, IMessage, IModel } from "@/custom-types";
import { ClientChatMessage } from "./chat-message";
import { IoMdSend } from "react-icons/io";
import React, { useEffect, useRef, useState } from "react";
import { CiTrash } from "react-icons/ci";
import { FaCheck, FaTimes, FaPencilAlt } from "react-icons/fa";
import { addMessageToChat, changeChatName, updateChatHistory } from "@/server-side/chat-handler";
import { generateStream } from "@/server-side/gemini";
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
        chatHistory: undefined,
        selectedPrompt: undefined
    }

    const [messages, setMessages] = useState<IMessage[]>([]);
    const [currentBotMessage, setCurrentBotMessage] = useState<IMessage>();
    const [chatName, setChatName] = useState<string>('');
    const [isEditingName, setIsEditingName] = useState<boolean>(false);
    const messagesContainer = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [modelOptions, setModelOptions] = useState<IModelOptions>(defaultOptions);
    const chatNameInputRef = useRef<HTMLInputElement>(null);


    const updateMessageHistory = async (messages: IMessage[]) => {
        setMessages(messages)
        await updateChatHistory(chat._id, messages)
    }

    const generateResponse = async (lastQuestion: IMessage, botMessage: IMessage) => {
        const history = messages
            .concat([lastQuestion])
            .filter(msg => msg.error == undefined && msg.parts[0].text != '');
        console.log("Using chat history context:", modelOptions.chatHistory?.item.contents)
        const { output } = await generateStream(
            history,
            modelOptions.selectedModel?.modelName || 'gemini-2.0-flash',
            modelOptions.temperature,
            modelOptions.systemPrompt || ''
            , modelOptions.chatHistory?.item.contents || [] as IMessage[]);

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
        if (textareaRef.current && modelOptions.selectedPrompt) {
            const promptText = modelOptions.selectedPrompt.item?.contents || '';
            textareaRef.current.value = promptText;
        }
    }, [modelOptions.selectedPrompt]);

    useEffect(() => {
        setMessages(chat.messages);
        setChatName(chat.name);
        setIsEditingName(false);
    }, [chat]);

    useEffect(() => {
        if (messagesContainer.current) {
            messagesContainer.current.scrollTop = messagesContainer.current.scrollHeight;
        }
    }, [messages, currentBotMessage]);

    useEffect(() => {
        if (isEditingName && chatNameInputRef.current) {
            chatNameInputRef.current.focus();
            chatNameInputRef.current.select();
        }
    }, [isEditingName]);

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
            if (textareaRef.current) {
                textareaRef.current.value = '';
            }
            generateResponse(newUserMessage, botMessageTemplate);
        }
    };

    const handleChatNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChatName(event.target.value);
    };

    const handleSaveChatName = async () => {
        const trimmedName = chatName.trim();
        if (trimmedName && trimmedName !== chat.name) {
            setChatName(trimmedName);
            await changeChatName(chat._id, trimmedName)
        } else {
            setChatName(chat.name);
        }
        setIsEditingName(false);
    };

    const handleCancelEditName = () => {
        setChatName(chat.name);
        setIsEditingName(false);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.ctrlKey && event.key === 'Enter') {
            event.preventDefault();
            formRef.current?.requestSubmit();
        }
    };

    const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSaveChatName();
        } else if (event.key === 'Escape') {
            handleCancelEditName();
        }
    };


    const handleRegenerateMsg = (msgNumber: number) => {
        if (msgNumber > 0 && messages[msgNumber]?.role === 'model') {
            const userMessageIndex = msgNumber - 1;
            if (messages[userMessageIndex]?.role === 'user') {
                 const userMessage = messages[userMessageIndex];
                 const botMessageTemplate: IMessage = {
                     role: 'model',
                     parts: [{ text: '' }],
                 };
                 const messagesBeforeRegen = messages.slice(0, msgNumber);
                 setMessages(messagesBeforeRegen);

                 generateResponse(userMessage, botMessageTemplate);
            } else {
                 console.error("Cannot regenerate: Preceding message is not from the user.");
            }
        } else {
             console.error("Cannot regenerate the first message or a non-model message.");
        }
    }


    return (
        <div className="flex flex-row w-full h-full">
            <div className="flex flex-col w-full gap-3 border h-full">
                <div className="flex flex-col grow overflow-hidden h-full">
                    <div className="flex items-center p-4 pb-2 bg-[#f3f3f6] m-2 rounded-xl border flex-shrink-0">
                        {isEditingName ? (
                            <>
                                <input
                                    ref={chatNameInputRef}
                                    type="text"
                                    value={chatName}
                                    onChange={handleChatNameChange}
                                    onKeyDown={handleInputKeyDown}
                                    className="text-xl font-semibold bg-white border border-gray-300 rounded-md px-2 py-1 flex-grow mr-2 focus:outline-none focus:ring-2 focus:ring-[#7242f5]/50"
                                />
                                <button
                                    onClick={handleSaveChatName}
                                    className="p-2 text-green-600 hover:bg-green-100 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500/50"
                                    title="Принять изменения"
                                >
                                    <FaCheck size={18} />
                                </button>
                                <button
                                    onClick={handleCancelEditName}
                                    className="p-2 text-red-600 hover:bg-red-100 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500/50 ml-1"
                                    title="Отменить"
                                >
                                    <FaTimes size={18} />
                                </button>
                            </>
                        ) : (
                            <>
                                <h2 className="text-xl font-semibold mr-2 flex-grow truncate" title={chatName}>{chatName}</h2>
                                <button
                                    onClick={() => setIsEditingName(true)}
                                    className="p-2 text-gray-500 hover:bg-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400/50"
                                    title="Редактировать имя чата"
                                >
                                    <FaPencilAlt size={16} />
                                </button>
                            </>
                        )}
                    </div>

                    <div
                        ref={messagesContainer}
                        className="flex flex-col gap-4 mx-auto pt-2 w-[90%] flex-grow overflow-y-auto overflow-x-hidden p-3"
                    >
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

                    <div className="w-[90%] self-center pb-2 flex-shrink-0">
                        <form
                            className="flex justify-between border-2 border-[#cccccc] rounded-3xl p-2"
                            action={createMessage}
                            ref={formRef}
                        >
                            <textarea
                                ref={textareaRef}
                                name="msg"
                                className="focus:outline-none select-none flex bg-transparent flex-grow items-center placeholder:text-slate-500 p-3 mr-2"
                                placeholder="Ваше сообщение"
                                autoComplete="off"
                                style={{ resize: 'none' }}
                                onKeyDown={handleKeyDown}
                                rows={1}
                            />
                            <div className="flex flex-row gap-2 items-center h-full self-center flex-shrink-0">
                                <button type="submit" className="select-none bg-transparent items-center p-2 hover:bg-gray-100 focus:bg-gray-100 rounded-md">
                                    <IoMdSend className="text-mainTextColor" size={24} />
                                </button>
                                <button type="button" onClick={() => updateMessageHistory([])} className="p-2 h-max w-max select-none bg-transparent items-center hover:bg-gray-100 focus:bg-gray-100 rounded-md">
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