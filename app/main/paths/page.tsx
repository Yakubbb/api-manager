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
  name: 'aboba',
  inputs: [
    {
      name: 'key',
      type: 'key',
      value: 'aboba'
    },
    {
      name: 'prompt',
      type: 'text',
      value: 'aboba'
    },
    {
      name: 'sys',
      type: 'fbx',
      value: 'aboba'
    }
  ],
  outputs: [
    {
      name: 'id',
      type: 'photo',
      value: 'aboba'
    },
    {
      name: 'text1',
      type: 'text',
      value: 'aboba'
    },
    {
      name: 'fbx1',
      type: 'fbx',
      value: 'aboba'
    }
  ]
}

const initNodes = [
  {
    id: '1',
    type: 'custom',
    data: m,
    position: { x: 0, y: 50 },
  },
  {
    id: '2',
    type: 'custom',
    data: m,

    position: { x: -200, y: 200 },
  },
  {
    id: '3',
    type: 'singleConst',
    data: { name: 'aboba', type: 'text', value: 'hoba' },
    position: { x: 200, y: 200 },
  },
  {
    id: '4',
    type: 'const',
    position: { x: 300, y: 200 },
  },
];


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
        case 'singleConst':
          sourceType = sourceNode.data.type
          break;
        case 'custom':
          const outputs = sourceNode.data.outputs as { name: string, type: any }[]
          sourceType = outputs.find(o => o.name == params.sourceHandle!)?.type
          break;
      }
    }

    if (targetNode) {
      switch (targetNode.type) {
        case 'singleConst':
          targetType = targetNode.data.type
          break;
        case 'custom':
          const inputs = targetNode.data.inputs as { name: string, type: any }[]
          targetType = inputs.find(o => o.name == params.targetHandle!)?.type
          break;
      }
    }

    return { sourceType: sourceType, targetType: targetType }
  }

  const onConnect = useCallback(
    (params: any) => {

      if (params.source == params.target) {
        return
      }
      const types = getTypeByParams(params)

      if (types.sourceType != types.targetType) {
        return
      }
      setEdges((eds) => addEdge({ ...params, style: { stroke: typesStyles[types.sourceType].style, strokeWidth: 5 } }, eds))
    },
    [],
  );

  const onConnectStart = useCallback(
    (params: any) => {
      setEdges((eds) => addEdge({ ...params, style: { stroke: params.originalTarget.style["background-color"], strokeWidth: 5 } }, eds))
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
