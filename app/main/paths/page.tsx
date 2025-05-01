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
import { typesStyles } from '@/custom-constants';
import { getAnswer } from '@/server-side/gemini';
import { RiTestTubeLine } from "react-icons/ri";
import { FaCheck } from 'react-icons/fa';
import { FaPlay } from "react-icons/fa";

const nodeTypes = {
  custom: CustomNode,
  const: ConstantNode,
  singleConst: singleConst,
  start: KeyNode
};

const edgeTypes = {
  custom: CustomEdge
};

const singleConstAgent: IDiagramModule = {
  name: 'Промпт',
  getResponse: async (arg0: {}) => [],
  inputs: [

  ],
  outputs: [
    {
      id: 'prompt1',
      name: 'prompt',
      type: 'text',
      value: `тут писать`,
      showValue: false
    },
  ]
}

const singleConstAgent2: IDiagramModule = {
  name: 'Модель',
  getResponse: async () => [],
  inputs: [

  ],
  outputs: [
    {
      id: 'model1',
      name: 'model',
      type: 'text',
      value: `models/gemini-2.0-flash-exp`,
      showValue: false
    },
  ]
}

const geminiAgent: IDiagramModule = {
  name: 'Gemini Agent',
  getResponse: async (arg) => {
    const model = arg.find(a => a.id == 'model')
    const prompt = arg.find(a => a.id == 'prompt')
    const sysprompt = arg.find(a => a.id == 'sysprompt')
    const history = arg.find(a => a.id == 'history')

    if (model && prompt) {
      return [{ id: 'answer', value: await getAnswer(model.value, prompt.value, history?.value, sysprompt?.value) }]
    }
    return []
  },
  inputs: [
    {
      id: `sysprompt`,
      name: 'system prompt',
      type: 'text',
      value: undefined
    },
    {
      id: `prompt`,
      name: 'prompt',
      type: 'text',
      value: undefined
    },
    {
      id: `model`,
      name: 'gemini model',
      type: 'text',
      value: undefined
    },
    {
      id: `history`,
      name: 'history',
      type: 'history',
      value: undefined
    },
  ],
  outputs: [
    {
      id: `answer`,
      name: 'answer',
      type: 'text',
      value: undefined
    },
  ]
}

const initNodes = [
  {
    id: 'geminiAgent2',
    type: 'custom',
    data: geminiAgent,
    position: { x: 400, y: 400 },
  },
  {
    id: 'geminiAgent1',
    type: 'custom',
    data: geminiAgent,
    position: { x: 400, y: 0 },
  },
  {
    id: 'const',
    type: 'singleConst',
    data: singleConstAgent,
    position: { x: 0, y: 0 },
  },
  {
    id: 'const2',
    type: 'singleConst',
    data: singleConstAgent2,
    position: { x: 0, y: -200 },
  },
  {
    id: 'start',
    type: 'start',
    data: { outputs: [{ id: 'userPrompt', name: 'prompt', type: 'text', value: 'aboba' }] },
    position: { x: 0, y: 200 },
    deletable: false
  },
  {
    id: 'end',
    type: 'start',
    data: { inputs: [], itsEnd: true },
    position: { x: 700, y: 0 },
    deletable: false
  }
];

const AVALIBLE_NODE_TYPES: { type: 'singleConst' | 'custom', data: IDiagramModule }[] = [
  
]


export default function () {

  const [nodes, setNodes, onNodesChange] = useNodesState<any>(initNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
  const [statusMessages, setStatusMessages] = useState<{ type: 'error' | 'ok' | 'mid', msg: string }[]>()
  const [returnedData, setReturnedData] = useState<{ id: string, value?: any }[]>([])


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
    const saveAsync = async () => {
      setStatusMessages([{ type: 'mid', msg: 'процесс запущен...' }])

      // 1. Find the starting node(s).  Assume we have one for now.  Adjust logic if you need to support multiple starts
      const startNode = nodes.find(node => node.type === 'start' && !node.data.itsEnd);  // added !node.data.itsEnd check
      if (!startNode) {
        console.warn("No start node found.");
        return;
      }

      // 2. Initialize the traversal
      let currentNodes: any[] = [startNode]; // Start with the start node
      const visitedNodes = new Set<string>(); // Keep track of visited nodes to prevent loops
      const dependencies: { [nodeId: string]: { [inputId: string]: any } } = {};
      const deps: { nodeId: string, inputId: string, value?: any }[] = []

      // Create a copy of the nodes array to modify
      const newNodes = nodes.map(node => ({ ...node, data: { ...node.data } }));

      // 3. Breadth-first traversal
      while (currentNodes.length > 0) {
        const nextNodes: any[] = [];

        for (const currentNode of currentNodes) {
          const paramsForValue: { id: string, value?: any }[] = []
          if (visitedNodes.has(currentNode.id)) {
            continue;
          }

          visitedNodes.add(currentNode.id);
          dependencies[currentNode.id] = {};

          if (currentNode.data.inputs) {
            for (const input of currentNode.data.inputs) {
              const edge = edges.find(e => e.target === currentNode.id && e.targetHandle === input.id);
              if (edge) {
                const sourceNode = newNodes.find(n => n.id === edge.source); // Use newNodes
                if (sourceNode) {
                  let inputValue: any;
                  inputValue = (sourceNode.data.outputs as IHandleData[]).find(output => output.id === edge.sourceHandle)?.value;
                  deps.push({ nodeId: currentNode.id, inputId: input.id, value: inputValue })
                  dependencies[currentNode.id][input.id] = inputValue;
                  paramsForValue.push({ id: input.id, value: inputValue })
                }
              }
            }
          }

          if (currentNode.type == 'custom') {
            const nodeIndex = newNodes.findIndex(n => n.id === currentNode.id); // Find the index in newNodes
            if (nodeIndex !== -1) {
              const newValue = await (currentNode.data as IDiagramModule).getResponse(paramsForValue)
              const updatedOutputs = (currentNode.data as IDiagramModule).outputs.map(o => {
                const newValueItem = newValue.find(v => v.id === o.id);
                if (newValueItem) {
                  return {
                    name: o.name,
                    type: o.type,
                    id: o.id,
                    showValue: o.showValue,
                    value: newValueItem.value
                  };
                } else {
                  return o;
                }
              });

              // Update the outputs in the copied nodes array
              newNodes[nodeIndex] = {
                ...newNodes[nodeIndex],
                data: {
                  ...newNodes[nodeIndex].data,
                  outputs: updatedOutputs
                }
              };
            }
          }

          const outgoingEdges = edges.filter(edge => edge.source === currentNode.id);

          for (const edge of outgoingEdges) {
            const targetNode = newNodes.find(node => node.id === edge.target); // Use newNodes
            if (targetNode) {
              nextNodes.push(targetNode);
            }
          }
        }

        currentNodes = nextNodes;
      }

      const endNode = newNodes.find(node => node.type === 'start' && node.data.itsEnd); // Use newNodes

      if (!visitedNodes.has(endNode.id)) {
        setStatusMessages([{ type: 'error', msg: 'не подключена точка выхода' }])
      }
      else {
        setStatusMessages([{ type: 'ok', msg: 'маршрут пройден' }])
        console.log("Traversed graph:", { dependencies, visitedNodes });
      }
      setReturnedData(deps.filter(d => d.nodeId == 'end').map(d => ({ id: d.inputId, value: d.value })))


      //setNodes(newNodes);
    }
    saveAsync()
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
        <div className='flex flex-col bg-white rounded-md w-full h-full border-2 border-[#7242f5] p-2'>

        </div>
        <div className='flex flex-col gap-2 bg-white rounded-md w-full h-full p-2'>
          <div className='flex flex-row gap-2'>
            <button className='rounded-md p-2 bg-[#7242f5] text-white font-semibold font-main2' onClick={() => {
              const path = {
                nodes: nodes,
                edges: edges
              }
              console.log(path)
            }}>
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};