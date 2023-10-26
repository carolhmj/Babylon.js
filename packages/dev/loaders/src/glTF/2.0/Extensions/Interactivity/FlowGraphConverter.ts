import { IKHRInteractivity } from "babylonjs-gltf2interface";
import { FlowGraphLogBlock, FlowGraphSceneReadyEventBlock, ISerializedFlowGraph } from "core/FlowGraph";

const gltfTypeToFlowGraphClassName: { [key: string]: string } = {
    "lifecycle/onStart": FlowGraphSceneReadyEventBlock.ClassName,
    log: FlowGraphLogBlock.ClassName,
};

export function convertGLTFToFlowGraph(gltf: IKHRInteractivity): ISerializedFlowGraph {
    const flowGraph: ISerializedFlowGraph = {
        allBlocks: [],
        executionContexts: [],
    };

    for (const node of gltf.nodes) {
        const type = node.type;
        const flowClassName = gltfTypeToFlowGraphClassName[type];
        const flowsOut = node.flows;
        const signalOutputs = [];
        for (const flowOut of flowsOut) {
        }
        const nodeFlowGraph = {
            className: flowClassName,
            id: node.id,
            signalOutputs,
            signalInputs: [],
            dataInputs: [],
            dataOutputs: [],
        };

        flowGraph.allBlocks.push(nodeFlowGraph);
    }

    return flowGraph;
}
