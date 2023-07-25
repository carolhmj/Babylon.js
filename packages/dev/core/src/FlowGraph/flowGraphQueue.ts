import { Observable } from "core/Misc/observable";
import { isFlowBlock, type IFlowBlock } from "./iFlowBlock";
import type { FlowGraphConnectionPoint } from "./flowGraphConnectionPoint";

// let count = 0;

export interface IFlowGraphQueueConstructorParams {}
/**
 * @experimental
 * The Flow Graph queue execute the flow graph blocks events in sequential order.
 */
export class FlowGraphQueue {
    // private _id: number;
    private _blocks: Array<IFlowBlock> = [];
    public _onExecutionDoneObservable: Observable<void>;
    private _onActivateFlowObservable: Observable<FlowGraphConnectionPoint>;

    constructor(params: IFlowGraphQueueConstructorParams) {
        // this._id = count++;
        this._onExecutionDoneObservable = new Observable<void>();
        this._onActivateFlowObservable = new Observable<FlowGraphConnectionPoint>();
        this._onActivateFlowObservable.add((connectionPoint) => {
            this.activateFlow(connectionPoint);
        });
    }

    public pushBlock(block: IFlowBlock) {
        this._blocks.push(block);
    }

    public activateFlow(connectionPoint: FlowGraphConnectionPoint) {
        const downstreamFlowBlock = connectionPoint.connectedPoint?.ownerBlock;
        if (downstreamFlowBlock && isFlowBlock(downstreamFlowBlock)) {
            this._blocks.push(downstreamFlowBlock);
        }
    }

    public executeNext() {
        const block = this._blocks.shift();
        if (block) {
            block.executeFlow({ onExecutionDoneObservable: this._onExecutionDoneObservable, onActivateConnectionObservable: this._onActivateFlowObservable });
            this.executeNext();
        } else {
            this._onExecutionDoneObservable.notifyObservers();
        }
    }
}
