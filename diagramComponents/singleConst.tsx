'use client'

import { BsFileEarmarkLock } from "react-icons/bs"
import { CustomOutputHandle } from "./moduleComponent"

export default function ({ data }: { data: { name: string, type: any, value: any } }) {

    return (
        <div className="flex flex-col gap-2 rounded-xl bg-white border-2" style={
            {
                paddingBottom: '10px'
            }}>
            <div className="flex flex-row gap-1 text-lg font-semibold items-center text-center ">
                <BsFileEarmarkLock size={20} />
                <div>
                    {data.name}
                </div>
                <div className="font-bold text-indigo-400 text-xs p-1 rounded-xl">
                    const
                </div>
            </div>
            <CustomOutputHandle out={{ name: data.value, type: data.type }} />
        </div>
    )
}