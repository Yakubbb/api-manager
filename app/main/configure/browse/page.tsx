'use client'
import { LuCookie } from "react-icons/lu";
import { useEffect, useState } from "react";
import { getHistories, getPrompts } from "@/server-side/database-handler";
import { FiFileText } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import { IoAddOutline } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { CiStar } from "react-icons/ci";
import { FaLock } from "react-icons/fa";
import { FaLockOpen } from "react-icons/fa";
import { RiLightbulbLine } from "react-icons/ri";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";

interface BaseElementProps {
    name: string;
    description?: string;
    authorName: string;
    isPrivate: boolean;
    isEditable: boolean;
}

function HistoryElement({ name, description, authorName, isPrivate, isEditable }: BaseElementProps) {
    return (
        <div className="flex flex-col rounded-lg justify-between p-4 border bg-[#f3f4f6] w-64">
            <div className="flex flex-row-reverse justify-end mb-2">
                <FiFileText className="text-[#6b7280] h-6 w-6" />
            </div>
            <div className="flex flex-col gap-2">
                <div className="font-semibold text-lg text-center">{name}</div>
                <DescriptionBox description={description} color="#6b7280" />
            </div>
            <div className="flex flex-col mt-3">
                <AuthorInfo authorName={authorName} />
                <div className="flex flex-row justify-between w-full text-center items-center mt-2">
                    <ActionButton icon={<CiStar />} color="#6b7280" hoverBg="#e5e5e5" />
                    {isEditable && (
                        <button className="items-center text-xs flex flex-row gap-1 rounded-xl border border-[#6b7280] text-[#6b7280] p-1 hover:bg-[#e5e5e5]">
                            {isPrivate ? <PrivacyLockIcon color="#6b7280" /> : <PrivacyUnlockIcon color="#6b7280" />}
                        </button>
                    )}
                    {isEditable && <ActionButton icon={<MdEdit />} color="#6b7280" hoverBg="#e5e5e5" />}
                </div>
                <div className="font-semibold text-xs text-center items-center capitalize mt-1">
                    history
                </div>
            </div>
        </div>
    );
}

function PromptElement({ name, description, authorName, isPrivate, isEditable }: BaseElementProps) {
    return (
        <div className="flex flex-col rounded-3xl justify-between p-4 border bg-[#f8f8f7] w-64">

            <div className="flex flex-row-reverse justify-end mb-2">
                <RiLightbulbLine className="text-[#a37f66] h-6 w-6" />
            </div>
            <div className="flex flex-col gap-2">
                <div className="font-semibold text-lg text-center">{name}</div>
                <DescriptionBox description={description} color="#a37f66" />
            </div>


            <div className="flex flex-col mt-3">
                <AuthorInfo authorName={authorName} />
                <div className="flex flex-row justify-between w-full text-center items-center mt-2">
                    <ActionButton icon={<CiStar />} color="#a37f66" hoverBg="#ecebe8" />
                    {isEditable && (
                        <button className="items-center text-xs flex flex-row gap-1 rounded-xl border border-[#a37f66] text-[#a37f66] p-1 hover:bg-[#ecebe8]">
                            {isPrivate ? <PrivacyLockIcon color="#a37f66" /> : <PrivacyUnlockIcon color="#a37f66" />}
                        </button>
                    )}
                    {isEditable && <ActionButton icon={<MdEdit />} color="#a37f66" hoverBg="#ecebe8" />}
                </div>
                <div className="font-semibold text-xs text-center items-center capitalize mt-1">
                    prompt
                </div>
            </div>
        </div>
    );
}


function DescriptionBox({ description, color }: { description?: string, color: string }) {
    return (
        <div>
            <div className="font-semibold">Описание:</div>
            {description ? (
                <div className={`border-[${color}] border rounded-lg p-1 font-main2 break-all text-[#44403c]`}>
                    {description}
                </div>
            ) : (
                <div>Без описания</div>
            )}
        </div>
    );
}

function AuthorInfo({ authorName }: { authorName: string }) {
    return (
        <div className="flex flex-row gap-1 text-xs font-bold items-center text-[#52525b]">
            <FaUser className="text-[#71717a]" />
            {authorName}
        </div>
    );
}

function ElementActions({ isEditable, type, actionColor }: { isEditable: boolean, type: 'history' | 'prompt', actionColor: string }) {
    return (
        <div className="flex flex-row gap-2 mt-2">
            <div className="flex flex-row justify-between w-full text-center items-center">
                <div className="flex flex-row gap-1">
                    <ActionButton icon={<CiStar />} color={actionColor} hoverBg="#e5e5e5" />
                    {isEditable && <ActionButton icon={<MdEdit />} color={actionColor} hoverBg="#e5e5e5" />}
                </div>
                <div className="font-semibold text-xs text-center items-center capitalize text-[#44403c]">
                    {type}
                </div>
            </div>
        </div>
    );
}

function ActionButton({ icon, color, hoverBg }: { icon: React.ReactNode, color: string, hoverBg: string }) {
    return (
        <button className={`rounded border border-[${color}] text-[${color}] p-1 hover:bg-[${hoverBg}]`}>
            {icon}
        </button>
    );
}

function PrivacyLockIcon({ color }: { color: string }) {
    return (
        <div className="flex flex-row gap-1 items-center">
            <FaLock size={10} color={color} />
            приватный
        </div>
    );
}

function PrivacyUnlockIcon({ color }: { color: string }) {
    return (
        <div className="flex flex-row gap-1 items-center">
            <FaLockOpen size={10} color={color} />
        </div>
    );
}


interface ChatZoneProps {
    name: string;
    items?: any[];
    type: 'history' | 'prompt';
}

function ChatZone({ name, items, type }: ChatZoneProps) {
    return (
        <div className="flex flex-col gap-1 mt-3">
            <div className="flex flex-wrap gap-3">
                {items?.map((item, index) => {
                    if (type === 'history') {
                        return (
                            <HistoryElement
                                name={item.historyName}
                                description={item.historyDescription}
                                authorName={item.authorName}
                                key={index}
                                isPrivate={item.isPrivate}
                                isEditable={item.isEditable}
                            />
                        );
                    } else if (type === 'prompt') {
                        return (
                            <PromptElement
                                name={item.promptName}
                                description={item.promptDescription}
                                authorName={item.authorName}
                                key={index}
                                isPrivate={item.isPrivate}
                                isEditable={item.isEditable}
                            />
                        );
                    }
                    return null;
                })}
            </div>
        </div>
    );
}


interface CollapsibleChatZoneProps {
    name: string;
    isInitiallyCollapsed?: boolean;
    children: React.ReactNode;
}

function CollapsibleChatZone({ name, isInitiallyCollapsed = true, children }: CollapsibleChatZoneProps) {
    const [isCollapsed, setIsCollapsed] = useState(isInitiallyCollapsed);

    return (
        <div className="flex flex-col gap-2 rounded-lg border-2 p-2 mt-2">
            <div
                className="flex flex-row justify-between items-center cursor-pointer p-2 rounded-md hover:bg-[#f3f4f6]"
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                <div className="font-semibold">{name}</div>
                {isCollapsed ? <BiChevronDown size={20} /> : <BiChevronUp size={20} />}
            </div>
            {!isCollapsed && (
                <div>
                    {children}
                </div>
            )}
        </div>
    );
}


export default function Home() {

    const [publicHistories, setPublicHistories] = useState<any[]>([])
    const [privateHistories, setPrivateHistories] = useState<any[]>([])

    const [publicPrompts, setPublicPrompts] = useState<any[]>([])
    const [privatePrompts, setPrivatePrompts] = useState<any[]>([])

    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        const fetchInitialData = async () => {
            setPublicHistories(await getHistories(false));
            setPrivateHistories(await getHistories(true));

            setPublicPrompts(await getPrompts(false));
            setPrivatePrompts(await getPrompts(true));
        }
        fetchInitialData()
    }, [])

    const filteredPublicHistories = publicHistories.filter(history => filterBySearchTerm(history, searchTerm, 'history'));
    const filteredPrivateHistories = privateHistories.filter(history => filterBySearchTerm(history, searchTerm, 'history'));
    const filteredPublicPrompts = publicPrompts.filter(prompt => filterBySearchTerm(prompt, searchTerm, 'prompt'));
    const filteredPrivatePrompts = privatePrompts.filter(prompt => filterBySearchTerm(prompt, searchTerm, 'prompt'));

    function filterBySearchTerm(item: any, searchTerm: string, type: 'history' | 'prompt') {
        const nameKey = type === 'history' ? 'historyName' : 'promptName';
        const descriptionKey = type === 'history' ? 'historyDescription' : 'promptDescription';

        const name = item[nameKey] || '';
        const description = item[descriptionKey] || '';

        const lowerSearchTerm = searchTerm.toLowerCase();

        return name.toLowerCase().includes(lowerSearchTerm) || description.toLowerCase().includes(lowerSearchTerm);
    }


    return (
        <section className="flex flex-col h-[100%] w-full gap-3 p-4 overflow-y-scroll">
            <input
                type="text"
                placeholder="Поиск"
                className="border p-2 rounded-xl w-full bg-[#f3f4f6]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <CollapsibleChatZone name="Ваши пресеты" isInitiallyCollapsed={true}>
                {privateHistories?.length > 0 && <ChatZone name="Ваши пресеты Историй" items={filteredPrivateHistories} type="history" />}
                {privatePrompts?.length > 0 && <ChatZone name="Ваши пресеты Промптов" items={filteredPrivatePrompts} type="prompt" />}
            </CollapsibleChatZone>
            <CollapsibleChatZone name="Все пресеты" isInitiallyCollapsed={false}>
                {publicHistories?.length > 0 && <ChatZone name="Все пресеты Историй" items={filteredPublicHistories} type="history" />}
                {publicPrompts?.length > 0 && <ChatZone name="Все пресеты Промптов" items={filteredPublicPrompts} type="prompt" />}
            </CollapsibleChatZone>
        </section>
    );
}