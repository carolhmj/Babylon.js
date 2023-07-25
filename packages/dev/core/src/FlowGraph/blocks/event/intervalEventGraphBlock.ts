import { FlowGraphBlock } from "../../flowGraphBlock";
import { FlowGraphConnectionPoint, FlowGraphConnectionPointDirection } from "../../flowGraphConnectionPoint";
import type { IEventBlock } from "../../iEventBlock";
import type { EventCallback } from "../../types";

/**
 * @experimental
 */
export interface IIntervalEventGraphBlockConstructionParameters {
    interval: number;
}
/**
 * @experimental
 */
export class IntervalEventGraphBlock extends FlowGraphBlock implements IEventBlock {
    private _interval: number;

    constructor(params: IIntervalEventGraphBlockConstructionParameters) {
        super({ name: "IntervalEvent" });
        this._interval = params.interval;

        this._outputs = [new FlowGraphConnectionPoint({ name: "flowOut", ownerBlock: this, direction: FlowGraphConnectionPointDirection.Output })];
    }

    private _execute(startedCallback: EventCallback) {
        const flowOutput = this._findOutputByName("flowOut")!;
        startedCallback({ activatedConnection: flowOutput });
    }

    public start(startedCallback: EventCallback) {
        setTimeout(this._execute.bind(this, startedCallback), this._interval);
    }
}
