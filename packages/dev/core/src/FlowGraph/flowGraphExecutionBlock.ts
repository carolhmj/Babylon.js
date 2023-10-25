import type { Nullable } from "../types";
import type { IFlowGraphBlockConfiguration } from "./flowGraphBlock";
import { FlowGraphBlock } from "./flowGraphBlock";
import type { FlowGraphConnection } from "./flowGraphConnection";
import { FlowGraphConnectionType } from "./flowGraphConnection";
import type { FlowGraphContext } from "./flowGraphContext";
import { FlowGraphSignalConnection } from "./flowGraphSignalConnection";

/**
 * @experimental
 * A block that executes some action. Always has an input signal (which is not used by event blocks).
 * Can have one or more output signals.
 */
export abstract class FlowGraphExecutionBlock extends FlowGraphBlock {
    /**
     * Input connection: The input signal of the block.
     */
    public readonly in: FlowGraphSignalConnection;

    public signalInputs: FlowGraphSignalConnection[];
    public signalOutputs: FlowGraphSignalConnection[];

    protected constructor(config?: IFlowGraphBlockConfiguration) {
        super(config);
        this.in = this._registerSignalInput("in");
    }

    public configure() {
        super.configure();
        this.signalInputs = [];
        this.signalOutputs = [];
    }

    /**
     * @internal
     * Executes the flow graph execution block.
     */
    public abstract _execute(context: FlowGraphContext, callingSignal: FlowGraphSignalConnection): void;

    protected _registerSignalInput(name: string): FlowGraphSignalConnection {
        const input = new FlowGraphSignalConnection(name, FlowGraphConnectionType.Input, this);
        this.signalInputs.push(input);
        return input;
    }

    protected _registerSignalOutput(name: string): FlowGraphSignalConnection {
        const output = new FlowGraphSignalConnection(name, FlowGraphConnectionType.Output, this);
        this.signalOutputs.push(output);
        return output;
    }

    public serialize(serializationObject: any = {}) {
        super.serialize(serializationObject);
        serializationObject.signalInputs = [];
        serializationObject.signalOutputs = [];
        for (const input of this.signalInputs) {
            const serializedInput: any = {};
            input.serialize(serializedInput);
            serializationObject.signalInputs.push(serializedInput);
        }
        for (const output of this.signalOutputs) {
            const serializedOutput: any = {};
            output.serialize(serializedOutput);
            serializationObject.signalOutputs.push(serializedOutput);
        }
    }

    public getClassName(): string {
        return "FGExecutionBlock";
    }

    public static Parse(serializationObject: any = {}) {
        const block = FlowGraphBlock.Parse(serializationObject) as FlowGraphExecutionBlock;
        for (let i = 0; i < serializationObject.signalInputs.length; i++) {
            block.signalInputs[i].deserialize(serializationObject.signalInputs[i]);
        }
        for (let i = 0; i < serializationObject.signalOutputs.length; i++) {
            block.signalOutputs[i].deserialize(serializationObject.signalOutputs[i]);
        }
        return block;
    }

    public findConnectionByName(name: string): Nullable<FlowGraphConnection<any, any>> {
        const superResult = super.findConnectionByName(name);
        if (superResult !== null) {
            return superResult;
        }
        for (const signalIn of this.signalInputs) {
            if (signalIn.name === name) {
                return signalIn;
            }
        }
        for (const signalOut of this.signalOutputs) {
            if (signalOut.name === name) {
                return signalOut;
            }
        }
        return null;
    }
}
