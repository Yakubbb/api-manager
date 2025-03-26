'use client'
import HistoryConfigure from "@/components/history-configure"
import PromptConfig from "@/components/promptConfig"
import { useState } from "react"

function CustomVariant({ name, description, selected, select }:
    { name: string, description: string, selected: boolean, select: () => void }) {
    return (
        <div onClick={() => select()} className={`hover:cursor-pointer focus:border-black flex flex-col gap-2 rounded-2xl p-4 ${selected ? 'text-white bg-[#7242f5]' : 'text-black bg-white'} shadow-[0_3px_10px_rgb(0,0,0,0.2)]`}>
            <div className="flex flex-row gap-1 font-bold text-xl">
                {name}
            </div>
            <div className="flex flex-row gap-1 font-main2">
                {description}
            </div>
        </div>
    )
}

export default function () {

    const [selectedOption, setSelectedOption] = useState<number>(0)

    return (
        <div className="flex flex-row w-full h-full gap-2 p-4">
            <div className="flex flex-col gap-2 rounded-xl w-[30%] h-[100%] bg-[#ffffff] p-4 shadow-[0_3px_10px_rgb(0,0,0,0.1)]">
                <div className="flex flex-row rounded-xl bg-[#cccccc] w-[100%] h-[10%] font-semibold p-4 text-xl items-center">
                    Доступные варианты кастомизации
                </div>
                <div className="flex flex-col rounded-xl w-[100%] h-[90%] p-2 gap-2">
                    <CustomVariant
                        select={() => setSelectedOption(0)}
                        selected={selectedOption == 0}
                        name="Промпт"
                        description="Краткие инструкции для ИИ, чтобы задать стиль и тон ответа." />
                    <CustomVariant
                     select={() => setSelectedOption(1)}
                     selected={selectedOption == 1} 
                     name="История чата"
                      description="Примеры диалога для обучения ИИ желаемому стилю общения и контексту." />
                </div>
            </div>
            <div className="w-[70%]">
                {selectedOption == 1 && <HistoryConfigure />}
                {selectedOption == 0 && <PromptConfig />}

            </div>
        </div>
    )
}