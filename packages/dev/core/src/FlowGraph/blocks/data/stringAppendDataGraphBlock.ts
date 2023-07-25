import { FlowGraphBlock } from "../../flowGraphBlock";
import { FlowGraphConnectionPoint, FlowGraphConnectionPointDirection } from "../../flowGraphConnectionPoint";
import type { IDataBlock } from "../../iDataBlock";

/**
 * @experimental
 */
export class StringAppendDataGraphBlock extends FlowGraphBlock implements IDataBlock {
    constructor() {
        super({ name: "StringAppend" });

        this._inputs = [
            new FlowGraphConnectionPoint({ name: "stringA", ownerBlock: this, direction: FlowGraphConnectionPointDirection.Input }),
            new FlowGraphConnectionPoint({ name: "stringB", ownerBlock: this, direction: FlowGraphConnectionPointDirection.Input }),
        ];

        this._outputs = [new FlowGraphConnectionPoint({ name: "result", ownerBlock: this, direction: FlowGraphConnectionPointDirection.Output })];
    }
    addInput(inputName: string) {
        this._inputs.push(new FlowGraphConnectionPoint({ name: inputName, ownerBlock: this, direction: FlowGraphConnectionPointDirection.Input }));
    }
    getValue() {
        let result = "";
        for (let i = 0; i < this._inputs.length; i++) {
            const input = this._inputs[i];
            result += input.getValue();
        }
        return result;
    }
}
