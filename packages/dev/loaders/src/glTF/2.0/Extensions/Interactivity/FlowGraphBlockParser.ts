import type { IKHRInteractivity, IKHRInteractivity_Node } from "babylonjs-gltf2interface";
import type { FlowGraphBlock, IFlowGraphBlockConfiguration } from "core/FlowGraph";
import {
    FlowGraphGetPropertyBlock,
    FlowGraphLogBlock,
    FlowGraphReceiveCustomEventBlock,
    FlowGraphRotate3dVector3Block,
    FlowGraphSceneReadyEventBlock,
    FlowGraphSendCustomEventBlock,
    FlowGraphSequenceBlock,
    FlowGraphSetPropertyBlock,
    FlowGraphTimerBlock,
} from "core/FlowGraph";

const _nodesToTypeMapping: { [type: string]: typeof FlowGraphBlock } = {
    "lifecycle/onStart": FlowGraphSceneReadyEventBlock,
    "flow/sequence": FlowGraphSequenceBlock,
    "flow/delay": FlowGraphTimerBlock,
    rotate3d: FlowGraphRotate3dVector3Block,
    "world/set": FlowGraphSetPropertyBlock,
    "world/get": FlowGraphGetPropertyBlock,
    log: FlowGraphLogBlock,
};

const _nodesToCreateFunctionMapping: { [type: string]: ICreateNodeFunction } = {
    "customEvent/send": _createCustomEventNode,
    "customEvent/receive": _createCustomEventNode,
};

export type ICreateNodeFunction = (node: IKHRInteractivity_Node, definition: IKHRInteractivity) => FlowGraphBlock;

function _buildConfiguration(node: IKHRInteractivity_Node): IFlowGraphBlockConfiguration {
    const nodeConfig = node.configuration ?? [];
    const resultConfig: any = {};
    for (const prop of nodeConfig) {
        resultConfig[prop.id] = prop.value;
    }
    return resultConfig;
}

export function createNode(node: IKHRInteractivity_Node, definition: IKHRInteractivity): FlowGraphBlock {
    if (node.type in _nodesToCreateFunctionMapping) {
        return _nodesToCreateFunctionMapping[node.type](node, definition);
    } else {
        return _createDefaultNode(node);
    }
}

function _createDefaultNode(node: IKHRInteractivity_Node): FlowGraphBlock {
    const type = node.type;
    const configuration = _buildConfiguration(node);
    if (type in _nodesToTypeMapping) {
        const instantiatedNode = new _nodesToTypeMapping[type](configuration);
        return instantiatedNode;
    } else {
        throw new Error(`Unknown node type ${type}`);
    }
}

function _createCustomEventNode(node: IKHRInteractivity_Node, definition: IKHRInteractivity): FlowGraphSendCustomEventBlock | FlowGraphReceiveCustomEventBlock {
    const customEventIdx = node.configuration[0].value; // the first configuration of the node contains the index of the custom event in the custom events array
    if (!customEventIdx) {
        throw new Error("Missing customEvent configuration on customEvent/send node: " + JSON.stringify(node));
    }

    const customEventDefinition = definition.customEvents[customEventIdx];
    if (!customEventDefinition) {
        throw new Error("Invalid customEvent configuration on customEvent/send node: " + JSON.stringify(node));
    }

    return node.type === "customEvent/send" ? new FlowGraphSendCustomEventBlock(customEventDefinition) : new FlowGraphReceiveCustomEventBlock(customEventDefinition);
}
