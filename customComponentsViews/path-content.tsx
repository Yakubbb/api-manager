import { IDiagramModule } from '@/custom-types';
import { ConstantNode } from '@/diagramComponents/constComponent';
import CustomEdge from '@/diagramComponents/customEdge';
import { CustomNode, IHandleData, KeyNode } from '@/diagramComponents/moduleComponent';
import singleConst from '@/diagramComponents/singleConst';
import { processPath } from '@/integratedModules/process';
import { getAllModules } from '@/server-side/custom-items-database-handler';
import { addNewPathToCollection } from '@/server-side/database-getter';
import { addEdge, Background, BackgroundVariant, Controls, ReactFlow, useEdgesState, useNodesState } from '@xyflow/react';
import { generate } from 'random-words';
import React, { useCallback, useEffect, useState } from 'react';
import { FaPlay } from 'react-icons/fa';

interface ModuleContentProps {
    contents: any;
    isEditable: boolean;
    setFormData: React.Dispatch<React.SetStateAction<any>>;
    updateStatus: 'idle' | 'updating' | 'success' | 'error';
}

const nodeTypes = {
    custom: CustomNode,
    const: ConstantNode,
    singleConst: singleConst,
    start: KeyNode
};

const edgeTypes = {
    custom: CustomEdge
};


const PathContent: React.FC<ModuleContentProps> = ({
    contents,
    isEditable,
    setFormData,
    updateStatus
}) => {
    const [nodes, setNodes, onNodesChange] = useNodesState<any>(contents.nodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState<any>(contents.edges);
    const [statusMessages, setStatusMessages] = useState<{ type: 'error' | 'ok' | 'mid', msg: string }[]>()
    const [returnedData, setReturnedData] = useState<{ id: string, value?: any }[]>([])
    const [avalibleModules, setAvalibleModules] = useState<{ id: string, data: IDiagramModule }[]>()
    const [pathId, setPathId] = useState<string>()

    useEffect(() => {
        const getModules = async () => {
            const items = await getAllModules()
            setAvalibleModules(items)
        }
        getModules()
    }, [])


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
        <div className='w-full h-full'>
            <div className='flex flex-row gap-2 h-2/3'>
                <div className='w-full h-full bg-gradient-to-r from-neutral-300 to-stone-400 rounded-md'>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        nodeTypes={nodeTypes}
                        edgeTypes={edgeTypes}
                        fitView
                    >
                    </ReactFlow>

                </div>
            </div>

            <div className='flex flex-row w-[100%] h-[30%] p-1 gap-1'>
                <div className='flex flex-col bg-white rounded-md w-full h-full border-2 border-[#7242f5] p-2'>
                    <div className='flex flex-wrap gap-2'>
                        <button className='flex flex-row rounded-lg bg-[#dbeafe] text-[#1e40af] p-2 font-main2' onClick={
                            () => setNodes([...nodes,
                            {
                                id: `${generate()}-${Date.now()}`,
                                type: 'singleConst',
                                data: {
                                    name: `${generate()}`,
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
                            константа
                        </button>
                        {avalibleModules?.map((m, i) => {
                            return (
                                <button key={i} className='flex flex-row rounded-lg bg-[#dbeafe] text-[#1e40af] p-2 font-main2' onClick={
                                    () => setNodes([...nodes,
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
                                }>
                                    {m.data.name}
                                </button>
                            )
                        })}
                    </div>
                </div>
                <div className='flex flex-col gap-2 bg-white rounded-md w-full h-full p-2'>
                    <div className='flex flex-row gap-2'>
                        <button className='rounded-md p-2 bg-[#7242f5] text-white font-semibold font-main2' onClick={() => {
                            const path = {
                                nodes: nodes,
                                edges: edges
                            }
                            const asyncAdd = async () => {
                                const id = await addNewPathToCollection(nodes, edges)
                                setPathId(id)

                            }
                            asyncAdd()
                        }}>
                            Сохранить
                        </button>
                        <div>
                            {pathId}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PathContent;