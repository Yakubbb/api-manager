'use client'

import { typesStyles } from "@/custom-constants"
import { Handle, Position } from "@xyflow/react"
import { BsFileEarmarkLock } from "react-icons/bs"

export default function ({ data }: { data: { name: string, type: any, value: any } }) {

    let Icon = undefined
    let color = ''
    if (typesStyles[data.type]) {
        Icon = typesStyles[data.type].Icon
        color = typesStyles[data.type].style
    }

    return (
        <div className="flex flex-col rounded-xl bg-white border-2" style={
            {
                paddingBottom: '10px'
            }}>
            <div className="flex gap-1 text-lg font-semibold items-center text-center ">
                <BsFileEarmarkLock size={20} />
                Константа
            </div>
            <div className='flex flex-row justify-between mr-2 gap-2 p-1 '>
                <div style={{ color: '#666666' }}>
                    {data.name}
                </div>
                <div className='flex flex-row gap-1 items-center' style={{ color: color }}>
                    <div className={`font-semibold`}>{data.type}</div>
                    {Icon && <Icon />}
                    <Handle
                        type="source"
                        position={Position.Right}
                        id={data.name}
                        style={
                            {
                                backgroundColor: color,
                                width: '20px',
                                height: '20px',
                                borderRadius: '15px',
                                border: '4px solid #edeff5',
                                display: 'flex',
                                position: 'relative'
                            }
                        }
                    />
                </div>
            </div>
        </div>
    )
}