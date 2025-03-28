'use client'
import { ICustomItem, IModel, IPerson } from "@/custom-types";
import ModelSelector from "./model-selector";
import React, { useEffect, useState } from "react";
import { BsKey } from "react-icons/bs";
import { GiScreaming } from "react-icons/gi";
import { RiRobot2Line } from "react-icons/ri";
import { IconType } from "react-icons";
import { FaTemperatureThreeQuarters } from "react-icons/fa6";
import { getAllCustomIems, ICustomItemForUser } from "@/server-side/custom-items-database-handler";
import CustomItemSelector from "./custom-item-selector";


function OptionsGroup({ name, children }: { name: string, children: React.ReactNode }) {
    return (
        <div className="mb-4">
            <h3 className="font-semibold text-md mb-2">{name}</h3>
            <div className="flex flex-col gap-2">
                {children}
            </div>
        </div>
    )
}


function OptionRow({ name, Icon, children }: { name: string, Icon?: IconType, children: React.ReactNode }) {
    return (
        <div className="flex flex-row gap-2 items-center bg-[#ffffff] p-3 rounded-lg border border-[#cccccc]">
            {Icon && <Icon className="text-indigo-400 flex-shrink-0" size={18} />}
            <div className="flex flex-col grow gap-2">
                <div className="text-sm">{name}</div>
                <div>{children}</div>
            </div>
        </div>
    )
}



export interface IModelOptions {
    selectedModel?: IModel | undefined,
    person?: IPerson | undefined,
    systemPrompt?: string,
    temperature: number,
    apiKey?: string,
    chatHistory?: ICustomItemForUser
    selectedPrompt?: ICustomItemForUser
}


export function ModelOptionsBar({
    avalibleModels,
    modelOptions,
    setModelOptions
}: {
    avalibleModels?: IModel[],
    modelOptions: IModelOptions
    setModelOptions: (model: any) => void
}) {

    const [avaliblePersons, setAvaliblePersons] = useState<ICustomItemForUser[]>([])
    const [avalibleSysPrompts, setAvalibleSysPrompts] = useState<ICustomItemForUser[]>([])
    const [avaliblePrompts, setAvaliblePrompts] = useState<ICustomItemForUser[]>([])

    const [selectedSysPrompt, setSysPromt] = useState<ICustomItemForUser>()



    const handleOptionChange = (key: keyof IModelOptions, value: any) => {
        setModelOptions((prevOptions: any) => ({
            ...prevOptions,
            [key]: value
        }))
    }


    const handleTempertureChange = (event: any) => {
        handleOptionChange('temperature', parseFloat(event.target.value))
    }


    const getRudePersonsFromServer = async () => {
        setAvaliblePersons((await getAllCustomIems(false))
            .filter(i => i.item.type == 'history')
            .filter(i => i.isLiked == true || i.isEditable == true))
    }


    const getSystPromptsFromServer = async () => {
        setAvalibleSysPrompts((await getAllCustomIems(false))
            .filter(i => i.item.type == 'systemPrompt')
            .filter(i => i.isLiked == true || i.isEditable == true))
    }

    const getPromptsFromServer = async () => {
        setAvaliblePrompts((await getAllCustomIems(false))
            .filter(i => i.item.type == 'prompt')
            .filter(i => i.isLiked == true || i.isEditable == true))
    }




    useEffect(() => {
        getRudePersonsFromServer()
        getSystPromptsFromServer()
        getPromptsFromServer()

    }, [])
    console.log(modelOptions)
    return (
        <nav className="flex flex-col bg-[#f3f3f6] p-4 w-[20%] gap-2 rounded-xl overflow-auto">

            <OptionsGroup name="Основные параметры">
                <OptionRow name="Модель" Icon={RiRobot2Line} children={
                    <ModelSelector
                        options={avalibleModels || []}
                        value={modelOptions.selectedModel}
                        setValue={(model) => handleOptionChange('selectedModel', model)}
                    />
                } />

                <OptionRow name="Температура" Icon={FaTemperatureThreeQuarters} children={
                    <input
                        id="default-range"
                        defaultValue={modelOptions.temperature}
                        type="range" min={0.0} max={2.0} step={0.1}
                        className="w-full h-2 bg-indigo-400 rounded-xl appearance-none cursor-pointer"
                        onChange={handleTempertureChange} />
                } />
                <OptionRow name="API ключ" Icon={BsKey} children={
                    <input
                        type="text"
                        placeholder="Введите API ключ"
                        className="w-full p-2 rounded-md border border-gray-300 focus:border-indigo-400 focus:ring-indigo-400"
                        value={modelOptions.apiKey}
                        onChange={(e) => handleOptionChange('apiKey', e.target.value)}
                    />
                } />
            </OptionsGroup>

            <OptionsGroup name="Дополнительно">
                <OptionRow name="Промпт" Icon={GiScreaming} children={
                    <div className="flex flex-col gap-2">
                        <CustomItemSelector
                            options={avaliblePrompts}
                            value={modelOptions.selectedPrompt}
                            setValue={(e) => handleOptionChange('selectedPrompt', e)}
                        />
                    </div>
                } />
                <OptionRow name="Системный промпт" Icon={GiScreaming} children={
                    <div className="flex flex-col gap-2">
                        <textarea
                            placeholder="Задайте системный промпт"
                            className="w-full p-2 rounded-md border border-gray-300 focus:border-indigo-400 focus:ring-indigo-400 resize-none h-24"
                            value={modelOptions.systemPrompt}
                            onChange={(e) => handleOptionChange('systemPrompt', e.target.value)}
                        />
                        <CustomItemSelector
                            options={avalibleSysPrompts}
                            value={selectedSysPrompt}
                            setValue={(e) => handleOptionChange('systemPrompt', e.item.contents)}
                        />
                    </div>
                } />

                <OptionRow name="История чата" Icon={GiScreaming} children={
                    <CustomItemSelector
                        options={avaliblePersons}
                        value={modelOptions.chatHistory}
                        setValue={(history) => handleOptionChange('chatHistory', history)}
                    />
                } />

            </OptionsGroup>


        </nav>
    )
}