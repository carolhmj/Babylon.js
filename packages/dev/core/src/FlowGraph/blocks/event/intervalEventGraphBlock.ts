import { FlowGraphBlock } from "../../flowGraphBlock";
import { FlowGraphConnectionPoint, FlowGraphConnectionPointDirection } from "../../flowGraphConnectionPoint";
import type { IDataBlock } from "../../iDataBlock";
import type { IEventBlock } from "../../iEventBlock";
import type { EventCallback } from "../../types";

export interface IIntervalEventGraphBlockConstructionParameters {
    interval: number;
}
/**
 * @experimental
 */
export class IntervalEventGraphBlock extends FlowGraphBlock implements IEventBlock, IDataBlock {
    private _interval: number;
    private _activationCount = 0;

    constructor(params: IIntervalEventGraphBlockConstructionParameters) {
        super({ name: "IntervalEvent" });
        this._interval = params.interval;

        this._outputs = [
            new FlowGraphConnectionPoint({ name: "flowOut", ownerBlock: this, direction: FlowGraphConnectionPointDirection.Output }),
            new FlowGraphConnectionPoint({ name: "activationCount", ownerBlock: this, direction: FlowGraphConnectionPointDirection.Output }),
        ];
    }

    private _execute(startedCallback: EventCallback) {
        console.log("on execute");
        const flowOutput = this._findOutputByName("flowOut")!;
        startedCallback({ activatedConnection: flowOutput });
    }

    public start(startedCallback: EventCallback) {
        setTimeout(this._execute.bind(this, startedCallback), this._interval);
    }

    public getValue() {
        return this._activationCount;
    }
}
