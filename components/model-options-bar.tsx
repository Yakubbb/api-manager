'use client'
import { IModel } from "@/custom-types";
import ModelSelector from "./model-selector";
import { useState } from "react";



export function ModelOptionsBar({
    avalibleModels
}: {
    avalibleModels?: IModel[]
}) {

    const [selectedModel, setSelectedModel] = useState<IModel>()

    return (
        <nav className="flex flex-col shadow-[0_3px_10px_rgb(0,0,0,0.2)] p-1 w-[20%]">
            <ModelSelector options={avalibleModels || []} value={selectedModel} setValue={setSelectedModel} />
        </nav>
    )
}
