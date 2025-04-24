'use client'
import React from 'react';
import { BaseEdge, EdgeLabelRenderer, EdgeProps, getBezierPath, getSmoothStepPath, useReactFlow } from '@xyflow/react';
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

    const { setEdges } = useReactFlow();

    const onEdgeClick = (event: React.MouseEvent<SVGPathElement, MouseEvent>) => {
        setEdges((edges) => edges.filter((edge) => edge.id !== id));
    };

    console.log(data)

    return <>
        <path
            id={id}
            className="react-flow__edge-path"
            d={edgePath}
            markerEnd={markerEnd}
            style={{ stroke: typesStyles[data.type].style, strokeWidth: 5, cursor: 'pointer' }}
            onClick={onEdgeClick}
        />
    </>
}