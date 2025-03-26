// PromptInterface.tsx
'use client'
import { IMessage } from "@/custom-types"
import { addNewHistory, addNewPrompt } from "@/server-side/database-handler";
import { redirect } from "next/navigation";
import { useState } from "react"
import { IoMdSave, IoMdTrash } from "react-icons/io";

export interface PromptState {
    promptName: string;
    promptDescription: string;
    promptText: string;
    isPrivate: boolean;
    isSystemPrompt: boolean;
}

interface ButtonProps {
    onClick?: () => void;
    children: React.ReactNode;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
    htmlFor?: string;
    disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ onClick, children, className = '', type = 'button', htmlFor, disabled = false }) => {
    const baseClasses = "font-bold py-3 px-6 rounded-2xl flex items-center justify-center space-x-2";
    const combinedClasses = `${baseClasses} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`;

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
            disabled={disabled}
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

interface TextAreaProps {
    label: string;
    id: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    className?: string;
    rows?: number;
}

const TextArea: React.FC<TextAreaProps> = ({ label, id, value, onChange, placeholder, className = '', rows = 4 }) => {
    return (
        <div className="flex flex-col space-y-1 flex-grow">
            <label htmlFor={id} className="text-sm font-medium">{label}</label>
            <textarea
                id={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={rows}
                className={`border rounded-xl p-2 text-sm resize-none flex-grow ${className}`}
            />
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


export default function PromptInterface() {
    const [promptState, setPromptState] = useState<PromptState>(
        {
            promptName: '',
            promptDescription: '',
            promptText: '',
            isPrivate: true,
            isSystemPrompt: false,
        }
    );

    const handleSave = async () => {
        if (!promptState.promptName.trim()) {
            alert("Пожалуйста, введите название промпта для сохранения.");
            return;
        }
        try {
            const message: IMessage = {
                role: 'user',
                parts: [{ text: promptState.promptText }]
            };
            await addNewPrompt(promptState);
            redirect('/main/configure/chats')
        } catch (error) {
            console.error("Ошибка при сохранении промпта:", error);
            alert("Произошла ошибка при сохранении промпта.");
        }
    };

    const handleDelete = () => {
        setPromptState({
            promptName: '',
            promptDescription: '',
            promptText: '',
            isPrivate: true,
            isSystemPrompt: false,
        })
        alert("Промпт удален (форма очищена). Сохраните новый промпт или вернитесь к списку.");
    };


    return (
        <div className="flex flex-col h-full w-full p-6 space-y-6">
            <div className="flex justify-between items-center mb-4">
                <div className="flex space-x-4 items-center">
                    <Input
                        label="Название:"
                        id="prompt-name"
                        value={promptState.promptName}
                        onChange={(e) => setPromptState(prevState => ({ ...prevState, promptName: e.target.value }))}
                        placeholder="Введите название"
                    />
                    <Input
                        label="Описание:"
                        id="prompt-description"
                        value={promptState.promptDescription}
                        onChange={(e) => setPromptState(prevState => ({ ...prevState, promptDescription: e.target.value }))}
                        placeholder="Введите описание"
                    />
                    <Checkbox
                        label="Приватный промпт"
                        id="is-private"
                        checked={promptState.isPrivate}
                        onChange={(e) => setPromptState(prevState => ({ ...prevState, isPrivate: e.target.checked }))}
                    />
                     <Checkbox
                        label="Системный промпт"
                        id="is-system-prompt"
                        checked={promptState.isSystemPrompt}
                        onChange={(e) => setPromptState(prevState => ({ ...prevState, isSystemPrompt: e.target.checked }))}
                    />
                </div>
                <div className="flex space-x-2">
                    <Button
                        onClick={handleSave}
                        className={`bg-[#7242f5] text-white rounded-md`}
                        disabled={!promptState.promptName.trim()}
                    >
                        <span>Сохранить</span>
                        <IoMdSave size={20} />
                    </Button>
                </div>
            </div>

            <div className="flex flex-col space-y-3 flex-grow">
                <TextArea
                    label="Промпт:"
                    id="prompt-text"
                    value={promptState.promptText}
                    onChange={(e) => setPromptState(prevState => ({ ...prevState, promptText: e.target.value }))}
                    placeholder="Введите текст промпта"
                    className="flex-grow"
                    rows={10}
                />
            </div>
            <div className="flex space-x-4">
                <Button onClick={handleDelete} className="bg-red-500 hover:bg-red-700 text-white rounded-xl">
                    <IoMdTrash size={20} />
                </Button>
            </div>
        </div>
    );
}