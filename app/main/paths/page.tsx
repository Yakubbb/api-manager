'use client'
import React, { useCallback } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
} from '@xyflow/react';

import '@xyflow/react/dist/base.css';
import { CustomNode } from '@/diagramComponents/moduleComponent';
import { IDiagramModule } from '@/custom-types';

const nodeTypes = {
  custom: CustomNode,
};

const m: IDiagramModule = {
  name: 'aboba',
  inputs: [
    {
      name: 'key',
      type: 'Photo',
      value: 'aboba'
    },
    {
      name: 'prompt',
      type: 'text',
      value: 'aboba'
    },
    {
      name: 'sys',
      type: 'Fbx',
      value: 'aboba'
    }
  ],
  outputs: [
    {
      name: 'id',
      type: 'text',
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
    type: 'custom',
    data: m,
    position: { x: 200, y: 200 },
  },
];


export default function () {
  const [nodes, setNodes, onNodesChange] = useNodesState<any>(initNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);

  const onConnect = useCallback(
    (params: any) => {
      setEdges((eds) => addEdge(params, eds))
    },
    [],
  );


  return (
    <div className='w-[100%] h-[100%] p-4 '>
      <div className='w-[100%] h-[60%] bg-neutral-300 rounded-md'>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};
