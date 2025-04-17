import React from 'react';
import { BaseEdge, EdgeProps, getBezierPath, getSmoothStepPath } from '@xyflow/react';
import { typesStyles } from '@/custom-constants';

export default function CustomEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    data
}: any) {
    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    console.log('aaaaa')
    console.log(data)
    console.log('aaaaa')
    return <BaseEdge path={edgePath} markerEnd={markerEnd} style={{ stroke: typesStyles[data.type].style, strokeWidth: 5 }} />
}