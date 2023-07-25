import { FlowGraphQueue } from "./flowGraphQueue";
import type { IEventBlock } from "./iEventBlock";
import { isFlowBlock } from "./iFlowBlock";

/**
 * @experimental
 */
export class FlowGraph {
    private _eventBlocks: Array<IEventBlock> = [];

    public addEventBlock(block: IEventBlock) {
        this._eventBlocks.push(block);
    }

    public start() {
        this._eventBlocks.forEach((eventBlock) => {
            eventBlock.start((eventParams) => {
                const queue = new FlowGraphQueue();
                queue.activateFlow(eventParams.activatedConnection);
                queue.executeNext();
            });
        });
    }
}
