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
                const queue = new FlowGraphQueue({});
                const connectedBlock = eventParams.activatedConnection.connectedPoint?.ownerBlock;
                if (!connectedBlock || !isFlowBlock(connectedBlock)) {
                    throw new Error("Cannot find connected block");
                }
                queue.pushBlock(connectedBlock);
                queue.executeNext();
            });
        });
    }
}
