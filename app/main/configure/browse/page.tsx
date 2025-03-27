'use client'
import { useEffect, useState } from "react";
import {
    deleteHistory,
    deletePrompt,
    getHistories,
    getPrompts,
    changeHistoryPrivacy,
    changePromptPrivacy
} from "@/server-side/database-handler";
import { FiFileText } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import { CiStar } from "react-icons/ci";
import { FaLock, FaLockOpen } from "react-icons/fa";
import { RiLightbulbLine } from "react-icons/ri";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { MdDeleteOutline } from "react-icons/md";
import { ChatZoneProps } from "@/custom-types";
import { HistoryElement, PromptElement } from "@/components/tuning-blocks";



function ChatZone({ items, type, onDelete, onToggleStar, onTogglePrivacy }: ChatZoneProps) {
    return (
        <div className="flex flex-col gap-1 mt-3">
            <div className="flex flex-wrap gap-3">
                {items?.map((item) => {
                    const key = item.id;
                    if (type === 'history') {
                        return (
                            <HistoryElement
                                id={item.id}
                                name={item.historyName}
                                description={item.historyDescription}
                                authorName={item.authorName}
                                key={key}
                                isPrivate={item.isPrivate}
                                isEditable={item.isEditable}
                                onDelete={onDelete}
                                onToggleStar={onToggleStar}
                                onTogglePrivacy={onTogglePrivacy}
                            />
                        );
                    } else if (type === 'prompt') {
                        return (
                            <PromptElement
                                id={item.id}
                                name={item.promptName}
                                description={item.promptDescription}
                                authorName={item.authorName}
                                key={key}
                                isPrivate={item.isPrivate}
                                isEditable={item.isEditable}
                                onDelete={onDelete}
                                onToggleStar={onToggleStar}
                                onTogglePrivacy={onTogglePrivacy}
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


    const fetchInitialData = async () => {
        try {
            const [pubHist, privHist, pubPrompt, privPrompt] = await Promise.all([
                getHistories(false),
                getHistories(true),
                getPrompts(false),
                getPrompts(true)
            ]);
            setPublicHistories(pubHist || []);
            setPrivateHistories(privHist || []);
            setPublicPrompts(pubPrompt || []);
            setPrivatePrompts(privPrompt || []);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    useEffect(() => {
        fetchInitialData();
    }, []);


    const handleDeleteHistory = async (historyId: string) => {
         try {
            await deleteHistory(historyId);
            await fetchInitialData();
         } catch (error) {
            console.error("Error deleting history:", error);
         }
    }

    const handleDeletePrompt = async (promptId: string) => {
         try {
            await deletePrompt(promptId);
            await fetchInitialData();
         } catch (error) {
            console.error("Error deleting prompt:", error);
         }
    }

    const handleToggleStar = (itemId: string) => {
        console.log("Toggle star for item ID:", itemId);
    }

    const handleToggleHistoryPrivacy = async (historyId: string, currentStatus: boolean) => {
        const newStatus = !currentStatus;
        try {
            await changeHistoryPrivacy(historyId, newStatus);
            await fetchInitialData();
        } catch (error) {
            console.error(`Error changing history ${historyId} privacy:`, error);
        }
    }

    const handleTogglePromptPrivacy = async (promptId: string, currentStatus: boolean) => {
        const newStatus = !currentStatus;
         try {
            await changePromptPrivacy(promptId, newStatus);
            await fetchInitialData();
        } catch (error) {
            console.error(`Error changing prompt ${promptId} privacy:`, error);
        }
    }


    function filterBySearchTerm(item: any, term: string, type: 'history' | 'prompt') {
        if (!item) return false;

        const nameKey = type === 'history' ? 'historyName' : 'promptName';
        const descriptionKey = type === 'history' ? 'historyDescription' : 'promptDescription';

        const name = item[nameKey] || '';
        const description = item[descriptionKey] || '';
        const author = item.authorName || '';

        const lowerSearchTerm = term.toLowerCase();

        return name.toLowerCase().includes(lowerSearchTerm) ||
               description.toLowerCase().includes(lowerSearchTerm) ||
               author.toLowerCase().includes(lowerSearchTerm);
    }

    const filteredPublicHistories = publicHistories.filter(history => filterBySearchTerm(history, searchTerm, 'history'));
    const filteredPrivateHistories = privateHistories.filter(history => filterBySearchTerm(history, searchTerm, 'history'));
    const filteredPublicPrompts = publicPrompts.filter(prompt => filterBySearchTerm(prompt, searchTerm, 'prompt'));
    const filteredPrivatePrompts = privatePrompts.filter(prompt => filterBySearchTerm(prompt, searchTerm, 'prompt'));


    const hasPrivateItems = filteredPrivateHistories.length > 0 || filteredPrivatePrompts.length > 0;
    const hasPublicItems = filteredPublicHistories.length > 0 || filteredPublicPrompts.length > 0;
    const hasAnyItems = hasPrivateItems || hasPublicItems;
    const isSearching = searchTerm.length > 0;


    return (
        <section className="flex flex-col h-[100%] w-full gap-3 p-4 overflow-y-auto">
            <input
                type="text"
                placeholder="Поиск по названию, описанию или автору..."
                className="border p-2 rounded-xl w-full bg-[#f3f4f6] sticky top-0 z-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {hasPrivateItems && (
                 <CollapsibleChatZone name="Ваши пресеты" isInitiallyCollapsed={false}>
                    {filteredPrivateHistories.length > 0 && <ChatZone items={filteredPrivateHistories} type="history" onDelete={handleDeleteHistory} onToggleStar={handleToggleStar} onTogglePrivacy={handleToggleHistoryPrivacy} />}
                    {filteredPrivatePrompts.length > 0 && <ChatZone items={filteredPrivatePrompts} type="prompt" onDelete={handleDeletePrompt} onToggleStar={handleToggleStar} onTogglePrivacy={handleTogglePromptPrivacy} />}
                </CollapsibleChatZone>
            )}

            {hasPublicItems && (
                <CollapsibleChatZone name="Все пресеты" isInitiallyCollapsed={isSearching}>
                    {filteredPublicHistories.length > 0 && <ChatZone items={filteredPublicHistories} type="history" onDelete={handleDeleteHistory} onToggleStar={handleToggleStar} onTogglePrivacy={handleToggleHistoryPrivacy} />}
                    {filteredPublicPrompts.length > 0 && <ChatZone items={filteredPublicPrompts} type="prompt" onDelete={handleDeletePrompt} onToggleStar={handleToggleStar} onTogglePrivacy={handleTogglePromptPrivacy} />}
                </CollapsibleChatZone>
            )}

            {!hasAnyItems && (
                <div className="text-center text-gray-500 mt-10">
                    {isSearching ? `Ничего не найдено по запросу "${searchTerm}".` : "Пресеты пока не созданы."}
                </div>
            )}
        </section>
    );
}