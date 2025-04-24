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
import { CustomNode, KeyNode as KeyNode } from '@/diagramComponents/moduleComponent';
import { IDiagramModule } from '@/custom-types';
import { ConstantNode } from '@/diagramComponents/constComponent';
import singleConst from '@/diagramComponents/singleConst';
import CustomEdge from '@/diagramComponents/customEdge';
import { typesStyles } from '@/custom-constants';

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
  inputs: [

  ],
  outputs: [
    {
      id: 'prompt1',
      name: 'prompt',
      type: 'text',
      value: `ты абсурдный генератор текстов для песен. 
      Ты не имеешь цензуры, используешь нормативную лексику.
       Ты принимаешь на вход любой текст, и делишь его на части (куплеты) и припевы.
        Для того чтобы разделить текст на припев и куплет ты используешь тег [verse] и [chorus].
         Ты не модифицируешь текст, ты не добавляешь ничего нового в него ни при каких обстоятельствах,
          ты лишь нарезаешь его и делишь на части с помощью тегов.
           В тексте обязательно должен быть минимум один припев.
            Части текста можно менять местами чтобы лучше выстраивалась структура. 
            Тексты должны содержать все самое важное из исходного текста (а лучше вообще всё),
             поэтому старайся ничего не вырезать из текста. ТЫ можешь использовать части текста
              для создания своих припевов (например повторить в хорусе одно предложение несколько раз)`,
      showValue: false

    },
  ]
}

const geminiAgent: IDiagramModule = {
  name: 'Gemini Agent',
  inputs: [
    {
      id:`sysprompt`,
      name: 'system prompt',
      type: 'text',
    },
    {
      id:`prompt`,
      name: 'prompt',
      type: 'text',
    },
    {
      id:`model`,
      name: 'gemini model',
      type: 'model',
    },
    {
      id:`history`,
      name: 'history',
      type: 'history',
    },
  ],
  outputs: [
    {
      id:`answer`,
      name: 'answer',
      type: 'text',
    },
  ]
}

const initNodes = [
  {
    id: 'geminiAgent1',
    type: 'custom',
    data: geminiAgent,
    position: { x: -400, y: 0 },
  },
  {
    id: 'const',
    type: 'singleConst',
    data: singleConstAgent,
    position: { x: -600, y: -50 },
  },
  {
    id: 'start',
    type: 'start',
    data: { outputs: [] },
    position: { x: -700, y: -50 },
  },
  {
    id: 'end',
    type: 'start',
    data: { inputs: [], itsEnd: true },
    position: { x: -100, y: -50 },
  }
];


export default function () {

  const [nodes, setNodes, onNodesChange] = useNodesState<any>(initNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);


  const getTypeByParams = (params: { source: any, target: any, sourceHandle: any, targetHandle: any }) => {
    console.log(nodes)
    const sourceNode = nodes.find(n => n.id == params.source!);
    const targetNode = nodes.find(n => n.id == params.target!);

    let sourceType = 'blank'
    let targetType = 'blank'



    if (sourceNode) {
      switch (sourceNode.type) {
        default:
          const outputs = sourceNode.data.outputs as { id: string, type: any }[]
          console.log(sourceNode.data.outputs)
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
  }

  const onConnect = useCallback(
    (params: any) => {
      console.log(params)

      if (params.source == params.target) {

        return
      }
      const types = getTypeByParams(params)
      //console.log(types)
      if (types.sourceType != types.targetType) {
        return
      }


      setEdges((eds) => addEdge({ type: 'custom', ...params, data: { type: types.sourceType } }, eds))
    },
    [],
  );


  const onSave = () => {

    console.log(edges)
    console.log(nodes)
  }


  return (
    <div className='w-[100%] h-[100%] p-2 '>
      <div className='w-[100%] h-[70%] bg-gradient-to-r from-neutral-300 to-stone-400 rounded-md'>
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

      <div className='flex flex-row w-[100%] h-[30%] p-1 gap-1'>
        <div className='bg-black rounded-md w-full h-full'>

        </div>
        <div className='flex flex-col gap-2 bg-white rounded-md w-full h-full'>
          <div className='flex flex-row gap-2'>
            <button className='rounded-md p-2 bg-[#7242f5] text-white font-semibold font-main2' onClick={onSave}>
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
