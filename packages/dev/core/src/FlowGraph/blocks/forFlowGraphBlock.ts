import { FlowGraphBlock } from "../flowGraphBlock";
import { FlowGraphConnectionPoint, FlowGraphConnectionPointDirection } from "../flowGraphConnectionPoint";
import type { IFlowBlock, IFlowExecutionParameters } from "../iFlowBlock";
import type { IDataBlock } from "../iDataBlock";
import { FlowGraphQueue } from "../flowGraphQueue";

export interface ForFlowGraphBlockConstructorParameters {}
/**
 * @experimental
 * The for flow graph block executes an action
 * in a loop
 */
export class ForFlowGraphBlock extends FlowGraphBlock implements IFlowBlock, IDataBlock {
    private _currentIndex = 0;
    private _startIndex = 0;
    private _endIndex = 0;

    constructor(params: ForFlowGraphBlockConstructorParameters) {
        super({ name: "ForLoop" });

        this._inputs = [
            new FlowGraphConnectionPoint({ name: "flowIn", ownerBlock: this, direction: FlowGraphConnectionPointDirection.Input }),
            new FlowGraphConnectionPoint({ name: "startIndex", ownerBlock: this, direction: FlowGraphConnectionPointDirection.Input }),
            new FlowGraphConnectionPoint({ name: "endIndex", ownerBlock: this, direction: FlowGraphConnectionPointDirection.Input }),
        ];

        this._outputs = [
            new FlowGraphConnectionPoint({ name: "loopBody", ownerBlock: this, direction: FlowGraphConnectionPointDirection.Output }),
            new FlowGraphConnectionPoint({ name: "loopDone", ownerBlock: this, direction: FlowGraphConnectionPointDirection.Output }),
            new FlowGraphConnectionPoint({ name: "index", ownerBlock: this, direction: FlowGraphConnectionPointDirection.Output }),
        ];
    }
    private _executeSingleIteration(params: IFlowExecutionParameters) {
        const queue = new FlowGraphQueue({});
        const flowToActivate = this._currentIndex >= this._endIndex ? this._findOutputByName("loopDone")! : this._findOutputByName("loopBody")!;
        if (this._currentIndex < this._endIndex) {
            queue._onExecutionDoneObservable.addOnce(() => {
                this._currentIndex++;
                this._executeSingleIteration(params);
            });
        }
        queue.activateFlow(flowToActivate);
        queue.executeNext();
    }
    executeFlow(params: IFlowExecutionParameters): void {
        // Request values of start and end indexes
        const startIndexInput = this._findInputByName("startIndex")!;
        const endIndexInput = this._findInputByName("endIndex")!;
        this._startIndex = startIndexInput.getValue();
        this._endIndex = endIndexInput.getValue();
        this._currentIndex = this._startIndex;

        this._executeSingleIteration(params);
    }
    getValue(): any {
        return this._currentIndex;
    }
}
