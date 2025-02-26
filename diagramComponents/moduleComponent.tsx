'use client'
import React, { memo, useEffect } from 'react';
import { Handle, Position, useHandleConnections, useNodeConnections, useNodesData } from '@xyflow/react';
import { IDiagramModule } from '@/custom-types';
import { DiCode } from "react-icons/di";
import { TbHexagon3D } from 'react-icons/tb';
import { IconType } from 'react-icons';
import { MdPhotoSizeSelectActual } from 'react-icons/md';
import { TiDocumentText } from 'react-icons/ti';
import { typesStyles } from '@/custom-constants';


export function CustomInputHandle({ onChange, inp }:
    {
        id: string,
        onChange: (node: any) => void,
        inp: any
    }) {
    const connections = useNodeConnections({
        handleType: 'target',
        handleId: inp.name,
    });

    useEffect(() => {
        console.log('aboba2')
        onChange(connections);
    }, [connections]);

    const Icon = typesStyles[inp.type].Icon

    return (
        <div className={`flex justify-between gap-5 rounded-md p-2`}>
            <div className='flex justify-start'>
                <Handle
                    type="target"
                    position={Position.Left}
                    id={inp.name}
                    style={
                        {
                            backgroundColor: `${typesStyles[inp.type].style}`,
                            width: '20px',
                            height: '20px',
                            borderRadius: '15px',
                            border: '4px solid #edeff5',
                            display: 'flex',
                            position: 'relative'
                        }
                    }
                />
                <div className='flex flex-row gap-1 items-center' style={
                    {
                        color: `${typesStyles[inp.type].style}`
                    }
                }>
                    <div className={`font-semibold`}>{inp.type}</div>
                    <Icon />
                </div>
            </div>
            <div style={
                {
                    color: '#666666'
                }
            }>{inp.name}</div>
        </div>
    );
}

export function CustomOutputHandle({ out }:
    {
        out: any
    }) {

    const Icon = typesStyles[out.type].Icon

    return (
        <div className={`flex justify-between gap-5 bg-[#E0E0E0] rounded-md p-2`}>
            <div style={
                {
                    color: '#666666'
                }
            }>{out.name}</div>
            <div className='flex justify-start'>
                <div className='flex flex-row gap-1 items-center' style={
                    {
                        color: `${typesStyles[out.type].style}`
                    }
                }>
                    <div className={`font-semibold`}>{out.type}</div>
                    <Icon />
                </div>
                <Handle
                    type="source"
                    position={Position.Right}
                    id={out.name}
                    style={
                        {
                            backgroundColor: `${typesStyles[out.type].style}`,
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
    );
}


export const CustomNode = ({ data }: { data: IDiagramModule }) => {
    return (
        <div className="w-xl h-xl rounded-xl bg-white border-2" style={
            {
                paddingBottom: '20px'
            }
        }>

            <div className="flex flex-col gap-2">
                <div className="flex  text-lg font-semibold items-center text-center">
                    <DiCode size={30} />
                    {data.name}
                </div>
                <div className='flex flex-col gap-1 '>
                    <div className='flex flex-col gap-5'>
                        {data.inputs.map((inp, index) => {
                            const Icon = typesStyles[inp.type].Icon
                            return (
                                <CustomInputHandle id={index.toString()} inp={inp} onChange={(node) => console.log(node)} key={index} />

                            )
                        })}
                    </div>
                    <div className='flex flex-col gap-5 '>
                        {data.outputs.map((out, index) => {
                            return (
                                <CustomOutputHandle out={out} key={index} />
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};