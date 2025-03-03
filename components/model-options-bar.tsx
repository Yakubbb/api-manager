'use client'
import { IModel } from "@/custom-types";
import ModelSelector from "./model-selector";
import { useState } from "react";
import { CgSmileUpside } from "react-icons/cg";
import { BsKey } from "react-icons/bs";
import { GiScreaming } from "react-icons/gi";
import { RiRobot2Line } from "react-icons/ri";




export function ModelOptionsBar({
    avalibleModels
}: {
    avalibleModels?: IModel[]
}) {

    const [selectedModel, setSelectedModel] = useState<IModel>()
    const [person, setPerson] = useState<IModel>()
    const [systemPrompt, setSystemPrompt] = useState<string>()
    const [temperture, setTemperture] = useState<number>(0.4)

    const handleTempertureChange = async (event: any) => {
        setTemperture(event.target.value)
    }

    return (
        <nav className="flex flex-col shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-lightCoolBaseBg bg-mono-cool-radial-bg   p-4 w-[20%] gap-2 rounded-xl">

            <div className="bg-[#ffffff] flex flex-col gap-3 p-4 border-2 border-2 border-[#cccccc] rounded-xl z-30">
                <div className="flex flex-row gap-1 items-center">
                    <RiRobot2Line className="text-indigo-400" size={20} />
                    Модель
                </div>
                <ModelSelector options={avalibleModels || []} value={selectedModel} setValue={setSelectedModel} />
            </div>
            <div className="bg-[#ffffff] flex flex-col gap-3 p-4 border-2 border-2  border-[#cccccc] rounded-xl">
                <div className="flex flex-row gap-1 items-center">
                    <CgSmileUpside className="text-indigo-400 " size={20} />
                    {`Температура: ${temperture}`}
                </div>
                <input id="default-range" defaultValue={temperture} type="range" min={0.0} max={2.0} step={0.1} className="w-full h-2 bg-indigo-400 rounded-xl appearance-none cursor-pointer" onChange={handleTempertureChange} />
            </div>

            <div className="bg-[#ffffff] flex flex-col gap-3 p-4 border-2 border-2 border-[#cccccc] rounded-xl z-20 ">
                <div className="flex flex-row gap-1 items-center">
                    <BsKey className="text-indigo-400" size={20} />
                    API ключ
                </div>
                <ModelSelector options={avalibleModels || []} value={selectedModel} setValue={setSelectedModel} />
            </div>

            <div className="bg-[#ffffff] flex flex-col gap-3 p-4 border-2 border-2 border-[#cccccc] rounded-xl z-10">
                <div className="flex flex-row gap-1 items-center">
                    <GiScreaming className="text-indigo-400" size={20} />
                    Персоны
                </div>
                <ModelSelector options={avalibleModels || []} value={selectedModel} setValue={setSelectedModel} />
            </div>

        </nav>
    )
}
