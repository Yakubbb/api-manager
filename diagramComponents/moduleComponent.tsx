'use client'
import React, { memo, useEffect, useState } from 'react';
import { Handle, HandleType, Position, useEdges, useHandleConnections, useNodeConnections, useNodesData, useReactFlow } from '@xyflow/react';
import { IDiagramModule } from '@/custom-types';
import { DiCode } from "react-icons/di";
import { typesStyles } from '@/custom-constants';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa";
import { FaArrowUp } from "react-icons/fa";
import { CiCircleRemove } from "react-icons/ci";
import { generate, count } from "random-words";
import { IoIosAddCircleOutline, IoIosRemoveCircleOutline } from "react-icons/io";

export interface IHandleData {
    id: string
    name: string
    type: string
    value?: any
    showValue?: boolean
}

export function CustomHandle(
    {
        onChange,
        data,
        isTarget,
        isEditable,
        isRenamable,
    }:
        {
            onChange: (node: any) => void,
            data: IHandleData,
            isTarget: boolean,
            isEditable?: boolean,
            isRenamable?: boolean
        }) {

    const layoutType = isTarget ?
        { pos: Position.Left, type: 'target' as HandleType }
        :
        { pos: Position.Right, type: 'source' as HandleType }

    const [showState, setShowState] = useState<boolean>(data.showValue || false)


    useEffect(() => {
        data.showValue = showState
    }, [showState]);

    const edges = useEdges()


    const Icon = typesStyles[data.type].Icon


    return (
        <div className='' style={{ maxWidth: '300px' }}>
            <div className='flex flex-col gap-2 w-full mt-1 p-3 '>
                <div className={`flex ${isTarget ? 'flex-row-reverse' : 'flex-row'} justify-between gap-5`}>
                    <div className='flex flex-row gap-2 text-center font-semibold'>
                        {isRenamable &&
                            <div>
                                <input type="text" onChange={
                                    (event) => {
                                        onChange(
                                            {
                                                name: event.currentTarget.value,
                                                type: data.type,
                                                showValue: data.showValue,
                                                value: data.value,
                                                id: data.id

                                            }
                                        )
                                    }
                                } className='rounded-md ' style={{ maxWidth: '150px' }} defaultValue={data.name} />
                            </div>

                            ||

                            data.name
                        }
                        <div className='self-center cursor-pointer' onClick={() => setShowState(!showState)}>
                            {data.value && (showState ? <FaArrowUp size={15} /> : <FaArrowDown size={15} />)}
                        </div>
                    </div>
                    <div className={`flex ${isTarget ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className='flex flex-row gap-2 items-center text-center'>
                            <div className={``}>{data.type}</div>
                            <Icon />
                        </div>
                        <Handle
                            type={layoutType.type}
                            position={layoutType.pos}
                            id={data.id}
                            style={
                                {
                                    backgroundColor: `${typesStyles[data.type].style}`,
                                    width: '15px',
                                    height: '15px',
                                    borderRadius: '15px',
                                    display: 'flex',
                                    position: 'relative'
                                }
                            }
                        />
                    </div>
                </div>
                {data.value &&
                    <div className='flex flex-col gap-3'>
                        {showState &&
                            (
                                isEditable ?
                                    <textarea className='text-xs overflow-auto rounded-md font-main2 p-3 bg-white resize-none h-48' onChange={
                                        (event) => {
                                            onChange(
                                                {
                                                    name: data.name,
                                                    type: data.type,
                                                    showValue: data.showValue,
                                                    value: event.currentTarget.value,
                                                    id: data.id
                                                }
                                            )
                                        }
                                    } defaultValue={data.value} />
                                    :
                                    <textarea className='text-xs overflow-auto rounded-md font-main2 p-3 bg-white resize-none max-h-64' readOnly defaultValue={data.value} />
                            )
                        }
                    </div>
                }
            </div>
        </div>
    );
}

export const CustomNode = ({ data }: { data: IDiagramModule }) => {
    return (
        <div className="w-xl h-xl rounded-lg bg-white border-2 hover:shadow-md transition-shadow duration-200" style={
            {
                paddingBottom: '20px'
            }
        }>

            <div className="flex flex-col gap-2">
                <div className="flex  text-lg font-semibold items-center text-center font-main2">
                    <DiCode size={30} />
                    {data.name}
                </div>
                <div className='flex flex-col gap-1 '>
                    <div className='flex flex-col gap-1'>
                        {data.inputs.map((inp, index) => {
                            const Icon = typesStyles[inp.type].Icon
                            return (
                                <CustomHandle data={inp} key={index} isTarget={true} onChange={(node) => { }} />

                            )
                        })}
                    </div>
                    <div className='flex flex-col gap-1 bg-[#E0E0E0] rounded-md hover:bg-gray-300 transition-colors duration-200 '>
                        {data.outputs.map((out, index) => {
                            return (
                                <CustomHandle data={out} key={index} isTarget={false} onChange={(node) => { }} />
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const KeyNode = ({ data }: { data: IDiagramModule }) => {

    const [connectors, setConnectors] = useState<IHandleData[]>(data.itsEnd == true ? data.inputs : data.outputs)
    const edges = useEdges()
    const { setEdges } = useReactFlow();

    const style = data.itsEnd ? { backgroundColor: '#f7e7d9', color: '#f16e00' } : { backgroundColor: '#dbeafe', color: '#1e40af' }
    const props = data.itsEnd ? { title: 'Точка выхода', Icon: FaAngleLeft } : { title: 'Точка входа', Icon: FaAngleRight }

    useEffect(() => {
        if (data.itsEnd == true) {
            data.inputs = connectors
        }
        else {
            data.outputs = connectors
        }

        console.log(connectors)
    }, [connectors])


    return (
        <div className="w-xl h-xl rounded-lg bg-white border-2 hover:shadow-md transition-shadow duration-200" style={
            {
                paddingBottom: '20px'
            }
        }>

            <div className="flex flex-col gap-2 ">
                <div className="flex  text-lg font-semibold items-center text-center font-main2 rounded-md" style={style}>
                    <props.Icon size={30} />
                    {props.title}
                </div>
                <div className='flex flex-col gap-1 '>
                    <div className={`flex flex-col gap-1 rounded-md hover:bg-gray-300 transition-colors duration-200 ${!data.itsEnd && 'bg-[#E0E0E0]'} `}>
                        {connectors.map((out, index) => {
                            return (
                                <div className={
                                    `relative flex flex-row justify-between items-center
                                     text-center ${data.itsEnd ? 'flex-row-reverse' : 'flex-row'}`
                                } key={index}>
                                    <button className='p-2' onClick={
                                        () => {
                                             setConnectors(connectors.filter(o => o != out)) 
                                             setEdges(edges.filter(e=>e.sourceHandle != out.id && e.targetHandle != out.id ))
                                            }
                                    } >
                                        <IoIosRemoveCircleOutline />
                                    </button>
                                    <CustomHandle data={out} isTarget={data.itsEnd == true} isEditable={true} isRenamable={true} onChange={(node) => {
                                        setConnectors(
                                            connectors.map(connector => {
                                                if (connector == out) {
                                                    return node
                                                }
                                                else {
                                                    setConnectors(connectors.filter(o => o != out))
                                                    return connector
                                                }
                                            })
                                        )
                                    }
                                    } />
                                </div>
                            )
                        })}
                    </div>
                </div>
                <button className='self-center items-center' onClick={
                    () => { setConnectors([...connectors, { name: `${generate()} ${connectors.length}`, type: 'text', id: `${generate()}-${Date.now()}` }]) }
                } >
                    <IoIosAddCircleOutline />
                </button>
            </div>
        </div>
    );
};