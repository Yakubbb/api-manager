'use client'
import { IModel, IPerson } from "@/custom-types";
import ModelSelector from "./model-selector";
import React, { useEffect, useState } from "react";
import { CgSmileUpside } from "react-icons/cg";
import { BsKey } from "react-icons/bs";
import { GiScreaming } from "react-icons/gi";
import { RiRobot2Line } from "react-icons/ri";
import { getRudePersons } from "@/server-side/database-handler";
import { IconType } from "react-icons";
import { FaTemperatureThreeQuarters } from "react-icons/fa6";


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
    chatHistoryEnabled: boolean
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

        console.log(await getRudePersons())
    }


    useEffect(() => {
        getRudePersonsFromServer()
    }, [])
    console.log(modelOptions)
    return (
        <nav className="flex flex-col bg-[#f3f3f6] p-4 w-[20%] gap-2 rounded-xl">

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
            </OptionsGroup>


            <OptionsGroup name="Дополнительно">
                <OptionRow name="API ключ" Icon={BsKey} children={
                    <input
                        type="text"
                        placeholder="Введите API ключ"
                        className="w-full p-2 rounded-md border border-gray-300 focus:border-indigo-400 focus:ring-indigo-400"
                        value={modelOptions.apiKey}
                        onChange={(e) => handleOptionChange('apiKey', e.target.value)}
                    />
                } />

                <OptionRow name="Системный промпт" Icon={GiScreaming} children={
                    <textarea
                        placeholder="Задайте системный промпт"
                        className="w-full p-2 rounded-md border border-gray-300 focus:border-indigo-400 focus:ring-indigo-400 resize-none h-24"
                        value={modelOptions.systemPrompt}
                        onChange={(e) => handleOptionChange('systemPrompt', e.target.value)}
                    />
                } />

                <OptionRow name="История чата" Icon={GiScreaming} children={
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            value=""
                            className="sr-only peer"
                            checked={modelOptions.chatHistoryEnabled}
                            onChange={(e) => handleOptionChange('chatHistoryEnabled', e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-400"></div>
                        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Включена</span>
                    </label>
                } />
            </OptionsGroup>


        </nav>
    )
}