import type { Observable } from "../Misc/observable";
import type { FlowGraphBlock } from "./flowGraphBlock";
import type { FlowGraphConnectionPoint } from "./flowGraphConnectionPoint";

/**
 * @experimental
 */
export interface IFlowExecutionParameters {
    onActivateConnectionObservable: Observable<FlowGraphConnectionPoint>;
    onExecutionDoneObservable: Observable<void>;
}
/**
 * @experimental
 */
export interface IFlowBlock {
    executeFlow(params: IFlowExecutionParameters): void;
}

/**
 * @experimental
 */
export function isFlowBlock(block: FlowGraphBlock): block is IFlowBlock & FlowGraphBlock {
    return (block as any).executeFlow !== undefined;
}
