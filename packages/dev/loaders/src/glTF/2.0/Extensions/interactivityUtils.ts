import type { IKHRInteractivity_Node, IKHRInteractivity_Value } from "babylonjs-gltf2interface";
import {
    FlowGraphSceneReadyEventBlock,
    FlowGraphLogBlock,
    FlowGraphTimerBlock,
    FlowGraphSendCustomEventBlock,
    FlowGraphSequenceBlock,
    FlowGraphGetPropertyBlock,
    FlowGraphSetPropertyBlock,
    FlowGraphAddBlock,
    FlowGraphSceneTickEventBlock,
    FlowGraphDoNBlock,
    FlowGraphGetVariableBlock,
    FlowGraphSetVariableBlock,
    FlowGraphRandomBlock,
    FlowGraphLessThanBlock,
    FlowGraphWhileLoopBlock,
    FlowGraphMultiplyBlock,
    FlowGraphAnimateToBlock,
    FlowGraphSubtractBlock,
    FlowGraphDotBlock,
    FlowGraphReceiveCustomEventBlock,
    // eslint-disable-next-line import/no-internal-modules
} from "core/FlowGraph/index";

export const gltfToFlowGraphTypeMap: { [key: string]: string } = {
    "lifecycle/onStart": FlowGraphSceneReadyEventBlock.ClassName,
    "lifecycle/onTick": FlowGraphSceneTickEventBlock.ClassName,
    log: FlowGraphLogBlock.ClassName,
    "flow/delay": FlowGraphTimerBlock.ClassName,
    "customEvent/send": FlowGraphSendCustomEventBlock.ClassName,
    "customEvent/receive": FlowGraphReceiveCustomEventBlock.ClassName,
    "flow/sequence": FlowGraphSequenceBlock.ClassName,
    "world/get": FlowGraphGetPropertyBlock.ClassName,
    "world/set": FlowGraphSetPropertyBlock.ClassName,
    "math/add": FlowGraphAddBlock.ClassName,
    "flow/doN": FlowGraphDoNBlock.ClassName,
    "variable/get": FlowGraphGetVariableBlock.ClassName,
    "variable/set": FlowGraphSetVariableBlock.ClassName,
    "math/random": FlowGraphRandomBlock.ClassName,
    "math/lt": FlowGraphLessThanBlock.ClassName,
    "flow/whileLoop": FlowGraphWhileLoopBlock.ClassName,
    "math/mul": FlowGraphMultiplyBlock.ClassName,
    "world/animateTo": FlowGraphAnimateToBlock.ClassName,
    "math/sub": FlowGraphSubtractBlock.ClassName,
    "math/dot": FlowGraphDotBlock.ClassName,
};

export const gltfPropertyPathToBabylonPropertyPath: any = {
    translation: "_babylonTransformNode/position",
    scale: "_babylonTransformNode/scaling",
    rotation: "_babylonTransformNode/rotationQuaternion",
    "pbrMetallicRoughness/baseColorFactor": "_data/0/babylonMaterial/albedoColor",
};

export const gltfTypeToBabylonType: any = {
    float2: "Vector2",
    float3: "Vector3",
    float4: "Vector4",
};

export const convertBlockInputType = (gltfBlock: IKHRInteractivity_Node, value: IKHRInteractivity_Value, convertedValue: any, context: string) => {
    if (gltfBlock.type === "world/set" || gltfBlock.type === "world/get" || gltfBlock.type === "world/animateTo") {
        const gltfConfig = gltfBlock.configuration && gltfBlock.configuration[0];
        if (!gltfConfig) {
            throw new Error(`${context}: Invalid glTF block configuration`);
        }
        const path = gltfConfig.value as string;
        if (path.includes("baseColorFactor")) {
            if (value.id === "a" && value.value !== undefined && convertedValue.className === "Vector4") {
                convertedValue.className = "Color3";
            }
        }
    }
};
