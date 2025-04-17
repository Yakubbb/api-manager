'use client'
import React, { useCallback, useState } from 'react';
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
import { CustomNode } from '@/diagramComponents/moduleComponent';
import { IDiagramModule } from '@/custom-types';
import { ConstantNode } from '@/diagramComponents/constComponent';
import singleConst from '@/diagramComponents/singleConst';
import CustomEdge from '@/diagramComponents/customEdge';
import { typesStyles } from '@/custom-constants';

const nodeTypes = {
  custom: CustomNode,
  const: ConstantNode,
  singleConst: singleConst
};

const edgeTypes = {
  custom: CustomEdge
};

const m: IDiagramModule = {
  name: 'AI agent',
  inputs: [
    {
      name: 'prompt',
      type: 'text',
    },
    {
      name: 'prompt2',
      type: 'text',
    },
    {
      name: 'model',
      type: 'model',
    },
    {
      name: 'history',
      type: 'history',
    },
  ],
  outputs: [
    {
      name: 'answer',
      type: 'text',
    },
  ]
}

const initNodes = [
  {
    id: '1',
    type: 'custom',
    data: m,
    position: { x: -400, y: 0 },
  },
  {
    id: '2',
    type: 'custom',
    data: m,

    position: { x: 0, y: 0 },
  },
  {
    id: '3',
    type: 'singleConst',
    data: m,
    position: { x: -600, y: -50 },
  },
];

const initEdges = [
  {
    id: 'aboba',
    source: '1',
    target: '2',
    sourceHandle: 'answer',
    targetHandle: 'prompt',
    type: 'custom',
    data: {
      type: 'text',
      constValue: undefined
    }
  },
]


export default function () {

  const [nodes, setNodes, onNodesChange] = useNodesState<any>(initNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
  const [constants, setConstants] = useState<{ name: string, type: any, value: any }[]>([])
  const [modules, setModules] = useState<IDiagramModule[]>([])


  const getTypeByParams = (params: { source: any, target: any, sourceHandle: any, targetHandle: any }) => {

    const sourceNode = nodes.find(n => n.id == params.source!);
    const targetNode = nodes.find(n => n.id == params.target!);

    let sourceType = 'blank'
    let targetType = 'blank'



    if (sourceNode) {
      switch (sourceNode.type) {
        default:
          const outputs = sourceNode.data.outputs as { name: string, type: any }[]
          sourceType = outputs.find(o => o.name == params.sourceHandle!)?.type
          break;
      }
    }

    if (targetNode) {
      switch (targetNode.type) {
        default:
          const inputs = targetNode.data.inputs as { name: string, type: any }[]
          targetType = inputs.find(o => o.name == params.targetHandle!)?.type
          break;
      }
    }

    return { sourceType: sourceType, targetType: targetType }
  }

  const onConnect = useCallback(
    (params: any) => {

      console.log('boba')

      if (params.source == params.target) {
        console.log('hoba')
        return
      }
      const types = getTypeByParams(params)

      if (types.sourceType != types.targetType) {

        console.log(types.sourceType)
        console.log(types.targetType)
        return
      }


      setEdges((eds) => addEdge({ type: 'custom', ...params, data: { type: types.sourceType } }, eds))
    },
    [],
  );

  const onConnectStart = useCallback(
    (params: any) => {
      console.log('aboba')
      //    setEdges((eds) => addEdge({ ...params, style: { stroke: params.originalTarget.style["background-color"], strokeWidth: 5 } }, eds))
    },
    [],
  );


  return (
    <div className='w-[100%] h-[100%] p-2 '>
      <div className='w-[100%] h-[70%] bg-gradient-to-r from-neutral-300 to-stone-400 rounded-md'>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onConnectStart={onConnectStart}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          connectionLineStyle={
            {

            }
          }
        >
          <Controls />
          <Background variant={BackgroundVariant.Dots} />
        </ReactFlow>
      </div>
      <div className='flex flex-row w-[100%] h-[30%] p-1 gap-1'>
        <div className='bg-black rounded-md w-full h-full'>

        </div>
        <div className='bg-white rounded-md w-full h-full'>

        </div>
      </div>
    </div>
  );
};
