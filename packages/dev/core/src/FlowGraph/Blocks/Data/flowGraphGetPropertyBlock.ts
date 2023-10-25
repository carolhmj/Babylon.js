import { RegisterClass } from "core/Misc";
import type { IFlowGraphBlockConfiguration } from "../../flowGraphBlock";
import { FlowGraphBlock } from "../../flowGraphBlock";
import type { FlowGraphContext } from "../../flowGraphContext";
import type { FlowGraphDataConnection } from "../../flowGraphDataConnection";
import { RichTypeAny, RichTypeString } from "../../flowGraphRichTypes";

const PROPERTY_SEPARATORS = "./";

export class FlowGraphGetPropertyBlock<TargetT, ValueT> extends FlowGraphBlock {
    public readonly target: FlowGraphDataConnection<TargetT>;

    public readonly property: FlowGraphDataConnection<string>;

    public readonly output: FlowGraphDataConnection<ValueT>;

    public constructor(config: IFlowGraphBlockConfiguration) {
        super(config);

        this.target = this._registerDataInput("target", RichTypeAny);
        this.property = this._registerDataInput("property", RichTypeString);
        this.output = this._registerDataOutput("output", RichTypeAny);
    }

    private _getProperty(target: any, property: string): any {
        const splitProp = property.split(PROPERTY_SEPARATORS);

        let currentTarget = target;
        for (let i = 0; i < splitProp.length - 1; i++) {
            currentTarget = currentTarget[splitProp[i]];
        }

        return currentTarget[splitProp[splitProp.length - 1]];
    }

    public _updateOutputs(_context: FlowGraphContext): void {
        const target = this.target.getValue(_context);
        const property = this.property.getValue(_context);

        if (target !== undefined) {
            const value = this._getProperty(target, property);
            this.output.setValue(value, _context);
        } else {
            throw new Error("Invalid target.");
        }
    }

    public getClassName(): string {
        return "FGGetPropertyBlock";
    }
}
RegisterClass("FGGetPropertyBlock", FlowGraphGetPropertyBlock);
