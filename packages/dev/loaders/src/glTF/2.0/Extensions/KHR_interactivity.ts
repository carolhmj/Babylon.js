/* eslint-disable @typescript-eslint/naming-convention */
import type { IKHRInteractivity, IKHRInteractivity_Node } from "babylonjs-gltf2interface";
import { GLTFLoader } from "../glTFLoader";
import type { IGLTFLoaderExtension } from "../glTFLoaderExtension";
import type { FlowGraphBlock, IFlowGraphBlockConfiguration } from "core/FlowGraph";
import {
    FlowGraphCoordinator,
    FlowGraphGetPropertyBlock,
    FlowGraphRotate3dVector3Block,
    FlowGraphSceneReadyEventBlock,
    FlowGraphSequenceBlock,
    FlowGraphSetPropertyBlock,
    FlowGraphTimerBlock,
} from "core/FlowGraph";
import type { FlowGraphDataConnection } from "core/FlowGraph/flowGraphDataConnection";

const NAME = "KHR_interactivity";

/**
 * Loader extension for KHR_interactivity
 */
export class KHR_interactivity implements IGLTFLoaderExtension {
    /**
     * The name of this extension.
     */
    public readonly name = NAME;
    /**
     * Defines whether this extension is enabled.
     */
    public enabled: boolean;
    /**
     * Defines a number that determines the order the extensions are applied.
     */
    // TODO: correct value?
    public order = 195;

    // TODO should it move to a structure in the flowgraph package?
    private _nodesToTypeMapping: { [type: string]: typeof FlowGraphBlock } = {
        "lifecycle/onStart": FlowGraphSceneReadyEventBlock,
        "flow/sequence": FlowGraphSequenceBlock,
        "flow/delay": FlowGraphTimerBlock,
        rotate3d: FlowGraphRotate3dVector3Block,
        "world/set": FlowGraphSetPropertyBlock,
        "world/get": FlowGraphGetPropertyBlock,
    };

    /**
     * @internal
     * @param _loader
     */
    constructor(private _loader: GLTFLoader) {
        this.enabled = this._loader.isExtensionUsed(NAME);
    }

    public dispose() {
        (this._loader as any) = null;
    }

    private _buildConfiguration(node: IKHRInteractivity_Node): IFlowGraphBlockConfiguration {
        const nodeConfig = node.configuration ?? [];
        const resultConfig: any = {};
        for (const prop of nodeConfig) {
            resultConfig[prop.id] = prop.value;
        }
        return resultConfig;
    }

    private _createNode(node: IKHRInteractivity_Node): FlowGraphBlock {
        const type = node.type;
        const configuration = this._buildConfiguration(node);
        if (type in this._nodesToTypeMapping) {
            const instantiatedNode = new this._nodesToTypeMapping[type](configuration);
            return instantiatedNode;
        } else {
            throw new Error(`Unknown node type ${type}`);
        }
    }

    public onReady(): void {
        if (!this._loader._babylonScene) {
            return;
        }
        const scene = this._loader._babylonScene;
        const definition = this._loader.gltf.extensions?.KHR_interactivity as IKHRInteractivity;
        console.log("definition", definition);
        const flowGraphCoordinator = new FlowGraphCoordinator({ scene });
        const flowGraph = flowGraphCoordinator.createGraph();
        const flowGraphContext = flowGraph.createContext();

        const nodes: FlowGraphBlock[] = [];
        // First, create all the nodes
        for (const node of definition.nodes) {
            const createdNode = this._createNode(node);
            nodes.push(createdNode);
        }

        // Then, go through all nodes again and connect their flows and parameters
        for (let i = 0; i < definition.nodes.length; i++) {
            const node = definition.nodes[i];
            const createdNode = nodes[i];
            const nodeFlows = node.flows ?? [];
            for (let j = 0; j < nodeFlows.length; j++) {
                const flow = node.flows[j];
                const createdConnectedNode = nodes[flow.node];
                if (!createdConnectedNode) {
                    throw new Error("Invalid flow definition: " + JSON.stringify(flow));
                }
                const createdNodeSocket = createdConnectedNode.findConnectionByName(flow.socket);
                if (createdNodeSocket) {
                    (createdNode as any).signalOutputs[j].connectTo(createdNodeSocket);
                } else {
                    throw new Error("Invalid flow definition: " + JSON.stringify(flow));
                }
            }
            const nodeParameters = node.parameters ?? [];
            for (let j = 0; j < nodeParameters.length; j++) {
                const parameter = node.parameters[j];
                const inputSocket = createdNode.findConnectionByName(parameter.id);
                if (parameter.value !== undefined && inputSocket) {
                    // TODO: function to set as value, as the value can be an array representing vector3, etc.
                    (inputSocket as FlowGraphDataConnection<any>).setValue(parameter.value, flowGraphContext);
                } else if (parameter.node !== undefined && parameter.socket !== undefined) {
                    const connectedNode = nodes[parameter.node];
                    const outputSocket = connectedNode.findConnectionByName(parameter.socket);
                    if (outputSocket && inputSocket) {
                        outputSocket.connectTo(inputSocket);
                    } else {
                        throw new Error("Invalid parameter definition: " + JSON.stringify(parameter));
                    }
                } else {
                    throw new Error("Invalid parameter definition: " + JSON.stringify(parameter));
                }
            }
        }
        console.log("constructed graph", flowGraph);
    }
}

GLTFLoader.RegisterExtension(NAME, (loader) => new KHR_interactivity(loader));
