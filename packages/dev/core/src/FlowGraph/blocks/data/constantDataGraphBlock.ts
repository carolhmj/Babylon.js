import { FlowGraphBlock } from "../../flowGraphBlock";
import { FlowGraphConnectionPoint, FlowGraphConnectionPointDirection } from "../../flowGraphConnectionPoint";
import type { IDataBlock } from "../../iDataBlock";

/**
 * @experimental
 */
export interface IConstantValueDataBlockConstructionParameters {
    value: any;
}

/**
 * @experimental
 */
export class ConstantDataGraphBlock extends FlowGraphBlock implements IDataBlock {
    private _value: any;
    constructor(params: IConstantValueDataBlockConstructionParameters) {
        super({ name: "ConstantValue" });
        this._value = params.value;

        this._outputs = [new FlowGraphConnectionPoint({ name: "value", ownerBlock: this, direction: FlowGraphConnectionPointDirection.Output })];
    }
    getValue(): any {
        return this._value;
    }
}
