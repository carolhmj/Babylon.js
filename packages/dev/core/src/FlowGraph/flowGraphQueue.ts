import { Observable } from "core/Misc/observable";
import { isFlowBlock, type IFlowBlock } from "./iFlowBlock";
import type { FlowGraphConnectionPoint } from "./flowGraphConnectionPoint";

/**
 * @experimental
 * The Flow Graph queue execute the flow graph blocks events in sequential order.
 */
export class FlowGraphQueue {
    private _blocks: Array<IFlowBlock> = [];
    private _onExecutionDoneObservable: Observable<void>;
    private _onActivateFlowObservable: Observable<FlowGraphConnectionPoint>;

    /**
     * @experimental
     */
    constructor() {
        this._onExecutionDoneObservable = new Observable<void>();
        this._onActivateFlowObservable = new Observable<FlowGraphConnectionPoint>();
        this._onActivateFlowObservable.add((connectionPoint) => {
            this.activateFlow(connectionPoint);
        });
    }

    /**
     * @experimental
     * @param callback
     */
    public listenToExecutionDone(callback: () => void) {
        this._onExecutionDoneObservable.addOnce(callback);
    }

    /**
     * @experimental
     * @param connectionPoint
     */
    public activateFlow(connectionPoint: FlowGraphConnectionPoint) {
        const downstreamFlowBlock = connectionPoint.connectedPoint?.ownerBlock;
        if (downstreamFlowBlock && isFlowBlock(downstreamFlowBlock)) {
            this._blocks.push(downstreamFlowBlock);
        }
    }

    /**
     * @experimental
     */
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
