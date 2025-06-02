'use client'
import React, { useCallback, useEffect, useState } from 'react';
import {
    ReactFlow,
    useNodesState,
    useEdgesState,
    addEdge,
    MiniMap,
    Controls,
    Background,
    BackgroundVariant,
    useReactFlow,
} from '@xyflow/react';

import '@xyflow/react/dist/base.css';
import { CustomNode, IHandleData, KeyNode as KeyNode } from '@/diagramComponents/moduleComponent';
import { IDiagramModule, IMessage } from '@/custom-types';
import { ConstantNode } from '@/diagramComponents/constComponent';
import singleConst from '@/diagramComponents/singleConst';
import CustomEdge from '@/diagramComponents/customEdge';
import { FaPlay } from "react-icons/fa";
import { getAllConsts, getAllModules } from '@/server-side/custom-items-database-handler';
import { generate } from 'random-words';
import { processPath } from '@/integratedModules/process';

const nodeTypes = {
    custom: CustomNode,
    const: ConstantNode,
    singleConst: singleConst,
    start: KeyNode
};

const edgeTypes = {
    custom: CustomEdge
};



export default function ({ contents, formData }: { contents: any, formData: (a: any) => void }) {

    const [nodes, setNodes, onNodesChange] = useNodesState<any>(contents.nodes || []);
    const [edges, setEdges, onEdgesChange] = useEdgesState<any>(contents.edges);
    const [statusMessages, setStatusMessages] = useState<{ type: 'error' | 'ok' | 'mid', msg: string }[]>()
    const [returnedData, setReturnedData] = useState<{ id: string, value?: any }[]>([])
    const [avalibleModules, setAvalibleModules] = useState<{ id: string, data: IDiagramModule, type: string }[]>()


    useEffect(() => {
        const getModules = async () => {
            const items = await getAllModules()
            const consts = await getAllConsts()
            setAvalibleModules(items.concat(consts))
        }
        getModules()
    }, [])

    useEffect(() => {
        formData({ nodes: nodes, edges: edges })
    }, [nodes, edges])


    const getTypeByParams = useCallback((params: { source: any, target: any, sourceHandle: any, targetHandle: any }) => {
        const sourceNode = nodes.find(n => n.id == params.source!);
        const targetNode = nodes.find(n => n.id == params.target!);

        let sourceType = 'blank'
        let targetType = 'blank'



        if (sourceNode) {
            switch (sourceNode.type) {
                default:
                    const outputs = sourceNode.data.outputs as { id: string, type: any }[]
                    sourceType = outputs.find(o => o.id == params.sourceHandle!)?.type
                    break;
            }
        }

        if (targetNode) {
            switch (targetNode.type) {
                default:
                    const inputs = targetNode.data.inputs as { id: string, type: any }[]
                    targetType = inputs.find(o => o.id == params.targetHandle!)?.type
                    break;
            }
        }

        return { sourceType: sourceType, targetType: targetType }
    }, [nodes]);

    const onConnect = useCallback(
        (params: any) => {
            if (params.source == params.target) {
                return
            }
            const types = getTypeByParams(params)
            if (types.sourceType != types.targetType) {
                return
            }
            let hasValue = false
            if ((nodes.find(n => n.id == params.source).data.outputs as IHandleData[]).find(o => o.id == params.sourceHandle)?.value) {
                hasValue = true
            }

            setEdges((eds) => addEdge({ type: 'custom', ...params, data: { type: types.sourceType, hasValue: hasValue } }, eds))
        },
        [nodes, getTypeByParams],
    );

    const onSave = () => {
        const asyncOnSave = async () => {
            setStatusMessages([{ type: 'mid', msg: 'в процессе...' }])
            const data = await processPath(nodes, edges)
            if (data) {
                setReturnedData(data)
                setStatusMessages([{ type: 'ok', msg: 'маршрут пройден' }])
            }
            else {
                setStatusMessages([{ type: 'error', msg: 'произошла ошибка' }])
            }
        }
        asyncOnSave()
    };

    useEffect(() => {
        console.log(returnedData)
    }, [returnedData])




    return (
        <div className='w-[100%] h-[100%] p-2 '>
            <div className='flex flex-row gap-2 w-[100%] h-[70%]'>
                <div className='w-[70%] h-[100%] bg-gradient-to-r from-neutral-300 to-stone-400 rounded-md'>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        nodeTypes={nodeTypes}
                        edgeTypes={edgeTypes}
                        proOptions={{ hideAttribution: true }}
                        fitView
                    >
                        <Controls />
                        <Background variant={BackgroundVariant.Dots} />
                    </ReactFlow>
                </div>
                <div className='w-[30%] bg-white'>
                    <div className='flex flex-col gap-2 bg-white rounded-md w-full h-full border-2 border-gray-300 p-2'>
                        <div className='flex flex-row justify-between w-full'>
                            <div className='font-semibold text-xl'>Тестирование запроса</div>

                            <button className='flex flex-row p-1 gap-2 items-center text-center rounded-md bg-[#f7e7d9] text-[#f16e00] border-[#f16e00] font-semibold font-main2' onClick={() => onSave()}>
                                начать
                                <FaPlay size={15} />
                            </button>
                        </div>
                        <div className='p-1'>
                            {statusMessages?.map((m, i) => {
                                switch (m.type) {
                                    case 'error':
                                        return (
                                            <div key={i} className='rounded-md p-1 border-[#c71436] bg-[#fbd9df] text-[#c71436]'>
                                                {m.msg}
                                            </div>
                                        )
                                    case 'mid':
                                        return (
                                            <div key={i} className='rounded-md p-1 border-[#c71436] bg-[#f7e7d9] text-[#f16e00]'>
                                                {m.msg}
                                            </div>
                                        )
                                    case 'ok':
                                        return (
                                            <div key={i} className='rounded-md p-1 border-[#009900] bg-[#e6ffe6] text-[#009900]'>
                                                {m.msg}
                                            </div>
                                        )
                                }
                            })}
                        </div>
                        <div className='flex flex-col gap-1 rounded-md p-2 w-full h-[50%] overflow-auto bg-[#f3f3f6]  '>
                            Входные данные
                            {(nodes.find(node => node.type === 'start' && !node.data.itsEnd).data.outputs as IHandleData[]).map((d, index) => {
                                return (
                                    <div key={index} className='flex flex-col gap-2 rounded-lg'>
                                        <div>
                                            <div className='font-bold text-[#7242f5] font-main2'>{d.name} :</div>
                                            <div className='text-xs'>[{d.id}]</div>
                                        </div>
                                        {d.value && <div className='bg-white border-2 p-1 rounded-lg'>{d.value}</div>}
                                    </div>
                                )
                            })}
                        </div>
                        <div className='flex flex-col gap-1 rounded-md p-2 w-full h-[50%] overflow-auto bg-[#f3f3f6]'>
                            Выходные данные
                            {(nodes.find(node => node.type === 'start' && node.data.itsEnd).data.inputs as IHandleData[]).map((d, index) => {
                                return (
                                    <div key={index} className='flex flex-col gap-2 rounded-lg'>
                                        <div>
                                            <div className='font-bold text-[#7242f5] font-main2'>{d.name} :</div>
                                            <div className='text-xs'>[{d.id}]</div>
                                        </div>
                                        {returnedData.find(r => r.id == d.id)?.value &&
                                            <div className='bg-white border-2 p-1 rounded-lg'>{returnedData.find(r => r.id == d.id)?.value}</div>}

                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <div className='flex flex-row w-[100%] h-[30%] p-1 gap-1'>
                <div className='flex flex-col bg-[#f3f3f6] rounded-md w-full h-full border-2  p-2'>
                    <div className='flex flex-wrap gap-2 overflow-auto'>
                        <button className='flex flex-row rounded-lg bg-[#dbeafe] text-[#1e40af] p-2 font-main2' onClick={
                            () => setNodes([...nodes,
                            {
                                id: `${generate()}-${Date.now()}`,
                                type: 'singleConst',
                                data: {
                                    name: `Переменная`,
                                    getResponse: {},
                                    inputs: [],
                                    outputs: [
                                        {
                                            id: `${generate()}-${Date.now()}`,
                                            name: 'value',
                                            type: 'text',
                                            value: ``,
                                            showValue: false
                                        },
                                    ]
                                } as IDiagramModule,
                                position: { x: 0, y: 0 },
                            }
                            ])
                        }>
                            Переменная
                        </button>
                        {avalibleModules?.map((m, i) => {
                            let color =''
                            let text = ''
                            switch (m.type) {
                                case 'module':
                                    color = '[#7242f5]'
                                    text = 'white'
                                    break
                                case 'history':
                                    color = '[#ffedd5]'
                                    text = '[#9a3412]'
                                    break;
                                case 'prompt':
                                    color = '[#dbeafe]'
                                    text = '[#1e40af]'
                                    break;
                                case 'systemPrompt':
                                    color = '[#dcfce7]'
                                    text = '[#166534]'
                                    break;

                            }
                            return (
                                <button key={i} className={`flex flex-row gap-2 border-2 rounded-lg p-2`} onClick={
                                    () => {
                                        switch (m.type) {
                                            case 'prompt':
                                            case 'systemPrompt':
                                                setNodes([...nodes,
                                                {
                                                    id: `${generate()}-${Date.now()}`,
                                                    type: 'singleConst',
                                                    data: {
                                                        name: m.data.name,
                                                        getResponse: {},
                                                        inputs: [],
                                                        outputs: m.data.outputs
                                                    } as IDiagramModule,
                                                    position: { x: 0, y: 0 },
                                                }
                                                ])
                                                break;
                                            default:
                                                setNodes([...nodes,
                                                {
                                                    id: `${m.data.name}-${generate()}-${Date.now()}`,
                                                    type: 'custom',
                                                    data: {
                                                        name: m.data.name,
                                                        getResponse: { functionId: m.id },
                                                        inputs: m.data.inputs,
                                                        outputs: m.data.outputs
                                                    } as IDiagramModule,
                                                    position: { x: 0, y: 0 },
                                                }
                                                ])
                                        }
                                    }
                                }>
                                    <div className='flex flex-row font-semibold font-main2'>
                                        {m.data.name}
                                    </div>
                                    <div className={`flex flex-row justify-center bg-${color} text-${text} text-center h-min w-min p-1 rounded-xl text-xs`}>
                                        {m.type}
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};