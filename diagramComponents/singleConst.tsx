'use client'

import { BsFileEarmarkLock } from "react-icons/bs"
import { IDiagramModule } from "@/custom-types"
import { DiCode } from "react-icons/di"
import { CustomHandle, IHandleData } from "./moduleComponent"
import { useEffect, useState } from "react"

export default function ({ data, isModule }: { data: IDiagramModule, isModule?: { color: string, text: string, type: string } }) {


    const [startOutputs, setStartOutputs] = useState<IHandleData[]>(data.outputs)

    useEffect(() => {
        data.outputs = startOutputs
    }, [startOutputs])

    return (
        <div className="flex flex-col gap-2 rounded-xl bg-white border-2" style={
            {
                paddingBottom: '10px'
            }}>
            <div className="flex  flex-row gap-2 text-lg font-semibold items-center text-center font-main2 p-1">
                {data.name}
                <div className="text-xs font-semibold text-white bg-[#7242f5] rounded p-1">
                    editable
                </div>
                {isModule &&
                    <div className={`text-xs font-semibold text-${isModule.text} bg-${isModule.color} rounded p-1`}>
                        {isModule.type}
                    </div>
                }
            </div>
            <div className='flex flex-col gap-1 bg-[#E0E0E0] rounded-md hover:bg-gray-300 transition-colors duration-200 '>
                {startOutputs.map((out, index) => {
                    return (
                        <CustomHandle data={out} key={index} isTarget={false} isEditable={true} onChange={(node) => {
                            setStartOutputs(
                                startOutputs.map(output => {
                                    if (output == out) {
                                        return node
                                    }
                                    else {
                                        output
                                    }
                                })
                            )
                        }
                        } />
                    )
                })}
            </div>
        </div>
    )
}