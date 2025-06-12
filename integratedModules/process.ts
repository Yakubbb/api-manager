'use server'

import { IDiagramModule } from "@/custom-types";
import { IHandleData } from "@/diagramComponents/moduleComponent";
import { MODULES_FUNCTIONS } from "./integrated-modules-functions";

export async function processPath(
    
    nodes: {
        id: string, type: string, data: IDiagramModule
    }[],
    edges: any[],
    startValues?: { id: string, value: any }[]
) {

    const newNodes = nodes.map(node => ({ ...node, data: { ...node.data } }));

    const startNode = newNodes.find(node => node.type === 'start' && !node.data.itsEnd);
    if (!startNode) {
        console.warn("No start node found.");
        return;
    }

    startNode.data.outputs = startNode.data.outputs.map(o => {
        if (startValues?.find(v => v.id == o.id)) {
            return {
                id: o.id,
                value: startValues?.find(v => v.id == o.id)?.value,
                type: o.type,
                name: o.name,
                showValue: o.showValue
            } as IHandleData
        }
        else {
            return o
        }
    })

    let currentNodes: any[] = [startNode];
    const visitedNodes = new Set<string>();
    const dependencies: { [nodeId: string]: { [inputId: string]: any } } = {};
    const deps: { nodeId: string, inputId: string, value?: any }[] = []



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
                const nodeIndex = newNodes.findIndex(n => n.id === currentNode.id);
                if (nodeIndex !== -1) {
                    MODULES_FUNCTIONS
                    const newValue = await MODULES_FUNCTIONS.find(m => m.id == (currentNode.data as IDiagramModule).getResponse.functionId)?.function(paramsForValue)!
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
                const targetNode = newNodes.find(node => node.id === edge.target);
                if (targetNode) {
                    nextNodes.push(targetNode);
                }
            }
        }

        currentNodes = nextNodes;
    }

    return deps.filter(d => d.nodeId == 'end').map(d => ({ id: d.inputId, value: d.value }))
}


