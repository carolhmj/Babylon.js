import type { IFlowGraphBlockConfiguration } from "../../../flowGraphBlock";
import type { FlowGraphContext } from "../../../flowGraphContext";
import { FlowGraphExecutionBlock } from "../../../flowGraphExecutionBlock";
import type { FlowGraphSignalConnection } from "../../../flowGraphSignalConnection";

export interface IFlowGraphSequenceBlockConfiguration extends IFlowGraphBlockConfiguration {
    numberOutputFlows: number;
}

export class FlowGraphSequenceBlock extends FlowGraphExecutionBlock {
    public outFlows: FlowGraphSignalConnection[];

    constructor(public config: IFlowGraphSequenceBlockConfiguration) {
        super(config);
    }

    public configure(): void {
        super.configure();
        this.outFlows = [];
        for (let i = 0; i < this.config.numberOutputFlows; i++) {
            this.outFlows.push(this._registerSignalOutput(`out${i}`));
        }
    }

    public _execute(context: FlowGraphContext) {
        const currentIndex = context._getExecutionVariable(this, "currentIndex") ?? -1;
        let nextIndex = currentIndex + 1;
        if (nextIndex >= this.config.numberOutputFlows) {
            nextIndex = 0;
        }

        context._setExecutionVariable(this, "currentIndex", nextIndex);
        this.outFlows[nextIndex]._activateSignal(context);
    }
}
