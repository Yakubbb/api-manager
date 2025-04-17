'use client'

import { BsFileEarmarkLock } from "react-icons/bs"
import { CustomOutputHandle } from "./moduleComponent"
import { IDiagramModule } from "@/custom-types"
import { DiCode } from "react-icons/di"

export default function ({ data }: { data: IDiagramModule }) {

    return (
        <div className="flex flex-col gap-2 rounded-xl bg-white border-2" style={
            {
                paddingBottom: '10px'
            }}>
            <div className="flex  flex-row gap-2 text-lg font-semibold items-center text-center font-main2 p-1">
                {data.name}
                <div className="text-xs font-semibold text-white bg-[#7242f5] rounded p-1">
                    const
                </div>
            </div>
            <div className='flex flex-col gap-1 bg-[#E0E0E0] rounded-md hover:bg-gray-300 transition-colors duration-200 '>
                {data.outputs.map((out, index) => {
                    return (
                        <CustomOutputHandle out={out} key={index} />
                    )
                })}
            </div>
        </div>
    )
}