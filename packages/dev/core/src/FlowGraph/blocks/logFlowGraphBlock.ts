import { FlowGraphBlock } from "../flowGraphBlock";
import { FlowGraphConnectionPoint, FlowGraphConnectionPointDirection } from "../flowGraphConnectionPoint";
import type { IFlowBlock, IFlowExecutionParameters } from "../iFlowBlock";

export interface LogFlowGraphBlockConstructorParameters {}
/**
 * @experimental
 */
export class LogFlowGraphBlock extends FlowGraphBlock implements IFlowBlock {
    constructor(params: LogFlowGraphBlockConstructorParameters) {
        super({ name: "Log" });

        this._inputs = [
            new FlowGraphConnectionPoint({ name: "flowIn", ownerBlock: this, direction: FlowGraphConnectionPointDirection.Input }),
            new FlowGraphConnectionPoint({ name: "message", ownerBlock: this, direction: FlowGraphConnectionPointDirection.Input }),
        ];

        this._outputs = [new FlowGraphConnectionPoint({ name: "flowOut", ownerBlock: this, direction: FlowGraphConnectionPointDirection.Output })];
    }

    public executeFlow(params: IFlowExecutionParameters): void {
        const messageInput = this._findInputByName("message")!;

        console.log(messageInput.getValue());

        const flowOutput = this._findOutputByName("flowOut")!;
        params.onActivateConnectionObservable.notifyObservers(flowOutput);
    }
}
