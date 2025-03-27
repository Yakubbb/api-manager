import { BaseElementProps } from "@/custom-types";
import { CiStar } from "react-icons/ci";
import { FaLock, FaLockOpen, FaUser } from "react-icons/fa";
import { FiFileText } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import { RiLightbulbLine } from "react-icons/ri";

function DescriptionBox({ description, color }: { description?: string, color: string }) {
    const borderClass = `border-[${color}]`;

    return (
        <div>
            <div className="font-semibold">Описание:</div>
            {description ? (
                <div className={`${borderClass} border rounded-lg p-1 font-main2 break-all text-[#44403c]`}>
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

function ActionButton({ icon, color, hoverBg, onClick }: { icon: React.ReactNode, color: string, hoverBg: string, onClick?: () => void }) {
    const borderClass = `border-[${color}]`;
    const textClass = `text-[${color}]`;
    const hoverBgClass = `hover:bg-[${hoverBg}]`;

    return (
        <button
            className={`rounded ${borderClass} border ${textClass} p-1 ${hoverBgClass}`}
            onClick={onClick}
        >
            {icon}
        </button>
    );
}





export function HistoryElement({ id, name, description, authorName, isPrivate, isEditable, onDelete, onToggleStar, onTogglePrivacy }: BaseElementProps) {
    const color = "#6b7280";
    const hoverBg = "#e5e5e5";

    const handleDelete = () => onDelete(id);
    const handleStar = () => onToggleStar(id);
    const handleTogglePrivacy = () => {
        onTogglePrivacy(id, isPrivate);
    }

    return (
        <div className="flex flex-col rounded-lg justify-between p-4 border bg-[#f3f4f6] w-64">
            <div className="flex flex-row-reverse justify-end mb-2">
                <FiFileText className="text-[#6b7280] h-6 w-6" />
            </div>
            <div className="flex flex-col gap-2">
                <div className="font-semibold text-lg text-center">{name}</div>
                <DescriptionBox description={description} color={color} />
            </div>
            <div className="flex flex-col mt-3">
                <AuthorInfo authorName={authorName} />
                <div className="flex flex-row justify-between w-full text-center items-center mt-2">
                    <ActionButton icon={<CiStar />} color={color} hoverBg={hoverBg} onClick={handleStar} />
                    {isEditable && (
                        <button
                            className={`items-center text-xs flex flex-row gap-1 rounded-xl border border-[${color}] text-[${color}] p-1 hover:bg-[${hoverBg}]`}
                            onClick={handleTogglePrivacy}
                        >
                            {isPrivate ? (
                                <div className="flex flex-row gap-1 items-center">
                                    <FaLock size={10} color={color} />
                                </div>
                            ) : (
                                <div className="flex flex-row gap-1 items-center">
                                    <FaLockOpen size={10} color={color} />
                                </div>
                            )}
                        </button>
                    )}
                    {isEditable && <ActionButton icon={<MdDeleteOutline />} color={color} hoverBg={hoverBg} onClick={handleDelete} />}
                </div>
                <div className="font-semibold text-xs text-center items-center capitalize mt-1">
                    history
                </div>
            </div>
        </div>
    );
}

export function PromptElement({ id, name, description, authorName, isPrivate, isEditable, onDelete, onToggleStar, onTogglePrivacy }: BaseElementProps) {
    const color = "#a37f66";
    const hoverBg = "#ecebe8";

    const handleDelete = () => onDelete(id);
    const handleStar = () => onToggleStar(id);
    const handleTogglePrivacy = () => {
        onTogglePrivacy(id, isPrivate);
    }

    return (
        <div className="flex flex-col rounded-3xl justify-between p-4 border bg-[#f8f8f7] w-64">
            <div className="flex flex-row-reverse justify-end mb-2">
                <RiLightbulbLine className="text-[#a37f66] h-6 w-6" />
            </div>
            <div className="flex flex-col gap-2">
                <div className="font-semibold text-lg text-center">{name}</div>
                <DescriptionBox description={description} color={color} />
            </div>
            <div className="flex flex-col mt-3">
                <AuthorInfo authorName={authorName} />
                <div className="flex flex-row justify-between w-full text-center items-center mt-2">
                    <ActionButton icon={<CiStar />} color={color} hoverBg={hoverBg} onClick={handleStar} />
                    {isEditable && (
                        <button
                            className={`items-center text-xs flex flex-row gap-1 rounded-xl border border-[${color}] text-[${color}] p-1 hover:bg-[${hoverBg}]`}
                            onClick={handleTogglePrivacy}
                        >
                            {isPrivate ? (
                                <div className="flex flex-row gap-1 items-center">
                                    <FaLock size={10} color={color} />
                                    приватный
                                </div>
                            ) : (
                                <div className="flex flex-row gap-1 items-center">
                                    <FaLockOpen size={10} color={color} />
                                    публичный
                                </div>
                            )}
                        </button>
                    )}
                    {isEditable && <ActionButton icon={<MdDeleteOutline />} color={color} hoverBg={hoverBg} onClick={handleDelete} />}
                </div>
                <div className="flex flex-row gap-2 font-semibold text-xs text-center items-center capitalize mt-1">
                    prompt
                </div>
            </div>
        </div>
    );
}