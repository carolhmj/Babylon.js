import type { FlowGraphConnectionPoint } from "./flowGraphConnectionPoint";

/**
 * @experimental
 */
export interface IFlowGraphBlockConstructorParameters {
    name: string;
}
/**
 * @experimental
 */
export abstract class FlowGraphBlock {
    private _name: string;
    protected _inputs: Array<FlowGraphConnectionPoint> = [];
    protected _outputs: Array<FlowGraphConnectionPoint> = [];

    constructor(params: IFlowGraphBlockConstructorParameters) {
        this._name = params.name;
    }

    public get name(): string {
        return this._name;
    }

    protected _findInputByName(name: string): FlowGraphConnectionPoint | undefined {
        return this._inputs.find((input) => input.name === name);
    }

    protected _findOutputByName(name: string): FlowGraphConnectionPoint | undefined {
        return this._outputs.find((output) => output.name === name);
    }

    /**
     * connects an output of this block to an input of another block
     * @param other
     * @param thisOutputName
     * @param otherInputName
     */
    public connect(other: FlowGraphBlock, thisOutputName: string, otherInputName: string) {
        const thisOutput = this._findOutputByName(thisOutputName);
        const otherInput = other._findInputByName(otherInputName);
        if (thisOutput && otherInput) {
            thisOutput.connect(otherInput);
            otherInput.connect(thisOutput);
        } else {
            throw new Error(`Couldnt find output ${thisOutputName} or input ${otherInputName}`);
        }
    }

    public setDefaultValue(inputName: string, value: any) {
        const input = this._findInputByName(inputName);
        if (input) {
            input.setDefaultValue(value);
        } else {
            throw new Error("Couldnt find input");
        }
    }
}
