'use client'
import { IMessage } from "@/custom-types"
import { addNewHistory } from "@/server-side/database-handler";
import { useState, useRef, useEffect, ReactNode } from "react"
import { IoMdAdd, IoMdSave, IoMdTrash } from "react-icons/io";

export interface ChatState {
    historyName: string;
    historyDescription: string;
    messages: IMessage[];
    newMessageText: string;
    newMessageRole: 'user' | 'model';
    isPrivate: boolean;
}

interface ImportData {
    name: string;
    description: string;
    history: IMessage[];
    isPrivate?: boolean;
}

interface ButtonProps {
    onClick?: () => void;
    children: ReactNode;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
    htmlFor?: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, children, className = '', type = 'button', htmlFor }) => {
    const baseClasses = "font-bold py-3 px-6 rounded-2xl flex items-center justify-center space-x-2";
    const combinedClasses = `${baseClasses} ${className}`;

    if (htmlFor) {
        return (
            <label htmlFor={htmlFor} className={`cursor-pointer ${combinedClasses}`}>
                {children}
            </label>
        )
    }

    return (
        <button
            type={type}
            onClick={onClick}
            className={combinedClasses}
        >
            {children}
        </button>
    );
};

interface InputProps {
    label: string;
    id: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    className?: string;
    type?: string;
}

const Input: React.FC<InputProps> = ({ label, id, value, onChange, placeholder, className = '', type = 'text' }) => {
    return (
        <div className="flex flex-col space-y-1">
            <label htmlFor={id} className="text-sm font-medium">{label}</label>
            <input
                type={type}
                id={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`border rounded-xl p-2 text-sm ${className}`}
            />
        </div>
    );
};

interface SelectProps {
    label: string;
    id: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    children: ReactNode;
    className?: string;
}

const Select: React.FC<SelectProps> = ({ label, id, value, onChange, children, className = '' }) => {
    return (
        <div className="flex items-center space-x-3">
            <label htmlFor={id} className="text-sm font-medium">{label}</label>
            <select
                id={id}
                value={value}
                onChange={onChange}
                className={`border rounded-xl p-2 text-sm ${className}`}
            >
                {children}
            </select>
        </div>
    );
};

interface CheckboxProps {
    label: string;
    id: string;
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, id, checked, onChange, className = '' }) => {
    return (
        <div className="flex items-center space-x-2">
            <input
                type="checkbox"
                id={id}
                checked={checked}
                onChange={onChange}
                className={`rounded focus:ring-2 focus:ring-[#7242f5] ${className}`}
            />
            <label htmlFor={id} className="text-sm font-medium">{label}</label>
        </div>
    );
};


export default function ChatInterface() {
    const [chatState, setChatState] = useState<ChatState>(
        {
            historyName: '',
            historyDescription: '',
            messages: [],
            newMessageText: '',
            newMessageRole: 'user',
            isPrivate: true
        }
    );

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const addMessage = () => {
        if (!chatState.newMessageText.trim()) return;

        setChatState(prevState => ({
            ...prevState,
            messages: [...prevState.messages, {
                role: chatState.newMessageRole,
                parts: [{ text: chatState.newMessageText }]
            }],
            newMessageText: ''
        }));
    };

    const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const jsonString = e.target?.result as string;
                const data: ImportData = JSON.parse(jsonString);

                const historyMessages: IMessage[] = data.history.map(msg => ({
                    role: msg.role,
                    parts: [{ text: msg.parts[0] }]
                } as any));

                setChatState(prevState => ({
                    ...prevState,
                    historyName: data.name,
                    historyDescription: data.description,
                    messages: historyMessages,
                    isPrivate: data.isPrivate ?? true
                }));
            } catch (error) {
                console.error("Error parsing JSON:", error);
                alert("Failed to parse JSON file.  Make sure it's valid.");
            }
        };
        reader.readAsText(file);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && event.ctrlKey) {
            event.preventDefault();
            addMessage();
        }
    };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.focus();
        }
    }, []);

    const handleSave = async () => {
        try {
            await addNewHistory(chatState);
            alert("История успешно сохранена!");
        } catch (error) {
            console.error("Ошибка при сохранении истории:", error);
            alert("Произошла ошибка при сохранении истории.");
        }
    };

    const clearChat = () => {
        setChatState(prevState => ({ ...prevState, messages: [] }));
    };

    return (
        <div className="flex flex-col h-full w-full p-6 space-y-6">
            <div className="flex justify-between items-center mb-4">
                <div className="flex space-x-4 items-center">
                    <Input
                        label="Название:"
                        id="history-name"
                        value={chatState.historyName}
                        onChange={(e) => setChatState(prevState => ({ ...prevState, historyName: e.target.value }))}
                        placeholder="Введите название"
                    />
                    <Input
                        label="Описание:"
                        id="history-description"
                        value={chatState.historyDescription}
                        onChange={(e) => setChatState(prevState => ({ ...prevState, historyDescription: e.target.value }))}
                        placeholder="Введите описание"
                    />
                    <Checkbox
                        label="Приватная история"
                        id="is-private"
                        checked={chatState.isPrivate}
                        onChange={(e) => setChatState(prevState => ({ ...prevState, isPrivate: e.target.checked }))}
                    />
                </div>
                <div className="flex space-x-2">
                    <Button onClick={handleSave} className="bg-[#7242f5] hover:bg-blue-700 text-white rounded-md">
                        <span>Сохранить</span>
                        <IoMdSave size={20} />
                    </Button>
                </div>
            </div>

            <div className="bg-gray-100 rounded-xl p-6 overflow-auto flex-grow">
                <div className="flex flex-col space-y-3">
                    {chatState.messages.map((m, i) => (
                        <div
                            key={i}
                            className={`rounded-2xl p-4 w-max max-w-2xl break-words ${m.role === 'user'
                                ? 'bg-blue-100 self-end text-right'
                                : 'bg-gray-200 self-start text-left'
                                }`}
                        >
                            <div>{m.parts[0].text}</div>
                            <div className="text-xs text-gray-500">{m.role}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-col space-y-3">
                <Select
                    label="Role:"
                    id="role"
                    value={chatState.newMessageRole}
                    onChange={(e) => setChatState(prevState => ({ ...prevState, newMessageRole: e.target.value as 'user' | 'model' }))}
                >
                    <option value="user">User</option>
                    <option value="model">Model</option>
                </Select>
                <textarea
                    ref={textareaRef}
                    value={chatState.newMessageText}
                    onChange={(e) => setChatState(prevState => ({ ...prevState, newMessageText: e.target.value }))}
                    placeholder="Введите текст сообщения"
                    className="border rounded-xl p-4 text-sm focus:ring focus:ring-[#7242f5]/50 resize-none"
                    onKeyDown={handleKeyDown}
                />
            </div>

            <div className="flex space-x-4">
                <Button onClick={addMessage} className="bg-[#7242f5] hover:bg-[#5a32b5] text-white rounded-xl">
                    <span>Add Message</span>
                    <IoMdAdd size={20} />
                </Button>

                <Button htmlFor="file-upload" className="border-2 border-[#7242f5] text-[#7242f5] rounded-xl">
                    Json
                    <IoMdAdd size={20} />
                </Button>
                <Button onClick={clearChat} className="bg-red-500 hover:bg-red-700 text-white rounded-xl">
                    <IoMdTrash size={20} />
                </Button>
                <input id="file-upload" type="file" accept=".json" onChange={handleFileImport} className="hidden" />
            </div>
        </div>
    );
}