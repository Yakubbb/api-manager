"use client"
import { ICustomItemForUser } from "@/server-side/custom-items-database-handler";
import { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";

export default function ({ options, value, setValue }: { options: ICustomItemForUser[], value?: ICustomItemForUser, setValue: (value: ICustomItemForUser) => void }) {

    const [showOptionsState, setShowOptionsState] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleSelection = (newValue: ICustomItemForUser) => {
        setValue(newValue);
        setShowOptionsState(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowOptionsState(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <div
                className={`flex items-center justify-between rounded-lg border border-gray-300 bg-white shadow-sm px-4 py-2.5 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7242f5]/50 cursor-pointer transition duration-150 ${showOptionsState ? 'border-[#7242f5] ring-2 ring-[#7242f5]/50' : ''}`}
                onClick={() => setShowOptionsState(!showOptionsState)}
            >
                <span>{value?.item?.name || 'Нажмите чтобы выбрать'}</span>
                <FaChevronDown className="ml-2 h-4 w-4 text-gray-500" />
            </div>

            {showOptionsState && (
                <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-300 bg-white shadow-md overflow-y-auto max-h-60">
                    {options?.map((option, index) => (
                        <div
                            key={index}
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer focus:outline-none focus:bg-gray-100 transition duration-150"
                            onClick={() => handleSelection(option)}
                        >
                            {option.item.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}